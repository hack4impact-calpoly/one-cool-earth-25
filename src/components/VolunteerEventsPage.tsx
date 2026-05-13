"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRole } from "@/hooks/useRole";
import styles from "@/styles/VolunteerEventsPage.module.css";
import VolunteerEventCard from "@/components/VolunteerEventCard";
import AdminEventCard from "@/components/AdminEventCard";
import { AppEvent, MOCK_EVENTS } from "@/data/events";

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromDateInputValue(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function endOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999).getTime();
}

function isDateInRange(date: Date, start: Date, end: Date) {
  const dateTime = date.getTime();
  return startOfLocalDay(start) <= dateTime && dateTime <= endOfLocalDay(end);
}

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
  const [draftStart, setDraftStart] = useState(toDateInputValue(start));
  const [draftEnd, setDraftEnd] = useState(toDateInputValue(end));

  useEffect(() => {
    setDraftStart(toDateInputValue(start));
  }, [start]);

  useEffect(() => {
    setDraftEnd(toDateInputValue(end));
  }, [end]);

  const applyDateRange = () => {
    if (draftStart === "" || draftEnd === "") return;
    setStart(fromDateInputValue(draftStart));
    setEnd(fromDateInputValue(draftEnd));
  };

  return (
    <div className={styles.dateRow}>
      <input
        type="date"
        className={styles.dateInput}
        value={draftStart}
        onChange={(e) => {
          setDraftStart(e.target.value);
        }}
      />
      <div className={styles.toBox}>to</div>
      <input
        type="date"
        className={styles.dateInput}
        value={draftEnd}
        onChange={(e) => {
          setDraftEnd(e.target.value);
        }}
      />
      <button
        type="button"
        className={styles.goButton}
        aria-label="Apply date range"
        onClick={applyDateRange}
        disabled={draftStart === "" || draftEnd === ""}
      >
        →
      </button>
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

  const upcoming = events.filter((e) => e.section === "upcoming" && isDateInRange(e.date, upStart, upEnd));
  const past = events.filter((e) => e.section === "past" && isDateInRange(e.date, pastStart, pastEnd));
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
