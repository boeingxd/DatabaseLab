// Task 6: Delete from code (1.5 points)
// Deletes the book inserted by Task4.js. Looked up by title/author instead of
// a hardcoded id, since AUTO_INCREMENT keeps advancing on every re-run of
// Task4, so the id would go stale between runs.
const mysql = require("mysql2/promise");

async function main() {
  const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bookstore",
  });

  const [[book]] = await conn.query(
    "SELECT id FROM books WHERE title = ? AND author = ?",
    ["The Mythical Man-Month", "Fred Brooks"],
  );

  const [result] = await conn.execute("DELETE FROM books WHERE id = ?", [
    book.id,
  ]);

  console.log("affectedRows:", result.affectedRows);

  await conn.end();
}

main();
