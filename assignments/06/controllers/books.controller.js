// controllers/books.controller.js
//
// All the logic and validation for /books lives here; routes/books.routes.js
// only maps HTTP verbs + paths to these functions. books( id, title, author,
// price, stock ). Every value goes through a ? placeholder.
const pool = require('../db');

// GET /books  -- worked example
exports.list = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM books');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /books/:id                                          Task 2 (1.5 pts)
exports.getOne = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [
      req.params.id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /books                                              Task 3 (1.5 pts)
exports.create = async (req, res) => {
  try {
    const { title, author, price, stock } = req.body;

    if (!title || String(title).trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const priceNum = Number(price);
    if (price === undefined || price === '' || !Number.isFinite(priceNum) || priceNum <= 0) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }

    const [result] = await pool.query(
      'INSERT INTO books (title, author, price, stock) VALUES (?, ?, ?, ?)',
      [String(title).trim(), author || '', priceNum, Number(stock) || 0]
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /books/:id                                           Task 4 (1.5 pts)
// Updates price and/or stock -- only the fields actually sent in req.body.
exports.update = async (req, res) => {
  try {
    const { price, stock } = req.body;
    const sets = [];
    const values = [];

    if (price !== undefined) {
      const priceNum = Number(price);
      if (!Number.isFinite(priceNum) || priceNum <= 0) {
        return res.status(400).json({ error: 'Price must be a positive number' });
      }
      sets.push('price = ?');
      values.push(priceNum);
    }

    if (stock !== undefined) {
      const stockNum = Number(stock);
      if (!Number.isInteger(stockNum) || stockNum < 0) {
        return res.status(400).json({ error: 'Stock must be a non-negative integer' });
      }
      sets.push('stock = ?');
      values.push(stockNum);
    }

    if (sets.length === 0) {
      return res.status(400).json({ error: 'Provide price and/or stock to update' });
    }

    values.push(req.params.id);
    const [result] = await pool.query(
      `UPDATE books SET ${sets.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ updated: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /books/:id                                        Task 5 (1.5 pts)
exports.remove = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM books WHERE id = ?', [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(204).end();
  } catch (err) {
    // orders.book_id -> books(id): a book that has orders can't be deleted
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res
        .status(409)
        .json({ error: 'Cannot delete: this book has existing orders' });
    }
    res.status(500).json({ error: err.message });
  }
};
