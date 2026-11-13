// controllers/bookController.js
const pool = require('../db');

// GET /api/books?limit=20
exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, title, author, price, stock FROM books ORDER BY id LIMIT 20'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message, sql: err.sql });
  }
};

// GET /api/books/search?author=...
exports.searchByAuthor = async (req, res) => {
  try {
    const author = req.query.author || '';
    // The ? is a placeholder: the value is sent separately and is only ever data, never SQL.
    const [rows] = await pool.execute(
      'SELECT id, title, author, price FROM books WHERE author = ?',
      [author]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message, sql: err.sql });
  }
};
