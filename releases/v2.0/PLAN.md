# v2.0 — Full Interactive Proposal (PLAN)

**Status:** Not started · **Gate to open:** v1.3 (The Moat Goes Public) shipped and verified in production. v2.0 is the terminal cut — do not start until every prior rung (v0.1→v1.3) is live and the `site_releases` ladder in `content.json` reflects them. Terminal exit gate: the site is fully self-maintaining — any agent can update copy via `content.json` + `node build.mjs` with zero design-file edits, and GitHub→Vercel auto-deploy is live.

## Goal

Terminal state: the complete, self-sustaining interactive proposal site. Every prior section is shipped and polished; the proposal is consumable three ways (scroll, deck/print, one-page PDF), every section is independently deep-linkable, and the whole thing runs on autopilot — GitHub push auto-deploys, a custom domain is attached, and content is 100% driven from `content.json` so no human or agent ever hand-edits `index.html`.

## Ships

- [ ] **All prior sections shipped + polished; add an interactive deck/print view**
  - Audit `content.json` `sections[]` and `plan.site_releases[]` against live prod: confirm all 8 sections (`setup → wedge → honesty → programs → roadmap → metrics → swot → engagement`) plus the `ladder` render with the copy from v0.1–v1.3; fix any stale numbers (e.g. x402 should read GA, not "Private Beta", once v1.3 is live).
  - In `build.mjs`, add a `@media print` block to `css()` that collapses the sidebar (`.side{display:none}`), forces single-column cards/stats (`.cards,.stats{grid-template-columns:1fr}`), sets light-on-white ink for legibility, and adds `break-inside:avoid` to `.card`/`.stat`/`.rung` and `page-break-before:always` on `.sec` so each section prints as its own slide/page.
  - Add a "deck mode" toggle: a `.btn` in the hero (`hero.ctas` or a new hero control) plus a small inline `<script>` in `build.mjs` that sets a `body.deck` class enabling scroll-snap (`html{scroll-snap-type:y mandatory}` / `.sec{scroll-snap-align:start;min-height:100vh}`) and a "Print / Save as PDF" button that calls `window.print()`. Keep it zero-dependency (no slide library).

- [ ] **Add per-section deep-link cards + a downloadable one-pager (PDF)**
  - Deep-link affordance: in `build.mjs` `section()`, render an anchor link inside `.sec-head` (e.g. a `#` "copy link" control that writes `location.origin + '#' + s.id` to clipboard); IDs already exist on every `<section id>`, so this is presentation only. Add a matching entry to the sidebar `navItems` for any section still missing one.
  - One-pager: add a `plan.one_pager` object to `content.json` (headline, north star, the wedge in one line, engagement tiers table, 3–4 key stats) and a `onePager()` renderer in `build.mjs` that emits a print-optimized `<section id="one-pager" class="sec onepager">`; wire the hero "Download one-pager (PDF)" CTA to open `#one-pager` then trigger `window.print()` (browser "Save as PDF"). No server-side PDF generation — keep it static.
  - Verify the printed/saved PDF from `#one-pager` fits one page and carries the repo/`aisa.one` links; adjust the `@media print` rules in `css()` until it does.

- [ ] **Wire GitHub→Vercel auto-deploy; add custom domain**
  - Connect the Vercel project (`.vercel/` already present, scope `dablclub`) to the `opencolin/aisa-devrel-site` GitHub repo so pushes to `main` auto-deploy; confirm `vercel.json` (`cleanUrls`, `X-Content-Type-Options`) is honored by the Git build. After wiring, a merge of `release/v2.0` → `main` should deploy without a manual `vercel deploy`.
  - Attach a custom domain (e.g. an `aisa-devrel` subdomain under a `dablclub`-controlled domain) via `vercel domains` / project settings; add DNS, verify HTTPS, and set it as the production alias.
  - Update the `og:*` meta and canonical URL in `build.mjs`'s `<head>` to the custom domain, and update `content.json` `links` + `README.md` "Live" URL to match.

