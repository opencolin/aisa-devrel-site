# v0.3 — The Wedge Aha (PLAN)

**Status/gate:** Not started · branch `release/v0.3` (worktree `/Users/colin/Code/aisa-devrel-site-worktrees/v0.3`). Gate to ship: `node build.mjs` regenerates `index.html` clean, the four new/updated sections render in `section_order`, and the deployed URL returns HTTP 200 with no console errors. Depends on v0.1 (front door) + v0.2 (golden path) being live. Prereq for v0.5.

## Goal

Show capabilities-beyond-tokens on the site. Prove the wedge OpenRouter and Vercel AI Gateway cannot match — a model route plus at least one data-API family behind one key — by adding four concrete proof surfaces: a capability catalog mapping all 14 API families / ~650 endpoints to real agent jobs, a featured 10-minute GTM-agent tutorial with runnable code and a cost panel, three vertical sample-app cards, and the first named-builder case-study slots. This is copy/data work in `content.json` plus small render additions in `build.mjs`; no framework, no build step at deploy.

## Ships

- [ ] **Add capability-catalog section mapping all 14 API families / ~650 endpoints to real agent jobs**
  - [ ] Add a new section object to `content.json` `sections[]` with `id: "catalog"`, `kicker: "CAPABILITY CATALOG"`, `heading`, and a short `body_md` framing "capabilities, not tokens." Insert `"catalog"` into `plan.section_order` immediately after `"wedge"` (so order becomes setup, wedge, catalog, honesty, ...).
  - [ ] Populate the section `table` (renders via existing `table()` in `build.mjs`) with one row per family: columns `["Family", "Endpoints", "Real agent job"]`. Cover all 14 families with real counts already used elsewhere in `content.json` (DataForSEO 445, Apollo 54, AgentMail 46, Twitter 32, Financial 22, plus CoinGecko, Polymarket, Kalshi, YouTube 1, and the remaining families) so the counts sum to ~650. No invented endpoints.
  - [ ] Add nav entry: append `["catalog", "Catalog"]` to the `navItems` array in `build.mjs` (place it after the `["wedge","Wedge"]` entry). Optionally add 3-4 `stats` (e.g. "14 families", "~650 endpoints", "445 DataForSEO", "9 model providers") reusing values already in the setup/wedge sections.

- [ ] **Feature the 10-min GTM-agent tutorial (model + Apollo + DataForSEO) with code + cost panel**
  - [ ] Add a new section object with `id: "tutorial"`, `kicker: "FLAGSHIP TUTORIAL"`, `heading` naming the "build a GTM agent in 10 minutes" flow, and `body_md` describing the three steps: model route → Apollo lead pull → DataForSEO enrichment, all behind one key (this is the north-star-manufacturing multi-capability call). Insert `"tutorial"` into `plan.section_order` after `"catalog"`.
  - [ ] Show the runnable code. `build.mjs`'s `inline()` renders single-backtick `code` but has no fenced code-block support, so either (a) add a minimal fenced-block branch to the `md()` function in `build.mjs` (detect a line-group starting with ```` ``` ````, emit `<pre><code>`) plus a `.prose pre` CSS rule in `css()`, or (b) render the snippet as a `cards`/table cell using inline `code`. Prefer (a): add ~8 lines to `md()` and one CSS block. Put the actual OpenAI-compatible base_url snippet (model call + Apollo call + DataForSEO call) in `body_md` as a fenced block.
  - [ ] Add the cost panel as the section `table`: columns `["Step", "Call", "Approx cost"]` with a total row, using only costs that are real/known (leave "TBD" or omit dollar figures rather than fabricate). Add `["tutorial", "Tutorial"]` to `navItems` in `build.mjs`.

- [ ] **Add 3 vertical sample-app cards (agent-builder, quant/fintech, GTM-automation) linking repos**
  - [ ] Add a new section object with `id: "samples"`, `kicker: "SAMPLE APPS"`, `heading`, short `body_md`, and a `cards` array of exactly 3 cards (renders as `cards-3`): agent-builder, quant/fintech, GTM-automation. Each card `label` = the vertical, `title` = the app name, `detail` = what it does + which families it wires (e.g. quant/fintech → Financial + CoinGecko + Polymarket + Kalshi). Insert `"samples"` into `plan.section_order` after `"tutorial"`.
  - [ ] Add repo links inside each card `detail` using markdown link syntax `[repo ↗](https://github.com/opencolin/...)` — `inline()` in `build.mjs` already converts `[text](url)` to `<a>`. Use real repo URLs under `opencolin`; if a repo does not exist yet, mark the card detail "repo: coming with build" rather than linking a dead URL.
  - [ ] Add `["samples", "Samples"]` to `navItems` in `build.mjs`.

