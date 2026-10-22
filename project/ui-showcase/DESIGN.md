---
name: SIIT Study Hub
description: A SIIT-gated archive of student-authored exam intelligence and study materials, built to read as institutionally trustworthy — the category standard played straight.
colors:
  ink: "#16232c"
  ink-muted: "#4b5f68"
  ink-faint: "#7c8f97"
  paper: "#eef2f3"
  surface: "#ffffff"
  surface-sunken: "#e3e9ea"
  surface-hover: "#f4f7f7"
  accent: "#1f6f78"
  accent-strong: "#124047"
  accent-soft: "#dcedee"
  accent-soft-ink: "#0f4a51"
  rule: "#d3dcdd"
  rule-strong: "#aebcbf"
  danger: "#a3352b"
  danger-strong: "#7c2620"
  danger-soft: "#fbe9e6"
  warn: "#8a5a12"
  warn-soft: "#faedd6"
  success: "#2e6b4f"
  success-soft: "#e2f0e7"
typography:
  display:
    fontFamily: "IBM Plex Serif, Georgia, Times New Roman, serif"
    fontSize: "clamp(24px, 3vw, 30px)"
    fontWeight: 600
    lineHeight: 1.2
  title:
    fontFamily: "IBM Plex Serif, Georgia, Times New Roman, serif"
    fontSize: "19px"
    fontWeight: 600
  body:
    fontFamily: "IBM Plex Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "IBM Plex Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "11.5px"
    fontWeight: 600
    letterSpacing: "0.04em"
  mono:
    fontFamily: "IBM Plex Mono, ui-monospace, SFMono-Regular, Consolas, monospace"
    fontSize: "11.5px"
    fontWeight: 400
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
  full: "999px"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "20px"
  6: "24px"
  8: "32px"
  10: "40px"
  12: "48px"
  16: "64px"
components:
  button-primary:
    backgroundColor: "{colors.accent-strong}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "10px 18px"
  button-primary-hover:
    backgroundColor: "{colors.accent}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "10px 18px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.md}"
    padding: "10px 18px"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "10px 18px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "24px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
---

# Design System: SIIT Study Hub

## Overview

**Creative North Star: "The Institutional Ledger"**

SIIT Study Hub reads as a trustworthy, SIIT-scoped academic system first and a personality-driven product second — the direction contract names this explicitly (Canon, category standard, craft bar pinned to Google Classroom / Canvas LMS). The world is a neutral paper ground with ink text and exactly one committed teal accent, built from IBM Plex's three-family type system: serif for headings (an editorial, slightly formal register), sans for UI and body copy, and mono reserved for the database layer — a deliberate signal that this is a database-course artifact, not a generic app template. Cards, list rows, and tables carry restrained shadow and moderate radii; nothing in the system reaches for drama.

The build stayed disciplined against its own contract: dark mode was drafted and then removed rather than shipped silently, because an automatic re-skin would have contradicted the single committed light world (see Colors, Named Rules). Two structural fixes landed late — table-based lists gained a stacked-card responsive pattern below 640px so primary row actions never fall off-screen, and one page's title markup was split into a proper heading + sub-lines instead of a cramped inline span. Both are now load-bearing parts of the system, documented below.

**Key Characteristics:**
- One neutral paper/ink world, one teal accent, no secondary or tertiary hue
- Serif headings + sans body + mono for stored-procedure microcopy, never mixed roles
- Moderate radii (6–14px) and restrained shadow — never flat-and-cold, never lifted-and-loud
- Tables reflow to labeled stacked cards below 640px instead of scrolling sideways
- Light-only: no `prefers-color-scheme` override ships in this system

## Colors

The palette is a single neutral paper/ink ground plus one committed teal accent; semantic danger/warn/success colors exist only for status states, never as decoration.

### Primary
- **Teal Accent** (`#1f6f78`): the one accent color. Used for active nav underlines, hover borders, focus rings, checkbox/range accent-color, vote toggle fill, and any element that needs to read as "the system's color."
- **Teal Accent Strong** (`#124047`): the accent's deep variant, used specifically as the primary-button and active-pill fill (`--accent-strong`) and for db-note text/link color — a darker, higher-contrast register of the same hue rather than a second hue.
- **Teal Accent Soft** (`#dcedee`): the accent tint, used as badge/tag/avatar backgrounds and the focus-ring glow (`box-shadow: 0 0 0 3px var(--accent-soft)`), never as a large surface fill.

### Neutral
- **Paper** (`#eef2f3`): the page background (`body`) — cool, slightly blue-gray, never pure white.
- **Ink** (`#16232c`): primary text and heading color.
- **Ink Muted** (`#4b5f68`): secondary text — nav links at rest, meta labels, body copy that isn't the primary read.
- **Ink Faint** (`#7c8f97`): tertiary text — placeholders, table header labels, breadcrumb, timestamps.
- **Surface** (`#ffffff`): card, modal, input, and top-nav background — the one true white in the system, reserved for content containers raised off the paper ground.
- **Surface Sunken** (`#e3e9ea`): recessed fills — search box, dropzone, sunken tab-strip background.
- **Rule** (`#d3dcdd`) / **Rule Strong** (`#aebcbf`): hairline dividers and default borders; `rule-strong` is reserved for interactive borders (inputs, buttons, pills) that need slightly more contrast than a passive divider.

