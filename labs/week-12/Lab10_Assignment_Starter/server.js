// server.js - entry point
const path = require('path');
const express = require('express');
const booksRouter = require('./routes/books');
const customersRouter = require('./routes/customers');
const tools = require('./controllers/toolsController');

const app = express();
app.use(express.json());

// Times every API request and sends the result in an X-Response-Time header
// (milliseconds). The front-end shows it next to each response (Exercise 1).
app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  const json = res.json.bind(res);
  res.json = (body) => {
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    res.setHeader('X-Response-Time', ms.toFixed(2));
    return json(body);
  };
  next();
});

app.use(express.static(path.join(__dirname, 'public')));   // front-end: http://localhost:3000

app.use('/api/books', booksRouter);
app.use('/api/customers', customersRouter);
app.get('/api/whoami', tools.whoami);                       // who is the app connected as?

app.use((req, res) => res.status(404).json({ error: 'not found' }));

const PORT = Number(process.env.PORT || 3000);
if (require.main === module) {
  app.listen(PORT, () => console.log(`Bookstore server on http://localhost:${PORT}`));
}
module.exports = app;
