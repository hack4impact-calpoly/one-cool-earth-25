import connectDB from "@/database/db";
import { NextResponse } from "next/server";
import Registration from "@/database/models/Registration";

//Return all registrations from all events
export async function GET() {
  try {
    await connectDB();
    const registrations = await Registration.find({});

    return NextResponse.json({ registrations });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

//add a registration
export async function POST(request: Request) {
  try {
    await connectDB();
    const registration = await request.json();

    const newRegistration = new Registration({
      eventId: registration.eventId,
      partyMembers: registration.partyMembers,
      affiliatedOrganization: registration.affiliatedOrganization,
      additionalComments: registration.additionalComments,
    });

    await newRegistration.save();

    return NextResponse.json({ message: "Registration created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
