// routes/courses.js
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const tools = require('../controllers/toolsController');

router.get('/', courseController.getAll);          // GET /api/courses          (first 20)
router.get('/search', courseController.search);    // GET /api/courses/search?title=...   Exercise 3
router.get('/explain', tools.explainCourseSearch); // GET /api/courses/explain?title=...  Exercise 1 (done for you)
router.get('/indexes', tools.courseIndexes);       // GET /api/courses/indexes            Exercise 1 (done for you)

module.exports = router;
