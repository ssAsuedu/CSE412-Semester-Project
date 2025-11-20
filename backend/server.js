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

// Basic login endpoint that checks administratoruser and customeruser tables
app.post('/login', async (req, res) => {
  console.log('Received request to /login', req.body);

  const { email, username, password } = req.body;
  const identifier = (email || username || '').trim();

  if (!identifier || !password) {
    return res.status(400).json({ error: 'email and password required' });
  }

  try {
    // use lowercase unquoted table names that exist in your DB
    const tables = ['administratoruser', 'customeruser'];

    for (const table of tables) {
      try {
        const q = `SELECT * FROM public.${table} WHERE LOWER(email) = LOWER($1) LIMIT 1;`;
        console.log(`Querying: SELECT * FROM ${table} WHERE LOWER(email) = LOWER($1) LIMIT 1;`, [identifier]);
        const { rows } = await pool.query(q, [identifier]);
        console.log(`${table}: rows returned =`, rows.length);

        if (rows.length === 0) continue;

        const user = rows[0];
        console.log(`${table}: found user`, { email: user.email });

        const stored = user.password || user.pass || user.password_hash || null;
        if (!stored) {
          console.warn(`${table}: no password column found for user record`);
          return res.status(500).json({ error: 'Server error' });
        }


        if (match) {
          // normalize id field (Administrator table uses adminID, customer table uses userId / userid)
          const idCandidates = ['adminid', 'adminID', 'userid', 'userId', 'id'];
          let normalizedId = null;
          for (const key of idCandidates) {
            if (Object.prototype.hasOwnProperty.call(user, key)) {
              normalizedId = user[key];
              break;
            }
          }

          const safeUser = {
            id: normalizedId ?? null,
            email: user.email,
            name: user.name ?? user.username ?? null
          };

          return res.json({ ok: true, user: safeUser, userType: table });
        } else {
          return res.status(401).json({ ok: false, error: 'Invalid credentials' });
        }
      } catch (err) {
        if (err && err.code === '42P01') {
          console.warn(`Table "${table}" does not exist — skipping`);
          continue;
        }
        throw err;
      }
    }

    return res.status(401).json({ ok: false, error: 'Invalid credentials' });
  } catch (err) {
    console.error('Error in /login:', err);
    return res.status(500).json({ error: err.message });
  }
});

app.listen(5052, () => console.log('Server running on port 5052'));


(async () => {
  try {
    const { rows } = await pool.query(
      `SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema = 'public'`
    );
    console.log('Tables visible to backend:', rows);
  } catch (e) {
    console.error('Error listing tables:', e);
  }
})();