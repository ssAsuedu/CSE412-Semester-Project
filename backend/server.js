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

        const match = stored === password;
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

app.get('/menu-items', async (req, res) => {
 
  try {
    const result = await pool.query('SELECT * FROM public.menuitem');
    return res.json(result.rows);
  } catch (err) {
    console.error('Error in /menu-items:', err);
    return res.status(500).json({ error: err.message });
  }
});


app.post('/checkout-cart', async (req, res) => {
  //console.log('Received request to /checkout-cart', req.body);
  const { userid, totalprice, orderdate, status, items } = req.body;
  if (!userid || !totalprice || !orderdate || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Missing required order fields' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO public.neworder (userid, totalprice, orderdate, status, items)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userid, totalprice, orderdate, status || 'Pending', items]
    );
    res.json({ ok: true, order: result.rows[0] });
  } catch (err) {
    console.error('Error in /checkout-cart:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/orders', async (req, res) => {
  //console.log('Received request to /orders', req.query);
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'userId query parameter is required' });
  }
  try {
    const result = await pool.query(
      `SELECT * FROM public.neworder WHERE userid = $1 ORDER BY orderdate DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error in /orders:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/update-order-status', async (req, res) => {
  console.log('Received request to /update-order-status', req.body);
  const { orderid } = req.body;
  if (!orderid) {
    return res.status(400).json({ error: 'orderid is required' });
  }
  try {
    const result = await pool.query(
      `UPDATE public.neworder SET status = 'Complete' WHERE orderid = $1 RETURNING *`,
      [orderid]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ ok: true, order: result.rows[0] });
  } catch (err) {
    console.error('Error in /update-order-status:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/all-orders', async (req, res) => {
  //console.log('Received request to /all-orders', req.query);
  try {
    const result = await pool.query(
      `SELECT * FROM public.neworder ORDER BY orderid DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error in /all-orders:', err);
    res.status(500).json({ error: err.message });
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