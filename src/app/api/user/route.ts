// app/api/user/route.ts
import connectDB from "@/database/db";
import User from "@/database/models/User";

export async function POST(req: Request) {
  const { clerkId, email, firstName, lastName } = await req.json();

  await connectDB();
  await User.create({ clerkId, email, firstName, lastName });

  return Response.json({ success: true });
}