- [ ] **Add first named-builder case-study slots**
  - [ ] Add a new section object with `id: "builders"`, `kicker: "NAMED BUILDERS"`, `heading` (ties to the honesty thread: replacing "~0 named public builders" / the unverifiable "5,000+ agents"), and `body_md` stating these are the first attributed case studies. Insert `"builders"` into `plan.section_order` after `"samples"`.
  - [ ] Provide `cards` as case-study slots: each card `label` = builder/company or "SLOT — open", `title` = agent/use-case, `detail` = the multi-capability call they make + attributable outcome. If real builders are not yet secured, ship honest placeholder slots labeled "SLOT — open" rather than fake names (candor is the site's trust engine per handoff decisions).
  - [ ] Add `["builders", "Builders"]` to `navItems` in `build.mjs`. Keep the existing `plan.site_releases` v0.3 entry as-is (it already describes this release in the ladder).

## Depends on / Unblocks

- **Depends on:** v0.1 Front Door (`/models` unbroken, vanity numbers killed, funnel instrumented) and v0.2 Golden Path (one-prompt onboarding, OpenAI-compatible quickstart, framework quickstarts) — the tutorial and catalog reference the working base_url and honest counts those releases established.
- **Depends on:** real endpoint counts per family (already in `content.json` setup/wedge/swot sections) and at least the code for the GTM tutorial. Sample-app repos and named builders are ideal but the plan ships honest slots if they are not ready, so they are soft deps.
- **Unblocks:** v0.5 Distribution Flywheel (SDKs, framework plugins, SEO/comparison cluster) — the catalog + tutorial + samples are the content the comparison cluster and SDK docs point at. Also unblocks v1.0's public builder showcase by establishing the named-builder card pattern.

## Start here (first 3 tasks)

1. `cd /Users/colin/Code/aisa-devrel-site-worktrees/v0.3` and confirm `git branch --show-current` prints `release/v0.3`. Run `node build.mjs` once to confirm a clean baseline before editing.
2. In `content.json`, add the `"catalog"` section object to `sections[]` and insert `"catalog"` into `plan.section_order` after `"wedge"`. Fill the family→job table with real counts summing to ~650. Run `node build.mjs` and confirm the section count in the log increases by 1.
3. In `build.mjs`, add fenced-code-block support to `md()` plus a `.prose pre` rule in `css()` (needed for the tutorial snippet), and append the four new `navItems` entries (`catalog`, `tutorial`, `samples`, `builders`). Rebuild.

## Deploy + verify

Run from the worktree `/Users/colin/Code/aisa-devrel-site-worktrees/v0.3`:

```bash
# 1. regenerate the artifact from content.json + build.mjs
node build.mjs
# expect: "wrote index.html (... bytes, N sections)" with N up by 4 vs baseline

# 2. commit on release/v0.3
git add content.json build.mjs index.html
git commit -m "v0.3 The Wedge Aha: capability catalog, GTM tutorial, sample apps, named-builder slots"

# 3. deploy to production
vercel deploy --prod --yes --scope dablclub

# 4. push the branch
git push -u origin release/v0.3
```

Then verify with `/browse` (gstack; never claude-in-chrome) against https://aisa-devrel-site.vercel.app :
- Confirm HTTP 200.
- Confirm no console errors.
- Confirm the four new sections render (`#catalog`, `#tutorial`, `#samples`, `#builders`), the catalog table shows all 14 families, the tutorial code block + cost panel render, three sample cards show, and the new sidebar nav links scroll to their sections (active-state IntersectionObserver still works).

## Done / handoff

Write back to `handoff/README.md`:
- Update **Last updated** date and note **v0.3 The Wedge Aha shipped**: capability-catalog section (14 families / ~650 endpoints → agent jobs), featured 10-min GTM-agent tutorial (model + Apollo + DataForSEO) with code + cost panel, 3 vertical sample-app cards, and first named-builder case-study slots.
- Record the production URL verified (HTTP 200, no console errors) and the commit/deploy on `release/v0.3`.
- Note any honest placeholders left open (e.g. "SLOT — open" builder cards, "coming with build" sample repos, "TBD" tutorial costs) so a later release fills them with real data — do not let them harden into vanity.
- Note the `build.mjs` change (fenced-code-block support in `md()` + `.prose pre` CSS) so future sections can use code blocks.
- Advance the **Pickup queue** to v0.5 (`releases/v0.5/PLAN.md`): SDKs, framework plugins, SEO/comparison cluster built on the catalog + tutorial + samples now live.
