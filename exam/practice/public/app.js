// Front end: question list, editor, result grids, stepped hints, locked answer.
// Progress lives in localStorage so a refresh never loses it.
const LEVELS = [['easy', 'Easy'], ['medium', 'Medium'], ['hard', 'Hard'], ['exam', 'Exam level']];
const KEY = 'css326-sql-practice';
let questions = [];
let tables = {};
let current = null;
let progress = JSON.parse(localStorage.getItem(KEY) || '{}');

const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const rich = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\n/g, '<br>');
const st = (id) => (progress[id] = progress[id] || { attempts: 0, hints: 0, solved: false, revealed: false, sql: null });
const save = () => localStorage.setItem(KEY, JSON.stringify(progress));

function grid(g) {
  if (!g) return '<p class="kbd">(no rows returned)</p>';
  const head = g.columns.map((c) => `<th>${esc(c)}</th>`).join('');
  const body = g.rows.slice(0, 200).map((r) => '<tr>' + r.map((v) => `<td${v === 'NULL' ? ' class="null"' : ''}>${esc(v)}</td>`).join('') + '</tr>').join('');
  return `<div class="scroll"><table><tr>${head}</tr>${body}</table></div><p class="kbd">${g.rows.length} row(s)</p>`;
}

function renderNav() {
  $('#nav').innerHTML = LEVELS.map(([lv, label]) => {
    const qs = questions.filter((q) => q.level === lv);
    const done = qs.filter((q) => st(q.id).solved).length;
    return `<div class="level"><span>${label}</span><span>${done}/${qs.length}</span></div>
      <div class="bar"><i style="width:${(100 * done) / qs.length}%"></i></div>
      <div class="qs">${qs.map((q) => {
        const s = st(q.id);
        const cls = [s.solved ? 'solved' : s.attempts ? 'tried' : '', current && current.id === q.id ? 'current' : ''].join(' ');
        return `<button class="${cls}" data-id="${q.id}" title="${esc(q.topic)}" aria-label="Question ${q.id}, ${esc(q.topic)}${s.solved ? ', solved' : ''}">${q.id}</button>`;
      }).join('')}</div>`;
  }).join('');
}

function helpHtml(q) {
  const s = st(q.id);
  let h = '';
  q.hints.slice(0, s.hints).forEach((t, i) => { h += `<div class="box"><h4>Hint ${i + 1}</h4><p>${t.includes('\n') || /___/.test(t) && /[;=]/.test(t) ? `<pre>${esc(t)}</pre>` : rich(t)}</p></div>`; });
  if (s.revealed || s.solved) {
    if (q.type === 'mcq') {
      h += `<div class="box"><h4>Why</h4><p>${rich(q.explain)}</p></div>`;
    } else {
      h += `<div class="box"><h4>Model answer</h4><pre>${esc(q.solution)}</pre><h4>Why it works</h4><p>${rich(q.explain)}</p></div>
        <div class="box trap"><h4>The trap this tests</h4><p>${rich(q.trap)}</p></div>
        <div class="box wrong"><h4>Common wrong answer</h4><pre>${esc(q.wrong.sql)}</pre><p>${rich(q.wrong.why)}</p></div>`;
    }
  }
  return h;
}

function helpButtons(q) {
  const s = st(q.id);
  const moreHints = s.hints < q.hints.length;
  const locked = !s.attempts && !s.revealed && !s.solved;
  return `<button class="ghost" id="hint" ${moreHints ? '' : 'disabled'}>${moreHints ? `Hint ${s.hints + 1} of ${q.hints.length}` : 'No more hints'}</button>
    <button class="ghost" id="answer" ${s.revealed || s.solved ? 'disabled' : ''}>${locked ? 'Give up and show answer' : 'Show answer'}</button>
    <button class="ghost" id="next">Next question →</button>
    ${locked ? '<span class="kbd">Try once first: the answer teaches more after an attempt.</span>' : ''}`;
}

function show(id) {
  current = questions.find((q) => q.id === id) || questions[0];
  const q = current; const s = st(q.id);
  const label = LEVELS.find((l) => l[0] === q.level)[1];
  let body;
  if (q.type === 'mcq') {
    body = `<div class="opts">${q.options.map((o, i) => `<button data-opt="${i}">${rich(o)}</button>`).join('')}</div><div id="out"></div>`;
  } else {
    body = `<details><summary>Tables and data</summary>${Object.entries(tables).map(([t, g]) => `<h4>${t}</h4>${grid(g)}`).join('')}</details>
      <textarea id="sql" spellcheck="false" aria-label="Your SQL">${esc(s.sql ?? q.starter ?? '')}</textarea>
      <div class="row"><button id="run">Run and check</button><span class="kbd">Ctrl/Cmd + Enter · the database is rebuilt before every run</span></div>
      <div id="out"></div>`;
  }
  $('#main').innerHTML = `<span class="tag">${label}</span><span class="tag">${esc(q.topic)}</span>${s.solved ? '<span class="tag">✓ solved</span>' : ''}
    <h2>Question ${q.id}</h2><p class="prompt">${rich(q.prompt)}</p>${body}
    <div class="row" id="helpBtns">${helpButtons(q)}</div><div id="help">${helpHtml(q)}</div>`;
  renderNav();
  location.hash = q.id;
}

