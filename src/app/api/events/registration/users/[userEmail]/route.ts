import connectDB from "@/database/db";
import { NextResponse } from "next/server";
import Registration from "@/database/models/Registration";

// Return all registrations of a user
export async function GET(request: Request, { params }: { params: { userEmail: string } }) {
  try {
    await connectDB();
    const registrations = await Registration.find({
      "partyMembers.email": params.userEmail,
    }).populate("eventId");

    if (!registrations) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    return NextResponse.json({ registrations });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to fetch registration" }, { status: 500 });
  }
}
