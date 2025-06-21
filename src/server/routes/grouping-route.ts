import { Router } from 'express';
import Student_Controller from '../controllers/grouping-controler';
// import multer from 'multer';

// const upload = multer({ dest: 'uploads/' });
const group = Router();

// Create group
group.post('/group/create', Student_Controller.creategroup);

// Add users via JSON array
group.post('/group/add-users', async (req, res) => {
  await Student_Controller.addUsers(req.body.Users, res);
});

// Import users from CSV
// group.post('/group/import', upload.single('file'), Student_Controller.importStudents);

// Update a group member
group.put('/group/update/:id', Student_Controller.updateStudent);
group.get('/group/fetch', Student_Controller.FetchGroup);

export default group;
