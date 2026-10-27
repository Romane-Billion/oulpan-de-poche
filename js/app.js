import { WORDS, LESSONS, STAGES } from './data.js';

// ---------- État sauvegardé sur le téléphone ----------

const KEY = 'oulpan-v1';
const DEFAULT = {
  settings: { nikud: true, translit: true, muted: false, slow: false, big: false },
  lessons: {},     // l1: { done: '2026-10-27' }
  stages: {},      // e1: '2026-11-20'
  cards: {},       // id: { box, due, misses }
  hard: {},        // id: 'manual' | 'auto'
  notes: [],       // { date, where, text }
  streak: { last: null, count: 0, today: 0 },
  reviews: { date: null, n: 0 },
  resume: null,    // { lesson, step }
  session: null,   // exercices en cours
};
const DAILY_GOAL = 10;      // réponses par jour pour l'objectif
const REVIEW_CAP = 30;      // révisions max par jour
const BLOCK = 10;           // questions par mini-bloc
const INTERVALS = [0, 1, 2, 4, 8, 16, 32]; // jours d'attente par boîte

let S = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);
      return {
        ...structuredClone(DEFAULT), ...s,
        settings: { ...DEFAULT.settings, ...s.settings },
        streak: { ...DEFAULT.streak, ...s.streak },
        reviews: { ...DEFAULT.reviews, ...s.reviews },
      };
    }
  } catch (e) { /* stockage indisponible : on repart de zéro */ }
  return structuredClone(DEFAULT);
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ }
}

// ---------- Dates ----------

function dayStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
const today = () => dayStr(new Date());
function addDays(n) { const d = new Date(); d.setDate(d.getDate() + n); return dayStr(d); }

// ---------- Texte hébreu ----------

const MARKS = /[֑-ׇ]/g;
const strip = s => s.replace(MARKS, '');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Les leçons de lecture gardent toujours les voyelles.
function heOf(w, keep) {
  if (typeof w === 'string') return (S.settings.nikud || keep) ? w : strip(w);
  return (S.settings.nikud || keep) ? w.he : (w.p || strip(w.he));
}
const he = (text, cls = '') => `<bdi class="he ${cls}" lang="he">${esc(text)}</bdi>`;
// Texte mixte (fiches) : on isole les morceaux en hébreu, voyelles toujours visibles.
const mixed = text => esc(text).replace(/[֐-׿]+(?:[  ]+[֐-׿]+)*/g, m => `<bdi class="he" lang="he">${m}</bdi>`);

const KIND = {};
for (const [lid, l] of Object.entries(LESSONS)) for (const id of [...l.items, ...l.examples]) KIND[id] ??= { kind: l.kind, lesson: lid };
const keepNikud = id => KIND[id] && KIND[id].kind !== 'vocab';

// ---------- Voix ----------

let voices = [];
function loadVoices() { if (window.speechSynthesis) voices = speechSynthesis.getVoices(); }
loadVoices();
if (window.speechSynthesis) speechSynthesis.addEventListener('voiceschanged', loadVoices);

function voiceFor(lang) {
  const l = lang.slice(0, 2);
  const vs = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith(l));
  return vs.find(v => /enhanced|premium|améliorée|amelioree/i.test(v.name)) || vs.find(v => v.localService) || vs[0];
}
let speakToken = 0;
function speak(text, lang = 'he-IL', onend) {
  const token = ++speakToken;
  const done = () => { if (onend && token === speakToken) onend(); };
  if (!window.speechSynthesis || S.settings.muted) { if (onend) setTimeout(done, 400); return; }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  const v = voiceFor(lang);
  if (v) u.voice = v;
  u.rate = lang.startsWith('he') ? (S.settings.slow ? 0.6 : 0.9) : 1;
  u.onend = done;
  u.onerror = done;
  speechSynthesis.speak(u);
}
function stopSpeech() { speakToken++; if (window.speechSynthesis) speechSynthesis.cancel(); }
const sayWord = id => speak(WORDS[id].he);

// ---------- Petits outils ----------

const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const plural = (n, one, many) => `${n} ${n > 1 ? many : one}`;

function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}

function openSheet(html, onMount) {
  closeSheet();
  const bg = document.createElement('div');
  bg.className = 'sheet-bg';
  bg.id = 'sheet';
  bg.innerHTML = `<div class="sheet">${html}</div>`;
  bg.addEventListener('click', e => { if (e.target === bg) closeSheet(); });
  document.body.appendChild(bg);
  if (onMount) onMount(bg);
}
function closeSheet() { document.getElementById('sheet')?.remove(); }

function wordRow(id) {
  const w = WORDS[id];
  const on = !!S.hard[id];
  return `<div class="word">
    <button class="word-main" data-say="${id}">
      ${he(heOf(w, keepNikud(id)))}
      ${S.settings.translit ? `<span class="tr">${esc(w.tr)}</span>` : ''}
      <span class="fr">${esc(w.fr)}</span>
    </button>
    <button class="star ${on ? 'on' : ''}" data-star="${id}" aria-label="${on ? 'Retirer des mots difficiles' : 'Marquer comme difficile'}">${on ? '★' : '☆'}</button>
  </div>`;
}

function lineCard(l, keep, extra = '') {
  return `<div class="line">
    ${l.who ? `<div class="who">${esc(l.who)}</div>` : ''}
    <button class="say" data-say-text="${esc(l.he)}">${he(heOf(l.he, keep))} 🔊</button>
    ${S.settings.translit ? `<div class="tr">${esc(l.tr)}</div>` : ''}
    <details><summary>Traduction</summary>${esc(l.fr)}</details>
    ${extra}
  </div>`;
}

// ---------- Progression ----------

function tick() {
  const t = today();
  if (S.streak.last !== t) {
    S.streak.count = S.streak.last === addDays(-1) ? S.streak.count + 1 : 1;
    S.streak.last = t;
    S.streak.today = 0;
  }
  S.streak.today++;
}
function streakNow() {
  return S.streak.last === today() || S.streak.last === addDays(-1) ? S.streak.count : 0;
}
const todayCount = () => (S.streak.last === today() ? S.streak.today : 0);
const reviewsToday = () => (S.reviews.date === today() ? S.reviews.n : 0);

