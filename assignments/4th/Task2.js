// Task 2: Read all books (1.5 points)
const mysql = require("mysql2/promise");

async function main() {
  const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bookstore",
  });

  const [rows] = await conn.query("SELECT * FROM books");

  for (const book of rows) {
    console.log(book.title, "-", book.price);
  }

  await conn.end();
}

main();
