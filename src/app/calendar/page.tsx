"use client";
import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Import the icons
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button } from "@mui/material";
import EventCard from "../../components/EventCard";
import "@/app/globals.css";
import Navbar from "../../components/Navbar";

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

  const handleReset = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();

      setViewDate(new Date());
    }
  };

  const events = [];
  for (let i = 0; i < 10; i++) {
    events[i] = { eventTitle: "Gardening", date: new Date() };
  }
  return (
    <div>
      <Navbar mode={"VolunteerLoggedIn"} />
      <div className="p-8 font-lora">
        <div className="text-4xl font-bold">Upcoming Events</div>
        <div className="flex justify-start flex-nowrap overflow-x-scroll">
          {events.map((event, idx) => {
            return <EventCard key={idx} eventTitle={event.eventTitle} date={event.date} />;
          })}
        </div>
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
            <h2 className="text-2xl font-bold">
              {viewDate.toLocaleString("default", { month: "long", year: "numeric" })}
            </h2>
          </div>
          <div>
            <Button className="hover:opacity-70 transition-opacity" variant="outlined" onClick={handleReset}>
              Today
            </Button>
          </div>
          <div className="w-[291px] h-[50px] flex-shrink-0">
            <input
              type="text"
              placeholder="Search"
              className="w-full h-full border-none rounded-full bg-[#D1E3F0] px-6 text-xl font-bold text-black placeholder:text-black placeholder:opacity-100 focus:outline-none"
            />
          </div>
        </div>

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={false}
          height="auto"
        />
      </div>
    </div>
  );
}
