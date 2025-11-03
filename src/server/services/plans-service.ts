import plan from '../models/plans';

class PlansService {
  async getPlans() {
    const plans = await plan.findAll();
    return { status: 'success', data: plans };
  }

  async createPlan(params: { name: string; description: string; price: number; instructor_limit?: number; student_limit?: number }) {
    const { name, description, price, instructor_limit, student_limit } = params;
    if (!name || !description || price == null) {
      return { status: 'error', code: 400, message: 'Name, description and price are required' };
    }
    const newPlan = await plan.create({ name, description, price, instructor_limit, student_limit });
    return { status: 'success', data: newPlan };
  }

  async updatePlan(id: string, params: { name: string; description: string; price: number; instructor_limit?: number; student_limit?: number }) {
    const { name, description, price, instructor_limit, student_limit } = params;
    if (!name || !description || price == null) {
      return { status: 'error', code: 400, message: 'Name, description and price are required' };
    }

    const planToUpdate: any = await plan.findByPk(id);
    if (!planToUpdate) {
      return { status: 'error', code: 404, message: 'Plan not found' };
    }

    planToUpdate.name = name;
    planToUpdate.description = description;
    planToUpdate.price = price;
    if (instructor_limit !== undefined) planToUpdate.instructor_limit = instructor_limit;
    if (student_limit !== undefined) planToUpdate.student_limit = student_limit;
    await planToUpdate.save();

    return { status: 'success', data: planToUpdate };
  }

  async deletePlan(id: string) {
    const planToDelete = await plan.findByPk(id);
    if (!planToDelete) {
      return { status: 'error', code: 404, message: 'Plan not found' };
    }
    await planToDelete.destroy();
    return { status: 'success', message: 'Plan deleted successfully' };
  }
}

const plansService = new PlansService();
export default plansService;
