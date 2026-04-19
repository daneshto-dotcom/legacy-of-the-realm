# Reflexion Log — Legacy of the Realm

## Session 74 (2026-04-19) — Mobile Depth + Cosmetic Expansion

- P1 #mobile #worked: Mobile viewport overhaul landed via CSS custom props (--sa-{top,bottom,left,right} = env(safe-area-inset-*)), removed user-scalable=no, added viewport-fit=cover + 100dvh cascade (iOS URL-bar fix), touch-action:manipulation on canvas killed 300ms tap delay. Foundation pre-existed (S73 had partial safe-area @supports + 44px targets); unification under vars was the actual win.
- P1 #phaser #worked: Scale.RESIZE → Scale.FIT + CENTER_BOTH + visualViewport.resize handler with 100ms debounce (T14 Gemini R2 condition merged). Catches URL-bar collapse, Dynamic Island, keyboard popup.
- P1 #pwa #worked: manifest.json + precache-only sw.js (Council G4 — iOS Safari blocks runtime cache-first), beforeinstallprompt → A2HS toast after 3 sessions with 30-day TTL (CHECK remediation). SW gated to production hosts only (HMR safety, Gemini CHECK).
- P2 #cosmetic #worked: Heraldic nameplate ring on canvas using College of Arms period-1601 palette (gules/azure/vert/sable/argent/or with or=#d4a847 matching S73 gold). Shape-pattern via stroke width+alpha (solid/dashed/dotted/double) — WCAG colorblind-safe without requiring Canvas line-dash. Clean lifecycle (create/update/destroy on offline).
- P2 #data #worked: Migration 009 + postgres integration + snapshot-converters/player-list-builder/protocol all updated with preferredColor + preferredVariant (0..9 int). 12 files touched, 51 new tests. 390/390 total.
- S74 #method #worked: Full 2-round Council deliberation caught 9 real issues pre-ship (G1 safe-area clamp, G3 tap-delay, G4 iOS PWA checklist, G5 img2img over text-to-image, G6 orientation, G7 more tests, G8 College of Arms, Ge-1 axe-core intent, Ge-2 SW offline, Ge-3 Lighthouse baseline); rejected 3 on technical merit (ENVELOP vs FIT for bounded world, Claude_Preview drop — dual-tool better, period-primary-sources Missale Romanum — secondary is adequate). Kept scope disciplined.
- S74 #method #worked: Triumvirate CHECK returned 2/9 valid findings (HMR SW conflict, PWA toast re-show). Both small, both fixed pre-handoff. 4/9 rejected on technical grounds (DPR double-scale, {cache:'reload'} best practice, heraldicRing cleanup — already wired, z-index — already setDepth(92)). 3/9 accepted as carry-forward.
- S74 #method #improve: Budget ran tight (~78K planned → shipping ~75K actual). Council R1+R2 was ~14K combined; CHECK was ~6K. Real code work + tests = ~50K. Discipline to DEFER Imagen sigils + Customize UI was the right call — data+rendering foundation ships useful value, S75 completes the loop.
- S74 #token-note: PDCA gate hook flipped P1 status to in_progress triggered PDR lock until next UserPromptSubmit — designed friction that cost 1 turn. Accept as intentional safety.
- S74 #method #worked: Repo is DUAL-PROJECT — FDTTA (French Driving Theory) at root + Legacy in `Game/founding-realm` submodule. Pre-flight flagged B22 commit as suspicious; investigation showed legitimate FDTTA work. Strict scope boundary (submodule only) prevented accidental cross-project changes.
- S74 #deferred: (1) apple-touch-icon-180.png asset (harmless 404 until generated); (2) 9 Imagen class sigil variants via img2img w/ honor.png init; (3) Customize sidebar panel UI + CUSTOMIZE server message handler; (4) Lighthouse CI baseline + 12-screenshot matrix + axe-core WCAG automation (all require browser/CI infra); (5) Veo cutscene prototype (Gemini ANALYZE rec); (6) runtime event sim for T14 (ts-node harness limitation).

## Session 73 (2026-04-17) — Security + Depth + Polish

- P1 #security #worked: path-to-regexp ReDoS already patched in 0.1.13 (S72 backlog stale). Added override pin as defense-in-depth. Audit clean, 281/281 tests.
- P2 #feature #worked: Reputation cosmetics surfaced existing Title[] via activeTitle field + 4 Imagen sigils. 12 files, 297/297 pass. Cross-track global-max tier logic. Council CHECK: Grok CONDITIONAL PASS (2 fixes applied), Gemini 5/5. Simpler than PDR (no separate cosmetics[] array).
- P3 #feature #worked: 9 NPC TTS MP3s via Chirp 3 HD (Charon/Kore/Fenrir), hardcoded text→audio map, token-guarded race fix. Grok CONDITIONAL PASS, RALPH CLEAN. 227KB, $0.022 cost.
- P3 #token-note: MCP exposes only Chirp voices, no Studio — Council A/B plan simplified in flight. Fine.
- S73 #method #worked: Dual-AI Council delivered 5.5/18 adoption (~30%) with 0 false positives. 4/4 HIGH/MED CHECK fingers fixed pre-ship. Quality > quantity.
- S73 #method #improve: Next batch — expand cosmetics to full 20 (4 tracks × 5 tiers) + try Veo for at least one asset (cutscene/trailer prototype). Gemini ANALYZE flagged Veo as untapped.
- S73 #method #worked: Verify-first approach on P1 caught stale backlog entry (ReDoS already patched) before shipping — saved scope. Always `npm audit` before assuming a CVE is open.
- S73 #meta: Scope discipline prevented creep (rejected Fastify/Redis/CRDT refactors from Grok). Dropping features that were "already done in another form" (cosmetics[] vs Title[]) is a WIN.
