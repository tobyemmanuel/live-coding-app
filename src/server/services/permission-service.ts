import permission from '../models/permission';

class PermissionService {
  async getPermissions() {
    const permissions = await permission.findAll();
    return { status: 'success', data: permissions };
  }

  async createPermission(params: { user_id: string; plan_id: string; modules: any[] }) {
    const { user_id, plan_id, modules } = params;
    if (!user_id || !plan_id || !Array.isArray(modules)) {
      return { status: 'error', code: 400, message: 'user_id, plan_id and modules (as array) are required' };
    }

    const access = JSON.stringify(modules);
    const newPermission = await permission.create({ user_id, plan_id, access });
    return { status: 'success', data: newPermission };
  }

  async updateModulePermission(permission_id: string, params: { module_id: string; can_create?: string; can_read?: string; can_update?: string; can_delete?: string; }) {
    const { module_id, can_create, can_read, can_update, can_delete } = params;
    if (!module_id) {
      return { status: 'error', code: 400, message: 'module_id is required' };
    }

    const record = await permission.findByPk(permission_id);
    if (!record) return { status: 'error', code: 404, message: 'Permission record not found' };

    let access = JSON.parse((record as any).access || '[]');
    let moduleFound = false;

    access = access.map((mod: any[]) => {
      if (mod[0] === module_id) {
        moduleFound = true;
        return [
          module_id,
          can_create ?? mod[1],
          can_read ?? mod[2],
          can_update ?? mod[3],
          can_delete ?? mod[4],
        ];
      }
      return mod;
    });

    if (!moduleFound) {
      access.push([module_id, can_create || '0', can_read || '0', can_update || '0', can_delete || '0']);
    }

    (record as any).access = JSON.stringify(access);
    await record.save();

    return { status: 'success', data: record };
  }
}

const permissionService = new PermissionService();
export default permissionService;
