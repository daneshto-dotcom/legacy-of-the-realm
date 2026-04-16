#!/usr/bin/env node
/**
 * inject-s41-scenarios.js — Injects S41 scenario questions into questions.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const QS_PATH = path.join(ROOT, 'js', 'questions.js');
const NEW_QS = require('./s41-scenario-questions.js');

console.log(`Injecting ${NEW_QS.length} scenario questions into questions.js...`);

let content = fs.readFileSync(QS_PATH, 'utf8');

const marker = '\n];';
const idx = content.indexOf(marker);
if (idx === -1) { console.error('ERROR: no "];" found'); process.exit(1); }

function esc(s) {
    return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

function formatQuestion(q) {
    let lines = [];
    lines.push('    {');
    lines.push(`        id: "${q.id}", topic: "${q.topic}", difficulty: ${q.difficulty},`);
    if (q.media) {
        lines.push(`        media: { type: "${q.media.type}", url: "${esc(q.media.url)}", alt: "${esc(q.media.alt)}" },`);
    }
    lines.push(`        questionFr: "${esc(q.questionFr)}",`);
    lines.push(`        questionEn: "${esc(q.questionEn)}",`);
    lines.push('        options: {');
    for (const [key, val] of Object.entries(q.options)) {
        lines.push(`            ${key}: { fr: "${esc(val.fr)}", en: "${esc(val.en)}" },`);
    }
    lines.push('        },');
    lines.push(`        correctAnswers: [${q.correctAnswers.map(a => `"${a}"`).join(',')}], answerCount: ${q.answerCount},`);
    lines.push(`        explanationFr: "${esc(q.explanationFr)}",`);
    lines.push(`        explanationEn: "${esc(q.explanationEn)}"`);
    lines.push('    }');
    return lines.join('\n');
}

const block = '\n    // === S41 B08: Scenario-Based Questions with Situational Images (20 questions) ===\n' +
    NEW_QS.map(q => formatQuestion(q)).join(',\n') + ',';

content = content.slice(0, idx) + ',' + block + '\n' + content.slice(idx);

// Update header count
const oldCount = content.match(/Question Bank — (\d+) Bilingual Questions/);
if (oldCount) {
    const newTotal = parseInt(oldCount[1]) + NEW_QS.length;
    content = content.replace(/Question Bank — \d+ Bilingual Questions/, `Question Bank — ${newTotal} Bilingual Questions`);
    console.log(`Header updated: ${oldCount[1]} → ${newTotal}`);
}

fs.writeFileSync(QS_PATH, content, 'utf8');
console.log(`Done! Injected ${NEW_QS.length} scenario questions.`);
