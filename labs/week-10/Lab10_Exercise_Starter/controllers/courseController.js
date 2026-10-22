// controllers/courseController.js
const pool = require('../db');

// GET /api/courses
exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, title, credits, seats FROM courses ORDER BY id LIMIT 20'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error'});
  }
};

// GET /api/courses/search?title=...
exports.search = async (req, res) => {
  try {
    const title = req.query.title || '';
    const [rows] = await pool.execute('SELECT id, title, credits, seats FROM courses WHERE title = ?', [title]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error'});
  }
};
