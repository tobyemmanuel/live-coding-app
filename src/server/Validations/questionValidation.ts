import { body } from 'express-validator';

export const createQuestionsValidator = [
    body('questions')
        .isArray({ min: 1 })
        .withMessage('Questions must be a non-empty array'),

    body('questions.*.exam_id')
        .notEmpty()
        .withMessage('exam_id is required'),

    body('questions.*.type')
        .notEmpty()
        .withMessage('type is required'),

    body('questions.*.max_score')
        .isNumeric()
        .withMessage('max_score must be a number'),

    body('questions.*.content')
        .notEmpty()
        .withMessage('content is required'),

    body('questions.*.answer')
        .notEmpty()
        .withMessage('answer is required'),

    // Optional fields
    body('questions.*.mediaUrl')
        .optional()
        .isURL()
        .withMessage('mediaUrl must be a valid URL'),

    body('questions.*.files')
        .optional()
        .isArray()
        .withMessage('files must be an array'),

    body('questions.*.options')
        .optional()
        .isArray()
        .withMessage('options must be an array'),
];
export const getQuestionsByExamValidator = [
    body('exam_id')
        .notEmpty()
        .withMessage('exam_id is required')
        .isUUID()
        .withMessage('exam_id must be a valid UUID'),
];
export const getSingleQuestionValidator = [
    body('id')
        .notEmpty()
        .withMessage('Question ID is required')
        .isUUID()
        .withMessage('Question ID must be a valid UUID'),
];
