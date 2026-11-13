-- 03_bookstore_bulk_data.sql
-- CSS326 Lab Assignment 10: adds 50,000 books, 5,000 customers and 100,000 orders,
-- so that full table scans become slow enough to measure. Run after 02.
-- Takes a few seconds.
USE bookstore_lab10;

SET SESSION cte_max_recursion_depth = 100000;

INSERT INTO books (title, author, price, stock)
WITH RECURSIVE n AS (SELECT 1 AS i UNION ALL SELECT i + 1 FROM n WHERE i < 50000)
SELECT CONCAT('Book ', i), CONCAT('Author ', 1 + i % 2000), 100 + i % 900, i % 50 FROM n;

INSERT INTO customers (name, email)
WITH RECURSIVE n AS (SELECT 1 AS i UNION ALL SELECT i + 1 FROM n WHERE i < 5000)
SELECT CONCAT('Customer ', i), CONCAT('customer', i, '@example.com') FROM n;

INSERT INTO orders (customer_id, book_id, quantity)
WITH RECURSIVE n AS (SELECT 1 AS i UNION ALL SELECT i + 1 FROM n WHERE i < 100000)
SELECT 1 + i % 5005, 1 + i % 50008, 1 + i % 3 FROM n;

SELECT (SELECT COUNT(*) FROM books)     AS books,      -- expect 50008
       (SELECT COUNT(*) FROM customers) AS customers,  -- expect 5005
       (SELECT COUNT(*) FROM orders)    AS orders;     -- expect 100008
