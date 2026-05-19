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

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const event = await Event.findById(params.id);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const formattedEvent = {
      id: event._id.toString(),
      title: event.name,
      description: event.description,
      location: event.location,
      startTime: event.startTime,
      endTime: event.endTime,
      imageUrl: getEventImageUrl(event.imageUrl, event._id.toString()),
      registeredCount: event.registeredCount,
      attendanceCount: event.attendanceCount,
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
        imageUrl: getEventImageUrl(eventData.imageUrl, `${eventData.title}-${eventData.startTime}`),
        registeredCount: eventData.registeredCount,
        attendanceCount: eventData.attendanceCount,
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
