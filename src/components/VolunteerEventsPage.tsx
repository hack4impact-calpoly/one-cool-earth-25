"use client";
import { useMemo, useState } from "react";
import styles from "@/styles/VolunteerEventsPage.module.css";

type VolunteerStatus = "missing_waiver" | "attended" | "missed" | "none";

type EventItem = {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  school: string;
  imageUrl: string;
  section: "upcoming" | "past";
  status: VolunteerStatus;
};

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

function EventCard({ event }: { event: EventItem }) {
  const monthLabel = event.date.toLocaleString("en-US", { month: "long" });
  const dayNumber = event.date.getDate();

  return (
    <div className={`${styles.card} ${event.section === "upcoming" ? styles.cardHoverEnabled : ""}`}>
      <div className={styles.cardBg} style={{ backgroundImage: `url(${event.imageUrl})` }} />
      <div className={styles.cardOverlay} />

      <div className={styles.statusWrap}>
        <Status status={event.status} />
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
              {event.status === "missing_waiver" ? "Sign Waiver" : "Event Info"}
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
  //Example Event Data
  //Images stored in public/images
  const events = useMemo<EventItem[]>(
    () => [
      {
        id: "u1",
        date: new Date(2026, 0, 1),
        startTime: "11:00 am",
        endTime: "12:00 pm",
        school: "Test Elementary",
        imageUrl: "/images/example1.jpg",
        section: "upcoming",
        status: "none",
      },
      {
        id: "u2",
        date: new Date(2026, 0, 2),
        startTime: "11:00 am",
        endTime: "12:00 pm",
        school: "Test 1 Elementary",
        imageUrl: "/images/example.jpg",
        section: "upcoming",
        status: "missing_waiver",
      },
      {
        id: "u3",
        date: new Date(2026, 0, 3),
        startTime: "11:00 am",
        endTime: "12:00 pm",
        school: "Test 2 Elementary",
        imageUrl: "/images/example.jpg",
        section: "upcoming",
        status: "missing_waiver",
      },
      {
        id: "u4",
        date: new Date(2026, 0, 4),
        startTime: "11:00 am",
        endTime: "12:00 pm",
        school: "Test 3 Elementary",
        imageUrl: "/images/example.jpeg",
        section: "upcoming",
        status: "none",
      },
      {
        id: "u5",
        date: new Date(2026, 0, 5),
        startTime: "11:00 am",
        endTime: "12:00 pm",
        school: "Test 4 Elementary",
        imageUrl: "/images/example.jpeg",
        section: "upcoming",
        status: "missing_waiver",
      },
      {
        id: "u6",
        date: new Date(2026, 1, 1),
        startTime: "11:00 am",
        endTime: "12:00 pm",
        school: "Test 5 Elementary",
        imageUrl: "/images/example.jpg",
        section: "upcoming",
        status: "none",
      },

      {
        id: "p1",
        date: new Date(2026, 1, 1),
        startTime: "11:00 am",
        endTime: "12:00 pm",
        school: "Test 6 Elementary",
        imageUrl: "/images/example.jpg",
        section: "past",
        status: "missed",
      },
      {
        id: "p2",
        date: new Date(2026, 1, 2),
        startTime: "11:00 am",
        endTime: "12:00 pm",
        school: "Test 7 Elementary",
        imageUrl: "/images/example.jpg",
        section: "past",
        status: "attended",
      },
      {
        id: "p3",
        date: new Date(2026, 1, 3),
        startTime: "11:00 am",
        endTime: "12:00 pm",
        school: "Test 8 Elementary",
        imageUrl: "/images/example.jpeg",
        section: "past",
        status: "attended",
      },
      {
        id: "p4",
        date: new Date(2026, 2, 1),
        startTime: "11:00 am",
        endTime: "12:00 pm",
        school: "Test 9 Elementary",
        imageUrl: "/images/example.jpg",
        section: "past",
        status: "missed",
      },
      {
        id: "p5",
        date: new Date(2026, 1, 1),
        startTime: "11:00 am",
        endTime: "12:00 pm",
        school: "Test 10 Elementary",
        imageUrl: "/images/example.jpg",
        section: "past",
        status: "attended",
      },
      {
        id: "p6",
        date: new Date(2026, 3, 4),
        startTime: "11:00 am",
        endTime: "12:00 pm",
        school: "Test 11 Elementary",
        imageUrl: "/images/example.jpg",
        section: "past",
        status: "attended",
      },
    ],
    [],
  );

  const curYear = new Date().getFullYear();
  const [upStart, setUpStart] = useState(new Date(curYear, 0, 1));
  const [upEnd, setUpEnd] = useState(new Date(curYear, 11, 31));
  const [pastStart, setPastStart] = useState(new Date(curYear, 0, 1));
  const [pastEnd, setPastEnd] = useState(new Date(curYear, 11, 31));

  const upcoming = events.filter((e) => e.section === "upcoming" && upStart <= e.date && e.date <= upEnd);
  const past = events.filter((e) => e.section === "past" && pastStart <= e.date && e.date <= pastEnd);

  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Your Upcoming Events:</h2>

        <DateRangeControl start={upStart} end={upEnd} setStart={setUpStart} setEnd={setUpEnd} />

        <div className={styles.row}>
          {upcoming.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Your Past Events:</h2>

        <DateRangeControl start={pastStart} end={pastEnd} setStart={setPastStart} setEnd={setPastEnd} />

        <div className={styles.row}>
          {past.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </main>
  );
}
