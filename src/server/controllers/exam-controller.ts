import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import csvParser from 'csv-parser';
import Exam from '../models/exam';
import user from '../models/user'
import StudentGroup from '../models/student_group';
import student_group_member from '../models/student_group_members';
import ExamCredentials from '../models/exam_credentials';
import question_category from '../models/question-category';

// Mock sendEmail function
const sendEmail = (email: string, studentCode: string, examTitle: string) => {
  console.log(`Email sent to ${email}: Your studentCode for ${examTitle} is ${studentCode}`);
};

class ExamController {
  // ✅ CREATE Exam
  static async create(req: Request, res: Response) {
    try {
      const {
        title,
        instructor_id,
        organisation_id,
        duration,
        status = 'draft',
        group_id,
        emails = [],
      } = req.body;

      const newExam = await Exam.create({
        title,
        instructor_id,
        organisation_id,
        duration,
        status,
      });

      let studentEmails: string[] = [];

      // Fetch from group if group_id provided
      if (group_id) {
        const groupMembers = await StudentGroupMember.findAll({ where: { group_id } });
        studentEmails = groupMembers.map((member: any) => member.email);
      }

      // Merge manual emails
      if (emails.length > 0) {
        studentEmails = [...new Set([...studentEmails, ...emails])]; // remove duplicates
      }

      // Generate StudentCode and send email
      for (const email of studentEmails) {
        const studentCode = `EX-${newExam.id.slice(0, 4)}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        await ExamCredentials.create({
          exam_id: newExam.id,
          student_code: studentCode,
          user_email: email,
        });
        sendEmail(email, studentCode, title);
      }

      return res.status(201).json({ success: true, exam: newExam });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Failed to create exam' });
    }
  }

  // ✅ GET ALL Exams
  static async index(req: Request, res: Response) { 
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    try {
      // Fetch user and get organisation_id
      const foundUser = await user.findOne({ where: { id: user_id } });

      if (!foundUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      const organisation_id = foundUser.organisation_id;

      // Fetch exams for the user's organization
      const exams = await Exam.findAll({ where: { organisation_id } });

      if (!exams || exams.length === 0) {
        return res.status(404).json({ success: false, message: "No exams found for this organization" });
      }

      return res.status(200).json({ success: true, exams });

    } catch (err) {
      console.error('Error fetching exams:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch exams' });
    }
  }

  // ✅ GET SINGLE Exam
  static async show(req: Request, res: Response) {
    try {
      const exam = await Exam.findByPk(req.params.id);
      if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
      return res.status(200).json({ success: true, exam });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to get exam' });
    }
  }

  // ✅ UPDATE Exam 
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const exam = await Exam.findByPk(id);
      if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

      await exam.update(req.body);
      return res.status(200).json({ success: true, exam });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to update exam' });
    }
  }

  // ✅ DELETE Exam
  static async destroy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const exam = await Exam.findByPk(id);
      if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

      await exam.destroy();
      return res.status(200).json({ success: true, message: 'Exam deleted' });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to delete exam' });
    }
  }

  // ✅ VALIDATE Exam Access
  static async validateExamAccess(req: Request, res: Response) {
    const { exam_id, student_code } = req.body;

    const student = await StudentGroup.findOne({ where: { student_code } });
    if (!student) return res.status(401).json({ message: 'Invalid student code' });

    // Optionally verify if student is authorized for that exam
    const exam = await Exam.findByPk(exam_id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    // You can track login session here
    res.json({ message: 'Access granted', exam, student });
  };

  async importStudents(req: Request, res: Response) {
    try {
      // If file is uploaded (CSV)
      if (req.file?.path) {
        const file = req.file.path;
        const results: any[] = [];

        fs.createReadStream(file)
          .pipe(csvParser())
          .on('data', (row) => {
            results.push(row);
          })
          .on('end', async () => {
            await this.saveStudentsToDB(results, res);
          });
      }

      // If normal JSON array is provided in req.body
      else if (Array.isArray(req.body.students)) {
        const students = req.body.students;
        await this.saveStudentsToDB(students, res);
      }

      // Invalid input
      else {
        return res.status(400).json({
          message: 'Invalid input. Provide either a CSV file or a students array.',
        });
      }
    } catch (error) {
      console.error('Import Error:', error);
      res.status(500).json({ message: 'Failed to import students.', error });
    }
  };

  // ✅ Common save logic (used by both array and CSV input)
  async saveStudentsToDB(students: any[], res: Response) {
    for (const student of students) {
      const { email, name, group } = student;

      const studentCode = uuidv4().split('-')[0]; // Generate unique student code
      await student_group_member.upsert({
        email,
        name,
        group,
        student_code: studentCode,
      });
      // Optionally send email or push notification
    }

    return res.status(200).json({ message: 'Students imported successfully.' });
  };
}

export default ExamController;
