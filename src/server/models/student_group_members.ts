import { DataTypes } from 'sequelize';
import sequelize from '../config/db.ts';
import student_group from './student_group.ts';

const student_group_member = sequelize.define('student_group_member', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  group_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: student_group,
      key: 'id',
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  student_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default student_group_member;
