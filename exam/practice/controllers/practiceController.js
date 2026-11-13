// The checker: rebuild the practice database, run your SQL on real MySQL, and compare
// what happened with what the model answer makes happen.
const { admin, connect, DB, SANDBOX } = require('../db');
const seed = require('../sql/seed');
const questions = require('../questions');

const byId = new Map(questions.map((q) => [q.id, q]));
const TABLES = ['students', 'courses', 'enrolments', 'books', 'customers', 'orders'];

// One request at a time: every run rebuilds the same database.
let chain = Promise.resolve();
const lock = (fn) => (chain = chain.then(fn, fn));

async function ensureSandboxUser() {
  const who = `'${SANDBOX.user}'@'localhost'`;
  await admin.query(`CREATE USER IF NOT EXISTS ${who} IDENTIFIED BY '${SANDBOX.password}'`);
  await admin.query(`GRANT ALL PRIVILEGES ON ${DB}.* TO ${who}`);
}

async function reset() {
  const conn = await admin.getConnection();
  try {
    await conn.query(`DROP DATABASE IF EXISTS ${DB}`);
    await conn.query(`CREATE DATABASE ${DB}`);
    await conn.query(`USE ${DB}`);
    for (const stmt of seed) await conn.query(stmt);
  } finally {
    conn.destroy(); // not release(): this connection now has a default database
  }
}

// Split a script into statements the way Workbench does: on the current delimiter,
// which DELIMITER lines can change. Quotes and comments are skipped over.
function splitStatements(text) {
  const out = [];
  let delim = ';';
  let cur = '';
  const push = () => { if (cur.trim()) out.push(cur.trim()); cur = ''; };
  for (const line of text.split('\n')) {
    const d = line.match(/^\s*DELIMITER\s+(\S+)\s*$/i);
    if (d) { push(); delim = d[1]; continue; }
    let i = 0;
    while (i < line.length) {
      const ch = line[i];
      if (ch === "'" || ch === '"' || ch === '`') {
        let j = i + 1;
        while (j < line.length && line[j] !== ch) j += line[j] === '\\' ? 2 : 1;
        cur += line.slice(i, j + 1); i = j + 1;
      } else if (line.startsWith('-- ', i) || line.slice(i) === '--' || ch === '#') {
        break; // comment to end of line
      } else if (line.startsWith(delim, i)) {
        push(); i += delim.length;
      } else { cur += ch; i += 1; }
    }
    cur += '\n';
  }
  push();
  return out;
}

const cell = (v) => {
  if (v === null || v === undefined) return 'NULL';
  if (Buffer.isBuffer(v)) v = v.toString();
  if (typeof v === 'object') return JSON.stringify(v);
  const n = Number(v);
  return v !== '' && Number.isFinite(n) ? String(Math.round(n * 10000) / 10000) : String(v);
};

// Run statements in order. Returns every result set, the ok-messages, and the first error.
async function run(conn, statements, { keepGoing = false } = {}) {
  const sets = []; const notes = []; const errors = [];
  for (const sql of statements) {
    try {
      const [res, fields] = await conn.query({ sql, rowsAsArray: true });
      const grid = (rows, f) => sets.push({ columns: f.map((x) => x.name), rows: rows.map((r) => r.map(cell)) });
      if (Array.isArray(fields) && fields.some(Array.isArray)) {
        res.forEach((r, i) => Array.isArray(r) && fields[i] && grid(r, fields[i])); // CALL
      } else if (Array.isArray(res)) {
        grid(res, fields);
      } else {
        notes.push(`OK, ${res.affectedRows} row(s) affected`);
      }
    } catch (err) {
      errors.push({ message: err.sqlMessage || err.message, errno: err.errno, sqlState: err.sqlState });
      if (!keepGoing) break;
    }
  }
  return { sets, notes, errors };
}

const sameGrid = (a, b, ordered) => {
  if (!a || !b || a.columns.length !== b.columns.length || a.rows.length !== b.rows.length) return false;
  const key = (g) => { const k = g.rows.map((r) => r.join('\u0001')); return ordered ? k : k.sort(); };
  return key(a).join('\u0002') === key(b).join('\u0002');
};

// Trigger questions must run as root on this server (binary logging is on), so before
// that we refuse any SQL that could leave the practice database.
async function guard(sql) {
  const [dbs] = await admin.query('SHOW DATABASES');
  const names = dbs.map((r) => Object.values(r)[0]).filter((n) => n !== DB);
  const bad = names.find((n) => new RegExp('`?\\b' + n + '\\b`?\\s*\\.', 'i').test(sql));
  if (bad) return `This question runs with extra rights, so it may not mention another database (${bad}).`;
  if (/\b(USE|GRANT|REVOKE|DATABASE|SCHEMA|USER)\b/i.test(sql)) {
    return 'This question runs with extra rights, so USE / GRANT / DATABASE / USER statements are not allowed here.';
  }
  return null;
}

