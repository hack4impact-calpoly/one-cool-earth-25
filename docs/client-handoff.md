# One Cool Earth Application Handoff

This document is intended to give One Cool Earth full operational control of the volunteer event application. It should be reviewed with the client before final transfer, then updated with production URLs, account owners, and any values intentionally omitted from source control.

Do not paste raw secrets, passwords, API keys, database URIs, or recovery codes into this document. Transfer those through the service provider's built-in ownership/team features, or through a secure password manager.

## Project Information

- **Application name:** One Cool Earth volunteer event application
- **Repository:** `https://github.com/hack4impact-calpoly/one-cool-earth-25`
- **Primary purpose:** Allow volunteers to view upcoming One Cool Earth workdays/events, create accounts, register themselves and party members, check in, and allow admins to manage events, attendance, registration notifications, and reports.
- **Primary users:** One Cool Earth volunteers and One Cool Earth administrative staff.
- **Production URL:** https://one-cool-earth-25.vercel.app/
- **Admin contact after handoff:** McKenna Lenhart (mckennal@onecoolearth.org), Director of Communications and Operations

## Account Transfer Plan

The safest transfer model is to move each service into accounts owned by One Cool Earth, then rotate all secrets after the client has access. Avoid leaving production running from student-owned personal accounts.

### GitHub Repository

Preferred options:

- Transfer the repository into a GitHub organization owned by One Cool Earth.
- Or add One Cool Earth maintainers/admins to the existing repository or organization if Hack4Impact will continue hosting it.

Checklist:

- Add the client's technical owner as repository admin or transfer repository ownership.
- Confirm branch protections on `main` and `develop`.
- Confirm GitHub Actions repository secrets are present after transfer.
- Confirm the deployment provider still has repository access after transfer.
- Update repository description and README placeholders.

### Vercel Hosting and Blob Storage

Preferred option: create or use a One Cool Earth-owned Vercel team and transfer the project into that team.

Checklist:

- Invite the client's owner/admin to the current Vercel team, or create a One Cool Earth Vercel team.
- Transfer the project to the One Cool Earth team.
- Transfer or recreate the Vercel Blob store under the client's team.
- Recreate `BLOB_READ_WRITE_TOKEN` after transfer.
- Update all environment variables in Vercel.
- Confirm production and preview deployments still build.
- Confirm custom domain and DNS configuration.
- Remove student accounts from Vercel after the client verifies access.

### Domain and DNS

No custom production domain is currently configured. The application is deployed using the default Vercel domain.

### MongoDB

Preferred option: One Cool Earth owns the MongoDB Atlas organization/project and billing.

Checklist:

- Invite the client as Organization Owner or Project Owner in MongoDB Atlas.
- Confirm billing is moved to the client.
- Confirm database user credentials are not tied to a student's personal account.
- Rotate the database user's password after transfer.
- Update `MONGO_URI` in Vercel, GitHub Actions, and local `.env` copies as needed.
- Confirm IP/network access settings are compatible with the deployment provider.
- Enable backups.
- Export a final pre-handoff backup.
- Remove student access after validation.

### Clerk Authentication

Preferred option: One Cool Earth owns the Clerk application and billing.

Checklist:

- Invite the client as admin/owner in Clerk.
- Confirm production instance settings.
- Confirm allowed redirect URLs and production domain settings.
- Confirm email/password auth configuration.
- Confirm user data ownership and export requirements.
- Rotate `CLERK_SECRET_KEY` after transfer.
- Update `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` in Vercel and GitHub Actions if the app is moved to a new Clerk application.
- Set the client's admin users' public metadata role to `admin`.
- Remove student access after validation.

### Jotform Waiver Forms

- Confirm One Cool Earth ownership and access.
- Verify API access used by the application.

### Resend Email

Preferred option: One Cool Earth owns the Resend account, verified sending domain, and billing.

Checklist:

