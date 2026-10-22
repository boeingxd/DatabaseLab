const pool = require('../db');

// GET /customers/:id/orders  (done for you)
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

const isPositiveInt = (v) => Number.isInteger(v) && v > 0;

// Q2 + Q3 + Q4 : POST /customers/:id/orders   body: { "book_id": 1, "quantity": 2 }
exports.placeOrder = async (req, res) => {
  const customerId = req.params.id;
  const { book_id, quantity } = req.body;

  if (!isPositiveInt(book_id) || !isPositiveInt(quantity)) {
    return res.status(400).json({ error: 'book_id and quantity must be positive whole numbers' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Q3: only succeeds when enough stock is left
    const [u] = await conn.execute(
      'UPDATE books SET stock = stock - ? WHERE id = ? AND stock >= ?',
      [quantity, book_id, quantity]);
    if (u.affectedRows === 0) {
      await conn.rollback();
      return res.status(409).json({ error: 'not enough stock (or book not found)' });
    }

    // Q4: a bad customer_id makes this fail on the foreign key -> catch -> rollback
    const [r] = await conn.execute(
      'INSERT INTO orders (customer_id, book_id, quantity) VALUES (?, ?, ?)',
      [customerId, book_id, quantity]);

    await conn.commit();
    res.status(201).json({ ok: true, order_id: r.insertId });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};

// Q5 : DELETE /customers/:id/orders/:orderId
exports.cancelOrder = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.execute(
      'SELECT book_id, quantity FROM orders WHERE id = ? AND customer_id = ?',
      [req.params.orderId, req.params.id]);
    if (rows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: 'order not found' });
    }

    await conn.execute('DELETE FROM orders WHERE id = ?', [req.params.orderId]);
    await conn.execute(
      'UPDATE books SET stock = stock + ? WHERE id = ?',
      [rows[0].quantity, rows[0].book_id]);

    await conn.commit();
    res.json({ ok: true });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};
