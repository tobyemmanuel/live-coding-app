import { Router } from 'express';
import QuestionController from '../controllers/question-controller.ts';

const question = Router();

// ✅ Bulk create multiple questions
question.post('/questions/bulk', QuestionController.createQuestion);

// 📄 Get all questions by exam ID
question.get('/questions/exam/:exam_id', QuestionController.getQuestionsByExam);

// 📄 Get a single question
question.get('/questions/:id', QuestionController.getSingleQuestion);

// ✏️ Update a question
question.put('/questions/:id', QuestionController.updateQuestion);

// ❌ Delete a question
question.delete('/questions/:id', QuestionController.deleteQuestion);

export default question;
