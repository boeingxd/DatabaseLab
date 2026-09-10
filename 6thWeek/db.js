const mysql = require("mysql2/promise");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "lab4_sec5",
  connectionLimit: "10",
};
const pool = mysql.createPool(dbConfig);

module.exports = pool;
