import express from 'express';
import OrganisationController from '../controllers/organisation-controller';
import { protectUser , authorize} from '../middleware/authMiddleware';

const organisation = express.Router();
organisation.post('/organisations', OrganisationController.createOrganisation);
organisation.put('/organisations',protectUser, authorize('super_admin','admin') ,OrganisationController.updateOrganisation);

organisation.get('/organisations/users',protectUser, authorize('super_admin','admin') , OrganisationController.getUsersByOrganisation);
organisation.get('/organisations/instructors',protectUser, authorize('super_admin','admin') , OrganisationController.getAllInstructors);

organisation.post('/organisations/instructors',protectUser, authorize('super_admin','admin') , OrganisationController.createInstructor);

export default organisation;
