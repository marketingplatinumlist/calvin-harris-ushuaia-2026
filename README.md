# Calvin Harris · Ushuaïa Ibiza 2026 — landing page

Static landing page rebuilt from the Nano Banana mockups (Slack thread, #marketing, 31 Jul 2026).
Built for the A/B test against `ibiza-tickets.co/calvin-harris`.

## Stack
Plain HTML + CSS + vanilla JS. No build step, no dependencies. Deploys as static output.

## Files
```
index.html    all 15 sections
styles.css    design tokens + components
script.js     dates render, currency switch, rail progress, FAQ, reveal
assets/       SVG PLACEHOLDERS — swap for real imagery
```

## Sections
1. Hero (CSS-generated burst) · 2. Pick your night (27 dates) · 3. Your ticket (3 tiers)
4. The line-up (h-rail) · 5. Why this night · 6. Last season (video) · 7. From the floor (UGC)
8. What people say · 9. At a glance · 10. Before you go · 11. Getting there · 12. Questions (FAQ)
13. Also at Ushuaïa · 14. Final CTA · 15. Footer + mobile sticky CTA

## Placeholders to replace
| What | Where |
|---|---|
| All imagery (32 SVGs) | `assets/` — keep filenames, swap to `.jpg`/`.webp` and update `src` |
| Hero burst | CSS `.hero__burst` — replace with real key art if art direction prefers |
| Aftermovie | `script.js` §7 — drop in YouTube/Vimeo embed |
| Dates / prices / line-up | `script.js` §1 — currently hardcoded from mockups |
| Currency rates | `script.js` §5 — display-only placeholder rates |
| Reviews | `index.html` reviews section — hardcoded from mockups |

## Data
Nothing here is live. Next step is wiring §1 to the Platinumlist API for event `106871`
(ibiza.platinumlist.net) so dates, prices and availability come from production.
