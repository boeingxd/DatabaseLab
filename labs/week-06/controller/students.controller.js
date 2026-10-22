const pool = require("../db");

exports.list = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM students");
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

  try {
    const [result] = await pool.execute(
      "INSERT INTO students (name, major, year) VALUES (?,?,?)",
      [name, major, year],
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const [[rows]] = await pool.execute("SELECT * FROM students where id = ?", [
      req.params.id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  const [result] = await pool.execute(
    "UPDATE students SET major = ? where id = ?",
    [req.body.major],
    req.params.id,
  );
  if (result.affectedRows === 0) {
    return res.status(404).json({ error: "not found" });
  }
  res.json({ updated: result.affectedRows });
};

exports.delete = async (req, res) => {
  try {
    const [result] = await pool.execute("DELETE FROM students WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "not found" });
    }
    res.status(204).end();
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({ error: "student has enrolment records" });
    }
    res.status(500).json({ error: error.message });
  }
};
