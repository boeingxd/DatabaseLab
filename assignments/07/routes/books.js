const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/bookController');

router.get('/', ctrl.list);        // GET /books      -> id, title, price, stock
router.get('/:id', ctrl.getOne);   // GET /books/:id

module.exports = router;
