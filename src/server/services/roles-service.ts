import role from '../models/role';
import { Op } from 'sequelize';

class RolesService {
  async getRoles() {
    const roles = await role.findAll({
      where: {
        name: { [Op.not]: 'super_admin' },
      },
    });
    return { status: 'success', data: roles };
  }

  async createRole(params: { name: string; description: string }) {
    const { name, description } = params;
    if (!name || !description) {
      return { status: 'error', code: 400, message: 'Name and description are required' };
    }

    const existingRole = await role.findOne({ where: { name } });
    if (existingRole) {
      return { status: 'error', code: 400, message: 'Role already exists' };
    }

    const newRole = await role.create({ name, description });
    return { status: 'success', data: newRole };
  }

  async updateRole(id: string, params: { name: string; description: string }) {
    const { name, description } = params;
    if (!name || !description) {
      return { status: 'error', code: 400, message: 'Name and description are required' };
    }

    const roleToUpdate = await role.findByPk(id);
    if (!roleToUpdate) {
      return { status: 'error', code: 404, message: 'Role not found' };
    }

    roleToUpdate.name = name;
    roleToUpdate.description = description;
    await roleToUpdate.save();

    return { status: 'success', data: roleToUpdate };
  }

  async deleteRole(id: string) {
    const roleToDelete = await role.findByPk(id);
    if (!roleToDelete) {
      return { status: 'error', code: 404, message: 'Role not found' };
    }

    await roleToDelete.destroy();
    return { status: 'success', message: 'Role deleted successfully' };
  }

  async getRoleById(id: string) {
    const roleData = await role.findByPk(id);
    if (!roleData) {
      return { status: 'error', code: 404, message: 'Role not found' };
    }
    return { status: 'success', data: roleData };
  }
}

const rolesService = new RolesService();
export default rolesService;
