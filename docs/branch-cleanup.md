# Branch cleanup review

Reviewed `feature/homepage-lab-migration` after branding commit `b15cad3`. Changes remain on that feature branch for review, with no production merge or domain changes.

## What was removed and why

| Area | Evidence and change |
| --- | --- |
| Duplicate landing page code | Traced static and lazy imports from `src/main.jsx`; the old Header, Footer, consultation trigger, scrolling demo, icon barrel, and old content lists were unreachable. Removed them. |
| Broken auth/API remnants | Removed unused ProtectedRoute and modal helpers importing absent AuthContext/auth pages, the unused Axios client for an old backend URL, and the dormant theme initializer. None was part of a current route. This does not remove working application authentication; that integration is not present in this preview. |
| Unused UI scaffolding | Removed unreachable `src/components/ui`, its utilities, and obsolete Shadcn generator configuration. The Super Admin implementation does not consume this scaffold. |
| Image barrel and old assets | The legal page now imports its single CTA image directly. Removed the image barrel and unreferenced prior images/icons, starter SVG, and old public logo. Kept the current hero/student images, legal CTA photo, primary logo, and white logo variant. |
| Duplicate primary logo | All active logo references now use `public/brand/educonnect-logo.png`, including Super Admin. Removed the identical second copy to prevent branding drift. |
| Unused dependencies | Removed `@radix-ui/react-slot`, `aos`, `class-variance-authority`, `tailwind-merge`, and `tw-animate-css`, then regenerated and clean-installed the lockfile. Every remaining runtime import maps to a declared dependency. |
| Styling remnants | Removed unused old landing-page backgrounds, undefined Shadcn color/radius aliases overriding Tailwind defaults, and the unused Outfit request. Preserved Inter. Removed 107 unreachable or identical duplicate marketing CSS rules and trimmed five selector lists, keeping retained rules in order. Namespaced the loading spinner animation. Public rounded-xl sizing remains explicitly defined; Admin utilities now use Tailwind's own default tokens instead of undefined aliases. |
| Dead preview variants | The homepage only uses the embedded dashboard preview. Removed its unused full-workspace/sidebar variant and hidden duplicate notices/stat icons; retained all four product panels and their sample data. |
| Dead pricing helpers | Removed the unused MobileComparisonSection/MobileComparisonRow implementation. Preserved the live mobile plan selector, all pricing data, and FAQs. |
| Documentation | Replaced the stale root README with the current routes, commands, branding source, and integration limits. Removed the unrelated README under `src/Mds` that documented absent full-product dashboards and dependencies. |

74 previously tracked files were deleted, including 28 JavaScript modules. Deleted file payloads total approximately 14.05 MiB. The complete pre-cleanup checkout was archived separately, and the prior implementation remains recoverable from Git history.

## What was preserved

- Homepage section order, images, product panels, forms, menus, FAQs, scroll reveals, and responsive/reduced-motion rules used by the active design.
- Pricing content, prices, plan comparison, controls, and FAQ answers.
- All five policy/pricing Markdown files in `src/Mds`, byte-for-byte, including the cookie policy and pricing source material not currently used by a route.
- Existing contact-provider endpoint, form payload, and meeting configuration. No real enquiry, email, or booking was submitted for this review.
- Super Admin routes, navigation, sample records, badges, local search, and placeholders. Changes there are limited to removing unused imports and pointing the logo at the canonical asset.
- Vite/React architecture, route paths, local alias, SPA hosting rewrites, and deployment protection requirements.
- The white logo variant is retained as useful current branding material even though no active component consumes it.

## Defensive fixes found during review

- Malformed percent-encoded URL fragments no longer throw while resolving a section link.
- Legal-document lookup checks own keys, so `/legal-documents/constructor` and `/legal-documents/__proto__` show the normal document-not-found fallback instead of accessing Object prototype members and crashing.

## Verification

- Static/lazy-import graph: 31 reachable JavaScript modules; no unreachable source modules or broken local imports remain. No dynamic glob/require loader exists that would invalidate this graph.
- Clean offline `npm ci --ignore-scripts --no-audit`: passed using the lockfile.
- `npm run lint`: passed for the entire repository, zero errors/warnings. The previous 12 failures were in deleted remnants or unused code removed during cleanup.
- `npm test`: all four enquiry tests passed.
- `npm run test:routes`: all 16 streamed React-rendering smoke checks passed, covering every current route, legal fallbacks, homepage sections/product panels/FAQs, prices, contact fields, and Super Admin sample records/search/navigation markup.
- `npm run build`: passed after the clean install; the asset barrel no longer emits the old image library. Only the active CTA image is imported from `src/assets/images`.
- `git diff --check`: passed. Policy/pricing Markdown content has no diff.

Post-cleanup browser visual and interaction verification could not be completed: the browser service stopped responding, including its reset endpoint. The smoke checks render the actual React routes but do not simulate a browser, keyboard interaction, responsive CSS layout, or third-party form submission. Earlier pre-cleanup interactive/visual checks remain documented in the migration history; they must not be represented as post-cleanup verification. The protected preview should receive a visual review before merging.
