import {Response,Request,NextFunction} from "express";
import plan from "../models/plan";

class PlansController {
    async getPlans(req: Request, res: Response, next: NextFunction) {
        try {
            const plans = await plan.findAll();
            return res.status(200).json({ status: 'success', data: plans });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: 'Failed to fetch plans', error: error.message });
        }
    }

    async createPlan(req: Request, res: Response, next: NextFunction) {
        const { name, description, price } = req.body;

        if (!name || !description || !price) {
            return res.status(400).json({ status: 'error', message: 'Name, description and price are required' });
        }

        try {
            const newPlan = await plan.create({ name, description, price });
            return res.status(201).json({ status: 'success', data: newPlan });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: 'Failed to create plan', error: error.message });
        }
    }

    async updatePlan(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { name, description, price } = req.body;

        if (!name || !description || !price) {
            return res.status(400).json({ status: 'error', message: 'Name, description and price are required' });
        }

        try {
            const planToUpdate = await plan.findByPk(id);
            if (!planToUpdate) {
                return res.status(404).json({ status: 'error', message: 'Plan not found' });
            }

            planToUpdate.name = name;
            planToUpdate.description = description;
            planToUpdate.price = price;
            await planToUpdate.save();

            return res.status(200).json({ status: 'success', data: planToUpdate });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: 'Failed to update plan', error: error.message });
        }
    }

    async deletePlan(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        try {
            const planToDelete = await plan.findByPk(id);
            if (!planToDelete) {
                return res.status(404).json({ status: 'error', message: 'Plan not found' });
            }

            await planToDelete.destroy();
            return res.status(200).json({ status: 'success', message: 'Plan deleted successfully' });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: 'Failed to delete plan', error: error.message });
        }
    }
}

export default new PlansController();
