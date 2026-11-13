# CSS326 Lab Assignment 11 – Routines, Triggers & JSON (bookstore starter)

## 1. Set up the database (MySQL Workbench)
Execute `sql/bookstore_setup.sql`. It creates a fresh, separate `bookstore_lab11` database:

```
books(id, title, author, price, stock)
customers(id, name, email)
orders(id, customer_id, book_id, quantity)    -- FKs to customers and books
```
Q1–Q4 are done in Workbench with `sql/q1_q4_routines.sql`; Q6–Q7 (SQL part) with
`sql/q6_q7_json.sql`. Keep the `DELIMITER //` lines around routines and triggers.

## 2. Run the web app
```bash
npm install
npm run dev                 # http://localhost:3000
```
Before starting, open the **`.env`** file and set `DB_USER` / `DB_PASS` to your own MySQL login
(Lab 10). `db.js` reads its settings from `.env`; `.env.example` is the shareable template.
Open **http://localhost:3000**: books with stock (and, after Q7, format / pages and a
format filter), customers with their order count, a Place/Cancel order panel, and a log of
every response. After each order or cancel the log shows how the stock changed.

| Method | Route | Question |
|---|---|---|
| GET | `/books`, `/books?format=ebook` | Q7 – read / filter the JSON column |
| GET | `/customers` | Q5 – add `order_count(id)` |
| GET | `/customers/:id/orders` | done for you |
| POST | `/customers/:id/orders` body `{"book_id":1,"quantity":2}` | Q5 – `CALL place_order(?, ?, ?)` |
| DELETE | `/customers/:id/orders/:orderId` | Q5 – just the DELETE (the trigger restores stock) |

The order routes in `controllers/orderController.js` are your Lab 9 transactions. They
work, but once your Q3/Q4 triggers exist they change the stock **twice** – Q5 fixes that.
`requests.http` contains ready-made test requests.

## 3. Submit
Your project folder (zip it, **without** `node_modules`), your two SQL files, and one PDF
with your screenshots and short answers.
