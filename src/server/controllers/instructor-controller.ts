import { Response, Request, NextFunction } from "express";
import user from "../models/user";
import organisation from "../models/organisation";
import role from "../models/role";
import { createUser, generateToken } from "../utilis/userService";
import { Op } from "sequelize";

class instructorController {
    async createInstructor(req: Request, res: Response, next: NextFunction) {
      const { fullname, email, password, organisation_id, phone_number } = req.body;
        if (!fullname || !email || !password || !organisation_id || !phone_number) {
            return res.status(400).json({ status: 'error', message: 'All fields are required' });
        }


        try {
            const existing = await user.findOne({ where: { email } });
            if (existing) {
                return res.status(400).json({ status: 'failed', message: 'Email has already been used' });
            }

            const roleExists = await role.findOne({ where: { name: 'instructor' } });
            if (!roleExists) {
                return res.status(400).json({ status: 'failed', message: 'Invalid role' });
            }
            const role_id = roleExists.id;

            const org = await organisation.findOne({ where: { id: organisation_id } });
            if (!org) {
                return res.status(400).json({ status: 'failed', message: 'Invalid organisation' });
            }

            const userData = {
                fullname,
                email,
                password,
                role_id: role_id || '2', // Default to instructor role
                organisation_id,
                phone_number,
            };

            const response = await createUser(userData);
            return res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }
}

export default instructorController;
export const instructorControllerInstance = new instructorController();