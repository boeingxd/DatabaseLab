# CSS326 Lab 10 – Performance & Security (in-class exercises starter)

## 1. Set up the database (MySQL Workbench, as root)
Run the three files in `sql/` in this order:
1. `01_university_schema.sql` – creates the `css326_lab10` database (students, courses, enrolments)
2. `02_university_sample_data.sql` – a few readable rows
3. `03_test_rows.sql` – 100,000 extra courses, so speed differences become visible

The exercise scripts are `sql/exercise1_index_explain.sql`, `sql/exercise2_app_user.sql`
and `sql/exercise4_tuning.sql`.

## 2. Run the web app
```bash
npm install
npm run dev                 # http://localhost:3000  (Ctrl + C stops it)
```
For now, put your own root password in `db.js` (Exercise 3 moves it into `.env`).
Open **http://localhost:3000**: a **Connection** panel (who the app logs in as, and its
privileges), a **Query plan** panel (EXPLAIN and the indexes on courses), a **Course search**
with the server time of every request and one-click attack buttons, **A student's courses**,
and a **Responses** log that turns red when something is unsafe.
You can also test with `requests.http` (VS Code REST Client) or Postman.

| Method | Route | Exercise |
|---|---|---|
| GET | `/api/courses/search?title=...` | 1 (speed) and 3 (injection) |
| GET | `/api/courses/explain?title=...`, `/api/courses/indexes` | 1 – done for you |
| GET | `/api/students`, `/api/students/:id/courses` | 3 (injection by id) |
| GET | `/api/whoami` | 2 and 3 – done for you |

## 3. What to fix (Exercise 3) – look for the `TODO (Exercise 3)` comments
1. Every query must use `?` placeholders (two queries build SQL by hand).
2. Connect as `university_app` (from Exercise 2), not root.
3. Move the database settings into a `.env` file (`DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`):
   `npm install dotenv`, then `require('dotenv').config();` as the very first line of `db.js`.
   Add `.env` to `.gitignore`.
4. A failed request must return a clean message, not the raw database error.

Try the attacks first (the buttons in the page): after your fix the search returns no rows,
the bad student id returns 400, and the single quote no longer shows the SQL.
