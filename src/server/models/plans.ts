import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const plans = sequelize.define('plans', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    instructor_limit: {
        type: DataTypes.INTEGER,

    },
    student_limit: {
        type: DataTypes.INTEGER,

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
export default plans
