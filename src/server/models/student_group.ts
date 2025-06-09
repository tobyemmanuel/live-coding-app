import { DataTypes } from 'sequelize';
import sequelize from '../config/db.ts';
import organisation from './organisation.ts';
import user from './user.ts'; 


const student_group = sequelize.define('student_group', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  instructor_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: user, // Assuming you have a 'users' table for instructors
      key: 'id',
    },
  },
  organisation_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: organisation,
      key: 'id',
    },
  },
});
export default student_group;