### Status (semantic, non-decorative)
- **Danger** (`#a3352b` / soft `#fbe9e6`): report/takedown/moderation-badge only.
- **Warn** (`#8a5a12` / soft `#faedd6`): materials badge and warning states only.
- **Success** (`#2e6b4f` / soft `#e2f0e7`): confirmation states only.

### Named Rules
**The One World Rule.** This system ships one committed light palette — paper, ink, one teal accent. There is no `prefers-color-scheme: dark` override; a dark variant is a separate reviewed direction, not an automatic re-skin, and its earlier presence in this codebase was removed as an uncited contradiction of the committed world.

**The Single Accent Rule.** Teal is the only hue used to mean "the system, active, or selected." Status colors (danger/warn/success) are semantic, not decorative substitutes for the accent — they never appear as a stand-in brand color.

## Typography

**Display/Headline Font:** IBM Plex Serif (with Georgia, Times New Roman fallback)
**Body Font:** IBM Plex Sans (with system-UI fallback stack)
**Label/Mono Font:** IBM Plex Mono (with ui-monospace fallback)

**Character:** A formal, editorial serif for headings paired with a plain, dense-information sans for everything operational, plus a distinct mono voice reserved for database-layer microcopy — three registers, three jobs, never interchanged.

### Hierarchy
- **Headline** (600, `clamp(24px, 3vw, 30px)`): page-level `<h1>` inside `.page-head`, one per page.
- **Title** (600, 19px, serif): card-level titles and the wordmark; e.g. the auth screen's "SIIT Study Hub" lockup.
- **Section Label** (700, 12px, uppercase, 0.05em tracking, `--ink-faint`): `.section-title` — used as a styled `<p>`, not a semantic heading, to mark subsections within a card (Format, Topics, Attachment, Actions, Your courses, Recently active).
- **Body** (400, 15px/1.55): default running text, `<p>` capped at 72ch.
- **Meta/Body Small** (400–500, 12.5–14.5px): list-row meta, page-sub, badges, hints.
- **Mono Label** (400–600, 11.5–13.5px): stored-procedure microcopy (`.db-note`), vote scores, stat units, slider output.

### Named Rules
**The Serif-Never-Runs Rule.** IBM Plex Serif is reserved for `<h1>`–`<h4>` and short title lockups; it never carries body copy or long-form paragraphs — those stay in IBM Plex Sans.
**The Named-Procedure Rule.** Any UI copy naming a backing stored procedure or trigger (e.g. `sp_register_user`, `sp_submit_content`) is set in IBM Plex Mono inside `.db-note`/`.mono`, distinguishing "what the database actually does" from ordinary UI text.

## Layout

The shell is a centered `max-width: 1180px` container (`.shell`, `--sp-6` side padding, `--sp-16` bottom padding), with a narrower `720px` variant for single-column/auth contexts. Top navigation is a sticky, fixed-height (`64px`) bar with a max-width-1180px inner row; below 860px the link row and search collapse behind a nav-toggle. The spacing rhythm is an 8-point-adjacent scale (`--sp-1` 4px through `--sp-16` 64px), applied consistently for gaps, padding, and vertical rhythm — no ad hoc pixel values outside this scale in the reused patterns.

Two responsive rules are load-bearing:
- **Grid collapse.** `.grid-2`/`.grid-3` collapse to one column below 720px; `.statrow` steps from auto-fit columns to 2 columns at 720px and 1 column at 600px.
- **Table-to-card reflow.** Below 640px, `.table` rows stop being a horizontally-scrolling table and become individually bordered, rounded, stacked cards; each `<td data-label="...">` prints its label above its value via `::before { content: attr(data-label) }`, and the primary action cell (last column) stays reachable without side-scrolling. This exists specifically because the pre-fix table on catalogue.html/moderation.html pushed the primary action off-screen on narrow viewports.

## Elevation & Depth

Flat-by-default with restrained ambient shadow on raised containers, never a structural or decorative hard shadow. Three shadow steps exist: `--shadow-sm` (cards, auth-tab active state), `--shadow-md` (unused as a reusable token beyond definition — reserved for stronger raise, not currently exercised by a component), and `--shadow-lg` (modal only). Depth communicates "this is a distinct surface above the paper," not hierarchy of importance.

### Shadow Vocabulary
- **Ambient low** (`box-shadow: 0 1px 2px rgba(18,39,43,.06), 0 1px 1px rgba(18,39,43,.04)`): default card and active auth-tab elevation.
- **Modal lift** (`box-shadow: 0 12px 32px rgba(18,39,43,.16), 0 4px 10px rgba(18,39,43,.08)`): the modal/overlay only, paired with a translateY+scale entrance transition.

