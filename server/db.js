// db.js
const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',       // Replace with your MySQL username
  password: 'mysqlpassword',       // Replace with your MySQL password
  database: 'PasswordManager'  // Replace with your database name
});

const promisePool = pool.promise();

module.exports = promisePool;
