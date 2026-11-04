# Verification and screenshot checklist

Current live portal: [LAB09](https://dev431102.service-now.com/gako_lab09?id=gako_lab09_home). Submission set: `82b45c2e2f5453108b2f298a6fa4e34c`, **46 Customer Updates**, Complete.

## Repeat checks

1. `npm run build` and `npm run verify:local` check compiled Fluent relationships, the current original logo, native references, SCSS/scripts, search encoding and knowledge visibility.
2. `npm run audit:deployed` queries real portal/page/container/row/column/instance records and compares the protected default portals with preflight.
3. With the authenticated `midnight-live` QA browser session, run `scripts/check-deployed.ps1` for live layout and controls. `scripts/connect-live-browser.mjs` can refresh that browser from the saved SDK session without printing or persisting credentials.
4. `node scripts/audit-submission.mjs 82b45c2e2f5453108b2f298a6fa4e34c` checks captured records, application scope, logo bytes and retired-property deletions.
5. `node scripts/verify-export.mjs` compares the supplied native XML with all audited payloads. No deployment is needed to repeat local/export checks.

Do not rerun mutation helpers merely to verify. The current source is in the dedicated scope; default portals and native widget definitions are excluded from changes.

## Screenshot checklist

- [x] [Desktop full page, 1440 × 1000 viewport](../submission/portal-homepage.png): logo/navigation, search, announcements, catalog, knowledge, requests and help.
- [x] [Mobile full page, 390 × 844 viewport](../submission/portal-mobile.png): stacked sections, collapsed navigation and readable controls.
- [x] Tablet, 720px reflow and 320px narrow-phone widths checked for overflow and mounted instances.
- [x] Normal final state, loaded logo, no spinners/errors, collapsed FAQ and no hover tooltip.
- [x] Actual request list filtered through native search for public evidence. No rows were fabricated.
- [x] Native search, eligible catalog form and knowledge article checked without submitting an order.
- [x] Native open/closed filters, search, one embedded requests widget, mobile menu, keyboard FAQ and reduced motion checked.
- [x] [Record evidence](instance/deployed.json), [live DOM checks](validation/deployed-browser.json), [source inventory](RECORDS.md) and [Update Set audit](validation/submission.json).
- [x] [Completed workbook](../submission/Student%20Output%20Template%20(Gako).xlsx) preserves the provided header and includes the full-page screenshot.
- [ ] Actual 200% browser zoom, non-admin eligibility and second-instance import/preview/commit were not separately tested.

The supplied files represent the current sleek service portal. The public repository excludes earlier designs, original movie assets, credentials and unrelated request screenshots.
