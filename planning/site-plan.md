# AISA DevRel Microsite — Publication Plan

*Decided by the `aisa-devrel-site-build` workflow (PM council → Head-of-DevRel synthesizer). Raw output: [site-council-raw-output.json](site-council-raw-output.json). Copy lives in [../content.json](../content.json).*

## Hero
- **Kicker:** DevRel proposal · v1 · outside-in
- **Headline:** "One key. One wallet. Everything an agent needs."
- **North star:** Weekly Active Agents making multi-capability calls (a model route + ≥1 data-API family in the same period), payment-weighted once x402 is GA. Not signups, not followers.

## Site publication ladder (v0.1 → v2.0)
Each version is a cut of the *published microsite* — not the DevRel program itself (that ladder lives in the sibling `aisa` repo's `planning/release-roadmap.md`).

| Version | Name | Goal | Ships |
|---|---|---|---|
| v0.1 | Front Door | Stop losing visitors at the door: honest, working landing a builder trusts in 60s | Unbreak `/models`; kill inflated claims (one honest number); candid self-review page; instrument the funnel |
| v0.2 | Golden Path | First real API call in < 5 min, framework- + agent-native | One-prompt onboarding (llms.txt/.md/A2A); OpenAI-compatible base_url quickstart; 4 framework quickstarts; time-to-first-call dashboard |
| v0.3 | The Wedge Aha | Show what OpenRouter/Vercel can't: capabilities beyond tokens, one flow | 10-min GTM-agent tutorial (model + Apollo + DataForSEO); 3 vertical sample apps; capability catalog; first named public builders |
| v0.5 | Distribution Flywheel | Make AISA the default install + the answer search returns | TS + Python SDKs; framework plugins; SEO/comparison cluster; installable skills gallery |
| v1.0 | Community & Launch Moment | Turn scattered users into a visible, self-referring community | Discord plumbing + showcase; coordinated launch via dabl.club; public WAA scoreboard |
| v1.3 | The Moat Goes Public | Ship the wedge no gateway can copy: autonomous machine payments, live | x402/HTTP-402 GA + Circle Nanopayments; prediction-market arb capstone; payment-weighted north-star reporting |

> v2.0 = the terminal state: the full interactive proposal + all of the above shipped and self-sustaining.

## Section order (v0.1 of the site)
`setup → wedge → honesty (field notes) → programs (initiatives) → roadmap → metrics → swot → engagement → ladder (publish)`

## Notes / known workflow issues
- In the council phase, 2 of 3 PM persona agents hit the StructuredOutput retry cap and one returned a stub; the synthesizer (chair) still produced a usable plan. If re-running, simplify the persona schema (the `site_releases` nested array likely tripped the validator) — the section-writer phase (flat schema) succeeded 8/8.
