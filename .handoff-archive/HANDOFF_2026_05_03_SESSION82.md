═══════════════════════════════════════════════════════════
HANDOFF SUMMARY — Legacy of the Realm
Generated: 2026-05-03
Session: S82 — Customize-panel a11y + Studio voice (Varenne) — 2/3 SHIP
═══════════════════════════════════════════════════════════

## PROJECT
- Name: Legacy of the Realm (Founding Realm submodule)
- Working directory: C:\Users\onesh\OneDrive\Desktop\Claude\Founder DNA\Extension Projects\Legacy of the Realm
- Git: parent main `0ad01b5` / submodule master `fba7f8a` — both pushed
- Tech stack: Node.js + TypeScript + Phaser 3 + WebSocket + better-sqlite3 + Postgres
- Codebase: ~50K lines TS/JS

## CURRENT STATE
- Build: tsc clean, esbuild bundle 287.7KB (gate <300KB, +2.2KB from S81 baseline)
- Tests: **656 GREEN** (608 sim + 8 tts-queue + 12 audio-gcs + 13 a11y + 15 NEW voice-studio). 5 mobile-pixel customize specs SKIP → BACKLOG #34.
- Deployment: local-only (port 3000). legacyoftherealm.com still HTTP 530 (VPS unprovisioned, S78 blocker).
- Server: DOWN at session end. Game-server health probe = DOWN.

## SESSION COST
- LLM API: Grok 2 calls + Gemini 2 calls (one Council per Standard priority) ≈ $0.14
- Google TTS: $0.0056 actual (3 Varenne lines × Studio-O × 232 chars)
- Routed Claude tokens: estimated ~130K UI per S35 ratio (formula counter under-counts ~2.3x; statusline dead throughout session)
- Total: ~$0.146 spend
- Cost log: ~/.claude/usage-log.csv

## THIS SESSION'S WORK

**P1 — Customize-panel a11y (Standard, ~18K formula) — SHIP** [754f2a8 / fe9a0d6]
- Council R1 + PRIME-AUDIT, 7 decisions, 5 disruptions adopted (D1 PIVOT to real-flow auth, D2 SCOPE widened, D5 data-attribute mechanism, D6 WS race fix, D7 aria-live + role=status)
- D1 critical pivot: rejected AUTH_BYPASS env flag after Gemini audit caught login-flow a11y masking → real-flow programmatic auth via `/api/auth/register` + `localStorage` priming via `addInitScript`
- New `tests/fixtures/auth.ts` — `loginAsTestUser()` + `waitForCustomizePanelReady()` with CREATE_CHARACTER WS bootstrap
- New `tests/a11y/customize.spec.ts` — 5 chromium-desktop specs (non-swatch axe, swatch axe with contrast opt-out, keyboard nav radiogroup, save-state, aria-live status)
- `public/js/ui/sidebar.js` — `role="radiogroup"` + per-button `role="radio"` + `aria-checked` + roving tabindex on swatches AND variants; `__customizeSwatchKey`/`__customizeVariantKey` arrow-key handlers (Home/End/Arrow/PgUp/PgDn); `data-heraldic-swatch` opt-out marker for axe color-contrast (Council D5 mechanism)
- `public/js/game-state.js` — `setWs()` now mirrors socket onto `window.__realmWs` so test fixtures can reach the bundled WebSocket
- `src/networking/gateway.ts` — WS connection limit bumps 5→200/min when `LOAD_TEST=true` (a11y suite needs ~40 connections in 90s)
- `playwright.config.ts` — `LOAD_TEST=true` env on game server
- **Bug fix bonus**: pre-existing `savedColor` sync bug — `applyPreview()` mutated `gameState.character.preferredColor` for canvas re-stroke; next `renderCustomize()` read it back and bumped `savedColor` even when `status='dirty'`, collapsing dirty state → Save button stayed disabled. Fix: gate sync on `status==='saved'`.
- Mobile customize a11y deferred → BACKLOG #34 (sidebar layout puts swatches below 412px viewport fold).

