const pool = require('../db');

// GET /customers/:id/orders
exports.listForCustomer = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT o.id AS order_id, b.id AS book_id, b.title, o.quantity
         FROM orders o JOIN books b ON b.id = o.book_id
        WHERE o.customer_id = ? ORDER BY o.id`,
      [req.params.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const isPosInt = (v) => Number.isInteger(v) && v > 0;

// ---------------------------------------------------------------------
// POST /customers/:id/orders        body: { "book_id": 1, "quantity": 2 }
//
// Q5: one call to the stored procedure. The INSERT inside it fires the
// after_order_insert trigger, which reduces the stock or SIGNALs 45000.
// ---------------------------------------------------------------------
exports.placeOrder = async (req, res) => {
  const customerId = Number(req.params.id);
  const bookId = Number(req.body.book_id);
  const quantity = Number(req.body.quantity);

  if (!isPosInt(customerId) || !isPosInt(bookId) || !isPosInt(quantity)) {
    return res.status(400).json({
      error: 'customer id, book_id and quantity must be positive integers' });
  }

  try {
    await pool.execute('CALL place_order(?, ?, ?)', [customerId, bookId, quantity]);
    res.status(201).json({ ok: true });
  } catch (err) {
    if (err.sqlState === '45000') {                       // our SIGNAL
      return res.status(409).json({ error: err.sqlMessage });
    }
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {          // FK: no such customer or book
      return res.status(404).json({ error: 'customer or book not found' });
    }
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------------------------------------------------
// DELETE /customers/:id/orders/:orderId
//
// Q5: only the DELETE. The after_order_delete trigger gives the stock back.
// ---------------------------------------------------------------------
exports.cancelOrder = async (req, res) => {
  const customerId = Number(req.params.id);
  const orderId = Number(req.params.orderId);
  if (!isPosInt(customerId) || !isPosInt(orderId)) {
    return res.status(400).json({ error: 'ids must be positive integers' });
  }

  try {
    const [r] = await pool.execute(
      'DELETE FROM orders WHERE id = ? AND customer_id = ?', [orderId, customerId]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'order not found' });
    res.json({ ok: true, order_id: orderId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
