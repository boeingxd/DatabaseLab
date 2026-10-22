// db.js
// Done for you -- Task 1 asks you to *use* this shared pool throughout,
// not to write it from scratch.
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bookstore',
  connectionLimit: 10
});

module.exports = pool;
