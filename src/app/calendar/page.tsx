"use client";
import React, { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function CalendarPage() {
  const calendarRef = useRef<FullCalendar>(null);

  const handleNext = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
    }
  };

  return (
    <div className="p-8">
      {/* Search Bar Placeholder */}
      <div className="mb-4">
        <input type="text" placeholder="Search events..." className="border p-2 rounded w-full md:w-1/3" />
      </div>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={false}
        height="auto"
      />
    </div>
  );
}
