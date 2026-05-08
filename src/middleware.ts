import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
const isAdminRoute = createRouteMatcher([
  "/admin-account(.*)",
  "/admin-calendar(.*)",
  "/admin-event-details(.*)",
  "/admin-events(.*)",
  "/report(.*)",
]);
export default clerkMiddleware(async (auth, req) => {
  const session = await auth();
  const role = (session.sessionClaims?.publicMetadata as { role?: string })?.role;
  if (isAdminRoute(req) && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
});
