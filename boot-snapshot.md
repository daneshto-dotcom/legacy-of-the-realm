# Boot Snapshot (auto-generated at handoff)
Generated: 2026-04-20 | Session: S75

## Next Steps
1. **Tier 3 #17 CI/CD Pipeline (M)** — GitHub Actions. Unlocks S74-deferred Lighthouse CI baseline + 12-screenshot matrix + axe-core WCAG automation.
2. **Tier 4 #29 Dialogue lineId protocol (M)** — Server sends stable `lineId` alongside dialogue text; client uses lineId (not text) for TTS lookup. Unblocks localization. S75 Gemini CHECK identified as fundamental i18n blocker.
3. **Tier 4 #30 Customize UX polish (S)** — Audio loading indicator + contrast veto for color×sigil + requestId tracking + cold-load async fallback. 4 items from S75 Triumvirate CHECK deferrals.
4. **Tier 4 #20 Advanced Crafting & Masterworks (M)**
5. **Tier 4 #21 Player Event Calendar + Chronicle Integration (M)**
6. **Tier 4 #23.5 NPC TTS expansion (DONE S75)** — no action
7. **Daniel action** — update `neshto.com` nameservers at registrar to `lara.ns.cloudflare.com` + `nick.ns.cloudflare.com` (CF zone PENDING)
8. **VPS deploy on Hetzner** (blocked on Daniel) — unlocks Tier 3 #16 #18
9. **Expansion** — Veo cutscene prototype (still untapped)
10. **S74 deferred** — apple-touch-icon-180.png asset

