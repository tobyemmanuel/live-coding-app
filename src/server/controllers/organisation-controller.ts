import { Request, Response, NextFunction } from 'express';
import Organisation from '../models/organisation';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import { createUser } from '../utilis/userService';
import role from '../models/role';
import organisation from '../models/organisation';

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

        // const { name , email, description, phone_number, website_url } = req.body;
        const { id, name, email, description, phone_number, website_url } = req.body;

        // const { id } = req.params;
        // if(!id){
        //     return res.status(400).json({status:'error', message:'id needed'})
        // }
        // console.log(id);
        const org = await Organisation.findByPk(id);
        if (!org) {
            return res.status(404).json({ status: 'error', message: 'Organisation not found' });
        }
        try {


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
        const { organisation_id } = req.body;
        console.log(organisation_id);
        // Validate organisationId
        if (!organisation_id) {
            return res.status(400).json({ status: 'error', message: 'Organisation ID is required' });
        }
        try {

            const users = await User.findAll({ where: { organisation_id } });

            if (!users) {
                return res.status(200).json({ status: 'success', message: 'users not found' })
            }
            return res.status(200).json({
                status: 'success',
                message: 'Users fetched successfully',
                data: users,
            });
        } catch (error) {
            next(error);
        }
    }
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
    async getAllInstructors(req: Request, res: Response, next: NextFunction) {
        const { organisation_id } = req.body;
        if (!organisation_id) {
            return res.status(400).json({ status: 'error', message: 'Organisation ID is required' });
        }
        try {
            const roles = await role.findOne({ where: { name: 'instructor' } })
            const instructors = await User.findAll({ where: { role_id: roles.id, organisation_id: organisation_id } });
            if (instructors.length === 0) {
                return res.status(200).json({
                    status: "successfull",
                    message: "No Instructor found"
                })
            }
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
