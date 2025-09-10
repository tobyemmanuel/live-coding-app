import { v4 as uuidv4 } from 'uuid';
import antiCheat from '../models/anti-cheat';

class AntiCheatService {
  // Create an anti-cheat record
  async createAntiCheatRecord(params: {
    exam_id: string;
    user_id: string;
    description?: string;
  }) {
    const { exam_id, user_id, description = '' } = params;

    const record = await antiCheat.create({
      id: uuidv4(),
      exam_id,
      user_id,
      description,
    });

    return record;
  }

  // Fetch anti-cheat records by exam id
  async getRecordsByExam(exam_id: string) {
    const records = await antiCheat.findAll({ where: { exam_id } });
    return records;
  }

  // Fetch anti-cheat records by user id
  async getRecordsByUser(user_id: string) {
    const records = await antiCheat.findAll({ where: { user_id } });
    return records;
  }
}

const antiCheatService = new AntiCheatService();
export default antiCheatService;
