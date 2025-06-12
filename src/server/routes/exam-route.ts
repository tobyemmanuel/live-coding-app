import express from 'express';
import ExamController from '../controllers/exam-controller';
// import multer from 'multer';

const exam = express.Router();
// const upload = multer({ dest: 'uploads/' }); // Adjust destination as needed

// CREATE Exam
exam.post('/exams', ExamController.create);

// GET All Exams
exam.get('/exams', ExamController.index);

// GET Single Exam
exam.get('/exams/:id', ExamController.show);

// UPDATE Exam
exam.put('/exams/:id', ExamController.update);

// DELETE Exam
exam.delete('/exams/:id', ExamController.destroy);

// VALIDATE Exam Access
exam.post('/exams/validate-access', ExamController.validateExamAccess);


export default exam;
