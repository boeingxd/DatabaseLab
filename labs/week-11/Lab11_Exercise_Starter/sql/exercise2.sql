-- =====================================================================
-- Lab 11 - Exercise 2 : triggers keep the seats in step
-- =====================================================================
USE lab11;

-- Step 1: Exercise 1 inserted an enrolment WITHOUT taking a seat, so
-- re-sync the free seats first (same statement as Lab 9). Done for you.
UPDATE courses c
   SET seats = 30 - (SELECT COUNT(*) FROM enrolments e WHERE e.course_id = c.id);
SELECT id, title, seats FROM courses;

-- Step 2: an AFTER INSERT trigger on enrolments that takes one seat
--         from the course of the new row (NEW.course_id).
--         Guard it like Lab 9 (AND seats > 0); if ROW_COUNT() = 0 no seat
--         was free, so stop the insert with a SIGNAL.
DROP TRIGGER IF EXISTS after_enrolment_insert;
DELIMITER //
CREATE TRIGGER after_enrolment_insert
AFTER INSERT ON enrolments
FOR EACH ROW
BEGIN
  UPDATE courses SET seats = seats - 1 WHERE id = NEW.course_id AND seats > 0;
  IF ROW_COUNT() = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'course is full';
  END IF;
END //
DELIMITER ;

-- Step 3: test it - insert one enrolment and watch the seats drop by 1
SELECT seats FROM courses WHERE id = 3;
INSERT INTO enrolments (student_id, course_id) VALUES (9, 3);
SELECT seats FROM courses WHERE id = 3;

-- Step 4: an AFTER DELETE trigger that gives the seat back (use OLD.course_id)
DROP TRIGGER IF EXISTS after_enrolment_delete;
DELIMITER //
CREATE TRIGGER after_enrolment_delete
AFTER DELETE ON enrolments
FOR EACH ROW
BEGIN
  UPDATE courses SET seats = seats + 1 WHERE id = OLD.course_id;
END //
DELIMITER ;

DELETE FROM enrolments WHERE student_id = 9 AND course_id = 3;
SELECT seats FROM courses WHERE id = 3;     -- back where it started?

-- Step 5: a full course - the trigger must refuse, and the INSERT is undone
UPDATE courses SET seats = 0 WHERE id = 5;
INSERT INTO enrolments (student_id, course_id) VALUES (9, 5);   -- expect Error 1644
SELECT * FROM enrolments WHERE student_id = 9;                  -- no course 5?
-- put course 5 back
UPDATE courses c
   SET seats = 30 - (SELECT COUNT(*) FROM enrolments e WHERE e.course_id = c.id)
 WHERE c.id = 5;

-- Step 6: list your triggers
SHOW TRIGGERS;

-- Why document triggers: they run silently on every INSERT/DELETE, so the app code never shows
-- that seats change or that 'course is full' can be raised; documenting them stops teammates
-- from duplicating the rule (as the old Lab 9 Node code did: one enrolment took two seats).
