"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/VolunteerEventsPage.module.css";
import { AppEvent, isUpcomingEvent } from "@/data/events";
// import { VolunteerStatus } from "@/data/events";

// function Status({ status }: { status: VolunteerStatus }) {
//   if (status === "none") return null;

//   const label = status === "missing_waiver" ? "Missing Waiver" : status === "attended" ? "Attended" : "Missed";

//   const className =
//     status === "missing_waiver"
//       ? styles.statusMissing
//       : status === "attended"
//         ? styles.statusAttended
//         : styles.statusMissed;

//   return (
//     <div className={`${styles.status} ${className}`}>
//       {status !== "missing_waiver" ? (
//         <span className={styles.statusIcon}>{status === "attended" ? "✓" : "✕"}</span>
//       ) : (
//         <span className={styles.statusIcon}>✕</span>
//       )}
//       <span>{label}</span>
//     </div>
//   );
// }

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function VolunteerEventCard({
  event,
  registered = false,
  registrationId,
}: {
  event: AppEvent;
  registered?: boolean;
  registrationId?: string;
}) {
  const router = useRouter();
  const [panelOpen, setPanelOpen] = useState(false);
  const [usesTapInteraction, setUsesTapInteraction] = useState(false);

  const monthLabel = event.startTime.toLocaleString("en-US", { month: "long" });
  const dayNumber = event.startTime.getDate();
  const canRegister = isUpcomingEvent(event);

  const detailsPath = `/events/${event.id}`;
  const registrationPath = `/events/${event.id}/register`;
  const editRegistrationPath = registrationId ? `/edit-registration/${registrationId}` : registrationPath;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: none) and (pointer: coarse)");
    const updateInteractionMode = () => setUsesTapInteraction(mediaQuery.matches);

    updateInteractionMode();
    mediaQuery.addEventListener("change", updateInteractionMode);

    return () => mediaQuery.removeEventListener("change", updateInteractionMode);
  }, []);

  return (
    <div
      className={`${styles.card} ${canRegister ? styles.cardHoverEnabled : ""} ${panelOpen ? styles.cardPanelOpen : ""}`}
      onClick={() => {
        if (usesTapInteraction) {
          setPanelOpen((open) => !open);
        }
      }}
    >
      <div className={styles.cardBg} style={event.imageUrl ? { backgroundImage: `url(${event.imageUrl})` } : {}} />
      <div className={styles.cardOverlay} />

      {/* <div className={styles.statusWrap}>
        <Status status={status} />
      </div> */}

      <div className={styles.cardContent}>
        <div className={styles.cardDate}>
          <div className={styles.cardMonth}>{monthLabel}</div>
          <div className={styles.cardDay}>{dayNumber}</div>
        </div>

        <div className={styles.cardLocation}>
          <span className={styles.pin}>📍</span>
          <span className={styles.school}>{event.location}</span>
        </div>
      </div>

      <div className={styles.hoverPanel}>
        <div className={styles.hoverPanelInner}>
          <div className={styles.hoverTitle}>
            {event.startTime.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className={styles.hoverText}>
            {formatTime(event.startTime)} - {formatTime(event.endTime)}
          </div>
          <div className={styles.hoverText}>{event.location}</div>

          {/* TODO: Fix this */}
          <div className={styles.hoverButtons}>
            <button
              type="button"
              className={styles.hoverBtnLight}
              onClick={(e) => {
                e.stopPropagation();
                router.push(detailsPath);
              }}
            >
              Event Info
            </button>

            <button
              type="button"
              className={styles.hoverBtnDark}
              onClick={(e) => {
                e.stopPropagation();
                router.push(registered ? editRegistrationPath : registrationPath);
              }}
            >
              {registered ? "Edit Registration" : "Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
