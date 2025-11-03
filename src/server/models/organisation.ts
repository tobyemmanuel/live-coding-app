import { DataTypes } from 'sequelize';
import sequelize from '../config/db.ts';

const organisation = sequelize.define(
    'organisation',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: 'unique_email', // Use a named unique constraint
            validate: {
                isEmail: {
                    msg: 'Email address must be valid.',
                },
            },
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: 'unique_phone', // Use a named unique constraint
        },
        website_url: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: 'unique_website', // Use a named unique constraint
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
);

export default organisation;
