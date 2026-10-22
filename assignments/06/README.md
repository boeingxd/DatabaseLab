# Lab Assignment 6 Starter: Structuring a Web App (bookstore)

## Setup
1. `npm install`
2. Edit `db.js` with your MySQL password (the `bookstore` database from Lab 2/3: `books`, `customers`, `orders`).
3. `npm start` (or `node app.js`), then visit http://localhost:3000

## What's done for you
- `app.js` — wires everything together (Express, JSON body parsing, static files, the router).
- `db.js` — the shared connection pool, pointed at `bookstore`.
- `books.controller.js`'s `list` function and the matching `GET /` route — a worked example of the pool → query → JSON pattern to follow for the rest.

## What you need to build (see the assignment for exact point values)
1. Confirm `GET /books` works (already wired — just run it and check).
2. `getOne` in `books.controller.js`, returning 404 when the id is unknown.
3. `create`, validating `title` and `price` before inserting.
4. `update`, applying a PUT to price and/or stock.
5. `remove`, deleting by id.
6. `public/index.html`, `public/style.css` and the list/add half of `public/main.js`.
7. The delete half of `public/main.js`.
8. A short written answer (submit separately, not in code).

Every TODO comment in the stub files points to the task it belongs to. The
`list` example (task 1's pattern) and Lab Sheet 06 Sections 10.3–10.4 and
10.8 show the shape each piece should take, just adapted from `students`
to `books`.
