// EventPopup.tsx
"use client";
import React, { useState } from "react";

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  description?: string;
  location?: string;
}

interface EventPopupProps {
  event: CalendarEvent;
  onClose: () => void;
}

export default function EventPopup({ event, onClose }: EventPopupProps) {
  const date = new Date(event.start);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id }),
      });

      if (!res.ok) throw new Error("Failed to register");

      alert("You're registered!");
    } catch (err) {
      setError("Could not register. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div
        className="relative bg-[#226999] text-white p-6 w-[480px] shadow-xl"
        style={{ borderRadius: "26px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-5 text-white text-xl font-bold hover:opacity-70">
          X
        </button>

        <h2 className="text-3xl font-bold mb-3 font-lora">{event.title}</h2>

        <p className="font-bold text-sm leading-6">
          {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          <br />
          {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          <br />
          {event.location && <>Location: {event.location}</>}
        </p>

        {event.description && (
          <div className="mt-4">
            <p className="font-bold text-sm">Description:</p>
            <p className="text-sm font-normal mt-1">{event.description}</p>
          </div>
        )}

        {error && <p className="mt-3 text-red-300 text-sm">{error}</p>}

        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            onClick={() => window.open(`/events/${event.id}`)}
            className="bg-[#6BA9D3] hover:opacity-80 text-black rounded-md"
            style={{ width: "30%", padding: "10px", fontFamily: "Lora, serif", fontWeight: 600, fontSize: "18px" }}
          >
            Learn More
          </button>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="bg-[#A5C6A5] hover:opacity-80 text-black rounded-md disabled:opacity-50"
            style={{ width: "35%", padding: "10px", fontFamily: "Lora, serif", fontWeight: 700, fontSize: "22px" }}
          >
            {loading ? "..." : "REGISTER!"}
          </button>
        </div>
      </div>
    </div>
  );
}