- [ ] **Content maintained from content.json so any agent can update via workflow + rebuild**
  - Confirm no copy lives in `build.mjs` — every string on the page must trace to `content.json` (hero, sections, stats, cards, tables, ladder, new `one_pager`). Move any hardcoded strings (e.g. the footer `foot-sub` DevRel bio in `build.mjs` lines ~101) into `content.json` so they are workflow-editable.
  - Document the loop in `README.md` and `handoff/README.md`: edit `content.json` → `node build.mjs` → commit → push (auto-deploys). Note that `index.html` is a generated artifact and must never be hand-edited.
  - Sanity-check that the `aisa-devrel-site-build` workflow's flat section schema still maps 1:1 onto the extended `content.json` (new `one_pager`, `deck` fields) so a re-run regenerates valid content.

## Depends on / Unblocks

- **Depends on:** v1.3 (The Moat Goes Public) shipped and verified — v2.0 polish assumes x402/payments copy is in its GA state. Also depends on all of v0.1–v1.0 already being live (this is a cumulative terminal cut).
- **Unblocks:** nothing downstream — v2.0 is the terminal rung. It "unblocks" hands-off operation: after this, the site self-maintains (auto-deploy + content-only edits) and the fractional operator can exit the loop.

## Start here (first 3 tasks)

1. **Enter the worktree and confirm state.** `cd /Users/colin/Code/aisa-devrel-site-worktrees/v2.0`, confirm `git branch --show-current` is `release/v2.0`, run `node build.mjs`, and diff the resulting `index.html` against prod to establish a clean baseline before changing anything.
2. **Add the `@media print` block to `css()` in `build.mjs`** (sidebar hidden, single-column, light ink, `break-inside:avoid` on cards/stats/rungs, `page-break-before` per section) and rebuild — this is the foundation for both deck mode and the one-pager.
3. **Add `plan.one_pager` to `content.json` and the `onePager()` renderer to `build.mjs`**, wire the hero "Download one-pager (PDF)" CTA, rebuild, and print-preview `#one-pager` to confirm it fits one page.

## Deploy + verify

```bash
cd /Users/colin/Code/aisa-devrel-site-worktrees/v2.0

# 1) Regenerate the artifact from content.json
node build.mjs                       # writes index.html, prints byte count + section count

# 2) Commit on the release branch
git add content.json build.mjs index.html README.md handoff/README.md
git commit -m "v2.0 — Full Interactive Proposal: deck/print view, per-section deep links, one-pager PDF, auto-deploy + custom domain, content-only maintenance"
# branch is already release/v2.0 (confirm with: git branch --show-current)

# 3) Deploy to production
vercel deploy --prod --yes --scope dablclub
```

Then verify with the `/browse` skill against the production URL (custom domain once attached, else `https://aisa-devrel-site.vercel.app`):

- Page returns **HTTP 200** and renders all sections + the new `#one-pager`.
- **No console errors** (check the browser console via `/browse`).
- Deep links resolve: navigating to `#engagement`, `#swot`, `#one-pager` scrolls to the right section.
- Deck mode toggle works and "Print / Save as PDF" opens the print dialog; `#one-pager` prints to a single page.
- After Git integration is wired, push a trivial `content.json` change to `main` and confirm Vercel auto-deploys without a manual `vercel deploy`.

## Done / handoff

Write back to `handoff/README.md`:

- Mark v2.0 **shipped** and the ladder **complete (terminal state reached)** — update "Last updated" date and the pickup queue (auto-deploy + custom domain items now done, not pending).
- Record the **live URLs**: custom domain (new production alias) and the `.vercel.app` fallback; update the "Live URLs" and "Publishing" sections and the `README.md` "Live" line to the custom domain.
- Document the **self-sustaining loop** under "How to change the site": edit `content.json` → `node build.mjs` → commit → push to `main` (auto-deploys). State plainly that `index.html` is generated and must never be hand-edited, and that all copy (incl. footer bio + one-pager) now lives in `content.json`.
- Note the **three consumption modes** (scroll / deck-print / one-pager PDF) so the next agent knows they exist, and close the pickup queue — there is no next rung.
