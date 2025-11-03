import { DataTypes } from 'sequelize';
import sequelize from '../config/db.ts';
import { Reference } from 'isolated-vm';
import exam from './exam.ts';
import user from './user.ts';

const submission = sequelize.define('submission', {
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
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: user,
            key: 'id',
        },
    },
    score: {
        type: DataTypes.DECIMAL(5, 6),
        allowNull: false
    },
    time_submitted: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
})

export default submission;