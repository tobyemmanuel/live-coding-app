import { Response, Request } from 'express';
import rolesService from '../services/roles-service';
import { success, fail } from '../utilis/response';

class RolesController {
  async getRoles(req: Request, res: Response) {
    try {
      const result = await rolesService.getRoles();
      return success(res, result.data, 'Roles fetched', 200);
    } catch (error: any) {
      return fail(res, 'Failed to fetch roles', 500);
    }
  }

  async createRole(req: Request, res: Response) {
    try {
      const result = await rolesService.createRole(req.body);
      if (result.status === 'success') return success(res, result.data, 'Role created', 201);
      return fail(res, result.message || 'Failed to create role', result.code || 400);
    } catch (error: any) {
      return fail(res, 'Failed to create role', 500);
    }
  }

  async updateRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await rolesService.updateRole(id, req.body);
      if (result.status === 'success') return success(res, result.data, 'Role updated', 200);
      return fail(res, result.message || 'Failed to update role', result.code || 400);
    } catch (error: any) {
      return fail(res, 'Failed to update role', 500);
    }
  }

  async deleteRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await rolesService.deleteRole(id);
      if (result.status === 'success') return success(res, undefined, result.message, 200);
      return fail(res, result.message || 'Role not found', result.code || 404);
    } catch (error: any) {
      return fail(res, 'Failed to delete role', 500);
    }
  }

  async getRoleById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await rolesService.getRoleById(id);
      if (result.status === 'success') return success(res, result.data, 'Role fetched', 200);
      return fail(res, result.message || 'Role not found', result.code || 404);
    } catch (error: any) {
      return fail(res, 'Failed to fetch role', 500);
    }
  }
}
export default new RolesController();