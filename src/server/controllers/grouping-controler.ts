import { Request, Response, NextFunction } from 'express';
import student_group from '../models/student_group';
import { v4 as uuidv4 } from 'uuid';
import exam_credentials from '../models/exam_credentials';

class Student_Controller {
    constructor(parameters) {

    }
    async creategroup(req: Request, res: Response) {
        const { name, instructor_id, organisation_id, exam_id } = req.body;

        if (!name || !instructor_id || !organisation_id) {
            return res.status(400).json({ status: 'error', message: 'Please provide all required fields' });
        }
        try {
            const group = await student_group.create({
                name,
                instructor_id,
                organisation_id
            })
            return res.status(201).json({ status: 'success', data: group });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: 'Failed to create group', error: error.message });
        }
    }

    async addUsers(Users: any[], res: Response) {
        if (!Array.isArray(Users) || Users.length === 0) {
            return res.status(400).json({ status: 'error', message: 'Please provide an array of Users' });
        }
        try {
            const creationPromises = Users.map(user => {
                const { group_id, user_id, email } = user;

                if (!group_id || !user_id || !email) {
                    throw new Error('Each user must include group_id, user_id, and email');
                }

                const studentCode = uuidv4().split('-')[0];
                return exam_credentials.create({
                    group_id,
                    user_id,
                    email,
                    studentCode
                });
            });

            const createdUsers = await Promise.all(creationPromises);

            return res.status(201).json({
                status: 'success',
                message: 'student added successfully',
                data: createdUsers
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
                const Users: any[] = [];

                fs.createReadStream(file)
                    .pipe(csvParser())
                    .on('data', (row) => {
                        Users.push(row);
                    })
                    .on('end', async () => {
                        await this.addUsers(Users, res);
                    });
            } else if (Array.isArray(req.body.Users)) {
                await this.addUsers(req.body.Users, res);
            } else {
                return res.status(400).json({
                    message: 'Invalid input. Provide either a CSV file or a student array.',
                });
            }
        } catch (error: any) {
            console.error('Import Error:', error);
            res.status(500).json({ message: 'Failed to import student.', error: error.message });
        }
    }

    async updateStudent(req: Request, res: Response) {
        const { id } = req.params; // Student ID from the route parameter
        const { group_id, user_id, email } = req.body;

        if (!id) {
            return res.status(400).json({
                status: 'error',
                message: 'Student ID is required in the URL',
            });
        }

        if (!group_id && !user_id && !email) {
            return res.status(400).json({
                status: 'error',
                message: 'Provide at least one field to update (group_id, user_id, email)',
            });
        }

        try {
            // Check if the member exists
            const member = await exam_credentials.findByPk(id);
            if (!member) {
                return res.status(404).json({
                    status: 'error',
                    message: 'student not found',
                });
            }

            // Update only the provided fields
            await member.update({
                group_id: group_id ?? member.group_id,
                user_id: user_id ?? member.user_id,
                email: email ?? member.email,
            });

            return res.status(200).json({
                status: 'success',
                message: 'student updated successfully',
                data: member,
            });
        } catch (error: any) {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to update student  ',
                error: error.message,
            });
        }
    }
}