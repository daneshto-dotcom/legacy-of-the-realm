═══════════════════════════════════════════════════════════
HANDOFF SUMMARY — Legacy of the Realm (Founding Realm)
Generated: 2026-04-25
Session: S78 — Customize UX Polish + lineId Protocol + Hook Race Fix
═══════════════════════════════════════════════════════════

## PROJECT
- Name: Legacy of the Realm — Founding Realm submodule
- Working directory: C:\Users\onesh\OneDrive\Desktop\Claude\Founder DNA\Extension Projects\Legacy of the Realm
- Submodule: Game/founding-realm (branch: master)
- Parent branch: main (14a242d — chore(S78): bump submodule)
- Submodule latest: da9eeb7 — chore(S78): update submodule session-state.json
- Tech stack: Node.js + TypeScript + Phaser 3 + WebSocket + esbuild
- Game server: `npm run server` → port 3000 (PERSISTENCE=json, no Docker required for dev)
- Codebase: ~3400 lines in key session files; 585 tests

## CURRENT STATE
- Build: esbuild bundle 285.9KB (GREEN, gate <300KB) — `npm run bundle`
- Tests: 585/585 passing — `npx ts-node --transpile-only tests/simulation.test.ts`
- Game server: confirmed UP on port 3000 (start with `npm run server` from submodule dir)
- Login: daneshto@gmail.com / AdminLogin01! → JWT success (verified via curl)
- Admin seeded at startup: log line `[AUTH] Seeded admin account {"username":"daneshto@gmail.com"}`
- Deployment: local-only (VPS deploy BLOCKED on Daniel — Hetzner provision)

## SESSION COST
- Model split: 82 haiku / 22 sonnet / 8 opus messages
- Estimated routed cost: ~$1.01 (haiku×0.001 + sonnet×0.015 + opus×0.075)
- Baseline (all-Opus): ~$8.40
- Savings: ~$7.39 (88%)
- API spend: Grok 4 calls $0.04, Gemini 4 calls $0.04
- Cumulative log: ~/.claude/usage-log.csv

## THIS SESSION'S WORK

### P1 — Customize UX Polish (4 S75 Deferrals) — commit bf391cb
- `dialogue-panel.js`: `_fetchManifestWithRetry()` — single-retry loop (attempt 0-1), navigator.onLine guard on retry attempt, JSON parse error caught inside loop (continue on fail), promise cleared (`_voiceManifestPromise=null`) on all-fail so reconnect works
- `dialogue-panel.js`: `_setVoiceIndicator(state)` — 'loading' = ♪ blink 500ms, 10s hard-fail timeout; 'playing' = ♪ steady; 'idle' = hidden. `_voiceTimeoutTimer` + `_voiceIndicatorTimer` state vars. `dp-voice-status` span in panel HTML (aria-live=polite)
- `sidebar.js`: HERALDIC_COLORS extended with `passesContrast:bool, contrastRatio:number, nearestPassingId:string|null`. Pre-computed table: argent=15.1✓, or=8.4✓, gules=2.7✗→or, azure=1.8✗→argent, sable=1.1✗→argent, vert=2.3✗→or. ⚠ badge rendered on failing swatches.
- `sidebar.js`: `_customizeReqSeq=0` counter; `saveCustomize()` 500ms debounce + `reqId=cust_${++_customizeReqSeq}`; `applyCustomizeResult()` discards stale by comparing `msg.requestId !== customizeState.pendingReqId`
- `ws-client.js`: `sendCustomizeMessage(color, variant, requestId)` — optional 3rd param; fallback `cust_${Date.now()}`
- `game2d.html`: `.customize-swatch-warn { font-size:8px; color:#f59e0b; }` added
- Tests: +21 assertions (570→585 total)

### P2 — Dialogue lineId Protocol (i18n Foundation) — commit 85d1d5a
- `crafting.ts`: `selectedLineId: string|null = null` declared; captures `line?.id ?? null` from static dialogue path; `lineId: selectedLineId` added to ACTION_RESULT data payload (null for AI-generated lines)
- `main.js`: `lineId: msg.data.lineId || null` passed into `showDialoguePanel({...})` call
- `dialogue-panel.js`: `lookupVoiceFile(text, npcId, lineId)` — O(1) v2 path: `manifest.entries[${npcId}:${lineId}]?.path` checked first; warns if lineId missing; v1 text-hash fallback retained with "sunset S79" comment. `showDialoguePanel` destructures lineId. `playNpcVoice(dialogueText, npcId, lineId)` updated signature.
- `voice-manifest.json`: schema bumped 1→2, schemaNote added
- `build-voice-manifest.js`: schema:2 emitted, per-NPC Set-based duplicate lineId detection at build time
- Tests: +15 assertions (570→585 total); also fixed 4 stale S75 P2 tests (schema 1→2, signature updates)

### P3 — Hook Orphan Tmp-File Race Fix (no git commit — ~/.claude not a git repo)
- Root cause: Windows Git Bash `mv TMP STATE_FILE` non-atomic (unlink+rename). Antivirus/file-indexer lock causes mv to fail silently (`2>/dev/null`), leaving `.tmp.counter.*`, `.tmp.sess.*`, `.tmp.reset.*` orphans
- Fix: `|| rm -f "$TMP"` added to all awk+mv pairs in `~/.claude/hooks/router-telemetry.sh` (counter + sess paths) and `~/.claude/hooks/pdca-context.sh` (reset path)
- Manual cleanup: removed 4 orphans from submodule .claude/ + 4 from parent .claude/

### P4 — public/dist Gitignore Drift Cleanup — commit 1f9ab80
- `git rm --cached public/dist/main.bundle.js public/dist/main.bundle.js.map` — untracked files that were tracked before gitignore was added. Files remain on disk, future builds write locally only (never to git).

