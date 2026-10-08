const pool = require('../db');

// GET /students  -> used by the front-end's student list (done for you)
exports.list = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT Id AS id, name, major FROM students ORDER BY Id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
