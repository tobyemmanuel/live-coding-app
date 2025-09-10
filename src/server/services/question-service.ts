import question from '../models/question';
import Exam from '../models/exam';

class QuestionService {
  async createMany(params: { examId: string; questions: any[] }) {
    const { examId, questions } = params;

    if (!Array.isArray(questions) || questions.length === 0) {
      return { status: 'error', code: 400, message: 'Questions array is required.' };
    }

    for (const [index, q] of questions.entries()) {
      const requiredFields = ['type', 'max_score', 'content'];
      const missingFields = requiredFields.filter((field) => !q[field]);
      if (missingFields.length > 0) {
        return {
          status: 'error',
          code: 400,
          message: `Missing fields in question ${index + 1}: ${missingFields.join(', ')}`,
        };
      }
    }

    const exam = await Exam.findByPk(examId);
    if (!exam) return { status: 'error', code: 404, message: 'Exam not found.' };

    const questionData = questions.map((q) => ({
      exam_id: examId,
      type: q.type,
      max_score: q.max_score,
      mediaUrl: q.mediaUrl,
      files: q.files,
      content: q.content,
      option: q.options || [],
      answer: q.answer,
    }));

    const createdQuestions = await question.bulkCreate(questionData);
    return { status: 'success', questions: createdQuestions };
  }

  async getByExam(exam_id: string) {
    const questions = await question.findAll({ where: { exam_id } });
    return { status: 'success', questions };
  }

  async getOne(id: string) {
    const q = await question.findByPk(id);
    if (!q) return { status: 'error', code: 404, message: 'Question not found.' };
    return { status: 'success', question: q };
  }

  async update(id: string, updates: any) {
    const q = await question.findByPk(id);
    if (!q) return { status: 'error', code: 404, message: 'Question not found.' };

    await q.update({ ...updates, option: updates.options || (q as any).option });
    return { status: 'success', question: q };
  }

  async destroy(id: string) {
    const q = await question.findByPk(id);
    if (!q) return { status: 'error', code: 404, message: 'Question not found.' };
    await q.destroy();
    return { status: 'success', message: 'Question deleted successfully.' };
  }
}

const questionService = new QuestionService();
export default questionService;
