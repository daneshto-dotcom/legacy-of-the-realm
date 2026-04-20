# Session 76 Handoff — GitButler Dropped + Stale Worktree Cleanup
**Generated:** 2026-04-20
**Parent:** `2f8f35f` (main) | **Submodule:** `8ee5837` (master) | **Active worktree:** `awesome-golick-d4eb82`

═══════════════════════════════════════════════════════════

## Quick Summary

S76 shipped **1/1 Micro-tier priority** via user-path-approved PDR (deliberation auto-waived). Budget `~15K/150K` (GREEN). **Zero API spend** — pure git/fs cleanup.

- **P1 — GitButler + Stale Worktree Cleanup** — Consolidated scattered state left over from multi-branch S55-era confusion. Pruned 6 merged local branches + `gitbutler/workspace` artifact + 2 stale remote branches + 7 orphan worktree dirs. Codified **solo workflow** in submodule CLAUDE.md. Verified global `/handoff` skill STEP 1.1 CONSOLIDATE-AND-PRUNE will auto-run this cleanup every future session.

## Before / After State

| Category | Before | After |
|---|---|---|
| Local branches | 9 | 2 (`main` + `claude/awesome-golick-d4eb82`) |
| Remote branches | 3 | 1 (`origin/main`) |
| Worktree dirs on disk | 8 | 1 (active only) |
| GitButler artifacts | `gitbutler/workspace` @ `a434363` | gone |
| Submodule `master` | `351a360` | `8ee5837` (+ CLAUDE.md git workflow + BACKLOG S76 row) |
| Parent `main` | `cd33230` | `2f8f35f` (+ submodule bump + S75 handoff from prior session) |

## What Was Deleted

**Local branches** (all merged, ahead=0 vs main):
- `claude/adoring-gould` (was `d89fa8b`)
- `claude/competent-ellis-e43689` (was `4c900f8`)
- `claude/cool-shockley-449c11` (was `1ea77ff`)
- `claude/musing-banzai` (was `9bb9f98`)
- `claude/vigorous-kepler` (was `d89fa8b`)
- `dn-branch-1` (was `4c3a1d3`)
- `gitbutler/workspace` (was `a434363`, force-deleted — GitButler artifact "GitButler Workspace Commit")

**Remote branches:**
- `origin/dn-branch-1`
- `origin/session-42/email-dashboard-tunnel`

**Orphan worktree dirs** (under `.claude/worktrees/`):
- `adoring-gould/`, `affectionate-zhukovsky/`, `competent-ellis-e43689/`, `cool-shockley-449c11/`, `musing-banzai/`, `relaxed-napier/`, `vibrant-jones/`

## What Was Kept

- `main` (parent HEAD)
- `claude/awesome-golick-d4eb82` (active worktree branch, per PDR rule — never delete active)
- `master` on remote (origin/main HEAD alias)
- `.claude/worktrees/awesome-golick-d4eb82/` (the active worktree dir)

## Scope Guards (All Held)

✓ Every git op used `git -C "$(git rev-parse --show-toplevel)"` — never bare `git` that could leak to parent
✓ Every `rm -rf` target validated via `case "$target" in "$WORKTREES_DIR/"*)` pattern before execution
✓ Zero touches to Founder DNA parent repo, sibling Extension Projects, or `~/.claude/`
✓ Submodule `Game/founding-realm` docs edited (in-scope) but its branches/worktrees untouched
✓ Active worktree branch + dir explicitly excluded from every delete loop

## Docs Codified

**`Game/founding-realm/CLAUDE.md`** — new `## GIT WORKFLOW (S76+)` section (before MODEL ROUTING):
- One session per project, commit to main
- GitButler dropped — virtual-branch model was overhead
- Worktrees disabled by default (session-start hook reports `[WORKTREE] Disabled (solo workflow)`)
- No feature branches — ship direct to main/master, rebase if origin moved
- Global `/handoff` STEP 1.1 auto-cleans each session

**`Game/founding-realm/BACKLOG.md`** — new `## DONE — S76` section with full cleanup scope

## Global `/handoff` Skill STEP 1.1 Verified