### Named Rules
**The Flat-by-Default Rule.** Surfaces sit flush against the paper ground at rest; shadow appears only on containers that are structurally raised (card, modal), never as a hover-only embellishment on flat elements like nav links or table rows (those use background-color shifts instead).

## Shapes

Corners are moderate and consistent: `--radius-sm` (6px) for inputs, thumbnails, and small buttons; `--radius-md` (10px) for buttons, search boxes, dropzones, and pills' containers; `--radius-lg` (14px) for cards, modals, lists, and the stat-row block. Fully-round (`999px`) is reserved for pill filters, badges, tags, the avatar, and vote-score chips — anything meant to read as a discrete, tappable token rather than a container. Borders are 1px hairlines in `--rule`/`--rule-strong`; the dropzone is the one dashed-border exception (1.5px dashed), signaling "drop target" rather than "static container."

## Components

### Buttons
- **Shape:** `--radius-md` (10px); small variant uses `--radius-sm` (6px).
- **Primary:** `--accent-strong` fill, white text, `10px 18px` padding; hover shifts to `--accent`.
- **Secondary:** white surface, ink text, `--rule-strong` border; hover fills `--surface-hover`.
- **Ghost:** transparent, `--ink-muted` text; hover fills `--surface-sunken`.
- **Danger:** `--danger` fill, white text; hover deepens to `--danger-strong`. Reserved for takedown/destructive moderation actions only.
- All variants share a 1px `translateY` press-down on `:active` and a `:focus-visible` outline in `--focus-ring`.

### Chips / Pills / Badges
- **Pill (filter):** `999px` radius, `--rule-strong` border, white background at rest; `aria-pressed="true"` fills `--accent-strong` solid.
- **Badge:** `999px` radius, hairline border, small caps-free label text; semantic variants (`--exam` teal-soft, `--materials` warn-soft, `--program` surface-sunken) tint by content type, never by arbitrary choice.
- **Tag (tagfield):** `999px` radius, `--accent-soft` fill with `--accent-soft-ink` text, inline remove button.

### Cards / Containers
- **Corner Style:** 14px (`--radius-lg`).
- **Background:** `--surface` (white) on `--paper` ground.
- **Shadow Strategy:** ambient-low at rest (see Elevation).
- **Border:** 1px `--rule`.
- **Internal Padding:** `--sp-6` (24px) via `.card-pad`.

### Inputs / Fields
- **Style:** 1px `--rule-strong` border, `--radius-sm` (6px), white background, `10px 12px` padding.
- **Focus:** border shifts to `--accent` plus a 3px `--accent-soft` glow ring (`box-shadow: 0 0 0 3px var(--accent-soft)`) — the same glow treatment on inputs, textareas, selects, and the tagfield container.
- **Disabled/Error:** not exercised as a distinct visual state in this build (no disabled or invalid input states are shown); don't invent one without evidence.

### Navigation
- **Style:** sticky white top-nav, 64px tall, 1px bottom rule. Link default is `--ink-muted` 500-weight; hover darkens to `--ink`; active state (`aria-current="page"`) is `--ink` 600-weight with a 2px `--accent` bottom border.
- **Mobile treatment:** below 860px, link row and search collapse behind a `.nav-toggle` button.

### Tables / Lists (Signature Component)
- `.list`/`.list-row` is the default pattern for scannable rows (courses, submissions) — 40px rounded thumbnail, title + faint meta line, optional trailing action.
- `.table` is used for denser tabular data (catalogue, moderation queue). Below 640px it converts to stacked, individually-bordered cards via `data-label` attributes, keeping the row's primary action reachable without horizontal scroll — this is the fix that replaced the original non-reflowing table.

## Do's and Don'ts

### Do:
- **Do** keep teal (`--accent` / `--accent-strong`) as the only color that means "active, selected, or the system's own color."
- **Do** set any stored-procedure/trigger-naming microcopy in IBM Plex Mono via `.db-note`/`.mono`.
- **Do** give every `.table` a `data-label` on each `<td>` so it degrades to a labeled stacked card below 640px.
- **Do** use `--radius-lg` (14px) for cards/modals/lists, `--radius-md` (10px) for interactive controls, `--radius-sm` (6px) for inputs and small buttons — don't mix radii within one container.

### Don't:
- **Don't** ship a `prefers-color-scheme: dark` override or any second palette. This world is light-only by contract; a dark mode is a separate, explicitly reviewed direction.
- **Don't** use a hard offset/neobrutalist-style shadow anywhere in this system — the committed world is Canon/LMS-standard restrained elevation, not a graphic-novel or brutalist world.
- **Don't** style a subsection heading as a plain `<p class="section-title">` when it is the only heading in its region — exam-detail.html, materials-detail.html, and moderation.html currently do this for in-page subsections (Format/Topics/Attachment/Actions, etc.), which flattens the semantic heading hierarchy. This is a known, open, low-severity defect from the build, not a system rule to repeat in new screens: new subsection headings should use a real `<h2>`/`<h3>` styled to match `.section-title`, not the bare `<p>` pattern.
- **Don't** introduce a second accent hue for a new feature area; extend with the existing danger/warn/success semantics instead.
