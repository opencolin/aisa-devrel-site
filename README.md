# AISA · DevRel Strategy (microsite)

An outside-in Developer Relations strategy for **[AISA.one](https://aisa.one)** — the unified capability + payment layer for AI agents — published as a single-page microsite. Modeled on the [tenki-devrel](https://tenki-devrel.vercel.app/) proposal format.

**Live:** https://aisa-devrel-site.vercel.app · **Source of the strategy:** the sibling `aisa` repo (product review, full strategy, SOW, PM-council roadmap).

## What this is
A candid, data-dense DevRel proposal: the setup (real product, no dev brand, broken `/models`), the wedge (capabilities + payments beyond tokens), field notes from dogfooding, the initiatives, the v0.1→v2.0 roadmap, the metrics that matter, a SWOT vs OpenRouter / Vercel AI Gateway, and a fractional engagement/SOW.

**North star:** Weekly Active Agents making multi-capability calls (a model route + ≥1 data-API family in the same period), payment-weighted once x402 is GA.

## How it's built (zero-build static)
- `content.json` — all copy + data (produced by the `aisa-devrel-site-build` PM-council + section-writer workflow).
- `build.mjs` — zero-dependency generator: `node build.mjs` reads `content.json`, writes `index.html` (design system is inline CSS).
- `index.html` — the deployed artifact. No framework, no build step at deploy time → deploys anywhere static.
- `vercel.json` — `cleanUrls`, security header.

### Rebuild
```bash
node build.mjs      # regenerates index.html from content.json
```
Edit copy in `content.json`, or re-run the workflow, then rebuild.

## Publishing
- **GitHub:** `opencolin/aisa-devrel-site`
- **Vercel:** static deploy (`vercel --prod`), served by `colinlowenberg`.

## Handoff & planning
- `handoff/README.md` — state + pickup queue.
- `planning/site-plan.md` — hero, north star, and the site publication ladder (v0.1→v2.0).
- `releases/<version>/PLAN.md` — per-release execution plans (also git worktrees on `release/<version>`).
