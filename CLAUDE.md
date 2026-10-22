# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

Coursework repo for **CSS326 Database Programming Laboratory** (SIIT), "Revised
Track: MySQL & Node.js (RDBMS)". Weekly lab exercises plus the course group
project. This is **not** a single application — each week is its own
self-contained exercise, and they don't share code with each other beyond the
stack conventions below.

## Stack (fixed by the course, don't deviate)

- **MySQL 8.x**, run locally (dev DB assumed at `localhost`, user `root`, no
  password — see `<week>/db.js` in any given week for the exact config used
  that week; naming convention observed so far is `lab<N>_sec<section>`).
- **Node.js + Express** for the API layer.
- **`mysql2/promise`** as the driver — connection pooling via
  `mysql.createPool(...)`, not single connections.
- Later weeks add JSON columns / the X DevAPI document store (MySQL's
  NoSQL-style module) and transactions (`BEGIN`/`COMMIT`/`ROLLBACK`) — see the
  syllabus schedule below for which week introduces what.

## Repo layout

- `labs/week-01/` … `labs/week-11/` — one folder per lab (week 7 is the project
  proposal and week 8 was an assignment, so they live under `project/` and
  `assignments/`; there is no `week-07`/`week-08`). A week with actual code
  generally follows: `app.js` or `server.js` (Express entrypoint),
  `db.js` (the mysql2 pool), `routes/*.js` (thin — maps HTTP verbs to
  controller functions), `controllers/*.js` (the actual query logic),
  `public/` (static frontend served via `express.static`). Later weeks keep the
  course starter in a `Lab<N>_Exercise_Starter/` subfolder with the lab sheet PDFs
  beside it. `*.mwb` files (MySQL Workbench projects) live in their week folder
  (`labs/week-02/`). Don't touch unless asked.
- `assignments/01/` … `assignments/07/` — graded assignment submissions, numbered
  by assignment (not by week: `06` is the Lab 6 assignment, `07` the Lab 9 one).
- `project/` — the SIIT Study Hub course project: `proposal/` (Week 7 proposal,
  schema, diagrams) and `ui-showcase/` (static HTML mockups).
- `archive/` — `submissions/` (zips that were handed in) and `starters/` (the
  course's original starter zips). Don't touch unless asked.
- `package.json` at the repo root — **shared dependencies for all weeks**
  (currently `express`, `mysql2`, `dotenv`, `@mysql/xdevapi`). `node_modules/` is
  gitignored and shared from the root; individual folders don't get their own
  installs unless they need something outside the shared set (see
  `project/proposal/` below, which intentionally keeps its own local
  `node_modules` for a doc-generation tool that isn't a course dependency).

## The course project (`project/`)

The group project is **SIIT Study Hub** — a SIIT-gated archive of
student-authored exam intelligence and study materials, redesigned for this
course's required MySQL/Node/Express stack. `project/proposal/` (matching the
syllabus's own "Week 7 = Project Proposal" milestone) has the full proposal:

- `schema.sql` — the MySQL DDL (9 tables: `User`, `Course`, `Instructor`,
  `CourseOffering`, `Content` + its two disjoint subtypes `ExamIntel`/
  `Materials`, `Vote`, `Report`).
- `schema.dbml` — the same schema in DBML, for pasting into dbdiagram.io.
- `index.html` — the full proposal as a standalone web page (design system,
  ER diagram, flow diagram, physical design tables, timeline).
- `SIIT_Study_Hub_Proposal.docx` — the same content as a Word doc
  (`build-docx.js` regenerates it via the `docx` npm package — `npm install`
  inside `project/proposal/` first if `node_modules` isn't there).
- `er-diagram.svg`/`.png`, `flow-diagram.svg`/`.png` — the two hand-built
  diagrams, standalone versions with literal colors (for the docx/print use);
  `index.html` has its own theme-aware inline copies of both.

**Important disambiguation:** SIIT Study Hub also exists as a real, live,
already-shipped product built on Postgres/Supabase (a completely different
project, `~/Documents/SIITYear3/DigitalBusinessExperience/MVP_Building`, for a
Digital Business Experience course, unrelated to CSS326). This course project
is a **from-scratch MySQL/Node.js redesign** that reuses the product idea and
lessons learned, not a port of that codebase — don't assume schema, RLS
policies, or any Supabase-specific detail from that project apply here; this
repo's schema was deliberately redesigned for MySQL (e.g. `file_path` lives on
the `Content` supertype, not duplicated per subtype; validation that Postgres
would do as a table `CHECK` spanning two tables here has to live in a stored
procedure, since MySQL `CHECK` constraints are single-table only).

## Session hygiene

Past sessions in this repo were started from **four different working
directories** — the repo root, `5thWeek/`, `6thWeek/`, and `assignments/` (the
first two now live at `labs/week-05/` and `labs/week-06/`) —
which splits Claude's persistent memory across four separate, disconnected
namespaces. **Always start Claude Code sessions from the repo root**
(`~/Documents/SIITYear3/DatabaseLab`) going forward so context and memory stay
in one place instead of fragmenting further.

## Syllabus schedule (for context on what each week is building toward)

Week 9: full-stack CRUD integration · Week 10: transactions & concurrency
control · Week 11: stored routines, triggers, JSON column & X DevAPI document
store (Lab 11 sheet) · Week 12: final project presentation · Week 13:
revision/consultation · Week 14: project demonstration · Week 15: final exam
(lab exam).
