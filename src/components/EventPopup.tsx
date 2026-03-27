"use client";
import React from "react";
import { AppEvent } from "@/data/events";

interface EventPopupProps {
  event: AppEvent;
  onClose: () => void;
}

export default function EventPopup({ event, onClose }: EventPopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div
        className="relative bg-[#226999] text-white p-6 w-[480px] shadow-xl"
        style={{ borderRadius: "26px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-5 text-white text-xl font-bold hover:opacity-70">
          X
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-3 font-lora">{event.title}</h2>

        {/* Date/Time/Location */}
        <p className="font-bold text-sm leading-6">
          {event.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          <br />
          {event.startTime} - {event.endTime}
          <br />
          Location: {event.school}
        </p>

        <div className="mt-4">
          <p className="font-bold text-sm">Description:</p>
          <p className="text-sm font-normal mt-1">Come spend a great day gardening with us under the sun!</p>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            onClick={() => window.open(`/events/${event.id}`)}
            className="bg-[#6BA9D3] hover:opacity-80 text-black rounded-md"
            style={{
              width: "30%",
              padding: "10px",
              fontFamily: "Lora, serif",
              fontWeight: 600,
              fontSize: "18px",
            }}
          >
            Learn More
          </button>
          <button
            className="bg-[#A5C6A5] hover:opacity-80 text-black rounded-md"
            style={{
              width: "35%",
              padding: "10px",
              fontFamily: "Lora, serif",
              fontWeight: 700,
              fontSize: "22px",
            }}
          >
            REGISTER!
          </button>
        </div>
      </div>
    </div>
  );
}