function refreshHelp() {
  $('#helpBtns').innerHTML = helpButtons(current);
  $('#help').innerHTML = helpHtml(current);
  renderNav();
}

async function run() {
  const q = current; const s = st(q.id);
  const sql = $('#sql').value;
  s.sql = sql; s.attempts += 1; save();
  $('#run').disabled = true;
  $('#out').innerHTML = '<p class="kbd">Running…</p>';
  try {
    const res = await fetch(`/api/questions/${q.id}/run`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sql }),
    });
    const r = await res.json();
    if (!res.ok) throw new Error(r.error);
    if (r.passed) { s.solved = true; save(); }
    const what = r.test ? ['Hidden test: your result', 'Hidden test: expected'] : ['Your result', 'Expected result'];
    $('#out').innerHTML = `<div class="msg ${r.passed ? 'ok' : 'bad'}" role="status">${r.passed ? '✓ Correct.' : '✗ Not yet. ' + esc(r.reason)}</div>
      ${(r.notes || []).length ? `<p class="kbd">${r.notes.map(esc).join(' · ')}</p>` : ''}
      ${r.test ? `<details><summary>What the hidden test runs after your SQL</summary><pre>${esc(r.test)}</pre></details>` : ''}
      ${r.yours || r.expected ? `<div class="grids"><div><h4>${what[0]}</h4>${grid(r.yours)}</div><div><h4>${what[1]}</h4>${r.expected ? grid(r.expected) : ''}</div></div>` : ''}`;
  } catch (err) {
    $('#out').innerHTML = `<div class="msg bad" role="alert">Could not run: ${esc(err.message)}. Is the server still running?</div>`;
  }
  $('#run').disabled = false;
  refreshHelp();
}

function pick(i) {
  const q = current; const s = st(q.id);
  s.attempts += 1;
  const right = i === q.answer;
  if (right) s.solved = true;
  save();
  document.querySelectorAll('.opts button').forEach((b, k) => {
    b.classList.toggle('right', right && k === i);
    b.classList.toggle('wrongpick', !right && k === i);
  });
  $('#out').innerHTML = `<div class="msg ${right ? 'ok' : 'bad'}" role="status">${right ? '✓ Correct.' : '✗ Not that one. Try again, or take a hint.'}</div>`;
  refreshHelp();
}

document.addEventListener('click', async (e) => {
  const t = e.target.closest('button'); if (!t) return;
  if (t.dataset.id) return show(t.dataset.id);
  if (t.dataset.opt) return pick(Number(t.dataset.opt));
  if (t.id === 'run') return run();
  if (t.id === 'hint') { st(current.id).hints += 1; save(); return refreshHelp(); }
  if (t.id === 'answer') { st(current.id).revealed = true; save(); return refreshHelp(); }
  if (t.id === 'next') { const i = questions.indexOf(current); return show(questions[(i + 1) % questions.length].id); }
  if (t.id === 'resetDb') {
    t.disabled = true; t.textContent = 'Resetting…';
    const ok = await fetch('/api/reset', { method: 'POST' }).then((r) => r.ok, () => false);
    t.textContent = ok ? 'Database reset ✓' : 'Reset failed';
    setTimeout(() => { t.textContent = 'Reset database'; t.disabled = false; }, 1500);
  }
  if (t.id === 'resetProgress' && confirm('Clear all solved marks, hints and saved answers?')) { progress = {}; save(); show(current.id); }
});
document.addEventListener('keydown', (e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && $('#sql')) run(); });
document.addEventListener('input', (e) => { if (e.target.id === 'sql') { st(current.id).sql = e.target.value; save(); } });

(async () => {
  try {
    [questions, tables] = await Promise.all([fetch('/api/questions').then((r) => r.json()), fetch('/api/tables').then((r) => r.json())]);
    const firstOpen = questions.find((q) => !st(q.id).solved) || questions[0];
    show(location.hash.slice(1) || firstOpen.id);
  } catch (err) {
    $('#main').innerHTML = `<div class="msg bad">Could not load. Start the server with <code>node exam/practice/server.js</code> and check MySQL is running.</div>`;
  }
})();
