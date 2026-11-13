// controllers/customerController.js
const pool = require('../db');

// GET /api/customers/:id/orders
// NOTE: this query has the same problem as the author search (Q5). Fixing it too
// is good practice - try the '42 OR 1=1' button in the page.
exports.getOrders = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT o.id, b.title, o.quantity FROM orders o ' +
      'JOIN books b ON b.id = o.book_id ' +
      'WHERE o.customer_id = ?',
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message, sql: err.sql });
  }
};
