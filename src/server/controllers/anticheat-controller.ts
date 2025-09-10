import { Request, Response } from 'express';
import antiCheatService from '../services/anti-cheat-service';
import { success, fail } from '../utilis/response';

class AntiCheatController {
  // ✅ Create Anti-Cheat Record
  static async create(req: Request, res: Response) {
    const { exam_id, description } = req.body;
    const authUser = req.user;

    try {
      const newAntiCheat = await antiCheatService.createAntiCheatRecord({
        exam_id,
        user_id: authUser.id,
        description,
      });

      return success(res, { antiCheat: newAntiCheat }, 'Anti-cheat record created', 201);
    } catch (err) {
      console.error(err);
      return fail(res, 'Failed to create anti-cheat record', 500);
    }
  }

  // ✅ Get Anti-Cheat Records for an Exam
  static async getByExam(req: Request, res: Response) {
    const { exam_id } = req.params;

    try {
      const records = await antiCheatService.getRecordsByExam(exam_id);
      return success(res, { records });
    } catch (err) {
      console.error(err);
      return fail(res, 'Failed to retrieve anti-cheat records', 500);
    }
  }

  static async getByUser(req: Request, res: Response) {
    try {
      const authUser = req.user;
      const records = await antiCheatService.getRecordsByUser(authUser.id);
      return success(res, { records });
    } catch (error) {
      console.error('Error fetching user anti-cheat records:', error);
      return fail(res, 'Failed to fetch anti-cheat records', 400);
    }
  }
}
export default AntiCheatController;