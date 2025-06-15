import { Router } from "express";
import OrganisationController from "../controllers/organisation-controller";

const organisation = Router();

// CREATE Organisation
organisation.post('/organisation/create', OrganisationController.createOrganisation);
// UPDATE Organisation
organisation.put('/organisation/update/:id', OrganisationController.updateOrganisation);
// GET All Organisations
organisation.get('/organisation/users', OrganisationController.getUsersByOrganisation);
// GET All Instructors
organisation.get('/organisation/instructors', OrganisationController.getAllInstructors); 
// // DELETE Organisation
// organisation.delete('/organisation/delete/:id', OrganisationController.deleteOrganisation);
export default organisation;
 