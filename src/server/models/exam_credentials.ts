import { DataTypes } from 'sequelize';
import sequelize from '../config/db.ts';
import exam from './exam.ts';

const exam_credentials = sequelize.define('exam_credentials', {
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
  student_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Must be unique
  },
  user_email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  matric_number: {
    type: DataTypes.STRING,
    allowNull: true, // Used only if premium
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});
export default exam_credentials;
