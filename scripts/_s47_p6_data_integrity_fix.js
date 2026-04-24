/* S47 P6: data-integrity fix for 12 Qs with array-format options */

const fs = require('fs');
const path = require('path');

const JSON_PATH = path.join(__dirname, '..', 'data', 'questions.json');
const qs = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

const AFFECTED_IDS = [
  'sign-161', 'sign-162', 'sign-163', 'sign-164', 'sign-165',
  'sign-166', 'sign-167', 'sign-168', 'sign-169', 'sign-170',
  'circ-81', 'croi-138'
];

let fixed = 0;
for (const id of AFFECTED_IDS) {
  const q = qs.find(x => x.id === id);
  if (!q) { console.log('MISSING:', id); continue; }
  if (!Array.isArray(q.options)) { console.log('SKIP:', id); continue; }
  const newOpts = {};
  for (const item of q.options) {
    if (!item || !item.letter) continue;
    newOpts[item.letter] = { fr: item.text || '', en: item.textEn || '' };
  }
  q.options = newOpts;
  fixed++;
  console.log('FIXED:', id, '| options:', Object.keys(q.options).join(','));
}

// P2 alignment for croi-138
const croi138 = qs.find(x => x.id === 'croi-138');
if (croi138) {
  croi138.correctAnswers = ['A'];
  croi138.answerCount = 1;
  croi138.explanationFr = "Le dépassement par la droite est autorisé quand le véhicule devant tourne à gauche ou signale un virage à gauche (R414-6 par. II 1°). Le dépassement en files parallèles (C) est une technicalité de R414-6 par. III qui exige une circulation ininterrompue sur toutes les voies — l'ETG enseigne la règle stricte : interdit sauf cas de virage à gauche ou tramway.";
  croi138.explanationEn = "Right-overtake is authorized when the vehicle ahead turns left or signals a left turn (R414-6 par. II 1°). Parallel-file traffic (C) is a par. III technicality requiring uninterrupted queue traffic on all lanes — ETG teaches the strict rule: forbidden except for left-turn signal or tram on roadway.";
  croi138.trapNote = "Aligned with P2 treatment of croi-149 + croi-170: R414-6 par. III files-parallèles is a CONDITIONAL legal tolerance, not a broad authorization.";
  croi138.distractorNotes = Object.assign({}, croi138.distractorNotes || {}, {
    C: "R414-6 par. III files-parallèles clause requires uninterrupted-queue density on ALL lanes, not general 'parallel files' traffic. ETG teaches the strict par. I reading."
  });
  console.log('PROMOTED: croi-138 correctAnswers tightened to [A]');
}

fs.writeFileSync(JSON_PATH, JSON.stringify(qs, null, 2));
console.log('Done.', fixed, 'Qs converted + croi-138 aligned.');
