const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/enrolmentController');
const students = require('../controllers/studentController');

// GET    /students                           -> students + course count (function)  Exercise 3
// GET    /students/:id/enrolments            -> a student's courses
// POST   /students/:id/enrolments            -> enrol (CALL enrol_student)          Exercise 3
//        body: { "course_id": 1 }
// DELETE /students/:id/enrolments/:courseId  -> un-enrol (trigger gives seat back)  Exercise 3
router.get('/', students.list);
router.get('/:id/enrolments', ctrl.listForStudent);
router.post('/:id/enrolments', ctrl.enrol);
router.delete('/:id/enrolments/:courseId', ctrl.unenrol);

module.exports = router;
