# v0.2 — Golden Path (PLAN)

**Status:** not started · **Gate:** ships 1–2 must land before ship 3 (the honest median needs a real measured number; do not publish a placeholder as if measured). Depends on v0.1 funnel instrumentation being live.

## Goal

Add the agent-native onboarding + quickstart surfaces to the site. Turn "AISA is OpenAI-compatible with 4 supported frameworks" from a claim into a page a builder can copy-paste from and make a first real API call in under 5 minutes. Every snippet on the page must be one a human or an agent can paste and run without editing anything except an API key.

Everything is authored in `content.json` (copy/data) and rendered by `build.mjs` (design). Work happens in the worktree `/Users/colin/Code/aisa-devrel-site-worktrees/v0.2` on branch `release/v0.2`.

## Ships

### - [ ] 1. Quickstart section: OpenAI-compatible `base_url` + one-prompt agent-native install

Prove the drop-in swap and the agent-native onboarding in one place.

- Add a new section object to `content.json` `sections[]` with `id: "quickstart"`, `kicker: "QUICKSTART"`, `heading` (e.g. "First real call in under 5 minutes."), and a `body_md` intro. Insert `"quickstart"` into `plan.section_order` **right after `"setup"`** so it renders high on the page.
- In that section's `body_md`, include the OpenAI-compatible drop-in snippet as a fenced/`code` block: set `base_url` to the AISA OpenAI-compatible endpoint + `api_key`, showing the one-line change from `api.openai.com`. Keep it copy-paste-runnable (Python `openai` client and a raw `curl`); verify the exact `base_url` against the live product before writing it — do not invent the path.
- Add the one-prompt agent-native install as a second block: the copy-paste prompt an agent runs, plus links to the machine-readable surfaces (`llms.txt`, per-page `.md`, A2A card). If those files are not yet published on the product, note them as `[ ]` blocking sub-items here and link the intended URLs; do not claim they exist if they 404.
- Register the new section in the sidebar: add `["quickstart", "Quickstart"]` to the `navItems` array in `build.mjs` (line ~52–55) so it appears in nav and the scroll-spy observer picks it up.

### - [ ] 2. Four framework quickstart tabs (OpenClaw, Claude Code, Cursor, Hermes) as copy blocks

- Represent the four frameworks as data in the `quickstart` section. Simplest zero-build approach that fits the current renderer: use `cards` (one card per framework, `label` = framework, `title` = "Set base_url", `detail` = the config snippet) **or** a `table` (col 1 = framework, col 2 = where the setting lives, col 3 = the value to paste). Pick one and keep all four consistent.
- If genuine tabbed copy blocks are wanted (only one visible at a time), add a small `tabs` renderer to `build.mjs`: a `renderTabs(section.tabs)` helper emitting `<div class="tabs">` with radio/label buttons + panels, wired via the existing inline `<script>` at the bottom of `build.mjs`, and matching CSS in the `css()` template literal (reuse `--panel`, `--line`, `--mono`, `--acc` tokens — no new colors). Keep it dependency-free.
- For each framework give the exact, verified drop-in: OpenClaw, Claude Code, Cursor, and Hermes each need the real config location (env var / settings file / model provider field) and the AISA `base_url` value. Verify each against current docs before writing; mark any unverified one as `[ ]` and omit rather than guess.

### - [ ] 3. Live "time to first call" target + honest measured median

- Add a stat or a one-line target to the `quickstart` section stating the goal explicitly (e.g. `value: "< 5 min"`, `label: "Time to first call"`, `sub: "visit → key → first successful call"`) using the existing `stats` array shape. Frame it as the **target**, clearly, until a real number exists.
- Once v0.1 funnel instrumentation has enough data, replace/augment with the **honest measured median** (e.g. `value: "4m12s"`, `sub: "measured median, N=… , as of <date>"`). Cite N and date in `sub`. No rounding-to-flatter, no aspirational number dressed as measured — if not yet measured, keep only the target and leave this sub-item `[ ]`.
- Tie the number to the north-star instrumentation, not a vanity signup count. This is a latency-to-value metric; keep it that.

## Depends on / Unblocks

**Depends on:**
- v0.1 "Front Door" landed: `/models` unbroken, vanity claims killed, and funnel instrumentation (visit → key → first call) live — ship 3's median is meaningless without it.
- Product-side machine-readable surfaces (`llms.txt`, per-page `.md`, A2A card) and the four framework configs existing/verifiable. Block ship 1's install block and ship 2 on these; do not publish dead links.

**Unblocks:**
- v0.3+ site work in the ladder (`plan.site_releases` in `content.json`). A working Quickstart is the surface later releases (community, showcase, deeper metrics) point builders at.

## Start here (first 3 tasks)

1. `cd /Users/colin/Code/aisa-devrel-site-worktrees/v0.2 && git status` — confirm you're on `release/v0.2` and clean. Verify the live AISA OpenAI-compatible `base_url` and the four framework config locations against the product/docs before writing any snippet (this gates everything).
2. Add the `quickstart` section object to `sections[]` in `content.json` and insert `"quickstart"` after `"setup"` in `plan.section_order`; add `["quickstart","Quickstart"]` to `navItems` in `build.mjs`. Run `node build.mjs` and confirm the section renders and appears in the sidebar.
3. Fill ship 1's two snippets (OpenAI-compatible `base_url` + one-prompt agent-native install) with verified values, rebuild, and eyeball the copy blocks.

## Deploy + verify

```bash
# from the worktree
cd /Users/colin/Code/aisa-devrel-site-worktrees/v0.2

node build.mjs                       # regenerate index.html from content.json (never hand-edit index.html)

git add content.json build.mjs index.html
git commit -m "v0.2 Golden Path: quickstart + framework tabs + time-to-first-call"   # on release/v0.2

vercel deploy --prod --yes --scope dablclub    # production deploy
```

Then verify with `/browse` against the production URL (https://aisa-devrel-site.vercel.app):
- HTTP 200 on the page.
- No console errors (especially if a `tabs` script was added to `build.mjs`).
- `#quickstart` section renders, appears in the sidebar nav, and scroll-spy highlights it.
- Every copy block is present and each snippet is copy-paste-runnable; all four framework entries show; the "time to first call" target/median renders.
- No dead links among `llms.txt` / per-page `.md` / A2A card / framework docs (spot-check each href).

## Done / handoff

Write back to `handoff/README.md`:
- Move v0.2 out of the pickup queue; note "v0.2 Golden Path shipped" with the production URL and deploy date.
- Record decisions made: OpenAI-compatible `base_url` value used, the four verified framework configs, and how the frameworks were rendered (cards vs table vs new `tabs` renderer in `build.mjs`).
- State the honest "time to first call" number as published (target only, or measured median with N + date), and whether it's target vs measured — so the next agent doesn't mistake one for the other.
- List any sub-items left `[ ]` (e.g. `llms.txt`/A2A card not yet on product, a framework config unverified) as explicit blockers carried into the queue.
- Point the next release (v0.3) at the shipped `#quickstart` surface as the builder entry point.