function grade(id, result) {
  const c = S.cards[id] || (S.cards[id] = { box: 1, due: today(), misses: 0 });
  if (result === 'good') c.box = Math.min(c.box + 1, INTERVALS.length - 1);
  if (result === 'bad') {
    c.box = 1;
    c.misses++;
    if (c.misses >= 3 && !S.hard[id]) { S.hard[id] = 'auto'; toast('Ajouté à tes mots difficiles'); }
  }
  // « J'hésitais » : même boîte, mais revient deux fois plus tôt.
  const wait = result === 'bad' ? 1 : result === 'mid' ? Math.max(1, Math.floor(INTERVALS[c.box] / 2)) : INTERVALS[c.box];
  c.due = addDays(wait);
}

function dueIds() {
  const t = today();
  return Object.entries(S.cards)
    .filter(([, c]) => c.due <= t)
    .sort((a, b) => a[1].due.localeCompare(b[1].due) || a[1].box - b[1].box)
    .map(([id]) => id);
}
function dueToday() {
  return Math.max(0, Math.min(dueIds().length, REVIEW_CAP - reviewsToday()));
}

function stageLessons(stage) { return stage.lessons; }
function isUnlocked(lid) {
  for (const st of STAGES) {
    const i = st.lessons.indexOf(lid);
    if (i === 0) return true;
    if (i > 0) return !!S.lessons[st.lessons[i - 1]];
  }
  return false;
}
function nextLesson() {
  for (const st of STAGES) for (const lid of st.lessons) if (!S.lessons[lid]) return lid;
  return null;
}

// ---------- Questions ----------

function pickOptions(answerId, pool, key) {
  const answer = key(answerId);
  const seen = new Set([answer]);
  const out = [answerId];
  for (const id of shuffle(pool)) {
    if (out.length >= 4) break;
    const v = key(id);
    if (!seen.has(v)) { seen.add(v); out.push(id); }
  }
  return shuffle(out);
}
function poolFor(id) {
  const info = KIND[id];
  const base = info ? LESSONS[info.lesson].items : [];
  if (base.length >= 6) return base;
  return Object.keys(KIND).filter(k => KIND[k].kind === (info ? info.kind : 'vocab'));
}
const TWINS = [['l-bet', 'l-kaf'], ['l-dalet', 'l-resh'], ['l-he', 'l-het', 'l-tav'], ['l-vav', 'l-zayin', 'l-nunf'], ['l-samekh', 'l-memf']];
const writable = id => strip(WORDS[id].p || WORDS[id].he).replace(/[?!.,]/g, '').trim().length <= 12;

function makeQuestion(type, id) {
  const pool = poolFor(id);
  if (type === 'read') return { type, id, opts: pickOptions(id, pool, x => WORDS[x].tr) };
  if (type === 'he2fr') return { type, id, opts: pickOptions(id, pool, x => WORDS[x].fr) };
  if (type === 'fr2he' || type === 'audio') return { type, id, opts: pickOptions(id, pool, x => strip(WORDS[x].p || WORDS[x].he)) };
  if (type === 'letter') {
    // Les lettres jumelles d'abord, pour s'entraîner à les distinguer.
    const twins = TWINS.find(g => g.includes(id)) || [id];
    const others = shuffle(pool.filter(x => !twins.includes(x)));
    return { type, id, opts: shuffle([...twins, ...others].slice(0, 4)) };
  }
  return { type, id };
}

function lessonQuestions(lid) {
  const l = LESSONS[lid];
  const items = shuffle(l.items).slice(0, 12);
  if (l.kind === 'lecture') return items.map((id, i) => makeQuestion(i % 4 === 3 ? 'audio' : 'read', id));
  if (l.kind === 'lettres') return items.map((id, i) => makeQuestion(i % 2 ? 'read' : 'letter', id));
  const cycle = ['he2fr', 'fr2he', 'audio', 'write', 'he2fr', 'fr2he'];
  return items.map((id, i) => {
    let t = cycle[i % cycle.length];
    if (t === 'write' && !writable(id)) t = 'he2fr';
    return makeQuestion(t, id);
  });
}

function reviewQuestions(ids) {
  return ids.map((id, i) => {
    const kind = KIND[id] ? KIND[id].kind : 'vocab';
    if (i % 4 === 3) return makeQuestion(kind === 'vocab' ? 'he2fr' : 'read', id);
    if (i % 5 === 4 && kind === 'vocab' && writable(id)) return makeQuestion('write', id);
    return { type: 'card', id, dir: kind === 'vocab' && i % 2 ? 'fr' : 'he' };
  });
}

function startSession(kind, ref, qs) {
  S.session = { kind, ref, qs, i: 0, score: 0, answered: null, typed: '', flipped: false, retried: [] };
  save();
}

// ---------- Routeur ----------

const app = document.getElementById('app');
const routes = [];
const route = (re, fn) => routes.push([re, fn]);

function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }

