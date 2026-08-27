const mysql = require("mysql2/promise");

async function main() {
  const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "lab4_sec5",
  });
  try {
    // SELECT
    const [rows] = await conn.query("SELECT * FROM students");
    console.log(rows.length, "students");

    for (const s of rows) {
      console.log(s.name, "-", s.major, "-", s.year);
    }

    const selectedMajor = "Data Science";

    const [rows2] = await conn.query(
      "SELECT name, major FROM students WHERE major = ?",
      [selectedMajor],
    );

    for (const s2 of rows2) {
      console.log(s2.name, "-", s2.major);
    }

    const [r3] = await conn.execute(
      "INSERT INTO students (name,major,year) VALUES (?,?,?)",
      ["Mali", "Data Science", 1],
    );
    console.log("new id: ", r3.insertId);

    const [r4] = await conn.execute(
      "UPDATE students SET year = year + 1 WHERE id  = ?",
      [r3.insertId],
    );

    console.log("rows changed: ", r4.affectedRows);
    //     const [r5] = await conn.query("DELETE FROM students WHERE name = ?", [
    //   "Mali",
    // ]);

    // console.log("rows deleted: ", r5.affectedRows);
  } catch (error) {
    console.error("Query failed:", error.message);
  } finally {
    await conn.end;
  }
}
main();