**P2 — Studio voice upgrade Varenne-only (Standard, ~12K formula) — SHIP** [dc2514e / 7e51da5]
- **Pre-flight discovery + scope amendment**: en-US Studio catalog has only 2 voices (Studio-O FEMALE, Studio-Q MALE). Original PDR's "9-line upgrade" thesis broke — Duval+Ashford would collapse onto same male voice. User-approved Option A: Varenne (F priestess) only.
- Council R1 + PRIME-AUDIT, 7 decisions, 4 disruptions adopted (D1 siblings array per Grok, D2 `?tts_tier=` rename per Gemini namespace, D4 per-line preferredTier per Gemini SSML brittleness, D6 dry-run guardrail)
- Manifest schema **v2→v3 additive** — entries with multi-tier siblings carry a `siblings` array + `preferredTier`; v2 clients see top-level `voice/file/path` unchanged (no breaking change)
- `scripts/synth-studio-upgrade.js` (NEW) — dry-run-default synth runner with cost estimate, line+char hard caps (30/5000), pre-flight voice catalog probe, SSML pre-flight detection (PRIME-AUDIT R1)
- `scripts/build-voice-manifest.js` — emits schema 3 with conditional `siblings` for `STUDIO_UPGRADES` NPCs (Varenne); chirp3hd sibling always present, studio sibling appears only when `_studio.mp3` exists on disk
- `public/js/ui/dialogue-panel.js` — `pickSibling()` helper, `?tts_tier=` query-param override (sanitized regex `/^[a-z0-9]+$/i`), fallback chain through siblings, v2 backward-compat preserved
- 3 NEW MP3s: `d_varenne_{1,2,3}_studio.mp3` (30336/34752/38400 bytes — ~70% larger than Chirp3 Kore, consistent with higher fidelity)
- `tests/voice-studio.test.ts` (NEW) — 15 tests: schema validation, pickSibling preferred/fallback/empty, synth guardrails, scope limits (Varenne only), backward-compat
- `tests/simulation.test.ts` — 4 schema 2→3 assertions updated
- `package.json` — `tts:studio-upgrade`, `build:voice-manifest`, `test:voice-studio` scripts

## OPEN ISSUES
- legacyoftherealm.com HTTP 530 — VPS origin unprovisioned. Pre-existing blocker since S78.
- Hook artifacts left untracked: `.claude/session-summary.md` (statusline drift), `.claude/pdr-deliberation-pdrafting.json` (deliberation record). Auto-managed; harmless.
- Statusline dead throughout S82 (>3300s stale pid). UI counter is authoritative — formula-based budget is informational only.
- TTS pipeline never run end-to-end against real LLM emit (`scripts/tts-synthesize.js` mocked in tests; manual QA gate during first AI dialogue play in production). Carried from S81.

## BLOCKED ON
- VPS deploy (Hetzner) — Daniel-action. Gates production game server.
- GCS bucket + SA — Daniel-action per `docs/GCS_SETUP.md`. Gates `ai:*` audio cloud upload (S81 P2 code shipped + dormant).
- SUBMODULE_PAT — Daniel-action. Gates parent CI full-gate.
- BigQuery dataset + SA — Daniel-action. Gates CI metrics full mode.

## NEXT STEPS (priority order — S83)

**Carry-forward from S82 (top of next batch):**
1. **S83 P1 — Broader a11y audit** (Standard, ~20K) — focus, ARIA landmarks, keyboard nav across 6 pages (landing, festival, game2d, admin, login, register). Fix top 10 highest-impact findings; surplus → BACKLOG #34+ rows. Auth fixture lives at `tests/fixtures/auth.ts`. Was S82 P3 — deferred for budget discipline.

