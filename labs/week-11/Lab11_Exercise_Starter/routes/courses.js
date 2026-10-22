const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/courseController');
const reviews = require('../controllers/reviewController');

// GET  /courses              -> id, title, credit, seats (+ room/day/time/tags: Exercise 4)
// GET  /courses?day=Mon      -> filter on a JSON field                     Exercise 4
// GET  /courses/:id/reviews  -> documents from the document store          Exercise 5
// POST /courses/:id/reviews  -> add a review document                      Exercise 5
router.get('/', ctrl.list);
router.get('/:id/reviews', reviews.list);
router.post('/:id/reviews', reviews.add);

module.exports = router;
