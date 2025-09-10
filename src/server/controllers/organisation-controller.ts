import { Request, Response, NextFunction } from 'express';
import organisationService from '../services/organisation-service';
import { success, fail } from '../utilis/response';

class OrganisationController {
  async createOrganisation(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await organisationService.createOrganisation(req.body);
      if (result.status === 'success') return success(res, result.data, result.message, 201);
      return fail(res, result.message || 'Failed to create organisation', result.code || 400);
    } catch (error) {
      return next(error);
    }
  }

  async updateOrganisation(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await organisationService.updateOrganisation(req.body);
      if (result.status === 'success') return success(res, result.data, result.message, 200);
      return fail(res, result.message || 'Organisation not found', result.code || 404);
    } catch (error) {
      return next(error);
    }
  }

  async getUsersByOrganisation(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await organisationService.getUsersByOrganisation(req.body);
      return success(res, result.data, result.message, 200);
    } catch (error) {
      return next(error);
    }
  }

  async createInstructor(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await organisationService.createInstructor(req.body);
      const statusCode = result.status === 'success' ? 201 : (result.code || 400);
      if (result.status === 'success') return success(res, result.data, 'Instructor created', statusCode);
      return fail(res, result.message || 'Failed to create instructor', statusCode);
    } catch (error) {
      return next(error);
    }
  }

  async getAllInstructors(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await organisationService.getAllInstructors(req.body);
      return success(res, result.data, result.message, 200);
    } catch (error) {
      return next(error);
    }
  }
}

export default new OrganisationController();
