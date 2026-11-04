# EduConnect review notes

Review session: 2026-11-02 (Africa/Lagos).
Status: frontend-only implementation authorized. Backend is read-only context;
TeD owns all backend changes. Unsupported integrations from the earlier attempt
were removed. Pagination, debounce, the chart, immutable school selection and
admin email drafts remain. Platform email/notifications and additional school
management await TeD's confirmed System Admin contracts.

1. **Restore the school-status chart design on the dashboard.** Match the
   attached screenshot: a rounded card with a horizontal stacked status bar,
   green for active, amber for inactive, slate for archived, and a legend with
   percentages below. Use actual backend data; do not restore the old sample
   counts or percentages. Reference: `IMG_8259.jpeg`.
2. **Contact school admins from the admins page.** Add the ability for the
   Super Admin to send emails or notifications to admins from their listing.
   Confirm the available backend messaging contract before wiring delivery.
   Recording this requirement does not send any messages or authorize test
   emails during the review.
3. **Make generated school codes read-only.** The school code is a generated
   identifier and should not appear editable. The screenshot specifically
   flags the editable code field on the import screen. If choosing another
   school is necessary, separate school selection from the immutable code
   display. Reference: `IMG_8260.jpeg` (example code SUN5583).
4. **Pagination in the Super Admin area.** Add or complete consistent
   pagination across the relevant lists, using backend pagination metadata.
   Check the existing controls as part of implementation rather than assuming
   that pagination has not already been started.
5. **Debounced search in the Super Admin area.** Interpreting the user's
   "search bounce" as debounce: wait briefly after typing stops before issuing
   a search request. Cancel obsolete searches and prevent stale results from
   replacing newer ones. This interpretation can be corrected during review.
6. **Review the earlier admin application for feature parity.** Reference:
   https://educonnect-application.vercel.app/ (provided 2026-11-03).
   Its public portal visibly offers School Administrator, Teacher, and Parent.
   School Administrator sign-in requires a school ID, email, and password.
   This is distinct from the platform System Admin role in our current branch.
   Verify intended role ownership before carrying features into Super Admin.
   The current `DevAvala/educonnect-frontend` main branch has public marketing
   routes only in `src/App.jsx`; it does not explain this deployed portal.
   Do not assume features were deleted from our branch or that this repository
   version is the deployed source.

   Signed-in inspection on 2026-11-03 succeeded at `/dashboard/admin`.
   Observed navigation and dashboard controls (presence verified, workflows
   not yet tested):
   - People: Students, Guardians, Staff, Admissions.
   - Academics: Classes & Arms, Subjects, Grading & Results, Report Cards,
     Timetables; academic year and term scope selector in the header.
   - Attendance.
   - Finance: Overview, Fee Structures, Invoices, Payments, Reports.
   - Communication: Announcements, Events, Delivery Logs.
   - General Reports, Settings, Approvals, Notifications, global search.
   - Dashboard: user/student/invitation statistics, activity analytics tabs
     (Users by Role, Status Distribution, Detailed Breakdown), student
     registration, teacher/parent invitations, pending invitation management.
   Our current platform Super Admin routes cover Overview, Schools, School
   Detail, Users, Imports, and Audit Logs. The school-operations sections
   listed above are absent from the current route tree. This establishes a
   role/scope difference, not proof that those school features were removed
   by our work. Confirm intended scope before implementing feature parity.

2026-11-03 clarification: use only the app link and login details from
`IMG_8285.jpeg` for the comparison. Disregard the other messages in that
screenshot as requirements. Preserve the user's earlier review items 1–5.
No login credentials from the screenshot are stored in these notes.

Retain the public homepage's platform demonstrations. Leave backend login
remediation to TeD, as instructed separately.

## Frontend transfer review fixes, 2026-11-04

Local changes on `feature/super-admin-homepage-integration` restore the existing
school-app login and registration destinations, direct Web3Forms enquiries on
both public forms, canonical/social metadata, and deployment-specific indexing.
Deployed admin pages require an explicit valid HTTPS API origin; local development
alone keeps the staging default. An absent configuration leaves public pages
working and shows an unavailable admin screen without sending requests.

The brief extra review also fixed international phone formatting, bounded enquiry
inputs, duplicate submission gating, and request timeout feedback. Pricing's
malformed icon color class and outdated dashboard documentation were corrected.
Legal text and pricing data remain unchanged. No backend code or project settings
were modified, and these review fixes have not been committed or pushed.

Verification: lint, 18 unit tests, build and 22 route checks pass. Route checks
also pass with an explicit fixture API origin. Actual HTML builds confirm that
preview stays noindex even with indexing requested, while an explicit production
opt-in enables public indexing. Admin/error metadata remains noindex. The initial
preview attempt reported `vite: not found`; the final checks below supersede
that browser verification limit. Contact tests use a fake provider; no real enquiries,
emails or authenticated backend mutations were submitted. The new
`tests/public-review-qa.html` is an isolated local fixture, excluded from the
production entry and bundle. Production API configuration still awaits the
approved origin and a separately approved deployment configuration change.

## Final frontend checks, 2026-11-04

Backend repositories, live backend calls and backend configuration are out of
scope. All checks here concern frontend files and isolated local responses.

- Lint, 18 unit tests, production build, and 22 rendered route checks pass.
- Actual preview and production HTML builds pass the indexing/canonical/social
  metadata checks. Preview remains noindex even with an indexing opt-in.
- A full file check, including new files, finds no missing local imports or
  whitespace errors. Legal/pricing Markdown is unchanged. Test fixture markers
  are absent from the production bundle.
- The preview startup issue was resolved by copying the existing installed
  frontend dependencies into this checkout instead of using an external symlink.
  No package versions or application scripts were changed for this repair.
- Browser checks cover homepage, pricing, contact and all three legal pages at
  390, 768 and 1440px iframe widths, with no page-wide horizontal overflow.
  Titles and canonical metadata match each route. Super Admin overview fixture
  layouts also fit those widths, with noindex and no canonical URL.
- Mobile navigation opens/closes and exposes the school-app login and registration
  links. The public header is not fixed/sticky. Enquiry validation, retained values
  after a simulated failure, and a successful explicit retry were confirmed in
  the browser. No real message or enquiry was sent.
- The initial mobile pricing interaction check stalled in the browser tool; the
  follow-up check below resolves that limitation. A tablet dashboard screenshot uses
  fixture data only. No production deployment was performed.

These final checks create no Git commit and do not push or merge any branch.

### Completed mobile pricing follow-up, 2026-11-04

The 390px mobile fixture now passes the remaining interaction checks. Switching
Basic to Premium updates selection and feature details (including advanced
weighted grading); switching back restores Basic inclusions/exclusions. All five
pricing FAQs open and close correctly. No horizontal page overflow was found.
The earlier timeout was a browser-tool locator mismatch: the accessibility tree
exposed the pressed plan buttons as checkbox controls. Using the observed
controls completed the check without an application-code change. Backend access,
commits, pushes and merges remain out of scope for this verification.
