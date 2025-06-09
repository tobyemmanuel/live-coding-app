import { Request, Response } from 'express';
import Submission from '../models/submission';
import Exam from '../models/exam';
import question from '../models/question';
import { autoGradeCode } from '../utilis/auto-grade';


export const submitAnswer = async (req, res) => {
    const { exam_id, question_id, student_code, answer, code } = req.body;

    if (!exam_id || !question_id || !student_code || !answer || !code) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const questions = await question.findByPk(question_id);
    if (!questions) return res.status(404).json({ message: 'Invalid question' });

    let score = 0;
    let test_results = [];

    if (questions.type === 'coding') {
        const tests = JSON.parse(questions.tests || '[]');
        const grading = autoGradeCode(code, tests);
        score = grading.score;
        test_results = grading.results;
    } 

    const [submission, created] = await Submission.upsert({
        exam_id,
        question_id,
        student_code,
        answer,
        code,
        test_results,
        score
    }, { returning: true });

    res.json({
        message: created ? 'Submission created' : 'Submission updated',
        data: submission
    });
};

export const getStudentSubmissions = async (req: Request, res: Response) => {
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

export const getSubmissionForQuestion = async (req: Request, res: Response) => {
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
