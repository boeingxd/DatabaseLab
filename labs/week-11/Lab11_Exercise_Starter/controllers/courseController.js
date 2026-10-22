const pool = require('../db');

// ---------------------------------------------------------------------
// GET /courses            -> every course with its free seats
// GET /courses?day=Mon    -> Exercise 4: only the courses on that day
//
// Also returns fields from the details JSON column: ->> gives plain text
// (room, day, time), -> keeps the JSON value (tags, an array). The day
// filter goes in as a ? parameter, never glued into the SQL.
// ---------------------------------------------------------------------
exports.list = async (req, res) => {
  try {
    let sql = `SELECT id, title, credit, seats,
                      details->>'$.room' AS room, details->>'$.day' AS day,
                      details->>'$.time' AS time, details->'$.tags' AS tags
                 FROM courses`;
    const params = [];
    if (req.query.day) {
      sql += " WHERE details->>'$.day' = ?";
      params.push(req.query.day);
    }
    const [rows] = await pool.execute(sql + ' ORDER BY id', params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
