# v0.1 — Front Door (PLAN)

**Status: SHIPPED (initial site live).** Gate note: site is live at https://aisa-devrel-site.vercel.app and renders. This release closes v0.1 by hardening the front door — verify the honest /models story holds on the site, keep the candid self-review prominent and reachable, add analytics, and re-confirm a clean production deploy (HTTP 200, no console errors). Do not climb to v0.2 until every box below is checked and Deploy + verify passes.

## Goal

Honest, working landing a builder trusts in 60 seconds.

## Ships

Worktree: `/Users/colin/Code/aisa-devrel-site-worktrees/v0.1` (branch `release/v0.1`, already checked out). All copy/data edits go in `content.json`; all design/markup edits go in `build.mjs`; regenerate `index.html` with `node build.mjs` — never hand-edit `index.html`.

- [ ] **Site reflects the fixed /models story and one honest number (no inflated claims presented as fact).**
  - Audit `content.json` so every inflated figure ("1000+ LLMs", "5,000+ agents") appears ONLY in quotes as a claim being rejected — never as the site's own assertion. Current state is correct (all 9 occurrences of "5,000+ agents" and every "1000+ LLMs" are quoted-and-killed in `setup`, `honesty`, `swot`, `metrics`); this ship is to lock that in, not rewrite it.
  - Confirm the site's own headline numbers stay the honest ones already in the `setup` section `stats` (`~650` endpoints, `9` providers, `41` skills, `0` named public builders) and in the `wedge` table row `["Model gateway (OpenAI-compatible)", ..., "Yes, 9 providers"]` — these are the "one honest number" surfaces. No "0 models" or empty-catalog language should read as the site being broken; it should read as candid product critique.
  - Grep guard after any edit: `grep -nE '1[,.]?000\+ *LLM|5[,.]?000\+ *agent' content.json` must show every hit wrapped in escaped quotes (`\"`). If any bare/unquoted inflated claim appears, rewrite it to the honest figure before building.

- [ ] **Candid self-review section stays prominent (honesty = trust engine).**
  - Keep section id `honesty` (kicker "FIELD NOTES FROM DOGFOODING", heading "Sharpened from using the product") in `content.json` `plan.section_order` at its current early position (index 2, right after `setup` and `wedge`) and in the `navItems` array in `build.mjs` (label "Field notes"). Do not demote or drop it.
  - Fix the primary hero CTA target: in `build.mjs` (~line 93) the hero CTA loop hardcodes `href="#${i === 0 ? "setup" : "roadmap"}"`, so CTA[0] "Read the honest review" points at `#setup`, not the review. Map the honesty CTA to `#honesty` (e.g. link CTA[0]→`#honesty`, CTA[1]→`#roadmap`/`#ladder`, CTA[2]→`#engagement`) so the button that promises the honest review actually lands there.
  - Verify the `honesty` section renders its P0 candor intact: the `/models renders "0 models"` card and the `stats` (`P0` /models page, `Not GA` x402 payments, `~650` verified-in-use) survive the build and are visible above the fold of that section.

- [ ] **Funnel instrumentation: add analytics hooks (Vercel Analytics) to the site.**
  - Inject the Vercel Analytics script into the `<head>` (or just before `</body>`) inside the template string in `build.mjs` — for a zero-build static (non-Next) site this is the `<script defer src="/_vercel/insights/script.js"></script>` tag plus `window.va` queue shim; add it near the existing font `<link>` block (~lines 72–75) or beside the existing inline `<script>` (~line 105) so `node build.mjs` bakes it into `index.html`.
  - Enable Analytics for the project in the Vercel dashboard (project served under scope `dablclub`) so the injected script has a collector; confirm the tag is same-origin (`/_vercel/insights/...`) so `vercel.json` `X-Content-Type-Options: nosniff` and no CSP block it.
  - Add lightweight funnel-intent events on the three hero CTAs (honest review / publication ladder / book the pilot) via `va('event', ...)` in the inline `<script>` in `build.mjs`, so visit→CTA-click is measurable from day one. Keep it dependency-free (no npm) to preserve the zero-build contract.

