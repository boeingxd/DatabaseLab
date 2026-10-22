const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType, AlignmentType, LevelFormat, ImageRun,
  Header, Footer, PageNumber, ExternalHyperlink,
} = require("docx");

const INK = "16232C";
const INK_MUTED = "526872";
const ACCENT = "124047";
const ACCENT_SOFT = "DCEDEE";
const RULE = "D1DADC";
const SUNKEN = "E3E9EA";
const WARN_BG = "FBEEE2";
const WARN_RULE = "E3C39E";
const WARN_INK = "7A4415";

const FULL_WIDTH = 10466; // 8.27in - 1in margins in twips (A4 minus 0.5in each side)

function cellBorders() {
  return {
    top: { style: BorderStyle.SINGLE, size: 2, color: RULE },
    bottom: { style: BorderStyle.SINGLE, size: 2, color: RULE },
    left: { style: BorderStyle.SINGLE, size: 2, color: RULE },
    right: { style: BorderStyle.SINGLE, size: 2, color: RULE },
  };
}

function headerCell(text, width) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: cellBorders(),
    shading: { type: ShadingType.CLEAR, fill: ACCENT, color: "auto" },
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: "FFFFFF", size: 16 })] })],
  });
}

function bodyCell(text, width, opts = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: cellBorders(),
    shading: opts.shade ? { type: ShadingType.CLEAR, fill: SUNKEN, color: "auto" } : undefined,
    margins: { top: 70, bottom: 70, left: 100, right: 100 },
    children: [new Paragraph({ children: [new TextRun({ text: text || "", size: 18, font: opts.mono ? "IBM Plex Mono" : undefined })] })],
  });
}

function dataTable(headers, widths, rows) {
  return new Table({
    width: { size: FULL_WIDTH, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({ children: headers.map((h, i) => headerCell(h, widths[i])), tableHeader: true }),
      ...rows.map((r, ri) => new TableRow({ children: r.map((c, i) => bodyCell(c, widths[i], { shade: ri % 2 === 1, mono: i === 0 })) })),
    ],
  });
}

function h1(text, num) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    children: [
      new TextRun({ text: `${num}  `, color: ACCENT, font: "IBM Plex Mono" }),
      new TextRun({ text, color: INK }),
    ],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 260, after: 120 },
    children: [new TextRun({ text, color: ACCENT })],
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 160 },
    children: [new TextRun({ text, size: 21, italics: opts.italics, bold: opts.bold, color: opts.color || INK })],
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, size: 21 })],
  });
}

function numFlow(n, title, desc) {
  return new Paragraph({
    spacing: { after: 140 },
    children: [
      new TextRun({ text: `${n}. `, bold: true, color: ACCENT, size: 21 }),
      new TextRun({ text: `${title} — `, bold: true, size: 21 }),
      new TextRun({ text: desc, size: 21 }),
    ],
  });
}

