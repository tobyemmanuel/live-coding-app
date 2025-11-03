import user from '../models/user';
import jwt from 'jsonwebtoken';
import role from '../models/role';

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
    role_id?: number; // Optional so it can default
    organisation_id: string;
    phone_number?: string;
}) => {
    let finalRoleId = data.role_id;

    if (!finalRoleId) {
        const defaultRole = await role.findOne({ where: { name: 'admin' } });
        if (!defaultRole) throw new Error("Admin role not found");
        finalRoleId = defaultRole.id;
    } else {
        const roleExists = await role.findOne({ where: { id: finalRoleId } });
        if (!roleExists) throw new Error("Specified role does not exist");
    }

    const newUser = await user.create({
        ...data,
        role_id: finalRoleId,
        isActive: true
    });

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
