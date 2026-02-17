"use client";
import React, { useRef } from "react";
//import { StyleSheet, Button, View, Text, Alert, Platform } from "react-native";
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
  const handlePrev = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
    }
  };
  return (
    <div className="p-8">
      {/* Search Bar Placeholder */}

      <div className="flex justify-between items-center mb-6">
        {" "}
        {/* Parent: Pushes groups apart */}
        <div className="flex items-center gap-4">
          {" "}
          {/* Left Group: Keeps items together */}
          <div className="flex gap-2">
            {" "}
            {/* Just the arrows */}
            <button onClick={handlePrev} className="p-2 border rounded">
              {" "}
              &lt;{" "}
            </button>
            <button onClick={handleNext} className="p-2 border rounded">
              {" "}
              &gt;{" "}
            </button>
          </div>
          <h2 className="text-2xl font-bold">January 2026</h2>
        </div>
        <div className="Search Bar">{/* We will put your SearchBarCalendar here next */}</div>
      </div>

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
