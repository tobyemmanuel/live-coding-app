import { Response, Request, NextFunction } from 'express';
import plansService from '../services/plans-service';
import { success, fail } from '../utilis/response';

class PlansController {
  async getPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await plansService.getPlans();
      return success(res, result.data, 'Plans fetched', 200);
    } catch (error: any) {
      return fail(res, 'Failed to fetch plans', 500);
    }
  }

  async createPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await plansService.createPlan(req.body);
      if (result.status === 'success') return success(res, result.data, 'Plan created', 201);
      return fail(res, result.message || 'Failed to create plan', result.code || 400);
    } catch (error: any) {
      return fail(res, 'Failed to create plan', 500);
    }
  }

  async updatePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await plansService.updatePlan(id, req.body);
      if (result.status === 'success') return success(res, result.data, 'Plan updated', 200);
      return fail(res, result.message || 'Failed to update plan', result.code || 400);
    } catch (error: any) {
      return fail(res, 'Failed to update plan', 500);
    }
  }

  async deletePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await plansService.deletePlan(id);
      if (result.status === 'success') return success(res, undefined, result.message, 200);
      return fail(res, result.message || 'Plan not found', result.code || 404);
    } catch (error: any) {
      return fail(res, 'Failed to delete plan', 500);
    }
  }
}
export default new PlansController();
