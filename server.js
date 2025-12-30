const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('.'));

app.get('/characters', (req, res) => {
  const filePath = path.join(__dirname, 'characters.json');
  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      res.json(JSON.parse(data));
    } catch (e) {
      res.json({});
    }
  } else {
    res.json({});
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/save', (req, res) => {
  const { name, mainClass, additionalClasses } = req.body;
  const filePath = path.join(__dirname, 'characters.json');

  // Read existing file
  let characters = {};
  if (fs.existsSync(filePath)) {
    try {
      characters = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      characters = {};
    }
  }

  // Update or add character
  characters[name] = {
    mainClass: mainClass || null,
    additionalClasses: additionalClasses || []
  };

  // Write back to file
  fs.writeFileSync(filePath, JSON.stringify(characters, null, 2));

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});