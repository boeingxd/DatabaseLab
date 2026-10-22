// Task 8: A complete, safe script (1.5 points)

const mysql = require("mysql2/promise");

async function main() {
  let conn;
  try {
    conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "bookstore",
    });
    console.log("Connected to the bookstore database.");

    // Task 2: read all books
    const [books] = await conn.query("SELECT * FROM books");
    console.log("\n-- All books --");
    for (const book of books) {
      console.log(book.title, "-", book.price);
    }

    // Task 3: filter with a placeholder
    const minPrice = 500;
    const [expensiveBooks] = await conn.query(
      "SELECT title, price FROM books WHERE price > ?",
      [minPrice],
    );
    console.log(`\n-- Books over ${minPrice} --`);
    for (const book of expensiveBooks) {
      console.log(book.title, "-", book.price);
    }

    // Task 4: insert
    const newBook = {
      title: "The Mythical Man-Month",
      author: "Fred Brooks",
      price: 480,
      stock: 7,
    };
    const [insertResult] = await conn.execute(
      "INSERT INTO books (title, author, price, stock) VALUES (?, ?, ?, ?)",
      [newBook.title, newBook.author, newBook.price, newBook.stock],
    );
    console.log("\nInserted new book, insertId:", insertResult.insertId);

    // Task 5: update
    const [updateResult] = await conn.execute(
      "UPDATE books SET price = price * 1.10 WHERE id = ?",
      [1],
    );
    console.log("Update affectedRows:", updateResult.affectedRows);

    // Task 6: delete the book inserted above
    const [deleteResult] = await conn.execute(
      "DELETE FROM books WHERE id = ?",
      [insertResult.insertId],
    );
    console.log("Delete affectedRows:", deleteResult.affectedRows);

    // Task 7: join
    const [orderRows] = await conn.query(
      `SELECT c.name AS customer_name, b.title AS book_title, o.quantity
       FROM orders o
       INNER JOIN customers c ON o.customer_id = c.id
       INNER JOIN books b ON o.book_id = b.id`,
    );
    console.log("\n-- Orders (customer, book, quantity) --");
    for (const row of orderRows) {
      console.log(row.customer_name, "-", row.book_title, "-", row.quantity);
    }
  } catch (error) {
    console.error("Query failed:", error.message);
  } finally {
    if (conn) {
      await conn.end();
      console.log("\nConnection closed.");
    }
  }
}

main();
