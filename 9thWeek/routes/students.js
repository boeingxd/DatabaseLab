const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/enrolmentController');
const students = require('../controllers/studentController');

// GET    /students                           -> list students (front-end)
// GET    /students/:id/enrolments            -> a student's courses
// POST   /students/:id/enrolments            -> enrol   (body: { "course_id": 1 })   Exercise 2
// DELETE /students/:id/enrolments/:courseId  -> un-enrol                             Exercise 3
router.get('/', students.list);
router.get('/:id/enrolments', ctrl.listForStudent);
router.post('/:id/enrolments', ctrl.enrol);
router.delete('/:id/enrolments/:courseId', ctrl.unenrol);

module.exports = router;
