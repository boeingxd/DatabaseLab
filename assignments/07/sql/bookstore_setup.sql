-- =====================================================================
-- CSS326 Lab Assignment 9 - Transactions : bookstore schema (MySQL 8)
-- Run ONCE in MySQL Workbench. It (re)creates a fresh `bookstore_lab9`
-- database so your earlier bookstore data is left untouched.
--   books(id, title, author, price, stock)
--   customers(id, name, email)
--   orders(id, customer_id, book_id, quantity)
-- The foreign keys matter for Q4: an order that points to a customer or
-- book that does not exist is REJECTED by the database.
-- =====================================================================
CREATE DATABASE IF NOT EXISTS bookstore_lab9;
USE bookstore_lab9;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS books;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE books (
  id     INT           NOT NULL AUTO_INCREMENT,
  title  VARCHAR(150)  NOT NULL,
  author VARCHAR(100)  NOT NULL,
  price  DECIMAL(8,2)  NOT NULL,
  stock  INT           NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
) ENGINE = InnoDB;

CREATE TABLE customers (
  id    INT          NOT NULL AUTO_INCREMENT,
  name  VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_customers_email (email)
) ENGINE = InnoDB;

CREATE TABLE orders (
  id          INT NOT NULL AUTO_INCREMENT,
  customer_id INT NOT NULL,
  book_id     INT NOT NULL,
  quantity    INT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES customers (id),
  CONSTRAINT fk_orders_book     FOREIGN KEY (book_id)     REFERENCES books (id),
  CONSTRAINT chk_orders_qty CHECK (quantity > 0)
) ENGINE = InnoDB;

INSERT INTO books (id, title, author, price, stock) VALUES
 (1, 'Database System Concepts',     'Silberschatz', 1450.00, 10),
 (2, 'Learning SQL',                 'Beaulieu',      890.00,  5),
 (3, 'Node.js Design Patterns',      'Casciaro',     1250.00,  3),
 (4, 'Clean Code',                   'Martin',        990.00,  8),
 (5, 'Eloquent JavaScript',          'Haverbeke',     750.00,  1),
 (6, 'Designing Data-Intensive Apps','Kleppmann',    1690.00,  0);

INSERT INTO customers (id, name, email) VALUES
 (1, 'Nicha Srisuk',    'nicha@example.com'),
 (2, 'Krit Wongsa',     'krit@example.com'),
 (3, 'Ploy Chaiyaporn', 'ploy@example.com'),
 (4, 'Tanya Boonmee',   'tanya@example.com');

INSERT INTO orders (id, customer_id, book_id, quantity) VALUES
 (1, 1, 1, 1),
 (2, 2, 4, 2),
 (3, 3, 2, 1);

SELECT 'bookstore_lab9 ready' AS status;