### P5 — Game Server + Login Verify
- Server starts cleanly: PERSISTENCE=json (no Docker), AUTO_MIGRATE=true, seedAdmin() inserts daneshto@gmail.com
- Login confirmed: `POST /api/auth/login` → `{"success":true,"token":"eyJ...","playerId":"player_admin_mofu02u0"}`
- Game URL: http://localhost:3000/game2d.html
- Admin URL: http://localhost:3000/admin.html

## OPEN ISSUES
- **v1 text-hash fallback SUNSET S79**: `lookupVoiceFile` in dialogue-panel.js retains text-hash fallback with "sunset S79" comment — remove next session to complete migration
- **lineId null for AI-generated lines**: crafting.ts returns `lineId: null` for Anthropic-generated dialogue; client logs warn but degrades gracefully to text-hash lookup. AI-generated lines won't benefit from i18n until they get stable IDs
- **preview_start/launch.json mismatch**: preview_start from parent CWD picks up parent's launch.json (fdtta-dev Python server, port 22903). Use `npm run server` via Bash background when starting from parent CWD, not preview_start. Submodule's game-server config is only found when CWD = submodule.

## BLOCKED ON
- **VPS Production Deploy**: Hetzner VPS provision (Daniel action)
- **SUBMODULE_PAT**: GitHub PAT for parent full CI gate (Daniel action)
- **BigQuery dataset + service account**: for CI metrics full mode (Daniel action)
- **Stripe account**: for ticket purchase flow (Daniel action)

## NEXT STEPS (priority order)
1. **S79 P1 — Remove v1 text-hash fallback** (sunset per "sunset S79" comment in `lookupVoiceFile`). One-liner removal + test update. Completes P2 migration.
2. **S79 P2 — AI-generated lineId assignment**: Give Anthropic-generated dialogue stable IDs so TTS works for all paths. Requires npc.ts to emit stable lineId for emergent lines (could be content hash as lineId, not textHash).
3. **S79 P3 — CI Pass B-2**: game2d + customize a11y flows with live-server fixture (deferred from S77)
4. **S79 P4 — CI Pass C-2**: festival visual + game2d visual matrix; migrate baselines to GCS bucket if >50 shots
5. **S79 P5 — resend v4.x → v6.1.3 upgrade** + Node floor review
6. **VPS Deploy**: when Daniel provisions Hetzner, follow Docker deploy scripts in infra/

## CHANGED FILES
```
Game/founding-realm:
  src/networking/handlers/crafting.ts    +lineId threading (selectedLineId capture)
  public/js/main.js                      +lineId pass to showDialoguePanel
  public/js/ui/dialogue-panel.js         +manifest retry, voice indicator, lookupVoiceFile v2
  public/js/ui/sidebar.js               +contrast table, requestId counter, debounce
  public/js/ws-client.js                 +requestId param to sendCustomizeMessage
  public/game2d.html                     +.customize-swatch-warn style
  public/assets/audio/npc-voices/voice-manifest.json  schema 1→2
  scripts/build-voice-manifest.js        +schema:2, dup lineId check
  tests/simulation.test.ts              +21 P1 assertions, +15 P2 assertions, 4 S75 fixes
  .claude/session-state.json            S78 session state

~/.claude/hooks/router-telemetry.sh    +|| rm -f "$TMP" on all mv pairs
~/.claude/hooks/pdca-context.sh        +|| rm -f "$TMP_RESET" on mv

Parent repo:
  .claude/session-state.json (gitignored) — S78 all 5 priorities completed
```

## SESSION PIPELINE REPORT
Pipeline: Session PDCA v1 | Priorities: 5/5 complete | ~95K/150K (GREEN)
- P1 S78 Customize UX Polish (Standard) — completed — bf391cb — Council (Grok+Gemini, 1 round)
- P2 S78 Dialogue lineId Protocol (Standard) — completed — 85d1d5a — Council (joint with P1)
- P3 S78 Hook Tmp-File Race Fix (Micro) — completed — hook-files-only (no git at ~/.claude)
- P4 S78 public/dist Gitignore Cleanup (Micro) — completed — 1f9ab80
- P5 S78 Game Server + Login Verify (Micro) — completed — no code change

## REFLEXION ENTRIES (this session)
- P1 #worked: 4 S75 deferrals: voice indicator (10s timeout), contrast veto table, requestId monotonic counter, manifest single-retry with online guard
- P1 #council: Grok won single-retry vs exponential-backoff; Gemini won build-time contrast table; all 8 decisions resolved
- P1 #learned: WCAG contrast vs #1a1200: argent=15.1✓, or=8.4✓; gules/azure/sable/vert all fail
- P2 #worked: lineId threaded crafting.ts→ACTION_RESULT→main.js→showDialoguePanel→lookupVoiceFile; O(1) v2 path, v1 sunset S79
- P2 #learned: manifest already keyed by npcId:lineId — P2 was pure server→client threading. fr_FR text → same lineId → same MP3
- P3 #worked: Windows mv non-atomic race → orphan tmp files → || rm -f "$TMP" fix in 2 hooks
- P4 #worked: git rm --cached untracked bundle drift
- SESSION #hooks: preview_start grabs parent launch.json from parent CWD. Use bash background for game-server when not in submodule dir.

## CARRY-FORWARD PRIORITIES
1. S79 P1 — Remove v1 text-hash fallback (sunset S79, trivial) — PDR: Micro, auto-waived
2. S79 P2 — AI-generated dialogue lineId assignment — PDR: needs drafting (Standard)
3. CI Pass B-2 + C-2 — deferred from S77 — needs live-server fixture (Standard)
4. resend v4.x → v6.1.3 upgrade — Micro

═══════════════════════════════════════════════════════════
