"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRole } from "@/hooks/useRole";
import styles from "@/styles/VolunteerEventsPage.module.css";
import VolunteerEventCard from "@/components/VolunteerEventCard";
import AdminEventCard from "@/components/AdminEventCard";
import { AppEvent } from "@/data/events";

function DateRangeControl({
  start,
  end,
  setStart,
  setEnd,
}: {
  start: Date;
  end: Date;
  setStart: (d: Date) => void;
  setEnd: (d: Date) => void;
}) {
  const toInput = (d: Date) => d.toISOString().slice(0, 10);
  const fromInputLocal = (value: string) => {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  return (
    <div className={styles.dateRow}>
      <input
        type="date"
        className={styles.dateInput}
        value={toInput(start)}
        onChange={(e) => {
          if (e.target.value === "") return;
          setStart(fromInputLocal(e.target.value));
        }}
      />
      <div className={styles.toBox}>to</div>
      <input
        type="date"
        className={styles.dateInput}
        value={toInput(end)}
        onChange={(e) => {
          if (e.target.value === "") return;
          setEnd(fromInputLocal(e.target.value));
        }}
      />
    </div>
  );
}

function EventCardList({ events, isAdminView }: { events: AppEvent[]; isAdminView: boolean }) {
  return (
    <div className={styles.row}>
      {events.map((event) =>
        isAdminView ? (
          <AdminEventCard key={event.id} event={event} />
        ) : (
          <VolunteerEventCard key={event.id} event={event} />
        ),
      )}
    </div>
  );
}

// Not only Volunteer, renders both Volunteer and Admin
export default function VolunteerEventsPage() {
  const role = useRole();
  const { isLoaded } = useUser();
  const isAdminView = role === "admin";
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const curYear = new Date().getFullYear();
  const [upStart, setUpStart] = useState(new Date(curYear, 0, 1));
  const [upEnd, setUpEnd] = useState(new Date(curYear, 11, 31));
  const [pastStart, setPastStart] = useState(new Date(curYear, 0, 1));
  const [pastEnd, setPastEnd] = useState(new Date(curYear, 11, 31));

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

  if (!isLoaded || loading) return null;

  const upcoming = events.filter((e) => e.section === "upcoming" && upStart <= e.startTime && e.startTime <= upEnd);
  const past = events.filter((e) => e.section === "past" && pastStart <= e.startTime && e.startTime <= pastEnd);

  const upcomingSorted = [...upcoming].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  const pastSorted = [...past].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{isAdminView ? "Upcoming Events:" : "Your Upcoming Events:"}</h2>

        <DateRangeControl start={upStart} end={upEnd} setStart={setUpStart} setEnd={setUpEnd} />

        <EventCardList events={upcomingSorted} isAdminView={isAdminView} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{isAdminView ? "Past Events:" : "Your Past Events:"}</h2>

        <DateRangeControl start={pastStart} end={pastEnd} setStart={setPastStart} setEnd={setPastEnd} />

        <EventCardList events={pastSorted} isAdminView={isAdminView} />
      </section>
    </main>
  );
}
