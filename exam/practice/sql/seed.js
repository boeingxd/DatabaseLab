// The practice data: the Lab 10 university schema (+ year from Lab 9/11) and the
// Lab 10 assignment bookstore schema, with the Lab 11 / Assignment 3 rows.
// A few rows are there on purpose so the classic traps show up:
//   students 9-14 have no enrolments, Tanya has no major, one grade is NULL,
//   customer Mai has no orders, books 8-12 were never ordered.
module.exports = [
  `CREATE TABLE students (
     id    INT AUTO_INCREMENT PRIMARY KEY,
     name  VARCHAR(100) NOT NULL,
     year  INT,
     major VARCHAR(100)
   )`,
  `CREATE TABLE courses (
     id      INT AUTO_INCREMENT PRIMARY KEY,
     title   VARCHAR(150) NOT NULL,
     credits INT,
     seats   INT NOT NULL DEFAULT 30
   )`,
  `CREATE TABLE enrolments (
     id         INT AUTO_INCREMENT PRIMARY KEY,
     student_id INT NOT NULL,
     course_id  INT NOT NULL,
     grade      VARCHAR(2),
     UNIQUE KEY uq_student_course (student_id, course_id),
     FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
     FOREIGN KEY (course_id)  REFERENCES courses(id)  ON DELETE CASCADE
   )`,
  `CREATE TABLE books (
     id     INT AUTO_INCREMENT PRIMARY KEY,
     title  VARCHAR(200) NOT NULL,
     author VARCHAR(100) NOT NULL,
     price  DECIMAL(8,2) NOT NULL,
     stock  INT NOT NULL DEFAULT 0
   )`,
  `CREATE TABLE customers (
     id    INT AUTO_INCREMENT PRIMARY KEY,
     name  VARCHAR(100) NOT NULL,
     email VARCHAR(150) NOT NULL
   )`,
  `CREATE TABLE orders (
     id          INT AUTO_INCREMENT PRIMARY KEY,
     customer_id INT NOT NULL,
     book_id     INT NOT NULL,
     quantity    INT NOT NULL DEFAULT 1,
     FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
     FOREIGN KEY (book_id)     REFERENCES books(id)     ON DELETE CASCADE
   )`,
  `INSERT INTO students (id, name, year, major) VALUES
    (1,'Somchai',2,'Software Engineering'),(2,'Suda',3,'Data Science'),
    (3,'Anan',1,'Software Engineering'),(4,'Somchai',2,'Software Engineering'),
    (5,'Suda',3,'Data Science'),(6,'Anan',1,'Software Engineering'),
    (7,'Somchai',2,'Software Engineering'),(8,'Suda',3,'Data Science'),
    (9,'Anan',1,'Software Engineering'),(10,'Nicha',4,'Information Technology'),
    (11,'Krit',2,'Data Science'),(12,'Ploy',3,'Software Engineering'),
    (13,'Tanya',1,NULL),(14,'Wichai',4,'Data Science')`,
  `INSERT INTO courses (id, title, credits) VALUES
    (1,'Database Programming',3),(2,'Web Development',3),
    (3,'Algorithms',4),(4,'Statistics',3),(5,'Operating Systems',4)`,
  `INSERT INTO enrolments (id, student_id, course_id, grade) VALUES
    (1,1,1,'A'),(2,1,2,'B+'),(3,2,1,'A'),(4,2,4,'B'),(5,3,2,'C+'),
    (6,4,3,'B+'),(7,4,5,'A'),(8,5,1,'B'),(9,5,4,'A'),(10,6,2,'B+'),
    (11,6,3,'C'),(12,7,5,'B'),(13,8,1,'A'),(14,8,4,NULL)`,
  `UPDATE courses c
      SET seats = 30 - (SELECT COUNT(*) FROM enrolments e WHERE e.course_id = c.id)`,
  `INSERT INTO books (id, title, author, price, stock) VALUES
    (1,'Clean Code','Robert C. Martin',520,8),
    (2,'The Pragmatic Programmer','Andrew Hunt',610,5),
    (3,'Refactoring','Martin Fowler',700,3),
    (4,'Database Internals','Alex Petrov',850,4),
    (5,'SQL in 10 Minutes','Ben Forta',300,12),
    (6,'Designing Data-Intensive Applications','Martin Kleppmann',950,6),
    (7,'Head First SQL','Lynn Beighley',420,9),
    (8,'Learning MySQL','Seyed Tahaghoghi',640,2),
    (9,'Patterns of Enterprise Application Architecture','Martin Fowler',880,3),
    (10,'MySQL Crash Course','Ben Forta',360,10),
    (11,'The Mythical Man-Month','Fred Brooks',480,7),
    (12,'Working Effectively with Legacy Code','Michael Feathers',730,4)`,
  `INSERT INTO customers (id, name, email) VALUES
    (1,'Pim','pim@example.com'),(2,'Nate','nate@example.com'),
    (3,'Som','som@example.com'),(4,'Lek','lek@example.com'),(5,'Mai','mai@example.com')`,
  `INSERT INTO orders (id, customer_id, book_id, quantity) VALUES
    (1,1,1,1),(2,1,5,2),(3,2,3,1),(4,2,6,1),(5,3,2,3),(6,4,4,1),(7,4,7,2)`,
];
