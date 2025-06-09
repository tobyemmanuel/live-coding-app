import { DataTypes } from 'sequelize';
import sequelize from '../config/db.ts';
import exam from './exam.ts';
import question from './question.ts';

const exam_submission = sequelize.define('exam_submission', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    exam_id: { type: DataTypes.UUID, allowNull: false },
    question_id: { type: DataTypes.UUID, allowNull: false },
    student_code: { type: DataTypes.STRING, allowNull: false },
    answer: { type: DataTypes.TEXT },
    code: { type: DataTypes.TEXT },
    test_results: { type: DataTypes.JSON },
    score: { type: DataTypes.INTEGER },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});
export default exam_submission;
