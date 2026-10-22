const pool = require("../db");

// ---------------------------------------------------------------------
// GET /students  -> used by the front-end's student table and list
//
// course_count(Id) is the stored function from Exercise 1; the front-end
// shows it in the Courses column.
// ---------------------------------------------------------------------
exports.list = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT Id AS id, name, major, course_count(Id) AS courses FROM students ORDER BY Id",
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
