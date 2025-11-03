import express from 'express';
import ExamController from '../controllers/exam-controller';
import { validated } from '../middleware/ValidationMiddleware';
import {
    createExamValidation,
    scheduleExamValidation,
    getExamsValidation,
    getSingleExamValidation,
    updateExamValidation,
    deleteExamValidation,
    validateExamAccessValidation,
} from '../Validations/examValidation';
import { authorize, protectUser } from '../middleware/authMiddleware';

const exam = express.Router();
exam.post('/exams', createExamValidation, validated, ExamController.create);
exam.get('/exams', protectUser, ExamController.index);
exam.get('/exams/:id', getSingleExamValidation, validated, protectUser, ExamController.show);
// exam.put('/exams/:id', ExamController.update);
exam.delete('/exams/:id', deleteExamValidation, validated, protectUser, authorize, ExamController.destroy);
exam.put('/exams/schedule', scheduleExamValidation, validated, protectUser, ExamController.schedule);

exam.post('/exams/validate-access', validateExamAccessValidation, validated, protectUser, ExamController.validateExamAccess);
 
export default exam;
