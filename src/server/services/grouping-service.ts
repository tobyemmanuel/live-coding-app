import student_group from '../models/student_group';
import student_group_members from '../models/student_group_member';

class GroupingService {
  async createGroup(params: { name: string; instructor_id: string; organisation_id: string }) {
    const { name, instructor_id, organisation_id } = params;
    const group = await student_group.create({ name, instructor_id, organisation_id });
    return { status: 'success', data: group };
  }

  async addUsers(users: Array<{ group_id: string; user_id: string; email: string }>) {
    if (!Array.isArray(users) || users.length === 0) {
      return { status: 'error', code: 400, message: 'Please provide an array of users' };
    }

    const group_id = users[0].group_id;
    const group = await student_group.findByPk(group_id);
    if (!group) {
      return { status: 'error', code: 404, message: `Group with ID ${group_id} does not exist` };
    }

    const creationPromises = users.map((u) => {
      const { group_id, user_id, email } = u;
      if (!group_id || !user_id || !email) {
        throw new Error('Each user must include group_id, user_id, and email');
      }
      return student_group_members.create({ group_id, user_id, email });
    });

    const createdMembers = await Promise.all(creationPromises);
    return { status: 'success', message: 'Students added successfully', data: createdMembers };
  }

  async updateStudent(params: { id: string; group_id?: string; user_id?: string; email?: string }) {
    const { id, group_id, user_id, email } = params;
    const member: any = await student_group_members.findOne({ where: { id } });
    if (!member) return { status: 'error', code: 404, message: 'Student not found' };

    await member.update({
      group_id: group_id ?? member.group_id,
      user_id: user_id ?? member.user_id,
      email: email ?? member.email,
    });

    return { status: 'success', message: 'Student updated successfully', data: member };
  }

  async fetchGroups() {
    const groups = await student_group.findAll();
    return { status: 'success', data: groups };
  }
}

const groupingService = new GroupingService();
export default groupingService;
