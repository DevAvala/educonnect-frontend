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
| `/` | Public homepage, feature tabs, FAQs, and email-draft enquiry |
| `/pricing` | Plans, feature comparison, mobile plan selector, and pricing FAQs |
| `/contact` | Existing contact enquiry and meeting calendar |
| `/legal-documents` | Privacy Policy by default |
| `/legal-documents/privacy-policy` | Privacy Policy |
| `/legal-documents/terms-of-service` | Terms of Service |
| `/legal-documents/information-security` | Information Security Policy |
| `/super-admin` | Dashboard with sample data and working local school search |
| `/super-admin/schools` | Existing Schools shell |
| `/super-admin/users` | Existing Users shell |
| `/super-admin/imports` | Existing Imports shell |
| `/super-admin/audit-logs` | Existing Audit Logs shell |

Public components live in `src/components/marketing`, content in `src/content/marketing`, and styles in `src/styles`. Super Admin components and pages remain separate. `src/index.css` contains Tailwind setup and the shared brand color.

## Branding and retained content

All active logo references, including Super Admin and the favicon, use the same primary asset: `public/brand/educonnect-logo.png`. Replace that file to update the primary logo consistently. A separate white brand variant is retained in `src/assets/branding` for future use.

Legal and pricing source documents live in `src/Mds`. The cookie policy and pricing Markdown are retained as source material even where a current route does not consume them. Do not remove or silently rewrite legal content.

## Existing external services

- Homepage enquiries prepare a `mailto:` draft for the visitor to review and send.
- Contact enquiries retain the existing Web3Forms submission endpoint and payload.
- The existing NeetoCal meeting embed loads only on the contact page.
- Footer social links retain their existing destinations and open in a new tab.

No school backend API or application authentication is connected in this branch. The Super Admin UI contains sample records and placeholders; it is not an authenticated production admin product. Keep this branch behind Vercel Deployment Protection. Do not publish it to an official production domain or remove protection as part of routine frontend work.

## Maintenance

The former landing-page components, unused UI scaffolding, broken auth/API helpers, and unreferenced old assets have been removed. Use the current public layout rather than restoring a second Header/Footer implementation. Keep responsive and reduced-motion rules when editing styles.

See `docs/homepage-lab-migration.md` for the migration history and `docs/branch-cleanup.md` for cleanup evidence and verification.
