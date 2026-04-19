# Boot Snapshot (auto-generated at handoff)
Generated: 2026-04-19 | Session: S74

## Next Steps
1. **Tier 4 #22.5 Character Customization completion (S)** — 9 Imagen img2img class sigil variants (S73 honor.png as init, strength 0.8) + sidebar Customize panel UI + CUSTOMIZE server message handler with enum validation. Foundation shipped in S74 (schema + render).
2. **Daniel action** — update `neshto.com` nameservers at registrar to `lara.ns.cloudflare.com` + `nick.ns.cloudflare.com` (CF zone PENDING)
3. **Tier 3 #17 CI/CD Pipeline (M)** — GitHub Actions. Also unlocks S74-deferred Lighthouse CI baseline + 12-screenshot matrix + axe-core WCAG automation.
4. **Tier 4 #20 Advanced Crafting & Masterworks (M)**
5. **Tier 4 #21 Player Event Calendar + Chronicle Integration (M)**
6. **Tier 4 #23.5 NPC TTS expansion** to remaining 7 NPCs
7. **Expansion** — full 20 sigils (4 tracks × 5 tiers) + Veo cutscene prototype (still untapped)
8. **VPS deploy on Hetzner** (blocked on Daniel) — unlocks Tier 3 #16 + #18
9. **S74 deferred** — apple-touch-icon-180.png asset; T14 runtime event sim (needs browser harness)

## Blockers
- VPS deploy (Daniel: Hetzner provision)
- `neshto.com` nameserver update (Daniel: registrar)
- Real-world attendance verification (VPS + Stripe)
- Admin/GM tooling v2 + Monitoring (VPS)
- Lighthouse/axe-core/screenshot matrix automation (blocked on Tier 3 #17 CI/CD)

## Pending Backlog (founding-realm)
**Tier 3 — Platform & Operations:**
- [x] ~~#15 Mobile Viewport Optimization~~ — **S74 P1 (DONE, cb09015)**
- [ ] #16 Admin/GM Tooling v2 (M) — blocked VPS
- [ ] #17 CI/CD Pipeline (M) — unlocks S74-deferred CI work
- [ ] #18 Monitoring & Observability (M) — blocked VPS

**Tier 4 — Depth & Polish:**
- [ ] #20 Advanced crafting & masterworks (M)
- [ ] #21 Player event calendar + Chronicle integration (M)
- [x] ~~#22 Character customization (foundation)~~ — **S74 P2 (DONE, cdd3c8d)**
- [ ] #22.5 Character customization completion (S) — 9 Imagen sigils + panel UI + handler
- [ ] #23.5 NPC TTS expansion to remaining 7 NPCs (M)

**Tier 5 — Growth & Scale (post-launch):** #24-28

**Non-batch inherited:** Higher-res Chateau photos, fog-strip.webp wiring, fallback sprites, sprite atlas, sigil map client sync, voice text normalization, **S74 deferred** (apple-touch-icon PNG, Lighthouse CI, screenshot matrix, axe-core, Veo prototype, T14 runtime sim).

## Recent Reflexion (last 2 sessions)

### 2026-04-19 Session 74 (Mobile Depth + Cosmetic Expansion, 2/2 shipped in ~75K)
- P1 #mobile #worked: CSS custom props (--sa-{top,bottom,left,right}=env(safe-area-inset-*)) unified hardcoded 220/280px into var()+calc()+clamp layout. `100dvh` cascade (iOS URL-bar fix), viewport-fit=cover, dropped user-scalable=no (WCAG), touch-action:manipulation kills 300ms tap-delay. S73 already had partial safe-area/@supports + 44px touch targets; unification was the win.
- P1 #phaser #worked: Scale.RESIZE → Scale.FIT + CENTER_BOTH + visualViewport.resize/scroll + orientationchange handlers with 100ms vvTimer debounce (T14 Gemini R2 condition). Catches URL-bar collapse, Dynamic Island, keyboard popup.
- P1 #pwa #worked: manifest.json + precache-only sw.js (Council G4 — iOS blocks runtime cache-first). SW gated to production hosts only (Gemini CHECK HMR fix). beforeinstallprompt → A2HS toast after 3 sessions + 30-day TTL + dismiss flag (Grok CHECK re-show fix).
- P2 #cosmetic #worked: Heraldic nameplate ring on canvas with College of Arms period-1601 palette (gules/azure/vert/sable/argent/or, or=#d4a847 matches S73 gold). Shape-pattern via stroke width+alpha (solid/dashed/dotted/double) — WCAG colorblind-safe without Canvas line-dash dependency. Clean lifecycle (create/update/destroy+offline).
- P2 #data #worked: Migration 009 (preferred_color+preferred_variant) + postgres + snapshot-converters + player-list-builder + protocol all wired. 12 files touched, +51 tests. 390/390 total.
- S74 #method #worked: Full 2-round Council deliberation — R1 Grok 8 challenges, Gemini CONDITIONAL ADOPT w/ 3 amendments, R2 Grok PASS + Gemini CONDITIONAL (T14 merged). 9/12 findings adopted, 3 rejected on technical merit (ENVELOP vs FIT for bounded world, Claude_Preview drop, period-primary-source-Missale-Romanum).
- S74 #method #worked: Triumvirate CHECK 2/9 valid — both fixed pre-handoff (HMR, toast TTL). 4/9 rejected on technical grounds (DPR double-scale, {cache:'reload'} best practice, heraldicRing cleanup + z-index already correct). 3/9 accepted as carry-forward.
- S74 #method #improve: Scope discipline deferred Imagen sigils + Customize UI to S75. Data+rendering foundation ships useful value — S75 completes the loop. ~78K plan → ~75K actual (GREEN).
- S74 #deferred: apple-touch-icon PNG (harmless 404 fallback), 9 Imagen class sigils, Customize panel UI + server handler, Lighthouse CI + screenshot matrix + axe-core (needs Tier 3 #17), Veo cutscene, T14 runtime event sim (ts-node limitation).
- S74 #repo-note: Repo is DUAL-PROJECT (FDTTA driving tutor at root + Legacy in Game/founding-realm submodule). Pre-flight flagged B22 FDTTA commit as cross-project leak — turned out legitimate. Strict submodule-only scope boundary held.
- S74 #hooks-note: PDCA gate requires status:in_progress + priority_state in (deliberated|unlocked|executing|completed) to allow Edit. PDR lock fires on status flip to in_progress, clears on next UserPromptSubmit. Designed 1-turn friction.

### 2026-04-17 Session 73 (Security + Depth + Polish, 3/3 shipped in ~60K)
- P1 #security: path-to-regexp ReDoS already patched in 0.1.13 — added override pin as defense-in-depth. 281/281 tests.
- P2 #feature: Reputation cosmetics via activeTitle + 4 Imagen sigils. 297/297 tests.
- P3 #feature: 9 NPC TTS MP3s via Chirp 3 HD for Duval/Varenne/Ashford. 227KB, $0.022.
- S73 #method: Dual-AI Council 5.5/18 adoption (~30%), 0 false positives. Verify-first on P1 caught stale backlog (ReDoS already fixed).
