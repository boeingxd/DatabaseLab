// ---------------------------------------------------------------------
// Exercise 5 (if time): the document store (X DevAPI)
// GET  /courses/:id/reviews
// POST /courses/:id/reviews     body: { "student": "Ploy", "stars": 5, "comment": "..." }
//
// Reviews are schema-free JSON documents in a COLLECTION called
// course_reviews, inside the same lab11 schema. No CREATE TABLE needed.
// Needs the X Protocol (port 33060, on by default in MySQL 8) and the
// @mysql/xdevapi package (installed by npm install).
// ---------------------------------------------------------------------

// Same login as db.js, read from .env (DB_X_PORT is the X Protocol port, not 3306)
const X_CONFIG = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_X_PORT || 33060),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
};
const SCHEMA = process.env.DB_NAME;

let mysqlx = null;
try { mysqlx = require('@mysql/xdevapi'); } catch { /* optional package missing */ }

async function withCollection(work) {
  if (!mysqlx) throw new Error('@mysql/xdevapi is not installed - run npm install');
  const session = await mysqlx.getSession(X_CONFIG);
  try {
    const schema = session.getSchema(SCHEMA);
    const reviews = await schema.createCollection('course_reviews', { reuseExisting: true });
    return await work(reviews);
  } finally {
    await session.close();
  }
}

// Where a document store fits better than a table: data whose shape varies per
// record or is still changing, e.g. free-form reviews where only some carry tags.

// GET /courses/:id/reviews - every review document of one course
exports.list = async (req, res) => {
  const courseId = Number(req.params.id);
  try {
    const docs = await withCollection(async (reviews) => {
      const result = await reviews.find('course_id = :c').bind('c', courseId).execute();
      return result.fetchAll();
    });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /courses/:id/reviews - add one review document; tags only when given,
// so documents in the collection don't all have the same fields
exports.add = async (req, res) => {
  const courseId = Number(req.params.id);
  const { student, stars, comment, tags } = req.body;
  if (!Number.isInteger(courseId) || !student || !stars) {
    return res.status(400).json({ error: 'student and stars are required' });
  }
  const doc = { course_id: courseId, student, stars: Number(stars), comment };
  if (Array.isArray(tags) ? tags.length : tags) doc.tags = tags;
  try {
    await withCollection((reviews) => reviews.add(doc).execute());
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
