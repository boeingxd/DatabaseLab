START TRANSACTION;
UPDATE courses SET seats = seats - 1 WHERE id = 1;
INSERT INTO enrolments (student_id, course_id) VALUES (3, 1);
COMMIT; -- make both changes permanent
-- ROLLBACK; -- ...or undo both, as if nothing happened

SELECT id, title, seats FROM courses; 