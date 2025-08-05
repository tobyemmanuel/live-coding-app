import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Exam from '../models/exam';
import user from '../models/user';
import antiCheat from '../models/anti-cheat';
import ExamCredentials from '../models/exam_credentials';
import { sendEmail } from '../utilis/email';
import anti_cheat from '../models/anti-cheat';

class AntiCheatController {
  // ✅ Create Anti-Cheat Record
  static async create(req: Request, res: Response) {
    const { exam_id, description } = req.body;
    const user = req.user;



    try {
      const newAntiCheat = await antiCheat.create({
        id: uuidv4(),
        exam_id,
        user_id: user.id,
        description: description,
      });

      res.status(201).json({ success: true, antiCheat: newAntiCheat });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Failed to create anti-cheat record' });
    }
  }

  // ✅ Get Anti-Cheat Records for an Exam
  static async getByExam(req: Request, res: Response) {
    const { exam_id } = req.params;

    try {
      const records = await antiCheat.findAll({ where: { exam_id } });

      res.status(200).json({ success: true, records });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Failed to retrieve anti-cheat records' });
    }
  }
  async getbyUserId(userId: string, res: Response) {
    try {

      const cheat = await anti_cheat.findByPk(userId);

      if (!cheat) {
        res.status(404).json({ success: false, message: 'User not found' });
      }

      res.status(200).json
        ({ success: true, message: 'USer found', data: cheat });
    } catch (error) {
      console.error('Error sending exam credentials:', error);
      res.status(400).json({ success: false, message: 'Failed to send exam credentials' });
    }
  }
}
export default AntiCheatController;