// server.js - entry point
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });   // load .env first
const express = require('express');
const booksRouter = require('./routes/books');
const customersRouter = require('./routes/customers');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));   // front-end: http://localhost:3000

app.use('/books', booksRouter);
app.use('/customers', customersRouter);

app.use((req, res) => res.status(404).json({ error: 'not found' }));

const PORT = Number(process.env.PORT || 3000);
if (require.main === module) {
  app.listen(PORT, () => console.log(`Bookstore server on http://localhost:${PORT}`));
}
module.exports = app;
