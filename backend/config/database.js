/**
 * MySQL Database Configuration
 * Establishes connection to MySQL database
 */

const mysql = require('mysql2');
require('dotenv').config();

// MySQL connection configuration
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Establish database connection
connection.connect((error) => {
  if (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
  console.log('Database connected successfully');
});

module.exports = connection;
