// db.js - one shared connection pool for the whole app
// TODO (Exercise 3):
//   1. Stop connecting as root: use the university_app user from Exercise 2.
//   2. Move the settings into a .env file and read them with process.env
//      (npm install dotenv, then require('dotenv').config() as the very first line).
require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
