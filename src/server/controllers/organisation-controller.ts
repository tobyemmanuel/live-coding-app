import { Request, Response, NextFunction } from 'express';
import Organisation from '../models/organisation';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import { createUser } from '../utilis/userService';
import role from '../models/role';

class OrganisationController {
    async createOrganisation(req: Request, res: Response, next: NextFunction) {
        const { name, email, description, phone_number, website_url, admin_password } = req.body;

        if (!name || !email || !description || !phone_number || !website_url || !admin_password) {
            return res.status(400).json({ status: 'error', message: 'All fields including admin password are required' });
        }

        try {
            // Check if organisation already exists
            const existingOrg = await Organisation.findOne({ where: { email } });
            if (existingOrg) {
                return res.status(400).json({ status: 'error', message: 'Organisation with this email already exists' });
            }

            // Create organisation
            const newOrganisation = await Organisation.create({
                name,
                email,
                description,
                phone_number,
                website_url,
            });

            const role_id = await role.findOne({ where: { name: 'super_admin' } });

            // Create super admin user for this organisation
            const hashedPassword = await bcrypt.hash(admin_password, 10);
            const superAdmin = await createUser({
                fullname: `${name} Admin`,
                email,
                password: hashedPassword,
                role_id: role_id?.id, // predefined role
                organisation_id: newOrganisation.id,
            });
            // returning the response
            return res.status(201).json({
                status: 'success',
                message: 'Organisation and super admin created successfully',
                data: {
                    organisation: newOrganisation,
                    super_admin: { id: superAdmin.id, email: superAdmin.email },
                },
            });
        } catch (error) {
            next(error);
        }
    }
    async updateOrganisation(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { name, email, description, phone_number, website_url } = req.body;

        try {
            const org = await Organisation.findByPk(id);
            if (!org) {
                return res.status(404).json({ status: 'error', message: 'Organisation not found' });
            }

            // Update fields
            org.name = name || org.name;
            org.email = email || org.email;
            org.description = description || org.description;
            org.phone_number = phone_number || org.phone_number;
            org.website_url = website_url || org.website_url;

            await org.save();
            // Returning the updated organisation
            return res.status(200).json({
                status: 'success',
                message: 'Organisation updated successfully',
                data: org,
            });
        } catch (error) {
            next(error);
        }
    }
    async getUsersByOrganisation(req: Request, res: Response, next: NextFunction) {
        const { organisationId } = req.params;
        // Validate organisationId
        if (!organisationId) {
            return res.status(400).json({ status: 'error', message: 'Organisation ID is required' });
        }
        try {
            const users = await User.findAll({ where: { organisation_id: organisationId } });

            return res.status(200).json({
                status: 'success',
                message: 'Users fetched successfully',
                data: users,
            });
        } catch (error) {
            next(error);
        }
    }
    async getAllInstructors(req: Request, res: Response, next: NextFunction) {

        try {
            const instructors = await User.findAll({ where: { role: 'instructor' } });

            return res.status(200).json({
                status: 'success',
                message: 'Instructors fetched successfully',
                data: instructors,
            });
        } catch (error) {
            next(error);
        }
    }

}


export default new OrganisationController();
