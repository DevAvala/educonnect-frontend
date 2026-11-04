# EduConnect public website and Super Admin preview

React 19 + Vite 8 application with React Router and Tailwind CSS 4. The homepage follows the EduConnect Frontend Lab design, using the existing Inter typography.

## Run locally

Use Node.js 22.12 or newer, then:

```sh
npm ci
npm run dev
```

```sh
npm run lint
npm test
npm run test:routes
npm run build
npm run preview
```

`npm run build` writes the deployable application to `dist/`. Vercel's SPA rewrite is declared in `vercel.json`; `public/_redirects` supports the existing alternate static-host flow.

## Routes and implementation

| Route | Purpose |
| --- | --- |
| `/` | Public homepage, feature tabs, FAQs, and Web3Forms enquiry |
| `/pricing` | Plans, feature comparison, mobile plan selector, and pricing FAQs |
| `/contact` | Existing contact enquiry and meeting calendar |
| `/legal-documents` | Privacy Policy by default |
| `/legal-documents/privacy-policy` | Privacy Policy |
| `/legal-documents/terms-of-service` | Terms of Service |
| `/legal-documents/information-security` | Information Security Policy |
| `/super-admin` | Authenticated overview using backend KPIs and school-status totals |
| `/super-admin/schools` | Paginated school list and lifecycle actions |
| `/super-admin/users` | Paginated user list and account access controls |
| `/super-admin/admins` | Admin listing and reviewed email drafts |
| `/super-admin/operations` | School selection and existing school operations |
| `/super-admin/imports` | CSV validation and explicit import submission |
| `/super-admin/audit-logs` | Filtered, paginated audit trail |

Public components live in `src/components/marketing`, content in `src/content/marketing`, and styles in `src/styles`. Super Admin components and pages remain separate. `src/index.css` contains Tailwind setup and the shared brand color.

## Branding and retained content

All active logo references, including Super Admin and the favicon, use the same primary asset: `public/brand/educonnect-logo.png`. Replace that file to update the primary logo consistently. A separate white brand variant is retained in `src/assets/branding` for future use.

Legal and pricing source documents live in `src/Mds`. The cookie policy and pricing Markdown are retained as source material even where a current route does not consume them. Do not remove or silently rewrite legal content.

## Existing external services

- Homepage and contact enquiries share the existing Web3Forms submission endpoint and payload.
- Public Log in and Get Started links retain the school application's login and registration URLs.
- The existing NeetoCal meeting embed loads only on the contact page.
- Footer social links retain their existing destinations and open in a new tab.

Super Admin uses the existing backend contracts with in-memory bearer tokens. Its dashboard has no mock records. Homepage product demonstrations and isolated test fixtures intentionally retain examples. Admin email drafts open the operator's email app; platform email and notifications remain pending confirmed backend support. See `docs/system-admin-integration.md` for contract and session limitations. Live authentication and mutations have not been verified in this review.

## Deployment configuration

Set `VITE_API_BASE_URL` to the approved server origin, without `/api` or `/api/system-admin`, for each deployment environment. Deployed builds have no staging fallback. If the value is missing or invalid, public pages still work and Super Admin shows an unavailable message without sending requests. Local Vite development retains the staging default; localhost HTTP is allowed only in development.

Set `VITE_SITE_URL` to the public canonical origin (defaults to `https://educonnect.com.ng`). Indexing requires both `VITE_ALLOW_INDEXING=true` and a production deployment. Vercel supplies `VERCEL_ENV`; other hosts must explicitly set `VITE_DEPLOY_ENV=production`. Defaults and previews stay `noindex`. Admin and unknown routes stay `noindex` even on production. Canonical and social metadata use the retained primary logo and update across public routes. Static HTML contains homepage metadata; this Vite SPA does not provide server-rendered metadata for every route.

Keep the review branch behind Vercel Deployment Protection. Repository code cannot enable project protection; verify it in Vercel before deploying. Production domain and environment changes require separate approval.

## Maintenance

The former landing-page components, unused UI scaffolding, broken auth/API helpers, and unreferenced old assets have been removed. Use the current public layout rather than restoring a second Header/Footer implementation. Keep responsive and reduced-motion rules when editing styles.

See `docs/homepage-lab-migration.md` for the migration history and `docs/branch-cleanup.md` for cleanup evidence and verification.
