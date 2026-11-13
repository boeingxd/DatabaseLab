const pool = require('../db');

// GET /books                -> every book with its stock, format and pages
// GET /books?format=ebook   -> Q7: only the books in that format (JSON field)
exports.list = async (req, res) => {
  try {
    const { format } = req.query;
    const [rows] = await pool.execute(
      `SELECT id, title, author, price, stock,
              attributes->>'$.format' AS format,
              attributes->>'$.pages'  AS pages
         FROM books
        ${format ? "WHERE attributes->>'$.format' = ?" : ''}
        ORDER BY id`,
      format ? [format] : []);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
