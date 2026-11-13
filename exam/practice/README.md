# CSS326 SQL practice

45 questions from easy to exam level, checked on your real local MySQL 8.

## Start

From the repo root:

    node exam/practice/server.js

then open http://localhost:3326 . No install step: it uses the shared root `node_modules` (express, mysql2).

On start it creates (only if missing):
- the database `sql_practice` (rebuilt before every run, so nothing you type can break a later question)
- a MySQL user `sql_practice@localhost` that has rights on that one database only. Your SQL runs as this
  user, so it cannot touch `lab9`, `lab11`, `css326_lab10`, `bookstore_lab10` or any other database.

It connects as root with no password, like the labs. Override with `DB_USER`, `DB_PASS`, `DB_HOST`, `DB_PORT`, `PORT`.

## How it checks you

- Query questions: your last SELECT is compared with the model answer's result (row order only matters
  when the question asks for a sort; column names and aliases are not compared).
- UPDATE / DDL / procedure / trigger / transaction questions: a hidden test runs after your SQL, on a new
  connection, and its results are compared with the model answer's. The test is shown after you run.
- Procedures and triggers are typed with `DELIMITER //` exactly as in Workbench.
- Concept questions are multiple choice.

Hints come in two steps (the idea, then a skeleton). The answer unlocks after one attempt, or with
"Give up and show answer", and explains why it works, the trap, and the common wrong answer.

## Files

- `server.js`, `db.js`, `routes/api.js`, `controllers/practiceController.js` (the checker)
- `questions.js` (the question bank), `sql/seed.js` (tables and rows)
- `public/` (the page), `check.js` (self-test: `node exam/practice/check.js`)

## Remove everything afterwards

    mysql -uroot -e "DROP DATABASE IF EXISTS sql_practice; DROP USER IF EXISTS 'sql_practice'@'localhost';"

## Known limits

- The trigger question (x3) runs as root, because MySQL with binary logging on refuses `CREATE TRIGGER`
  from a normal user. For that one question your SQL is refused if it names another database or uses
  `USE` / `GRANT` / `DATABASE` / `USER`.
- The answer lock is only a nudge: the answers are in `questions.js`.
