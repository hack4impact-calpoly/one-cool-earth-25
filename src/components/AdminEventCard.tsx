"use client";
import { useRouter } from "next/navigation";
import styles from "@/styles/AdminEventsPage.module.css";
import { AppEvent } from "@/data/events";

export default function AdminEventCard({ event }: { event: AppEvent }) {
  const monthLabel = event.date.toLocaleString("en-US", { month: "long" });
  const dayNumber = event.date.getDate();
  const router = useRouter();

  return (
    <div className={styles.card}>
      <div className={styles.cardBg} style={{ backgroundImage: `url(${event.imageUrl})` }} />
      <div className={styles.cardOverlay} />

      <div className={styles.admin}>
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
              Edit Event
            </button>

            <button
              type="button"
              className={styles.hoverBtnDark}
              onClick={() => router.push(`/admin-events/${event.id}`)}
            >
              {event.section === "past" ? "Event Report" : "View Event Info"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