function calloutBox() {
  return new Table({
    width: { size: FULL_WIDTH, type: WidthType.DXA },
    columnWidths: [FULL_WIDTH],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: FULL_WIDTH, type: WidthType.DXA },
            shading: { type: ShadingType.CLEAR, fill: WARN_BG, color: "auto" },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: WARN_RULE },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: WARN_RULE },
              left: { style: BorderStyle.SINGLE, size: 4, color: WARN_RULE },
              right: { style: BorderStyle.SINGLE, size: 4, color: WARN_RULE },
            },
            margins: { top: 160, bottom: 160, left: 200, right: 200 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "Before you submit: ", bold: true, color: WARN_INK, size: 20 }),
                  new TextRun({
                    text: "this draft was assembled quickly ahead of the Week 7 deadline to organize the redesign. CSS326's syllabus prohibits LLM-generated work on assignments, so rewrite the prose in your own team's words before handing it in — treat this as a structured first draft, not a final one.",
                    color: WARN_INK, size: 20,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function spacer(h = 200) {
  return new Paragraph({ spacing: { after: h }, children: [] });
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 260 } } } }],
      },
    ],
  },
  sections: [
    {
      properties: { page: { margin: { top: 900, bottom: 900, left: 720, right: 720 } } },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: "CSS326 · SIIT Study Hub Proposal", size: 16, color: INK_MUTED, font: "IBM Plex Mono" })],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ children: [PageNumber.CURRENT], size: 16, color: INK_MUTED })],
          })],
        }),
      },
      children: [
        // ---------- Title block ----------
        new Paragraph({
          children: [new TextRun({ text: "CSS326 · DATABASE PROGRAMMING LABORATORY · PROJECT PROPOSAL", size: 16, color: ACCENT, font: "IBM Plex Mono", bold: true })],
        }),
        new Paragraph({
          spacing: { before: 100, after: 80 },
          children: [new TextRun({ text: "SIIT Study Hub", bold: true, size: 56, color: INK })],
        }),
        body("A SIIT-gated archive of student-authored study material and structured exam intelligence, redesigned as a MySQL + Node.js/Express application for CSS326.", { italics: true, color: INK_MUTED }),
        body("Track: MySQL & Node.js (RDBMS)   ·   Due: Week 7, Sept 17 — Proposal Presentation   ·   Demo: Week 14, Nov 5", { color: INK_MUTED }),
        spacer(160),
        calloutBox(),
        spacer(300),

        // ---------- 01 Overview ----------
        h1("Project overview", "01"),
        h2("Group members"),
        dataTable(
          ["Name", "Student ID", "Role"],
          [2400, 1800, 6266],
          [
            ["[Name]", "[ID]", "Project Manager & Database Design Lead — owns the ER diagram, schema, normalization decisions, the physical design table, and this proposal."],
            ["[Name]", "[ID]", "Backend, Security & Triggers Lead — Express.js REST endpoints, mysql2 integration, stored procedures, triggers, auth, and transaction handling."],
            ["[Name]", "[ID]", "Frontend, UI & Testing — course pages, submission forms, moderation queue view, and transaction/concurrency test cases."],
          ],
        ),
        spacer(240),
        h2("Project description"),
        body("SIIT students lose institutional knowledge every year. What a course actually demands — the real workload, what the midterm looks like, which topics matter — lives in LINE groups, senior handoffs, and Google Drive links that rot between cohorts. Every intake rediscovers it from scratch."),
        body("SIIT Study Hub is a SIIT-gated archive of student-authored study material and structured exam intelligence, organized by course code. Rather than redistributing official exam papers (a copyright and academic-integrity problem), students submit structured descriptions of exams — format, coverage, allowed aids, self-rated difficulty — alongside notes, summaries, and cheat sheets. A working prototype of this idea already exists as a live web app (Postgres/Supabase); this proposal redesigns its database from scratch for CSS326's required MySQL + Node.js/Express stack, and uses the lessons learned from the prototype's real usage to design a cleaner schema than the first attempt had."),

        // ---------- 02 Users & features ----------
        h1("Who the users are, and what they can do", "02"),
        h2("Students (verified via SIIT email)"),
        bullet("Search and browse the course catalogue"),
        bullet("View a course's aggregate exam stats (average difficulty, average time pressure, most-cited topics) before reading individual reports"),
        bullet("Submit exam intelligence reports and study materials, with an optional file attachment"),
        bullet("Upvote or downvote a submission's usefulness"),
        bullet("Edit or delete their own submissions"),
        bullet("Report another student's submission for review"),
        spacer(160),
        h2("Moderators (students with an elevated flag)"),
        bullet("Everything a regular student can do"),
        bullet("Review the report queue (grouped by resolved / unresolved)"),
        bullet("Take down or restore reported content, with a note"),
        bullet("Dismiss reports that don't warrant action"),

        // ---------- 03 User flows ----------
        h1("User flows", "03"),
        body("How each interaction touches the database — the diagram traces the primary path; the numbered steps that follow cover every flow in the same level of detail the course expects in a proposal's user-flow section.", { color: INK_MUTED, italics: true }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [
            new ImageRun({
              type: "png",
              data: fs.readFileSync("flow-diagram-cropped.png"),
              transformation: { width: 700, height: 239 },
            }),
          ],
        }),
        body("Teal = user-facing step. Tan = database operation. A higher-resolution version is in the companion web draft.", { color: INK_MUTED, italics: true }),
        spacer(160),
        numFlow(1, "Sign up", "user submits SIIT email + handle + password → backend checks the email domain and password policy → CALL sp_register_user(...) salts, hashes, and inserts into User."),
        numFlow(2, "Browse courses", "user searches or filters by code/title → indexed SELECT on Course."),
        numFlow(3, "View a course page", "user opens a course → SELECT across CourseOffering and Content (joined to its subtype); aggregate stats computed by fn_course_summary(course_id)."),
        numFlow(4, "Submit exam intelligence", "user fills the report form (format, topics, difficulty, advice) and may attach a file (e.g. a scanned cheat sheet used for that exam) → CALL sp_submit_content(...) inserts into Content and ExamIntel inside one transaction."),
        numFlow(5, "Submit study material", "user writes notes and/or attaches a file (PDF, image, or text) → same procedure inserts into Content and Materials, checking that at least one of the two is present."),
        numFlow(6, "Edit or delete a submission", "author reopens their own entry → UPDATE/DELETE on Content and its subtype row, scoped to author_id, inside a transaction."),
        numFlow(7, "Vote", "user marks a submission helpful or not → INSERT/UPDATE on Vote → an AFTER trigger updates a denormalized score on Content."),
        numFlow(8, "Report", "user flags a submission with a reason → INSERT into Report."),
        numFlow(9, "Moderate", "moderator reviews the queue and takes an item down → CALL sp_moderate_content(...) soft-deletes the Content row and auto-resolves its open reports."),

        // ---------- 04 Interface ----------
        h1("Interface sketch", "04"),
        body("Three screens carry most of the database activity: a course catalogue with search/filter, a course page showing aggregate stats above the individual submission list, and a moderation queue listing reports with a take-down action. Full UI design follows in Week 9's full-stack integration lab; see the companion web draft for low-fidelity wireframes of each."),

        // ---------- 05 Database design ----------
        h1("Database design", "05"),
        body("This redesign fixes two real problems found while auditing the working prototype: instructor/semester were duplicated free-text on every submission instead of a normalized entity, and votes/reports pointed at “either exam intel or materials” with no real foreign key. Both are fixed below by introducing CourseOffering and a Content supertype."),
        h2("Entities list"),
        bullet("User (account) — user_id (PK), siit_email, handle, real_name, password_hash, salt, program, year, is_admin"),
        bullet("Course — course_id (PK), code, title, program, credits"),
        bullet("Instructor — instructor_id (PK), name"),
        bullet("CourseOffering (new — normalizes duplicated text) — offering_id (PK), course_id (FK), instructor_id (FK), semester"),
        bullet("Content — supertype, disjoint & total — content_id (PK), offering_id (FK), author_id (FK), content_type, file_path (optional attachment, shared by both subtypes), credit_by_name, removed_at, removed_by (FK), removed_note, created_at"),
        bullet("    ExamIntel (subtype) — content_id (PK/FK), exam_type, format (JSON), topics (JSON), allowed_aids, duration_min, time_pressure, difficulty, advice"),
        bullet("    Materials (subtype) — content_id (PK/FK), title, type, body_md"),
        bullet("Vote (new — activates an unused idea from the prototype) — vote_id (PK), content_id (FK), user_id (FK), value, created_at"),
        bullet("Report — report_id (PK), content_id (FK), reporter_id (FK), reason, resolved, resolved_at, resolved_by (FK), created_at"),
        spacer(160),
        body("Why file_path moved to the supertype: the first pass put it only on Materials, but a student attaching a scanned cheat sheet to an exam-intel report is just as real a case — so the attachment belongs where both subtypes can reach it. The tradeoff: MySQL's CHECK constraints can only reference columns within their own table, so “a Materials row needs either body text or a file” can no longer be a single-table CHECK once the file lives on Content and the text lives on Materials. That validation moves into sp_submit_content instead.", { italics: true, color: INK_MUTED }),
        spacer(160),
        h2("Relationship sets"),
        bullet("Content ISA {ExamIntel, Materials} — disjoint, total: every Content row is exactly one subtype."),
        bullet("User Authors Content (1:M)"),
        bullet("User Casts Vote (1:M); Vote Targets Content (M:1) — together, User–Votes–Content is M:N with a value attribute."),
        bullet("User Files Report (1:M); Report Targets Content (M:1) — User–Reports–Content is M:N with reason/resolved attributes."),
        bullet("Course Has CourseOffering (1:M)"),
        bullet("Instructor Teaches CourseOffering (1:M)"),
        bullet("CourseOffering Has Content (1:M)"),
        spacer(240),
        h2("ER diagram"),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [
            new ImageRun({
              type: "png",
              data: fs.readFileSync("er-diagram-cropped.png"),
              transformation: { width: 620, height: 357 },
            }),
          ],
        }),
        body("Legend: dashed teal fill = supertype/subtype; PK labels in rust; FK labels in blue.", { color: INK_MUTED, italics: true }),

        // ---------- 06 Triggers & procedures ----------
        h1("Understanding of procedures and triggers", "06"),
        body("Each one is motivated by a specific problem found in the working prototype, and mapped onto the week CSS326 teaches the matching concept (see the timeline).", { italics: true, color: INK_MUTED }),
        h2("Triggers"),
        dataTable(
          ["Trigger", "Fires on", "What it does"],
          [2400, 1800, 6266],
          [
            ["trg_vote_score", "AFTER INSERT / DELETE · Vote", "Maintains a denormalized helpfulness score on the parent Content row whenever a vote is cast or removed, so the course page can sort/filter without aggregating Vote on every read."],
            ["trg_enforce_siit_domain", "BEFORE INSERT / UPDATE · User", "Rejects any row whose siit_email doesn't match the institutional domain, at the database layer — the same rule the app layer enforces, so a bug or a second write path can't bypass it."],
            ["trg_stamp_resolution", "BEFORE UPDATE · Report", "When resolved flips to true, stamps resolved_at/resolved_by itself — the application never sets those columns directly, so a moderation record can't be forged by a compromised client."],
          ],
        ),
        spacer(240),
        h2("Stored procedures & functions"),
        dataTable(
          ["Name", "Kind", "What it does"],
          [2600, 1600, 6266],
          [
            ["sp_register_user(email, handle, password)", "Procedure", "Validates the SIIT domain and password policy, generates a random salt, hashes the password, and inserts the new User row."],
            ["sp_submit_content(...)", "Procedure · Transaction", "Inserts the shared Content row (including its optional attachment) and its subtype row (ExamIntel or Materials) inside one BEGIN/COMMIT/ROLLBACK block. For materials, also checks that either body_md or file_path is set — the one validation a table CHECK can't express here, since the two columns now live in different tables."],
            ["sp_moderate_content(content_id, admin_id, remove, note)", "Procedure · Security", "Checks the caller's is_admin flag, then soft-deletes (or restores) the target Content row and auto-resolves any open reports against it."],
            ["fn_course_summary(course_id)", "Function", "Returns aggregate stats for a course — average difficulty, average time pressure, most-cited topics — computed in SQL instead of pulled client-side."],
          ],
        ),

        // ---------- 07 Physical design ----------
        h1("Physical design for MySQL", "07"),
        body("Every entity above, translated to concrete MySQL column types.", { color: INK_MUTED, italics: true }),

        h2("User"),
        dataTable(["Attribute", "Contents", "Type", "Format", "Null", "Range", "Key", "FK"], [1300, 2600, 900, 900, 600, 2000, 600, 1566], [
          ["user_id", "Unique user identifier", "INT", "Integer", "No", "Auto-increment", "PK", ""],
          ["siit_email", "Institutional email, verifies membership", "VARCHAR", "Text", "No", "255, unique", "UQ", ""],
          ["handle", "Public display name", "VARCHAR", "Text", "No", "3–32, unique", "UQ", ""],
          ["real_name", "Private legal name, shown only if credited", "VARCHAR", "Text", "Yes", "100", "", ""],
          ["password_hash", "Salted, hashed password", "VARCHAR", "Text", "No", "255", "", ""],
          ["salt", "Random per-user salt", "VARBINARY", "Binary", "No", "32", "", ""],
          ["program", "Degree program (e.g. DE, CE)", "VARCHAR", "Text", "Yes", "50", "", ""],
          ["year", "Cohort year", "TINYINT", "Integer", "Yes", "1–8", "", ""],
          ["is_admin", "Moderator flag", "TINYINT(1)", "Boolean", "No", "0/1, default 0", "", ""],
          ["created_at", "Account creation timestamp", "DATETIME", "ISO 8601", "No", "default CURRENT_TIMESTAMP", "", ""],
        ]),
        spacer(200),

        h2("Course"),
        dataTable(["Attribute", "Contents", "Type", "Format", "Null", "Range", "Key", "FK"], [1300, 2600, 900, 900, 600, 2000, 600, 1566], [
          ["course_id", "Unique course identifier", "INT", "Integer", "No", "Auto-increment", "PK", ""],
          ["code", "Official course code", "VARCHAR", "Text", "No", "10, unique", "UQ", ""],
          ["title", "Course title", "VARCHAR", "Text", "No", "150", "", ""],
          ["program", "Owning program", "VARCHAR", "Text", "Yes", "50", "", ""],
          ["credits", "Credit hours", "TINYINT", "Integer", "Yes", "1–6", "", ""],
        ]),
        spacer(200),

        h2("Instructor"),
        dataTable(["Attribute", "Contents", "Type", "Format", "Null", "Range", "Key", "FK"], [1300, 2600, 900, 900, 600, 2000, 600, 1566], [
          ["instructor_id", "Unique instructor identifier", "INT", "Integer", "No", "Auto-increment", "PK", ""],
          ["name", "Instructor's name", "VARCHAR", "Text", "No", "100, unique", "UQ", ""],
        ]),
        spacer(200),

        h2("CourseOffering"),
        dataTable(["Attribute", "Contents", "Type", "Format", "Null", "Range", "Key", "FK"], [1300, 2600, 900, 900, 600, 2000, 600, 1566], [
          ["offering_id", "Unique offering identifier", "INT", "Integer", "No", "Auto-increment", "PK", ""],
          ["course_id", "Course being offered", "INT", "Integer", "No", "", "FK", "Course"],
          ["instructor_id", "Instructor teaching this offering", "INT", "Integer", "Yes", "", "FK", "Instructor"],
          ["semester", "Semester code (e.g. 2026/1)", "VARCHAR", "Text", "No", "10", "", ""],
        ]),
        spacer(200),

        h2("Content (supertype)"),
        dataTable(["Attribute", "Contents", "Type", "Format", "Null", "Range", "Key", "FK"], [1300, 2600, 900, 900, 600, 2000, 600, 1566], [
          ["content_id", "Unique content identifier", "INT", "Integer", "No", "Auto-increment", "PK", ""],
          ["offering_id", "Course offering this belongs to", "INT", "Integer", "No", "", "FK", "CourseOffering"],
          ["author_id", "Contributing user", "INT", "Integer", "No", "", "FK", "User"],
          ["content_type", "Which subtype table holds the rest", "ENUM", "Enum", "No", "'exam_intel','materials'", "", ""],
          ["file_path", "Optional attachment (e.g. a scanned cheat sheet), shared by both subtypes", "VARCHAR", "Text", "Yes", "255", "", ""],
          ["credit_by_name", "Show author's real name?", "TINYINT(1)", "Boolean", "No", "0/1, default 0", "", ""],
          ["removed_at", "Moderation takedown timestamp", "DATETIME", "ISO 8601", "Yes", "", "", ""],
          ["removed_by", "Moderator who removed it", "INT", "Integer", "Yes", "", "FK", "User"],
          ["removed_note", "Optional takedown reason", "VARCHAR", "Text", "Yes", "255", "", ""],
          ["created_at", "Submission timestamp", "DATETIME", "ISO 8601", "No", "default CURRENT_TIMESTAMP", "", ""],
        ]),
        spacer(200),

        h2("ExamIntel (subtype of Content)"),
        dataTable(["Attribute", "Contents", "Type", "Format", "Null", "Range", "Key", "FK"], [1300, 2600, 900, 900, 600, 2000, 600, 1566], [
          ["content_id", "Shared primary key, extends Content", "INT", "Integer", "No", "", "PK, FK", "Content"],
          ["exam_type", "Which exam this describes", "ENUM", "Enum", "No", "'midterm','final','quiz'", "", ""],
          ["format", "Exam format(s)", "JSON", "JSON array", "No", "e.g. [\"MCQ\",\"Written\"]", "", ""],
          ["topics", "Topics covered", "JSON", "JSON array", "No", "e.g. [\"recursion\",\"sorting\"]", "", ""],
          ["allowed_aids", "What materials are permitted", "ENUM", "Enum", "Yes", "'none','one_sheet','open_book','calculator'", "", ""],
          ["duration_min", "Exam duration", "SMALLINT", "Integer", "Yes", "> 0", "", ""],
          ["time_pressure", "Self-rated time pressure", "TINYINT", "Integer", "No", "1–5", "", ""],
          ["difficulty", "Self-rated difficulty", "TINYINT", "Integer", "No", "1–5", "", ""],
          ["advice", "Free-text advice for future students", "TEXT", "Text", "Yes", "", "", ""],
        ]),
        spacer(200),

        h2("Materials (subtype of Content)"),
        dataTable(["Attribute", "Contents", "Type", "Format", "Null", "Range", "Key", "FK"], [1300, 2600, 900, 900, 600, 2000, 600, 1566], [
          ["content_id", "Shared primary key, extends Content", "INT", "Integer", "No", "", "PK, FK", "Content"],
          ["title", "Material title", "VARCHAR", "Text", "No", "150", "", ""],
          ["type", "Kind of material", "ENUM", "Enum", "No", "'summary','cheat_sheet','notes','worked_problems'", "", ""],
          ["body_md", "Markdown notes — required unless Content.file_path is set (checked in sp_submit_content, not a table CHECK)", "TEXT", "Text", "Yes", "", "", ""],
        ]),
        spacer(200),

        h2("Vote"),
        dataTable(["Attribute", "Contents", "Type", "Format", "Null", "Range", "Key", "FK"], [1300, 2600, 900, 900, 600, 2000, 600, 1566], [
          ["vote_id", "Unique vote identifier", "INT", "Integer", "No", "Auto-increment", "PK", ""],
          ["content_id", "Content being voted on", "INT", "Integer", "No", "", "FK", "Content"],
          ["user_id", "Voting user", "INT", "Integer", "No", "", "FK", "User"],
          ["value", "Upvote or downvote", "TINYINT", "Integer", "No", "-1 or 1", "", ""],
          ["created_at", "Vote timestamp", "DATETIME", "ISO 8601", "No", "default CURRENT_TIMESTAMP", "", ""],
        ]),
        spacer(200),

        h2("Report"),
        dataTable(["Attribute", "Contents", "Type", "Format", "Null", "Range", "Key", "FK"], [1300, 2600, 900, 900, 600, 2000, 600, 1566], [
          ["report_id", "Unique report identifier", "INT", "Integer", "No", "Auto-increment", "PK", ""],
          ["content_id", "Content being reported", "INT", "Integer", "No", "", "FK", "Content"],
          ["reporter_id", "Reporting user", "INT", "Integer", "No", "", "FK", "User"],
          ["reason", "Why it was reported", "VARCHAR", "Text", "No", "255", "", ""],
          ["resolved", "Whether a moderator reviewed it", "TINYINT(1)", "Boolean", "No", "0/1, default 0", "", ""],
          ["resolved_at", "Resolution timestamp", "DATETIME", "ISO 8601", "Yes", "", "", ""],
          ["resolved_by", "Moderator who resolved it", "INT", "Integer", "Yes", "", "FK", "User"],
          ["created_at", "Report timestamp", "DATETIME", "ISO 8601", "No", "default CURRENT_TIMESTAMP", "", ""],
        ]),
        spacer(160),
        body("Unique constraints not shown per-row above: CourseOffering(course_id, semester, instructor_id), Vote(content_id, user_id), Report(content_id, reporter_id).", { italics: true, color: INK_MUTED }),

        // ---------- 08 Work distribution ----------
        h1("Work distribution", "08"),
        body("Each area owns both the design decisions and the implementation for its slice — nobody hands off a finished schema to someone else to build against blind.", { italics: true, color: INK_MUTED }),
        dataTable(
          ["Area", "Owner", "What it covers"],
          [2400, 1800, 6266],
          [
            ["Database design & docs", "[Name]", "ER diagram, normalization, the physical design table, keeping the schema in sync as features change, this proposal and the demo write-up."],
            ["Backend, triggers & security", "[Name]", "Express routes, mysql2 queries, the four stored procedures/functions, the three triggers, password hashing, privilege checks, transaction boundaries."],
            ["Frontend, UI & testing", "[Name]", "Course catalogue, course page, submission forms, moderation queue view, transaction/concurrency test cases."],
          ],
        ),

        // ---------- 09 Timeline ----------
        h1("Timeline", "09"),
        body("Built from the actual CSS326 schedule — each milestone lands the week its concept is taught, rather than a generic week-by-week plan.", { italics: true, color: INK_MUTED }),
        dataTable(
          ["Week", "Date", "Plan"],
          [1400, 1600, 7466],
          [
            ["Week 7", "Sept 17", "Project proposal presentation (this document) — due tomorrow"],
            ["Week 8", "Sept 24", "Midterm exam week — no project work scheduled"],
            ["Week 9", "Oct 1", "Stand up the full schema (all 9 tables); basic Express CRUD for Course / Content"],
            ["Week 10", "Oct 8", "Implement sp_submit_content as a transaction; auth via sp_register_user"],
            ["Week 11", "Oct 15", "Implement the three triggers, sp_moderate_content, and DB-level privilege hardening"],
            ["Week 12", "Oct 22", "JSON / X DevAPI module — format/topics as JSON columns, document-store queries"],
            ["Week 13", "Oct 29", "Revision week — polish UI, write test cases, fix bugs"],
            ["Week 14", "Nov 5", "Project demonstration"],
            ["Week 15", "Nov 12", "Final exam"],
          ],
        ),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("SIIT_Study_Hub_Proposal.docx", buf);
  console.log("wrote SIIT_Study_Hub_Proposal.docx", buf.length, "bytes");
});