**Short-term:**
2. Mobile Customize-panel a11y (BACKLOG #34) — Standard, requires sidebar mobile-layout work (swatches sit below 412px viewport fold).
3. Mobile baselines fail-on-diff (BACKLOG #32, Micro) — Council D14 callback after ~2026-05-28 (30 days post-S80 P3 desktop stability window).

**Medium-term:**
4. Cloudflare Pages static deploy (~10K) — surfaced in S81. Public landing+festival surface independent of VPS. Not time-pressing per user (festival is 2-3 years out).
5. Studio voice A/B subjective evaluation — user listens to `_studio.mp3` vs `.mp3` for Varenne via `?tts_tier=chirp3hd` toggle, decides whether to keep Studio as preferred tier or revert.
6. GCS migration follow-on — once Daniel provisions bucket + SA per docs/GCS_SETUP.md.
7. Embedding-based intent normalization (BACKLOG #31, Standard) — needs ~30 days real `ai:*` traffic post-GCS migration.

## CHANGED FILES (this session)

Submodule (Game/founding-realm) — 12 files, +1100/-100 (3 new MP3s LFS):
- BACKLOG.md (S82 wrap)
- playwright.config.ts (LOAD_TEST=true env)
- public/assets/audio/npc-voices/voice-manifest.json (regenerated v3)
- public/assets/audio/npc-voices/npc_varenne/d_varenne_{1,2,3}_studio.mp3 (NEW)
- public/js/game-state.js (window.__realmWs mirror)
- public/js/ui/dialogue-panel.js (siblings + ?tts_tier=)
- public/js/ui/sidebar.js (radiogroup ARIA + arrow keys + savedColor fix)
- src/networking/gateway.ts (LOAD_TEST connection limit bump)
- scripts/build-voice-manifest.js (v3 schema + siblings)
- scripts/synth-studio-upgrade.js (NEW)
- tests/a11y/customize.spec.ts (NEW — 5 specs)
- tests/fixtures/auth.ts (NEW)
- tests/voice-studio.test.ts (NEW — 15 tests)
- tests/simulation.test.ts (schema 2→3 assertion bump)
- package.json (3 new scripts)
- reflexion_log.md (S82 entries + S70/S72/S78 pruned)

Parent (Legacy of the Realm):
- 4 submodule pointer bumps (P1 / P2 / wrap / final)
- HANDOFF_2026_05_03_SESSION82.md (this file)
- boot-snapshot.md (regenerated)

## SESSION PIPELINE REPORT
Pipeline: Session PDCA v1 | Priorities: 2/3 complete | ~130K UI/150K (YELLOW→RED border, stopped clean)
- P1 Customize-panel a11y       — completed — ~70K UI — fe9a0d6/754f2a8 — SHIP (Council Standard)
- P2 Studio voice (Varenne)     — completed — ~50K UI — 7e51da5/dc2514e — SHIP (Council Standard, scope-amended)
- P3 Broader a11y audit         — pending  — carry to S83 (budget discipline)

## REFLEXION ENTRIES (this session — full set in reflexion_log.md)
- P1 #worked: Council D1 critique caught silent failure (AUTH_BYPASS would mask login-flow a11y)
- P1 #worked: data-heraldic-swatch attribute mechanism over blanket disable (Gemini D5 hardening)
- P1 #bug-fix-bonus: savedColor state-machine bug (applyPreview/renderCustomize feedback loop)
- P1 #worked: Bundled-vs-dynamic-import module isolation; window.__realmWs mirror pattern
- P2 #scope-amendment: Studio catalog has only 2 voices — pre-flight catalog probes before scope commit
- P2 #worked: Council siblings architecture beat my flat-tier-field
- P2 #worked: Gemini namespace audit caught `?voice=` collision risk before ship
- P2 #worked: Composite cache key satisfied at URL layer (Studio sibling has distinct path)
- SESSION #budget-discipline: Stopped after 2/3 at YELLOW→RED border. Better partial GREEN than rushed RED.
- SESSION #council-meta: 2 rounds × ~$0.07 = $0.14, 14 decisions, 9 disruptions adopted (64%)

## CARRY-FORWARD PRIORITIES
1. **S83 P1 — Broader a11y audit** — Standard, ~20K. 6-page audit (landing/festival/game2d/admin/login/register), top-10 fix policy, new keyboard-nav.spec.ts. Auth fixture pattern landed in S82 P1 — no blockers. PDR not drafted.

═══════════════════════════════════════════════════════════
