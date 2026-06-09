# [TECHNICAL] One Cool Earth Application Handoff

This document is intended to give One Cool Earth full operational control of the volunteer event application. It should be reviewed with the client before final transfer, then updated with production URLs, account owners, and any values intentionally omitted from source control.

Do not paste raw secrets, passwords, API keys, database URIs, or recovery codes into this document. Transfer those through the service provider's built-in ownership/team features, or through a secure password manager.

## 1. Project Overview

- **Application name:** One Cool Earth volunteer event application
- **Repository:** `https://github.com/hack4impact-calpoly/one-cool-earth-25`
- **Primary purpose:** Allow volunteers to view upcoming One Cool Earth workdays/events, create accounts, register themselves and party members, check in, and allow admins to manage events, attendance, registration notifications, and reports.
- **Primary users:** One Cool Earth volunteers and One Cool Earth administrative staff.
- **Current codebase status:** Next.js web application with MongoDB persistence, Clerk authentication, Jotform waiver lookup, Vercel Blob image storage, and Resend email notifications.
- **Production URL:** https://one-cool-earth-25.vercel.app/
- **Staging URL:** Vercel Preview Deployments (example: https://one-cool-earth-25-6lun6pa8k-jodi-yamanes-projects.vercel.app)
- **Admin contact after handoff:** McKenna Lenhart (mckennal@onecoolearth.org), Director of Communications and Operations

## 2. Application Features

### Volunteer Features

- Public event calendar and event list.
- Account creation, login, password reset, and account deletion through Clerk-backed auth flows.
- Volunteer profile page with contact information.
- Event detail pages.
- Event registration for a user and additional party members.
- Registration editing and deletion.
- Waiver status check based on Jotform submissions.
- QR/check-in flow for events.

### Admin Features

- Event creation, editing, deletion, image upload, and event details management.
- Volunteer/registration list per event.
- Attendance management per party member.
- Report page at `/report` with volunteer, event, hour, school, and organization summaries.
- Registration notification recipient management in account page.

## 3. Technical Stack

- **Framework:** Next.js 14 App Router
- **Language:** TypeScript
- **Frontend:** React 18, CSS modules, Tailwind CSS config, MUI, FullCalendar, Lucide/React Icons
- **Authentication:** Clerk
- **Database:** MongoDB using Mongoose
- **File/image storage:** Vercel Blob via `@vercel/blob`
- **Waiver integration:** Jotform API
- **Email notifications:** Resend API
- **CI:** GitHub Actions build workflow on `main`, `develop`, and pull requests
- **Package manager:** npm with `package-lock.json`
- **Node versions tested in CI:** 18.x, 20.x, 22.x

## 4. Repository Structure

- `src/app`: Next.js App Router pages and API routes.
- `src/app/api`: Server-side API endpoints.
- `src/components`: Shared React components.
- `src/database`: MongoDB connection and Mongoose models.
- `src/lib/auth`: Admin authorization helper.
- `src/lib/events`: Event/registration count helper logic.
- `src/lib/notifications`: Resend registration email notification logic.
- `src/hooks`: Client hooks for role and waiver status.
- `src/styles`: CSS modules and global page styles.
- `public`: Public static assets.
- `docs`: Project documentation.
- `.github/workflows/ci.yml`: GitHub Actions build workflow.

## 5. Important Routes

### Public/User Pages

- `/`: Home page.
- `/calendar`: Public calendar page.
- `/events`: Event list page, login-protected by middleware.
- `/events/[eventId]`: Event details.
- `/events/[eventId]/register`: Event registration.
- `/events/[eventId]/qr`: QR code page for event check-in.
- `/checkin/[eventId]`: Event check-in page.
- `/account`: Volunteer account page.
- `/account/delete`: Account deletion flow.
- `/login`: Login page.
- `/create-account`: Account creation page.
- `/forgot-password`: Password reset page.
- `/edit-registration/[id]`: Edit a registration.

### Admin Pages

- `/report`: Admin reporting page.

Admin-only routes are enforced with Clerk public metadata role `admin` in `src/middleware.ts` and `src/lib/auth/admin.ts`.

## 6. API Routes

- `GET /api/events`: List events with registration and attendance counts.
- `POST /api/events`: Create event.
- `DELETE /api/events`: Legacy event deletion endpoint using request body `id`.
- `GET /api/events/[id]`: Get one event.
- `PATCH /api/events/[id]`: Update one event.
- `DELETE /api/events/[id]`: Delete one event.
- `POST /api/events/upload-image`: Upload an event image to Vercel Blob. Max file size is 5 MB.
- `GET /api/events/registration`: List all registrations.
- `POST /api/events/registration`: Create a registration and send notification emails if configured.
- `GET /api/events/registration/[registrationId]`: Get one registration.
- `PATCH /api/events/registration/[registrationId]`: Update one registration.
- `DELETE /api/events/registration/[registrationId]`: Delete one registration.
- `PATCH /api/events/registration/[registrationId]/attendance`: Admin-only attendance update.
- `GET /api/events/registration/event/[eventId]`: List registrations for an event.
- `GET /api/events/registration/users/[userEmail]`: List registrations for a volunteer email.
- `POST /api/events/[id]/checkin`: Authenticated check-in for the logged-in volunteer.
- `GET /api/me/waiver-status`: Check the logged-in user's waiver status through Jotform and cache successful results.
- `POST /api/user`: Create/update app user record and Clerk public metadata.
- `GET /api/user`: Get the logged-in user's MongoDB profile.
- `DELETE /api/user`: Delete the logged-in user from MongoDB and Clerk.
- `GET /api/report`: Admin-only reports by date range.
- `GET /api/admin/registration-notification-recipients`: Admin-only notification recipient list.
- `PUT /api/admin/registration-notification-recipients`: Admin-only notification recipient update.

## 7. Database

### Provider

- **Database provider:** MongoDB, likely MongoDB Atlas.
- **Connection env var:** `MONGO_URI`.
- **ORM/library:** Mongoose.

### Collections and Models

- `events`: Event records with name, description, location, start/end time, image URL, and count fields.
- `registrations`: Event registrations containing party members, organization affiliation, comments, attendance, and waiver flags.
- `users`: Application profile records mapped to Clerk IDs.
- `waivers`: Cached waiver status records linked by Clerk ID and/or email.
- `notificationSettings`: Admin-managed registration notification recipients.
- `organizations`: Organization names. Model exists, but current UI uses hardcoded organization options in some places.
- `schools`: School names. Model exists, but reporting currently derives school name from event location.
- `volunteers`: Volunteer model exists, but the active auth/profile flow uses Clerk plus the `users` collection.

### Backup Requirements

The client should own a MongoDB project with automated backups enabled. At minimum, back up these collections before any major deployment or data migration:

- `events`
- `registrations`
- `users`
- `waivers`
- `notificationSettings`
- `organizations`, if populated
- `schools`, if populated
- `volunteers`, if populated

## 8. Environment Variables

These variables are required by the current codebase.

| Variable                            | Purpose                                                                                                                          | Service Owner |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Public Clerk frontend key used by Clerk components.                                                                              | Clerk         |
| `CLERK_SECRET_KEY`                  | Server-side Clerk API key used for user management and role checks.                                                              | Clerk         |
| `MONGO_URI`                         | MongoDB connection string for the application database.                                                                          | MongoDB       |
| `BLOB_READ_WRITE_TOKEN`             | Vercel Blob token used by `@vercel/blob` uploads.                                                                                | Vercel        |
| `JOTFORM_API_KEY`                   | Jotform API key used to read waiver form submissions.                                                                            | Jotform       |
| `JOTFORM_BASE_URL`                  | Jotform API base URL, usually `https://api.jotform.com`.                                                                         | Jotform       |
| `JOTFORM_SCHOOL_FIELD_NAME`         | Intended school field mapping for waiver submissions. Currently not used by active code because school parsing is commented out. | Jotform       |
| `JOTFORM_ENGLISH_WAIVER_FORM_ID`    | English waiver form ID. Current hardcoded public form URL uses `70895957565174`.                                                 | Jotform       |
| `JOTFORM_SPANISH_WAIVER_FORM_ID`    | Spanish waiver form ID. Current hardcoded public form URL uses `251204962817155`.                                                | Jotform       |
| `RESEND_API_KEY`                    | Resend API key for registration notification emails.                                                                             | Resend        |
| `REGISTRATION_NOTIFICATION_FROM`    | Verified sender address used for registration emails.                                                                            | Resend/DNS    |

Production, preview/staging, local development, and GitHub Actions may each need their own configured values.

## 9. External Links and Accounts in Code

- **English Jotform waiver:** `https://form.jotform.com/70895957565174`
- **Spanish Jotform waiver:** `https://form.jotform.com/251204962817155`
- **Facebook:** `https://www.facebook.com/OneCoolEarth`
- **Instagram:** `https://www.instagram.com/onecoolearth/`
- **LinkedIn:** `https://www.linkedin.com/company/one-cool-earth`
- **Mailchimp signup endpoint:** `https://app.us4.list-manage.com/subscribe/post?u=6c9598dd5f26c1970cb2e3a1f&id=f78c5159ed&f_id=00d96ceaf0`
- **Mailchimp referral link:** `http://eepurl.com/i3XPfE`

The client should confirm these are still the correct official links before launch/handoff.

## 10. Local Development Setup

1. Install Node.js. CI currently verifies Node 18, 20, and 22.
2. Clone the repository.
3. Run `npm install`.
4. Create `.env` with the variables listed above.
5. Run `npm run dev`.
6. Open `http://localhost:3000`.

Useful commands:

- `npm run dev`: Start local development server.
- `npm run build`: Build production bundle.
- `npm run start`: Start built production app.
- `npm run lint`: Run Next.js linting.
- `npm run lint:fix`: Auto-fix lint issues where possible.
- `npm run format`: Format files with Prettier.
- `npm test`: Currently a placeholder and does not run a real test suite.

## 11. Deployment

The application is currently deployed on Vercel and uses Vercel Blob for image storage.

### Vercel Deployment Checklist

- Create or transfer the Vercel project to the client's Vercel team.
- Connect the GitHub repository to the Vercel project.
- Configure production environment variables in Vercel.
- Configure preview/staging environment variables if preview deployments are used.
- Confirm Vercel Blob store access and `BLOB_READ_WRITE_TOKEN`.
- Configure the production domain.
- Confirm DNS points to Vercel.
- Run a production deployment.
- Test account creation, login, event creation, image upload, registration, waiver check, check-in, reporting, and email notifications.

### GitHub Actions

The CI workflow runs:

- `npm install`
- `npm run build`
- `npm test`

The build step currently receives only these GitHub secrets:

- `MONGO_URI`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

If CI builds start exercising image uploads, Jotform waiver checks, or Resend email paths, add the relevant secrets to GitHub Actions as repository secrets.

## 12. Admin Access and Roles

Admin authorization is based on Clerk user `publicMetadata.role === "admin"`.

Important implementation detail:

- `src/app/api/user/route.ts` currently grants admin role only to the hardcoded email `admin@garden.com` during account creation/update.
- For real client handoff, the recommended approach is to manually set admin role in the Clerk dashboard for the client's admin users, or replace the hardcoded email with a documented admin-management flow.

### Setting a User as Admin in Clerk

1. Make sure the user creates an account through this web application first before opening clerk.
2. Open the Clerk dashboard for the production application.
3. Go to **Users**.
4. Select the client's admin user.
5. Edit the user's public metadata.
6. Set:

```json
{
  "role": "admin"
}
```

6. Save the user.
7. Have the user log out and log back in if their session does not immediately reflect the role.
8. Confirm they can access `/admin-account` and `/report`.
