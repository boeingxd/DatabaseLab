// SQL practice site for the CSS326 final.   node exam/practice/server.js
const path = require('path');
const express = require('express');
const practice = require('./controllers/practiceController');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', require('./routes/api'));

const PORT = process.env.PORT || 3326;
practice.ensureSandboxUser()
  .then(practice.resetDb)
  .then(() => app.listen(PORT, () => console.log(`SQL practice: http://localhost:${PORT}`)))
  .catch((err) => { console.error('Could not set up the practice database:', err.message); process.exit(1); });
