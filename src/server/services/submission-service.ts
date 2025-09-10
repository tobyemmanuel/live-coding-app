import Exam from '../models/exam';
import question from '../models/question';
import submission from '../models/submission';
import ExamSubmission from '../models/exam_submissions';
import { v4 as uuidv4 } from 'uuid';

class SubmissionService {
  // Submit entire exam answers and compute score
  async submitExam(params: { exam_id: string; user_email: string; answers: Record<string, any>; user_id: string; }) {
    const { exam_id, user_email, answers, user_id } = params;

    if (!user_email) {
      return { status: 'error', code: 400, message: 'User email is required.' };
    }

    if (!exam_id || !answers || typeof answers !== 'object') {
      return { status: 'error', code: 400, message: 'exam_id and answers are required.' };
    }

    const foundExam = await Exam.findByPk(exam_id);
    if (!foundExam) {
      return { status: 'error', code: 404, message: 'Exam not found.' };
    }

    const questions = await question.findAll({
      where: { exam_id },
      attributes: ['id', 'type', 'answer', 'max_score'],
    });

    let totalScore = 0;

    for (const q of questions as any[]) {
      const submittedAnswer = answers[q.id];
      if (q.type === 'mcq') {
        const a = (submittedAnswer ?? '').toString().toLowerCase().trim();
        const b = (q.answer ?? '').toString().toLowerCase().trim();
        if (a && b && a === b) totalScore += q.max_score || 0;
      }
      // Other types (textbox/rating/coding/media) could be auto/peer graded separately
    }

    // Upsert overall submission record per user and exam
    const [overall, created] = await (submission as any).findOrCreate({
      where: { exam_id, user_id },
      defaults: {
        id: uuidv4(),
        exam_id,
        user_id,
        score: totalScore,
        time_submitted: new Date(),
      },
    });

    if (!created) {
      await overall.update({ score: totalScore, time_submitted: new Date() });
    }

    return { status: 'success', score: totalScore };
  }

  // Below methods target per-question submission records if needed by routes
  async getStudentSubmissions(params: { exam_id: string; student_code: string }) {
    const { exam_id, student_code } = params;
    const submissions = await ExamSubmission.findAll({ where: { exam_id, student_code } });
    return { status: 'success', submissions };
  }

  async getSubmissionForQuestion(params: { exam_id: string; student_code: string; question_id: string }) {
    const { exam_id, student_code, question_id } = params;
    const submissionRecord = await ExamSubmission.findOne({ where: { exam_id, student_code, question_id } });
    if (!submissionRecord) return { status: 'error', code: 404, message: 'No submission found for question.' };
    return { status: 'success', submission: submissionRecord };
  }
}

const submissionService = new SubmissionService();
export default submissionService;
