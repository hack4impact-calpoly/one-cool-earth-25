import connectDB from "@/database/db";
import Volunteer from "@/database/models/Volunteer";
import { clerkClient, auth, currentUser } from "@clerk/nextjs/server";

export async function GET() {
  const userInfo = await currentUser();
  const email = userInfo?.emailAddresses[0]?.emailAddress;

  if (!userInfo) {
    return new Response("Unauthorized", { status: 401 });
  }

  await connectDB();

  const user = await Volunteer.findOne({ email: email });

  return Response.json(user);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const userInfo = await currentUser();
  const email = userInfo?.emailAddresses[0]?.emailAddress;

  const { firstName, lastName, phoneNumber, dateOfBirth, password, email: newEmail } = await req.json();

  await connectDB();

  const volunteer = await Volunteer.findOneAndUpdate(
    // clerk stuff?
    { email }, // find by current clerk email
    { kind: "USER", firstName, lastName, phoneNumber, dateOfBirth, email: newEmail || email },
    { upsert: true, new: true },
  );

  if (password) {
    const client = await clerkClient();
    await client.users.updateUser(userId, { password });
  }

  return Response.json({ success: true, volunteer });
}
