# EduConnect Super Admin

The standalone Super Admin portal lives in this directory. Run `npm ci`, `npm test` and `npm run build` here. Use `npm run dev` for local development.

For deployment, create a separate Vercel project with root directory `admin`. Set `VITE_API_BASE_URL` to the approved HTTPS backend origin. Add `admin.educonnect.com.ng` in the project domain settings and configure the DNS record Vercel provides. Allow that origin in the backend CORS configuration. Verify sign-in, refresh and sign-out on the deployed origin before use. Existing System Admin credentials are required.

The application root opens `/super-admin`. Deep links are handled by the Vercel rewrite.
