import { DataTypes } from 'sequelize';
import sequelize from '../config/db.ts';
import orgainsation from './organisation.ts';
import role from './role.ts';
import bcrypt from 'bcryptjs'; // Ensure bcryptjs is installed

const user = sequelize.define(
    'user',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        fullname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [3, 30],
                    msg: 'Full name must be between 3 and 30 characters long.',
                },
            },
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
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [6, 100],
                    msg: 'Password must be between 6 and 100 characters long.',
                },
            },
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        role_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        organisation_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        resetPasswordToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        resetPasswordExpires: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        lastLogin: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        hooks: {
            beforeCreate: async (user) => {
                const u = user as any;
                if (u.password) {
                    const salt = await bcrypt.genSalt(10);
                    u.password = await bcrypt.hash(u.password, salt);
                }
                if (u.pin) {
                    const salt = await bcrypt.genSalt(10);
                    u.pin = await bcrypt.hash(u.pin, salt);
                }
            },
            beforeUpdate: async (user) => {
                const u = user as any;
                if (u.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    u.password = await bcrypt.hash(u.password, salt);
                }
                if (u.changed('pin')) {
                    const salt = await bcrypt.genSalt(10);
                    u.pin = await bcrypt.hash(u.pin, salt);
                }
            },
        },
        timestamps: true, // Manages createdAt and updatedAt automatically
    }
);


user.prototype.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
user.belongsTo(orgainsation, {
    foreignKey: 'organisation_id',
    targetKey: 'id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
user.belongsTo(role, {
    foreignKey: 'role_id',
    targetKey: 'id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
// Filter sensitive data when converting to JSON
user.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    delete values.resetPasswordToken;
    delete values.resetPasswordExpires;
    return values;
};

export default user;
