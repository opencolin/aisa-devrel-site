# v1.0 — Community & Launch Moment (PLAN)

**Status:** Not started · **Gate:** v0.5 (Distribution Flywheel) shipped and live before starting — this release assumes SDKs/skills gallery exist to point the community and launch at. Do not deploy the launch page until the Discord invite and showcase are live (they are the destinations the launch drives traffic to).

## Goal

Community + coordinated launch surfaces. Add real community plumbing (Discord CTA + public builder showcase), a public Weekly-Active-Agents scoreboard the site actually reports, and a launch page prepped for a single coordinated moment (Show HN / Product Hunt / X) amplified through dabl.club (~86k devs). No vanity counters — every number on the page must be a real, sourced figure or clearly marked as a target/placeholder.

Editing model reminder: content lives in `content.json` (`sections[]` objects with `id`, `kicker`, `heading`, `body_md`, optional `stats[]` / `cards[]` / `table[][]`); ordering lives in `content.json` → `plan.section_order`; nav + design live in `build.mjs`. After any content or design change: `node build.mjs` regenerates `index.html`. Never hand-edit `index.html`.

## Ships

- [ ] **Add community section: Discord CTA + public builder showcase**
  - Add a new section object to `content.json` `sections[]` with `"id": "community"`, `kicker` "Community", `heading` (e.g. "Where builders show up"), and `body_md` covering the Discord support loop + why the showcase is tied to the north star. Add `"community"` to `plan.section_order` (place it after `"engagement"`, before the ladder).
  - Model the builder showcase as a `cards` array on the community section — one card per public builder (`{ "label": vertical/use-case, "title": builder or app name, "detail": what they built with AISA capabilities + a link via markdown `[text](url)` }). Seed with the real named builders introduced in v0.3 (`grep -n "public builder" content.json` to find them); do not invent names.
  - Wire the Discord CTA: add a real invite URL to `content.json` `links` (e.g. `"discord"`) and render it. Either add it to the `.side-foot` block in `build.mjs` (alongside the GitHub/aisa.one links) and/or as a primary `btn` inside the community section. Add `["community","Community"]` to the `navItems` array in `build.mjs` so it appears in the sidebar. Confirm the existing IntersectionObserver active-nav logic already covers any `section[id]` (it does — no JS change needed).

- [ ] **Add a public Weekly-Active-Agents scoreboard widget/section**
  - Add a `"scoreboard"` section object to `content.json` `sections[]` (or extend the existing `metrics` section) that reports WAA as the headline number, using the existing `stats[]` shape (`{ value, label, sub }`). Reuse the north-star definition already in `content.json` (`plan.north_star`): "model route + ≥1 data-API family in the same period." Add `"scoreboard"` to `plan.section_order` (adjacent to `metrics`) and to `navItems` in `build.mjs` if standalone.
  - Populate with real figures only. If live WAA data is not yet pipeable into a static build, use a single honest current number plus a dated `sub` label (e.g. "as of <week>"), and add a short `body_md` note stating cadence + source. No fabricated growth curves, no "1000+"-style claims (consistent with the honesty-is-the-trust-engine decision in `handoff/README.md`).
  - If a richer visual is wanted, extend `build.mjs` with a small CSS-only bar/rung treatment (reuse `.stat` / `.ladder` patterns and existing CSS vars `--acc`, `--panel`; keep it zero-dependency, no external scripts — matches the security-header / no-framework posture in `vercel.json`).

- [ ] **Prep a launch page (Show HN / Product Hunt / X) amplified via dabl.club (~86k devs)**
  - Add a `"launch"` section object to `content.json` `sections[]` with the coordinated-moment narrative in `body_md` and a `cards` array (one card per channel: Show HN, Product Hunt, X/Twitter thread, dabl.club broadcast) each with the exact asset/link and the one-line hook. Add `"launch"` to `plan.section_order` and `navItems`.
  - Capture the copy assets in `content.json` so they live with the site: HN title + first comment, PH tagline + gallery caption, the X thread hook, and the dabl.club post. Use markdown links for all destinations (Discord invite, quickstart, showcase). Keep the ~86k figure attributed (it is the author's community, cited in the existing footer in `build.mjs`).
  - Ensure the launch page's CTAs point at the two surfaces shipped above (Discord invite + builder showcase) and the v0.5 quickstart/skills gallery — verify those anchors (`#community`, `#scoreboard`, plus any deep links) resolve after `node build.mjs`.

## Depends on / Unblocks

**Depends on:**
- v0.5 (Distribution Flywheel) live — SDKs, framework plugins, and the skills gallery are what the launch drives builders toward.
- A real Discord server + non-expiring invite URL (external prerequisite; blocks the community ship).
- A real, current WAA number (or an explicit dated placeholder) — blocks the scoreboard ship's credibility.
- dabl.club broadcast slot / access to publish to the ~86k channel (external prerequisite; blocks the launch execution, not the page prep).

**Unblocks:**
- v1.3 (The Moat Goes Public) — payment-weighted north-star reporting extends this release's scoreboard; x402 GA launch reuses the launch-page scaffolding.
- Ongoing: the community + scoreboard surfaces become the recurring update targets for future releases.

## Start here (first 3 tasks)

1. **Branch + build baseline.** In the worktree `/Users/colin/Code/aisa-devrel-site-worktrees/v1.0` confirm you are on `release/v1.0` (`git branch --show-current`), run `node build.mjs` once to confirm a clean baseline `index.html`, and commit nothing yet.
2. **Ship the community section.** Add the `"community"` section object to `content.json`, add the Discord invite to `links`, wire `navItems` + `.side-foot` in `build.mjs`, add `"community"` to `plan.section_order`, then `node build.mjs`. This is the highest-value, lowest-risk surface and the destination the other two ships point at.
3. **Ship the scoreboard.** Add the `"scoreboard"` section (or extend `metrics`) with the real WAA `stat`, reusing `plan.north_star`; add to `section_order` + `navItems`; `node build.mjs`. Land community + scoreboard before touching the launch page, since the launch page links to both.

## Deploy + verify

Run from the worktree root `/Users/colin/Code/aisa-devrel-site-worktrees/v1.0`:

```bash
# 1. Regenerate the deployed artifact from content.json
node build.mjs
# expect: "wrote index.html (<bytes>, <N> sections)" with N increased by the new sections

# 2. Commit on the release branch
git add content.json build.mjs index.html
git commit -m "v1.0: community section, WAA scoreboard, launch page"
# (branch is already release/v1.0)

# 3. Deploy to production
vercel deploy --prod --yes --scope dablclub
```

Then verify with the `/browse` skill against the production URL:
- `https://aisa-devrel-site.vercel.app` returns **HTTP 200**.
- **No console errors** on load.
- New sidebar nav entries (Community, Scoreboard, Launch) render and their in-page anchors scroll to the right sections.
- Discord CTA link resolves to the real invite; showcase card links and launch-channel links all resolve (no `#` dead links).
- Active-nav highlighting still works while scrolling (IntersectionObserver covers the new `section[id]`s).
- Spot-check mobile (≤860px): sidebar collapses to the horizontal nav and the new sections/cards reflow (existing `@media(max-width:860px)` rules).

## Done / handoff

Write back to `handoff/README.md`:
- Move v1.0 items out of the **Pickup queue** and record v1.0 as shipped + the production deploy timestamp.
- Add the **Discord invite URL** and the **WAA source/cadence** under a short "Community & metrics" note so future releases know where the numbers come from and how often to refresh the scoreboard.
- Record the **launch assets location** (they live in `content.json` under the `launch` section) and, once the coordinated moment runs, the actual outcome (channels posted, date) — real results only, no vanity metrics.
- Note the new section ids (`community`, `scoreboard`, `launch`) added to `plan.section_order` and `navItems`, so v1.3 knows the current section inventory.
- Point the next release (v1.3) at the scoreboard as the surface to extend with payment-weighted WAA, and at the launch section as reusable scaffolding for the x402-GA moment.