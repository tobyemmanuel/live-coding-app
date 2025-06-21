import { Request, Response } from 'express';
import student_group from '../models/student_group';
import student_group_members from '../models/student_group_member';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import csvParser from 'csv-parser';
import { group } from 'console';

class Student_Controller {
  constructor() { }

  async creategroup(req: Request, res: Response) {
    const { name, instructor_id, organisation_id } = req.body;

    if (!name || !instructor_id || !organisation_id) {
      return res.status(400).json({ status: 'error', message: 'Please provide all required fields' });
    }

    try {
      const group = await student_group.create({
        name,
        instructor_id,
        organisation_id
      });

      return res.status(201).json({ status: 'success', data: group });
    } catch (error: any) {
      return res.status(500).json({ status: 'error', message: 'Failed to create group', error: error.message });
    }
  }

  async addUsers(users: any[], res: Response) {
    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Please provide an array of users' });
    }

    try {
      // Validate group existence first
      const group_id = users[0].group_id;

      const group = await student_group.findByPk(group_id);
      if (!group) {
        return res.status(404).json({
          status: 'error',
          message: `Group with ID ${group_id} does not exist`,
        });
      }

      const creationPromises = users.map(user => {
        const { group_id, user_id, email } = user;

        if (!group_id || !user_id || !email) {
          throw new Error('Each user must include group_id, user_id, and email');
        }

        return student_group_members.create({
          group_id,
          user_id,
          email
        });
      });

      const createdMembers = await Promise.all(creationPromises);

      return res.status(201).json({
        status: 'success',
        message: 'Students added successfully',
        data: createdMembers
      });
    } catch (error: any) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to add students',
        error: error.message
      });
    }
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
        return res.status(400).json({
          status: 'error',
          message: 'Invalid input. Provide either a CSV file or a user array.',
        });
      }
    } catch (error: any) {
      console.error('Import Error:', error);
      return res.status(500).json({ status: 'error', message: 'Failed to import students', error: error.message });
    }
  }

  async updateStudent(req: Request, res: Response) {
    const { id } = req.params;
    const { group_id, user_id, email } = req.body;

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Student membership ID is required in the URL',
      });
    }

    if (!group_id && !user_id && !email) {
      return res.status(400).json({
        status: 'error',
        message: 'Provide at least one field to update (group_id, user_id, email)',
      });
    }
 
    try {
      const member = await student_group_members.findOne({ where: { id: id } });
      console.log(id)
      if (!member) {
        return res.status(404).json({
          status: 'error',
          message: 'Student not found',
        });
      }

      await member.update({
        group_id: group_id ?? member.group_id,
        user_id: user_id ?? member.user_id,
        email: email ?? member.email,
      });

      return res.status(200).json({
        status: 'success',
        message: 'Student updated successfully',
        data: member,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update student',
        error: error.message,
      });
    }
  }

  async FetchGroup(req: Request, res: Response) {
    const groups = await student_group.findAll();
    return res.status(201).json({
      status: "success",
      data: groups
    })
  }
}

export default new Student_Controller();
