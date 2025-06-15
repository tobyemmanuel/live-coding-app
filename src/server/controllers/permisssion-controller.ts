import { Request, Response, NextFunction } from "express";
import permission from "../models/permission";
import modules from "../models/modules";

class PermissionController {
    async getPermissions(req: Request, res: Response, next: NextFunction) {
        try {
            const permissions = await permission.findAll();
            return res.status(200).json({ status: 'success', data: permissions });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: 'Failed to fetch permissions', error: error.message });
        }
    }

    async createPermission(req: Request, res: Response, next: NextFunction) {
        const { user_id, plan_id, modules } = req.body;

        if (!user_id || !plan_id || !Array.isArray(modules)) {
            return res.status(400).json({
                status: 'error',
                message: 'user_id, plan_id and modules (as array) are required',
            });
        }

        try {
            // Convert modules array to JSON string for storage
            const access = JSON.stringify(modules);

            const newPermission = await permission.create({
                user_id,
                plan_id,
                access,
            });

            return res.status(201).json({ status: 'success', data: newPermission });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to create permission',
                error: error.message,
            });
        }
    };
    async updateModulePermission(req: Request, res: Response) {
        const { permission_id } = req.params;
        const { module_id, can_create, can_read, can_update, can_delete } = req.body;

        if (!module_id) {
            return res.status(400).json({ status: 'error', message: 'module_id is required' });
        }

        try {
            const record = await permission.findByPk(permission_id);
            if (!record) {
                return res.status(404).json({ status: 'error', message: 'Permission record not found' });
            }

            let access = JSON.parse(record.access); // parse the JSON string into array

            let moduleFound = false;
            access = access.map((mod: string[]) => {
                if (mod[0] === module_id) {
                    moduleFound = true;
                    return [
                        module_id,
                        can_create ?? mod[1],
                        can_read ?? mod[2],
                        can_update ?? mod[3],
                        can_delete ?? mod[4]
                    ];
                }
                return mod;
            });

            if (!moduleFound) {
                // Optionally: Add new module if not found
                access.push([module_id, can_create || "0", can_read || "0", can_update || "0", can_delete || "0"]);
            }

            // Save updated array
            record.access = JSON.stringify(access);
            await record.save();

            return res.status(200).json({ status: 'success', data: record });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: 'Failed to update permission', error: error.message });
        }
    };

}

export default new PermissionController();
export const permissionControllerInstance = new PermissionController();