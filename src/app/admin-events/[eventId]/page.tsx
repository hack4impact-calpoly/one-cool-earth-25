"use client";

import { useParams, useRouter } from "next/navigation";
import NavBarWrapper from "@/components/NavbarWrapper";
import EventDetails from "@/components/EventDetails";
import VolunteerList from "@/components/VolunteerList";
import styles from "@/styles/events.module.css";
import { MOCK_EVENTS } from "@/data/events";

function toDateTime(date: Date, time: string) {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
  if (!match) return new Date(date);

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toLowerCase();

  if (meridiem === "pm" && hours !== 12) hours += 12;
  if (meridiem === "am" && hours === 12) hours = 0;

  const value = new Date(date);
  value.setHours(hours, minutes, 0, 0);
  return value;
}

export default function AdminEventPage() {
  const isAdminView = true;
  const router = useRouter();
  const params = useParams();
  const eventId = params?.eventId as string;
  const event = MOCK_EVENTS.find((item) => item.id === eventId);
  const eventDetailsData = event
    ? {
        name: event.title,
        description: `Admin view for ${event.school}. Manage details, attendance, and follow-ups.`,
        location: event.school,
        startDateTime: toDateTime(event.date, event.startTime),
        endDateTime: toDateTime(event.date, event.endTime),
        imageUrl: event.imageUrl,
      }
    : undefined;

  return (
    <div className={styles.page}>
      <NavBarWrapper />
      <main className={styles.main}>
        {isAdminView && (
          <div className="mb-3 flex justify-end">
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => router.push(`/admin-events/${eventId}/qr`)}
              aria-label="Go to QR code"
              title="Go to QR code"
            >
              <span className="grid h-[18px] w-[18px] grid-cols-2 gap-[3px]" aria-hidden="true">
                <span className="rounded-[2px] bg-[#111827]" />
                <span className="rounded-[2px] bg-[#111827]" />
                <span className="rounded-[2px] bg-[#111827]" />
                <span className="rounded-[2px] bg-[#111827]" />
              </span>
            </button>
          </div>
        )}

        <h1 className={styles.pageTitle}>{event?.title ?? "Event Not Found"}</h1>

        <section className={styles.grid}>
          <div className={styles.eventCard}>
            <EventDetails eventData={eventDetailsData} isEditable={isAdminView} />
          </div>
          <div className={styles.card}>
            <VolunteerList canViewVolunteers={isAdminView} />
          </div>
        </section>
      </main>
    </div>
  );
}
