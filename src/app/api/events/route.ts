import connectDB from "@/database/db";
import { NextResponse } from "next/server";
import Event from "@/database/models/Event";
import { getRegistrationCountsByEventId } from "@/lib/events/registrationCounts";

export async function GET() {
  try {
    await connectDB();

    const rawEvents = await Event.find({}).sort({ startTime: 1 });
    const registrationCountsByEventId = await getRegistrationCountsByEventId(
      rawEvents.map((event: any) => event._id.toString()),
    );

    const formattedEvents = rawEvents.map((event: any) => {
      const eventId = event._id.toString();
      const registrationCounts = registrationCountsByEventId.get(eventId);

      return {
        id: eventId,
        title: event.name,
        description: event.description,
        location: event.location,
        startTime: event.startTime,
        endTime: event.endTime,
        imageUrl: event.imageUrl,
        registeredCount: registrationCounts?.registeredCount ?? 0,
        attendanceCount: registrationCounts?.attendanceCount ?? 0,
      };
    });

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
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      imageUrl: eventData.imageUrl,
      registeredCount: eventData.registeredCount ?? 0,
      attendanceCount: eventData.attendanceCount ?? 0,
    });

    await newEvent.save();

    return NextResponse.json({ message: "Event created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}

// Don't need anymore
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
