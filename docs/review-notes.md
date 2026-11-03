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
