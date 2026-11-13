-- 02_bookstore_sample_data.sql
-- CSS326 Lab Assignment 10: a few readable rows. Run after 01_bookstore_schema.sql.
USE bookstore_lab10;

INSERT INTO books (title, author, price, stock) VALUES
  ('SQL in 10 Minutes', 'Ben Forta', 590.00, 12),
  ('MySQL Crash Course', 'Ben Forta', 650.00, 8),
  ('Learning SQL', 'Alan Beaulieu', 890.00, 5),
  ('Database Design for Mere Mortals', 'Michael Hernandez', 1200.00, 3),
  ('Node.js Design Patterns', 'Mario Casciaro', 1450.00, 6),
  ('Eloquent JavaScript', 'Marijn Haverbeke', 750.00, 10),
  ('High Performance MySQL', 'Silvia Botros', 1690.00, 4),
  ('Web Security for Developers', 'Malcolm McDonald', 980.00, 7);

INSERT INTO customers (name, email) VALUES
  ('Suda Srisawat', 'suda@example.com'),
  ('Anan Pongsak', 'anan@example.com'),
  ('Malee Chaiyaporn', 'malee@example.com'),
  ('Wichai Boonmee', 'wichai@example.com'),
  ('Nok Thanawat', 'nok@example.com');

INSERT INTO orders (customer_id, book_id, quantity) VALUES
  (1, 1, 1), (1, 3, 2), (2, 2, 1), (2, 7, 1),
  (3, 1, 3), (3, 5, 1), (4, 6, 2), (5, 8, 1);
