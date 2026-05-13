import { clerkClient, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher([
  "/admin-account(.*)",
  "/admin-calendar(.*)",
  "/admin-event-details(.*)",
  "/admin-events(.*)",
  "/report(.*)",
]);

const isLoggedInRoute = createRouteMatcher([
  "/account(.*)",
  "/calendar(.*)",
  "/checkin(.*)",
  "/edit-registration(.*)",
  "/events(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const session = await auth();
  const userId = session.userId;

  if (!userId && isLoggedInRoute(req)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!isAdminRoute(req)) {
    return NextResponse.next();
  }

  if (!userId) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const role = user.publicMetadata.role;

  if (role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});
