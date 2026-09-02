// Task 3: Filter with a placeholder (1.5 points)
const mysql = require("mysql2/promise");

async function main() {
  const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bookstore",
  });

  const minPrice = 500; // stored in a variable, passed through a ? placeholder

  const [rows] = await conn.query(
    "SELECT title, price FROM books WHERE price > ?",
    [minPrice],
  );

  for (const book of rows) {
    console.log(book.title, "-", book.price);
  }

  await conn.end();
}

main();
