/* ============================================
   Study Reminder Notifications
   Uses Notification API + setTimeout scheduling
   ============================================ */

const Notifications = {
    _timerId: null,
    _smartTimers: [], // streak-at-risk, SRS batch, challenge expiry

    init() {
        this.updateUI();
        this._scheduleNext();
        this.scheduleSmartReminders();
    },

    get supported() {
        return 'Notification' in window;
    },

    get enabled() {
        return this.supported && Notification.permission === 'granted' && Storage.getSettings().notificationsEnabled;
    },

    async toggle() {
        if (!this.supported) {
            showToast('Notifications not supported on this browser', 'error');
            return;
        }

        const settings = Storage.getSettings();

        if (settings.notificationsEnabled) {
            // Disable
            Storage.saveSetting('notificationsEnabled', false);
            this._clearTimer();
            showToast('Study reminders turned off');
        } else {
            // Request permission and enable
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                Storage.saveSetting('notificationsEnabled', true);
                this._scheduleNext();
                showToast('Study reminders enabled!', 'success');
            } else if (permission === 'denied') {
                showToast('Notification permission denied. Check browser settings.', 'error');
            } else {
                showToast('Notification permission dismissed. Try again.', 'error');
            }
        }

        this.updateUI();
    },

    updateUI() {
        const statusEl = document.getElementById('notification-status');
        const descEl = document.getElementById('notification-desc');
        const card = document.getElementById('notification-toggle-card');
        const timeSetting = document.getElementById('notification-time-setting');

        if (!statusEl) return;

        if (!this.supported) {
            statusEl.textContent = 'N/A';
            statusEl.className = 'notification-status disabled';
            descEl.textContent = 'Not supported on this browser';
            if (card) card.style.opacity = '0.5';
            return;
        }

        if (this.enabled) {
            statusEl.textContent = 'On';
            statusEl.className = 'notification-status enabled';
            descEl.textContent = `Reminder at ${Storage.getSettings().reminderTime || '19:00'}`;
            if (card) card.classList.add('active');
            if (timeSetting) timeSetting.classList.remove('hidden');
        } else {
            statusEl.textContent = 'Off';
            statusEl.className = 'notification-status disabled';
            descEl.textContent = 'Tap to enable daily study reminders';
            if (card) card.classList.remove('active');
            if (timeSetting) timeSetting.classList.add('hidden');
        }
    },

    reschedule() {
        this._clearTimer();
        if (this.enabled) {
            this._scheduleNext();
        }
    },

    _clearTimer() {
        if (this._timerId) {
            clearTimeout(this._timerId);
            this._timerId = null;
        }
    },

    _scheduleNext() {
        if (!this.enabled) return;

        const settings = Storage.getSettings();
        const timeParts = (settings.reminderTime || '19:00').split(':').map(Number);
        const hours = Number.isFinite(timeParts[0]) ? timeParts[0] : 19;
        const minutes = Number.isFinite(timeParts[1]) ? timeParts[1] : 0;

        const now = new Date();
        const target = new Date();
        target.setHours(hours, minutes, 0, 0);

        // If time already passed today, schedule for tomorrow
        if (target <= now) {
            target.setDate(target.getDate() + 1);
        }

        const delay = target - now;

        this._timerId = setTimeout(() => {
            this._sendReminder();
            // Reschedule for next day
            this._scheduleNext();
        }, delay);
    },

    _sendReminder() {
        if (!this.enabled) return;

        const streak = Storage.getStreak();
        const dueReviews = Storage.getDueReviews().length;

        let body, tag;

        if (dueReviews > 0) {
            body = `You have ${dueReviews} reviews waiting! Keep your streak alive.`;
            tag = 'review-reminder';
        } else if (streak > 0) {
            body = `${streak}-day streak! Don't break it — practice now.`;
            tag = 'streak-reminder';
        } else {
            const messages = [
                'Time to study! A quick 10 questions takes 5 minutes.',
                'Your driving exam is closer every day. Practice now!',
                'Build your confidence — do a quick practice session.',
                'Sara, don\'t forget to study today! Tu peux le faire!',
                'Just 10 questions a day makes a big difference.'
            ];
            body = messages[Math.floor(Math.random() * messages.length)];
            tag = 'daily-reminder';
        }

        this._notify(body, tag);
    },

    _notify(body, tag) {
        const notification = new Notification('Code de la Route', {
            body,
            icon: 'assets/icons/icon-192.png',
            badge: 'assets/icons/icon-192.png',
            tag,
            renotify: true,
            requireInteraction: false
        });

        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    },

    // === SMART REMINDERS ===

    scheduleSmartReminders() {
        // Clear previous smart timers
        this._smartTimers.forEach(id => clearTimeout(id));
        this._smartTimers = [];

        if (!this.enabled) return;

        this._scheduleStreakAtRisk();
        this._scheduleSRSBatch();
        this._scheduleChallengeExpiry();
    },

    _scheduleStreakAtRisk() {
        // If Sara studied yesterday but not today, remind her before streak breaks
        const lastDate = localStorage.getItem(Storage.KEYS.LAST_STUDY_DATE);
        if (!lastDate) return;

        const today = new Date().toDateString();
        if (lastDate === today) return; // Already studied today

        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (lastDate !== yesterday) return; // Streak already broken

        // Schedule for 2 hours before configured reminder, or 18:00, whichever is earlier
        const settings = Storage.getSettings();
        const reminderParts = (settings.reminderTime || '19:00').split(':').map(Number);
        const earlyHour = Math.min(18, reminderParts[0] - 2);

        const now = new Date();
        const target = new Date();
        target.setHours(Math.max(earlyHour, now.getHours()), 0, 0, 0);

        // If target already passed, fire in 5 minutes (catch-up)
        const delay = target > now ? target - now : 5 * 60 * 1000;

        const id = setTimeout(() => {
            // Re-check: maybe Sara studied since we scheduled this
            if (localStorage.getItem(Storage.KEYS.LAST_STUDY_DATE) === new Date().toDateString()) return;

            const streak = Storage.getStreak();
            if (streak > 0) {
                this._notify(
                    `Your ${streak}-day streak is at risk! Just 5 questions to keep it alive.`,
                    'streak-at-risk'
                );
            }
        }, delay);

        this._smartTimers.push(id);
    },

    _scheduleSRSBatch() {
        // If 10+ reviews are due, nudge after a short delay
        const dueCount = Storage.getDueReviews().length;
        if (dueCount < 10) return;

        // Fire in 30 minutes (don't spam on app open)
        const id = setTimeout(() => {
            if (!this.enabled) return;
            const currentDue = Storage.getDueReviews().length;
            if (currentDue >= 10) {
                this._notify(
                    `${currentDue} review questions are waiting! Clear your queue to lock in knowledge.`,
                    'srs-batch'
                );
            }
        }, 30 * 60 * 1000);

        this._smartTimers.push(id);
    },

    _scheduleChallengeExpiry() {
        // If daily challenge is incomplete, remind at 20:00
        if (typeof Challenges === 'undefined') return;

        const challenge = Challenges.getToday();
        if (!challenge || challenge.completed) return;

        const now = new Date();
        const target = new Date();
        target.setHours(20, 0, 0, 0);

        if (target <= now) return; // Past 20:00 already

        const delay = target - now;

        const id = setTimeout(() => {
            if (!this.enabled) return;
            const current = Challenges.getToday();
            if (current && !current.completed) {
                this._notify(
                    `Daily challenge incomplete: "${current.desc}" — ${current.progress}/${current.target}. Still time!`,
                    'challenge-expiry'
                );
            }
        }, delay);

        this._smartTimers.push(id);
    }
};
