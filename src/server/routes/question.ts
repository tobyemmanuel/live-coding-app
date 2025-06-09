import { Router } from 'express';
import {
    createQuestion,
    getQuestionsByExam,
    getSingleQuestion,
    updateQuestion,
    deleteQuestion
} from '../controllers/question-controller.ts';

const question = Router();

// ✅ Bulk create multiple questions
question.post('/questions/bulk', createQuestion);

// 📄 Get all questions by exam ID
question.get('/questions/exam/:exam_id', getQuestionsByExam);

// 📄 Get a single question
question.get('/questions/:id', getSingleQuestion);

// ✏️ Update a question
question.put('/questions/:id', updateQuestion);

// ❌ Delete a question
question.delete('/questions/:id', deleteQuestion);

export default question;
