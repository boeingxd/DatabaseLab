-- CSS326 Lab Assignment #2: Data Modeling & Schema Design
-- Scenario: online bookstore (books, customers, orders, order line items)
-- Normalized to 3NF. Import this into MySQL Workbench via:
--   File > Import > Reverse Engineer MySQL Create Script
-- to auto-generate the EER diagram for Question 4/6.

CREATE DATABASE IF NOT EXISTS bookstore;
USE bookstore;

-- ---------------------------------------------------------------
-- customers
-- ---------------------------------------------------------------
CREATE TABLE customers (
    customer_id   INT AUTO_INCREMENT,
    first_name    VARCHAR(50)  NOT NULL,
    last_name     VARCHAR(50)  NOT NULL,
    email         VARCHAR(100) NOT NULL,
    PRIMARY KEY (customer_id),
    UNIQUE KEY uq_customers_email (email)
);

-- ---------------------------------------------------------------
-- books
-- ---------------------------------------------------------------
CREATE TABLE books (
    book_id        INT AUTO_INCREMENT,
    title          VARCHAR(200)   NOT NULL,
    author         VARCHAR(100)   NOT NULL,
    price          DECIMAL(8,2)   NOT NULL,
    stock_quantity INT            NOT NULL DEFAULT 0,
    PRIMARY KEY (book_id)
);

-- ---------------------------------------------------------------
-- orders  (1 customer : N orders)
-- ---------------------------------------------------------------
CREATE TABLE orders (
    order_id     INT AUTO_INCREMENT,
    customer_id  INT NOT NULL,
    order_date   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (order_id),
    KEY fk_orders_customer_idx (customer_id),
    CONSTRAINT fk_orders_customer
        FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- ---------------------------------------------------------------
-- order_items  (junction table resolving the N:N between
-- orders and books -- one row per book on one order)
-- ---------------------------------------------------------------
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT,
    order_id      INT NOT NULL,
    book_id       INT NOT NULL,
    quantity      INT NOT NULL,
    unit_price    DECIMAL(8,2) NOT NULL,   -- price at time of sale (snapshot)
    PRIMARY KEY (order_item_id),
    KEY fk_orderitems_order_idx (order_id),
    KEY fk_orderitems_book_idx (book_id),
    CONSTRAINT fk_orderitems_order
        FOREIGN KEY (order_id) REFERENCES orders (order_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_orderitems_book
        FOREIGN KEY (book_id) REFERENCES books (book_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    UNIQUE KEY uq_order_book (order_id, book_id)  -- one line per book per order
);

-- line_total (quantity * unit_price) is a DERIVED attribute:
-- computed on the fly, not stored, e.g.:
--   SELECT *, quantity * unit_price AS line_total FROM order_items;
