-- 03_test_rows.sql
-- CSS326 Lab 10: adds 100,000 extra courses so that index speed-ups become visible
-- (slide 9, Measuring the Speed-up). Run after 02_university_sample_data.sql.
-- On a table with only 5 rows, every query takes about 0 ms with or without an index.
USE css326_lab10;

SET SESSION cte_max_recursion_depth = 100000;

INSERT INTO courses (title, credits)
WITH RECURSIVE n AS (SELECT 1 AS i UNION ALL SELECT i + 1 FROM n WHERE i < 100000)
SELECT CONCAT('Course ', i), 3 FROM n;

SELECT COUNT(*) AS total_courses FROM courses;   -- expect 100005
