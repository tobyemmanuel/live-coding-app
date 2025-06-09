import sequelize from "../config/db";
import { DataTypes } from 'sequelize';
import exam from "./exam";
import user from "./user";

const anti_cheat = sequelize.define('anti_cheat', {
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
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
})
export default anti_cheat;
