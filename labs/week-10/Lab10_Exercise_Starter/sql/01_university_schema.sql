-- 01_university_schema.sql
-- CSS326 Lab 10: the university schema used in the slides, lab sheet and lab exercises.
-- Same tables as Lab 9 (including the seats column), in a fresh database for Lab 10.
-- Run this file first, as root, in MySQL Workbench.

CREATE DATABASE IF NOT EXISTS css326_lab10;
USE css326_lab10;

DROP TABLE IF EXISTS enrolments;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS courses;

CREATE TABLE students (
  id     INT AUTO_INCREMENT PRIMARY KEY,
  name   VARCHAR(100) NOT NULL,
  major  VARCHAR(100)
);

CREATE TABLE courses (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  title   VARCHAR(150) NOT NULL,
  credits INT,
  seats   INT NOT NULL DEFAULT 30   -- free seats, added in Lab 9
);

CREATE TABLE enrolments (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id  INT NOT NULL,
  grade      VARCHAR(2),
  UNIQUE KEY uq_student_course (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id)  REFERENCES courses(id)  ON DELETE CASCADE
);
