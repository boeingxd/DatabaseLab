// routes/students.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/', studentController.getAll);                 // GET /api/students
router.get('/:id/courses', studentController.getCourses);  // GET /api/students/:id/courses   Exercise 3

module.exports = router;
