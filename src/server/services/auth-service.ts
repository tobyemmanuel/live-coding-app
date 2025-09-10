import user from '../models/user';
import role from '../models/role';
import organisation from '../models/organisation';
import { Op } from 'sequelize';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { createUser, generateToken } from '../utilis/userService';

class AuthService {
  // Register new user (mirrors controller behavior and uses createUser util)
  async register(params: {
    fullname: string;
    email: string;
    password: string;
    role_id?: string | number;
    organisation_id: string;
    phone_number?: string;
  }) {
    const { fullname, email, password, role_id, organisation_id, phone_number } = params;

    const existing = await user.findOne({ where: { email } });
    if (existing) {
      return { status: 'failed', message: 'Email has already been used' };
    }

    const org = await organisation.findOne({ where: { id: organisation_id } });
    if (!org) {
      return { status: 'failed', message: 'Invalid organisation' };
    }

    let finalRoleId = role_id as any;
    if (!finalRoleId) {
      const defaultRole = await role.findOne({ where: { name: 'student' } });
      if (!defaultRole) {
        return { status: 'failed', message: 'Default role not found' };
      }
      finalRoleId = defaultRole.id as any;
    }

    const response = await createUser({
      fullname,
      email,
      password,
      role_id: finalRoleId as any,
      organisation_id,
      phone_number,
    });

    return response;
  }

  // Login user
  async login(params: { email: string; password: string; }) {
    const { email, password } = params;
    const existingUser = await user.findOne({ where: { email } });
    if (!existingUser || !(await existingUser.comparePassword(password))) {
      return { status: 'error', message: 'Incorrect email or password' };
    }

    existingUser.lastLogin = new Date();
    await existingUser.save();

    const token = generateToken(existingUser.id);
    return {
      status: 'success',
      data: {
        user: existingUser.email,
        token,
      },
    };
  }

  // Forgot password - generate reset token and send email
  async forgotPassword(params: { email: string }) {
    const { email } = params;
    const c_user = await user.findOne({ where: { email } });
    if (!c_user) {
      return { status: 'error', message: 'No user found with that email' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    c_user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    c_user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await c_user.save();

    // send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: c_user.email,
      subject: 'Password Reset',
      text: `You requested a password reset. Click the link to reset your password: ${resetUrl}. This link expires in 10 minutes.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return { status: 'success', message: 'Reset token sent to email' };
    } catch (emailError) {
      c_user.resetPasswordToken = null;
      c_user.resetPasswordExpires = null;
      await c_user.save();
      return { status: 'error', message: 'Error sending email. Please try again later.' };
    }
  }

  // Reset password using token
  async resetPassword(params: { token: string; password: string; }) {
    const { token, password } = params;

    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    const resetUser = await user.findOne({
      where: {
        resetPasswordToken,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!resetUser) {
      return { status: 'error', message: 'Token is invalid or has expired' };
    }

    resetUser.password = password; // Assuming model hook hashes password
    resetUser.resetPasswordToken = null;
    resetUser.resetPasswordExpires = null;
    await resetUser.save();

    const newToken = generateToken(resetUser.id);
    return {
      status: 'success',
      data: {
        user: resetUser.email,
        token: newToken,
      },
    };
  }

  // Change password for logged-in user
  async changePassword(params: { userId: string; currentPassword: string; newPassword: string; }) {
    const { userId, currentPassword, newPassword } = params;
    const currentUser = await user.findByPk(userId);
    if (!currentUser || !(await currentUser.comparePassword(currentPassword))) {
      return { status: 'error', message: 'Current password is incorrect' };
    }

    currentUser.password = newPassword; // Assuming hook hashes password
    await currentUser.save();

    return { status: 'success', message: 'Password updated successfully' };
  }

  // Logout - validate token format (no blacklist implemented)
  async logout(params: { token?: string }) {
    const { token } = params;
    if (!token) {
      return { status: 'error', message: 'Token not provided' };
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      return {
        status: 'success',
        message: 'User successfully logged out',
        userId: decoded?.id,
      } as any;
    } catch (_err) {
      return { status: 'error', message: 'Invalid or expired token' };
    }
  }
}

const authService = new AuthService();
export default authService;
