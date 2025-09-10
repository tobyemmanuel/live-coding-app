import { Request, Response } from 'express';
import examService from '../services/exam-service';
import { success, fail } from '../utilis/response';

class ExamController {
  static async create(req: Request, res: Response) {
    try {
      const result = await examService.create(req.body);
      if (result.status === 'success') {
        return success(res, { exam: result.exam }, 'Exam created', 201);
      }
      return fail(res, result.message || 'Failed to create exam', 400);
    } catch (err) {
      console.error('Error creating exam:', err);
      return fail(res, 'Failed to create exam', 500);
    }
  }

  static async schedule(req: Request, res: Response) {
    try {
      const { exam_id, group_id } = req.body;
      const result = await examService.schedule({ exam_id, group_id });
      if (result.status === 'success') {
        return success(res, undefined, result.message, 200);
      }
      const status = result.message === 'Exam not found' ? 404 : 400;
      return fail(res, result.message || 'Failed to schedule exam', status);
    } catch (error: any) {
      console.error('Error scheduling exam:', error);
      return fail(res, 'Failed to schedule exam', 500);
    }
  }

  static async index(req: Request, res: Response) {
    try {
      const userId = (req.user as any).id;
      const result = await examService.index({ user_id: userId });
      if (result.status === 'success') {
        return success(res, { exams: result.exams }, 'Exams fetched', 200);
      }
      return fail(res, result.message || 'No exams found', 404);
    } catch (err) {
      console.error('Error fetching exams:', err);
      return fail(res, 'Failed to fetch exams', 500);
    }
  }

  static async show(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const result = await examService.show(id);
      if (result.status === 'success') {
        return success(res, { exam: result.exam }, 'Exam fetched', 200);
      }
      return fail(res, result.message || 'Exam not found', 404);
    } catch (err) {
      console.error('Error fetching exam:', err);
      return fail(res, 'Failed to get exam', 500);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await examService.update(id, req.body);
      if (result.status === 'success') {
        return success(res, { exam: result.exam }, 'Exam updated', 200);
      }
      return fail(res, result.message || 'Exam not found', 404);
    } catch (err) {
      console.error('Error updating exam:', err);
      return fail(res, 'Failed to update exam', 500);
    }
  }

  static async destroy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await examService.destroy(id);
      if (result.status === 'success') {
        return success(res, undefined, 'Exam deleted', 200);
      }
      return fail(res, result.message || 'Exam not found', 404);
    } catch (err) {
      console.error('Error deleting exam:', err);
      return fail(res, 'Failed to delete exam', 500);
    }
  }

  static async validateExamAccess(req: Request, res: Response) {
    try {
      const { exam_id, student_code } = req.body;
      const result: any = await examService.validateExamAccess({ exam_id, student_code });

      if (result.status === 'success') {
        return success(res, result, 'Access granted', 200);
      }

      const status = result.code || 400;
      return fail(res, result.message || 'Access denied', status);
    } catch (error: any) {
      console.error('Access validation error:', error);
      return fail(res, 'Internal server error', 500);
    }
  }
}

export default ExamController;
