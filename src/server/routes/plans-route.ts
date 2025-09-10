import { Router } from 'express';
import PlansController from '../controllers/plans-controller';

const plans = Router();

plans.get('/plans', PlansController.getPlans);
plans.post('/plans', PlansController.createPlan);
plans.put('/plans/:id', PlansController.updatePlan);
plans.delete('/plans/:id', PlansController.deletePlan);

export default plans;
