// db.js - two logins on purpose:
//   admin   = root pool (course convention). Only used to rebuild the practice database.
//   sandbox = 'sql_practice' user that can touch ONLY the sql_practice database, so
//             whatever you type can never reach a lab database.
const mysql = require('mysql2/promise');

const DB = 'sql_practice';
const base = { host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT || 3306) };

const admin = mysql.createPool({
  ...base,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  waitForConnections: true,
  connectionLimit: 5,
});

// Local throwaway account; the password guards nothing beyond the practice database.
const SANDBOX = { user: 'sql_practice', password: 'practice-only' };

const connect = (asRoot) =>
  mysql.createConnection({
    ...base,
    ...(asRoot ? { user: process.env.DB_USER || 'root', password: process.env.DB_PASS || '' } : SANDBOX),
    database: DB,
    dateStrings: true,
  });

module.exports = { admin, connect, DB, SANDBOX };
