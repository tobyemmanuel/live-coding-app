import { DataTypes } from 'sequelize';
import sequelize from '../config/db.ts';
import organisation from './organisation.ts';
import role from './role.ts';

const exam = sequelize.define(
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
    }, createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}
)

exam.belongsTo(organisation, {
    foreignKey: 'organisation_id',
    targetKey: 'id', // Match the reference_id field in Transactions
    onDelete: 'CASCADE', // Cascade delete to clean up related records
    onUpdate: 'CASCADE',
})

exam.belongsTo(role, {
    foreignKey: 'instructor_id',
    targetKey: 'id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

export default exam;