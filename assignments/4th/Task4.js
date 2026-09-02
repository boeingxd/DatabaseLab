// Task 4: Insert from code (1.5 points)
const mysql = require("mysql2/promise");

async function main() {
  const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bookstore",
  });

  const newBook = {
    title: "The Mythical Man-Month",
    author: "Fred Brooks",
    price: 480,
    stock: 7,
  };

  const [result] = await conn.execute(
    "INSERT INTO books (title, author, price, stock) VALUES (?, ?, ?, ?)",
    [newBook.title, newBook.author, newBook.price, newBook.stock],
  );

  console.log("Inserted new book, insertId:", result.insertId);

  await conn.end();
}

main();
