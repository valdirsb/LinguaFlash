const mysql = require('mysql2');
require('dotenv').config();

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const createPool = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      }).promise();

      // Test the connection
      await pool.query('SELECT 1');
      console.log('Database connection established');
      return pool;
    } catch (err) {
      console.error(`Database connection attempt ${i + 1} failed:`, err);
      if (i === retries - 1) throw err;
      console.log('Retrying in 5 seconds...');
      await sleep(5000);
    }
  }
};

module.exports = createPool;