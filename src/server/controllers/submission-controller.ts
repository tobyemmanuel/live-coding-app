import { Request, Response } from 'express';
import ExamSubmission from '../models/exam_submissions';
import Exam from '../models/exam';
import question from '../models/question';

class submissionController {


    async submitExam(req: Request, res: Response) {
        const { exam_id, user_email, answers } = req.body;

        if (!exam_id || !user_email || !answers || typeof answers !== 'object') {
            return res.status(400).json({ message: 'exam_id, user_email, and answers are required.' });
        }

        try {
            // 1. Check if exam exists
            const exam = await Exam.findByPk(exam_id);
            if (!exam) {
                return res.status(404).json({ message: 'Exam not found.' });
            }

            // 2. Get all questions for this exam
            const questions = await question.findAll({
                where: { exam_id },
                attributes: ['id', 'type', 'answer', 'max_score'],
            });

            // 3. Calculate total score
            let totalScore = 0;

            for (const question of questions) {
                const submittedAnswer = answers[question.id];

                if (
                    question.type === 'objective' &&
                    submittedAnswer?.toString().toLowerCase().trim() ===
                    question.answer.toString().toLowerCase().trim()
                ) {
                    totalScore += question.max_score;
                }
            }

            // 4. Check if already submitted
            const existing = await ExamSubmission.findOne({
                where: { exam_id, user_email },
            });
 
            // 5. Save or update submission
            const submission = await ExamSubmission.upsert({
                id: existing?.id || uuidv4(),
                exam_id,
                user_email,
                user_id: existing?.user_id || null,
                answers, // raw answers object (JSON)
                score: totalScore,
                submitted: true,
                submitted_at: new Date(),
            });

            return res.status(200).json({
                message: 'Exam submitted successfully.',
                score: totalScore,
            });
        } catch (error: any) {
            console.error('Exam submission error:', error);
            return res.status(500).json({
                message: 'Failed to submit exam.',
                error: error.message,
            });
        }
    };

    async getStudentSubmissions(req: Request, res: Response) {
        try {
            const { exam_id, student_code } = req.params;

            const submissions = await Submission.findAll({
                where: { exam_id, student_code },
            });

            res.status(200).json(submissions);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching submissions.', error });
        }
    };

    async getSubmissionForQuestion(req: Request, res: Response) {
        try {
            const { exam_id, student_code, question_id } = req.params;

            const submission = await Submission.findOne({
                where: { exam_id, student_code, question_id },
            });

            if (!submission) {
                return res.status(404).json({ message: 'No submission found for question.' });
            }

            res.status(200).json(submission);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching submission.', error });
        }
    };
}
export default new submissionController();