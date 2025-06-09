import express from 'express';
import ExamController from '../controllers/exam.controller';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Adjust destination as needed

// CREATE Exam
router.post('/exams', ExamController.create);

// GET All Exams
router.get('/exams', ExamController.index);

// GET Single Exam
router.get('/exams/:id', ExamController.show);

// UPDATE Exam
router.put('/exams/:id', ExamController.update);

// DELETE Exam
router.delete('/exams/:id', ExamController.destroy);

// VALIDATE Exam Access
router.post('/exams/validate-access', ExamController.validateExamAccess);

// IMPORT Students (CSV or JSON array)
router.post('/exams/import-students', upload.single('file'), (req, res) => {
  const examController = new ExamController(); // Since importStudents is not static
  examController.importStudents(req, res);
});

export default router;
