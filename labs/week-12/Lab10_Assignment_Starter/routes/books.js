// routes/books.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const tools = require('../controllers/toolsController');

router.get('/', bookController.getAll);                // GET /api/books           (first 20)
router.get('/search', bookController.searchByAuthor);  // GET /api/books/search?author=...   Q1, Q2, Q5
router.get('/explain', tools.explainAuthorSearch);     // GET /api/books/explain?author=...  Q1, Q2 (done for you)
router.get('/indexes', tools.bookIndexes);             // GET /api/books/indexes             Q2 (done for you)

module.exports = router;