function render() {
  closeSheet();
  const h = location.hash.replace(/^#/, '') || '/';
  for (const [re, fn] of routes) {
    const m = h.match(re);
    if (m) {
      if (!h.startsWith('/ecoute')) stopPlayer();
      const out = fn(...m.slice(1));
      paint(out);
      return;
    }
  }
  go('#/');
}

function paint({ title, body, dock = '', focus = false, back = null, tab = null }) {
  document.body.classList.toggle('focus', focus);
  document.body.classList.toggle('big', S.settings.big);
  const due = dueToday();
  app.innerHTML = `
    <header class="top">
      ${back ? `<button class="icon-btn" data-go="${back}" aria-label="Retour">←</button>` : ''}
      <h1>${title}</h1>
      <button class="icon-btn" data-act="note" aria-label="Noter une remarque">💬</button>
      <button class="icon-btn" data-act="mute" aria-label="${S.settings.muted ? 'Réactiver le son' : 'Couper le son'}">${S.settings.muted ? '🔇' : '🔊'}</button>
    </header>
    <main>${body}</main>
    ${dock ? `<div class="dock">${dock}</div>` : ''}
    <nav class="tabbar">
      <a href="#/" class="${tab === 'p' ? 'on' : ''}"><span>🧭</span>Parcours</a>
      <a href="#/revisions" class="${tab === 'r' ? 'on' : ''}"><span>🔁</span>Révisions${due ? `<em class="badge">${due}</em>` : ''}</a>
      <a href="#/mots/difficiles" class="${tab === 'm' ? 'on' : ''}"><span>⭐</span>Mots</a>
      <a href="#/reglages" class="${tab === 's' ? 'on' : ''}"><span>⚙️</span>Réglages</a>
    </nav>`;
  window.scrollTo(0, 0);
}

// ---------- Écran : parcours ----------

route(/^\/$/, () => {
  const streak = streakNow();
  const n = todayCount();
  const due = dueToday();
  const nxt = nextLesson();
  let body = `<div class="card"><div class="stat">
      <div><b>🔥 ${streak}</b><span class="muted small">${streak > 1 ? "jours d'affilée" : "jour d'affilée"}</span></div>
      <div><b>${Math.min(n, DAILY_GOAL)}/${DAILY_GOAL}</b><span class="muted small">réponses aujourd'hui</span>
        <div class="meter"><i style="width:${Math.min(100, n / DAILY_GOAL * 100)}%"></i></div></div>
    </div></div>`;

  if (S.resume && LESSONS[S.resume.lesson] && !S.lessons[S.resume.lesson]) {
    body += `<a class="card link tip" href="#/lecon/${S.resume.lesson}/${S.resume.step}">
      <h2>▶ Reprendre</h2><p>${esc(LESSONS[S.resume.lesson].title)}</p></a>`;
  }
  if (due) {
    body += `<a class="card link" href="#/revisions"><h2>🔁 ${plural(due, 'carte à revoir', 'cartes à revoir')}</h2>
      <p class="muted small">Un bloc de ${BLOCK} questions, environ 3 minutes.</p></a>`;
  }

  for (const st of STAGES) {
    const done = st.lessons.filter(l => S.lessons[l]).length;
    body += `<h2 style="margin:20px 0 4px">${esc(st.title)}</h2>
      <p class="muted small" style="margin:0 0 10px">Objectif : ${esc(st.goal)} · ${done}/${st.lessons.length} leçons</p>`;
    st.lessons.forEach((lid, i) => {
      const l = LESSONS[lid];
      const isDone = !!S.lessons[lid];
      const open = isUnlocked(lid);
      const cls = isDone ? 'done' : lid === nxt ? 'next' : open ? '' : 'locked';
      body += `<a class="lesson ${cls}" ${open ? `href="#/lecon/${lid}/fiche"` : 'data-locked="1"'}>
        <span class="num">${isDone ? '✓' : i + 1}</span>
        <span class="txt"><b>${esc(l.title)}</b><small>${esc(l.summary)}</small></span>
        <span>${open ? '›' : '🔒'}</span></a>`;
    });
    const allDone = done === st.lessons.length;
    body += `<a class="lesson ${S.stages[st.id] ? 'done' : allDone ? 'next' : 'locked'}" ${allDone ? `href="#/bilan/${st.id}"` : 'data-locked="1"'}>
      <span class="num">${S.stages[st.id] ? '✓' : '🏁'}</span>
      <span class="txt"><b>Bilan de l'étape</b><small>${S.stages[st.id] ? 'Étape validée, bravo !' : 'Un petit test pour valider l\'étape'}</small></span>
      <span>${allDone ? '›' : '🔒'}</span></a>`;
  }
  body += `<div class="lesson locked"><span class="num">2</span><span class="txt"><b>Étape 2 · Le présent</b><small>Bientôt : les verbes du quotidien</small></span></div>
    <a class="card link" href="#/antiseche" style="margin-top:16px"><h2>📞 Antisèche pour appeler papa</h2><p class="muted small">Les phrases utiles, à garder sous les yeux pendant l'appel.</p></a>
    <a class="card link" href="#/fiches"><h2>📚 Fiches de référence</h2><p class="muted small">Le nikoud, les lettres, les pronoms… à consulter quand tu veux.</p></a>`;
  return { title: 'Oulpan de poche', body, tab: 'p' };
});

// ---------- Écran : leçon ----------

const STEPS = ['fiche', 'exemples', 'lecture', 'oral', 'exercices'];
const STEP_NAMES = { fiche: 'La fiche', exemples: 'Les exemples', lecture: 'La lecture', oral: "L'oral", exercices: 'Les exercices' };

function ficheHtml(l) {
  return l.fiche.map(b => {
    if (b.t === 'p') return `<p>${mixed(b.text)}</p>`;
    if (b.t === 'tip') return `<div class="card tip small">💡 ${mixed(b.text)}</div>`;
    if (b.t === 'words') return b.ids.map(wordRow).join('');
    if (b.t === 'table') {
      return `<div class="table-wrap"><table><thead><tr>${b.head.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead>
        <tbody>${b.rows.map(r => `<tr>${r.map(c => `<td>${mixed(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    }
    return '';
  }).join('');
}

const recordings = {};

route(/^\/lecon\/(\w+)\/(\w+)$/, (lid, step) => {
  const l = LESSONS[lid];
  if (!l || !STEPS.includes(step)) return go('#/') || { title: '', body: '' };
  const si = STEPS.indexOf(step);
  S.resume = { lesson: lid, step };
  save();
  const keep = l.kind !== 'vocab';
  const nextStep = STEPS[si + 1];
  const head = `<div class="steps">${STEPS.map((s, i) => `<i class="${i <= si ? 'on' : ''}"></i>`).join('')}</div>
    <p class="muted small" style="margin:0 0 10px">${si + 1}/5 · ${STEP_NAMES[step]}</p>`;
  const cont = nextStep ? `<button class="btn primary" data-go="#/lecon/${lid}/${nextStep}">Continuer</button>` : '';
  const base = { title: esc(l.title), focus: true, back: '#/' };

  if (step === 'fiche') return { ...base, body: head + ficheHtml(l), dock: cont };

  if (step === 'exemples') {
    return { ...base, dock: cont, body: head +
      `<p class="muted">Touche un mot pour l'écouter, et l'étoile pour le marquer comme difficile.</p>
      <div class="row-btns"><button class="btn small" data-play-list="${l.examples.join(',')}">▶ Tout écouter</button></div>
      ${l.examples.map(wordRow).join('')}` };
  }

  if (step === 'lecture') {
    return { ...base, dock: cont, body: head +
      `<p class="muted">Lis chaque phrase à ton rythme, puis touche-la pour vérifier avec l'audio.</p>
      ${l.reading.map(x => lineCard(x, keep)).join('')}` };
  }

  if (step === 'oral') {
    const lines = l.reading.map((x, i) => {
      const k = `${lid}-${i}`;
      return lineCard(x, keep, `<div class="row-btns">
        <button class="btn small" data-rec="${k}">🎙️ M'enregistrer</button>
        ${recordings[k] ? `<button class="btn small" data-compare="${k}" data-text="${esc(x.he)}">▶ Comparer</button>` : ''}
      </div>`);
    }).join('');
    return { ...base, body: head +
      `<div class="card tip small">Facultatif : écoute chaque phrase et répète-la à voix haute. Dans le métro, tu peux simplement écouter, ou passer.</div>
      ${lines}`,
      dock: `<button class="btn" data-go="#/lecon/${lid}/exercices">Passer</button>${cont}` };
  }

  // Exercices
  if (!S.session || S.session.kind !== 'lesson' || S.session.ref !== lid) startSession('lesson', lid, lessonQuestions(lid));
  return quizScreen({ ...base, head });
});

// ---------- Moteur d'exercices ----------

function quizScreen(base) {
  const s = S.session;
  if (s.i >= s.qs.length) return finishScreen(base);
  const q = s.qs[s.i];
  const w = WORDS[q.id];
  const keep = keepNikud(q.id);
  const progress = `<div class="steps">${s.qs.map((_, i) => `<i class="${i < s.i || (i === s.i && s.answered) ? 'on' : ''}"></i>`).join('')}</div>`;
  let body = (base.head && s.kind === 'lesson' ? base.head.replace(/<div class="steps">.*?<\/div>/s, '') : '') + progress + '<div class="q">';
  let dock = '';

  const optBtn = (id, label) => {
    let cls = '';
    if (s.answered) {
      if (id === q.id) cls = 'good';
      else if (id === s.answered.choice) cls = 'bad';
    }
    return `<button class="opt ${cls}" data-choice="${id}" ${s.answered ? 'disabled' : ''}>${label}</button>`;
  };

  if (q.type === 'read') {
    body += `<p class="prompt">Comment ça se lit ?</p><div class="big">${he(w.he, 'xl')}</div>
      <div class="opts">${q.opts.map(id => optBtn(id, esc(WORDS[id].tr))).join('')}</div>`;
  } else if (q.type === 'letter') {
    body += `<p class="prompt">Quelle lettre est le <b>${esc(w.fr)}</b> ?</p><p class="tr">${esc(w.tr)}</p>
      <div class="opts" style="grid-template-columns:1fr 1fr">${q.opts.map(id => optBtn(id, he(WORDS[id].he, 'xl'))).join('')}</div>`;
  } else if (q.type === 'he2fr') {
    body += `<p class="prompt">Que veut dire… ?</p>
      <button class="say" data-say="${q.id}" style="background:none;border:0;cursor:pointer">${he(heOf(w, keep), 'xl')} 🔊</button>
      ${S.settings.translit ? `<p class="tr">${esc(w.tr)}</p>` : ''}
      <div class="opts">${q.opts.map(id => optBtn(id, esc(WORDS[id].fr))).join('')}</div>`;
  } else if (q.type === 'fr2he') {
    body += `<p class="prompt">Comment dit-on…</p><h2 style="margin:6px 0 4px">${esc(w.fr)}</h2>
      <div class="opts">${q.opts.map(id => optBtn(id, he(heOf(WORDS[id], keep)))).join('')}</div>`;
  } else if (q.type === 'audio') {
    body += `<p class="prompt">Écoute : qu'est-ce que tu entends ?</p>
      <button class="speaker" data-say="${q.id}" aria-label="Écouter">🔊</button>
      ${S.settings.muted ? '<p class="small muted">La sourdine est activée : touche 🔇 en haut pour réactiver le son, ou passe cette question.</p>' : ''}
      <div class="opts">${q.opts.map(id => optBtn(id, he(heOf(WORDS[id], keep)))).join('')}</div>`;
    if (!s.answered) dock = `<button class="btn" data-act="skip">Je ne peux pas écouter, passer</button>`;
    if (!s.answered && s.autoplayed !== s.i) { s.autoplayed = s.i; setTimeout(() => sayWord(q.id), 300); }
  } else if (q.type === 'write') {
    body += `<p class="prompt">Écris en hébreu :</p><h2 style="margin:6px 0">${esc(w.fr)}</h2>
      ${S.settings.translit ? `<p class="tr">${esc(w.tr)}</p>` : ''}
      <div class="typed" id="typed">${he(s.typed)}${s.answered ? '' : '<span class="caret"></span>'}</div>
      ${s.answered ? '' : keyboard()}`;
    if (!s.answered) dock = `<button class="btn" data-act="giveup">Je ne sais pas</button><button class="btn primary" data-act="check">Vérifier</button>`;
  } else if (q.type === 'card') {
    const front = q.dir === 'fr'
      ? `<p class="prompt">Comment dit-on…</p><h2>${esc(w.fr)}</h2>`
      : `<p class="prompt">Tu te souviens ?</p>${he(heOf(w, keep), 'xl')}`;
    body += `<div class="card flip">${front}
      ${s.flipped ? `<hr style="width:60%;border:0;border-top:1px solid var(--line)">
        <button class="say" data-say="${q.id}" style="background:none;border:0;cursor:pointer">${he(heOf(w, keep))} 🔊</button>
        <span class="tr">${esc(w.tr)}</span><span class="fr">${esc(w.fr)}</span>` : ''}
    </div>`;
    dock = s.flipped
      ? `<div class="eval3" style="flex:1"><button class="btn" data-eval="bad">😕 Je ne savais pas</button><button class="btn" data-eval="mid">🤔 J'hésitais</button><button class="btn primary" data-eval="good">😀 Je savais</button></div>`
      : `<button class="btn primary" data-act="flip">Retourner la carte</button>`;
  }

  if (s.answered) {
    const good = s.answered.ok;
    body += `<div class="feedback ${good ? 'good' : 'bad'}">
      <b>${good ? '✅ Bravo !' : '❌ Pas tout à fait. La bonne réponse :'}</b>
      ${wordRow(q.id)}
      ${q.type === 'write' && !good && s.typed ? `<p class="small">Tu as écrit : ${diffHtml(s.typed, w)}</p>` : ''}
      ${!good && KIND[q.id] ? `<a href="#/fiche/${KIND[q.id].lesson}">📖 Revoir la fiche</a>` : ''}
    </div>`;
    dock = `<button class="btn primary" data-act="next">Continuer</button>`;
  }
  body += '</div>';
  return { ...base, body, dock, focus: true };
}

function keyboard() {
  const rows = ['קראטוןםפ', 'שדגכעיחלךף', 'זסבהנמצתץ'];
  return `<div class="kb">${rows.map(r => `<div class="r">${[...r].map(c => `<button data-key="${c}">${c}</button>`).join('')}</div>`).join('')}
    <div class="r"><button class="wide" data-key=" ">espace</button><button class="wide" data-key="⌫" aria-label="Effacer">⌫</button></div></div>`;
}
const norm = s => strip(s).replace(/[?!.,״"'׳־-]/g, '').replace(/\s+/g, ' ').trim();
function diffHtml(typed, w) {
  const exp = norm(w.p || w.he);
  const got = norm(typed);
  return `<bdi class="he sm diff" lang="he">${[...got].map((c, i) => `<span class="${c === exp[i] ? 'ok' : 'ko'}">${esc(c)}</span>`).join('')}</bdi>`;
}

function answer(ok, choice) {
  const s = S.session;
  const q = s.qs[s.i];
  s.answered = { ok, choice };
  if (ok) { s.score++; speak(WORDS[q.id].he); }
  else if (s.kind === 'lesson' && !s.retried.includes(s.i)) {
    s.retried.push(s.qs.length);
    s.qs.push(makeQuestion(q.type === 'write' ? 'he2fr' : q.type, q.id));
  }
  if (s.kind !== 'lesson') applyGrade(q.id, ok ? 'good' : 'bad');
  else if (!ok) (s.missed ??= []).push(q.id);
  tick();
  save();
  render();
  document.querySelector('.feedback')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function applyGrade(id, result) {
  grade(id, result);
  if (S.session.kind === 'review') {
    if (S.reviews.date !== today()) S.reviews = { date: today(), n: 0 };
    S.reviews.n++;
  }
}

function finishScreen(base) {
  const s = S.session;
  const total = s.qs.length;
  let body = '';
  let dock = '';
  if (s.kind === 'lesson') {
    const lid = s.ref;
    S.lessons[lid] = { done: today() };
    for (const id of LESSONS[lid].items) {
      if (!S.cards[id]) S.cards[id] = { box: 1, due: addDays(1), misses: 0 };
    }
    for (const id of s.missed || []) S.cards[id].misses++;
    S.resume = null;
    S.session = null;
    save();
    const nxt = nextLesson();
    body = `<p class="done-big">🎉</p><h2 class="center">Leçon terminée !</h2>
      <p class="center muted">Les mots de cette leçon arrivent dans tes révisions dès demain.</p>`;
    dock = `<button class="btn" data-go="#/">Parcours</button>` +
      (nxt && isUnlocked(nxt) ? `<button class="btn primary" data-go="#/lecon/${nxt}/fiche">Leçon suivante</button>` : '');
    return { ...base, body, dock, focus: true };
  }
  if (s.kind === 'bilan') {
    const pct = Math.round(s.score / total * 100);
    const passed = pct >= 70;
    if (passed) S.stages[s.ref] = today();
    S.session = null;
    save();
    body = `<p class="done-big">${passed ? '🏆' : '💪'}</p>
      <h2 class="center">${pct}% de bonnes réponses</h2>
      <p class="center muted">${passed ? "Étape validée ! Teste maintenant ces phrases au téléphone avec tes parents." : "Encore un peu de révision et tu y es. Aucune pénalité : retente quand tu veux."}</p>`;
    dock = `<button class="btn primary" data-go="#/">Parcours</button>`;
    return { ...base, body, dock, focus: true };
  }
  // Révisions et récaps : fin d'un mini-bloc
  const kind = s.kind;
  S.session = null;
  save();
  const more = kind === 'review' ? dueToday() : Object.keys(S.hard).length;
  body = `<p class="done-big">👏</p><h2 class="center">Bloc terminé</h2>
    <p class="center muted">${s.score}/${total} bonnes réponses.${kind === 'review' && more ? ` Il reste ${plural(more, 'carte', 'cartes')} pour aujourd'hui.` : ''}</p>`;
  dock = `<button class="btn" data-go="#/">J'arrête là</button>` +
    (more ? `<button class="btn primary" data-act="${kind === 'review' ? 'start-review' : 'start-hard'}">Encore un bloc</button>` : '');
  return { ...base, body, dock, focus: true };
}

// ---------- Écran : révisions ----------

route(/^\/revisions$/, () => {
  const base = { title: 'Révisions', tab: 'r' };
  if (S.session && S.session.kind === 'review') return quizScreen({ ...base, back: '#/' });
  const due = dueToday();
  const done = reviewsToday();
  let body;
  if (!Object.keys(S.cards).length) {
    body = `<div class="card"><h2>Rien à réviser pour l'instant</h2><p class="muted">Termine une leçon : ses mots arriveront ici le lendemain, puis reviendront de plus en plus espacés.</p></div>`;
  } else if (!due && done >= REVIEW_CAP) {
    body = `<div class="card"><h2>👏 Dose du jour faite</h2><p class="muted">Tu as révisé ${done} cartes aujourd'hui. Les autres attendront demain, pas de montagne.</p></div>`;
  } else if (!due) {
    body = `<div class="card"><h2>✅ Tout est à jour</h2><p class="muted">Aucune carte à revoir aujourd'hui. Tu peux avancer dans le parcours ou faire un récap de tes mots difficiles.</p></div>`;
  } else {
    body = `<div class="card"><h2>${plural(due, 'carte à revoir', 'cartes à revoir')}</h2>
      <p class="muted">Par blocs de ${BLOCK}, chacun enregistré : tu peux t'arrêter à ta station.</p></div>`;
  }
  body += `<a class="card link" href="#/ecoute/revisions"><h2>🎧 Réviser aux écouteurs</h2><p class="muted small">L'hébreu, une pause pour répondre dans ta tête, puis la traduction. Sans regarder l'écran.</p></a>
    <a class="card link" href="#/mots/difficiles"><h2>⭐ Mes mots difficiles</h2><p class="muted small">${plural(Object.keys(S.hard).length, 'mot', 'mots')}</p></a>`;
  return { ...base, body, dock: due ? `<button class="btn primary" data-act="start-review">Commencer un bloc</button>` : '' };
});

// ---------- Écran : mots ----------

const learnedIds = () => Object.keys(S.cards);

route(/^\/mots\/(difficiles|tous|phrases)$/, tab => {
  const tabs = `<div class="tabs">
    <a href="#/mots/difficiles" class="${tab === 'difficiles' ? 'on' : ''}">⭐ Difficiles</a>
    <a href="#/mots/tous" class="${tab === 'tous' ? 'on' : ''}">Tous mes mots</a>
    <a href="#/mots/phrases" class="${tab === 'phrases' ? 'on' : ''}">Je sais dire</a></div>`;
  const base = { title: 'Mes mots', tab: 'm' };
  if (S.session && S.session.kind === 'hard') return quizScreen({ ...base, back: '#/mots/difficiles' });

  if (tab === 'difficiles') {
    const ids = Object.keys(S.hard);
    const body = tabs + (ids.length
      ? `<p class="muted small">Ceux que tu as marqués d'une étoile, et ceux que tu rates souvent. Touche l'étoile pour en retirer un quand tu le maîtrises.</p>
         <div class="row-btns"><a class="btn small" href="#/ecoute/difficiles" style="text-decoration:none;display:flex;align-items:center">🎧 Écouter en boucle</a></div>
         ${ids.map(wordRow).join('')}`
      : `<div class="card"><h2>Aucun mot difficile</h2><p class="muted">Touche l'étoile ☆ à côté d'un mot pour le garder ici. Les mots que tu rates souvent s'y ajoutent aussi tout seuls.</p></div>`);
    return { ...base, body, dock: ids.length ? `<button class="btn primary" data-act="start-hard">Faire un récap</button>` : '' };
  }

  if (tab === 'tous') {
    const ids = learnedIds();
    const body = tabs + (ids.length
      ? `<input type="search" id="search" placeholder="Chercher en français ou en hébreu" autocomplete="off">
         <div id="list" style="margin-top:12px">${ids.map(wordRow).join('')}</div>`
      : `<div class="card"><p class="muted">Les mots des leçons terminées apparaîtront ici.</p></div>`);
    return { ...base, body };
  }

  const lines = Object.keys(S.lessons).flatMap(lid => LESSONS[lid].reading.map(x => lineCard(x, LESSONS[lid].kind !== 'vocab')));
  const body = tabs + (lines.length
    ? `<p class="muted small">Les phrases des leçons que tu as terminées : tu peux déjà les dire à tes parents.</p>${lines.join('')}`
    : `<div class="card"><p class="muted">Termine ta première leçon pour voir ici ce que tu sais dire.</p></div>`);
  return { ...base, body };
});

// ---------- Fiches, antisèche, bilan ----------

route(/^\/fiches$/, () => ({
  title: 'Fiches', back: '#/', tab: 'p',
  body: `<p class="muted">Toutes les fiches des leçons ouvertes.</p>` +
    Object.entries(LESSONS).filter(([lid]) => isUnlocked(lid)).map(([lid, l]) =>
      `<a class="lesson" href="#/fiche/${lid}"><span class="num">📄</span><span class="txt"><b>${esc(l.title)}</b><small>${esc(l.summary)}</small></span><span>›</span></a>`).join(''),
}));

route(/^\/fiche\/(\w+)$/, lid => {
  const l = LESSONS[lid];
  if (!l) return go('#/fiches') || { title: '', body: '' };
  return { title: esc(l.title), body: ficheHtml(l), focus: true, dock: `<button class="btn primary" data-act="back">Retour</button>` };
});

const CHEAT = [
  ['Commencer', [
    { he: 'שָׁלוֹם אַבָּא!', tr: 'shalom aba !', fr: 'Salut papa !' },
    { he: 'מָה שְׁלוֹמְךָ?', tr: 'ma shlomkha ?', fr: 'Comment vas-tu ? (à papa)' },
    { he: 'מָה שְׁלוֹמֵךְ, אִמָּא?', tr: 'ma shlomekh, ima ?', fr: 'Comment vas-tu, maman ?' },
    { he: 'מָה נִשְׁמָע?', tr: 'ma nishma ?', fr: 'Quoi de neuf ?' },
  ]],
  ['Répondre', [
    { he: 'אֲנִי בְּסֵדֶר, תּוֹדָה.', tr: 'ani besséder, toda.', fr: 'Ça va, merci.' },
    { he: 'אֲנִי קְצָת עֲיֵפָה.', tr: 'ani ktsat ayéfa.', fr: 'Je suis un peu fatiguée.' },
    { he: 'אֲנִי מְאוֹד שְׂמֵחָה!', tr: "ani me'od smékha !", fr: 'Je suis très contente !' },
    { he: 'וְאַתָּה?', tr: 've-ata ?', fr: 'Et toi ? (à papa)' },
    { he: 'יוֹפִי!', tr: 'yofi !', fr: 'Super !' },
  ]],
  ['Finir', [
    { he: 'אֲנִי בָּאָה הַבַּיְתָה.', tr: "ani ba'a habayta.", fr: "J'arrive à la maison." },
    { he: 'אֲנִי אוֹהֶבֶת אֶתְכֶם.', tr: 'ani ohevet etkhem.', fr: 'Je vous aime.' },
    { he: 'לְהִתְרָאוֹת!', tr: 'lehitraot !', fr: 'À plus tard !' },
    { he: 'לַיְלָה טוֹב!', tr: 'laïla tov !', fr: 'Bonne nuit !' },
  ]],
];

route(/^\/antiseche$/, () => ({
  title: 'Antisèche d\'appel', back: '#/', tab: 'p',
  body: CHEAT.map(([t, lines]) => `<h2 style="margin:16px 0 8px">${t}</h2>${lines.map(x => lineCard(x, false)).join('')}`).join('') +
    `<p class="muted small">D'autres phrases s'ajouteront à chaque étape, comme « qu'as-tu fait aujourd'hui ? » à l'étape 4.</p>`,
}));

route(/^\/bilan\/(\w+)$/, sid => {
  const st = STAGES.find(x => x.id === sid);
  if (!st) return go('#/') || { title: '', body: '' };
  const base = { title: 'Bilan de l\'étape', back: '#/', focus: true };
  if (S.session && S.session.kind === 'bilan' && S.session.ref === sid) return quizScreen(base);
  const body = `<div class="card"><h2>${esc(st.title)}</h2>
    <p>15 questions sur toute l'étape. À partir de 70 % de bonnes réponses, l'étape est validée.</p>
    <p class="muted small">Aucune pénalité : tu peux le refaire autant de fois que tu veux.</p></div>`;
  return { ...base, body, dock: `<button class="btn primary" data-act="start-bilan" data-ref="${sid}">Commencer le bilan</button>` };
});

// ---------- Mode écouteurs ----------

let player = null;
function stopPlayer() { if (player) { player.on = false; stopSpeech(); } }

function listenIds(src) {
  if (src === 'difficiles') return Object.keys(S.hard);
  if (src === 'revisions') { const d = dueIds(); return d.length ? d : learnedIds(); }
  return learnedIds();
}

route(/^\/ecoute\/(\w+)$/, src => {
  const ids = player && player.src === src ? player.ids : shuffle(listenIds(src));
  if (!player || player.src !== src) player = { src, ids, i: 0, on: false };
  const base = { title: 'Mode écouteurs', back: src === 'difficiles' ? '#/mots/difficiles' : '#/revisions', focus: true };
  if (!ids.length) return { ...base, body: `<div class="card"><p class="muted">Rien à écouter pour l'instant : termine une leçon d'abord.</p></div>` };
  const w = WORDS[ids[player.i]];
  const body = `<div class="player">
    <p class="muted small">${player.i + 1} / ${ids.length}</p>
    <div class="card now">${he(heOf(w, keepNikud(ids[player.i])), 'xl')}
      ${S.settings.translit ? `<p class="tr">${esc(w.tr)}</p>` : ''}<p class="fr" id="fr-now">${player.phase === 'fr' ? esc(w.fr) : '…'}</p></div>
    ${S.settings.muted ? '<p class="small">La sourdine est activée : touche 🔇 en haut pour entendre.</p>' : ''}
    <p class="muted small">L'hébreu, une pause pour répondre dans ta tête, la traduction, puis l'hébreu encore.</p>
  </div>`;
  const dock = `<button class="btn" data-act="p-prev">⏮</button><button class="btn primary" data-act="p-toggle">${player.on ? '⏸ Pause' : '▶ Lecture'}</button><button class="btn" data-act="p-next">⏭</button>`;
  return { ...base, body, dock };
});

function playStep() {
  if (!player || !player.on) return;
  const id = player.ids[player.i];
  const w = WORDS[id];
  const wait = (ms, fn) => setTimeout(() => { if (player && player.on && player.ids[player.i] === id) fn(); }, ms);
  player.phase = 'he';
  render();
  speak(w.he, 'he-IL', () => wait(2500, () => {
    player.phase = 'fr';
    const el = document.getElementById('fr-now');
    if (el) el.textContent = w.fr;
    speak(w.fr, 'fr-FR', () => wait(800, () => speak(w.he, 'he-IL', () => wait(1500, () => {
      player.i = (player.i + 1) % player.ids.length;
      playStep();
    }))));
  }));
}

// ---------- Réglages ----------

const SETTINGS = [
  ['nikud', 'Voyelles (nikoud)', 'Les leçons de lecture les gardent toujours.'],
  ['translit', 'Prononciation en lettres latines', 'À retirer petit à petit, comme les voyelles.'],
  ['slow', 'Audio lent', 'Pour bien entendre chaque son.'],
  ['muted', 'Sourdine', "Ton iPhone ne coupe pas ce son en silencieux : utilise ce bouton (ou 🔊 en haut)."],
  ['big', 'Grand texte', 'Agrandit l\'hébreu et le texte.'],
];

route(/^\/reglages$/, () => {
  const notes = S.notes.slice().reverse();
  const body = `<div class="card">${SETTINGS.map(([k, label, help]) =>
      `<label class="switch"><span>${label}<small>${help}</small></span><input type="checkbox" data-setting="${k}" ${S.settings[k] ? 'checked' : ''}></label>`).join('')}</div>
    <div class="card"><h2>💬 Mes remarques</h2>
      <p class="muted small">Note ce qui te gêne ou te manque, puis copie tout pour l'envoyer à Claude : l'appli sera ajustée.</p>
      ${notes.length ? notes.map(n => `<p class="small"><b>${esc(n.date)}</b> · ${esc(n.text)}</p>`).join('') : '<p class="muted small">Aucune remarque pour l\'instant. Le bouton 💬 en haut marche partout.</p>'}
      <div class="row-btns"><button class="btn small" data-act="note">Ajouter</button>${notes.length ? '<button class="btn small" data-act="copy-notes">Copier pour Claude</button><button class="btn small" data-act="clear-notes">Vider</button>' : ''}</div>
    </div>
    <div class="card"><h2>💾 Sauvegarde</h2>
      <p class="muted small">Ta progression est enregistrée sur ce téléphone. Pour la garder en changeant de téléphone, copie ta sauvegarde et garde-la dans tes notes.</p>
      <div class="row-btns"><button class="btn small" data-act="export">Copier ma sauvegarde</button><button class="btn small" data-act="import">Restaurer</button></div>
    </div>
    <div class="card"><h2>Autres</h2>
      <p class="small"><a href="test.html">Page test de la voix et de l'installation</a></p>
      <p class="small muted">Pour une voix plus naturelle : Réglages iPhone › Accessibilité › Contenu énoncé › Voix › Hébreu › télécharge « Carmit (améliorée) ».</p>
      <div class="row-btns"><button class="btn small" data-act="reset" style="color:var(--bad)">Effacer ma progression</button></div>
    </div>`;
  return { title: 'Réglages', body, tab: 's' };
});

// ---------- Actions ----------

function noteSheet() {
  openSheet(`<h2 style="margin-top:0">💬 Une remarque ?</h2>
    <p class="muted small">Ce qui te gêne, te manque ou te plaît. Elle est gardée dans Réglages.</p>
    <textarea id="note-text" placeholder="Ex. : la voix est trop rapide dans les exercices"></textarea>
    <div class="row-btns"><button class="btn" data-act="close">Annuler</button><button class="btn primary" data-act="save-note">Enregistrer</button></div>`,
  el => el.querySelector('textarea').focus());
}

async function copy(text, ok) {
  try { await navigator.clipboard.writeText(text); toast(ok); }
  catch (e) {
    openSheet(`<p>Copie ce texte :</p><textarea readonly>${esc(text)}</textarea><div class="row-btns"><button class="btn primary" data-act="close">Fermer</button></div>`);
  }
}

let mediaRec = null;
async function toggleRecord(key, btn) {
  if (mediaRec && mediaRec.state === 'recording') { mediaRec.stop(); return; }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const chunks = [];
    mediaRec = new MediaRecorder(stream);
    mediaRec.ondataavailable = e => chunks.push(e.data);
    mediaRec.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
      recordings[key] = URL.createObjectURL(new Blob(chunks, { type: mediaRec.mimeType || 'audio/mp4' }));
      mediaRec = null;
      render();
    };
    mediaRec.start();
    btn.textContent = '⏹ Arrêter';
  } catch (e) {
    toast("Micro indisponible : autorise-le dans les réglages de Safari.");
  }
}

const ACTIONS = {
  mute() { S.settings.muted = !S.settings.muted; if (S.settings.muted) stopSpeech(); save(); render(); },
  note: noteSheet,
  close: closeSheet,
  back() { history.back(); },
  'save-note'() {
    const t = document.getElementById('note-text').value.trim();
    if (t) { S.notes.push({ date: today(), where: location.hash, text: t }); save(); toast('Remarque enregistrée, merci !'); }
    closeSheet();
    if (location.hash === '#/reglages') render();
  },
  'copy-notes'() { copy(S.notes.map(n => `${n.date} (${n.where}) : ${n.text}`).join('\n'), 'Copié ! Colle-le dans ta conversation avec Claude.'); },
  'clear-notes'() { if (confirm('Vider toutes tes remarques ?')) { S.notes = []; save(); render(); } },
  export() { const { session, ...rest } = S; copy(JSON.stringify(rest), 'Sauvegarde copiée. Garde-la dans tes notes.'); },
  import() {
    openSheet(`<h2 style="margin-top:0">Restaurer</h2><p class="muted small">Colle ici ta sauvegarde.</p>
      <textarea id="import-text"></textarea>
      <div class="row-btns"><button class="btn" data-act="close">Annuler</button><button class="btn primary" data-act="do-import">Restaurer</button></div>`);
  },
  'do-import'() {
    try {
      const data = JSON.parse(document.getElementById('import-text').value);
      if (!data.settings || !data.cards) throw new Error('format');
      localStorage.setItem(KEY, JSON.stringify(data));
      S = load();
      toast('Progression restaurée !');
      go('#/');
    } catch (e) { toast("Ce texte n'est pas une sauvegarde valide."); }
  },
  reset() {
    if (confirm('Effacer toute ta progression ? Cette action est définitive.')) {
      const notes = S.notes;
      S = structuredClone(DEFAULT);
      S.notes = notes;
      save();
      go('#/');
    }
  },
  flip() { S.session.flipped = true; save(); render(); sayWord(S.session.qs[S.session.i].id); },
  next() {
    const s = S.session;
    s.i++; s.answered = null; s.typed = ''; s.flipped = false;
    if (s.kind !== 'lesson' && s.kind !== 'bilan' && s.i >= s.qs.length) { /* fin du bloc */ }
    save(); render();
  },
  skip() { const s = S.session; s.i++; s.answered = null; save(); render(); },
  check() {
    const s = S.session;
    const w = WORDS[s.qs[s.i].id];
    const t = norm(s.typed);
    answer(!!t && (t === norm(w.p || w.he) || t === norm(w.he)));
  },
  giveup() { answer(false); },
  'start-review'() {
    const ids = dueIds().slice(0, Math.min(BLOCK, dueToday()));
    if (!ids.length) return render();
    startSession('review', null, reviewQuestions(shuffle(ids)));
    go('#/revisions');
  },
  'start-hard'() {
    const ids = shuffle(Object.keys(S.hard)).slice(0, BLOCK);
    if (!ids.length) return render();
    startSession('hard', null, reviewQuestions(ids));
    go('#/mots/difficiles');
  },
  'start-bilan'(el) {
    const st = STAGES.find(x => x.id === el.dataset.ref);
    const ids = shuffle(st.lessons.flatMap(lid => LESSONS[lid].items)).slice(0, 15);
    const qs = ids.map((id, i) => {
      const kind = KIND[id].kind;
      if (kind === 'lecture') return makeQuestion('read', id);
      if (kind === 'lettres') return makeQuestion('letter', id);
      return makeQuestion(i % 3 === 0 ? 'fr2he' : 'he2fr', id);
    });
    startSession('bilan', st.id, qs);
    render();
  },
  'p-toggle'() { player.on = !player.on; if (player.on) playStep(); else { stopSpeech(); render(); } },
  'p-next'() { stopSpeech(); player.i = (player.i + 1) % player.ids.length; player.phase = null; if (player.on) playStep(); else render(); },
  'p-prev'() { stopSpeech(); player.i = (player.i - 1 + player.ids.length) % player.ids.length; player.phase = null; if (player.on) playStep(); else render(); },
};

document.addEventListener('click', e => {
  const el = e.target.closest('button, a, [data-locked]');
  if (!el) return;
  const d = el.dataset;
  if (d.locked) { toast('Termine la leçon précédente pour ouvrir celle-ci.'); return; }
  if (d.go) { go(d.go); return; }
  if (d.act && ACTIONS[d.act]) { ACTIONS[d.act](el); return; }
  if (d.say) { sayWord(d.say); return; }
  if (d.sayText) { speak(d.sayText); return; }
  if (d.star) {
    if (S.hard[d.star]) delete S.hard[d.star]; else S.hard[d.star] = 'manual';
    save();
    document.querySelectorAll(`[data-star="${d.star}"]`).forEach(b => {
      const on = !!S.hard[d.star];
      b.classList.toggle('on', on);
      b.textContent = on ? '★' : '☆';
    });
    toast(S.hard[d.star] ? 'Ajouté à tes mots difficiles' : 'Retiré de tes mots difficiles');
    return;
  }
  if (d.playList) {
    const ids = d.playList.split(',');
    let i = 0;
    const nextWord = () => { if (i < ids.length) speak(WORDS[ids[i++]].he, 'he-IL', () => setTimeout(nextWord, 700)); };
    nextWord();
    return;
  }
  if (d.choice) { answer(d.choice === S.session.qs[S.session.i].id, d.choice); return; }
  if (d.eval) {
    const q = S.session.qs[S.session.i];
    const s = S.session;
    if (d.eval === 'good') s.score++;
    applyGrade(q.id, d.eval);
    if (d.eval === 'bad' && !s.retried.includes(s.i)) { s.retried.push(s.qs.length); s.qs.push({ ...q }); }
    tick();
    s.i++; s.flipped = false;
    save(); render();
    return;
  }
  if (d.key) {
    const s = S.session;
    s.typed = d.key === '⌫' ? s.typed.slice(0, -1) : s.typed + d.key;
    save();
    document.getElementById('typed').innerHTML = `${he(s.typed)}<span class="caret"></span>`;
    return;
  }
  if (d.rec) { toggleRecord(d.rec, el); return; }
  if (d.compare) {
    speak(d.text, 'he-IL', () => setTimeout(() => new Audio(recordings[d.compare]).play(), 400));
    return;
  }
});

document.addEventListener('change', e => {
  const k = e.target.dataset.setting;
  if (!k) return;
  S.settings[k] = e.target.checked;
  if (k === 'muted' && S.settings.muted) stopSpeech();
  save();
  render();
});

document.addEventListener('input', e => {
  if (e.target.id !== 'search') return;
  const q = norm(e.target.value.toLowerCase());
  const ids = learnedIds().filter(id => {
    const w = WORDS[id];
    return !q || w.fr.toLowerCase().includes(q) || w.tr.toLowerCase().includes(q) || norm(w.p || w.he).includes(q) || norm(w.he).includes(q);
  });
  document.getElementById('list').innerHTML = ids.map(wordRow).join('') || '<p class="muted">Aucun mot trouvé.</p>';
});

window.addEventListener('hashchange', render);
render();

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
