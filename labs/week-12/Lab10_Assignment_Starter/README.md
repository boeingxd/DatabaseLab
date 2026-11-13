# CSS326 Lab Assignment 10 – Performance & Security (bookstore starter)

## 1. Set up the database (MySQL Workbench, as root)
Run the three files in `sql/` in order. They create a separate `bookstore_lab10` database,
so your earlier bookstore data is left untouched:
1. `01_bookstore_schema.sql`  2. `02_bookstore_sample_data.sql`  3. `03_bookstore_bulk_data.sql`
(50,008 books, 5,005 customers, 100,008 orders – takes a few seconds).
Put your SQL answers in `sql/assignment10_starter.sql` (one section per question).

## 2. Run the web app
```bash
npm install
npm run dev                 # http://localhost:3000  (Ctrl + C stops it)
```
For now, put your own root password in `db.js` (Q6 and Q7 change that).
Open **http://localhost:3000**: **Connection** (who the app logs in as, Q6/Q7), **Query plan**
(EXPLAIN for the author search and the indexes on books, Q1/Q2), **Books by author** with the
server time of every request and attack buttons (Q1, Q2, Q5), **A customer's orders** with an
EXPLAIN of the join (Q3), and a **Responses** log that turns red when something is unsafe.

| Method | Route | Question |
|---|---|---|
| GET | `/api/books/search?author=...` | Q1, Q2 (speed), Q5 (injection) |
| GET | `/api/books/explain?author=...`, `/api/books/indexes` | Q1, Q2 – done for you |
| GET | `/api/customers/:id/orders`, `/api/customers/:id/orders/explain` | Q3 |
| GET | `/api/whoami` | Q6, Q7 – done for you |

The `TODO` comments mark where Q5, Q6 and Q7 change the code.

## 3. Submit
Your project folder (zip it, **without** `node_modules` and **without** your `.env`),
your `sql/assignment10_starter.sql`, and screenshots.
