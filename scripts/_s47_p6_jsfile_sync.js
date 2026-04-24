/* Sync js/questions.js from data/questions.json for the 12 P6 Qs.
 * Replaces the literal JS object block for each affected Q. */

const fs = require('fs');
const path = require('path');

const JS_PATH = path.join(__dirname, '..', 'js', 'questions.js');
const JSON_PATH = path.join(__dirname, '..', 'data', 'questions.json');

const qs = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
let jsSrc = fs.readFileSync(JS_PATH, 'utf8');

const AFFECTED_IDS = [
  'sign-161', 'sign-162', 'sign-163', 'sign-164', 'sign-165',
  'sign-166', 'sign-167', 'sign-168', 'sign-169', 'sign-170',
  'circ-81', 'croi-138'
];

function renderOptionsJs(opts) {
  const lines = [];
  for (const [letter, opt] of Object.entries(opts)) {
    const fr = JSON.stringify(opt.fr || '');
    const en = JSON.stringify(opt.en || '');
    lines.push(`            ${letter}: { fr: ${fr}, en: ${en} }`);
  }
  return lines.join(',\n');
}

function renderQObject(q) {
  const lines = [];
  lines.push('    {');
  lines.push(`        id: ${JSON.stringify(q.id)},`);
  lines.push(`        topic: ${JSON.stringify(q.topic)},`);
  if (q.difficulty != null) lines.push(`        difficulty: ${q.difficulty},`);
  if (q.signs) lines.push(`        signs: ${JSON.stringify(q.signs)},`);
  lines.push(`        questionFr: ${JSON.stringify(q.questionFr || '')},`);
  lines.push(`        questionEn: ${JSON.stringify(q.questionEn || '')},`);
  lines.push('        options: {');
  lines.push(renderOptionsJs(q.options));
  lines.push('        },');
  lines.push(`        correctAnswers: ${JSON.stringify(q.correctAnswers || [])},`);
  if (q.answerCount != null) lines.push(`        answerCount: ${q.answerCount},`);
  lines.push(`        explanationFr: ${JSON.stringify(q.explanationFr || '')},`);
  lines.push(`        explanationEn: ${JSON.stringify(q.explanationEn || '')}`);
  if (q.trapNote) {
    lines[lines.length-1] += ',';
    lines.push(`        trapNote: ${JSON.stringify(q.trapNote)}`);
  }
  if (q.distractorNotes && Object.keys(q.distractorNotes).length) {
    lines[lines.length-1] += ',';
    const dn = Object.entries(q.distractorNotes).map(([k,v]) => `${k}: ${JSON.stringify(v)}`).join(', ');
    lines.push(`        distractorNotes: { ${dn} }`);
  }
  lines.push('    }');
  return lines.join('\n');
}

// Find each Q's block in js file, replace. Use regex: from `    {\n        id: "X",` to the matching `    },`
// We match the opening `    {\n        id: "${id}",` and scan forward for the balancing `    },` or `    }\n` + end of array.
let replacements = 0;
for (const id of AFFECTED_IDS) {
  const q = qs.find(x => x.id === id);
  if (!q) { console.log('NO JSON:', id); continue; }
  // Find the start
  const marker = `id: "${id}"`;
  const idx = jsSrc.indexOf(marker);
  if (idx < 0) { console.log('NO JS MATCH:', id); continue; }
  // Walk back to the enclosing `    {`
  let openStart = idx;
  while (openStart > 0 && !jsSrc.slice(openStart, openStart + 6).startsWith('    {')) openStart--;
  // Walk forward tracking brace depth until we reach the closing `    }`
  let depth = 0;
  let cursor = openStart;
  let endIdx = -1;
  while (cursor < jsSrc.length) {
    const ch = jsSrc[cursor];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) { endIdx = cursor + 1; break; }
    }
    cursor++;
  }
  if (endIdx < 0) { console.log('NO CLOSE:', id); continue; }
  const oldBlock = jsSrc.slice(openStart, endIdx);
  const newBlock = renderQObject(q);
  jsSrc = jsSrc.slice(0, openStart) + newBlock + jsSrc.slice(endIdx);
  replacements++;
  console.log('JS REPLACED:', id, '| was', oldBlock.length, 'chars, now', newBlock.length);
}

fs.writeFileSync(JS_PATH, jsSrc);
console.log('Total JS replacements:', replacements);
