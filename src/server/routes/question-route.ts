import express from 'express';
import QuestionController from '../controllers/question-controller';

const question = express.Router();
question.post('/questions', QuestionController.createQuestion);
question.get('/questions/exam/:exam_id', QuestionController.getQuestionsByExam);
question.get('/questions/:id', QuestionController.getSingleQuestion);
question.put('/questions/:id', QuestionController.updateQuestion);
question.delete('/questions/:id', QuestionController.deleteQuestion);

export default question;
