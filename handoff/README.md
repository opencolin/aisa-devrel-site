# AISA DevRel Microsite — Handoff & State

**Last updated:** 2026-07-01
**Purpose:** publish the AISA DevRel strategy as a site on GitHub + Vercel. Any agent can read this and continue.

## TL;DR
Zero-build static microsite generated from `content.json` by `build.mjs`. Published to GitHub (`opencolin/aisa-devrel-site`) and deployed on Vercel. Content came from a PM-council + section-writer workflow. Site release ladder (v0.1→v2.0) has git worktrees + PLANs.

## Live URLs
- **Production (Vercel):** _fill in after deploy_
- **GitHub:** https://github.com/opencolin/aisa-devrel-site

## Repo map
```
content.json                # all copy + data (source of truth for the page)
build.mjs                   # node build.mjs -> index.html (zero deps, inline CSS)
index.html                  # deployed artifact (regenerate; don't hand-edit)
vercel.json                 # cleanUrls + security header
planning/site-plan.md       # hero, north star, publication ladder
planning/site-council-raw-output.json
releases/<version>/PLAN.md   # per-release plans (also worktrees release/<version>)
handoff/README.md           # this file
```

## How to change the site
1. Edit `content.json` (or re-run the `aisa-devrel-site-build` workflow).
2. `node build.mjs`
3. Commit + `vercel --prod` (or push; wire Git integration for auto-deploy).

## Decisions (don't re-litigate)
- **Format:** single-page, dark, data-dense proposal microsite modeled on tenki-devrel.
- **North star:** Weekly Active Agents making multi-capability calls, payment-weighted once x402 GA.
- **Voice:** candid/outside-in; publish the honest review incl. the `/models` P0 bug (honesty = trust engine).
- **Zero-build static** on purpose — bulletproof deploy, no framework risk.

## Pickup queue
1. **Deploy verify:** confirm the Vercel production URL renders (see `releases/v0.1/PLAN.md`).
2. **Wire Git auto-deploy:** connect the GitHub repo to the Vercel project so pushes deploy.
3. **v0.2+ site work:** execute `releases/<version>/PLAN.md` in order (worktrees at `/Users/colin/Code/aisa-devrel-site-worktrees/<version>`).
4. **Custom domain (optional):** e.g. `aisa-devrel.vercel.app` or a subdomain.
