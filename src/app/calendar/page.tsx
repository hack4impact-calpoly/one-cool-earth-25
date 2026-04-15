"use client";
import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button } from "@mui/material";
import VolunteerEventCard from "@/components/VolunteerEventCard";
import styles from "@/styles/VolunteerEventsPage.module.css";
import { MOCK_EVENTS } from "@/data/events";
import NavBarWrapper from "../../components/NavbarWrapper";

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  description?: string;
  location?: string;
}

export default function CalendarPage() {
  const calendarRef = useRef<FullCalendar>(null);
  const [viewDate, setViewDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Failed to fetch events");
        }

        setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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

  const upcomingCardEvents = MOCK_EVENTS.filter((event) => event.section === "upcoming");

  return (
    <div>
      <NavBarWrapper />
      <div className="p-8 font-lora">
        <div className="text-4xl font-bold">Upcoming Events</div>

        <div className={styles.row}>
          {upcomingCardEvents.map((event) => (
            <VolunteerEventCard key={event.id} event={event} />
          ))}
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
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

        {loading ? <div className="py-4 text-lg">Loading events...</div> : null}

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          events={events}
          initialView="dayGridMonth"
          headerToolbar={false}
          height="auto"
        />
      </div>
    </div>
  );
}
