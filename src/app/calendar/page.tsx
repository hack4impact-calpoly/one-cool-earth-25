"use client";
import React, { useEffect, useRef, useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, ChevronsUpDown, House, Leaf, Shovel, Sprout } from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import SearchResultList from "@/components/SearchResultList";
import { Button } from "@mui/material";
import VolunteerEventCard from "@/components/VolunteerEventCard";
import styles from "@/styles/VolunteerEventsPage.module.css";
import calendarStyles from "@/styles/CalendarPage.module.css";
import NavBarWrapper from "../../components/NavbarWrapper";
import AdminEventCard from "@/components/AdminEventCard";
import { AppEvent } from "@/data/events";
import { useRole } from "@/hooks/useRole";
import CreateEventModal from "@/components/CreateEventModal";

export default function CalendarPage() {
  const role = useRole();
  const isAdmin = role === "admin";
  const calendarRef = useRef<FullCalendar>(null);
  const [viewDate, setViewDate] = useState(new Date());
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<AppEvent[]>([]);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [learnMoreOpen, setLearnMoreOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const today = new Date();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Failed to fetch events");
        }

        const formattedEvents = data.map((event: AppEvent) => ({
          ...event,
          startTime: new Date(event.startTime),
          endTime: new Date(event.endTime),
        }));

        setEvents(formattedEvents);
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

  const handleEventCreated = async () => {
    setIsCreateModalOpen(false);
    try {
      const response = await fetch("/api/events");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to fetch events");
      }

      const formattedEvents = data.map((event: AppEvent) => ({
        ...event,
        startTime: new Date(event.startTime),
        endTime: new Date(event.endTime),
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Failed to refresh events:", error);
    }
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);

    if (value === "") {
      setSearchResults([]);
      return;
    }

    const results = events.filter((event) => event.title.toLowerCase().includes(value.toLowerCase()));

    setSearchResults(results);
  };

  const upcomingCardEvents = events.filter((event) => {
    const now = new Date();
    return event.section === "upcoming" && now < event.startTime;
  });

  const responsibilities = [
    { label: "Planting", Icon: Leaf },
    { label: "Building Plant Beds", Icon: House },
    { label: "Weeding", Icon: Sprout },
    { label: "Spreading Mulch & Woodchips", Icon: Shovel },
    { label: "Creating Garden Art", Icon: BookOpen },
  ];

  console.log(isAdmin);
  return (
    <div>
      <NavBarWrapper />
      <div className={calendarStyles.page}>
        <h1 className={calendarStyles.pageTitle}>Upcoming Events</h1>
        {upcomingCardEvents.length != 0 ? (
          <div className={`${styles.row} ${calendarStyles.eventsRow}`}>
            {isAdmin
              ? upcomingCardEvents.map((event) => <AdminEventCard key={event.id} event={event} />)
              : upcomingCardEvents.map((event) => <VolunteerEventCard key={event.id} event={event} />)}
          </div>
        ) : (
          <div className="m-3 mx-10 text-3xl">Nothing for now... check back soon!</div>
        )}

        <section className={calendarStyles.responsibilitiesSection}>
          <h2 className={calendarStyles.responsibilitiesTitle}>Garden Workday Responsibilities</h2>
          <div className={calendarStyles.responsibilitiesGrid}>
            {responsibilities.map(({ label, Icon }) => (
              <div key={label} className={calendarStyles.responsibilityItem}>
                <Icon size={44} className={calendarStyles.responsibilityIcon} aria-hidden="true" />
                <span className={calendarStyles.responsibilityLabel}>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={calendarStyles.learnMoreSection}>
          <button
            type="button"
            className={calendarStyles.learnMoreButton}
            onClick={() => setLearnMoreOpen((open) => !open)}
            aria-expanded={learnMoreOpen}
          >
            <span>LEARN MORE</span>
            <ChevronsUpDown size={14} className={calendarStyles.learnMoreIcon} aria-hidden="true" />
          </button>

          {learnMoreOpen ? (
            <div className={calendarStyles.learnMoreContent}>
              <p>
                If you are interested in joining for a Garden Workday, please fill out our Volunteer Waiver which will
                be sent upon registration. At the day and time of the event, you will enter at the school front office
                and the staff will direct you to the garden. Please bring a hat, sunscreen, water, and wear closed-toed
                shoes.
              </p>
              <p>
                Workdays are weather dependent - it&apos;s always a good rule of thumb to call the office ahead of time
                to ensure that the event is a go.
              </p>
            </div>
          ) : null}
        </section>

        <div className={calendarStyles.controlsRow}>
          <div className={calendarStyles.controlsLeft}>
            <div className={calendarStyles.calendarNav}>
              <div className={calendarStyles.arrowGroup}>
                <button onClick={handlePrev} className="hover:opacity-70 transition-opacity">
                  <ChevronLeft size={40} color="#BEBEBE" />
                </button>

                <button onClick={handleNext} className="hover:opacity-70 transition-opacity">
                  <ChevronRight size={40} color="#BEBEBE" />
                </button>
              </div>

              <h2 className={calendarStyles.monthLabel}>
                {viewDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
            </div>

            <Button className={calendarStyles.todayButton} variant="contained" onClick={handleReset}>
              Today
            </Button>
          </div>

          <div className={calendarStyles.controlsRight}>
            {isAdmin && (
              <Button
                variant="contained"
                onClick={() => setIsCreateModalOpen(true)}
                className={calendarStyles.addEventButton}
              >
                Add Event
              </Button>
            )}

            <div className={`${calendarStyles.searchBox} relative flex-col`}>
              <div className="h-[50px] flex-shrink-0">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full h-full border-none rounded-full bg-[#D1E3F0] px-6 text-xl font-bold text-black placeholder:text-black placeholder:opacity-100 focus:outline-none"
                  value={searchInput}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white rounded-lg shadow-lg mt-2 z-50 max-h-60 overflow-y-auto">
                  <SearchResultList results={searchResults} />
                </div>
              )}
            </div>
          </div>
        </div>

        {loading ? <div className={calendarStyles.loadingText}>Loading events...</div> : null}

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          events={events.map((event) => ({
            id: event.id,
            title: event.title,
            start: event.startTime,
            end: event.endTime,
          }))}
          initialView="dayGridMonth"
          headerToolbar={false}
          height="auto"
        />
      </div>
      {isAdmin && (
        <CreateEventModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleEventCreated}
        />
      )}
    </div>
  );
}
