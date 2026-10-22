// db.js - one shared connection pool for the whole app (Lab 6 pattern)
const mysql = require('mysql2/promise');

// Database credentials - change user/password to match YOUR MySQL installation
const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'bookstore_lab9',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
