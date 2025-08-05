import { Router } from 'express';
import Student_Controller from '../controllers/grouping-controler';
import { validated } from '../middleware/ValidationMiddleware';
import { createGroupValidation, importStudentsValidation, updateStudentValidation } from '../Validations/studentValidation';
import { authorize, protectUser } from '../middleware/authMiddleware';

const group = Router();


group.post('/group/create', createGroupValidation, protectUser, Student_Controller.creategroup);


group.post('/group/add-users', importStudentsValidation, protectUser, async (req, res) => {
  await Student_Controller.addUsers(req.body.Users, res);
});

group.put('/group/update/:id', updateStudentValidation, protectUser,Student_Controller.updateStudent);
group.get('/group/fetch', Student_Controller.FetchGroup);

export default group;
