import { Request, Response } from 'express';
import fs from 'fs';
import csvParser from 'csv-parser';
import groupingService from '../services/grouping-service';
import { success, fail } from '../utilis/response';

class Student_Controller {
  constructor() {}

  async creategroup(req: Request, res: Response) {
    const { name, instructor_id, organisation_id } = req.body;
    try {
      const result = await groupingService.createGroup({ name, instructor_id, organisation_id });
      return success(res, result.data, 'Group created', 201);
    } catch (error: any) {
      return fail(res, 'Failed to create group', 500);
    }
  }

  async addUsers(users: any[], res: Response) {
    const result = await groupingService.addUsers(users);
    if (result.status === 'success') return success(res, result.data, result.message, 201);
    return fail(res, result.message || 'Failed to add students', result.code || 400);
  }

  async importStudents(req: Request, res: Response) {
    try {
      if (req.file?.path) {
        const file = req.file.path;
        const users: any[] = [];

        fs.createReadStream(file)
          .pipe(csvParser())
          .on('data', (row) => {
            users.push(row);
          })
          .on('end', async () => {
            await this.addUsers(users, res);
          });
      } else if (Array.isArray(req.body.Users)) {
        await this.addUsers(req.body.Users, res);
      } else {
        return fail(res, 'Invalid input. Provide either a CSV file or a user array.', 400);
      }
    } catch (error: any) {
      console.error('Import Error:', error);
      return fail(res, 'Failed to import students', 500);
    }
  }

  async updateStudent(req: Request, res: Response) {
    const { id } = req.params;
    const { group_id, user_id, email } = req.body;
    try {
      const result = await groupingService.updateStudent({ id, group_id, user_id, email });
      if (result.status === 'success') return success(res, result.data, result.message, 200);
      return fail(res, result.message || 'Failed to update student', result.code || 404);
    } catch (error: any) {
      return fail(res, 'Failed to update student', 500);
    }
  }

  async FetchGroup(req: Request, res: Response) {
    const result = await groupingService.fetchGroups();
    return success(res, result.data, 'Groups fetched', 200);
  }
}

export default new Student_Controller();
