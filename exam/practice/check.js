// Self-test: every model answer must pass the checker, every "common wrong answer" must fail.
//   node exam/practice/check.js
const assert = require('assert');
const { admin } = require('./db');
const practice = require('./controllers/practiceController');
const questions = require('./questions');

(async () => {
  const dbs = async () => (await admin.query('SHOW DATABASES'))[0].map((r) => Object.values(r)[0]).join(',');
  const before = await dbs();
  await practice.ensureSandboxUser();

  const parts = practice.splitStatements("SELECT 'a;b'; -- c;\nDELIMITER //\nCREATE x BEGIN y; END //\nDELIMITER ;\nSELECT 2;");
  assert.deepStrictEqual(parts, ["SELECT 'a;b'", 'CREATE x BEGIN y; END', 'SELECT 2']);

  let bad = 0; let wrongs = 0;
  for (const q of questions.filter((x) => x.type !== 'mcq')) {
    const ok = await practice.check(q, q.solution);
    const no = await practice.check(q, q.wrong.sql);
    wrongs += 1;
    const good = ok.passed && !no.passed;
    if (!good) bad += 1;
    console.log(`${good ? 'ok  ' : 'FAIL'} ${q.id.padEnd(4)} model:${ok.passed ? 'pass' : 'FAIL ' + ok.reason}  wrong:${no.passed ? 'PASSED (should fail)' : 'rejected - ' + no.reason.slice(0, 70)}`);
  }
  for (const q of questions.filter((x) => x.type === 'mcq')) assert(q.options[q.answer] && q.explain, q.id);

  // The sandbox login must not be able to reach a lab database.
  const { connect } = require('./db');
  const c = await connect(false);
  const leak = await c.query('SELECT * FROM lab11.students').then(() => true, () => false);
  c.destroy();
  assert(!leak, 'sandbox user can read lab11!');
  const g = await practice.check(questions.find((x) => x.asRoot), 'DROP TABLE lab11.students;');
  assert(!g.passed && /another database/.test(g.reason), 'guard did not stop a cross-database statement');

  await practice.resetDb();
  const after = await dbs();
  console.log(`\n${questions.length} questions, ${wrongs} wrong answers tested, ${bad} problem(s). Sandbox isolation ok.`);
  console.log('Databases before:', before, '\nDatabases after: ', after);
  await admin.end();
  process.exit(bad ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
