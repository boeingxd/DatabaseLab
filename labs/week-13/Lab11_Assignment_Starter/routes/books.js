const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/bookController');

// GET /books                 -> id, title, author, price, stock (+ format, pages: Q7)
// GET /books?format=ebook    -> filter on a JSON field                        Q7
router.get('/', ctrl.list);

module.exports = router;
