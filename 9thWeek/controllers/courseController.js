const pool = require('../db');

// GET /courses  (run Exercise 1's ALTER TABLE first, or the seats column won't exist)
exports.list = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, title, seats FROM courses ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /courses/:id
exports.getOne = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, title, seats FROM courses WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'course not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
