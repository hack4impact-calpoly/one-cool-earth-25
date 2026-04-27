import connectDB from "@/database/db";
import { NextResponse } from "next/server";
import Event from "@/database/models/Event";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const event = await Event.findById(params.id);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const formattedEvent = {
      id: event._id,
      title: event.name,
      start: event.time,
      description: event.description,
      location: event.location,
    };

    return NextResponse.json(formattedEvent);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}
