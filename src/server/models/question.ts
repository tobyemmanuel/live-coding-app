import { DataTypes } from 'sequelize';
import sequelize from '../config/db.ts';
import exam from './exam.ts';
import exam_category from './exam_category.ts';

const question = sequelize.define('question', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    exam_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: exam,
            key: 'id',
        },
    },
    question_text: {
        type: DataTypes.STRING,
        allowNull: false
    },
    exam_category_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: exam_category,
            key: 'id',
        },
    },
    option: {
        type: DataTypes.STRING,
    },
    answer: {
        type: DataTypes.STRING
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
})