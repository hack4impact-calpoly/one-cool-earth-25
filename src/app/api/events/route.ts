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

export async function POST(request: Request) {
  try {
    await connectDB();
    const eventData = await request.json();

    const newEvent = new Event({
      name: eventData.name,
      description: eventData.description,
      location: eventData.location,
      time: eventData.time,
    });

    await newEvent.save();

    return NextResponse.json({ message: "Event created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { id } = await request.json();

    await Event.findByIdAndDelete(id);

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
