import connectDB from "@/database/db";
import { NextResponse } from "next/server";
import Event from "@/database/models/Event";
import { getRegistrationCountsByEventId } from "@/lib/events/registrationCounts";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const event = await Event.findById(params.id);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const registrationCountsByEventId = await getRegistrationCountsByEventId([event._id.toString()]);
    const registrationCounts = registrationCountsByEventId.get(event._id.toString());

    const formattedEvent = {
      id: event._id.toString(),
      title: event.name,
      description: event.description,
      location: event.location,
      startTime: event.startTime,
      endTime: event.endTime,
      imageUrl: event.imageUrl,
      registeredCount: registrationCounts?.registeredCount ?? 0,
      attendanceCount: registrationCounts?.attendanceCount ?? 0,
    };

    return NextResponse.json(formattedEvent);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const eventData = await request.json();

    const updatedEvent = await Event.findByIdAndUpdate(
      params.id,
      {
        name: eventData.title,
        description: eventData.description,
        location: eventData.location,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        imageUrl: eventData.imageUrl,
      },
      { new: true },
    );

    if (!updatedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Event updated successfully" });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const deletedEvent = await Event.findByIdAndDelete(params.id);

    if (!deletedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
