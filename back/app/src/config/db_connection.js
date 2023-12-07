const mysql = require('mysql2');

const path = require('path');
const dotenv = require('dotenv');

const result = dotenv.config({
  path: path.resolve(__dirname, '.env')
});

if (result.error) {
  console.error(result.error);
}

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

module.exports = db;
