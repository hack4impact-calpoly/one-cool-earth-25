"use client";
import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Import the icons
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function CalendarPage() {
  const calendarRef = useRef<FullCalendar>(null);
  const [viewDate, setViewDate] = useState(new Date());
  const today = new Date();
  const handleNext = () => {
    if (calendarRef.current) {
      const threeMonthsAhead = new Date(today.getFullYear(), today.getMonth() + 3, 1);

      if (viewDate < threeMonthsAhead) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.next();
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
        setViewDate(newDate);
      } else {
        console.log("Limit Reached, can't go ahead more than three months");
      }
    }
  };
  const handlePrev = () => {
    if (calendarRef.current) {
      const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      if (viewDate > oneMonthAgo) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.prev();

        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
        setViewDate(newDate);
      } else {
        console.log("Limit reached: Cannot go back further than 1 month.");
      }
    }
  };
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        {" "}
        <div className="flex items-center gap-4">
          {" "}
          <div className="flex gap-2">
            <button onClick={handlePrev} className="hover:opacity-70 transition-opacity">
              <ChevronLeft size={40} color="#BEBEBE" />
            </button>
            <button onClick={handleNext} className="hover:opacity-70 transition-opacity">
              <ChevronRight size={40} color="#BEBEBE" />
            </button>
          </div>
          <h2 className="text-2xl font-bold">January 2026</h2>
        </div>
        <div className="Search Bar"></div>
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
