# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

static HTML/CSS/JS (confirmed with user)

## Users

Primary: SIIT university students, browsing and contributing exam intelligence
and study materials for their own courses while preparing for exams — wanting
to know what's actually going to be tested, how hard it is, and what to
study. Secondary: student moderators (elevated-privilege students) who review
reported content. [Inferred from the existing written proposal at
`../proposal/index.html` and the initiating brief; not independently
re-interviewed since the source document already establishes this in detail.]

## Product Purpose

A SIIT-gated archive of student-authored exam intelligence (structured
descriptions of exam format/difficulty/topics — not the actual exam papers,
to avoid academic-integrity/copyright issues) and study materials, organized
by course, so institutional knowledge about a course survives past the
cohort that learned it.

## Positioning

Unlike an ad hoc LINE group or a Google Drive folder a senior hands down,
this is structured (searchable by course, filterable, rated by
difficulty/time pressure), persistent (survives past any one cohort or
senior), and institutionally scoped (SIIT-email gated) rather than dependent
on knowing the right person.

## Operating Context

Coursework artifact for CSS326 (Database Programming Laboratory) at SIIT.
This specific build is a **UI/UX showcase prototype only** — not the graded
functional deliverable (that's separate Week 9+ Express/MySQL work per the
course syllabus). It's meant to be demoed and clicked through to communicate
the intended UX, sitting alongside a written proposal document and ER
diagram for the same course project.

## Capabilities and Constraints

- No real backend, database, or auth in this build — all data is
  hardcoded/mock, matching the specific sample data given in the initiating
  brief (CSS326/CSC201/CSC310/ITE231/CSS330 courses, specific submissions,
  usernames, scores).
- Real client-side navigation between all 11 screens is required (actual
  routing/links), not a slideshow or static comps.
- Content model: a submission ("Content") is either "Exam Intel" (structured
  exam description: type, format, topics, allowed aids, duration, time
  pressure, difficulty, advice) or "Materials" (title, type, markdown
  notes) — mutually exclusive subtypes of one shared parent, each optionally
  carrying one file attachment.
- Report is always a lightweight overlay/modal (it needs a reason); Vote is
  a single-click inline action with no confirmation step. This distinction
  is a deliberate, already-validated UX decision — preserve it.
- Moderation is reached only from the Dashboard's nav, not from every
  content screen.
- UI microcopy should reference the actual backing stored procedure/trigger
  for key actions (e.g. "Submit → sp_submit_content()") — this is meant to
  read as a database-course artifact, not a generic app template.

## Brand Commitments

Name: "SIIT Study Hub". Ideally reads as part of the same family as the
existing written proposal (`../proposal/index.html`) and its ER diagram — teal
accent, IBM Plex type family, warm paper background — but this is a strong
**candidate** for the upcoming direction picker, not a locked constraint; the
normal picker still runs.

## Evidence on Hand

- `../proposal/index.html` — the written project proposal for this same
  course project (existing visual system, full schema, procedures/triggers
  list, user flow diagram).
- `../proposal/schema.sql` / `schema.dbml` — the actual MySQL schema this
  UI's data model should stay consistent with.
- All screen content and sample data specified in the initiating brief
  (courses, submissions, usernames, scores, report reasons, etc.) — use
  these rather than inventing new placeholder data.

## Product Principles

- Structure over screenshots: exam intel is always structured fields
  (topics/difficulty/format), never a raw exam-paper dump — both a legal
  boundary and a UX one (scannable, comparable across submissions).
- One hub per course: the Course Page is the return point for every
  course-scoped action (submit, view detail), not a separate "done"
  destination per flow.
- Weight the action to the ask: input-needing actions (Report) get a
  confirming overlay; low-stakes ones (Vote) get a single click.
- Show the database, don't hide it: UI copy for key actions names the
  stored procedure it maps to, since this is coursework for a database class.

## Accessibility & Inclusion

No specific standard was made binding; follow ordinary web accessibility
practice (semantic HTML, keyboard-operable nav/forms/modal, sufficient
contrast) as a baseline.
