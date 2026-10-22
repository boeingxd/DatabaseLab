-- =====================================================================
-- CSS326 Lab 11 - Stored Routines, Triggers & NoSQL : setup (MySQL 8)
-- Run this ONCE in MySQL Workbench (File > Open SQL Script > Execute).
-- It (re)creates a fresh `lab11` database with the students / courses /
-- enrolments data from Lab 3, the constraints from Lab 9, and the
-- seats column from Lab 9 (seats = FREE seats, capacity 30).
-- Running it again resets everything, including your procedures,
-- functions and triggers - handy if you want to start over.
-- NOTE: the routines, triggers and the JSON column are NOT created here -
--       you write them yourself in Exercises 1, 2 and 4.
-- =====================================================================
DROP DATABASE IF EXISTS lab11;
CREATE DATABASE lab11;
USE lab11;

CREATE TABLE students (
  Id    BIGINT       NOT NULL,
  name  VARCHAR(100) NOT NULL,
  year  INT          DEFAULT NULL,
  major VARCHAR(45)  DEFAULT NULL,
  PRIMARY KEY (Id)
) ENGINE = InnoDB;

CREATE TABLE courses (
  id     INT          NOT NULL AUTO_INCREMENT,
  title  VARCHAR(100) NOT NULL,
  credit CHAR(2)      DEFAULT NULL,
  seats  INT          NOT NULL DEFAULT 30,      -- FREE seats (from Lab 9)
  PRIMARY KEY (id)
) ENGINE = InnoDB;

CREATE TABLE enrolments (
  id         INT     NOT NULL AUTO_INCREMENT,
  student_id BIGINT  NOT NULL,            -- BIGINT to match students.Id
  course_id  INT     NOT NULL,
  grade      CHAR(2) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_student_course (student_id, course_id),
  CONSTRAINT fk_enrol_student FOREIGN KEY (student_id) REFERENCES students (Id),
  CONSTRAINT fk_enrol_course  FOREIGN KEY (course_id)  REFERENCES courses (id)
) ENGINE = InnoDB;

INSERT INTO students VALUES
 (1,'Somchai',2,'Software Engineering'),(2,'Suda',3,'Data Science'),
 (3,'Anan',1,'Software Engineering'),(4,'Somchai',2,'Software Engineering'),
 (5,'Suda',3,'Data Science'),(6,'Anan',1,'Software Engineering'),
 (7,'Somchai',2,'Software Engineering'),(8,'Suda',3,'Data Science'),
 (9,'Anan',1,'Software Engineering'),(10,'Nicha',4,'Information Technology'),
 (11,'Krit',2,'Data Science'),(12,'Ploy',3,'Software Engineering'),
 (13,'Tanya',1,'Information Technology'),(14,'Wichai',4,'Data Science');

INSERT INTO courses (id, title, credit) VALUES
 (1,'Database Programming','3'),(2,'Web Development','3'),
 (3,'Algorithms','4'),(4,'Statistics','3'),(5,'Operating Systems','4');

INSERT INTO enrolments VALUES
 (1,1,1,'A'),(2,1,2,'B+'),(3,2,1,'A'),(4,2,4,'B'),(5,3,2,'C+'),
 (6,4,3,'B+'),(7,4,5,'A'),(8,5,1,'B'),(9,5,4,'A'),(10,6,2,'B+'),
 (11,6,3,'C'),(12,7,5,'B'),(13,8,1,'A'),(14,8,4,'A');

-- seats = FREE seats: capacity 30 minus the students already enrolled
UPDATE courses c
   SET seats = 30 - (SELECT COUNT(*) FROM enrolments e WHERE e.course_id = c.id);

SELECT id, title, seats FROM courses;   -- 26, 27, 28, 27, 28
SELECT 'lab11 schema ready' AS status;
