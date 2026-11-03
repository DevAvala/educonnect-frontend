# Homepage Lab migration

## Recovery

- Recovered `/workspace/scratch/8583a90f817e/range-methods` and all unfinished local files from the interrupted session.
- Existing local branch: `feature/homepage-lab-migration`, with a source-snapshot commit `e8b0d1a` and uncommitted components, styles, assets, enquiry helpers, and ESLint configuration repair.
- Local snapshot tree `8bb0e13439d55c20c5ecc2190e2584bd928d81b0` exactly matches remote starting commit `2e84c8908bfaf376cfe195b54ce9ba2cfba2a9b7`.
- Remote migration and starting branches both pointed to that commit at recovery. No migration implementation was pushed. No branch reset, deletion, recreation, or force push was needed.
- Preserved a separate archive of the original recovered checkout before editing.
- Reference: `DevAvala/educonnect-frontend-lab@feat/landing-page-v2`, commit `1ba0ee3e1195db63d96ed11c0d126d59b6ce4580`. Verified all 42 available reference files against the remote Git tree. The reference repository was read only.

## Implementation

- Connected the recovered JSX adaptation to the existing React Router homepage and Vite alias configuration. Kept React + Vite and the existing Inter typography.
- Preserved the reference section order, images, layouts, responsive rules, feature dashboards, tabs, FAQ animation, scroll reveals, final email enquiry, and footer.
- Shared public layout and scoped styles avoid changing the Super Admin UI. Added Pricing to navigation and Contact us to the footer; legal links stay inside this application.
- Restyled pricing while preserving prices, plan features, comparison data, mobile plan controls, and FAQ answers.
- Restyled contact while retaining its existing Web3Forms endpoint, field names, validation, and NeetoCal appointment configuration. Added field labels, accessible errors, persistent success state, retry, and send-another controls. Test submissions were mocked.
- Loaded the existing calendar on the contact page rather than globally initializing a popup whose trigger no longer exists. Added cleanup and a load-error fallback.
- Kept all legal Markdown unchanged. Document selection now follows route changes, browser history, and mobile links. Table-of-contents anchors use the same GitHub slug algorithm as rendered headings. Unknown document IDs show a useful fallback.
- Left `src/App.jsx`, `src/components/super-admin/`, and `src/pages/super-admin/` unchanged. Existing Back to Home resolves to the new homepage.

## Verification

- `npm run build`: passed.
- `npm test`: 4 enquiry tests passed, adapted from the reference tests. Covers invalid input, valid input, size limits, and safe mailto encoding.
- ESLint over every changed/new JS/JSX file: passed.
- `npm run lint`: 12 pre-existing errors remain in old Header/Footer, modals, UI utilities, and NotFoundPage. Original lint config could not run until the flat-config repair; recovered baseline then showed 21 errors. Migration removes old Home failures and accepts uppercase JSX component arguments without modifying Admin files. No lint errors remain in migrated files.
- Browser layout checks: homepage, pricing, contact, all three legal documents, and Super Admin at iframe viewport widths 390, 768, and 1440 px. Also checked homepage at 320 and 1024 px. No page-level horizontal overflow. Super Admin's existing mobile table scrolls within its container.
- Browser interactions: mobile menu open/Escape close, product tab click and End-key navigation, FAQ sibling closing, homepage enquiry validation, pricing mobile plan selection and FAQ expansion, contact required-field errors and mocked successful submission, legal document switching and section anchors, calendar load with available slots, and mobile Super Admin Back to Home.
- Verified existing booking widget renders. Did not create a booking, send a real enquiry, or send an email draft.
- Super Admin route definitions and implementation files and all `src/Mds/` content compare unchanged against the recovered baseline.
- Browser responsive checks used actual fixed-width iframe viewports, not physical phones. Reduced-motion handling was inspected in source; OS-level motion emulation was not available.

## Deliberate differences and limits

- Inter replaces the Lab's Figtree / Source Sans typography as requested, so line wrapping differs slightly.
- Pricing link and local contact/legal routes extend the Lab navigation for existing Range Methods pages.
- Pricing, contact, and legal styling follows the Lab palette, spacing, borders, and component shapes; the Lab has no corresponding standalone reference pages.
- Existing Super Admin preview is not production authentication. Keep the Vercel preview protected and do not promote or merge until approved.
- Preview destination inspected: separate Vite project `educonnect-super-admin-preview`, project `prj_sNhurnHqFqJ84IaCJOiYqV0n7KFK`, team `team_vIl9GyeSVlnf3tGs6gltNQ2U`. Vercel Authentication is enabled for `all_except_custom_domains`. Deployment must target Preview only; leave domains and protection unchanged.

## Later maintenance review

The subsequent branch cleanup removes unused migration-era scaffolding and stale assets, centralizes active branding at `public/brand/educonnect-logo.png`, and resolves the full-repository lint failures. See `branch-cleanup.md` for exact scope, checks, retained source material, and the post-cleanup browser verification limitation. Earlier verification results above describe the initial migration, not the later cleanup.
