import { DataTypes } from 'sequelize';
import sequelize from '../config/db.ts';
import exam from './exam.ts';
import question_category from './question-category.ts';

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
  question_category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: question_category,
      key: 'id',
    },
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  options: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  answer: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('mcq', 'textbox', 'rating', 'coding', 'media'),
    allowNull: false,
  },
  max_score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 100,
    },
  },
  mediaUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  files: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default question;
