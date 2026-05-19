"use client";

import { useRouter } from "next/navigation";
import { AppEvent } from "@/data/events";

interface EventPopupProps {
  event: AppEvent;
  onClose: () => void;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EventPopup({ event, onClose }: EventPopupProps) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div
        className="relative w-full max-w-[480px] rounded-[26px] bg-[#226999] p-6 text-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-4 text-xl font-bold text-white hover:opacity-70"
          aria-label="Close event popup"
        >
          X
        </button>

        <h2 className="mb-3 pr-8 font-lora text-3xl font-bold">{event.title}</h2>

        <p className="text-sm font-bold leading-6">
          {formatDate(event.startTime)}
          <br />
          {formatTime(event.startTime)} - {formatTime(event.endTime)}
          <br />
          Location: {event.location || "TBD"}
        </p>

        <div className="mt-4">
          <p className="text-sm font-bold">Description:</p>
          <p className="mt-1 text-sm font-normal">{event.description || "More details will be added soon."}</p>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => router.push(`/events/${event.id}`)}
            className="w-[35%] rounded-md bg-[#6BA9D3] p-2.5 font-lora text-lg font-semibold text-black hover:opacity-80"
          >
            Learn More
          </button>
          <button
            type="button"
            onClick={() => router.push(`/events/${event.id}/register`)}
            className="w-[42%] rounded-md bg-[#A5C6A5] p-2.5 font-lora text-xl font-bold text-black hover:opacity-80"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
