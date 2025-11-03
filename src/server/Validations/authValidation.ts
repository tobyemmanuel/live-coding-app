import { body, param } from 'express-validator';

export const registerValidation = [
    body('fullname').isString().isLength({ min: 3, max: 30 }).withMessage('Full name must be 3–30 characters long'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('organisation_id').optional().isAlphanumeric().withMessage('Organisation is required'),
    body('role_id').optional().isInt().withMessage('Role must be a valid UUID'),
    body('phone_number').optional().isString(),
];

export const loginValidation = [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').notEmpty().withMessage('Password is required'),
];

export const forgotPasswordValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
];

export const resetPasswordValidation = [
    param('token').notEmpty().withMessage('Reset token is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

export const changePasswordValidation = [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
];
