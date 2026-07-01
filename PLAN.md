# v1.3 — The Moat Goes Public (PLAN)

**Status:** NOT STARTED · **HARD-GATED** — do not start, commit, or deploy until AISA M2M payments (x402 + Circle Nanopayments) reach **self-serve GA**. Until the gate clears, every content change below must keep saying payments are Private Beta / not-GA. This plan flips that framing; running it early publishes a false claim on the live proposal site.

## Goal
Publish the payments moat now that x402 is GA: turn the site's "payments are Private Beta, sequenced last, moat goes public later" framing into "autonomous machine payments are live," add a dedicated x402 / Circle Nanopayments section and a prediction-market arbitrage capstone as the flagship demo, and switch north-star reporting on the scoreboard to payment-weighted.

This is a copy/data edit of the published microsite (`content.json` → `node build.mjs` → `index.html`), not a change to the AISA product.

## Ships

- [ ] **Add x402 / HTTP-402 payments section + Circle Nanopayments free-to-paid explainer**
  - Add a new section object to `content.json` `sections[]` with `id: "payments"` (kicker e.g. `THE PAYMENTS MOAT`, heading e.g. "Autonomous settlement is live"), a `body_md` that states x402 / HTTP-402 + Circle Nanopayments are GA and describes the free-to-paid path (free tier → first paid per-call settlement, no human in the loop), plus a `stats[]` block (e.g. GA status, per-call settlement, free-to-paid) and 3-4 `cards[]` (how x402 402-challenge/pay/retry works, Circle Nanopayments rails, free→paid conversion, no-vendor-account lock-in).
  - Register the section in `content.json` `plan.section_order` (insert `"payments"` after `"wedge"` so the moat leads before field notes) and add the matching nav pair `["payments", "Payments"]` to the `navItems` array in `build.mjs` (line ~52-54) so the sidebar link and scroll-spy pick it up.
  - Flip every "Private Beta / not-GA / sequenced-last / later, on purpose" payments claim to GA across existing content: `content.json` line 153 (wedge `body_md` "The honest caveat up front… Private Beta… goes public later, on purpose"), line 168 (MOAT 03 card "It is Private Beta today, which is why payments GTM is sequenced last"), line 205 & 591 (comparison + SWOT table cell `x402 / Circle / MPP (Private Beta)`), lines 245-247 (honesty stat `Not GA` / `MPP in private beta, payment-weighting waits`), line 545 ("Once M2M payments hit GA… only once it is near-GA"). Each becomes a live/GA statement; keep the honest voice (state what shipped, not hype).

- [ ] **Feature the prediction-market arbitrage capstone (Polymarket + Kalshi + payments)**
  - Add the capstone as content: either a `cards[]` entry in the new `payments` section or a dedicated card block, describing the flagship demo — an agent that reads a model route + Polymarket + Kalshi + Financial data, spots a cross-venue price gap, and settles autonomously via x402 (one key, one wallet). Reference the endpoints already named in `content.json` (Polymarket, Kalshi, Financial) so it stays consistent with the wedge/SWOT copy.
  - Update the v1.3 rung in `plan.site_releases` (`content.json` lines 84-93) and the v1.3 program card (line 296) / roadmap row (lines 402-407) so the capstone reads as shipped/reproducible rather than planned (roadmap exit gate line 406 already says "capstone reproducible by an outside builder" — align tense to "live").
  - Make the capstone the hero proof point: consider swapping one hero CTA in `plan.hero.ctas` (`content.json` lines 12-16) to point at the payments/capstone section, and confirm the CTA anchor logic in `build.mjs` (line 93, which currently hardcodes `#setup` / `#roadmap`) still resolves — if a new anchor is needed, extend that line rather than leaving a dead `#` link.

