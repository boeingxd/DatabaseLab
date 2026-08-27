# CSS326 Lab Assignment #2 — Draft Answers

> Draft only — rewrite in your own words before submitting. Q4 and Q6 need
> a Workbench screenshot/export, not text (see notes at the bottom).

## 1. Entities & attributes (1 pt)

**customers**
| column | type | notes |
|---|---|---|
| customer_id | INT | PK |
| first_name | VARCHAR(50) | part of a composite attribute |
| last_name | VARCHAR(50) | part of a composite attribute |
| email | VARCHAR(100) | |

*Composite attribute:* the customer's **name** is composite — it's made of
smaller parts (first name, last name). I split it into `first_name` and
`last_name` columns instead of one `name` column so each part can be
queried/sorted independently.

**books**
| column | type |
|---|---|
| book_id | INT | PK
| title | VARCHAR(200) |
| author | VARCHAR(100) |
| price | DECIMAL(8,2) |
| stock_quantity | INT |

**orders**
| column | type |
|---|---|
| order_id | INT | PK
| customer_id | INT | FK → customers
| order_date | DATETIME |

**order_items** (resolves the many-to-many between orders and books)
| column | type |
|---|---|
| order_item_id | INT | PK
| order_id | INT | FK → orders
| book_id | INT | FK → books
| quantity | INT |
| unit_price | DECIMAL(8,2) | price snapshot at time of sale |

*Derived attribute:* **line_total** (`quantity * unit_price`) is derived —
computed from other stored values rather than stored itself, so it can't go
stale if the price changes later. It's produced with a query
(`SELECT quantity * unit_price AS line_total ...`) instead of a column.

## 2. Primary keys (1 pt)

- `customers.customer_id` — a surrogate auto-increment ID; good because
  email or name could theoretically repeat or change, so a stable
  system-generated ID avoids depending on real-world data.
- `books.book_id` — same reasoning; title/author aren't guaranteed unique
  (two editions could share a title).
- `orders.order_id` — each order needs its own stable identifier
  independent of customer or date.
- `order_items.order_item_id` — a surrogate key is simplest; the natural
  alternative, a composite key of `(order_id, book_id)`, also works since
  a book appears at most once per order (enforced with the UNIQUE
  constraint either way).

## 3. Relationships & cardinality (1 pt)

(a) **customers → orders**: **1:N** — one customer can place many orders,
but each order belongs to exactly one customer. `orders.customer_id` is
the FK on the "many" side.

(b) **orders ↔ books**: **N:N** — an order can contain several books, and
the same book can appear in many different orders. MySQL/relational
tables can't express M:N directly, so it's represented with the
**`order_items`** junction (associative) table, which breaks the M:N into
two 1:N relationships: `orders (1) — (N) order_items (N) — (1) books`.

## 5. Normalizing the flat table (1.5 pts)

**Problems with the one-big-table design:**
1. **Redundancy / update anomaly** — `customer`, `email`, `book`, and
   `price` repeat on every line (e.g. "Suda"/her email appear twice,
   "Databases 101"/450.00 appear twice). If a customer's email or a
   book's price changes, every row containing it must be updated, and
   missing even one leaves inconsistent data.
2. **Insertion/deletion anomaly** — you can't record a new book or a new
   customer until they appear on an order (no order → no row to hold
   them), and deleting the one order row for a customer or book erases
   all record of them.

**Redesigned 3NF tables:**
- `customers(customer_id PK, name, email)`
- `books(book_id PK, title, price)`
- `orders(order_id PK, customer_id FK → customers)`
- `order_items(order_item_id PK, order_id FK → orders, book_id FK →
  books, qty)`

This matches the schema built in Q1/Q6 (with name split further into
first/last, and a price snapshot kept on `order_items` as `unit_price`).

## 7. Foreign keys (1 pt)

A **foreign key** is a column (or set of columns) in one table that must
match a value of the primary key in another table (or be NULL, if
allowed) — it's how a relational database enforces that a reference
actually points to something real. In this design,
`order_items.book_id REFERENCES books(book_id)` would reject an
`INSERT`/`UPDATE` that tries to record an order line for a `book_id` that
doesn't exist in the `books` table, preventing "orphan" order items that
point at nothing.

## 8. Relational DB vs. in-memory array (1 pt)

The biggest reason: **persistence and durability** — data in a Lab-1-style
in-memory array vanishes the moment the program exits or crashes, while a
relational database writes to disk and survives restarts. On top of that,
a relational database also enforces integrity constraints (PK/FK/UNIQUE)
and supports concurrent access from multiple users/programs safely, which
a plain array has no mechanism for at all.

---

## Notes on Q4 and Q6 (need Workbench, not text)

1. Open MySQL Workbench.
2. **File ▸ Import ▸ Reverse Engineer MySQL Create Script**, and select
   `assignments/2nd/lab2_bookstore_schema.sql` — Workbench will build the
   EER diagram automatically with PKs (key icon) and FKs already wired up.
3. Arrange the four tables so the relationship lines are readable, and
   confirm the crow's-foot ends show 1 and N correctly:
   - customers —1—<N— orders
   - orders —1—<N— order_items >N—1— books
4. **For Q4**: canvas view, `File ▸ Export ▸ Export as PNG/PDF` (or a
   screenshot) of the EER diagram.
5. **For Q6**: in the left **Physical Schemas** / SCHEMAS panel, expand
   `bookstore ▸ Tables` so all four tables are visible, and screenshot
   that panel (or the full canvas with the SQL script pane showing the
   `CREATE TABLE` statements is also acceptable — check what your TA
   expects).
6. Save the model file as `<studentID>_lab2.mwb` per your course's naming
   convention.
