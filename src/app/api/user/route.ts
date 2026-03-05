import connectDB from "@/database/db";
import User from "@/database/models/User";

export async function POST(req: Request) {
  const { clerkId, email, firstName, lastName, dob } = await req.json();

  if (!clerkId) {
    return Response.json({ success: false, error: "Missing clerkId" }, { status: 400 });
  }

  await connectDB();

  await User.findOneAndUpdate({ clerkId }, { clerkId, email, firstName, lastName, dob }, { upsert: true, new: true });
  return Response.json({ success: true });
}
