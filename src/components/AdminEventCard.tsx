"use client";
import { useRouter } from "next/navigation";
import styles from "@/styles/VolunteerEventsPage.module.css";
import { AppEvent } from "@/data/events";

function getOrdinalDay(day: number) {
  const suffix = day > 3 && day < 21 ? "th" : ["th", "st", "nd", "rd"][day % 10] || "th";
  return `${day}${suffix}`;
}

function formatLongDate(date: Date) {
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const month = date.toLocaleDateString("en-US", { month: "long" });
  return `${weekday}, ${month} ${getOrdinalDay(date.getDate())}`;
}

export default function AdminEventCard({ event }: { event: AppEvent }) {
  const monthLabel = event.date.toLocaleString("en-US", { month: "long" });
  const dayLabel = getOrdinalDay(event.date.getDate());
  const router = useRouter();
  const eventHref = `/events/${event.id}`;

  return (
    <div className={`${styles.card} ${styles.cardHoverEnabled} ${styles.adminCard}`}>
      <div className={styles.cardBg} style={{ backgroundImage: `url(${event.imageUrl})` }} />
      <div className={styles.cardOverlay} />

      <div className={styles.adminStatusWrap}>
        <div className={styles.registered}>Registered: {event.registeredCount}</div>
        {event.section === "past" && (
          <div className={styles.attendance}>
            Attended: {event.attendanceCount ?? "—"}/{event.registeredCount}
          </div>
        )}
      </div>

      <div className={styles.cardContent}>
        <div className={styles.cardDate}>
          <div className={styles.cardMonth}>{monthLabel}</div>
          <div className={styles.cardDay}>{dayLabel}</div>
        </div>

        <div className={styles.cardLocation}>
          <span className={styles.pin}>📍</span>
          <span className={styles.school}>{event.school}</span>
        </div>
      </div>

      <div className={styles.hoverPanel}>
        <div className={styles.hoverPanelInner}>
          <div className={styles.hoverTitle}>{formatLongDate(event.date)}</div>
          <div className={styles.hoverText}>
            {event.startTime} - {event.endTime}
          </div>
          <div className={styles.hoverText}>{event.school}</div>

          <div className={styles.hoverButtons}>
            <button type="button" className={styles.hoverBtnLight} onClick={() => router.push(eventHref)}>
              Edit Event
            </button>

            <button type="button" className={styles.hoverBtnDark} onClick={() => router.push(eventHref)}>
              {event.section === "past" ? "Event Report" : "View Event Info"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
