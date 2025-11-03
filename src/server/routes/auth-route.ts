import { Router } from 'express';
import authController from '../controllers/auth-controller';
import { validated } from '../middleware/ValidationMiddleware';
import { registerValidation, loginValidation, forgotPasswordValidation, resetPasswordValidation, changePasswordValidation } from '../Validations/authValidation';

const auth = Router();



auth.post('/register', registerValidation, validated, authController.register);

auth.post('/login', loginValidation, validated, authController.login);
auth.post('/forgot-password', forgotPasswordValidation, validated, authController.forgotPassword);

auth.post('/reset-password/:token', resetPasswordValidation, validated, authController.resetPassword);

auth.post('/change-password', changePasswordValidation, validated, authController.changePassword);
auth.post('/logout', authController.logout);

export default auth;
