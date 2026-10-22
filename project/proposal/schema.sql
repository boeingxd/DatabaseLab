-- SIIT Study Hub — CSS326 course-project schema (MySQL 8.x)
-- Import this directly into DrawSQL to auto-generate the ER diagram.
-- `User` is quoted with backticks because USER is a reserved word in MySQL.

CREATE TABLE `User` (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  siit_email VARCHAR(255) NOT NULL UNIQUE,
  handle VARCHAR(32) NOT NULL UNIQUE,
  real_name VARCHAR(100),
  password_hash VARCHAR(255) NOT NULL,
  salt VARBINARY(32) NOT NULL,
  program VARCHAR(50),
  year TINYINT,
  is_admin TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Course (
  course_id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE,
  title VARCHAR(150) NOT NULL,
  program VARCHAR(50),
  credits TINYINT
);

CREATE TABLE Instructor (
  instructor_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE CourseOffering (
  offering_id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  instructor_id INT,
  semester VARCHAR(10) NOT NULL,
  CONSTRAINT fk_offering_course FOREIGN KEY (course_id) REFERENCES Course(course_id),
  CONSTRAINT fk_offering_instructor FOREIGN KEY (instructor_id) REFERENCES Instructor(instructor_id),
  CONSTRAINT uq_offering UNIQUE (course_id, semester, instructor_id)
);

-- Supertype. ExamIntel and Materials are disjoint, total subtypes: every
-- Content row has exactly one matching row in exactly one of the two
-- subtype tables (enforced at the application layer via sp_submit_content).
CREATE TABLE Content (
  content_id INT AUTO_INCREMENT PRIMARY KEY,
  offering_id INT NOT NULL,
  author_id INT NOT NULL,
  content_type ENUM('exam_intel', 'materials') NOT NULL,
  -- Optional attachment (PDF, image, or text) shared by both subtypes — a
  -- scanned cheat sheet on an exam-intel report is just as real a case as a
  -- file on a materials entry, so this lives on the supertype rather than
  -- being duplicated on each subtype.
  file_path VARCHAR(255),
  credit_by_name TINYINT(1) NOT NULL DEFAULT 0,
  removed_at DATETIME,
  removed_by INT,
  removed_note VARCHAR(255),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_content_offering FOREIGN KEY (offering_id) REFERENCES CourseOffering(offering_id),
  CONSTRAINT fk_content_author FOREIGN KEY (author_id) REFERENCES `User`(user_id),
  CONSTRAINT fk_content_removedby FOREIGN KEY (removed_by) REFERENCES `User`(user_id)
);

-- Subtype: content_id is both this table's PK and its FK to Content —
-- DrawSQL will render this as a 1:1 relationship line, which is the
-- standard way to draw a shared-PK subtype in a tool with no native
-- ISA/triangle notation.
CREATE TABLE ExamIntel (
  content_id INT PRIMARY KEY,
  exam_type ENUM('midterm', 'final', 'quiz') NOT NULL,
  format JSON NOT NULL,
  topics JSON NOT NULL,
  allowed_aids ENUM('none', 'one_sheet', 'open_book', 'calculator'),
  duration_min SMALLINT,
  time_pressure TINYINT NOT NULL,
  difficulty TINYINT NOT NULL,
  advice TEXT,
  CONSTRAINT fk_examintel_content FOREIGN KEY (content_id) REFERENCES Content(content_id),
  CONSTRAINT chk_examintel_pressure CHECK (time_pressure BETWEEN 1 AND 5),
  CONSTRAINT chk_examintel_difficulty CHECK (difficulty BETWEEN 1 AND 5)
);

-- body_md is required unless the parent Content row has a file_path set.
-- That can't be a table CHECK here — MySQL CHECK constraints may only
-- reference columns in their own table, and file_path now lives on Content
-- — so this rule is enforced in sp_submit_content instead.
CREATE TABLE Materials (
  content_id INT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  type ENUM('summary', 'cheat_sheet', 'notes', 'worked_problems') NOT NULL,
  body_md TEXT,
  CONSTRAINT fk_materials_content FOREIGN KEY (content_id) REFERENCES Content(content_id)
);

CREATE TABLE Vote (
  vote_id INT AUTO_INCREMENT PRIMARY KEY,
  content_id INT NOT NULL,
  user_id INT NOT NULL,
  value TINYINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_vote_content FOREIGN KEY (content_id) REFERENCES Content(content_id),
  CONSTRAINT fk_vote_user FOREIGN KEY (user_id) REFERENCES `User`(user_id),
  CONSTRAINT uq_vote UNIQUE (content_id, user_id),
  CONSTRAINT chk_vote_value CHECK (value IN (-1, 1))
);

CREATE TABLE Report (
  report_id INT AUTO_INCREMENT PRIMARY KEY,
  content_id INT NOT NULL,
  reporter_id INT NOT NULL,
  reason VARCHAR(255) NOT NULL,
  resolved TINYINT(1) NOT NULL DEFAULT 0,
  resolved_at DATETIME,
  resolved_by INT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_report_content FOREIGN KEY (content_id) REFERENCES Content(content_id),
  CONSTRAINT fk_report_reporter FOREIGN KEY (reporter_id) REFERENCES `User`(user_id),
  CONSTRAINT fk_report_resolvedby FOREIGN KEY (resolved_by) REFERENCES `User`(user_id),
  CONSTRAINT uq_report UNIQUE (content_id, reporter_id)
);
