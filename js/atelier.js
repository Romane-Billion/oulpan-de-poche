// Atelier lecture : de la lecture à volonté, de plus en plus difficile.
// Les deux premiers niveaux sont fabriqués au hasard, pour lire sans pouvoir deviner.

export const ATELIER_LEVELS = [
  { title: 'Syllabes', help: 'Une lettre et sa voyelle.' },
  { title: 'Mots inventés', help: 'Deux ou trois syllabes : impossible de deviner, il faut lire.' },
  { title: 'Vrais mots', help: 'Des mots du parcours, avec les voyelles.' },
  { title: 'Petites phrases', help: 'Des phrases du parcours, avec les voyelles.' },
  { title: 'Mots sans voyelles', help: 'Les mots que tu as appris, écrits comme dans la rue.' },
  { title: 'Phrases sans voyelles', help: 'Comme dans un message de papa.' },
];
export const LEVEL_GOAL = 12; // bonnes lectures pour passer au niveau suivant

const DAGESH = 'ּ';
const HOLAM = 'ֹ';

// Lettre (avec son point éventuel) et son. Les lettres muettes portent juste la voyelle.
const CONS = [
  ['א', ''], ['ב' + DAGESH, 'b'], ['ב', 'v'], ['ג', 'g'], ['ד', 'd'], ['ה', 'h'], ['ז', 'z'], ['ח', 'kh'],
  ['ט', 't'], ['י', 'y'], ['כ' + DAGESH, 'k'], ['כ', 'kh'], ['ל', 'l'], ['מ', 'm'], ['נ', 'n'], ['ס', 's'],
  ['ע', ''], ['פ' + DAGESH, 'p'], ['פ', 'f'], ['צ', 'ts'], ['ק', 'k'], ['ר', 'r'], ['ש' + 'ׁ', 'sh'],
  ['ש' + 'ׂ', 's'], ['ת', 't'],
];
// Pas de ב, כ, פ sans point en début de mot : en hébreu, ils y ont toujours le point.
const FIRST = CONS.filter(([c]) => !['ב', 'כ', 'פ'].includes(c));
// Au milieu d'un mot, ni lettre muette ni ה ou ח (qui changent de son en fin de mot).
const MIDDLE = CONS.filter(([c, s]) => s && c !== 'ה' && c !== 'ח');

// Signe ajouté après la lettre, son, nom.
const VOWELS = [
  ['ַ', 'a', 'patah'], ['ָ', 'a', 'kamats'], ['ֶ', 'é', 'segol'], ['ֵ', 'é', 'tsere'],
  ['ִ', 'i', 'hirik'], ['ִי', 'i', 'hirik et yod'], [HOLAM, 'o', 'holam'], ['ו' + HOLAM, 'o', 'holam avec vav'],
  ['ו' + DAGESH, 'ou', 'shuruk'], ['ֻ', 'ou', 'kubuts'],
];
// Lettres qui peuvent fermer un mot, sous leur forme finale.
const ENDS = [['ם', 'm'], ['ן', 'n'], ['ך', 'kh'], ['ף', 'f'], ['ץ', 'ts'], ['ל', 'l'], ['ר', 'r'], ['ת', 't'], ['ד', 'd'], ['ב', 'v'], ['ס', 's'], ['ק', 'k'], ['ג', 'g'], ['ש' + 'ׁ', 'sh']];

const pick = a => a[Math.floor(Math.random() * a.length)];
const strip = s => s.replace(/[֑-ׇ]/g, '');

function syllable(from) {
  const [c, cs] = pick(from);
  const [v, vs, name] = pick(VOWELS);
  return { he: c + v, tr: cs + vs, name };
}

// ctx : { words, lines, knownWords, knownLines } — des listes d'objets { he, p?, tr, fr }.
export function atelierItem(level, ctx, last) {
  for (let tries = 0; tries < 6; tries++) {
    const it = makeItem(level, ctx);
    if (!last || it.he !== last.he) return it;
  }
  return makeItem(level, ctx);
}

function makeItem(level, ctx) {
  if (level === 1) {
    const s = syllable(FIRST);
    return { he: s.he, say: s.he, tr: s.tr, fr: s.name };
  }
  if (level === 2) {
    const n = Math.random() < 0.6 ? 2 : 3;
    const parts = [syllable(FIRST)];
    for (let i = 1; i < n; i++) parts.push(syllable(MIDDLE));
    let word = parts.map(p => p.he).join('');
    let tr = parts.map(p => p.tr).join('·');
    if (Math.random() < 0.6) {
      const [e, es] = pick(ENDS);
      word += e;
      tr += es;
    }
    return { he: word, say: word, tr, fr: 'mot inventé' };
  }
  const nikud = level <= 4;
  const pool = level === 3 ? ctx.words : level === 4 ? ctx.lines : level === 5 ? ctx.knownWords : ctx.knownLines;
  const w = pick(pool);
  return { he: nikud ? w.he : (w.p || strip(w.he)), say: w.he, tr: w.tr, fr: w.fr };
}
