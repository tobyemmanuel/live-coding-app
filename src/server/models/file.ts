import { DataTypes } from "sequelize";
import sequelize from "../config/db";
import path from "path";

const file = sequelize.define("file", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
    
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    },
})