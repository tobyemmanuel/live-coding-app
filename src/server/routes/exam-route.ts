import express from 'express';
import ExamController from '../controllers/exam-controller';

const exam = express.Router();
exam.post('/exams', ExamController.create);
exam.get('/exams', ExamController.index);
exam.get('/exams/:id', ExamController.show);
// exam.put('/exams/:id', ExamController.update);
exam.delete('/exams/:id', ExamController.destroy);
exam.put('/exams/schedule', ExamController.schedule);

exam.post('/exams/validate-access', ExamController.validateExamAccess);

export default exam;
