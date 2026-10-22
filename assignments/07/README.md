# CSS326 Lab Assignment 9 – Transactions (bookstore starter)

## 1. Set up the database (MySQL Workbench)
Execute `sql/bookstore_setup.sql`. It creates a separate `bookstore_lab9` database:

```
books(id, title, author, price, stock)
customers(id, name, email)
orders(id, customer_id, book_id, quantity)    -- FKs to customers and books
```
Q1 is done in Workbench – use `sql/q1_workbench.sql`.

## 2. Run the API
```bash
npm install
npm run dev                 # http://localhost:3000
```
Before starting, open `db.js` and set `user` / `password` to your own MySQL login.

| Method | Route | Question |
|---|---|---|
| GET | `/books`, `/books/:id` | check stock |
| GET | `/customers/:id/orders` | list orders |
| POST | `/customers/:id/orders` body `{"book_id":1,"quantity":2}` | Q2, Q3, Q4 |
| DELETE | `/customers/:id/orders/:orderId` | Q5 |

The routes in `controllers/orderController.js` work but are **not atomic**. Rewrite them as
described in the TODO comments. `requests.http` contains ready-made test requests
(use them for your Q4 and Q6 screenshots).

## 3. Submit
Your project folder (zip it, **without** `node_modules`) plus screenshots.