// Rebuild, run a script, then run the question's hidden verify statements.
async function attempt(q, sql) {
  await reset();
  let conn = await connect(q.asRoot);
  try {
    const mine = await run(conn, splitStatements(sql));
    // The test uses a NEW connection, so work you never committed is gone - as in real life.
    conn.destroy();
    conn = await connect(q.asRoot);
    const verify = q.verify ? await run(conn, q.verify, { keepGoing: true }) : null;
    return { mine, verify };
  } finally {
    conn.destroy();
  }
}

const expectedCache = new Map();
async function expected(q) {
  if (!expectedCache.has(q.id)) expectedCache.set(q.id, await attempt(q, q.solution));
  return expectedCache.get(q.id);
}

async function check(q, sql) {
  const fail = (reason, extra = {}) => ({ passed: false, reason, ...extra });
  if (q.asRoot) { const g = await guard(sql); if (g) return fail(g); }

  const want = await expected(q);
  const got = await attempt(q, sql);
  const yours = got.mine.sets[got.mine.sets.length - 1] || null;
  const shown = { yours, notes: got.mine.notes };

  if (got.mine.errors.length) {
    const e = got.mine.errors[0];
    const forgot = /^\s*CREATE\s+(PROCEDURE|TRIGGER|FUNCTION)/im.test(sql) && !/DELIMITER/i.test(sql) && e.errno === 1064;
    return fail(`MySQL error ${e.errno}: ${e.message}` + (forgot ? '  (Did you forget DELIMITER // ... END // DELIMITER ; ?)' : ''), shown);
  }
  for (const [re, msg] of q.must || []) if (!new RegExp(re, 'i').test(sql)) return fail(msg, shown);
  for (const [re, msg] of q.mustNot || []) if (new RegExp(re, 'i').test(sql)) return fail(msg, shown);

  if (q.verify) {
    const a = got.verify; const b = want.verify;
    const ok = a.sets.length === b.sets.length && a.sets.every((s, i) => sameGrid(s, b.sets[i], true))
      && a.errors.map((e) => e.sqlState).join() === b.errors.map((e) => e.sqlState).join();
    const i = a.sets.findIndex((s, k) => !sameGrid(s, b.sets[k], true));
    const at = i === -1 ? a.sets.length - 1 : i;
    const extra = { ...shown, test: q.verify.join(';\n') + ';', yours: a.sets[at] || null, expected: b.sets[at] || null };
    if (ok) return { passed: true, ...extra };
    const unexpected = a.errors.find((e, k) => e.sqlState !== (b.errors[k] || {}).sqlState);
    return fail(unexpected
      ? `The hidden test hit an error your solution should not cause: ${unexpected.message}`
      : 'Your SQL ran, but the hidden test sees a different result from the model answer.', extra);
  }

  const model = want.mine.sets[want.mine.sets.length - 1];
  if (!yours) return fail('Your SQL ran, but it did not return any rows to compare. End with a SELECT.', { ...shown, expected: model });
  if (sameGrid(yours, model, q.ordered)) return { passed: true, ...shown, expected: model };
  const why = yours.columns.length !== model.columns.length ? `Expected ${model.columns.length} column(s), you returned ${yours.columns.length}.`
    : yours.rows.length !== model.rows.length ? `Expected ${model.rows.length} row(s), you returned ${yours.rows.length}.`
    : sameGrid(yours, model, false) ? 'Right rows, wrong order: this question asks for a specific ORDER BY.'
    : 'Same shape, but some values differ.';
  return fail(why, { ...shown, expected: model });
}

// ---- HTTP handlers -------------------------------------------------------------
exports.listQuestions = (req, res) => res.json(questions);

exports.tables = (req, res) => lock(async () => {
  try {
    await reset();
    const out = {};
    for (const t of TABLES) {
      const [rows, fields] = await admin.query({ sql: `SELECT * FROM ${DB}.${t}`, rowsAsArray: true });
      out[t] = { columns: fields.map((f) => f.name), rows: rows.map((r) => r.map(cell)) };
    }
    res.json(out);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

exports.runAnswer = (req, res) => lock(async () => {
  const q = byId.get(req.params.id);
  const sql = String(req.body.sql || '');
  if (!q || q.type === 'mcq') return res.status(404).json({ error: 'no such SQL question' });
  if (!sql.trim()) return res.status(400).json({ error: 'type some SQL first' });
  try { res.json(await check(q, sql)); } catch (err) { res.status(500).json({ error: err.message }); }
});

exports.reset = (req, res) => lock(async () => {
  try { await reset(); res.json({ ok: true }); } catch (err) { res.status(500).json({ error: err.message }); }
});

Object.assign(exports, { ensureSandboxUser, resetDb: reset, check, splitStatements, lock });
