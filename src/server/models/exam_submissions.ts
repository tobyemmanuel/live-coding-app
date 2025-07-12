import { DataTypes } from 'sequelize';
import sequelize from '../config/db';
import exam from './exam';
import question from './question';

const ExamSubmission = sequelize.define('exam_submission', {
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
  question_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: question,
      key: 'id',
    },
  },
  student_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  answer: {
    type: DataTypes.TEXT,
  },
  code: {
    type: DataTypes.TEXT, // for coding question submission
  },
  test_results: {
    type: DataTypes.JSON, // test result object for code questions
  },
  score: {
    type: DataTypes.INTEGER, // score for this question
    defaultValue: 0,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'exam_submissions',
  timestamps: true,
});

export default ExamSubmission;
