-- =====================================================================
-- Assignment 11 - Q1 to Q4 : procedure, function, triggers (Workbench)
-- Run ONE block at a time: select the block, then Cmd+Shift+Enter.
-- =====================================================================
USE bookstore_lab11;

-- ---------- Q1: stored procedure (1.5 points) ----------
DROP PROCEDURE IF EXISTS place_order;
DELIMITER //
CREATE PROCEDURE place_order(IN p_customer INT, IN p_book INT, IN p_qty INT)
BEGIN
  INSERT INTO orders (customer_id, book_id, quantity)
  VALUES (p_customer, p_book, p_qty);
END //
DELIMITER ;

CALL place_order(4, 2, 1);
SELECT * FROM orders ORDER BY id;

-- ---------- Q2: stored function (1.5 points) ----------
DROP FUNCTION IF EXISTS order_count;
DELIMITER //
CREATE FUNCTION order_count(p_customer INT) RETURNS INT
READS SQL DATA
BEGIN
  DECLARE n INT;
  SELECT COUNT(*) INTO n FROM orders WHERE customer_id = p_customer;
  RETURN n;
END //
DELIMITER ;

SELECT id, name, order_count(id) AS orders FROM customers ORDER BY id;

-- ---------- Q3: AFTER INSERT trigger with a stock guard (1.5 points) ----------
DROP TRIGGER IF EXISTS after_order_insert;
DELIMITER //
CREATE TRIGGER after_order_insert AFTER INSERT ON orders
FOR EACH ROW
BEGIN
  UPDATE books SET stock = stock - NEW.quantity
   WHERE id = NEW.book_id AND stock >= NEW.quantity;
  IF ROW_COUNT() = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'not enough stock';
  END IF;
END //
DELIMITER ;

-- Q3a: an order reduces the stock with no extra query (3 -> 1)
SELECT id, title, stock FROM books WHERE id = 3;
CALL place_order(2, 3, 2);
SELECT id, title, stock FROM books WHERE id = 3;

-- Q3b: more than the stock -> Error 1644, and no order is created
CALL place_order(2, 5, 3);
SELECT * FROM orders WHERE book_id = 5;

-- ---------- Q4: AFTER DELETE trigger (1.5 points) ----------
DROP TRIGGER IF EXISTS after_order_delete;
DELIMITER //
CREATE TRIGGER after_order_delete AFTER DELETE ON orders
FOR EACH ROW
BEGIN
  UPDATE books SET stock = stock + OLD.quantity WHERE id = OLD.book_id;
END //
DELIMITER ;

-- delete the book 3 order from Q3 and show the stock is restored (1 -> 3)
SELECT id, title, stock FROM books WHERE id = 3;
SET @oid = (SELECT MAX(id) FROM orders WHERE book_id = 3);
DELETE FROM orders WHERE id = @oid;
SELECT id, title, stock FROM books WHERE id = 3;
SHOW TRIGGERS;
