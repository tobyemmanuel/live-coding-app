import { DataTypes } from "sequelize";
import sequelize from "../config/db";
import user from "./user";
import plan from "./plans"; // Assuming you have a 'plan' model defined

const permission = sequelize.define('permission',{
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id:{
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: user, // Assuming you have a 'users' table
            key: 'id',
        },
    },
    plan_id:{
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: plan, // Assuming you have a 'plans' table
            key: 'id',
        },
    },
    access:{
        type:DataTypes.STRING
    },
    createdAt:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
})

export default permission;