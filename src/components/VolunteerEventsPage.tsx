"use client";
import { useState } from "react";
import styles from "@/styles/VolunteerEventsPage.module.css";
import { AppEvent, MOCK_EVENTS, VolunteerStatus } from "@/data/events";

function Status({ status }: { status: VolunteerStatus }) {
  if (status === "none") return null;

  const label = status === "missing_waiver" ? "Missing Waiver" : status === "attended" ? "Attended" : "Missed";

  const className =
    status === "missing_waiver"
      ? styles.statusMissing
      : status === "attended"
        ? styles.statusAttended
        : styles.statusMissed;

  return (
    <div className={`${styles.status} ${className}`}>
      {status !== "missing_waiver" ? (
        <span className={styles.statusIcon}>{status === "attended" ? "✓" : "✕"}</span>
      ) : (
        <span className={styles.statusIcon}>✕</span>
      )}
      <span>{label}</span>
    </div>
  );
}

function EventCard({ event }: { event: AppEvent }) {
  const monthLabel = event.date.toLocaleString("en-US", { month: "long" });
  const dayNumber = event.date.getDate();
  const status = event.volunteerStatus ?? "none";

  return (
    <div className={`${styles.card} ${event.section === "upcoming" ? styles.cardHoverEnabled : ""}`}>
      <div className={styles.cardBg} style={{ backgroundImage: `url(${event.imageUrl})` }} />
      <div className={styles.cardOverlay} />

      <div className={styles.statusWrap}>
        <Status status={status} />
      </div>

      <div className={styles.cardContent}>
        <div className={styles.cardDate}>
          <div className={styles.cardMonth}>{monthLabel}</div>
          <div className={styles.cardDay}>{dayNumber}</div>
        </div>

        <div className={styles.cardLocation}>
          <span className={styles.pin}>📍</span>
          <span className={styles.school}>{event.school}</span>
        </div>
      </div>

      <div className={styles.hoverPanel}>
        <div className={styles.hoverPanelInner}>
          <div className={styles.hoverTitle}>
            {event.date.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className={styles.hoverText}>
            {event.startTime} - {event.endTime}
          </div>
          <div className={styles.hoverText}>{event.school}</div>

          <div className={styles.hoverButtons}>
            <button type="button" className={styles.hoverBtnLight}>
              {status === "missing_waiver" ? "Sign Waiver" : "Event Info"}
            </button>

            <button type="button" className={styles.hoverBtnDark}>
              Edit Registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
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
      <button type="button" className={styles.goButton} aria-label="Apply date range">
        →
      </button>
    </div>
  );
}

export default function VolunteerEventsPage() {
  const events = MOCK_EVENTS;

  const curYear = new Date().getFullYear();
  const [upStart, setUpStart] = useState(new Date(curYear, 0, 1));
  const [upEnd, setUpEnd] = useState(new Date(curYear, 11, 31));
  const [pastStart, setPastStart] = useState(new Date(curYear, 0, 1));
  const [pastEnd, setPastEnd] = useState(new Date(curYear, 11, 31));

  const upcoming = events.filter((e) => e.section === "upcoming" && upStart <= e.date && e.date <= upEnd);
  const past = events.filter((e) => e.section === "past" && pastStart <= e.date && e.date <= pastEnd);
  const upcomingSorted = [...upcoming].sort((a, b) => a.date.getTime() - b.date.getTime());
  const pastSorted = [...past].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Your Upcoming Events:</h2>

        <DateRangeControl start={upStart} end={upEnd} setStart={setUpStart} setEnd={setUpEnd} />

        <div className={styles.row}>
          {upcomingSorted.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Your Past Events:</h2>

        <DateRangeControl start={pastStart} end={pastEnd} setStart={setPastStart} setEnd={setPastEnd} />

        <div className={styles.row}>
          {pastSorted.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </main>
  );
}
