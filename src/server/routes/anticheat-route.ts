import { Router } from 'express';
import { validated } from '../middleware/ValidationMiddleware';
import anticheatController from '../controllers/anticheat-controller';
import { protectUser, authorize } from '../middleware/authMiddleware';

const anticheat = Router();

anticheat.post('/create', protectUser,  anticheatController.create);
anticheat.get('/exam/:exam_id', protectUser, authorize('super_admin', 'admin', 'instructor'), anticheatController.getByExam);