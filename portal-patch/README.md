# EduConnect System Admin portal

Internal operations console for EduConnect platform administrators. React 19 + Vite 8, React Router and Tailwind CSS 4. It talks to the EduConnect backend's System Admin API; it has no public pages and is served `noindex`.

## Run locally

Use Node.js 22.12 or newer:

```sh
npm ci
npm run dev
```

```sh
npm run lint
npm test
npm run build
npm run preview
```

## Configuration

Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to the backend origin (HTTPS, no `/api` or `/api/system-admin`). Deployed builds require it and never fall back to staging; without it the portal shows an "not configured" message and sends no requests. Only local development defaults to staging. Never put credentials in `VITE_` variables.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Redirects to `/super-admin` |
| `/super-admin` | Overview with backend KPIs and school-status totals |
| `/super-admin/schools` | Paginated schools and lifecycle actions |
| `/super-admin/schools/:schoolId` | School detail, staff and subscription |
| `/super-admin/users` | Users and account access controls |
| `/super-admin/admins` | Admin listing and reviewed email drafts |
| `/super-admin/operations` | School selection and school operations |
| `/super-admin/imports` | CSV validation and explicit import |
| `/super-admin/audit-logs` | Filtered, paginated audit trail |

Hosting needs an SPA fallback to `index.html` (`vercel.json` and `public/_redirects` are included).

See `docs/system-admin-integration.md` for the backend contract, session handling and known limitations.

## Project status

Live System Admin login and mutations have not been verified against a running backend. Nothing here changes data until a System Admin signs in.

### Built

| Area | What works |
| --- | --- |
| Session | Sign in, token refresh, logout, automatic sign-out on expiry |
| Overview | Backend KPIs and recent audit entries (never filled with sample data) |
| Schools | List with status and tier tabs, create (one-time password), detail, activate/deactivate, archive/delete/restore, student and staff lists |
| Users and admins | Search and role filter, activate/deactivate, removal with a reason, local email drafts |
| Imports | CSV templates, mandatory dry run, then one-shot submit (5 MB file guard) |
| Audit logs | Filters by school, action and actor, with pagination |
| School operations | Subscription tier and status edits through `PUT /schools/:schoolId/config` |

### Pending: needs a backend contract first

The portal only calls endpoints that exist on the backend. These features are not built until the backend confirms a System Admin endpoint for each, with the method, path, request body, response shape and error codes.

| Feature | Backend needs to provide |
| --- | --- |
| Classes and arms | System Admin list and edit endpoints |
| Subjects | System Admin list and edit endpoints |
| Finance | System Admin endpoints |
| Attendance | System Admin endpoints |
| Report cards | System Admin endpoints |
| Timetable | System Admin endpoints |
| Events | System Admin endpoints |
| Platform email | A send endpoint and delivery status (today the portal only opens the user's own email app) |
| In-app notifications | A notifications endpoint |
| Subscription changes | Confirmation of versioning and transaction behavior for config edits |
| NexaPay | Out of scope and not connected |

### Backend mismatches (worked around in the portal)

1. **School search:** the schools controller does not pass `search` to its service, so search only filters the page already loaded.
2. **User filters:** the users controller passes `status` and `schoolId`, but the service expects `isActive` and `schoolIds`. These filters are hidden in the UI. Search and role work.
3. **Pagination:** the outer pagination in the schools and users controllers uses an undefined `total`. The portal reads `data.pagination` instead.
4. **Archived and deleted schools:** a school that is both archived and deleted only appears under `all`.
5. **Overview data:** cached by the backend for 5 minutes, and "activity" counts operations, not unique users.
6. **Refresh cookie:** login does not return a refresh token, so staying signed in across page reloads is not verified.

### Questions for the backend team

1. Which System Admin endpoints exist for classes, subjects, finance, attendance, report cards, timetable and events?
2. Is there an endpoint for platform email or notifications?
3. Can the six mismatches above be fixed on the backend?
4. What is the approved production API origin for `VITE_API_BASE_URL`?
