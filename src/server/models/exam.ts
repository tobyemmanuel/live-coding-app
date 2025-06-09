import { DataTypes } from 'sequelize';
import sequelize from '../config/db.ts';
import organisation from './organisation.ts';
import role from './role.ts';
import { stat } from 'fs';

const Exam = sequelize.define(
    'exam', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    instructor_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    organisation_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'draft'),
        allowNull: false,
        defaultValue: 'draft',
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}
)

Exam.belongsTo(organisation, {
    foreignKey: 'organisation_id',
    targetKey: 'id', // Match the reference_id field in Transactions
    onDelete: 'CASCADE', // Cascade delete to clean up related records
    onUpdate: 'CASCADE',
})

Exam.belongsTo(role, {
    foreignKey: 'instructor_id',
    targetKey: 'id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

export default Exam;