-- =====================================================================
-- Lab 11 - Exercise 1 : a procedure and a function (MySQL Workbench)
-- Run each block separately (highlight it, then Ctrl/Cmd + Shift + Enter)
-- and look at the result grid after every step.
-- Keep the DELIMITER lines around every CREATE PROCEDURE / FUNCTION.
-- =====================================================================
USE lab11;

-- Step 1: a PROCEDURE enrol_student(IN p_student BIGINT, IN p_course INT)
--         that inserts one row into enrolments.
DROP PROCEDURE IF EXISTS enrol_student;
DELIMITER //
CREATE PROCEDURE enrol_student(IN p_student BIGINT, IN p_course INT)
BEGIN
  INSERT INTO enrolments (student_id, course_id) VALUES (p_student, p_course);
END //
DELIMITER ;

-- Step 2: CALL it to enrol student 3 in course 1, then check the new row
CALL enrol_student(3, 1);
SELECT * FROM enrolments WHERE student_id = 3 ORDER BY course_id;

-- Step 3: a FUNCTION course_count(p_student BIGINT) RETURNS INT that
--         returns how many courses the student is enrolled in.
--         Keep READS SQL DATA - without it MySQL 8 refuses (error 1418).
DROP FUNCTION IF EXISTS course_count;
DELIMITER //
CREATE FUNCTION course_count(p_student BIGINT) RETURNS INT
READS SQL DATA
BEGIN
  DECLARE n INT;
  SELECT COUNT(*) INTO n FROM enrolments WHERE student_id = p_student;
  RETURN n;
END //
DELIMITER ;

-- Step 4: use the function in a SELECT: every student with their count
SELECT Id, name, course_count(Id) AS courses FROM students ORDER BY Id;

-- Step 5: check against a plain query - the numbers must match
SELECT s.Id, s.name, COUNT(e.id) AS courses
  FROM students s LEFT JOIN enrolments e ON e.student_id = s.Id
 GROUP BY s.Id, s.name ORDER BY s.Id;

-- Step 6: an OUT parameter. count_students(IN p_course INT, OUT p_total INT)
--         stores how many students take a course; CALL it with a session
--         variable and read it back.
DROP PROCEDURE IF EXISTS count_students;
DELIMITER //
CREATE PROCEDURE count_students(IN p_course INT, OUT p_total INT)
BEGIN
  SELECT COUNT(*) INTO p_total FROM enrolments WHERE course_id = p_course;
END //
DELIMITER ;

CALL count_students(1, @n);
SELECT @n AS students_in_course_1;
