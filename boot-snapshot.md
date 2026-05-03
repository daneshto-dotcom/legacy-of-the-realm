# Boot Snapshot (auto-generated at handoff)
Generated: 2026-05-03 | Session: S81

## Next Steps
1. **S81 P3 — Customize-panel a11y** (Standard, ~18K) — auth WS fixture + axe expansion. Carry-forward from S81.
2. **S81 P4 — Studio voice upgrade option A** (Standard, ~15K) — drop in Studio API tier for 9 NPC lines, A/B against Chirp3 HD, manifest schema v3. NO Custom Voice training spend. Needs `.env` GOOGLE_CLOUD_API_KEY from CREDENTIALS_VAULT. Carry-forward from S81.
3. **S82 P0 NEW — Cloudflare Pages static deploy** (Standard, ~10K) — surfaced during S81 site verification. legacyoftherealm.com is HTTP 530 because no VPS origin exists. Static deploy of landing.html+festival.html+assets unblocks public surface independent of Daniel's VPS provisioning.
4. **GCS migration follow-on** — once Daniel provisions `gs://legacy-of-the-realm-audio` per `Game/founding-realm/docs/GCS_SETUP.md`, run `npm run tts:migrate-gcs` once + flip `EXPECT_GCS_AUDIO=true` in CI.
5. Mobile baselines fail-on-diff (Micro, S82+) — Council D14 callback after 30-day desktop stability (~2026-05-28).
6. Embedding-based intent normalization — needs ~30 days of `ai:*` traffic post-GCS migration.

## Blockers
- **VPS deploy** (Hetzner) — Daniel-action. Gates production game server.
- **GCS bucket + SA** — Daniel-action. Gates `ai:*` audio cloud upload (code shipped S81 P2; behavior is no-op until env set).
- **SUBMODULE_PAT** — Daniel-action. Gates parent CI full-gate.
- **BigQuery dataset + service account** — Daniel-action. Gates CI metrics full mode.
- **`.env` `GOOGLE_CLOUD_API_KEY`** — needed before S82 P4 can run Studio voice synthesis.

## Pending Backlog
- [ ] Higher-res Chateau photos (needs source files from Daniel)
- [ ] fog-strip.webp integration (generated in S51, not wired to map edges)
- [ ] Fallback sprite improvement (deferred — rare edge case)
- [ ] Sprite atlas packing (deferred — 27 PNGs manageable)
- [ ] **S73 deferred**: Client sigil→track mapping sync mechanism
- [ ] **S74 deferred**: 12-screenshot viewport matrix (3 flows × 4 devices) — partial ship via S79 P4 + S80 P3 (3 flows × 3 devices)
- [ ] **S74 deferred**: Veo cutscene prototype (Gemini ANALYZE rec)
- [ ] **S74 deferred**: T14 runtime event sim (visualViewport live dispatch)
- [ ] **S74 deferred**: apple-touch-icon-180.png asset file
- [ ] **S75 protocol**: Full-file diffs in CHECK prompts (44% false-positive rate on partial snippets)
- [ ] **S75 protocol**: Convergence scan in PDR R1
- [ ] **S80 deferred**: TTS pipeline end-to-end manual QA against real LLM emit

## Recent Reflexion (last 2 sessions)

### 2026-05-03 — Session 81: BACKLOG sync + GCS scaffolding (2/4 SHIP)
- P1 #protocol-gap: Items shipped in earlier sessions but never struck-through in BACKLOG. Adopt: any priority mapping to an existing BACKLOG row edits that row's status in the same commit.
- P2 #worked: Pure-stdlib v4 signed URL generator (~90 LOC) beat Council R0's `@google-cloud/storage` SDK AND Grok's "google-auth-library" suggestion. Zero new dependencies.
- P2 #council: Council unanimous on architecture (SDK→raw, public→signed, schema→stay v2, atomic upload). PRIME-AUDIT R15 (MD5 ETag) + R16 (signing fallback) closed gaps R1 missed.
- P2 #learned: Gemini's silent-failure catch ("write-local→upload→delete-local-on-success") was the highest-value R1 finding. Weight Gemini quality lens harder on storage/atomicity decisions.
- SESSION #site-status: legacyoftherealm.com HTTP 530 — known VPS-blocked state. NO automated deploy workflow. NEW S82 candidate: Cloudflare Pages static deploy of public landing.
- SESSION #scope-control: User pulled brake at 50K (~1/3 budget) to ship clean and /handoff cleanly. Discipline > velocity.
- SESSION #meta: 2/4 SHIP. 628 tests GREEN. Bundle 285.5KB unchanged. Council spend $0.07. Submodule b92ca74, parent 80cde9f.

### 2026-04-27 — Session 79: Voice Pipeline + CI Hardening (5/5 SHIP)
- P1 #worked: v1 text-hash voice fallback fully excised. Bundle -0.4kb. Audit-before-delete pattern proven.
- P2 #worked: AI lineId via Anthropic tool-calling + base62(SHA256(text+intent))[:12] stable IDs.
- P3 #scope: customize.html doesn't exist (it's a panel inside game2d.html); customize panel a11y deferred to S80 (auth WS fixture needed) — and now S81 P3 carries it forward to S82.
- P4 #worked: Visual baselines via Playwright `devices` API (iPhone-13/iPad-Pro-11/Desktop-Chrome).
- SESSION #council: Domain-weighted voting cleanly resolved 4/5 contested decisions; Adoption rate 71%.
