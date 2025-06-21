// models/student_group_members.ts
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.ts';
import student_group from './student_group.ts';
import user from './user.ts';

const student_group_members = sequelize.define('student_group_members', {
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
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: user,
      key: 'id',
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

export default student_group_members;
