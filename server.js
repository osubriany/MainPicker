// Temporary debug endpoint to list all character names
app.get('/debug-characters', async (req, res) => {
  try {
    const result = await pool.query('SELECT name FROM characters');
    res.json(result.rows.map(row => row.name));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const pool = new Pool();

app.use(express.json());
app.use(express.static('.'));

pool.query(`CREATE TABLE IF NOT EXISTS characters (
  name TEXT PRIMARY KEY,
  main_class TEXT,
  additional_classes TEXT[]
);`);

app.get('/', (req, res) => {
  res.sendFile(require('path').join(__dirname, 'index.html'));
});

app.get('/characters', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM characters');
    const characters = {};
    result.rows.forEach(row => {
      characters[row.name] = {
        mainClass: row.main_class,
        additionalClasses: row.additional_classes || []
      };
    });
    res.json(characters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/save', async (req, res) => {
  const { name, mainClass, additionalClasses } = req.body;
  let realName = name;
  let isDelete = false;
  if (name.endsWith('-delete')) {
    realName = name.replace(/-delete$/, '');
    isDelete = true;
    console.log(`[DELETE] Attempting to delete character: '${realName}'`);
  }
  try {
    if (isDelete) {
      const result = await pool.query('DELETE FROM characters WHERE name = $1', [realName]);
      console.log(`[DELETE] Rows affected: ${result.rowCount}`);
    } else {
      await pool.query(
        `INSERT INTO characters (name, main_class, additional_classes)
         VALUES ($1, $2, $3)
         ON CONFLICT (name) DO UPDATE SET main_class = $2, additional_classes = $3`,
        [realName, mainClass, additionalClasses]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error('[ERROR]', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});