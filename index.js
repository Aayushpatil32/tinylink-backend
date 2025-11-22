const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database table
const initDB = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS links (
      id SERIAL PRIMARY KEY,
      code VARCHAR(8) UNIQUE NOT NULL,
      target_url TEXT NOT NULL,
      total_clicks INTEGER DEFAULT 0,
      last_clicked TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  try {
    await pool.query(createTableQuery);
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

// Call initDB but don't await in global scope
initDB().catch(console.error);

// Helper functions
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

const isValidCode = (code) => {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
};

const generateCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({
    ok: true,
    version: '1.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Create a new short link
app.post('/api/links', async (req, res) => {
  try {
    const { target_url, code } = req.body;

    if (!target_url || !isValidUrl(target_url)) {
      return res.status(400).json({ error: 'Invalid URL provided' });
    }

    let shortCode = code;
    if (shortCode) {
      if (!isValidCode(shortCode)) {
        return res.status(400).json({ 
          error: 'Code must be 6-8 alphanumeric characters' 
        });
      }
    } else {
      shortCode = generateCode();
      
      let attempts = 0;
      while (attempts < 10) {
        const checkQuery = 'SELECT code FROM links WHERE code = $1';
        const checkResult = await pool.query(checkQuery, [shortCode]);
        if (checkResult.rows.length === 0) break;
        shortCode = generateCode();
        attempts++;
      }
    }

    const insertQuery = `
      INSERT INTO links (code, target_url) 
      VALUES ($1, $2) 
      RETURNING *
    `;
    
    const result = await pool.query(insertQuery, [shortCode, target_url]);
    const link = result.rows[0];

    res.status(201).json({
      code: link.code,
      target_url: link.target_url,
      total_clicks: link.total_clicks,
      created_at: link.created_at
    });

  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ 
        error: 'Code already exists. Please choose a different code.' 
      });
    }
    
    console.error('Error creating link:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all links
app.get('/api/links', async (req, res) => {
  try {
    const query = `
      SELECT code, target_url, total_clicks, last_clicked, created_at 
      FROM links 
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query);
    res.status(200).json(result.rows);

  } catch (err) {
    console.error('Error fetching links:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get stats for a specific code
app.get('/api/links/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    const query = `
      SELECT code, target_url, total_clicks, last_clicked, created_at 
      FROM links 
      WHERE code = $1
    `;
    
    const result = await pool.query(query, [code]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    res.status(200).json(result.rows[0]);

  } catch (err) {
    console.error('Error fetching link stats:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a link
app.delete('/api/links/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    const deleteQuery = 'DELETE FROM links WHERE code = $1 RETURNING *';
    const result = await pool.query(deleteQuery, [code]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    res.status(200).json({ 
      message: 'Link deleted successfully',
      code: result.rows[0].code 
    });

  } catch (err) {
    console.error('Error deleting link:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Redirect to original URL
app.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    if (!isValidCode(code)) {
      return res.status(404).send('Link not found');
    }
    
    const query = `
      UPDATE links 
      SET total_clicks = total_clicks + 1, 
          last_clicked = CURRENT_TIMESTAMP 
      WHERE code = $1 
      RETURNING target_url
    `;
    
    const result = await pool.query(query, [code]);
    
    if (result.rows.length === 0) {
      return res.status(404).send('Link not found');
    }
    
    res.redirect(302, result.rows[0].target_url);

  } catch (err) {
    console.error('Error redirecting:', err);
    res.status(500).send('Internal server error');
  }
});

// Export the Express app for Vercel
module.exports = app;