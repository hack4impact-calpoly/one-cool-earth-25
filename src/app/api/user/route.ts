import connectDB from "@/database/db";
import User from "@/database/models/User";
import { clerkClient, auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { clerkId, email, firstName, lastName, dob } = await req.json();

  if (!clerkId) {
    return Response.json({ success: false, error: "Missing clerkId" }, { status: 400 });
  }

  await connectDB();

  const ADMIN_EMAILS = ["admin@garden.com"]; // FIX: temp way to make the role admin based (not in UI)

  const role = ADMIN_EMAILS.includes(email) ? "admin" : "volunteer";

  await User.findOneAndUpdate(
    { clerkId },
    { clerkId, email, firstName, lastName, dob, role },
    { upsert: true, new: true },
  );

  const client = await clerkClient();

  await client.users.updateUser(clerkId, {
    publicMetadata: { role },
  });

  return Response.json({ success: true });
}

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  await connectDB();

  const user = await User.findOne({ clerkId: userId });

  return Response.json(user);
}
