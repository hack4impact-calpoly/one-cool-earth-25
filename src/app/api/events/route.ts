import connectDB from "@/database/db";
import { NextResponse } from "next/server";
import Event from "@/database/models/Event";

export async function GET() {
  try {
    await connectDB();
    const rawEvents = await Event.find({});

    const formattedEvents = rawEvents.map((event: any) => ({
      id: event._id,
      title: event.name, // 'name' becomes 'title'
      start: event.time, // 'time' becomes 'start'
      description: event.description,
      location: event.location,
    }));
    /* for what fullcalendar expects*/

    return NextResponse.json(formattedEvents);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
