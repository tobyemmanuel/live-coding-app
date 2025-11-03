
import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth-service';
import { success, fail } from '../utilis/response';

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    const response = await authService.register(req.body);
    if (response.status === 'success') {
      return success(res, response.data, 'User registered', 201);
    }
    if (response.status === 'failed') {
      return fail(res, response.message || 'Registration failed', 400);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {

    const result = await authService.login({ email: req.body.email, password: req.body.password });
    if (result.status === 'success') return success(res, result.data, 'Login successful', 200);
    return fail(res, result.message || 'Incorrect email or password', 401);

  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.forgotPassword({ email: req.body.email });
      if (result.status === 'success') return success(res, undefined, 'Reset token sent to email', 200);
      const code = result.message?.includes('No user') ? 404 : 500;
      return fail(res, result.message || 'Failed to generate reset token', code);
    } catch (error) {
      return next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.resetPassword({ token: req.params.token, password: req.body.password });
      if (result.status === 'success') return success(res, result.data, 'Password reset successful', 200);
      return fail(res, result.message || 'Token is invalid or has expired', 400);
    } catch (error) {
      return next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.changePassword({ userId: req.user!.id, currentPassword: req.body.currentPassword, newPassword: req.body.newPassword });
      if (result.status === 'success') return success(res, undefined, 'Password updated successfully', 200);
      return fail(res, result.message || 'Current password is incorrect', 401);
    } catch (error) {
      return next(error);
    }
  }

  async logout(req: Request, res: Response) {
    const token = req.headers.authorization?.split(' ')[1];
    const result = await authService.logout({ token });
    if (result.status === 'success') return success(res, { userId: (result as any).userId }, 'Logged out', 200);
    const code = result.message === 'Token not provided' ? 400 : 401;
    return fail(res, result.message || 'Logout failed', code);
  }
}

const authController = new AuthController();
export default authController;
