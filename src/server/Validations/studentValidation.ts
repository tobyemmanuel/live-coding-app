import { body, param } from 'express-validator';

export const createGroupValidation = [
  body('name').notEmpty().withMessage('Group name is required'),
  body('instructor_id').isUUID().withMessage('Instructor ID must be a valid UUID'),
  body('organisation_id').isUUID().withMessage('Organisation ID must be a valid UUID'),
];

export const importStudentsValidation = [
  body('Users')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Users must be a non-empty array if provided in body'),
  body('Users.*.group_id')
    .if(body('Users').exists())
    .isUUID().withMessage('Each user must have a valid group_id'),
  body('Users.*.user_id')
    .if(body('Users').exists())
    .isUUID().withMessage('Each user must have a valid user_id'),
  body('Users.*.email')
    .if(body('Users').exists())
    .isEmail().withMessage('Each user must have a valid email'),
];

export const updateStudentValidation = [
  param('id').isUUID().withMessage('Student member ID must be a valid UUID'),
  body('group_id')
    .optional()
    .isUUID().withMessage('Group ID must be a valid UUID'),
  body('user_id')
    .optional()
    .isUUID().withMessage('User ID must be a valid UUID'),
  body('email')
    .optional()
    .isEmail().withMessage('Email must be valid'),
];
