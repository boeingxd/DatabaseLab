// The question bank. Three kinds:
//   query - your last SELECT is compared with the model answer's result
//   state - your SQL changes something; the hidden `verify` statements check the effect
//   mcq   - a concept question, checked in the browser
// `must` / `mustNot` are [regex, message] pairs for questions that ask for a specific technique.
const COLS = (t) => `SELECT column_name, column_type, is_nullable, column_default, extra
  FROM information_schema.columns WHERE table_schema = 'sql_practice' AND table_name = '${t}' ORDER BY column_name`;

module.exports = [
  // ============================== EASY ==============================
  {
    id: 'e1', level: 'easy', topic: 'SELECT / WHERE', type: 'query',
    prompt: 'Show the `title` and `price` of every book that costs more than 500.',
    solution: `SELECT title, price FROM books WHERE price > 500;`,
    hints: ['You need two columns from one table, and a filter on rows. Which clause filters rows?',
      'SELECT ___, ___ FROM books WHERE ___ > 500;'],
    explain: 'SELECT picks the columns, FROM names the table, WHERE keeps only the rows where the condition is true. MySQL reads FROM first, then WHERE, then SELECT.',
    trap: '`>` does not include 500 itself. "At least 500" would be `>=`.',
    wrong: { sql: `SELECT * FROM books WHERE price > 500;`, why: '`*` returns all five columns; the question asks for two. In an exam, return exactly the columns asked for.' },
  },
  {
    id: 'e2', level: 'easy', topic: 'ORDER BY', type: 'query', ordered: true,
    prompt: 'List the `name` and `year` of every student, highest year first. Inside the same year, sort by name A to Z.',
    solution: `SELECT name, year FROM students ORDER BY year DESC, name ASC;`,
    hints: ['ORDER BY can take more than one column; each one has its own direction.',
      'SELECT name, year FROM students ORDER BY ___ DESC, ___ ASC;'],
    explain: 'ORDER BY sorts by the first column; the second column only decides ties. The default direction is ASC, so you must write DESC for "highest first".',
    trap: 'DESC applies only to the column it follows. `ORDER BY year, name DESC` sorts year ascending.',
    wrong: { sql: `SELECT name, year FROM students ORDER BY year, name;`, why: 'No DESC, so year is sorted lowest first (ASC is the default).' },
  },
  {
    id: 'e3', level: 'easy', topic: 'LIKE', type: 'query',
    prompt: 'Show the `title` of every book whose title contains the text `SQL` anywhere.',
    solution: `SELECT title FROM books WHERE title LIKE '%SQL%';`,
    hints: ['LIKE matches a pattern. Which wildcard means "any number of characters"?',
      "SELECT title FROM books WHERE title LIKE '_SQL_';   -- replace each _ with the right wildcard"],
    explain: '`%` stands for zero or more characters, so `%SQL%` means "anything, then SQL, then anything". That is why "MySQL Crash Course" and "Head First SQL" both match.',
    trap: "`LIKE 'SQL%'` only matches titles that START with SQL. `_` is exactly one character, not any number.",
    wrong: { sql: `SELECT title FROM books WHERE title LIKE 'SQL%';`, why: 'Without the leading %, only titles beginning with SQL match (just one book).' },
  },
  {
    id: 'e4', level: 'easy', topic: 'BETWEEN', type: 'query', ordered: true,
    prompt: 'Show `title` and `price` of books priced from 420 to 700, cheapest first. A book that costs exactly 420 or exactly 700 counts.',
    solution: `SELECT title, price FROM books WHERE price BETWEEN 420 AND 700 ORDER BY price;`,
    hints: ['There is a keyword for "from a to b" that includes both ends.',
      'SELECT title, price FROM books WHERE price BETWEEN ___ AND ___ ORDER BY ___;'],
    explain: '`BETWEEN 420 AND 700` means `price >= 420 AND price <= 700`. Both ends are included, so the 420 book and the 700 book are in the result.',
    trap: 'BETWEEN is inclusive. Writing `price > 420 AND price < 700` loses both edge books.',
    wrong: { sql: `SELECT title, price FROM books WHERE price > 420 AND price < 700 ORDER BY price;`, why: '> and < leave out the books at exactly 420 and 700.' },
  },
  {
    id: 'e5', level: 'easy', topic: 'IN', type: 'query',
    prompt: 'Show `title` and `author` for books written by `Martin Fowler` or `Ben Forta`.',
    solution: `SELECT title, author FROM books WHERE author IN ('Martin Fowler', 'Ben Forta');`,
    hints: ['You can write two conditions with OR, or use one keyword that takes a list.',
      "SELECT title, author FROM books WHERE author IN ('___', '___');"],
    explain: '`IN (a, b)` is short for `author = a OR author = b`. Text values need quotes.',
    trap: "Writing `author = 'Martin Fowler' OR 'Ben Forta'` is wrong: the second part is not a comparison.",
    wrong: { sql: `SELECT title, author FROM books WHERE author = 'Martin Fowler' AND author = 'Ben Forta';`, why: 'One row cannot have two authors at once, so AND returns nothing. "Either one" is OR / IN.' },
  },
  {
    id: 'e6', level: 'easy', topic: 'NULL', type: 'query',
    prompt: 'Show the `name` of every student who has no major recorded.',
    solution: `SELECT name FROM students WHERE major IS NULL;`,
    hints: ['"No value" is NULL. NULL cannot be compared with `=`.',
      'SELECT name FROM students WHERE major ___ NULL;'],
    explain: 'NULL means "unknown". Any comparison with NULL (`=`, `<>`, `>`) gives UNKNOWN, which WHERE treats as false. `IS NULL` is the only test that works.',
    trap: '`major = NULL` is never true, so it returns zero rows and no error.',
    wrong: { sql: `SELECT name FROM students WHERE major = NULL;`, why: '`= NULL` is never true, so you get no rows at all.' },
  },
  {
    id: 'e7', level: 'easy', topic: 'DISTINCT', type: 'query',
    prompt: 'List each different `author` in `books` once (no repeats).',
    solution: `SELECT DISTINCT author FROM books;`,
    hints: ['Two authors appear on more than one book. Which keyword removes duplicate rows?', 'SELECT ___ author FROM books;'],
    explain: 'DISTINCT removes rows that are completely identical in the selected columns. 12 books have 10 different authors.',
    trap: 'DISTINCT applies to the whole row. `SELECT DISTINCT author, title` would return all 12 rows again.',
    wrong: { sql: `SELECT author FROM books;`, why: 'Without DISTINCT, Martin Fowler and Ben Forta each appear twice.' },
  },
  {
    id: 'e8', level: 'easy', topic: 'Aggregates', type: 'query',
    prompt: 'In ONE row show: how many books there are, the total `stock`, and the average `price`.',
    solution: `SELECT COUNT(*), SUM(stock), AVG(price) FROM books;`,
    hints: ['Three aggregate functions, no GROUP BY: the whole table is one group.', 'SELECT COUNT(___), SUM(___), AVG(___) FROM books;'],
    explain: 'Aggregate functions squash many rows into one value. With no GROUP BY, all rows form a single group, so the result is exactly one row.',
    trap: 'You cannot put a normal column (like `title`) next to aggregates without GROUP BY.',
    wrong: { sql: `SELECT COUNT(*), SUM(price), AVG(stock) FROM books;`, why: 'The columns are swapped: the question wants total stock and average price.' },
  },
  {
    id: 'e9', level: 'easy', topic: 'COUNT and NULL', type: 'query',
    prompt: 'How many enrolments have a `grade` recorded? (One enrolment has no grade yet.)',
    solution: `SELECT COUNT(grade) FROM enrolments;`,
    hints: ['COUNT(*) and COUNT(column) are not the same thing when the column has NULLs.', 'SELECT COUNT(___) FROM enrolments;'],
    explain: '`COUNT(*)` counts rows (14). `COUNT(grade)` counts only rows where grade is not NULL (13). You could also write `COUNT(*) ... WHERE grade IS NOT NULL`.',
    trap: 'COUNT(*) counts rows; COUNT(col) skips NULL. SUM, AVG, MIN and MAX skip NULL too.',
    wrong: { sql: `SELECT COUNT(*) FROM enrolments;`, why: 'COUNT(*) counts every row, including the one with a NULL grade: 14, not 13.' },
  },
  {
    id: 'e10', level: 'easy', topic: 'LIKE', type: 'mcq',
    prompt: "Which name matches `name LIKE '_a%'` ?",
    options: ['Anan', 'Nate', 'Suda', 'Ploy'], answer: 1,
    hints: ['`_` is exactly ONE character. So what must the second letter be?'],
    explain: "`_` = exactly one character, then `a`, then `%` = anything. So the SECOND letter must be `a`: N-a-te. Anan has `a` first, not second.",
  },
  {
    id: 'e11', level: 'easy', topic: 'Design: 1:N', type: 'mcq',
    prompt: 'One customer places many orders; each order belongs to one customer. Where does the foreign key go?',
    options: ['`customers.order_id`', '`orders.customer_id`', 'In both tables', 'In a separate junction table'], answer: 1,
    hints: ['A cell holds one value. Which side has only ONE thing to point at?'],
    explain: 'The FK goes on the MANY side. Each order points at its one customer (`orders.customer_id`). A customer row could not hold many order ids in one cell (that would break 1NF). A junction table is only needed for many-to-many.',
  },

  // ============================== MEDIUM ==============================
  {
    id: 'm1', level: 'medium', topic: 'GROUP BY', type: 'query',
    prompt: 'For each `major`, show the major and how many students are in it.',
    solution: `SELECT major, COUNT(*) FROM students GROUP BY major;`,
    hints: ['"For each X" almost always means GROUP BY X.', 'SELECT major, COUNT(*) FROM students GROUP BY ___;'],
    explain: 'GROUP BY puts rows with the same major into one bucket; COUNT(*) then counts each bucket. Students with a NULL major form their own bucket.',
    trap: 'Every column in SELECT must be in GROUP BY or inside an aggregate.',
    wrong: { sql: `SELECT major, COUNT(major) FROM students GROUP BY major;`, why: 'COUNT(major) skips NULL, so the NULL group shows 0 instead of 1.' },
  },
  {
    id: 'm2', level: 'medium', topic: 'HAVING', type: 'query',
    prompt: 'Show each `author` who has more than one book, with their number of books.',
    solution: `SELECT author, COUNT(*) FROM books GROUP BY author HAVING COUNT(*) > 1;`,
    hints: ['You are filtering GROUPS (authors), not single rows. WHERE cannot do that.', 'SELECT author, COUNT(*) FROM books GROUP BY author HAVING ___ > 1;'],
    explain: 'WHERE runs before grouping, so the count does not exist yet. HAVING runs after grouping and can use aggregates. Order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY.',
    trap: '`WHERE COUNT(*) > 1` is an error (1111: invalid use of group function).',
    wrong: { sql: `SELECT author, COUNT(*) FROM books WHERE COUNT(*) > 1 GROUP BY author;`, why: 'WHERE cannot use an aggregate: the groups are not built yet when WHERE runs.' },
  },
  {
    id: 'm3', level: 'medium', topic: 'WHERE + HAVING', type: 'query',
    prompt: 'Look only at books that cost more than 700. For each author show the average price of those books, but keep only authors whose average is above 800.',
    solution: `SELECT author, AVG(price) FROM books WHERE price > 700 GROUP BY author HAVING AVG(price) > 800;`,
    hints: ['Two filters: one on single books (before grouping), one on the author average (after grouping).',
      'SELECT author, AVG(price) FROM books WHERE ___ GROUP BY author HAVING ___;'],
    explain: 'WHERE price > 700 throws away cheaper books first. Then the remaining rows are grouped per author, AVG is calculated, and HAVING removes groups whose average is 800 or less. Martin Fowler stays: only his 880 book is counted.',
    trap: 'Moving `price > 700` into HAVING is an error: after grouping there is no single `price` any more.',
    wrong: { sql: `SELECT author, AVG(price) FROM books GROUP BY author HAVING AVG(price) > 800;`, why: 'Without the WHERE, Martin Fowler\'s 700 book is included, his average drops to 790, and he disappears from the result.' },
  },
  {
    id: 'm4', level: 'medium', topic: 'INNER JOIN', type: 'query',
    prompt: 'For every order show the customer `name`, the book `title` and the `quantity`.',
    solution: `SELECT c.name, b.title, o.quantity
FROM orders o
JOIN customers c ON c.id = o.customer_id
JOIN books b ON b.id = o.book_id;`,
    hints: ['`orders` holds two foreign keys. Join it to each parent table.',
      'FROM orders o JOIN customers c ON c.id = o.___ JOIN books b ON b.id = o.___'],
    explain: 'Start from the table that has the foreign keys (orders). Each JOIN ... ON matches a foreign key to the primary key it points at. 7 orders, each with exactly one customer and one book, gives 7 rows.',
    trap: 'Forgetting an ON condition pairs every row with every row (7 × 5 × 12).',
    wrong: { sql: `SELECT c.name, b.title, o.quantity FROM orders o JOIN customers c ON c.id = o.id JOIN books b ON b.id = o.book_id;`, why: 'It joins `c.id = o.id` (the order number) instead of `o.customer_id`, so orders are matched to the wrong customers.' },
  },
  {
    id: 'm5', level: 'medium', topic: 'LEFT JOIN', type: 'query',
    must: [['LEFT\\s+(OUTER\\s+)?JOIN', 'Use a LEFT JOIN for this one.']],
    prompt: 'Show every customer `name` with the `id` of each of their orders. A customer with no orders must still appear, with NULL as the order id.',
    solution: `SELECT c.name, o.id FROM customers c LEFT JOIN orders o ON o.customer_id = c.id;`,
    hints: ['Which join keeps rows from the first table even when nothing matches?', 'FROM customers c LEFT JOIN orders o ON o.customer_id = ___'],
    explain: 'LEFT JOIN keeps every row of the LEFT table (customers). Mai has no orders, so she appears once with NULL on the orders side. Result: 7 matching rows + 1 for Mai = 8.',
    trap: 'The table you want to keep completely must be on the LEFT.',
    wrong: { sql: `SELECT c.name, o.id FROM customers c JOIN orders o ON o.customer_id = c.id;`, why: 'A plain (INNER) JOIN drops customers with no orders, so Mai disappears: 7 rows instead of 8.' },
  },
  {
    id: 'm6', level: 'medium', topic: 'LEFT JOIN + COUNT', type: 'query',
    prompt: 'For every student show `id`, `name` and how many courses they are enrolled in. Students with no enrolments must show 0.',
    solution: `SELECT s.id, s.name, COUNT(e.id)
FROM students s
LEFT JOIN enrolments e ON e.student_id = s.id
GROUP BY s.id, s.name;`,
    hints: ['Keep all students (LEFT JOIN), then count per student. Be careful WHAT you count.',
      'SELECT s.id, s.name, COUNT(e.___) FROM students s LEFT JOIN enrolments e ON ___ GROUP BY s.id, s.name;'],
    explain: 'A student with no enrolments still gets ONE row from the LEFT JOIN, filled with NULLs. `COUNT(*)` would count that row as 1. `COUNT(e.id)` skips NULL, so it gives the correct 0.',
    trap: 'LEFT JOIN + COUNT(*) never returns 0. Count a column from the RIGHT table.',
    wrong: { sql: `SELECT s.id, s.name, COUNT(*) FROM students s LEFT JOIN enrolments e ON e.student_id = s.id GROUP BY s.id, s.name;`, why: 'COUNT(*) counts the NULL-filled row, so students with no courses show 1 instead of 0.' },
  },
  {
    id: 'm7', level: 'medium', topic: 'Predict the rows', type: 'mcq',
    prompt: 'There are 14 students and 14 enrolment rows. 6 students have no enrolments. How many rows do `students JOIN enrolments` and `students LEFT JOIN enrolments` return (joined on student id)?',
    options: ['INNER 14, LEFT 14', 'INNER 14, LEFT 20', 'INNER 8, LEFT 14', 'INNER 20, LEFT 20'], answer: 1,
    hints: ['INNER gives one row per matching PAIR. LEFT adds one row for each left row with no match.'],
    explain: 'INNER JOIN returns one row per matching pair = one per enrolment = 14. LEFT JOIN returns those 14 plus one NULL-filled row for each of the 6 students without enrolments = 20.',
  },
  {
    id: 'm8', level: 'medium', topic: 'UPDATE', type: 'state',
    prompt: 'Raise the price of every book by `Ben Forta` by 10%.',
    solution: `UPDATE books SET price = price * 1.10 WHERE author = 'Ben Forta';`,
    verify: ['SELECT id, price FROM books ORDER BY id'],
    hints: ['UPDATE table SET column = new value WHERE which rows.', "UPDATE books SET price = price * ___ WHERE author = '___';"],
    explain: 'SET can use the old value on the right side (`price * 1.10`). WHERE decides which rows change; only the two Ben Forta books do.',
    trap: 'UPDATE without WHERE changes EVERY row. Write the WHERE first.',
    wrong: { sql: `UPDATE books SET price = price * 1.10;`, why: 'No WHERE: all 12 books got more expensive.' },
  },
  {
    id: 'm9', level: 'medium', topic: 'DELETE', type: 'state',
    prompt: 'Delete all orders that belong to customer 4.',
    solution: `DELETE FROM orders WHERE customer_id = 4;`,
    verify: ['SELECT id, customer_id FROM orders ORDER BY id'],
    hints: ['DELETE removes whole rows; you do not list columns.', 'DELETE FROM orders WHERE ___ = 4;'],
    explain: 'DELETE FROM table WHERE condition removes the rows that match. Check with a SELECT using the same WHERE first if you are unsure.',
    trap: 'DELETE without WHERE empties the table. Also: `id = 4` is the order number, not the customer.',
    wrong: { sql: `DELETE FROM orders WHERE id = 4;`, why: '`id` is the order number. That removes one order of customer 2 and leaves customer 4 untouched.' },
  },
  {
    id: 'm10', level: 'medium', topic: 'INSERT + DEFAULT', type: 'state',
    prompt: "Add a book: title `Learning SQL`, author `Alan Beaulieu`, price 550. Do not give an id or a stock value; let the table fill them in.",
    solution: `INSERT INTO books (title, author, price) VALUES ('Learning SQL', 'Alan Beaulieu', 550);`,
    verify: ['SELECT id, title, author, price, stock FROM books ORDER BY id'],
    hints: ['List only the columns you are supplying; the rest use AUTO_INCREMENT / DEFAULT.', "INSERT INTO books (___, ___, ___) VALUES ('Learning SQL', 'Alan Beaulieu', 550);"],
    explain: 'Columns left out of the list get their default: `id` is AUTO_INCREMENT (next number, 13) and `stock` has DEFAULT 0.',
    trap: 'The number and order of VALUES must match the column list exactly.',
    wrong: { sql: `INSERT INTO books (title, author, price, stock) VALUES ('Learning SQL', 'Alan Beaulieu', 550, 550);`, why: 'It supplies a stock value, so the DEFAULT 0 is not used.' },
  },
  {
    id: 'm11', level: 'medium', topic: 'ALTER TABLE', type: 'state',
    prompt: "Add a column `phone` to `customers`: text up to 20 characters, never NULL, with the default value `N/A`.",
    solution: `ALTER TABLE customers ADD COLUMN phone VARCHAR(20) NOT NULL DEFAULT 'N/A';`,
    verify: [COLS('customers'), 'SELECT id, phone FROM customers ORDER BY id'],
    hints: ['ALTER TABLE ... ADD COLUMN name type constraints.', "ALTER TABLE customers ADD COLUMN phone VARCHAR(20) ___ ___ 'N/A';"],
    explain: 'ADD COLUMN takes the same definition you would write in CREATE TABLE. Existing rows get the default, so all 5 customers now have phone = N/A.',
    trap: 'MODIFY COLUMN changes an existing column and must restate the whole definition; DROP COLUMN removes one.',
    wrong: { sql: `ALTER TABLE customers ADD COLUMN phone VARCHAR(20);`, why: 'No NOT NULL and no DEFAULT: existing customers get NULL instead of N/A.' },
  },
  {
    id: 'm12', level: 'medium', topic: 'Fix the query', type: 'query',
    prompt: 'This query should list majors that have at least 3 students, but it fails. Fix it.',
    starter: `SELECT major, COUNT(*) AS n\nFROM students\nWHERE n >= 3\nGROUP BY major;`,
    solution: `SELECT major, COUNT(*) AS n FROM students GROUP BY major HAVING COUNT(*) >= 3;`,
    hints: ['Two problems in one line: WHERE runs before the groups exist, and before the alias `n` exists.', 'Move the condition after GROUP BY: HAVING COUNT(*) >= 3'],
    explain: 'WHERE runs before GROUP BY and before SELECT, so neither the count nor the alias `n` exists yet. A condition on a group belongs in HAVING, which runs after grouping.',
    trap: 'WHERE cannot use aggregates or SELECT aliases.',
    wrong: { sql: `SELECT major, COUNT(*) AS n FROM students WHERE COUNT(*) >= 3 GROUP BY major;`, why: 'Still in WHERE: MySQL rejects an aggregate there (error 1111).' },
  },
  {
    id: 'm13', level: 'medium', topic: 'Normalization', type: 'mcq',
    prompt: 'Table `orders(order_id PK, customer_id, customer_email, book_id, quantity)`. `customer_email` depends on `customer_id`. Which normal form does this break, and what is the fix?',
    options: ['1NF: split the email into several rows', '2NF: make (order_id, customer_id) the key',
      '3NF: move `customer_email` to `customers`, keep only `customer_id`', 'None: it is already in 3NF'], answer: 2,
    hints: ['The key is a single column, so partial dependency is impossible. What does email depend on?'],
    explain: 'email depends on customer_id, which is NOT the key: a non-key column depending on another non-key column is a transitive dependency, so 3NF is broken. Fix: store email once in `customers` and keep only the FK. 2NF only matters with a composite key.',
  },

  // ============================== HARD ==============================
  {
    id: 'h1', level: 'hard', topic: 'Subquery with IN', type: 'query',
    must: [['\\bIN\\s*\\(', 'Use a subquery with IN for this one.']],
    prompt: 'Using a subquery with `IN`, show the `id` and `name` of every student enrolled in course 3.',
    solution: `SELECT id, name FROM students WHERE id IN (SELECT student_id FROM enrolments WHERE course_id = 3);`,
    hints: ['The inner query produces a LIST of student ids; the outer query keeps students whose id is in that list.',
      'SELECT id, name FROM students WHERE id IN (SELECT ___ FROM enrolments WHERE ___ = 3);'],
    explain: 'The subquery runs first and returns the student_id values for course 3 (4 and 6). The outer WHERE then keeps the students whose id is in that list.',
    trap: 'The subquery must return ONE column, and it must be the column you compare with (student_id, not id).',
    wrong: { sql: `SELECT id, name FROM students WHERE id IN (SELECT id FROM enrolments WHERE course_id = 3);`, why: 'The subquery returns enrolment ids (6 and 11), not student ids, so the wrong students are picked.' },
  },
  {
    id: 'h2', level: 'hard', topic: 'NOT EXISTS', type: 'query',
    must: [['NOT\\s+EXISTS', 'Use NOT EXISTS for this one.']],
    prompt: 'Using `NOT EXISTS`, show the `title` of every book that has never been ordered.',
    solution: `SELECT title FROM books b WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.book_id = b.id);`,
    hints: ['For each book, ask: "is there any order row for THIS book?" The subquery must mention the outer book.',
      'SELECT title FROM books b WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.book_id = ___);'],
    explain: 'The subquery is run once per book and uses that book\'s id (a correlated subquery). EXISTS is true if it finds at least one row; NOT EXISTS keeps the books where it finds none. What the subquery selects does not matter, so `SELECT 1` is the habit.',
    trap: 'Without the link `o.book_id = b.id` the subquery is the same for every book, so you get all books or none.',
    wrong: { sql: `SELECT title FROM books b WHERE NOT EXISTS (SELECT 1 FROM orders o);`, why: 'The subquery is not linked to the book. Orders exist, so NOT EXISTS is false for every book: zero rows.' },
  },
  {
    id: 'h3', level: 'hard', topic: 'LEFT JOIN ... IS NULL', type: 'query',
    must: [['LEFT\\s+(OUTER\\s+)?JOIN', 'Use a LEFT JOIN for this one.'], ['IS\\s+NULL', 'Finish the pattern with IS NULL.']],
    prompt: 'Using the `LEFT JOIN ... IS NULL` pattern, show the `id` and `name` of students who are not enrolled in anything.',
    solution: `SELECT s.id, s.name FROM students s LEFT JOIN enrolments e ON e.student_id = s.id WHERE e.id IS NULL;`,
    hints: ['After a LEFT JOIN, students with no match have NULL in every enrolments column. Keep only those rows.',
      'FROM students s LEFT JOIN enrolments e ON e.student_id = s.id WHERE e.___ IS NULL'],
    explain: 'LEFT JOIN keeps every student. Where there is no enrolment, the enrolments side is all NULL. `WHERE e.id IS NULL` keeps exactly those unmatched students. Test a column that can never be NULL in a real row (the primary key).',
    trap: 'Testing `e.grade IS NULL` would also catch a real enrolment that simply has no grade yet.',
    wrong: { sql: `SELECT s.id, s.name FROM students s LEFT JOIN enrolments e ON e.student_id = s.id WHERE e.grade IS NULL;`, why: 'Student 8 has a real enrolment with a NULL grade, so they wrongly appear in the result.' },
  },
  {
    id: 'h4', level: 'hard', topic: 'NOT IN and NULL', type: 'mcq',
    prompt: '`students` has 14 rows with ids 1 to 14. A subquery returns the values `(1, 2, NULL)`. How many rows does `SELECT * FROM students WHERE id NOT IN (subquery)` return?',
    options: ['12', '11', '0', '14'], answer: 2,
    hints: ['Think about id 5. Is `5 <> NULL` true?'],
    explain: '`id NOT IN (1, 2, NULL)` means `id <> 1 AND id <> 2 AND id <> NULL`. The last part is UNKNOWN for every id, so the whole condition is never true: zero rows, and no error. Fix: `NOT EXISTS`, or add `WHERE col IS NOT NULL` inside the subquery.',
  },
  {
    id: 'h5', level: 'hard', topic: 'CREATE TABLE + FK', type: 'state',
    prompt: 'Create a table `reviews`:\n- `id`: integer, primary key, numbered automatically\n- `book_id`: integer, required, foreign key to `books(id)`; when a book is deleted its reviews are deleted too\n- `rating`: integer, required\n- `comment`: text up to 255 characters, optional',
    solution: `CREATE TABLE reviews (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT NOT NULL,
  rating  INT NOT NULL,
  comment VARCHAR(255),
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);`,
    verify: [COLS('reviews'),
      `SELECT referenced_table_name, delete_rule FROM information_schema.referential_constraints WHERE constraint_schema = 'sql_practice' AND table_name = 'reviews'`,
      `SELECT column_name FROM information_schema.key_column_usage WHERE table_schema = 'sql_practice' AND table_name = 'reviews' AND constraint_name = 'PRIMARY'`],
    hints: ['"Required" = NOT NULL. "Numbered automatically" = AUTO_INCREMENT. "Deleted too" = ON DELETE CASCADE.',
      'FOREIGN KEY (book_id) REFERENCES ___(___) ON DELETE ___'],
    explain: 'The FK line says: every reviews.book_id must exist in books.id (referential integrity). ON DELETE CASCADE tells MySQL to remove the child reviews when the parent book is deleted. Without it the default is RESTRICT: the delete is refused.',
    trap: 'The default is RESTRICT, not CASCADE. The FK column type must match the parent key (INT ↔ INT).',
    wrong: { sql: `CREATE TABLE reviews (id INT AUTO_INCREMENT PRIMARY KEY, book_id INT NOT NULL, rating INT NOT NULL, comment VARCHAR(255), FOREIGN KEY (book_id) REFERENCES books(id));`, why: 'No ON DELETE CASCADE, so the rule is the default (deleting a reviewed book would be refused).' },
  },
  {
    id: 'h6', level: 'hard', topic: 'ON DELETE', type: 'mcq',
    prompt: '`orders.customer_id` is `FOREIGN KEY ... REFERENCES customers(id) ON DELETE CASCADE`. Customer 1 has 2 orders. What does `DELETE FROM customers WHERE id = 1;` do?',
    options: ['Error 1451: the customer still has orders', 'Deletes the customer; the 2 orders stay with customer_id = NULL',
      'Deletes the customer AND the 2 orders', 'Deletes the customer; the orders stay and point at nothing'], answer: 2,
    hints: ['CASCADE means the delete flows down to the children.'],
    explain: 'CASCADE: deleting the parent also deletes its child rows. RESTRICT (the default when nothing is written) would refuse with error 1451. SET NULL would keep the orders with a NULL customer_id. Orders pointing at nothing can never happen: that is what referential integrity forbids.',
  },
  {
    id: 'h7', level: 'hard', topic: 'CREATE VIEW', type: 'state',
    prompt: 'Create a view `student_course_counts` with three columns: the student `id`, `name`, and their number of courses (0 for students with none).',
    solution: `CREATE VIEW student_course_counts AS
SELECT s.id, s.name, COUNT(e.id) AS courses
FROM students s
LEFT JOIN enrolments e ON e.student_id = s.id
GROUP BY s.id, s.name;`,
    verify: ['SELECT * FROM student_course_counts ORDER BY 1',
      `INSERT INTO enrolments (student_id, course_id) VALUES (9, 1)`,
      'SELECT * FROM student_course_counts WHERE id = 9'],
    hints: ['A view is a SELECT with a name. Write the SELECT first (you did it in an earlier question), then put CREATE VIEW ... AS in front.',
      'CREATE VIEW student_course_counts AS SELECT ...;'],
    explain: 'A view stores the QUERY, not the data. Every time you select from it, MySQL runs the query again on the current tables. The hidden test inserts a new enrolment and the view shows it immediately.',
    trap: 'A view is not a snapshot. And the COUNT(*) trap still applies inside it.',
    wrong: { sql: `CREATE VIEW student_course_counts AS SELECT s.id, s.name, COUNT(*) AS courses FROM students s LEFT JOIN enrolments e ON e.student_id = s.id GROUP BY s.id, s.name;`, why: 'COUNT(*) inside the view: students with no courses show 1.' },
  },
  {
    id: 'h8', level: 'hard', topic: 'CREATE INDEX', type: 'state',
    prompt: "`SELECT * FROM books WHERE author = 'Ben Forta';` reads every row (EXPLAIN shows type = ALL, key = NULL). Create an index that fixes it. You can add an `EXPLAIN SELECT ...` after it to see the change.",
    solution: `CREATE INDEX idx_books_author ON books (author);`,
    verify: [`SELECT COUNT(*) > 0 AS author_is_indexed FROM information_schema.statistics WHERE table_schema = 'sql_practice' AND table_name = 'books' AND column_name = 'author' AND seq_in_index = 1`],
    hints: ['Index the column that the WHERE searches on.', 'CREATE INDEX idx_books_author ON books (___);'],
    explain: 'An index is a sorted copy of the column with pointers to the rows, so MySQL can jump to "Ben Forta" instead of scanning. EXPLAIN changes from type ALL / key NULL to type ref / key idx_books_author, and rows drops to 2.',
    trap: 'Index the column in the WHERE, not the columns in the SELECT list. Indexes make writes slower, so do not index everything.',
    wrong: { sql: `CREATE INDEX idx_books_title ON books (title);`, why: 'The query filters on author. An index on title does not help it.' },
  },
  {
    id: 'h9', level: 'hard', topic: 'Sargable rewrite', type: 'query',
    mustNot: [['\\b(LEFT|SUBSTR|SUBSTRING|MID)\\s*\\(', 'There is still a function wrapped around `title`.'],
      ["LIKE\\s+'%", 'A pattern that starts with % cannot use the index either.']],
    prompt: 'This query cannot use an index on `title` because the column is wrapped in a function. Rewrite it so it returns the same rows with `title` standing alone.',
    starter: `SELECT id, title FROM courses WHERE LEFT(title, 3) = 'Web';`,
    solution: `SELECT id, title FROM courses WHERE title LIKE 'Web%';`,
    hints: ['"The first 3 letters are Web" is the same as "starts with Web".', "WHERE title LIKE '___%'"],
    explain: "The index is sorted by the whole title. `LEFT(title, 3)` is a computed value that is not in the index, so MySQL must compute it for every row (type ALL). `LIKE 'Web%'` is a range in the sorted index (type range).",
    trap: "A function around an indexed column kills the index. A leading wildcard (`LIKE '%Web'`) does too.",
    wrong: { sql: `SELECT id, title FROM courses WHERE title LIKE '%Web%';`, why: 'No function now, but the leading % still prevents index use, and it would also match "Web" in the middle of a title.' , },
  },
  {
    id: 'h10', level: 'hard', topic: 'SQL injection', type: 'mcq',
    prompt: "Node code: `const sql = \"SELECT * FROM books WHERE author = '\" + author + \"'\"; await pool.query(sql);`  A user types  `' OR '1'='1`  as the author. What happens, and what is the fix?",
    options: ['Syntax error; fix by escaping quotes by hand', 'Returns every book; fix with `pool.execute(\'... WHERE author = ?\', [author])`',
      'Returns no rows; no fix needed', 'Returns every book; fix by using `pool.execute(sql)` with the same string'], answer: 1,
    hints: ["Write out the final SQL string: WHERE author = '' OR '1'='1'"],
    explain: "The typed quote closes the string early, so `OR '1'='1'` becomes part of the SQL. It is always true, so every row comes back. With a `?` placeholder the value is sent separately and is always treated as data. Switching to execute while still gluing strings changes nothing: the placeholder is what protects you.",
  },

  // ============================== EXAM ==============================
  {
    id: 'x1', level: 'exam', topic: 'Procedure: IN / OUT', type: 'state',
    must: [['CREATE\\s+PROCEDURE', 'Write a CREATE PROCEDURE.']],
    prompt: 'Write a stored procedure `count_students(IN p_course INT, OUT p_total INT)` that puts the number of students enrolled in the given course into `p_total`.',
    starter: `DELIMITER //\n\n\nDELIMITER ;`,
    solution: `DELIMITER //
CREATE PROCEDURE count_students(IN p_course INT, OUT p_total INT)
BEGIN
  SELECT COUNT(*) INTO p_total FROM enrolments WHERE course_id = p_course;
END //
DELIMITER ;`,
    verify: ['CALL count_students(1, @n)', 'SELECT @n', 'CALL count_students(3, @n)', 'SELECT @n'],
    hints: ['SELECT ... INTO stores a query result in a variable or OUT parameter.',
      'CREATE PROCEDURE count_students(IN p_course INT, OUT p_total INT)\nBEGIN\n  SELECT COUNT(*) INTO ___ FROM enrolments WHERE course_id = ___;\nEND //'],
    explain: 'IN parameters carry a value in; OUT parameters carry one back. The caller passes a session variable (`CALL count_students(1, @n); SELECT @n;`). DELIMITER // is needed so the `;` inside the body does not end the CREATE.',
    trap: 'Name parameters differently from columns (p_course, not course_id), or `WHERE course_id = course_id` is always true.',
    wrong: { sql: `DELIMITER //\nCREATE PROCEDURE count_students(IN course_id INT, OUT p_total INT)\nBEGIN\n  SELECT COUNT(*) INTO p_total FROM enrolments WHERE course_id = course_id;\nEND //\nDELIMITER ;`, why: 'The parameter has the same name as the column, so `course_id = course_id` compares the parameter with itself: every row is counted.' },
  },
  {
    id: 'x2', level: 'exam', topic: 'Procedure: IF + LAST_INSERT_ID', type: 'state',
    must: [['CREATE\\s+PROCEDURE', 'Write a CREATE PROCEDURE.']],
    prompt: 'Write `place_order(IN p_customer INT, IN p_book INT, IN p_qty INT, OUT p_order_id INT)`:\n- read the book\'s stock into a local variable\n- if the stock is less than `p_qty`: set `p_order_id` to 0 and change nothing\n- otherwise: reduce the stock by `p_qty`, insert the order, and set `p_order_id` to the new order\'s id',
    starter: `DELIMITER //\n\n\nDELIMITER ;`,
    solution: `DELIMITER //
CREATE PROCEDURE place_order(IN p_customer INT, IN p_book INT, IN p_qty INT, OUT p_order_id INT)
BEGIN
  DECLARE v_stock INT;
  SELECT stock INTO v_stock FROM books WHERE id = p_book;
  IF v_stock < p_qty THEN
    SET p_order_id = 0;
  ELSE
    UPDATE books SET stock = stock - p_qty WHERE id = p_book;
    INSERT INTO orders (customer_id, book_id, quantity) VALUES (p_customer, p_book, p_qty);
    SET p_order_id = LAST_INSERT_ID();
  END IF;
END //
DELIMITER ;`,
    verify: ['CALL place_order(1, 5, 2, @a)', 'SELECT @a', 'CALL place_order(1, 3, 99, @b)', 'SELECT @b',
      'SELECT id, stock FROM books ORDER BY id', 'SELECT id, customer_id, book_id, quantity FROM orders ORDER BY id'],
    hints: ['Pieces you need, in order: DECLARE, SELECT ... INTO, IF ... THEN ... ELSE ... END IF, SET, LAST_INSERT_ID().',
      'DECLARE v_stock INT;\nSELECT stock INTO v_stock FROM books WHERE id = p_book;\nIF v_stock < p_qty THEN\n  SET p_order_id = 0;\nELSE\n  ...\n  SET p_order_id = LAST_INSERT_ID();\nEND IF;'],
    explain: 'DECLARE makes a local variable (it must come first in BEGIN). SELECT ... INTO fills it. IF chooses the branch. LAST_INSERT_ID() returns the AUTO_INCREMENT id created by the INSERT you just ran on this connection.',
    trap: 'DECLARE after another statement is a syntax error. It is ELSEIF (one word) and END IF; (two words).',
    wrong: { sql: `DELIMITER //\nCREATE PROCEDURE place_order(IN p_customer INT, IN p_book INT, IN p_qty INT, OUT p_order_id INT)\nBEGIN\n  UPDATE books SET stock = stock - p_qty WHERE id = p_book;\n  INSERT INTO orders (customer_id, book_id, quantity) VALUES (p_customer, p_book, p_qty);\n  SET p_order_id = LAST_INSERT_ID();\nEND //\nDELIMITER ;`, why: 'No stock check: ordering 99 copies drives the stock negative and still creates an order.' },
  },
  {
    id: 'x3', level: 'exam', topic: 'Trigger + SIGNAL', type: 'state', asRoot: true,
    must: [['CREATE\\s+TRIGGER', 'Write a CREATE TRIGGER.']],
    prompt: 'Write a trigger `after_enrolment_insert` on `enrolments`: after each new enrolment, take one seat from that course (`seats - 1`), but only if `seats > 0`. If no seat was free, stop the insert with the error message `course is full`.',
    starter: `DELIMITER //\n\n\nDELIMITER ;`,
    solution: `DELIMITER //
CREATE TRIGGER after_enrolment_insert
AFTER INSERT ON enrolments
FOR EACH ROW
BEGIN
  UPDATE courses SET seats = seats - 1 WHERE id = NEW.course_id AND seats > 0;
  IF ROW_COUNT() = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'course is full';
  END IF;
END //
DELIMITER ;`,
    verify: ['INSERT INTO enrolments (student_id, course_id) VALUES (9, 3)', 'SELECT id, seats FROM courses ORDER BY id',
      'UPDATE courses SET seats = 0 WHERE id = 5', 'INSERT INTO enrolments (student_id, course_id) VALUES (9, 5)',
      'SELECT COUNT(*) FROM enrolments', 'SELECT id, seats FROM courses ORDER BY id'],
    hints: ['The new row is `NEW`. `ROW_COUNT()` tells you how many rows the UPDATE changed. SIGNAL raises an error.',
      "AFTER INSERT ON enrolments FOR EACH ROW\nBEGIN\n  UPDATE courses SET seats = seats - 1 WHERE id = NEW.___ AND seats > 0;\n  IF ROW_COUNT() = 0 THEN\n    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '___';\n  END IF;\nEND //"],
    explain: 'In an INSERT trigger only NEW exists (the row being inserted). The guarded UPDATE changes 0 rows when the course is full; ROW_COUNT() = 0 detects that. SIGNAL SQLSTATE \'45000\' raises a user error, which cancels the INSERT that fired the trigger.',
    trap: 'INSERT triggers have no OLD; DELETE triggers have no NEW. Without `AND seats > 0` the seats go negative.',
    wrong: { sql: `DELIMITER //\nCREATE TRIGGER after_enrolment_insert AFTER INSERT ON enrolments FOR EACH ROW\nBEGIN\n  UPDATE courses SET seats = seats - 1 WHERE id = NEW.course_id;\nEND //\nDELIMITER ;`, why: 'No guard and no SIGNAL: enrolling in a full course succeeds and seats becomes -1.' },
  },
  {
    id: 'x4', level: 'exam', topic: 'Transaction', type: 'state',
    must: [['START\\s+TRANSACTION|\\bBEGIN\\b', 'Open the transaction with START TRANSACTION.'], ['\\bCOMMIT\\b', 'Make it permanent with COMMIT.']],
    prompt: 'Student 9 enrols in course 2. In ONE transaction: take a seat from course 2 (only if `seats > 0`), insert the enrolment, and make both changes permanent.',
    solution: `START TRANSACTION;
UPDATE courses SET seats = seats - 1 WHERE id = 2 AND seats > 0;
INSERT INTO enrolments (student_id, course_id) VALUES (9, 2);
COMMIT;`,
    verify: ['SELECT id, seats FROM courses ORDER BY id', 'SELECT student_id, course_id FROM enrolments ORDER BY id'],
    hints: ['Three keywords frame a transaction. Which one saves, which one undoes?', 'START TRANSACTION;\nUPDATE ...;\nINSERT ...;\n___;'],
    explain: 'Between START TRANSACTION and COMMIT the two statements are one unit: both are saved together, or (with ROLLBACK) neither is. The checker looks at the tables from a NEW connection, so uncommitted work is invisible to it, just as it would be to other users.',
    trap: 'Without COMMIT nothing is saved when the connection closes. In Node, every statement must run on `conn`, not `pool`.',
    wrong: { sql: `START TRANSACTION;\nUPDATE courses SET seats = seats - 1 WHERE id = 2 AND seats > 0;\nINSERT INTO enrolments (student_id, course_id) VALUES (9, 2);\nROLLBACK;\nCOMMIT;`, why: 'ROLLBACK undoes both statements; the COMMIT after it has nothing left to save.' },
  },
  {
    id: 'x5', level: 'exam', topic: 'Transactions: partial failure', type: 'mcq',
    prompt: 'Run in order:\n`START TRANSACTION;`\n`UPDATE courses SET seats = seats - 1 WHERE id = 1;`  (works)\n`INSERT INTO enrolments (student_id, course_id) VALUES (1, 1);`  (fails: duplicate entry)\n`COMMIT;`\nWhat is saved?',
    options: ['Nothing: the error rolled the whole transaction back', 'The UPDATE is saved; only the INSERT is missing',
      'Both are saved', 'COMMIT fails with an error'], answer: 1,
    hints: ['Does MySQL roll back for you when one statement fails?'],
    explain: 'A failed statement undoes only ITSELF. The earlier UPDATE is still pending, and COMMIT saves it: a seat is taken with no enrolment. That is why the Node pattern has `catch { await conn.rollback(); }`: YOU must roll back when something fails.',
  },
  {
    id: 'x6', level: 'exam', topic: 'Multi-step query', type: 'query', ordered: true,
    prompt: 'For each customer show `name`, their number of orders, and the total money spent (quantity × book price). Keep only customers who spent more than 1500, biggest spender first.',
    solution: `SELECT c.name, COUNT(*) AS orders, SUM(o.quantity * b.price) AS spent
FROM customers c
JOIN orders o ON o.customer_id = c.id
JOIN books b ON b.id = o.book_id
GROUP BY c.id, c.name
HAVING SUM(o.quantity * b.price) > 1500
ORDER BY spent DESC;`,
    hints: ['Build it in pipeline order: join 3 tables → group per customer → filter the groups → sort.',
      'FROM customers c JOIN orders o ON ... JOIN books b ON ...\nGROUP BY c.id, c.name\nHAVING SUM(___ * ___) > 1500\nORDER BY ___ DESC'],
    explain: 'FROM/JOIN builds one row per order with its customer and book. GROUP BY makes one bucket per customer. SUM(quantity × price) adds up each bucket. HAVING filters buckets (it is an aggregate, so not WHERE). ORDER BY can use the alias `spent` because it runs after SELECT.',
    trap: 'The alias works in ORDER BY only. The price lives in books, so you need the second join.',
    wrong: { sql: `SELECT c.name, COUNT(*) AS orders, SUM(o.quantity * b.price) AS spent FROM customers c JOIN orders o ON o.customer_id = c.id JOIN books b ON b.id = o.book_id WHERE o.quantity * b.price > 1500 GROUP BY c.id, c.name ORDER BY spent DESC;`, why: 'WHERE tests each single order (is this one order above 1500?) instead of the customer\'s total. Only one customer survives.' },
  },
  {
    id: 'x7', level: 'exam', topic: 'NOT EXISTS + JOIN', type: 'query',
    prompt: 'Show the `title` of every course in which NO `Data Science` student is enrolled.',
    solution: `SELECT title FROM courses c
WHERE NOT EXISTS (
  SELECT 1 FROM enrolments e
  JOIN students s ON s.id = e.student_id
  WHERE e.course_id = c.id AND s.major = 'Data Science');`,
    hints: ['Say it as: "courses where there does not exist an enrolment by a Data Science student". The subquery needs enrolments joined to students.',
      "WHERE NOT EXISTS (SELECT 1 FROM enrolments e JOIN students s ON s.id = e.student_id\n                  WHERE e.course_id = c.id AND s.major = '___')"],
    explain: 'For each course, the subquery looks for any enrolment in THAT course by a Data Science student. NOT EXISTS keeps courses where none is found. "No X at all" is a NOT EXISTS / anti-join question; a plain join with `major <> \'Data Science\'` answers a different question ("has some non-DS student").',
    trap: '`WHERE major <> ...` on a join finds courses that HAVE another kind of student, not courses with NO Data Science student.',
    wrong: { sql: `SELECT DISTINCT c.title FROM courses c JOIN enrolments e ON e.course_id = c.id JOIN students s ON s.id = e.student_id WHERE s.major <> 'Data Science';`, why: 'This lists courses that have at least one non-Data-Science student. Database Programming has both kinds, so it wrongly appears.' },
  },
  {
    id: 'x8', level: 'exam', topic: 'Trigger: OLD / NEW', type: 'mcq',
    prompt: 'You write an `AFTER DELETE ON enrolments FOR EACH ROW` trigger that gives the seat back. How do you refer to the course of the deleted row?',
    options: ['`NEW.course_id`', '`OLD.course_id`', 'Either one works', '`enrolments.course_id`'], answer: 1,
    hints: ['After a DELETE, is there a "new" version of the row?'],
    explain: 'DELETE has only OLD (the row that was removed). INSERT has only NEW. UPDATE has both: OLD = before, NEW = after. Using NEW in a DELETE trigger is an error.',
  },
  {
    id: 'x9', level: 'exam', topic: 'Node: transaction bug', type: 'mcq',
    prompt: 'Find the bug:\n`const conn = await pool.getConnection();`\n`await conn.beginTransaction();`\n`await conn.execute(\'UPDATE books SET stock = stock - 1 WHERE id = ?\', [id]);`\n`await pool.execute(\'INSERT INTO orders (customer_id, book_id) VALUES (?, ?)\', [cid, id]);`\n`await conn.commit();`',
    options: ['`beginTransaction` must come before `getConnection`', 'The INSERT uses `pool`, so it runs outside the transaction',
      '`commit` must be called on `pool`', '`?` placeholders are not allowed inside a transaction'], answer: 1,
    hints: ['A transaction belongs to ONE connection. Which line uses a different one?'],
    explain: '`pool.execute` grabs any free connection from the pool, not the one holding the transaction. The INSERT is auto-committed at once; if you later roll back, the UPDATE is undone but the order stays. Every statement must go through `conn`, and `conn.release()` belongs in `finally`.',
  },
  {
    id: 'x10', level: 'exam', topic: 'Express: params / query / body', type: 'mcq',
    prompt: 'Route: `router.get(\'/students/:id/enrolments\', ...)`. Request: `GET /students/7/enrolments?grade=A`. What are `req.params.id` and `req.query.grade`?',
    options: ['`7` (number) and `\'A\'`', '`\'7\'` (string) and `\'A\'`', '`\'7\'` and undefined (grade is in req.body)', 'undefined and `\'A\'`'], answer: 1,
    hints: ['Everything in a URL is text.'],
    explain: '`:id` in the path lands in `req.params`; what follows `?` lands in `req.query`. Both are always STRINGS, so use `Number(req.params.id)` before comparing with numbers. `req.body` is the JSON sent with POST/PUT and needs `express.json()`.',
  },
  {
    id: 'x11', level: 'exam', topic: 'Predict the output', type: 'mcq',
    prompt: 'Mai has no orders. What does this return in her row?\n`SELECT c.name, COUNT(*) FROM customers c LEFT JOIN orders o ON o.customer_id = c.id GROUP BY c.id, c.name;`',
    options: ['0', '1', 'NULL', 'Mai is not in the result'], answer: 1,
    hints: ['How many rows does the LEFT JOIN produce for Mai before grouping?'],
    explain: 'The LEFT JOIN produces ONE row for Mai, with NULLs on the orders side. COUNT(*) counts rows, so it says 1. `COUNT(o.id)` skips the NULL and gives the correct 0.',
  },
];
