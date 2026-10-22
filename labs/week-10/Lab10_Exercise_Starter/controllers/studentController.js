// controllers/studentController.js
const pool = require('../db');

// GET /api/students
exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, name, major FROM students ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error:'Internal server error' });
  }
};

// GET /api/students/:id/courses
exports.getCourses = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT c.id, c.title, e.grande FROM enrolments e' + 'JOIN courses c ON c.id = e.course_id' + 'WWHERE e.student_id = ?', [id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error:'Internal server error' });
  }
};
