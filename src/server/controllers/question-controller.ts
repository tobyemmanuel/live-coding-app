import { Request, Response } from 'express';
import question from '../models/question';
import Exam from '../models/exam';
import question_category from '../models/question-category';

class QuestionController {
    async createQuestion(req: Request, res: Response) {
        const questions: any[] = req.body.questions;

        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ message: 'Questions array is required.' });
        }

        // Validate required fields for each question
        for (const [index, q] of questions.entries()) {
            const requiredFields = ['exam_id', 'type', 'max_score', 'content', 'question_category_id'];
            const missingFields = requiredFields.filter(field => !q[field]);
            if (missingFields.length > 0) {
                return res.status(400).json({
                    message: `Missing fields in question ${index + 1}: ${missingFields.join(', ')}`,
                });
            }
        }
        // Check if exam exists once
        const examId = questions[0].exam_id;
        const exam = await Exam.findByPk(examId);
        if (!exam) return res.status(404).json({ message: 'Exam not found.' });
        try {


            // Optionally check all used category IDs
            const categoryIds = [...new Set(questions.map(q => q.question_category_id))];
            const validCategories = await question_category.findAll({
                where: { id: categoryIds },
            });
            if (validCategories.length !== categoryIds.length) {
                return res.status(404).json({ message: 'One or more question categories not found.' });
            }

            // Prepare the question payloads
            const questionData = questions.map(q => ({
                exam_id: q.exam_id,
                type: q.type,
                max_score: q.max_score,
                mediaUrl: q.mediaUrl,
                files: q.files,
                content: q.content,
                question_category_id: q.question_category_id,
                option: q.options || [],
                answer: q.answer,
            }));

            // Bulk create all questions
            const createdQuestions = await question.bulkCreate(questionData);

            res.status(201).json({ message: `${createdQuestions.length} questions created successfully.`, questions: createdQuestions });
        } catch (error) {
            res.status(500).json({ message: 'Failed to create questions.', error });
        }
    };

    async getQuestionsByExam(req: Request, res: Response) {

        const { exam_id } = req.params;
        try {
            const questions = await question.findAll({ where: { exam_id } });
            res.status(200).json(questions);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching questions.', error });
        }
    };

    async getSingleQuestion(req: Request, res: Response) {
        const { id } = req.params;
        try {

            const questions = await question.findByPk(id);
            if (!questions) return res.status(404).json({ message: 'Question not found.' });
            res.status(200).json(questions);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching question.', error });
        }
    };

    async updateQuestion(req: Request, res: Response) {
        const { id } = req.params;
        const updates = req.body;
        try {
            const questions = await question.findByPk(id);
            if (!questions) return res.status(404).json({ message: 'Question not found.' });

            await questions.update({
                ...updates,
                option: updates.options || questions.option
            });

            res.status(200).json(questions);
        } catch (error) {
            res.status(500).json({ message: 'Failed to update question.', error });
        }
    };

    async deleteQuestion(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const questions = await question.findByPk(id);
            if (!questions) return res.status(404).json({ message: 'Question not found.' });

            await questions.destroy();
            res.status(200).json({ message: 'Question deleted successfully.' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete question.', error });
        }
    };

}

export default QuestionController; 
