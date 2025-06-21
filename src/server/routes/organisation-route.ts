import express from 'express';
import OrganisationController from '../controllers/organisation-controller';

const organisation = express.Router();
organisation.post('/organisations', OrganisationController.createOrganisation);
organisation.put('/organisations', OrganisationController.updateOrganisation);

organisation.get('/organisations/users', OrganisationController.getUsersByOrganisation);
organisation.get('/organisations/instructors', OrganisationController.getAllInstructors);

organisation.post('/organisations/instructors', OrganisationController.createInstructor);

export default organisation;
