# CSS326 Lab 11 – Stored Routines, Triggers & NoSQL (in-class exercises starter)

## 1. Set up the database (MySQL Workbench)
1. Open `sql/lab11_setup.sql` and execute it. It creates a fresh `lab11` database with
   `students`, `courses` (with the **seats** column from Lab 9) and `enrolments`,
   plus the UNIQUE key and foreign keys. Running it again resets everything.
2. Exercises 1, 2 and 4 are SQL scripts with TODOs: `sql/exercise1.sql`, `sql/exercise2.sql`,
   `sql/exercise4.sql`. Keep the `DELIMITER //` lines around routines and triggers.

## 2. Run the web app
```bash
npm install
npm run dev                 # http://localhost:3000
```
Before starting, open the **`.env`** file and set `DB_USER` / `DB_PASS` to your own MySQL login
(Lab 10). `db.js` and the document store (Exercise 5) both read their settings from `.env`.
`.env.example` is the shareable template; `.env` holds your real password and is listed in `.gitignore`.
Open **http://localhost:3000** in your browser: courses with free seats and JSON details,
students with their course count, an Enrol/Cancel panel, course reviews, and a log of
every response. After each enrol or cancel the log shows how the seats changed.
You can also test with `requests.http` (VS Code REST Client) or Postman.

| Method | Route | Exercise |
|---|---|---|
| GET | `/courses`, `/courses?day=Mon` | 4 – read / filter the JSON column |
| GET | `/students` | 3 – add `course_count(Id)` |
| GET | `/students/:id/enrolments` | done for you |
| POST | `/students/:id/enrolments` body `{"course_id": 3}` | 3 – `CALL enrol_student(?, ?)` |
| DELETE | `/students/:id/enrolments/:courseId` | 3 – just the DELETE (the trigger gives the seat back) |
| GET / POST | `/courses/:id/reviews` | 5 (if time) – document store |

## 3. Exercises
* **Exercise 1** – `sql/exercise1.sql`: procedure `enrol_student`, function `course_count`,
  and an OUT parameter (`count_students`).
* **Exercise 2** – `sql/exercise2.sql`: AFTER INSERT and AFTER DELETE triggers that keep
  `courses.seats` in step (and SIGNAL `'course is full'`). Then enrol from the web page:
  the seats now drop by **2** – the old Lab 9 code and your trigger both take a seat.
* **Exercise 3** – fix that in the app: `controllers/enrolmentController.js` (CALL the
  procedure, keep only the DELETE) and `controllers/studentController.js` (use the function).
* **Exercise 4** – `sql/exercise4.sql` (JSON column), then `controllers/courseController.js`.
* **Exercise 5 (if time)** – `controllers/reviewController.js` (X DevAPI, port 33060).
