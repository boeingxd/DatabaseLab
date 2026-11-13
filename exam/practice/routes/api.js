const router = require('express').Router();
const practice = require('../controllers/practiceController');

router.get('/questions', practice.listQuestions);
router.get('/tables', practice.tables);
router.post('/questions/:id/run', practice.runAnswer);
router.post('/reset', practice.reset);

module.exports = router;
