#!/usr/bin/env node
/* Duplicate Propagation Check (Council D6 / CD-S47-3)
 *
 * Post-commit / on-demand: scans data/questions.json for suspicious regulatory
 * phrase patterns in CORRECT answers. Flags candidates for HUMAN_REVIEW.
 *
 * USAGE:
 *    node scripts/duplicate-propagation-check.js           # default scan
 *    node scripts/duplicate-propagation-check.js --verbose # emit all hits
 *    node scripts/duplicate-propagation-check.js --json    # machine-readable
 *
 * EXIT CODES:
 *    0 = zero flags (clean)
 *    1 = flags found (review needed)
 *    2 = script error
 *
 * INTENT:
 * After a regulatory CRITICAL flip on one Q, there are typically SIBLING Qs
 * teaching the same (now-wrong) rule. This script automates the full-bank grep
 * we ran manually in S46 P1/P1b (triangle à 200), S47 P2 (R414-6 liberal),
 * and S47 P3 (bus-lane cyclist). Intended to run as a final pre-commit check
 * after any flip in data/questions.json or js/questions.js.
 */

const fs = require('fs');
const path = require('path');

const JSON_PATH = path.join(__dirname, '..', 'data', 'questions.json');

// Patterns curated from S46-S47 regulatory flips. Each pattern checks if the
// phrase appears in a CORRECT answer (not just a distractor) and reports it
// for review. Some patterns are context-gated to reduce noise.
const RULES = [
  {
    name: 'R414-6 right-overtake liberal reading',
    pattern: /dépassement par la droite.*autoris|autoris.*dépassement par la droite/i,
    contextOk: /virage.*gauche|tourne.*gauche|signale.*gauche|tramway|tram|turn.*left|signal.*left/i,
    severity: 'CRIT',
    notes: "Only R414-6 par. II 1° (left-turn-signal) + 2° (tram on roadway) legally authorize. 'Files parallèles' is R414-6 par. III TECHNICALITY — not a general exception per ETG."
  },
  {
    name: 'R416-19 autoroute-triangle obsolete 200m',
    pattern: /triangle.*200.*autoroute|200.*m.*autoroute.*triangle/i,
    contextOk: null,
    severity: 'CRIT',
    notes: "R416-19 par. III: danger-exemption means NEVER deploy triangle on autoroute. The '200m autoroute' figure was pre-2015 driving-school shorthand, never legally codified."
  },
  {
    name: 'R412-7 bus-lane reverse-default (sauf interdiction)',
    pattern: /voie.*bus.*(sauf interdiction|unless prohibited)/i,
    contextOk: null,
    severity: 'CRIT',
    notes: "R412-7 bus-lane default is FORBIDDEN for non-buses. 'Unless forbidden' wording teaches the REVERSE. Cyclists need Bus+Vélo pictogram; taxis need sub-panel."
  },
  {
    name: 'Color-swap direction signs (verts vs bleus)',
    pattern: /verts?\s*(?:=|:)\s*autoroutes?|bleus?\s*(?:=|:)\s*routes?\s+nationales?|verts?\s+(?:indiquent?|sont|pour\s+les)\s+(?:les\s+)?autoroutes?|bleus?\s+(?:indiquent?|sont|pour\s+les)\s+(?:les\s+)?routes?\s+nationales?|greens?\s*(?:=|:)\s*motorways?|blues?\s*(?:=|:)\s*national\s+roads?/i,
    contextOk: null,
    severity: 'CRIT',
    notes: "R411-24: Bleu = autoroute; Vert = route nationale/grand itinéraire; Blanc = locale. 'Vert=autoroute' or 'Bleu=nationale' is SWAPPED."
  },
  {
    name: 'STOP vs yield confusion',
    pattern: /panneau STOP.*(peut|can|may)\s+ralentir|stop sign.*(without|sans)\s+stopping/i,
    contextOk: null,
    severity: 'CRIT',
    notes: "R415-6: STOP = mandatory full stop. 'Ralentir sans arrêter' is false — that's cédez-le-passage (R415-7)."
  },
  {
    name: 'Sign-shape-color mapping errors',
    pattern: /triangle.*(obligation|indication|interdiction)|rond.*bleu.*(danger|interdiction)|rond.*rouge.*(obligation|danger)/i,
    contextOk: /avertissement|warning|panonceau|sub-panel/i,
    severity: 'HIGH',
    notes: "Triangle = danger; rond bleu = obligation; rond bord rouge = interdiction."
  }
];

function scanQuestions(qs, opts = {}) {
  const flags = [];
  for (const q of qs) {
    if (!q.options) continue;
    const correctSet = new Set(q.correctAnswers || []);
    for (const [letter, option] of Object.entries(q.options)) {
      if (!option || typeof option !== 'object') continue;
      if (!correctSet.has(letter)) continue; // Only check correct answers
      const text = String(option.fr || '') + ' | ' + String(option.en || '');
      for (const rule of RULES) {
        if (!rule.pattern.test(text)) continue;
        if (rule.contextOk && rule.contextOk.test(text)) continue;
        flags.push({
          qid: q.id,
          letter,
          rule: rule.name,
          severity: rule.severity,
          notes: rule.notes,
          excerpt: text.slice(0, 120).trim()
        });
      }
    }
  }
  return flags;
}

function main() {
  const argv = new Set(process.argv.slice(2));
  const verbose = argv.has('--verbose');
  const asJson = argv.has('--json');

  let qs;
  try {
    qs = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  } catch (e) {
    console.error('ERROR parsing', JSON_PATH, '-', e.message);
    process.exit(2);
  }

  const flags = scanQuestions(qs);

  if (asJson) {
    console.log(JSON.stringify({ total: qs.length, flagged: flags.length, flags }, null, 2));
    process.exit(flags.length > 0 ? 1 : 0);
  }

  console.log(`Duplicate Propagation Check: ${qs.length} Qs scanned, ${flags.length} flag(s).`);
  if (flags.length === 0) {
    console.log('CLEAN — no suspicious patterns in correct answers.');
    process.exit(0);
  }

  console.log('');
  for (const f of flags) {
    console.log(`  [${f.severity}] ${f.qid} ${f.letter} | ${f.rule}`);
    console.log(`    excerpt: "${f.excerpt}"`);
    if (verbose) console.log(`    notes: ${f.notes}`);
    console.log('');
  }
  console.log('Recommendation: manually verify each flagged Q against primary sources (LégiFrance + Ornikar).');
  process.exit(1);
}

if (require.main === module) main();

module.exports = { scanQuestions, RULES };
