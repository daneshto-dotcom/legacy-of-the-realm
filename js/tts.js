/* ============================================
   Text-to-Speech Service
   French pronunciation support
   ============================================ */

const TTS = {
    synth: window.speechSynthesis,
    frenchVoice: null,
    speaking: false,

    init() {
        // Wait for voices to load
        if (this.synth.getVoices().length > 0) {
            this.findFrenchVoice();
        }
        this.synth.onvoiceschanged = () => this.findFrenchVoice();
    },

    findFrenchVoice() {
        const voices = this.synth.getVoices();
        // Prefer French voices
        this.frenchVoice = voices.find(v => v.lang === 'fr-FR' && v.localService) ||
                           voices.find(v => v.lang === 'fr-FR') ||
                           voices.find(v => v.lang.startsWith('fr')) ||
                           null;
    },

    speak(text, lang = 'fr-FR') {
        if (!Storage.getSettings().ttsEnabled) return;

        this.stop();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = parseFloat(Storage.getSettings().ttsSpeed) || 1.0;
        utterance.pitch = 1.0;

        if (lang === 'fr-FR' && this.frenchVoice) {
            utterance.voice = this.frenchVoice;
        }

        utterance.onstart = () => {
            this.speaking = true;
            document.getElementById('tts-play-btn')?.classList.add('speaking');
        };

        utterance.onend = () => {
            this.speaking = false;
            document.getElementById('tts-play-btn')?.classList.remove('speaking');
        };

        utterance.onerror = () => {
            this.speaking = false;
            document.getElementById('tts-play-btn')?.classList.remove('speaking');
        };

        this.synth.speak(utterance);
    },

    speakQuestion(question) {
        this.speak(question.questionFr, 'fr-FR');
    },

    // B16: Full read-aloud — question + all answer options sequentially
    _readAloudQueue: [],
    _readAloudIndex: 0,
    _readAloudPaused: false,
    _readAloudActive: false,

    speakFullQuestion(question) {
        this.stopReadAloud();
        if (!question) return;

        // Build queue: question text, then each option
        const queue = [question.questionFr];
        const optionKeys = ['A', 'B', 'C', 'D'];
        for (const key of optionKeys) {
            const opt = question.options?.[key];
            if (opt?.fr) {
                queue.push(`${key}. ${opt.fr}`);
            }
        }

        this._readAloudQueue = queue;
        this._readAloudIndex = 0;
        this._readAloudPaused = false;
        this._readAloudActive = true;
        this._updateReadAloudBtn();
        this._speakNext();
    },

    _speakNext() {
        if (!this._readAloudActive || this._readAloudPaused) return;
        if (this._readAloudIndex >= this._readAloudQueue.length) {
            this._readAloudActive = false;
            this._updateReadAloudBtn();
            return;
        }

        const text = this._readAloudQueue[this._readAloudIndex];
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.rate = parseFloat(Storage.getSettings().ttsSpeed) || 1.0;
        utterance.pitch = 1.0;
        if (this.frenchVoice) utterance.voice = this.frenchVoice;

        utterance.onstart = () => {
            this.speaking = true;
            this._updateReadAloudBtn();
        };
        utterance.onend = () => {
            this.speaking = false;
            this._readAloudIndex++;
            // Small pause between items for natural cadence
            setTimeout(() => this._speakNext(), 400);
        };
        utterance.onerror = () => {
            this.speaking = false;
            this._readAloudIndex++;
            this._speakNext();
        };

        this.synth.speak(utterance);
    },

    toggleReadAloud(question) {
        if (this._readAloudActive && !this._readAloudPaused) {
            // Pause
            this._readAloudPaused = true;
            this.synth.cancel();
            this.speaking = false;
            this._updateReadAloudBtn();
        } else if (this._readAloudActive && this._readAloudPaused) {
            // Resume
            this._readAloudPaused = false;
            this._speakNext();
        } else {
            // Start fresh
            this.speakFullQuestion(question);
        }
    },

    stopReadAloud() {
        this._readAloudActive = false;
        this._readAloudPaused = false;
        this._readAloudQueue = [];
        this._readAloudIndex = 0;
        this.synth.cancel();
        this.speaking = false;
        this._updateReadAloudBtn();
    },

    _updateReadAloudBtn() {
        const btn = document.getElementById('tts-readaloud-btn');
        if (!btn) return;
        if (this._readAloudActive && !this._readAloudPaused) {
            btn.textContent = '⏸️';
            btn.title = 'Pause read-aloud';
            btn.classList.add('speaking');
        } else if (this._readAloudActive && this._readAloudPaused) {
            btn.textContent = '▶️';
            btn.title = 'Resume read-aloud';
            btn.classList.remove('speaking');
        } else {
            btn.textContent = '📖';
            btn.title = 'Read aloud (question + answers)';
            btn.classList.remove('speaking');
        }
    },

    speakOption(text) {
        this.speak(text, 'fr-FR');
    },

    stop() {
        this.stopReadAloud();
        if (this.synth.speaking) {
            this.synth.cancel();
        }
        this.speaking = false;
        document.getElementById('tts-play-btn')?.classList.remove('speaking');
    },

    testFrench() {
        this.speak("Bienvenue ! Cette application va vous aider à préparer le Code de la route.", 'fr-FR');
    },

    isAvailable() {
        return 'speechSynthesis' in window;
    },

    hasFrenchVoice() {
        return this.frenchVoice !== null;
    }
};
