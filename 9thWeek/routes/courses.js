const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/courseController');

router.get('/', ctrl.list);        // GET /courses       -> id, title, seats
router.get('/:id', ctrl.getOne);   // GET /courses/:id

module.exports = router;
