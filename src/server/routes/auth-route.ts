import { Router } from 'express';
import { body } from 'express-validator';
import authController from '../controllers/auth-controller';

const auth = Router();

const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['user', 'admin', 'moderator'])
    .withMessage('Invalid role specified'),
  body('organisation')
    .isLength({ min: 4, max: 4 })
    .withMessage('Pin must be exactly 4 characters long'),
];


const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const passwordValidation = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const changePasswordValidation = [
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('currentPassword')
    .notEmpty()
    .withMessage('Please enter your current password'),
];


auth.post('/register', registerValidation,authController.register);

auth.post('/login', authController.login);
auth.post('/forgot-password', authController.forgotPassword);

auth.post('/reset-password/:token', authController.resetPassword);

auth.post('/change-password', authController.changePassword);
auth.post('/logout', authController.logout);

export default auth;
