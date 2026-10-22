-- CSS326 Lab Assignment #3: SQL CRUD & Querying
-- Scenario: online bookstore (simplified flat schema for this lab --
-- one row per order line, no separate order_items junction table).
-- Column names follow the tablename_id convention (book_id, customer_id,
-- order_id) and customers keep first_name/last_name split, matching the
-- Lab 2 design.

-- ---------------------------------------------------------------
-- 1. Create the database
-- ---------------------------------------------------------------
-- Dropping and recreating the whole database (instead of DROP TABLE on
-- each table) avoids foreign-key-ordering errors (e.g. 3730) from the
-- old Lab 2 order_items table referencing both orders and books.
DROP DATABASE IF EXISTS bookstore;
CREATE DATABASE bookstore;
USE bookstore;

CREATE TABLE books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title   VARCHAR(200) NOT NULL,
    author  VARCHAR(100) NOT NULL,
    price   DECIMAL(8,2) NOT NULL,
    stock   INT NOT NULL DEFAULT 0
);

CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name  VARCHAR(50) NOT NULL,
    last_name   VARCHAR(50) NOT NULL,
    email       VARCHAR(100) NOT NULL
);

CREATE TABLE orders (
    order_id    INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    book_id     INT NOT NULL,
    quantity    INT NOT NULL,
    CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

DESCRIBE books;   -- screenshot this results grid

-- ---------------------------------------------------------------
-- 2. Fill the database
-- ---------------------------------------------------------------
INSERT INTO books (title, author, price, stock) VALUES
 ('Clean Code','Robert C. Martin',520,8),
 ('The Pragmatic Programmer','Andrew Hunt',610,5),
 ('Refactoring','Martin Fowler',700,3),
 ('Database Internals','Alex Petrov',850,4),
 ('SQL in 10 Minutes','Ben Forta',300,12),
 ('Designing Data-Intensive Applications','Martin Kleppmann',950,6),
 ('Head First SQL','Lynn Beighley',420,9),
 ('Learning MySQL','Seyed Tahaghoghi',640,2),
 ('Patterns of Enterprise Application Architecture','Martin Fowler',880,3),
 ('MySQL Crash Course','Ben Forta',360,10);

-- the assignment's seed data only gives single first names, so last_name
-- is left blank here (schema keeps first_name/last_name split anyway)
INSERT INTO customers (first_name, last_name, email) VALUES
 ('Pim','',  'pim@example.com'),
 ('Nate','', 'nate@example.com'),
 ('Som','',  'som@example.com'),
 ('Lek','',  'lek@example.com');

-- customer_id 1..4, book_id 1..10 (from the order above)
INSERT INTO orders (customer_id, book_id, quantity) VALUES
 (1,1,1),(1,5,2),(2,3,1),(2,6,1),(3,2,3),(4,4,1),(4,7,2);

-- two more books of my own, single multi-row INSERT
INSERT INTO books (title, author, price, stock) VALUES
 ('The Mythical Man-Month','Fred Brooks',480,7),
 ('Working Effectively with Legacy Code','Michael Feathers',730,4);

SELECT * FROM books;   -- screenshot this results grid

-- ---------------------------------------------------------------
-- 3. Read, filter and de-duplicate
-- ---------------------------------------------------------------
SELECT title, price FROM books WHERE price > 500;

SELECT DISTINCT author FROM books;

-- ---------------------------------------------------------------
-- 4. Patterns, lists and ranges
-- ---------------------------------------------------------------
-- customers whose first name starts with 'P'
SELECT * FROM customers WHERE first_name LIKE 'P%';

-- books priced between 400 and 700, sorted low to high
SELECT * FROM books WHERE price BETWEEN 400 AND 700 ORDER BY price;

-- books by Martin Fowler or Ben Forta
SELECT * FROM books WHERE author IN ('Martin Fowler', 'Ben Forta');

-- ---------------------------------------------------------------
-- 5. Summarise and group
-- ---------------------------------------------------------------
SELECT COUNT(*) AS num_books, SUM(stock) AS total_stock, AVG(price) AS avg_price
FROM books;

-- authors with more than one book
SELECT author, COUNT(*) AS num_books
FROM books
GROUP BY author
HAVING COUNT(*) > 1;

-- ---------------------------------------------------------------
-- 6. Mathematical functions
-- ---------------------------------------------------------------
SELECT title, ROUND(price * 1.07, 2) AS price_with_vat FROM books;

SELECT ABS(-42) AS abs_val, POWER(2, 10) AS power_val, SQRT(144) AS sqrt_val;

-- ---------------------------------------------------------------
-- 7. Utility functions
-- ---------------------------------------------------------------
SELECT VERSION();
SELECT NOW();

SELECT CONCAT(title, ' - ', author) AS label FROM books;

-- ---------------------------------------------------------------
-- 8. Change and remove safely
-- ---------------------------------------------------------------
-- increase Clean Code's price by 10%
UPDATE books SET price = price * 1.10 WHERE book_id = 1;

-- confirm the row before deleting it
SELECT * FROM orders WHERE order_id = 7;
DELETE FROM orders WHERE order_id = 7;

-- ---------------------------------------------------------------
-- 9. Keys and indexes
-- ---------------------------------------------------------------
ALTER TABLE orders
    ADD CONSTRAINT fk_orders_book FOREIGN KEY (book_id) REFERENCES books(book_id);

-- this insert fails with Error Code 1452 (no book with book_id 999) -- expected
INSERT INTO orders (customer_id, book_id, quantity) VALUES (1, 999, 1);

CREATE INDEX idx_orders_customer_id ON orders(customer_id);

-- ---------------------------------------------------------------
-- 10. Join the tables
-- ---------------------------------------------------------------
-- every order with customer name, book title and quantity, filtered
-- to Pim's orders, sorted by book title
SELECT CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
       b.title AS book_title,
       o.quantity
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN books b ON o.book_id = b.book_id
WHERE c.first_name = 'Pim'
ORDER BY b.title;   -- screenshot this results grid

-- ---------------------------------------------------------------
-- 11. Column types (short answer)
-- ---------------------------------------------------------------
-- published_date -> DATE
--   only a calendar date is needed (no time-of-day component), and DATE
--   sorts/filters correctly with range queries like BETWEEN or ORDER BY.
--
-- isbn -> CHAR(13)
--   ISBN-13 codes are a fixed 13 characters and can start with a leading
--   zero, so a fixed-width string type (not INT) preserves the exact
--   digits without losing leading zeros or implying it's used for math.
