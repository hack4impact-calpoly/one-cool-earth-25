import connectDB from "@/database/db";
import Registration from "@/database/models/Registration";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

type PartyMember = {
  name?: string;
  email?: string;
  attending?: boolean;
  attended?: boolean;
};

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ status: "not-logged-in" }, { status: 401 });
  }

  if (!Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: "Invalid event id" }, { status: 400 });
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.primaryEmailAddress?.emailAddress?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "No email address found for this user" }, { status: 400 });
    }

    await connectDB();

    const registration = await Registration.findOne({
      eventId: params.id,
      "partyMembers.email": email,
    });

    if (!registration) {
      return NextResponse.json({ status: "not-registered" }, { status: 404 });
    }

    const memberIndex = registration.partyMembers.findIndex((member: PartyMember) => {
      return member.email?.trim().toLowerCase() === email && member.attending !== false;
    });

    if (memberIndex === -1) {
      return NextResponse.json({ status: "not-registered" }, { status: 404 });
    }

    const member = registration.partyMembers[memberIndex] as PartyMember;
    const alreadyCheckedIn = Boolean(member.attended);
    registration.partyMembers[memberIndex].attended = true;
    await registration.save();

    return NextResponse.json({
      status: "registered",
      alreadyCheckedIn,
      name: member.name || user.fullName || email,
      registrationId: registration._id.toString(),
    });
  } catch (error) {
    console.error("Check-in API Error:", error);
    return NextResponse.json({ error: "Failed to check in" }, { status: 500 });
  }
}
