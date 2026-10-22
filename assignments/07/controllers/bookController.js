const pool = require('../db');

exports.list = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, title, author, price, stock FROM books ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, title, author, price, stock FROM books WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'book not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