- Invite the client as admin/owner in Resend or create a client-owned account.
- Verify the sender domain or sender email used by `REGISTRATION_NOTIFICATION_FROM`.
- Confirm DNS records for SPF/DKIM/DMARC if using a domain sender.
- Generate a new `RESEND_API_KEY`.
- Update `RESEND_API_KEY` and `REGISTRATION_NOTIFICATION_FROM` in Vercel.
- Send a test registration and confirm recipients receive the email.
- Remove old API keys.

### Mailchimp

The footer includes a Mailchimp embedded signup endpoint. The app does not use a Mailchimp API key, but the client should own the Mailchimp audience/list behind that form.

Checklist:

- Confirm One Cool Earth ownership.
- Verify embedded signup form still points to the correct audience.

### Social Media Links

The footer links to One Cool Earth's Facebook, Instagram, and LinkedIn pages. No API integration is present.

Checklist:

- Confirm links are correct.
- Confirm the client's communications team has account access.

## Secret Rotation Order

Use this sequence to minimize downtime:

1. Add the client to each service as owner/admin.
2. Confirm they can log in to each service.
3. Transfer billing where applicable.
4. Create new production secrets under the client-owned accounts.
5. Update Vercel production env vars.
6. Update Vercel preview/staging env vars.
7. Update GitHub Actions secrets.
8. Trigger a deployment.
9. Test core app flows.
10. Revoke old keys and remove student access.

## Validation Checklist After Transfer

- Production site loads.
- Client admin can log in.
- Client admin can access `/admin-account`.
- Client admin can access `/report`.
- Client admin can create an event.
- Client admin can upload an event image.
- Volunteer can create an account.
- Volunteer can register for an event.
- Registration notification email is delivered.
- Volunteer can check waiver status.
- QR/check-in flow works.
- Attendance can be updated by admin.
- Report totals load for a known date range.
- MongoDB backups are enabled.
- GitHub Actions build succeeds.
- Vercel production deployment succeeds.
- Old personal/student access has been removed.

## Known Issues and Handoff Notes

- `README.md` and `docs/getting-started.md` still contain template placeholders and should be cleaned up before final client delivery.
- `npm run build` was verified successfully during handoff review. The build needs network access because `next/font` fetches Google Fonts during compilation.
- `npm test` is a placeholder and does not run real automated tests.
- `npm run lint` currently passes with one warning in `src/components/Footer.tsx` for using a raw `<img>` instead of Next.js `<Image>`.
- Admin assignment is hardcoded to `admin@garden.com` in `src/app/api/user/route.ts`; this should be changed or formally documented before production handoff.
- Some organization options are hardcoded in UI files instead of coming from the `organizations` collection.
- The waiver status route currently checks Jotform submissions by email and stores completed waivers as `General`; school-specific parsing appears to be intentionally disabled/commented out.
- API route authorization is inconsistent: some event and registration mutation routes do not call `requireAdmin`. Page-level middleware protects some UI pages, but direct API protection should be reviewed before final production ownership.
- There is no deployment config file in the repository; actual hosting settings must be documented from the deployment provider dashboard.
- The current worktree showed local modifications to `.env` and `package-lock.json` during this handoff review. Confirm whether those changes should be committed, ignored, or reverted before final delivery.

## Final Handoff Checklist

- [ ] GitHub ownership/access transferred.
- [ ] Hosting ownership/access transferred.
- [ ] Domain/DNS ownership transferred or confirmed.
- [ ] MongoDB ownership/access transferred.
- [ ] Clerk ownership/access transferred.
- [ ] Jotform ownership/access transferred.
- [ ] Resend ownership/access transferred.
- [ ] Mailchimp ownership/access confirmed.
- [ ] Vercel Blob ownership/access confirmed.
- [ ] Production environment variables configured under client-owned accounts.
- [ ] GitHub Actions secrets configured.
- [ ] Client admin accounts created and verified.
- [ ] Production smoke test completed.
- [ ] Backups enabled and tested.
