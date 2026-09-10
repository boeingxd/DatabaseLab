// CSS326 Lab 5 Assignment -- starter file
// Schema (Lab 2/3):
//   books( id, title, author, price, stock )
//   customers( id, name, email )
//   orders( id, customer_id, book_id, quantity )
//
// Run:  npm install
//       node app.js
//       open http://localhost:3000

const express = require('express');
const mysql = require('mysql2/promise');
const app = express();

app.use(express.json());

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bookstore'
};

const pool = mysql.createPool(dbConfig);

// ---------------------------------------------------------------------
// Task 1: Set up Express -- GET / welcome route
// ---------------------------------------------------------------------
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the bookstore API' });
});

// ---------------------------------------------------------------------
// Task 2: List books -- GET /books
// ---------------------------------------------------------------------
app.get('/books', async (req, res) => {
  try {
    const { author } = req.query;

    // Task 4: optional ?author=... filter, still through a ? placeholder
    if (author) {
      const [rows] = await pool.query(
        'SELECT * FROM books WHERE author = ?',
        [author]
      );
      return res.json(rows);
    }

    const [rows] = await pool.query('SELECT * FROM books');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------------------------------------------------------------
// Task 3: One book by id -- GET /books/:id
// ---------------------------------------------------------------------
app.get('/books/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM books WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------------------------------------------------------------
// Task 5: Create a book -- POST /books
// ---------------------------------------------------------------------
app.post('/books', async (req, res) => {
  try {
    const { title, author, price, stock } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO books (title, author, price, stock) VALUES (?, ?, ?, ?)',
      [title, author, price, stock]
    );

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------------------------------------------------------------
// Task 6: Join from the API -- GET /orders/details
// ---------------------------------------------------------------------
app.get('/orders/details', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.name AS customer_name, b.title AS book_title, o.quantity
       FROM orders o
       INNER JOIN customers c ON o.customer_id = c.id
       INNER JOIN books b ON o.book_id = b.id`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------------------------------------------------------------
// Task 7: Handle errors -- every handler above wraps its work in try/catch
// and replies with 500 + a JSON error message on failure.
//
// Why does each route handler need its own error handling? A route runs
// independently of every other request the server is handling at the same
// time, so an uncaught error (a bad query, a lost DB connection) in one
// handler must not crash the whole Express process or leave other
// in-flight requests hanging -- catching it locally lets that one request
// fail cleanly with a proper status code while the server keeps serving
// everyone else.
// ---------------------------------------------------------------------

// ---------------------------------------------------------------------
// Task 8: Give it a face -- serve public/index.html (fetch('/books') runs
// client-side). Registered after the routes above so it never shadows the
// GET / welcome route: this static file is reached at /index.html, keeping
// the Web API (JSON at /) and the website (HTML page) clearly separated.
// ---------------------------------------------------------------------
app.use(express.static('public'));

app.listen(3000, () => console.log('http://localhost:3000'));
