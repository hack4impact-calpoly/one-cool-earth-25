import connectDB from "@/database/db";
import { NextResponse } from "next/server";
import Registration from "@/database/models/Registration";
const mongoose = require("mongoose");

//Return all registrations that match an eventId
export async function GET(request: Request, { params }: { params: { eventId: string } }) {
  try {
    await connectDB();
    const registrations = await Registration.find({ eventId: params.eventId });

    if (!registrations) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ registrations });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
