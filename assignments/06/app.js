// app.js
// This wiring is done for you and should not need to change.
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));   // serves public/index.html, style.css, main.js

const booksRouter = require('./routes/books.routes');
app.use('/books', booksRouter);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
