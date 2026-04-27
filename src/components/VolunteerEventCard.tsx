"use client";
import styles from "@/styles/VolunteerEventsPage.module.css";
import { AppEvent, VolunteerStatus } from "@/data/events";

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

export default function VolunteerEventCard({ event }: { event: AppEvent }) {
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
