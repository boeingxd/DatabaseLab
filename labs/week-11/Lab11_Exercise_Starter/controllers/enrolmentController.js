const pool = require("../db");

// GET /students/:id/enrolments  (done for you)
exports.listForStudent = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT c.id AS course_id, c.title, e.grade
         FROM enrolments e JOIN courses c ON c.id = e.course_id
        WHERE e.student_id = ? ORDER BY c.id`,
      [req.params.id],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------------------------------------------------
// POST /students/:id/enrolments      body: { "course_id": 3 }
//
// One CALL to the stored procedure. The seat is taken by the AFTER INSERT
// trigger (the rule has one home), so Node must not touch courses.seats.
//   201 -> enrolled   409 -> full (trigger SIGNAL, sqlState 45000) / already enrolled
//   404 -> no such student or course
// ---------------------------------------------------------------------
exports.enrol = async (req, res) => {
  const studentId = Number(req.params.id);
  const courseId = Number(req.body.course_id);
  if (!Number.isInteger(studentId) || !Number.isInteger(courseId)) {
    return res
      .status(400)
      .json({ error: "student id and course_id must be integers" });
  }

  try {
    await pool.execute("CALL enrol_student(?,?)", [studentId, courseId]);
    res
      .status(201)
      .json({ ok: true, student_id: studentId, course_id: courseId });
  } catch (err) {
    if (err.sqlState === "45000")
      return res.status(409).json({ error: err.sqlMessage });
    if (err.code === "ER_DUP_ENTRY")
      return res
        .status(409)
        .json({ error: "student is already enrolled in this course" });
    if (err.code === "ER_NO_REFERENCED_ROW_2")
      return res.status(404).json({ error: "student or course not found" });
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------------------------------------------------
// DELETE /students/:id/enrolments/:courseId
//
// Only the DELETE: the AFTER DELETE trigger gives the seat back.
// 404 when nothing was deleted (affectedRows is 0).
// ---------------------------------------------------------------------
exports.unenrol = async (req, res) => {
  const studentId = Number(req.params.id);
  const courseId = Number(req.params.courseId);
  if (!Number.isInteger(studentId) || !Number.isInteger(courseId)) {
    return res.status(400).json({ error: "ids must be integers" });
  }
  try {
    const [d] = await pool.execute(
      "DELETE FROM enrolments WHERE student_id = ? AND course_id = ?",
      [studentId, courseId],
    );
    if (d.affectedRows === 0) {
      return res.status(404).json({ error: "enrolment not found" });
    }
    res.json({ ok: true, student_id: studentId, course_id: courseId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
