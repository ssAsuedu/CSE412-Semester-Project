require('dotenv').config({ path: '../.env' });
const { Pool } = require('pg');

const pool = new Pool();

pool.connect()
  .then(() => console.log('Connected to PostgreSQL!'))
  .catch(err => console.error('Connection error:', err.stack));

module.exports = pool;