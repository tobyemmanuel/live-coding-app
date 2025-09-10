import { Request, Response } from 'express';
import questionService from '../services/question-service';
import { success, fail } from '../utilis/response';

class QuestionController {
  async createQuestion(req: Request, res: Response) {
    const { questions, examId } = req.body;
    try {
      const result = await questionService.createMany({ examId, questions });
      if (result.status === 'success') {
        return success(res, { questions: result.questions }, `${result.questions.length} questions created successfully.`, 201);
      }
      return fail(res, result.message || 'Failed to create questions.', result.code || 400);
    } catch (error) {
      return fail(res, 'Failed to create questions.', 500);
    }
  }

  async getQuestionsByExam(req: Request, res: Response) {
    try {
      const { exam_id } = req.params;
      const result = await questionService.getByExam(exam_id);
      return success(res, { questions: result.questions }, 'Questions fetched', 200);
    } catch (error) {
      return fail(res, 'Error fetching questions.', 500);
    }
  }

  async getSingleQuestion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await questionService.getOne(id);
      if (result.status === 'success') return success(res, { question: result.question }, 'Question fetched', 200);
      return fail(res, result.message || 'Question not found.', result.code || 404);
    } catch (error) {
      return fail(res, 'Error fetching question.', 500);
    }
  }

  async updateQuestion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const result = await questionService.update(id, updates);
      if (result.status === 'success') return success(res, { question: result.question }, 'Question updated', 200);
      return fail(res, result.message || 'Question not found.', result.code || 404);
    } catch (error) {
      return fail(res, 'Failed to update question.', 500);
    }
  }

  async deleteQuestion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await questionService.destroy(id);
      if (result.status === 'success') return success(res, undefined, result.message, 200);
      return fail(res, result.message || 'Question not found.', result.code || 404);
    } catch (error) {
      return fail(res, 'Failed to delete question.', 500);
    }
  }
}

export default new QuestionController(); 
