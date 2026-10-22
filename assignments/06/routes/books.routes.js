// routes/books.routes.js
//
// Thin router: only maps paths to controller functions. Mounted at /books
// in app.js, so '/' here is /books and '/:id' is /books/:id.
const router = require('express').Router();
const c = require('../controllers/books.controller');

router.get('/', c.list);          // GET    /books       (Task 1)
router.get('/:id', c.getOne);     // GET    /books/:id   (Task 2)
router.post('/', c.create);       // POST   /books       (Task 3)
router.put('/:id', c.update);     // PUT    /books/:id   (Task 4)
router.delete('/:id', c.remove);  // DELETE /books/:id   (Task 5)

module.exports = router;
