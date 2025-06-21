import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Exam from '../models/exam';
import user from '../models/user';
import organisation from '../models/organisation';
import Question from '../models/question';
import ExamCredentials from '../models/exam_credentials';
import student_group_members from "../models/student_group_member";
import { sendEmail } from '../utilis/email';


class ExamController {
  // ✅ CREATE Exam
  static async create(req: Request, res: Response) {
    const {
      title,
      instructor_id,
      organisation_id,
      duration,
      status = 'draft',
    } = req.body;
    if (!title || !instructor_id || !organisation_id || !duration) {
      return res.status(400).json({
        status: "error",
        message: "input neccsary fields please"
      })
    }
    const Check_inst = await user.findOne({ where: { id: instructor_id } })
    const Check_org = await organisation.findOne({ where: { id: organisation_id } })
    if (!Check_inst) {
      return res.status(400).json({
        status: "error",
        message: "instructor not found"
      })

    } if (!Check_org) {
      return res.status(400).json({
        status: "error",
        message: "orgainsation  not found"
      })
    }
    try {

      const newExam = await Exam.create({
        title,
        instructor_id,
        organisation_id,
        duration,
        status,
      });

      return res.status(201).json({ success: true, exam: newExam });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Failed to create exam' });
    }
  }

  // ✅ Schedule the exam
  static async schedule(req: Request, res: Response) {
    const { exam_id, group_id } = req.body;

    if (!exam_id || !group_id) {
      return res.status(400).json({
        success: false,
        message: 'exam_id and group_id are required',
      });
    }

    try {
      const exam = await Exam.findByPk(exam_id);
      if (!exam) {
        return res.status(404).json({ success: false, message: 'Exam not found' });
      }

      // Update status to 'scheduled'
      await exam.update({ status: 'scheduled' });

      // Fetch group members
      const members = await student_group_members.findAll({
        where: { group_id },
        attributes: ['user_id', 'email'],
      });

      const studentData = members.map((m: any) => ({
        user_id: m.user_id,
        email: m.email,
      }));

      const studentEmails = studentData.map((s) => s.email);

      // Deduplicate by email
      const uniqueStudents = new Map();

      for (const student of studentData) {
        if (!uniqueStudents.has(student.email)) {
          uniqueStudents.set(student.email, student);
        }
      }

      const allStudents = Array.from(uniqueStudents.values());



      // Generate credentials
      const credentialsData = allStudents.map((student) => {
        const studentCode = `EX-${exam.id.slice(0, 4)}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        return {
          id: uuidv4(),
          exam_id: exam.id,
          user_email: student.email,
          student_code: studentCode,
          user_id: student.user_id || null,
        };
      });

      await ExamCredentials.bulkCreate(credentialsData);

      for (const cred of credentialsData) {
        await sendEmail(cred.user_email, cred.student_code, exam.title);
      }

      return res.status(200).json({ success: true, message: 'Exam scheduled and credentials sent.' });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to schedule exam', error: error.message });
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
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "exam id is needed"
      })
    }
    try {
      const exam = await Exam.findByPk(id);
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


  static async validateExamAccess(req: Request, res: Response) {
    try {
      const { exam_id, student_code } = req.body;

      // Validate input
      if (!exam_id || !student_code) {
        return res.status(400).json({
          success: false,
          message: 'exam_id and student_code are required',
        });
      }

      // Check student credentials
      const credential = await ExamCredentials.findOne({
        where: { exam_id, student_code },
      });

      if (!credential) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or unauthorized student code for this exam',
        });
      }

      // Fetch and validate exam
      const exam = await Exam.findByPk(exam_id);
      if (!exam) {
        return res.status(404).json({
          success: false,
          message: 'Exam not found',
        });
      }

      if (exam.status !== 'scheduled') {
        return res.status(403).json({
          success: false,
          message: 'Exam has not been scheduled yet',
        });
      }

      // ✅ Fetch questions for the exam
      const questions = await Question.findAll({
        where: { exam_id },
        order: [['createdAt', 'ASC']], // Optional: sort questions
      });

      return res.status(200).json({
        success: true,
        message: 'Access granted',
        exam: {
          id: exam.id,
          title: exam.title,
          duration: exam.duration,
        },
        student: {
          email: credential.user_email,
          user_id: credential.user_id,
          student_code: credential.student_code,
        },
        questions: questions.map(q => ({
          id: q.id,
          text: q.text,
          options: q.options, // Adjust depending on your structure
          type: q.type,
          marks: q.marks,
        })),
      });

    } catch (error: any) {
      console.error('Access validation error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

}

export default ExamController;
