-- Exercise 4 (if time): Tuning
-- Database: css326_lab10 (with the 100,000 test rows from 03_test_rows.sql)
USE css326_lab10;

-- Part 1. A query that filters on two columns at once.
EXPLAIN ANALYZE
SELECT id, title, seats FROM courses
WHERE title LIKE 'Course 99%' AND seats > 0;
-- TODO: record type, key and actual time.

-- TODO: create a composite index on (title, seats).


-- TODO: run the same EXPLAIN ANALYZE again and compare.


-- Part 2. Fetch less: compare these two (look at the Duration column in Workbench).
SELECT *         FROM courses WHERE title LIKE 'Course 1%';
SELECT id, title FROM courses WHERE title LIKE 'Course 1%';
-- TODO: which one can be answered from the index alone? (Hint: EXPLAIN, look at Extra.)

-- Part 3. Do not wrap an indexed column in a function.
EXPLAIN SELECT * FROM courses WHERE LEFT(title, 8) = 'Course 9';
EXPLAIN SELECT * FROM courses WHERE title LIKE 'Course 9%';
-- TODO: which one uses the index? Why?
