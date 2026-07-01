# Site releases — v0.1 → v2.0

Each cut of the published microsite has a git worktree on `release/<version>` (working copy) plus a mirrored `PLAN.md` here on `main` (reading copy).

- Working copy: `/Users/colin/Code/aisa-devrel-site-worktrees/<version>` on `release/<version>`
- Reading copy: `releases/<version>/PLAN.md`

| Version | Name | Gate | PLAN |
|---|---|---|---|
| v0.1 | Front Door | shipped (site live) | [PLAN](v0.1/PLAN.md) |
| v0.2 | Golden Path | after v0.1 | [PLAN](v0.2/PLAN.md) |
| v0.3 | The Wedge Aha | after v0.2 | [PLAN](v0.3/PLAN.md) |
| v0.5 | Distribution Flywheel | after v0.3 | [PLAN](v0.5/PLAN.md) |
| v1.0 | Community & Launch Moment | after v0.5 | [PLAN](v1.0/PLAN.md) |
| v1.3 | The Moat Goes Public | 🔒 x402 GA | [PLAN](v1.3/PLAN.md) |
| v2.0 | Full Interactive Proposal | after v1.3 | [PLAN](v2.0/PLAN.md) |

Rebuild loop: edit `content.json` → `node build.mjs` → commit → deploy (`vercel deploy --prod --yes --scope dablclub`).
