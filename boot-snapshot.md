# Boot Snapshot (auto-generated at handoff)
Generated: 2026-04-26 | Session: S79-pre

## Next Steps
1. **S79 P1 — Remove v1 text-hash fallback** in `lookupVoiceFile` (dialogue-panel.js — "sunset S79" comment marks the spot). Micro, trivial.
2. **S79 P2 — AI-generated lineId assignment** — give Anthropic dialogue stable IDs so TTS works for all paths (not just static lines). Standard tier.
3. **S79 P3 — CI Pass B-2** — game2d + customize a11y flows with live-server fixture (deferred S77)
4. **S79 P4 — CI Pass C-2** — festival + game2d visual matrix; GCS bucket migration if >50 baselines
5. **S79 P5 — resend v4.x → v6.1.3 upgrade** + Node floor review

## Blockers
- VPS deploy (Hetzner) — Daniel action
- SUBMODULE_PAT — Daniel action
- BigQuery dataset + service account — Daniel action

## Pending Backlog (LATER tier)
- [ ] #16 Admin/GM Tooling v2 (BLOCKED: VPS deploy)
- [ ] #18 Monitoring & Observability (BLOCKED: VPS deploy)
- [ ] #20 Advanced Crafting & Masterworks
- [ ] #21 Player Event Calendar + Chronicle Integration
- [ ] #24 Referral Rewards (post-launch)
- [ ] #25 Cosmetic Monetization (post-launch)
- [ ] #26 Player-Generated Quests/Bounties (post-launch)
- [ ] #27 Spectator Mode / Streaming (post-launch)
- [ ] #28 Cross-Platform Save Sync (post-launch)
- [ ] CI Pass B-2 / C-2 (deferred S77)
- [ ] Linux baseline generation for CI visual gate
- [ ] color-contrast a11y fix on landing.html

## Recent Reflexion (last 2 sessions)

### S79-pre (2026-04-26)
- SESSION #gotcha: save/festival.json on OneDrive path — OneDrive restores null-byte cloud version after reboot. Any save file on OneDrive is vulnerable to this race.
- SESSION #fix: festival.ts load() null-byte strip + try-catch self-heal. Server starts cleanly with corrupt festival.json. 97badaf.
- SESSION #meta: 3 reboots, 1 fix, 585/585 tests, game UP, login verified.

### S78 (2026-04-25)
- P1 #worked: 4 S75 Customize deferrals — voice indicator (10s timeout), contrast veto table, requestId monotonic counter, manifest single-retry with navigator.onLine guard
- P1 #council: Grok won single-retry; Gemini won build-time contrast table; 8 decisions resolved via domain-weighted voting
- P2 #worked: lineId threaded crafting.ts→ACTION_RESULT→main.js→dialogue-panel; O(1) v2 lookup, v1 sunset S79; manifest schema 2
- P2 #learned: fr_FR text → same lineId → same MP3 path. i18n-stable.
- P3 #worked: Windows mv non-atomic race → orphan tmp files. Fixed || rm -f in router-telemetry.sh + pdca-context.sh
- SESSION #hooks: preview_start grabs parent launch.json when CWD = parent. Use bash background for game-server from parent CWD.
- SESSION #meta: 5/5 complete, ~95K/150K GREEN, 585/585 tests, login verified

## Key Facts for S79
- Game server: `npm run server` from `Game/founding-realm/` — port 3000 (fixed, not port-managed)
- Login: `daneshto@gmail.com / AdminLogin01!`
- Admin URL: http://localhost:3000/admin.html
- Tests: `npx ts-node --transpile-only tests/simulation.test.ts` (585 baseline)
- Bundle: `npm run bundle` (285.9KB, gate <300KB)
- Credentials: BRAIN/infrastructure/CREDENTIALS_VAULT.json (Tier 0) — rotated 2026-04-18
- v1 sunset: search "sunset S79" in `public/js/ui/dialogue-panel.js`
- festival.json self-heal: in place as of 97badaf — server no longer crashes on reboot
