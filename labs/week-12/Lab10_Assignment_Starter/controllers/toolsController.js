// controllers/toolsController.js
// Helper routes for the front-end (done for you - not part of the questions).
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

// GET /api/books/explain?author=... -> the query plan of the author search
exports.explainAuthorSearch = async (req, res) => {
  try {
    const [plan] = await pool.query(
      'EXPLAIN SELECT id, title, author, price FROM books WHERE author = ?',
      [req.query.author || '']);
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/books/indexes -> SHOW INDEX FROM books
exports.bookIndexes = async (req, res) => {
  try {
    const [rows] = await pool.query('SHOW INDEX FROM books');
    res.json(rows.map((r) => ({ name: r.Key_name, column: r.Column_name, seq: r.Seq_in_index })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/customers/:id/orders/explain -> the plan of the orders-to-books join (Q3)
exports.explainOrders = async (req, res) => {
  try {
    const [plan] = await pool.query(
      'EXPLAIN SELECT o.id, b.title, o.quantity FROM orders o ' +
      'JOIN books b ON b.id = o.book_id WHERE o.customer_id = ?',
      [Number(req.params.id) || 0]);
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
