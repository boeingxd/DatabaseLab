// server.js - entry point
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });   // load .env first
const express = require('express');
const coursesRouter = require('./routes/courses');
const studentsRouter = require('./routes/students');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));   // front-end: http://localhost:3000

app.use('/courses', coursesRouter);
app.use('/students', studentsRouter);

app.use((req, res) => res.status(404).json({ error: 'not found' }));

const PORT = Number(process.env.PORT || 3000);
if (require.main === module) {
  app.listen(PORT, () => console.log(`Lab 11 server on http://localhost:${PORT}`));
}
module.exports = app;
