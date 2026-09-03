const mysql = require("mysql2/promise");
const express = require("express");
const app = express();

app.use(express.static("public"));

async function main() {
  let conn;
  try {
    conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "lab4_sec5",
    });
  } catch (err) {
    console.error("Database error:", err);
    return;
  }

  app.get("/", (req, res) => {
    res.send("Hello from CSS326");
  });

  app.get("/students", async (req, res) => {
    try {
      const major = req.query.major;
      const [rows] = major
        ? await conn.execute("SELECT * FROM students where major = ?", [major])
        : await conn.query("SELECT * FROM students");

      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });

  app.post("/students", async (req, res) => {
    try {
      const { name, major, year } = req.body;
      const [result] = await conn.execute(
        "INSERT INTO students (name, major, year) VALUES (?,?,?)",
        [name, major, year],
      );
      res.status(201).json({ id: result.insertId });
    } catch (error) {
      console.error("error", error);
    }
  });

  app.get("/students/:id", async (req, res) => {
    const [[rows]] = await conn.execute("SELECT * FROM students WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) return res.status(404).json({ error: "not found" });
    res.json([rows]);
  });

  app.listen(3000, () => console.log("http://localhost:3000"));

  process.on("SIGINT", async () => {
    await conn.end();
    console.log("\nconnection ended");
    process.exit(0);
  });
}

main();
