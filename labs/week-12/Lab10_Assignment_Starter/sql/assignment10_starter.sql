-- CSS326 Lab Assignment 10: Hardening: Performance & Security
-- Name: ____________________   Student ID: 6722782164
-- Database: bookstore_lab10 (run sql/01, 02 and 03 first, as root)
USE bookstore_lab10;

-- Q1. Measure first (1.5 points)
EXPLAIN
SELECT id, title, author, price FROM books WHERE author = 'Ben Forta';

EXPLAIN ANALYZE
SELECT id, title, author, price FROM books WHERE author = 'Ben Forta';

-- Result BEFORE the index:
--   type = ALL, key = NULL, rows = 49685, actual time = 0.219..34.4 ms (34.4 ms total)
-- There is no index on author, so MySQL reads every row of books (a full table scan)
-- to find the 2 matching books.


-- Q2. Add an index (1.5 points)
CREATE INDEX idx_books_author ON books (author);

EXPLAIN
SELECT id, title, author, price FROM books WHERE author = 'Ben Forta';

EXPLAIN ANALYZE
SELECT id, title, author, price FROM books WHERE author = 'Ben Forta';

-- Result AFTER the index:
--   type = ref, key = idx_books_author, rows = 2, actual time = 0.0724..0.0768 ms
-- type changed from ALL (read every row) to ref (jump straight to the matching rows).
-- rows dropped from about 50,000 to 2 because the index is a sorted list of authors, so
-- MySQL knows where the matching rows are and does not have to scan the table.
-- Actual time dropped from 34.4 ms to 0.0768 ms, about 450 times faster.


-- Q3. Joins and foreign keys (1.5 points)
SHOW INDEX FROM orders;

EXPLAIN
SELECT o.id, c.name, o.quantity
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE c.id = 42;

-- The join uses the customer_id index on orders (type = ref, rows = 20).
-- It exists even though I never created it because orders.customer_id is a FOREIGN KEY.
-- MySQL creates an index on a foreign key column automatically, because it needs to look
-- up values quickly to enforce the rule (for example, finding all of a customer's orders).


-- Q4. The cost of indexes (1 point)
-- One downside of adding an index is that it slows down writing. Whenever an INSERT,
-- UPDATE or DELETE happens, MySQL has to update the affected indexes too, so every extra
-- index makes each change take longer. Indexes also take extra disk space.
-- To decide which columns are worth indexing, I would pick columns that are searched,
-- joined or sorted on often (used in WHERE, JOIN or ORDER BY) and that have many
-- different values, like a person's name. Primary keys do not need one because they are
-- indexed automatically.


-- Q5. Injection and the fix (2 points): controllers/bookController.js
-- BEFORE (unsafe): the user's text is glued into the SQL string.
--   const author = req.query.author || '';
--   const sql = "SELECT id, title, author, price FROM books WHERE author = '" + author + "'";
--   const [rows] = await pool.query(sql);
--
-- With the input  ' OR '1'='1  the SQL becomes:
--   SELECT id, title, author, price FROM books WHERE author = '' OR '1'='1'
-- The first ' closes the string early, so "OR '1'='1'" is read as part of the query
-- itself, not as data. '1'='1' is always true, so the WHERE matches every row and the
-- query returns all 50,008 books instead of none.
--
-- AFTER (safe): a ? placeholder, with the value passed separately.
--   const [rows] = await pool.execute(
--     'SELECT id, title, author, price FROM books WHERE author = ?',
--     [author]
--   );
--
-- Why it is safe: MySQL receives the query shape first, and the value separately. The
-- value is always treated as plain data, never as SQL, so quotes inside it cannot change
-- the query. The same input now just searches for a book whose author is literally
-- ' OR '1'='1, and returns 0 rows.
-- (I also fixed customerController.js the same way.)


-- Q6. Least privilege (2 points)
--     CREATE USER, GRANT, SHOW GRANTS, and the failed DROP test.


-- Q7. Protect secrets (1.5 points): .env, .gitignore and db.js.
--     Explain in a comment why .env must not be committed to Git.
--


-- Q8. Short answer (1 point): answer in a comment.
--
