const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => res.send('API running'));
app.get('/test-db', async (req, res) => {
  console.log('Received request to /test-db');
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Query result:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error in /test-db:', err);
    res.status(500).json({ error: err.message });
  }
});
app.listen(5052, () => console.log('Server running on port 5052'));