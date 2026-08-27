SELECT * from students;
SELECT major FROM students;
SELECT * FROM students WHERE major = 'Botaneering';
SELECT name FROM students WHERE year >= 2 AND major ='Data Science';
INSERT INTO students (name, major, year) VALUE ('Boeing','Pineering',3);
DESCrIBE students;

INSERT INTO students (name, major, year) VALUES
('Somchai', 'Software Engineering', 2),
('Suda', 'Data Science', 3),
('Anan', 'Software Engineering', 1),
('Nicha', 'Information Technology',4),
('Krit', 'Data Science', 2),
('Ploy', 'Software Engineering', 3),
('Tanya', 'Information Technology',1),
('Wichai', 'Data Science', 4);


SELECT name, major FROM students WHERE major in ('Data Science', 'Information Technology');

SELECT * FROM students WHERE year BETWEEN 1 AND 3;


-- ex2
SELECT * FROM students;
SELECT * FROM students WHERE major = 'Software Engineering';
SELECT name FROM students WHERE year BETWEEN 2 AND 3;
SELECT * FROM students WHERE name LIKE '%a%'
ORDER BY id LIMIT 3;

-- ex 3
SELECT COUNT(*) FROM STUDENTS;
SELECT major, COUNT(*) AS amt_student FROM students GROUP BY major HAVING amt_student >= 3 ORDER BY amt_student DESC; 

-- misc
SELECT concat(name, " ", year) AS NAME_YEAR FROM students;
SELECT now();
SELECT version();

-- ex 4
SELECT * FROM students WHERE id = 4;
UPDATE students SET major = 'Mindfulness' WHERE id = 4;
UPDATE students SET year = year + 1 WHERE year = 1;

-- ex 5
SELECT s.name, c.title FROM enrollment e JOIN students s ON e.student_id = s.id JOIN courses c ON e.course_id = c.id;
SELECT * FROM enrollment;
SELECT * FROM courses;

SELECT CONCAT(s.name, ' | ', c.title) AS enrollment FROM enrollment e JOIN students s ON e.student_id= s.id JOIN courses c ON e.course_id = c.id ORDER BY s.name;

SELECT s.name, c.title FROM enrollment e JOIN students s ON e.student_id = s.id JOIN courses c ON e.course_id = c.id;
SELECT s.name, c.title FROM enrollment e JOIN students s ON e.student_id = s.id JOIN courses c ON e.course_id = c.id WHERE name = "Pinya";
SELECT s.name, c.title FROM enrollment e JOIN students s ON e.student_id = s.id JOIN courses c ON e.course_id = c.id ORDER BY name desc;

SELECT s.name, COUNT(c.title) AS course_amt FROM enrollment e
JOIN students s ON e.student_id = s.id
JOIN courses c ON e.course_id = c.id

GROUP BY s.name ORDER BY course_amt desc;

SELECT * FROM students;


