import Organisation from '../models/organisation';
import user from '../models/user';
import role from '../models/role';
import { createUser } from '../utilis/userService';

class OrganisationService {
  async createOrganisation(params: {
    name: string;
    email: string;
    description: string;
    phone_number: string;
    website_url: string;
    admin_password: string;
  }) {
    const { name, email, description, phone_number, website_url, admin_password } = params;

    if (!name || !email || !description || !phone_number || !website_url || !admin_password) {
      return { status: 'error', code: 400, message: 'All fields including admin password are required' };
    }

    const existingOrg = await Organisation.findOne({ where: { email } });
    if (existingOrg) {
      return { status: 'error', code: 400, message: 'Organisation with this email already exists' };
    }

    const newOrganisation = await Organisation.create({ name, email, description, phone_number, website_url });

    // Ensure admin role exists or fallback
    const adminRole = await role.findOne({ where: { name: 'admin' } });
    const role_id = adminRole?.id;

    // Create org admin using userService (expecting model hooks to hash password)
    const response: any = await createUser({
      fullname: `${name} Admin`,
      email,
      password: admin_password,
      role_id: role_id as any,
      organisation_id: newOrganisation.id,
    });

    if (response.status !== 'success') {
      return { status: 'error', code: 500, message: 'Failed to create organisation admin user' };
    }

    const superAdminUser = response.data?.user;

    return {
      status: 'success',
      message: 'Organisation and super admin created successfully',
      data: {
        organisation: newOrganisation,
        super_admin: { id: superAdminUser?.id, email: superAdminUser?.email },
      },
    };
  }

  async updateOrganisation(params: {
    id: string;
    name?: string;
    email?: string;
    description?: string;
    phone_number?: string;
    website_url?: string;
  }) {
    const { id, name, email, description, phone_number, website_url } = params;
    const org: any = await Organisation.findByPk(id);
    if (!org) return { status: 'error', code: 404, message: 'Organisation not found' };

    org.name = name ?? org.name;
    org.email = email ?? org.email;
    org.description = description ?? org.description;
    org.phone_number = phone_number ?? org.phone_number;
    org.website_url = website_url ?? org.website_url;

    await org.save();

    return { status: 'success', message: 'Organisation updated successfully', data: org };
  }

  async getUsersByOrganisation(params: { organisation_id: string }) {
    const { organisation_id } = params;
    if (!organisation_id) return { status: 'error', code: 400, message: 'Organisation ID is required' };

    const users = await user.findAll({ where: { organisation_id } });
    return { status: 'success', message: 'Users fetched successfully', data: users };
  }

  async createInstructor(params: { fullname: string; email: string; password: string; organisation_id: string; phone_number: string }) {
    const { fullname, email, password, organisation_id, phone_number } = params;
    if (!fullname || !email || !password || !organisation_id || !phone_number) {
      return { status: 'error', code: 400, message: 'All fields are required' };
    }

    const existing = await user.findOne({ where: { email } });
    if (existing) {
      return { status: 'failed', code: 400, message: 'Email has already been used' };
    }

    const roleExists = await role.findOne({ where: { name: 'instructor' } });
    if (!roleExists) {
      return { status: 'failed', code: 400, message: 'Invalid role' };
    }

    const response = await createUser({ fullname, email, password, role_id: roleExists.id as any, organisation_id, phone_number });
    return response;
  }

  async getAllInstructors(params: { organisation_id: string }) {
    const { organisation_id } = params;
    if (!organisation_id) return { status: 'error', code: 400, message: 'Organisation ID is required' };

    const instructorRole = await role.findOne({ where: { name: 'instructor' } });
    if (!instructorRole) return { status: 'success', message: 'No Instructor found', data: [] };

    const instructors = await user.findAll({ where: { role_id: instructorRole.id, organisation_id } });
    if (!instructors || instructors.length === 0) {
      return { status: 'successfull', message: 'No Instructor found', data: [] } as any;
    }

    return { status: 'success', message: 'Instructors fetched successfully', data: instructors };
  }
}

const organisationService = new OrganisationService();
export default organisationService;
