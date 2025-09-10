import { v4 as uuidv4 } from 'uuid';
import Exam from '../models/exam';
import user from '../models/user';
import organisation from '../models/organisation';
import Question from '../models/question';
import ExamCredentials from '../models/exam_credentials';
import student_group_members from '../models/student_group_member';
import { sendEmail } from '../utilis/email';

class ExamService {
  async create(params: {
    title: string;
    instructor_id: string;
    organisation_id: string;
    duration: string;
    status?: 'scheduled' | 'in_progress' | 'completed' | 'draft';
  }) {
    const { title, instructor_id, organisation_id, duration, status = 'draft' } = params;

    const Check_inst = await user.findOne({ where: { id: instructor_id } });
    const Check_org = await organisation.findOne({ where: { id: organisation_id } });
    if (!Check_inst) {
      return { status: 'error', message: 'instructor not found' };
    }
    if (!Check_org) {
      return { status: 'error', message: 'orgainsation  not found' };
    }

    const newExam = await Exam.create({
      title,
      instructor_id,
      organisation_id,
      duration,
      status,
    });

    return { status: 'success', exam: newExam };
  }

  async schedule(params: { exam_id: string; group_id: string; }) {
    const { exam_id, group_id } = params;
    const exam = await Exam.findByPk(exam_id);
    if (!exam) {
      return { status: 'error', message: 'Exam not found' };
    }

    await exam.update({ status: 'scheduled' });

    const members = await student_group_members.findAll({
      where: { group_id },
      attributes: ['user_id', 'email'],
    });

    const studentData = (members as any[]).map((m) => ({ user_id: m.user_id, email: m.email }));

    const uniqueByEmail = new Map<string, { user_id: string; email: string }>();
    for (const student of studentData) {
      if (!uniqueByEmail.has(student.email)) uniqueByEmail.set(student.email, student);
    }
    const allStudents = Array.from(uniqueByEmail.values());

    const credentialsData = allStudents.map((student) => {
      const studentCode = `EX-${(exam as any).id.slice(0, 4)}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      return {
        id: uuidv4(),
        exam_id: (exam as any).id,
        user_email: student.email,
        student_code: studentCode,
        user_id: student.user_id || null,
      };
    });

    await (ExamCredentials as any).bulkCreate(credentialsData);

    for (const cred of credentialsData) {
      await sendEmail(cred.user_email, cred.student_code, (exam as any).title);
    }

    return { status: 'success', message: 'Exam scheduled and credentials sent.' };
  }

  async index(params: { user_id: string }) {
    const { user_id } = params;
    const foundUser = await user.findOne({ where: { id: user_id } });
    if (!foundUser) {
      return { status: 'error', message: 'User not found' };
    }

    const organisation_id = (foundUser as any).organisation_id;
    const exams = await Exam.findAll({ where: { organisation_id } });

    if (!exams || exams.length === 0) {
      return { status: 'error', message: 'No exams found for this organization' };
    }

    return { status: 'success', exams };
  }

  async show(id: string) {
    const exam = await Exam.findByPk(id);
    if (!exam) return { status: 'error', message: 'Exam not found' };
    return { status: 'success', exam };
  }

  async update(id: string, data: any) {
    const exam = await Exam.findByPk(id);
    if (!exam) return { status: 'error', message: 'Exam not found' };
    await exam.update(data);
    return { status: 'success', exam };
  }

  async destroy(id: string) {
    const exam = await Exam.findByPk(id);
    if (!exam) return { status: 'error', message: 'Exam not found' };
    await exam.destroy();
    return { status: 'success', message: 'Exam deleted' };
  }

  async validateExamAccess(params: { exam_id: string; student_code: string }) {
    const { exam_id, student_code } = params;
    const credential = await (ExamCredentials as any).findOne({ where: { exam_id, student_code } });
    if (!credential) {
      return { status: 'error', code: 401, message: 'Invalid or unauthorized student code for this exam' };
    }

    const exam: any = await Exam.findByPk(exam_id);
    if (!exam) {
      return { status: 'error', code: 404, message: 'Exam not found' };
    }

    if (exam.status !== 'scheduled') {
      return { status: 'error', code: 403, message: 'Exam has not been scheduled yet' };
    }

    const questions: any[] = await (Question as any).findAll({ where: { exam_id }, order: [['createdAt', 'ASC']] });

    return {
      status: 'success',
      message: 'Access granted',
      exam: {
        id: exam.id,
        title: exam.title,
        duration: exam.duration,
      },
      student: {
        email: (credential as any).user_email,
        user_id: (credential as any).user_id,
        student_code: (credential as any).student_code,
      },
      questions: questions.map((q: any) => ({
        id: q.id,
        text: q.text,
        options: q.options,
        type: q.type,
        marks: q.marks,
      })),
    };
  }
}

const examService = new ExamService();
export default examService;
