// Task 7: Join from code (2 points)
const mysql = require("mysql2/promise");

async function main() {
  const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bookstore",
  });

  const [rows] = await conn.query(
    `SELECT c.name AS customer_name, b.title AS book_title, o.quantity
     FROM orders o
     INNER JOIN customers c ON o.customer_id = c.id
     INNER JOIN books b ON o.book_id = b.id`,
  );

  for (const row of rows) {
    console.log(row.customer_name, "-", row.book_title, "-", row.quantity);
  }

  await conn.end();
}

main();