Read-only confirmed at `~/.claude/skills/handoff/SKILL.md:36`:
- **STEP 1.1.A** — Scope guards (PROJECT_ROOT, refuse-if-global, git -C pattern, rm path validation, never-delete-active-worktree)
- **STEP 1.1.B** — Merge active branch to main, push (ff-only, no force)
- **STEP 1.1.C** — Delete stale local + remote branches (preserve list: main/master/active/HEAD; always delete `gitbutler/workspace`)
- **STEP 1.1.D** — Prune worktrees (registered list diff vs on-disk dirs, validated rm)
- **STEP 1.1.E** — GitButler awareness notice (printed if artifacts found)
- **STEP 1.1.F** — Final verification
- **STEP 1.1.G** — Error handling

**Going forward:** every session automatically runs this cleanup at handoff. No manual intervention required.

## User Actions

1. **Delete GitButler app completely** — user confirmed in S76 close message. This is the permanent fix; otherwise GitButler would recreate `gitbutler/workspace` on next app open and skill would re-prune it in a churn loop.
2. `neshto.com` nameservers → `lara.ns.cloudflare.com` + `nick.ns.cloudflare.com` (carried from S74)
3. Hetzner VPS provision (carried — unlocks Tier 3 #16 + #18 + #1)

## S77 — MANDATORY P1: PROJECT AUDIT

Per user request: **before pulling any new backlog priority in S77**, run a full project health check:

- [ ] **Git integrity** — parent main + submodule master clean + pushed; no stragglers post-GitButler-deletion; no new orphan worktrees; `git fsck` clean
- [ ] **Tests** — `npm test` → expect 549/549 (same as S75 close)
- [ ] **Dependencies** — `npm audit` → expect 0 vulnerabilities (S73 ReDoS override still in place)
- [ ] **Build** — `npm run build` clean; `npx tsc --noEmit` clean; `npm run bundle` produces `public/dist/main.bundle.js`
- [ ] **BACKLOG sanity** — re-read BACKLOG.md, cross-check each "NEXT" / "LATER" item against actual codebase state (e.g. is #29 still the right lineId approach? #30 still 4 items?)
- [ ] **Tech-debt scan** — `grep -rn "TODO\|FIXME\|XXX" src/ public/js/` → triage what accumulated since S57's last sweep
- [ ] **Triple-AI architecture review** — send current submodule structure + S75/S76 changes to Grok + Gemini for drift detection ("does the codebase still match its CLAUDE.md intentions? any hidden tech debt? what's the biggest risk to shipping?")
- [ ] **Deferred items verification** — S74-deferred (apple-touch-icon, Lighthouse CI, screenshot matrix, axe-core, Veo, T14 runtime sim) + S75-deferred (#29, #30) all captured in BACKLOG; verify no items dropped silently
- [ ] **Hook health** — confirm `.claude/` hooks still functional; pdca-gate working; port-manager clean; no hook leaks between worktree and main checkout
- [ ] **Confirm audit verdict** — one of: `GREEN (proceed to next backlog)` / `YELLOW (N issues to fix first)` / `RED (stop, deep work needed)`

After the audit PASS, pull next-priority from backlog. Recommended order (from S75 close):
1. **#17 CI/CD Pipeline (M)** — highest strategic leverage, unlocks 4 deferred items
2. **#29 Dialogue lineId protocol (M)** — i18n unlock
3. **#30 Customize UX polish bundle (S)** — direct S75 follow-up

## Pre-flight Checklist for S77

- [ ] Read this handoff OR `boot-snapshot.md` (faster)
- [ ] Confirm parent main @ `2f8f35f` clean, submodule master @ `8ee5837` clean
- [ ] Confirm GitButler app is fully uninstalled (user action)
- [ ] Run S77 P1 PROJECT AUDIT before any other work
- [ ] Pull ONLY 1 priority in addition to audit if time allows (keep S77 focused on audit + one targeted work item)

## Session Rules Inherited

- SESSION PDCA PIPELINE (pre-approval gate, RALPH:PATROL CHECK, reflexion, budget line)
- MODEL ROUTING PROTOCOL ([MODEL-ROUTER] directives)
- PORT PROTOCOL — `$SESSION_PORT` for dev servers; game server port 3000 (fixed)
- SYNC-BRAIN always watching
- Credentials: `BRAIN/infrastructure/CREDENTIALS_VAULT.json` (Tier 0)
- Git identity: `daneshto@gmail.com`
- **NEW S76 POLICY:** Solo workflow — commit to main/master direct, no GitButler, worktrees disabled by default

═══════════════════════════════════════════════════════════
