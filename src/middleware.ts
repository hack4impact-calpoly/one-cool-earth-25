import { clerkClient, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher([
  "/admin-account(.*)",
  "/admin-calendar(.*)",
  "/admin-event-details(.*)",
  "/admin-events(.*)",
  "/report(.*)",
]);

const isLoggedInRoute = createRouteMatcher(["/account(.*)", "/edit-registration(.*)", "/events(.*)"]);

const isPublicRoute = createRouteMatcher([
  "/",
  "/calendar(.*)",
  "/login(.*)",
  "/create-account(.*)",
  "/forgot-password(.*)",
  "/checkin(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const session = await auth();
  const userId = session.userId;

  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  if (!userId && isLoggedInRoute(req)) {
    return NextResponse.redirect(new URL("/calendar", req.url));
  }

  if (!isAdminRoute(req)) {
    return NextResponse.next();
  }

  if (!userId) {
    return NextResponse.redirect(new URL("/calendar", req.url));
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const role = user.publicMetadata.role;

  if (role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});
