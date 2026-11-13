const pool = require('../db');

// ---------------------------------------------------------------------
// GET /customers  -> used by the front-end's customer table and list
//
// Q5: order_count(id) is the stored function from Q2.
// The front-end shows it in the Orders column.
// ---------------------------------------------------------------------
exports.list = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, order_count(id) AS orders FROM customers ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
