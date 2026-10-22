-- =====================================================================
-- CSS326 Lab 9 - Transactions : university schema setup (MySQL 8)
-- Run this ONCE in MySQL Workbench (File > Open SQL Script > Execute).
-- It rebuilds the students / courses / enrolments tables from Lab 3
-- data and adds the constraints today's lab relies on:
--   * UNIQUE (student_id, course_id)  -> a student can't enrol twice
--   * FOREIGN KEYs                     -> an enrolment must point to a
--                                         real student and a real course
-- NOTE: the seats column is NOT created here - you add it yourself
--       in Exercise 1 with ALTER TABLE.
-- =====================================================================
CREATE DATABASE IF NOT EXISTS lab9;
USE lab9;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS enrolments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;
SET FOREIGN_KEY_CHECKS = 1;

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

INSERT INTO courses VALUES
 (1,'Database Programming','3'),(2,'Web Development','3'),
 (3,'Algorithms','4'),(4,'Statistics','3'),(5,'Operating Systems','4');

INSERT INTO enrolments VALUES
 (1,1,1,'A'),(2,1,2,'B+'),(3,2,1,'A'),(4,2,4,'B'),(5,3,2,'C+'),
 (6,4,3,'B+'),(7,4,5,'A'),(8,5,1,'B'),(9,5,4,'A'),(10,6,2,'B+'),
 (11,6,3,'C'),(12,7,5,'B'),(13,8,1,'A'),(14,8,4,'A');

SELECT 'lab9 schema ready' AS status;
