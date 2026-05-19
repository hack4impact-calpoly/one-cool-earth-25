import connectDB from "@/database/db";
import { NextResponse } from "next/server";
import Event from "@/database/models/Event";

const TEST_EVENT_IMAGES = [
  "/images/testImage1.JPG",
  "/images/testImage2.JPG",
  "/images/testImage3.JPG",
  "/images/testImage4.jpeg",
  "/images/testImage5.JPG",
];

function getTestEventImage(seed: string) {
  const index = seed.split("").reduce((total, char) => total + char.charCodeAt(0), 0) % TEST_EVENT_IMAGES.length;
  return TEST_EVENT_IMAGES[index];
}

function getEventImageUrl(imageUrl: string | undefined, seed: string) {
  if (imageUrl && !imageUrl.startsWith("blob:")) {
    return imageUrl;
  }

  return getTestEventImage(seed);
}

export async function GET() {
  try {
    await connectDB();

    const rawEvents = await Event.find({}).sort({ startTime: 1 });

    const formattedEvents = rawEvents.map((event: any) => ({
      id: event._id.toString(),
      title: event.name,
      description: event.description,
      location: event.location,
      startTime: event.startTime,
      endTime: event.endTime,
      imageUrl: getEventImageUrl(event.imageUrl, event._id.toString()),
      registeredCount: event.registeredCount,
      attendanceCount: event.attendanceCount,
    }));

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
      imageUrl: getEventImageUrl(eventData.imageUrl, `${eventData.name}-${eventData.startTime}`),
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
