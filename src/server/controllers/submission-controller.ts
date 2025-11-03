import { Request, Response } from 'express';
import submissionService from '../services/submission-service';
import { success, fail } from '../utilis/response';

class submissionController {
  async submitExam(req: Request, res: Response) {
    try {
      const { exam_id, user_email, answers } = req.body;
      const result = await submissionService.submitExam({ exam_id, user_email, answers, user_id: req.user!.id });
      if (result.status === 'success') {
        return success(res, { score: result.score }, 'Exam submitted successfully.', 200);
      }
      return fail(res, result.message || 'Failed to submit exam.', result.code || 400);
    } catch (error: any) {
      console.error('Exam submission error:', error);
      return fail(res, 'Failed to submit exam.', 500);
    }
  }

  async getStudentSubmissions(req: Request, res: Response) {
    try {
      const { exam_id, student_code } = req.params;
      const result = await submissionService.getStudentSubmissions({ exam_id, student_code });
      return success(res, { submissions: result.submissions }, 'Submissions fetched', 200);
    } catch (error) {
      return fail(res, 'Error fetching submissions.', 500);
    }
  }

  async getSubmissionForQuestion(req: Request, res: Response) {
    try {
      const { exam_id, student_code, question_id } = req.params;
      const result = await submissionService.getSubmissionForQuestion({ exam_id, student_code, question_id });
      if (result.status === 'success') return success(res, { submission: result.submission }, 'Submission fetched', 200);
      return fail(res, result.message || 'No submission found for question.', result.code || 404);
    } catch (error) {
      return fail(res, 'Error fetching submission.', 500);
    }
  }
}
export default new submissionController();