## Blockers
- VPS deploy (Daniel: Hetzner provision)
- `neshto.com` nameserver update (Daniel: registrar)
- Real-world attendance verification (VPS + Stripe)
- Admin/GM tooling v2 + Monitoring (VPS)
- Lighthouse/axe-core/screenshot matrix automation (blocked on Tier 3 #17 CI/CD)
- Dialogue localization (blocked on #29 lineId protocol)

## Pending Backlog (founding-realm)
**Tier 3 — Platform & Operations:**
- [x] ~~#15 Mobile Viewport Optimization~~ — **S74 P1 (DONE)**
- [ ] #16 Admin/GM Tooling v2 (M) — blocked VPS
- [ ] #17 CI/CD Pipeline (M) — unlocks S74-deferred CI work
- [ ] #18 Monitoring & Observability (M) — blocked VPS

**Tier 4 — Depth & Polish:**
- [ ] #20 Advanced crafting & masterworks (M)
- [ ] #21 Player event calendar + Chronicle integration (M)
- [x] ~~#22 Character customization (foundation)~~ — **S74 P2 (DONE)**
- [x] ~~#22.5 Character customization completion~~ — **S75 P1 (DONE, ec0ef50)**
- [x] ~~#23.5 NPC TTS expansion (7 more NPCs)~~ — **S75 P2 (DONE, 7dd23ad)**
- [ ] #29 Dialogue lineId protocol — i18n foundation (S75 Gemini CHECK — NEW)
- [ ] #30 Customize UX polish bundle (4 items from S75 Triumvirate CHECK — NEW)

**Tier 5 — Growth & Scale (post-launch):** #24-28

**Non-batch inherited:** Higher-res Chateau photos, fog-strip.webp wiring, fallback sprites, sprite atlas, sigil map client sync, **S74 deferred** (apple-touch-icon PNG, Lighthouse CI, screenshot matrix, axe-core, Veo prototype, T14 runtime sim), **S75 deferred** (i18n localization, Customize UX polish, full-file-diff CHECK protocol, convergence scan PDR tuning).

## Recent Reflexion (last 2 sessions)

### 2026-04-20 Session 75 (Customization Completion + NPC Voice Depth, 2/2 shipped in ~85K)
- P1 #customization: Closed S74 #22.5. Server: CUSTOMIZE/CUSTOMIZE_RESULT + handler (whitelist enum + int 0..9 + 5s rate limit + pg UPDATE + PLAYER_LIST broadcast). Gateway direct-message dispatch (not GameAction) — PDR said registry.ts but correct mechanism is gateway.ts (like CREATE_CHARACTER). Scope clarification, not expansion.
- P1 #imagen: 9 class sigils via imagen-fast text-to-image ($0.18). img2img was blocked (imagen_edit non-functional on API-key auth) — pivoted to strong style-consistent prompts. Resized via sharp lanczos3 to 256×256 (~300KB total).
- P1 #ux: Instant local preview (Council-adopted) via customize:preview event → npc-renderer re-strokes heraldicRing immediately, zero server roundtrip for render. Save button persists. Restroke logic extracted to shared helper, reused by POSITION_UPDATE color-diff path.
- P1 #a11y: Triumvirate CHECK caught WCAG 1.4.1 (1px border-style too subtle). Fix: 3-channel pattern conveyance (text label + border-style + border-width 2-4px).
- P2 #tts: 21 Chirp 3 HD MP3s for 7 new NPCs ($0.053). Persephone voice (listed in MCP docs) rejected by live endpoint → 3 maren lines re-generated with Aoede. Voice + speaking_rate tuned per persona (shadowmaster Charon@0.75, pip Puck@1.2, etc.).
- P2 #architecture: Manifest-driven over hardcoded map (Council-adopted, both Grok + Gemini converged independently). voice-manifest.json schema v1 with 30 entries keyed by `npcId:lineId`. Dropped NPC_VOICE_MAP. Client loads manifest on module init (deduped fetch promise + version cache-bust). lookupVoiceFile(text, npcId) scopes by NPC first, falls back to cross-NPC text index.
- P2 #deferred-fix: S73 silent-fail bug ("server text mutation breaks lookup") partially paid via textHash in manifest (build-time validation path). Full fix needs #29 lineId protocol (S76+).
- S75 #method: Triumvirate CHECK × 2 produced 18 findings: 4 adopted, 5 deferred to S76+, 9 rejected (4 false positives from partial code snippets, 5 scope/design). 44% false-positive rate → S76 improvement: mandate full-file diffs in CHECK prompts.
- S75 #method: Mid-execution scope clarifications 3x (registry.ts→gateway.ts, img2img→text-to-image, Persephone→Aoede). All corrections not expansions. Pattern matches S74.
- S75 #method: Architectural convergence (Grok + Gemini independently pushed manifest-driven) was the strongest Council signal this session. S76 protocol tuning idea: explicit convergence scan.
- S75 #tests: 390 → 549 (+159 new across P1+P2): validator + rate-limit + static wiring (P1); MP3 presence/size + manifest schema/shape/keys/hash + dialogue-panel refactor markers (P2).
- S75 #deferred: i18n localization (Gemini CHECK), Customize UX polish (loading, contrast, requestId, cold-load — 4 items), full-file-diff CHECK protocol, convergence scan PDR tuning.

### 2026-04-19 Session 74 (Mobile Depth + Cosmetic Expansion, 2/2 shipped in ~75K)
- P1 #mobile: Mobile viewport overhaul via CSS custom props (safe-area-inset-* → var/calc/clamp), 100dvh, viewport-fit=cover, dropped user-scalable=no. S73 had partial — unification was the win.
- P1 #phaser: Scale.RESIZE → Scale.FIT + CENTER_BOTH + visualViewport debounced handler (100ms, T14 Gemini R2).
- P1 #pwa: manifest.json + precache-only sw.js (Council G4), beforeinstallprompt → A2HS toast with 30-day TTL + dev-host gate.
- P2 #cosmetic: Heraldic nameplate ring on canvas, College of Arms period-1601 palette (gules/azure/vert/sable/argent/or).
- P2 #data: Migration 009 + postgres + snapshot-converters/player-list-builder/protocol all wired. +51 tests. 390/390 total.
- S74 #method: Full 2-round Council caught 9 real issues pre-ship; rejected 3 on technical merit. Triumvirate CHECK 2/9 valid, both fixed pre-handoff.
- S74 #deferred: apple-touch-icon PNG, 9 Imagen class sigils (DONE S75), Customize UI + handler (DONE S75), Lighthouse CI + screenshot matrix + axe-core (needs Tier 3 #17), Veo cutscene, T14 runtime sim.
