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
// Exercise 2 : A transactional enrol
exports.enrol = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [u] = await conn.execute(
      "UPDATE courses SET seats = seats -1 WHERE id = ? and seats > 0",
      [req.body.course_id],
    );
    if (u.affectedRows === 0) {
      await conn.rollback();
      return res.status(409).json({ error: "course is full" });
    }
    await conn.execute(
      "INSERT INTO enrolments (student_id, course_id) VALUES (?,?)",
      [req.params.id, req.body.course_id],
    );
    await conn.commit();
    res.status(201).json({ ok: true });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};
// ---------------------------------------------------------------------
// exports.enrol = async (req, res) => {
//   const studentId = req.params.id;
//   const courseId = req.body.course_id;
//   try {
//     await pool.execute("UPDATE courses SET seats = seats - 1 WHERE id = ?", [
//       courseId,
//     ]);
//     await pool.execute(
//       "INSERT INTO enrolments (student_id, course_id) VALUES (?, ?)",
//       [studentId, courseId],
//     );
//     res.status(201).json({ ok: true });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// ---------------------------------------------------------------------
// Exercise 3 : Cancel atomically
// DELETE /students/:id/enrolments/:courseId
//
// TODO: inside ONE transaction
//   1. DELETE the enrolment row for this student + course
//   2. if nothing was deleted -> roll back and return 404
//   3. give the seat back:  UPDATE courses SET seats = seats + 1 WHERE id = ?
//   4. commit and return 200
// Remember: release the connection in finally.
// await conn.beginTransaction();
// const [d] = await conn.execute(
//   "DELETE FROM enrolments WHERE student_id = ? AND course_id = ?",
//   [studentId, courseId],
// );
// // if d.affectedRows === 0 -> rollback and return 404
// await conn.execute("UPDATE courses SET seats = seats + 1 WHERE id = ?", [
//   courseId,
// ]);
// await conn.commit();
// ---------------------------------------------------------------------
// exports.unenrol = async (req, res) => {
//   res.status(501).json({ error: "not implemented yet - Exercise 3" });
// };
exports.unenrol = async (req, res) => {
  const studentId = req.params.id;
  const courseId = req.params.courseId;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [d] = await conn.execute(
      "DELETE FROM enrolments WHERE student_id = ? AND course_id = ?",
      [studentId, courseId],
    );
    if (d.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ error: "enrollment not found" });
    }
    await conn.execute("UPDATE courses SET seats = seats + 1 WHERE id = ?", [
      courseId,
    ]);
    await conn.commit();
    res.json({ ok: true });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};
