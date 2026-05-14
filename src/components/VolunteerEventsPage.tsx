"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRole } from "@/hooks/useRole";
import styles from "@/styles/VolunteerEventsPage.module.css";
import VolunteerEventCard from "@/components/VolunteerEventCard";
import AdminEventCard from "@/components/AdminEventCard";
import { AppEvent, MOCK_EVENTS } from "@/data/events";

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

export default function VolunteerEventsPage() {
  const role = useRole();
  const { isLoaded } = useUser();
  const isAdminView = role === "admin";
  const events = MOCK_EVENTS;

  const curYear = new Date().getFullYear();
  const [upStart, setUpStart] = useState(new Date(curYear, 0, 1));
  const [upEnd, setUpEnd] = useState(new Date(curYear, 11, 31));
  const [pastStart, setPastStart] = useState(new Date(curYear, 0, 1));
  const [pastEnd, setPastEnd] = useState(new Date(curYear, 11, 31));

  if (!isLoaded) return null;

  const upcoming = events.filter((e) => e.section === "upcoming" && upStart <= e.date && e.date <= upEnd);
  const past = events.filter((e) => e.section === "past" && pastStart <= e.date && e.date <= pastEnd);
  const upcomingSorted = [...upcoming].sort((a, b) => a.date.getTime() - b.date.getTime());
  const pastSorted = [...past].sort((a, b) => a.date.getTime() - b.date.getTime());

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
