
import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import user from '../models/user';
import role from '../models/role';
import organisation from '../models/organisation';
import { createUser } from '../utilis/userService';
class AuthController {
     async register(req: Request, res: Response, next: NextFunction) {
        const { fullname, email, password, role_id, organisation_id, phone_number } = req.body;

        if (!fullname || !email || !password || !organisation_id) {
            return res.status(400).json({ status: 'error', message: 'Please provide all required fields' });
        }

        try {
            const existing = await user.findOne({ where: { email } });
            if (existing) {
                return res.status(400).json({ status: 'failed', message: 'Email has already been used' });
            }

            const org = await organisation.findOne({ where: { id: organisation_id } });
            if (!org) {
                return res.status(400).json({ status: 'failed', message: 'Invalid organisation' });
            }

            // const hashedPassword = await bcrypt.hash(password, 10);

            const userData = {
                fullname,
                email,
                password: password,
                role_id: role_id || '1',
                organisation_id,
                phone_number,
            };

            const response = await createUser(userData);
            return res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }
     async getRoles(req: Request, res: Response, next: NextFunction) {
        try {
            const roles = await role.findAll();
            return res.status(200).json({ status: 'success', data: roles });
        } catch (error) {
            next(error);
        }
    }

     async login(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: 'error', message: 'Please provide email and password' });
        }

        const existingUser = await user.findOne({ where: { email } });
        if (!existingUser || !(await existingUser.comparePassword(password))) {
            return res.status(401).json({ status: 'error', message: 'Incorrect email or password' });
        }
        try {


            existingUser.lastLogin = new Date();
            await existingUser.save();

            const token = generateToken(existingUser.id);

            return res.status(200).json({
                status: 'success',
                data: {
                    user: existingUser.email,
                    token
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async forgotPassword(req: Request, res: Response, next: NextFunction) {
        const { email } = req.body;
        const c_user = await user.findOne({ where: { email } });

        if (!c_user) {
            return res.status(404).json({ status: 'error', message: 'No user found with that email' });
        }
        try {


            const resetToken = crypto.randomBytes(32).toString('hex');
            c_user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            c_user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

            await c_user.save();

            try {
                await sendResetPasswordEmail(c_user.email, resetToken);
                res.json({ status: 'success', message: 'Reset token sent to email' });
            } catch (emailError) {
                c_user.resetPasswordToken = null;
                c_user.resetPasswordExpires = null;
                await c_user.save();

                return res.status(500).json({ status: 'error', message: 'Error sending email. Please try again later.' });
            }
        } catch (error) {
            next(error);
        }
    }

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        const { token } = req.params;
        const { password } = req.body;
        try {
            const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
            const resetUser = await user.findOne({
                where: {
                    resetPasswordToken,
                    resetPasswordExpires: { [Op.gt]: Date.now() }
                }
            });

            if (!resetUser) {
                return res.status(400).json({ status: 'error', message: 'Token is invalid or has expired' });
            }

            resetUser.password = password;
            resetUser.resetPasswordToken = null;
            resetUser.resetPasswordExpires = null;
            await resetUser.save();

            const newToken = generateToken(resetUser.id);

            res.json({
                status: 'success',
                data: {
                    user: resetUser.email,
                    token: newToken
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async changePassword(req: Request, res: Response, next: NextFunction) {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user?.id;
        const currentUser = await user.findByPk(userId);

        if (!currentUser || !(await currentUser.comparePassword(currentPassword))) {
            return res.status(401).json({ status: 'error', message: 'Current password is incorrect' });
        }
        try {

            currentUser.password = newPassword;
            await currentUser.save();

            res.json({ status: 'success', message: 'Password updated successfully' });
        } catch (error) {
            next(error);
        }
    }

    async logout(req: Request, res: Response) {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(400).json({ status: "error", message: "Token not provided" });
        }
        try {
            let decoded: any;
            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET!);
            } catch (error) {
                return res.status(401).json({ status: "error", message: "Invalid or expired token" });
            }
            return res.status(200).json({
                status: "success",
                message: "User successfully logged out",
                userId: decoded.id,
            });
        } catch (error: any) {
            return res.status(500).json({
                status: "error",
                message: "Logout failed due to an internal error",
                error: error.message,
            });
        }
    }
}

// Export an instance of the controller
const authController = new AuthController();
export default authController;
