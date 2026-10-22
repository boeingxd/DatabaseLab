-- 02_university_sample_data.sql
-- CSS326 Lab 10: sample rows for the university schema. Run after 01_university_schema.sql.
USE css326_lab10;

INSERT INTO students (name, major) VALUES
  ('Suda Srisawat', 'Computer Engineering'),
  ('Anan Pongsak', 'Information Technology'),
  ('Malee Chaiyaporn', 'Computer Engineering'),
  ('Wichai Boonmee', 'Software Engineering'),
  ('Nok Thanawat', 'Information Technology');

INSERT INTO courses (title, credits, seats) VALUES
  ('Database Programming Laboratory', 1, 30),
  ('Data Structures and Algorithms', 3, 30),
  ('Web Application Development', 3, 30),
  ('Operating Systems', 3, 30),
  ('Computer Networks', 3, 30);

INSERT INTO enrolments (student_id, course_id, grade) VALUES
  (1, 1, 'A'),
  (1, 2, 'B+'),
  (1, 3, NULL),
  (2, 1, 'B'),
  (2, 4, 'A-'),
  (3, 1, 'A'),
  (3, 2, 'A'),
  (3, 3, 'B'),
  (4, 5, NULL);