- [ ] **Switch north-star reporting to payment-weighted on the scoreboard**
  - Change the north-star string from "payment-weighted **once x402 is GA**" to "payment-weighted" (active/on) in all four copies: `content.json` line 18 (`plan.north_star`), line 96 (top-level `north_star`), and inline in the `metrics` (line 434) and other section bodies that repeat it (setup line 102, wedge line 153, programs line 261, roadmap line 357, engagement line 611). The hero north-star banner renders from `plan.north_star` (build.mjs line 95), so line 18 is the load-bearing one.
  - Update the `metrics` section (`content.json` lines 430-484): flip the `stats` weighting entry (lines 442-444 `applied once x402 / M2M is GA` → applied/on) and the north-star `body_md` so payment-weighting is described as live in the scoreboard.
  - Update the v1.3 roadmap KPI/exit-gate (lines 405-406) and program signal (line 296) so "payment-weighting switches on… here, not before" reads as switched on now; keep the definition unchanged (model route + ≥1 data-API family, now weighted by payment).

## Depends on / Unblocks
- **Depends on (HARD GATE):** AISA M2M payments (x402 + Circle Nanopayments) at self-serve GA. Also depends on v1.0 "Community & Launch Moment" being live (this is the next rung after it). Verify GA before touching content — the whole release is a truth claim.
- **Unblocks:** v2.0 "Self-Sustaining Program" (Foundry GA, ambassador program, two-sided capability catalog) — the payments moat being public is the setup for v2.0, per the v1.3 program card (`content.json` line 296).

## Start here (first 3 tasks)
1. **Confirm the gate.** Verify x402 + Circle Nanopayments are self-serve GA (not private beta). If not GA, STOP — do not edit content. Record the check.
2. **Enter the worktree** at `/Users/colin/Code/aisa-devrel-site-worktrees/v1.3` (already on branch `release/v1.3`, clean). Confirm `git branch --show-current` = `release/v1.3` before editing.
3. **Flip the north-star string first** (`content.json` line 18 `plan.north_star`), run `node build.mjs`, and eyeball the hero banner in `index.html` — this is the smallest change that proves the edit→build loop works before the larger section/section_order edits.

## Deploy + verify
Run from the worktree root `/Users/colin/Code/aisa-devrel-site-worktrees/v1.3`:

```bash
# 1. Regenerate the deployed artifact from content.json
node build.mjs
# expect: "wrote index.html (… bytes, N sections)" with N increased by 1 (new payments section)

# 2. Commit on the release branch (already release/v1.3)
git add content.json build.mjs index.html handoff/README.md
git commit -m "v1.3 The Moat Goes Public: x402/Circle payments section, prediction-market arb capstone, payment-weighted north star

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"

# 3. Deploy to production
vercel deploy --prod --yes --scope dablclub
```

Then verify with the `/browse` skill against the production URL `https://aisa-devrel-site.vercel.app`:
- HTTP 200 on the page.
- No console errors.
- The new `#payments` section renders and its sidebar nav link scrolls to it (scroll-spy `active` state works).
- Hero north-star banner reads payment-weighted (no "once x402 is GA").
- No remaining "Private Beta" / "not GA" / "sequenced last" payments copy anywhere on the page (spot-check wedge, field notes, SWOT, roadmap, metrics).
- Prediction-market arb capstone (Polymarket + Kalshi + payments) is visible.

## Done / handoff
Write back to `handoff/README.md`:
- Bump **Last updated** to the ship date.
- In **Pickup queue**, mark v1.3 shipped and set the next rung to v2.0 "Self-Sustaining Program."
- Add a **Decisions (don't re-litigate)** line: payments moat is now public — x402 + Circle Nanopayments stated as GA, north star is payment-weighted (active), prediction-market arb capstone is the flagship demo. Gate that blocked this (M2M self-serve GA) is cleared as of ship date.
- Note the new `sections[]` `id: "payments"` and its position in `plan.section_order`, plus the added `navItems` entry in `build.mjs`, so future edits know the section exists.
- Confirm the production deploy URL and the `/browse` verification result (HTTP 200, no console errors).
