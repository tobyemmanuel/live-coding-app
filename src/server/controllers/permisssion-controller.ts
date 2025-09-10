import { Request, Response, NextFunction } from 'express';
import permissionService from '../services/permission-service';
import { success, fail } from '../utilis/response';

class PermissionController {
  async getPermissions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await permissionService.getPermissions();
      return success(res, result.data, 'Permissions fetched', 200);
    } catch (error: any) {
      return fail(res, 'Failed to fetch permissions', 500);
    }
  }

  async createPermission(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await permissionService.createPermission(req.body);
      if (result.status === 'success') return success(res, result.data, 'Permission created', 201);
      return fail(res, result.message || 'Failed to create permission', result.code || 400);
    } catch (error: any) {
      return fail(res, 'Failed to create permission', 500);
    }
  }

  async updateModulePermission(req: Request, res: Response) {
    try {
      const { permission_id } = req.params;
      const result = await permissionService.updateModulePermission(permission_id, req.body);
      if (result.status === 'success') return success(res, result.data, 'Permission updated', 200);
      return fail(res, result.message || 'Failed to update permission', result.code || 400);
    } catch (error: any) {
      return fail(res, 'Failed to update permission', 500);
    }
  }
}

export default new PermissionController();