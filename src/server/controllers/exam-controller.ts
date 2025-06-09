
import { Request, Response, NextFunction } from 'express';
import exam from '../models/exam';
import exam_category from '../models/exam_category';
import question from '../models/question';

class ExamController {


    createExam(req: Request, res: Response, next: NextFunction) {
        const { title, description, categoryId } = req.body;
        if (!title || !description || !categoryId) {
            return res.status(400).json({
                status: 'failed',
                message: 'Title, description, and categoryId are required'
            });
        }
        exam.create({
            title,
            description,
            categoryId
        })
            .then((newExam) => {
                res.status(201).json(newExam);
            })
            .catch((error) => {
                next(error);
            });
    }
    getExams(req: Request, res: Response, next: NextFunction) {
        exam.findAll({
            include: [{
                model: exam_category,
                as: 'category'
            }]
        })
            .then((exams) => {
                res.status(200).json(exams);
            })
            .catch((error) => {
                next(error);
            });
    }
    getExamById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        exam.findByPk(id, {
            include: [{
                model: exam_category,
                as: 'category'
            }, {
                model: question,
                as: 'questions'
            }]
        })
            .then((examData) => {
                if (!examData) {
                    return res.status(404).json({
                        status: 'failed',
                        message: 'Exam not found'
                    });
                }
                res.status(200).json({ 
                    status: 'success',
                    data: examData
                });
            })
            .catch((error) => {
                next(error);
            });
    }
    updateExam(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { title, description, categoryId } = req.body;
        exam.findByPk(id)
            .then((examData) => {
                if (!examData) {
                    return res.status(404).json({
                        status: 'failed',
                        message: 'Exam not found'
                    });
                }
                return examData.update({
                    title,
                    description,
                    categoryId
                });
            })
            .then((updatedExam) => {
                res.status(200).json(updatedExam);
            })
            .catch((error) => {
                next(error);
            });
    }
    deleteExam(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        exam.findByPk(id)
            .then((examData) => {
                if (!examData) {
                    return res.status(404).json({
                        status: 'failed',
                        message: 'Exam not found'
                    });
                }
                return examData.destroy();
            })
            .then(() => {
                res.status(204).send();
            })
            .catch((error) => {
                next(error);
            });
    }
    getExamsByCategory(req: Request, res: Response, next: NextFunction) {
        const { categoryId } = req.params;
        exam.findAll({
            where: { categoryId },
            include: [{
                model: exam_category,
                as: 'category'
            }]
        })
            .then((exams) => {
                if (exams.length === 0) {
                    return res.status(404).json({
                        status: 'failed',
                        message: 'No exams found for this category'
                    });
                }
                res.status(200).json(exams);
            })
            .catch((error) => {
                next(error);
            });
    }


}
