/* ============================================
   B17: Distraction-Free Study Timer
   Pomodoro-style 25min countdown with
   fullscreen toggle + session tracking
   ============================================ */

const StudyTimer = {
    _intervalId: null,
    _remainingMs: 0,
    _totalMs: 25 * 60 * 1000, // 25 minutes default
    _running: false,
    _sessionStartedAt: null,

    PRESETS: [
        { label: '15 min', ms: 15 * 60 * 1000 },
        { label: '25 min', ms: 25 * 60 * 1000 },
        { label: '45 min', ms: 45 * 60 * 1000 },
    ],

    init() {
        this._wireControls();
    },

    _wireControls() {
        const startBtn = document.getElementById('timer-start-btn');
        const pauseBtn = document.getElementById('timer-pause-btn');
        const resetBtn = document.getElementById('timer-reset-btn');
        const fullscreenBtn = document.getElementById('timer-fullscreen-btn');
        const presetBtns = document.querySelectorAll('.timer-preset-btn');

        if (startBtn) startBtn.onclick = () => this.start();
        if (pauseBtn) pauseBtn.onclick = () => this.pause();
        if (resetBtn) resetBtn.onclick = () => this.reset();
        if (fullscreenBtn) fullscreenBtn.onclick = () => this.toggleFullscreen();

        presetBtns.forEach(btn => {
            btn.onclick = () => {
                const ms = parseInt(btn.dataset.ms);
                if (ms) {
                    this._totalMs = ms;
                    this.reset();
                    // Update active state
                    presetBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                }
            };
        });

        // Initialize display
        this._remainingMs = this._totalMs;
        this._updateDisplay();
    },

    start() {
        if (this._running) return;
        if (this._remainingMs <= 0) this._remainingMs = this._totalMs;

        this._running = true;
        this._sessionStartedAt = this._sessionStartedAt || Date.now();
        this._updateButtons();

        const tick = () => {
            this._remainingMs -= 1000;
            this._updateDisplay();

            if (this._remainingMs <= 0) {
                this._running = false;
                this._onComplete();
            }
        };

        this._intervalId = setInterval(tick, 1000);
    },

    pause() {
        if (!this._running) return;
        this._running = false;
        clearInterval(this._intervalId);
        this._intervalId = null;
        this._updateButtons();
    },

    reset() {
        this.pause();
        this._remainingMs = this._totalMs;
        this._sessionStartedAt = null;
        this._updateDisplay();
        this._updateButtons();
    },

    _onComplete() {
        clearInterval(this._intervalId);
        this._intervalId = null;
        this._updateButtons();

        // Track session
        this._saveSession();

        // B18: Check achievements (study_timer_complete trigger)
        if (typeof Achievements !== 'undefined') Achievements.checkAll();

        // Notify
        if (typeof Notifications !== 'undefined' && Notifications.isEnabled && Notifications.isEnabled()) {
            Notifications.show('Study Timer', 'Time\'s up! Great focus session. Take a break! ☕');
        }

        // Visual feedback
        const display = document.getElementById('timer-display');
        if (display) display.classList.add('timer-complete');

        // Show toast
        if (typeof showToast === 'function') {
            showToast('⏰ Study session complete! Take a break.');
        }
    },

    _saveSession() {
        const key = 'fdtta_study_sessions';
        const sessions = JSON.parse(localStorage.getItem(key) || '[]');
        sessions.push({
            startedAt: this._sessionStartedAt,
            completedAt: Date.now(),
            durationMs: this._totalMs,
            completed: true
        });
        // Keep last 100 sessions
        if (sessions.length > 100) sessions.splice(0, sessions.length - 100);
        localStorage.setItem(key, JSON.stringify(sessions));
        this._sessionStartedAt = null;
    },

    toggleFullscreen() {
        const timerView = document.getElementById('study-timer-view');
        if (!timerView) return;

        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
            timerView.classList.remove('timer-fullscreen');
        } else {
            timerView.requestFullscreen().catch(() => {
                // Fallback: use CSS fullscreen
                timerView.classList.toggle('timer-fullscreen');
            });
        }
    },

    _updateDisplay() {
        const display = document.getElementById('timer-display');
        if (!display) return;
        display.classList.remove('timer-complete');

        const totalSec = Math.max(0, Math.ceil(this._remainingMs / 1000));
        const min = Math.floor(totalSec / 60);
        const sec = totalSec % 60;
        display.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;

        // Update progress ring
        const ring = document.getElementById('timer-ring-progress');
        if (ring) {
            const pct = this._totalMs > 0 ? (1 - this._remainingMs / this._totalMs) : 0;
            const circumference = 2 * Math.PI * 90; // r=90
            ring.style.strokeDasharray = circumference;
            ring.style.strokeDashoffset = circumference * (1 - pct);
        }
    },

    _updateButtons() {
        const startBtn = document.getElementById('timer-start-btn');
        const pauseBtn = document.getElementById('timer-pause-btn');
        if (startBtn) startBtn.classList.toggle('hidden', this._running);
        if (pauseBtn) pauseBtn.classList.toggle('hidden', !this._running);
    },

    // Get total study time (for stats display)
    getTotalStudyTime() {
        const sessions = JSON.parse(localStorage.getItem('fdtta_study_sessions') || '[]');
        return sessions.reduce((sum, s) => sum + (s.durationMs || 0), 0);
    },

    getSessionCount() {
        return JSON.parse(localStorage.getItem('fdtta_study_sessions') || '[]').length;
    }
};
