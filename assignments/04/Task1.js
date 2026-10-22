// Task 1: Set up and connect (1 point)
const mysql = require("mysql2/promise");

async function main() {
  const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bookstore",
  });

  console.log("Connected to the bookstore database.");

  await conn.end();
}

main();
