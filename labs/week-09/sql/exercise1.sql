-- =====================================================================
-- Lab 9 - Exercise 1 : Run a transaction by hand (MySQL Workbench)
-- Run each block separately (highlight it, then Ctrl/Cmd + Shift + Enter)
-- and look at the result grid after every step.
-- =====================================================================
USE lab9;

-- Step 1: add the seats column (a course is 'full' when seats = 0)
--         Each course holds 30 students in total.
-- TODO: write the ALTER TABLE statement here (DEFAULT 30)


-- Step 1b: DEFAULT 30 gives EVERY course 30 free seats, but some students
-- are already enrolled. seats means FREE seats, so subtract them:
UPDATE courses c
   SET seats = 30 - (SELECT COUNT(*) FROM enrolments e WHERE e.course_id = c.id);

SELECT id, title, seats FROM courses;   -- e.g. course 1 has 4 students -> 26

-- Step 2: note the "before" state
SELECT id, title, seats FROM courses WHERE id = 1;
SELECT * FROM enrolments WHERE student_id = 3 ORDER BY course_id;

-- Step 3: take a seat and enrol student 3 in course 1, then ROLLBACK
START TRANSACTION;
-- TODO: reduce course 1's seats by one
-- TODO: insert an enrolment for student 3 in course 1
ROLLBACK;

-- Step 4: check again - what happened to seats and enrolments?
SELECT id, title, seats FROM courses WHERE id = 1;
SELECT * FROM enrolments WHERE student_id = 3 ORDER BY course_id;

-- Step 5: repeat Step 3, but finish with COMMIT instead of ROLLBACK
-- TODO


-- Step 6: check a final time
SELECT id, title, seats FROM courses WHERE id = 1;
SELECT * FROM enrolments WHERE student_id = 3 ORDER BY course_id;
