import {Response, Request} from 'express';
import role from '../models/role';
import { Op } from 'sequelize';
class RolesController {
    async getRoles(req: Request, res: Response) {
        try {
            const roles = await role.findAll({
                where: {
                    name: {
                        [Op.not]: 'super_admin' // Exclude super_admin role
                    }
                }
            });
            return res.status(200).json({ status: 'success', data: roles });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: 'Failed to fetch roles', error: error.message });
        }
    }
    async createRole(req: Request, res: Response) {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ status: 'error', message: 'Name and description are required' });
        }

        try {
            const existingRole = await role.findOne({ where: { name } });
            if (existingRole) {
                return res.status(400).json({ status: 'error', message: 'Role already exists' });
            }

            const newRole = await role.create({ name, description });
            return res.status(201).json({ status: 'success', data: newRole });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: 'Failed to create role', error: error.message });
        }
    }
    async updateRole(req: Request, res: Response) {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ status: 'error', message: 'Name and description are required' });
        }

        try {
            const roleToUpdate = await role.findByPk(id);
            if (!roleToUpdate) {
                return res.status(404).json({ status: 'error', message: 'Role not found' });
            }

            roleToUpdate.name = name;
            roleToUpdate.description = description;
            await roleToUpdate.save();

            return res.status(200).json({ status: 'success', data: roleToUpdate });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: 'Failed to update role', error: error.message });
        }
    }
    async deleteRole(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const roleToDelete = await role.findByPk(id);
            if (!roleToDelete) {
                return res.status(404).json({ status: 'error', message: 'Role not found' });
            }

            await roleToDelete.destroy();
            return res.status(200).json({ status: 'success', message: 'Role deleted successfully' });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: 'Failed to delete role', error: error.message });
        }
    }
    async getRoleById(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const roleData = await role.findByPk(id);
            if (!roleData) {
                return res.status(404).json({ status: 'error', message: 'Role not found' });
            }
            return res.status(200).json({ status: 'success', data: roleData });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: 'Failed to fetch role', error: error.message });
        }
    }   
}
export default new RolesController();