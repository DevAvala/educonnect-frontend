# Super Admin frontend integration

Backend contract inspected: `DevAvala/educonnect-backend`, `dev` commit
`1cfcf857fcb609bdd9d1cf8b3fcce25fbae3cda9`. Source of truth includes
`systemAdminAuthController`, `systemAdminController`, `schoolLifecycleService`,
`platformAuditService`, and `docs/superadmin-god-mode.md`.

## Configuration and access

Open `/super-admin` and sign in with a System Admin account. The frontend uses
`VITE_API_BASE_URL` (server origin without `/api/system-admin`). When omitted,
it targets the previously supplied staging origin:
`https://educonnect-backend-staging.onrender.com`.

The Postman environment in the fork defaults to localhost. Deployment/version
parity with the staging server has not been established. No production API
origin or credentials are embedded in the frontend.

Access tokens stay in module memory. Login/refresh include credentials so they
can use an HttpOnly refresh cookie when the deployed backend issues one.
The inspected backend source does not return a refresh token at login, so
cookie persistence across reloads is not established and may require sign-in. One shared refresh request serves concurrent
expired requests; a protected request is retried at most once after a 401.
Network failures and conflicts do not automatically replay mutations. A page
reload attempts cookie refresh; this is not a verified persistent session. Browsers that block cross-site cookies may
require signing in again. Logout clears local state even if the server fails,
and the UI explains when server logout could not be confirmed.

## Implemented screens

- Overview: backend KPIs and recent audit entries; unavailable values are never
  substituted with sample statistics.
- Schools: status/tier tabs, pagination, create (one-time password), detail,
  activate/deactivate, archive/delete/restore, student and staff lists.
- Users: paginated search/role filters, activate/deactivate. Removal requires a reason and explicit erasure confirmation. The backend
  refuses primary-admin removal.
- Imports: authenticated template downloads, 5 MB file guard, mandatory dry run,
  row errors/warnings and explicit submission of the same validated file. The
  backend enforces the 5,000-row limit. Real submission consumes validation to
  prevent accidental repeat imports. Imported teachers can be invited explicitly
  from school staff lists; invitations send real emails.
- Audit: school/action/actor filters, pagination and entry details.

Public homepage product demonstrations are retained. Admin sample records and
the unused placeholder page are removed.

## Known backend differences

The current schools controller does not forward `search` to its service, even
though the service supports it. The frontend explicitly filters the loaded page
and labels that control accordingly. It uses `data.pagination`; the redundant
outer pagination in schools/users controllers uses an undefined `total`. A school
that is both archived and deleted may only appear under `all`, because the
backend combines the deleted filter with its default archive exclusion.

The users controller forwards `status`/`schoolId`, while its service expects
`isActive`/`schoolIds`. The frontend does not offer those non-working server
filters. Search and role are forwarded correctly.

The overview KPI school scope is active schools, and activity is an operation
count, not a unique active-user count. Labels reflect those meanings. The
backend caches overview data for five minutes, so refresh may return cached data.

## Verification

Run `npm run lint`, `npm test`, `npm run test:routes`, and `npm run build`.
API tests cover session expiry, shared refresh, invalid roles, nested pagination,
logout races, multipart boundaries, downloads, validation and conflict errors.
Route checks ensure signed-out admin routes do not expose sample records.

`tests/admin-qa.html` is an isolated browser fixture harness. Open it only in the
local dev server to exercise actual components at 390, 768 and 1440px. Its data
and fake fetch never enter the production application bundle. It never calls
the real backend or sends invitations.

Browser fixtures verified school creation and one-time passwords, archive name
confirmation, mobile navigation, staff invitations, dry-run gating, validation
invalidation when changing school, and one-shot import submission. Overview
layouts at 390, 768 and 1440px had no horizontal overflow.

Live System Admin authentication and mutations have not been verified in this
iteration. No live records have been changed. Earlier transient connectivity
errors do not establish the current health of the staging server.
NexaPay is outside this System Admin work and remains unconnected.


## Frontend correction (2026-11-03)

The backend fork is read-only context. TeD owns backend implementation. Both
assistant-created backend proposals were withdrawn and reverted to the original
dev code tree, without changing dev. Do not merge or deploy those proposals.

The school operations workspace now uses existing endpoints only. It links to
school-scoped students, staff/admins, imports, school access and audit history.
The school detail endpoint provides the class/invitation counts shown there.
Subscription editing uses the existing `PUT /schools/:schoolId/config` endpoint
and only sends `subscriptionTier`, `subscriptionStatus` and the entered reason
as `systemNote`. It does not assume versioning, transaction guarantees or new
feature-gate behavior. Generated school codes remain read-only.

The admin listing supports local email drafts. Compose, review, then open the
user's email application to send. The website neither sends that message nor
tracks its delivery. In-app notifications and platform email require a confirmed
contract from TeD; no invented messaging endpoints remain.

All capability discovery, new operation-data endpoints, custom configuration
endpoints, class/subject mutations, server email, request IDs and delivery
history from the prior implementation have been removed. Detailed class/arm,
subject, finance, attendance, report-card, timetable and event management remain
pending confirmed System Admin contracts. School-admin credentials and APIs
are not reused to bypass platform permissions.

Retained improvements: real school-status totals using the existing paginated
list endpoint, 10/20/50 row pagination, debounced list search, immutable school
codes with a school picker, admin listing and responsive navigation. School
search remains explicitly limited to the loaded page because the inspected
controller does not forward its search argument. Existing API mismatches listed
above are documented rather than patched in the backend.

The frontend fixtures support only the existing contract and return 404 for
unknown requests, so they cannot hide calls to an invented endpoint. Checks:
frontend lint/build, 16 unit tests and 22 signed-out rendered route checks pass.
Live authenticated mutations have not been performed.
