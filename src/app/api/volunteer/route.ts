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