- [ ] **Baseline: confirm live deploy renders, 200, no console errors.**
  - After `node build.mjs`, diff `index.html` and confirm all 8 ordered sections + the publication ladder emit (build log prints section count).
  - Deploy to production and confirm the production URL returns HTTP 200.
  - Load the deployed page via `/browse` and confirm zero console errors/warnings and that the Vercel Analytics request fires (see Deploy + verify).

## Depends on / Unblocks

- **Depends on:** initial site already published to `opencolin/aisa-devrel-site` and live on Vercel (done); `content.json` + `build.mjs` present in the `release/v0.1` worktree (confirmed); Vercel access under scope `dablclub`; Node 22 (`node build.mjs` runs with zero deps).
- **Unblocks:** **v0.2 Golden Path** — the funnel instrumentation added here is the measurement backbone v0.2's "time to first call" dashboard reads from, and a trusted, honest front door is the precondition for driving any traffic. Do not start v0.2 until this PLAN's Deploy + verify is green.

## Start here (first 3 tasks)

1. `cd /Users/colin/Code/aisa-devrel-site-worktrees/v0.1`, confirm `git branch --show-current` prints `release/v0.1`, run `node build.mjs` once to get a clean baseline `index.html`, and open the production URL in `/browse` to record the current console + HTTP-200 state before changing anything.
2. In `build.mjs`, fix the hero CTA targets so "Read the honest review" links to `#honesty` (currently `#setup`), and add the Vercel Analytics `<script>` tag to the `<head>`.
3. Run the inflated-claim grep guard on `content.json` (`grep -nE '1[,.]?000\+ *LLM|5[,.]?000\+ *agent' content.json`) and confirm every hit is a quoted, rejected claim — fix any bare assertion to the honest number.

## Deploy + verify

Run from the worktree root `/Users/colin/Code/aisa-devrel-site-worktrees/v0.1`:

```bash
# 1. Regenerate the deployed artifact from content.json + build.mjs
node build.mjs
# expect: "wrote index.html (… bytes, 8 sections)"

# 2. Commit on the release branch
git add content.json build.mjs index.html
git commit -m "v0.1 Front Door: honest front door, prominent self-review, Vercel Analytics"
# (branch is already release/v0.1)

# 3. Deploy to production
vercel deploy --prod --yes --scope dablclub

# 4. Verify with /browse: load https://aisa-devrel-site.vercel.app
#    - HTTP 200
#    - zero console errors / warnings
#    - /_vercel/insights/script.js loads (analytics firing)
#    - hero "Read the honest review" CTA scrolls to the #honesty section
#    - no inflated number renders as the site's own claim
```

Use the gstack `/browse` skill for the check (never claude-in-chrome). Confirm: page returns 200, DevTools console is clean, the Vercel Analytics script request is present, the honest self-review section is reachable from the primary CTA, and headline numbers are the honest set (`~650` / `9` / `41` / `0` named builders).

## Done / handoff

When all boxes are checked and Deploy + verify is green, write back to `handoff/README.md`:

- Set **Last updated** to the ship date and mark **v0.1 Front Door: DONE** in the pickup queue.
- Record under a short "v0.1 verified" note: production URL returns 200, console clean, Vercel Analytics live (script injected in `build.mjs`, Analytics enabled on the `dablclub` project), self-review (`#honesty`) reachable from the primary hero CTA, and the inflated-claim guard passing (no unquoted "1000+ LLMs" / "5,000+ agents").
- Move the pickup queue on: mark "Deploy verify" complete, keep "Wire Git auto-deploy" open, and point the next agent at **v0.2 Golden Path** (`releases/v0.2/PLAN.md`, worktree `/Users/colin/Code/aisa-devrel-site-worktrees/v0.2`), noting that the funnel instrumentation from v0.1 is the data source its time-to-first-call dashboard depends on.
- Note the deployed commit SHA on `release/v0.1` and the production deployment URL for traceability.
