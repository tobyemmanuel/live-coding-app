import express from 'express';
import QuestionController from '../controllers/question-controller';
import { protectUser, authorize } from '../middleware/authMiddleware';

const question = express.Router();
question.post('/questions', QuestionController.createQuestion);
question.get('/questions/exam/:exam_id',protectUser,  QuestionController.getQuestionsByExam);
question.get('/questions/:id',protectUser, authorize('super_admin','admin','instructor'), QuestionController.getSingleQuestion);
question.put('/questions/:id',protectUser, authorize('super_admin','admin','instructor'), QuestionController.updateQuestion);
question.delete('/questions/:id',protectUser, authorize('super_admin','admin','instructor'), QuestionController.deleteQuestion);

export default question;
