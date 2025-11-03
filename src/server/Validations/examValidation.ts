import { body, param } from 'express-validator';

export const createExamValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('instructor_id').isUUID().withMessage('Instructor ID must be a valid UUID'),
  body('organisation_id').isUUID().withMessage('Organisation ID must be a valid UUID'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  body('status').optional().isIn(['draft', 'scheduled', 'completed']).withMessage('Invalid exam status'),
];

export const scheduleExamValidation = [
  body('exam_id').isUUID().withMessage('Exam ID must be a valid UUID'),
  body('group_id').notEmpty().withMessage('Group ID is required'),
];

export const getExamsValidation = [
  body('user_id').isUUID().withMessage('User ID must be a valid UUID'),
];

export const getSingleExamValidation = [
  param('id').isUUID().withMessage('Exam ID must be a valid UUID'),
];

export const updateExamValidation = [
  param('id').isUUID().withMessage('Exam ID must be a valid UUID'),
  body('title').optional().isString(),
  body('duration').optional().isInt({ min: 1 }),
  body('status').optional().isIn(['draft', 'scheduled', 'completed']),
  body('instructor_id').optional().isUUID(),
  body('organisation_id').optional().isUUID(),
];

export const deleteExamValidation = [
  param('id').isUUID().withMessage('Exam ID must be a valid UUID'),
];

export const validateExamAccessValidation = [
  body('exam_id').isUUID().withMessage('Exam ID must be a valid UUID'),
  body('student_code').notEmpty().withMessage('Student code is required'),
];
