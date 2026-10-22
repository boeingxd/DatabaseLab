// Task 5: Update from code (1.5 points)
const mysql = require("mysql2/promise");

async function main() {
  const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bookstore",
  });

  const bookId = 1; // Clean Code

  const [result] = await conn.execute(
    "UPDATE books SET price = price * 1.10 WHERE id = ?",
    [bookId],
  );

  console.log("affectedRows:", result.affectedRows);

  await conn.end();
}

main();
