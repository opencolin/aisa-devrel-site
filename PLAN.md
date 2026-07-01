# v0.5 — Distribution Flywheel (PLAN)

**Status:** Not started · **Gate:** v0.3 (The Wedge Aha) must be live on prod before starting — v0.5 turns an already-convincing site into a distribution surface; it assumes the wedge/honesty story already reads well. All work happens in worktree `/Users/colin/Code/aisa-devrel-site-worktrees/v0.5` on branch `release/v0.5`.

## Goal

Turn the site into a distribution surface. Today the site *argues* for AISA; after v0.5 it *distributes* AISA: copy-paste install one-liners (TS + Python), honesty-anchored comparison content that ranks for "AISA vs OpenRouter / vs Vercel AI Gateway" searches, a browsable gallery of the 41 installable skills, and the crawler/social plumbing (OG image, meta, `sitemap.xml`, `robots.txt`) that lets search and link unfurls actually find it. Every add must survive the existing rule: **regenerate, never hand-edit `index.html`**.

## Ships

### - [ ] Add SDK section (TS + Python) with install one-liners
- [ ] Add a new `sdk` section object to `content.json` `sections[]` (kicker "Install", heading e.g. "Two lines to first agent call"), with `body_md` framing and a `cards` array of 2 cards (TypeScript, Python). Put the copy-paste one-liners in `body_md`/card `detail` as backtick `code` spans (the `md()` + `inline()` renderer already emits `<code>` — verify multi-line install blocks render acceptably; if a real fenced code block is needed, extend `build.mjs md()` to handle triple-backtick blocks rather than hacking whitespace).
- [ ] Insert `sdk` into `plan.section_order` in `content.json` (place early — right after `setup` or `wedge` so install is above the fold-ish) AND add `["sdk","SDK"]` to the `navItems` whitelist array in `build.mjs` (line ~52) — new section ids do NOT appear in the sidebar nav unless added there.
- [ ] Use the exact package/import names from the AISA product (confirm against `aisa.one` docs / the sibling `aisa` repo before writing — do not invent package names); include one runnable TS snippet and one Python snippet that make a model route call, matching the real SDK surface.

### - [ ] Add comparison pages: vs OpenRouter, vs Vercel AI Gateway (honesty-anchored) for SEO
- [ ] Decide routing: `build.mjs` currently emits a single `index.html`. Extend it to also emit `compare/openrouter.html` and `compare/vercel-ai-gateway.html` (add a `comparisons` array to `content.json` and a loop in `build.mjs` that writes each to its own file with its own `<title>`/meta) — real per-URL pages are required for SEO; in-page anchors will not rank. `cleanUrls:true` in `vercel.json` will serve these at `/compare/openrouter` and `/compare/vercel-ai-gateway`.
- [ ] Author honesty-anchored comparison content in `content.json` reusing the existing SWOT framing: a `table` (feature/capability rows) plus prose that names where OpenRouter / Vercel AI Gateway are genuinely better (model breadth, maturity) and where AISA's wedge wins (capabilities + payments beyond tokens, x402). No vanity claims — this credibility is the ranking asset. Cross-link each comparison page back to `#wedge` and `#swot`.
- [ ] Give each comparison page unique `<title>` + `<meta name="description">` targeting the head term (e.g. "AISA vs OpenRouter — honest comparison for AI agent capability + payment routing"), and add both URLs to `sitemap.xml` (see the OG/meta ship).

### - [ ] Add installable skills gallery (41 skills) with filters
- [ ] Add a `skills` dataset to `content.json` — an array of 41 entries `{name, category, install, blurb}`. Source the real list + install commands from the AISA/product source (do not fabricate 41 names; if fewer are real, ship the real count and label honestly). Add a matching `skills` section object referenced in `plan.section_order` and `navItems` (`["skills","Skills"]`).
- [ ] Render the gallery in `build.mjs`: add a `skillsGallery()` renderer (grid of cards from the `skills` array, each showing name, category tag, and a copyable `install` `code` span). Reuse existing `.card`/`.cards` CSS; add minimal CSS in the `css()` function only if needed.
- [ ] Add client-side category filter: extend the inline `<script>` at the bottom of `build.mjs` with filter buttons (derive categories from the data) that show/hide cards via a `data-category` attribute. Keep it dependency-free (no framework) to preserve zero-build; degrade gracefully with JS off (all cards visible).

