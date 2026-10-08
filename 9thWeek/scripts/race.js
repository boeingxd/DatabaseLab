// scripts/race.js - fire many enrol requests at the SAME moment
// Usage:  npm run race -- <courseId> [firstStudentId] [lastStudentId]
// e.g.    npm run race -- 3 1 14     (server must be running on port 3000)
// Before running, give the course only a few seats, e.g. in Workbench:
//         UPDATE courses SET seats = 2 WHERE id = 3;
const base = 'http://localhost:3000';
const courseId = Number(process.argv[2] || 3);
const first = Number(process.argv[3] || 1);
const last = Number(process.argv[4] || 14);

(async () => {
  const before = await (await fetch(`${base}/courses/${courseId}`)).json();
  console.log('before:', before);

  const ids = [];
  for (let s = first; s <= last; s++) ids.push(s);
  const results = await Promise.all(ids.map(async (s) => {
    const r = await fetch(`${base}/students/${s}/enrolments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ course_id: courseId }),
    });
    return { student: s, status: r.status, body: await r.json() };
  }));
  results.forEach((r) => console.log(r.student, r.status, JSON.stringify(r.body)));

  const count = {};
  results.forEach((r) => { count[r.status] = (count[r.status] || 0) + 1; });
  console.log('status counts:', count);
  const after = await (await fetch(`${base}/courses/${courseId}`)).json();
  console.log('after:', after, '(seats must never be negative)');
})();
