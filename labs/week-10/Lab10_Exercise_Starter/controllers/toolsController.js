// controllers/toolsController.js
// Helper routes for the front-end (done for you - not part of the exercises).
// They are already safe: every value goes in through a ? placeholder.
const pool = require('../db');

// GET /api/whoami -> which MySQL user is the app connected as, and what may it do?
exports.whoami = async (req, res) => {
  try {
    const [[me]] = await pool.query('SELECT CURRENT_USER() AS user, DATABASE() AS db');
    const [grants] = await pool.query('SHOW GRANTS');
    res.json({ user: me.user, database: me.db, grants: grants.map((g) => Object.values(g)[0]) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/courses/explain?title=... -> the query plan of the course search
exports.explainCourseSearch = async (req, res) => {
  try {
    const [plan] = await pool.query(
      'EXPLAIN SELECT id, title, credits, seats FROM courses WHERE title = ?',
      [req.query.title || '']);
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/courses/indexes -> SHOW INDEX FROM courses
exports.courseIndexes = async (req, res) => {
  try {
    const [rows] = await pool.query('SHOW INDEX FROM courses');
    res.json(rows.map((r) => ({ name: r.Key_name, column: r.Column_name, seq: r.Seq_in_index })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