### - [ ] Add OG/meta + sitemap.xml + robots.txt for indexability
- [ ] Harden `<head>` in `build.mjs`: the base OG tags exist but add `og:url`, `og:image` (produce a static OG image, commit it e.g. `og.png`, reference absolute URL), `twitter:card`/`twitter:title`/`twitter:description`/`twitter:image`, and a canonical `<link rel="canonical">`. Drive the base URL from a `C.links.site` value added to `content.json` (currently only `links.repo` exists) instead of hardcoding.
- [ ] Make `build.mjs` also emit `sitemap.xml` (listing `/`, `/compare/openrouter`, `/compare/vercel-ai-gateway`, and skills/SDK anchors) and `robots.txt` (allow all + `Sitemap:` line) — add `writeFileSync` calls alongside the `index.html` write so they regenerate with the site and never drift.
- [ ] Verify `vercel.json` serves `sitemap.xml`/`robots.txt`/`og.png` at root with correct content types and that `cleanUrls` doesn't rewrite them; adjust `vercel.json` headers/routes only if a check shows wrong behavior.

## Depends on / Unblocks

- **Depends on:** v0.3 "The Wedge Aha" live on prod (comparison pages and the SDK pitch lean on the wedge story already landing). Real SDK package names + the real skills list from the `aisa` product/repo — blocker for the SDK and skills ships; confirm before writing copy. A committed OG image asset — blocker for the OG/meta ship.
- **Unblocks:** v1.0 "Community & Launch Moment" — the launch moment needs installable one-liners, a skills gallery to show off, and indexable comparison pages to point launch traffic at. v1.3's payment-weighted north-star reporting benefits from the SEO surface built here. Also unblocks any paid/organic acquisition, since links will finally unfurl and pages will be crawlable.

## Start here (first 3 tasks)

1. **Create the worktree + branch.** `git worktree add /Users/colin/Code/aisa-devrel-site-worktrees/v0.5 -b release/v0.5` (from a clone of `opencolin/aisa-devrel-site`), then confirm `node build.mjs` runs clean and reproduces the current `index.html` before changing anything.
2. **Confirm the source-of-truth facts** that block copy: real TS + Python package/import names and the real installable-skills list (names + install commands). Pull from `aisa.one` docs and the sibling `aisa` repo. Nothing gets written into `content.json` until these are verified — invented package names or a fake "41" would poison the honesty positioning the whole site rests on.
3. **Ship the SDK section end to end** (section object in `content.json` → add to `plan.section_order` → add to `navItems` in `build.mjs` → `node build.mjs` → eyeball `index.html`). It is the smallest self-contained ship and proves the "new section" path (section + order + nav) that the skills gallery reuses.

## Deploy + verify

Run from the worktree `/Users/colin/Code/aisa-devrel-site-worktrees/v0.5`:

```bash
# 1. Regenerate all artifacts from content.json (index.html + comparison pages + sitemap.xml + robots.txt)
node build.mjs

# 2. Commit on the release branch
git checkout release/v0.5           # already on it if worktree created with -b
git add content.json build.mjs vercel.json index.html compare sitemap.xml robots.txt og.png
git commit -m "v0.5: distribution flywheel — SDK section, comparison pages, skills gallery, OG/meta+sitemap+robots"

# 3. Deploy to production
vercel deploy --prod --yes --scope dablclub
```

Then verify with `/browse` (never claude-in-chrome):
- Load the production URL → assert **HTTP 200** and **no console errors**.
- Load `/compare/openrouter` and `/compare/vercel-ai-gateway` → each **HTTP 200**, unique `<title>`, renders content.
- Load `/sitemap.xml` and `/robots.txt` → **HTTP 200**, correct content type, sitemap lists the comparison URLs.
- On the home page: confirm the **SDK** and **Skills** nav items appear and scroll to their sections; confirm the skills gallery **category filter** works with JS on and shows all cards with JS off.
- Check the OG unfurl: fetch the page and confirm `og:image`, `og:url`, `twitter:card` resolve to a real committed image (200 on the image URL).

Gate to "done": all of the above pass. If the deploy or any check fails, fix in the worktree, `node build.mjs`, recommit, redeploy — do not hand-edit `index.html` on the server.

## Done / handoff

Write back to `handoff/README.md`:
- Set the **Live URLs** production line to the confirmed Vercel URL and list the new routes: `/compare/openrouter`, `/compare/vercel-ai-gateway`, `/sitemap.xml`, `/robots.txt`.
- Under **Repo map**, note that `build.mjs` now emits multiple files (`index.html`, `compare/*.html`, `sitemap.xml`, `robots.txt`) — reinforce "regenerate, don't hand-edit."
- Under **Decisions (don't re-litigate)**: comparison pages are **honesty-anchored** (name where competitors win) as an SEO/trust asset; SDK one-liners and the skills list use **real** package/skill names only — no fabrication.
- In **Pickup queue**: mark v0.5 shipped, point the next agent at v1.0 "Community & Launch Moment" (`releases/v1.0/PLAN.md`), and flag any deferred items (e.g. if the real skills count differed from 41, or if a proper fenced-code renderer was added to `build.mjs`).
- Update `README.md` "Live" line if still a placeholder, and confirm `planning/site-plan.md` v0.5 ladder row matches what actually shipped.
