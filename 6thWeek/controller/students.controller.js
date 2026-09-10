const pool = require("../db");

exports.list = async (req, res) => {
  try {
    cosnt[rows] = await pool.query("SELECT * FROM students");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  const { name, major, year } = req.body;

  if (!name || !major) {
    return res.status(400).json({ error: "name and major are required" });
  }
  if (!Number.isInteger(year) || year < 1 || year > 4) {
    return res.status(400).json({ error: "year must be 1 to 4" });
  }
};
