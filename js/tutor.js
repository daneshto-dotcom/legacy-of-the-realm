/* ============================================
   Study Notes — client-side rule-based tutor
   ============================================
   Replaces S46 CF Worker `Tutor` module. Rendering is composed from
   each question's own `explanationFr/En`, `trapNote`, and
   `distractorNotes` fields (see data/questions.json).

   Council D3 (S46): deprecate CF Worker, fold into client-side.
   Council CD-S47-1 (S47): rule-based content stitcher, rebranded
   "Study Notes" (not "AI Tutor") to avoid illusion-of-LLM UX while
   preserving pedagogical value from the existing structured fields.

   Public API preserved for practice.js/app.js call sites:
     Tutor.init()
     Tutor.isAvailable()          — always true (offline, no gate)
     Tutor.toggle()
     Tutor.askAboutQuestion(q, isCorrect)
     Tutor.askWeaknessTip(q, topicAccuracy)
     Tutor.isWeakTopic(topicId)
     Tutor.getTopicAccuracy(topicId)

   No network calls. No conversation history. No API keys. No worker.
   ============================================ */

const Tutor = {
    // Legacy fields kept so app.js Settings handler does not crash when
    // it writes `Tutor.ENDPOINT = …`. Value is intentionally ignored.
    DEFAULT_ENDPOINT: '',
    ENDPOINT: null,
    isOpen: false,
    _currentQ: null,
    _weaknessBanner: null,

    init() {
        this.createUI();
        document.getElementById('tutor-fab')?.addEventListener('click', () => this.toggle());
    },

    // Always available — no network, no auth.
    isAvailable() { return true; },

    createUI() {
        // Floating action button
        const fab = document.createElement('button');
        fab.id = 'tutor-fab';
        fab.className = 'tutor-fab';
        fab.innerHTML = '📖';
        fab.title = 'Open Study Notes';
        document.body.appendChild(fab);

        // Panel
        const panel = document.createElement('div');
        panel.id = 'tutor-panel';
        panel.className = 'tutor-panel hidden';
        panel.innerHTML = `
            <div class="tutor-header">
                <div class="tutor-avatar">📖</div>
                <div class="tutor-title">
                    <strong>Study Notes</strong>
                    <span>Offline guidance from this question</span>
                </div>
                <button class="tutor-close" id="tutor-close">&times;</button>
            </div>
            <div class="tutor-messages" id="tutor-messages">
                <div class="tutor-msg tutor-msg-bot tutor-msg-placeholder">
                    <p>Open any practice question and tap <strong>💬 Ask Dani</strong> to see detailed study notes here: rule citation, answer-by-answer reasoning, and exam-trap warnings — all offline.</p>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById('tutor-close').addEventListener('click', () => this.toggle());
    },

    toggle() {
        this.isOpen = !this.isOpen;
        const panel = document.getElementById('tutor-panel');
        const fab = document.getElementById('tutor-fab');
        if (!panel || !fab) return;
        if (this.isOpen) {
            panel.classList.remove('hidden');
            fab.classList.add('active');
            if (this._currentQ) this._renderQuestion(this._currentQ, this._weaknessBanner);
        } else {
            panel.classList.add('hidden');
            fab.classList.remove('active');
        }
    },

    askAboutQuestion(question, isCorrect) {
        this._currentQ = question;
        this._weaknessBanner = null;
        if (!this.isOpen) this.toggle();
        else this._renderQuestion(question, null);
    },

    askWeaknessTip(question, topicAccuracy) {
        const topicName = typeof ETG_TOPICS !== 'undefined'
            ? (ETG_TOPICS.find(t => t.id === question.topic)?.nameEn || question.topic)
            : question.topic;
        const accPct = Math.round((topicAccuracy || 0) * 100);
        const banner = `⚠️ Weak topic: <strong>${this._escape(topicName)}</strong> (${accPct}% accuracy). Study these notes carefully — the rule here is one you've been missing.`;
        this._currentQ = question;
        this._weaknessBanner = banner;
        if (!this.isOpen) this.toggle();
        else this._renderQuestion(question, banner);
    },

    _renderQuestion(q, weaknessBannerHtml) {
        const msgs = document.getElementById('tutor-messages');
        if (!msgs || !q) return;
        msgs.innerHTML = '';

        if (weaknessBannerHtml) {
            const warn = document.createElement('div');
            warn.className = 'tutor-msg tutor-msg-bot tutor-msg-weakness';
            warn.innerHTML = `<p>${weaknessBannerHtml}</p>`;
            msgs.appendChild(warn);
        }

        const qMsg = document.createElement('div');
        qMsg.className = 'tutor-msg tutor-msg-bot';
        qMsg.innerHTML = `
            <p><strong>${this._escape(q.questionFr || '')}</strong></p>
            ${q.questionEn ? `<p class="tutor-muted">${this._escape(q.questionEn)}</p>` : ''}
        `;
        msgs.appendChild(qMsg);

        const correctSet = new Set(q.correctAnswers || []);
        const distractorNotes = q.distractorNotes || {};
        const options = q.options || {};
        const answerRows = [];
        for (const [letter, opt] of Object.entries(options)) {
            if (!opt || typeof opt !== 'object') continue;
            const isCorrect = correctSet.has(letter);
            const icon = isCorrect ? '✅' : '❌';
            const row = `
                <li class="tutor-ans-row ${isCorrect ? 'tutor-ans-correct' : 'tutor-ans-wrong'}">
                    <span class="tutor-ans-letter">${icon} ${this._escape(letter)}</span>
                    <span class="tutor-ans-text">${this._escape(opt.fr || '')}</span>
                    ${!isCorrect && distractorNotes[letter]
                        ? `<div class="tutor-ans-note">${this._escape(distractorNotes[letter])}</div>`
                        : ''}
                </li>`;
            answerRows.push(row);
        }
        if (answerRows.length) {
            const ansMsg = document.createElement('div');
            ansMsg.className = 'tutor-msg tutor-msg-bot';
            ansMsg.innerHTML = `
                <p><strong>Answer breakdown</strong></p>
                <ul class="tutor-ans-list">${answerRows.join('')}</ul>
            `;
            msgs.appendChild(ansMsg);
        }

        if (q.trapNote) {
            const trapMsg = document.createElement('div');
            trapMsg.className = 'tutor-msg tutor-msg-bot tutor-msg-trap';
            trapMsg.innerHTML = `
                <p><strong>⚠️ Exam trap</strong></p>
                <p>${this._escape(q.trapNote)}</p>
            `;
            msgs.appendChild(trapMsg);
        }

        if (q.explanationFr || q.explanationEn) {
            const expMsg = document.createElement('div');
            expMsg.className = 'tutor-msg tutor-msg-bot';
            expMsg.innerHTML = `
                <p><strong>📌 Règle</strong></p>
                ${q.explanationFr ? `<p>${this._escape(q.explanationFr)}</p>` : ''}
                ${q.explanationEn ? `<p class="tutor-muted">${this._escape(q.explanationEn)}</p>` : ''}
            `;
            msgs.appendChild(expMsg);
        }

        if (Array.isArray(q.vocabulary) && q.vocabulary.length) {
            const vocabRows = q.vocabulary.map(v => `
                <li><strong>${this._escape(v.wordFr || '')}</strong>
                    ${v.wordEn ? ` <span class="tutor-muted">${this._escape(v.wordEn)}</span>` : ''}
                    ${v.definition ? `<div class="tutor-muted">${this._escape(v.definition)}</div>` : ''}
                </li>`).join('');
            const vocMsg = document.createElement('div');
            vocMsg.className = 'tutor-msg tutor-msg-bot';
            vocMsg.innerHTML = `
                <p><strong>📚 Vocabulaire</strong></p>
                <ul class="tutor-vocab-list">${vocabRows}</ul>
            `;
            msgs.appendChild(vocMsg);
        }

        msgs.scrollTop = 0;
    },

    _escape(text) {
        const div = document.createElement('div');
        div.textContent = text == null ? '' : String(text);
        return div.innerHTML;
    },

    isWeakTopic(topicId) {
        if (typeof Storage === 'undefined' || typeof Storage.getWeakestTopics !== 'function') return false;
        const weak = Storage.getWeakestTopics(5);
        return weak.some(t => t.topic === topicId);
    },

    getTopicAccuracy(topicId) {
        if (typeof Storage === 'undefined' || typeof Storage.getWeakestTopics !== 'function') return null;
        const all = Storage.getWeakestTopics(10);
        const match = all.find(t => t.topic === topicId);
        return match ? match.accuracy : null;
    }
};
