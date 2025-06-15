import user from '../models/user';
import jwt from 'jsonwebtoken';


export const generateToken = (id: string): string => {
    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRATION) {
        throw new Error("Missing environment variables");
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
    });
};

export const createUser = async (data: {
    fullname: string;
    email: string;
    password: string;
    role_id: number;
    organisation_id: string;
    phone_number?: string;
}) => {
    const role_id = data.role_id || 1; // Default to '1' if not provided
    data.role_id = role_id;
    const newUser = await user.create({ ...data, isActive: true });
    const token = generateToken(newUser.id);
    const { password: _, ...safeUser } = newUser.toJSON();

    return {
        status: 'success',
        data: {
            user: {
                id: safeUser.id,
                email: safeUser.email,
                fullname: safeUser.fullname,
                role_id: safeUser.role_id,
                organisation_id: safeUser.organisation_id,
            },
            token,
        },
    };
};
