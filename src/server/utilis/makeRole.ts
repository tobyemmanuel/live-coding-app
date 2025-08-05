import role from '../models/role'; // No curly braces since it's a default export

const createRoles = async () => {
  try {
    const roles = [
      { name: 'super_admin', description: 'Has full access to all features and settings.' },
      { name: 'admin', description: 'Can manage users and settings within their organisation.' },
      { name: 'instructor', description: 'Instructor who creates and manages exams.' },
      { name: 'student', description: 'Student who takes exams.' }
    ];

    for (const roleData of roles) {
      await role.findOrCreate({
        where: { name: roleData.name },
        defaults: roleData
      });
    }

    return { status: 'success', message: 'Roles created successfully (or already exist).' };
  } catch (error: any) {
    throw new Error(`Error creating roles: ${error.message}`);
  }
};

export { createRoles };
