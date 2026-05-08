"use client";

import { useRouter, useParams } from "next/navigation";
import EventDetails from "@/components/EventDetails";
import VolunteerList from "@/components/VolunteerList";
import NavBarWrapper from "@/components/NavbarWrapper";
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

export default function EventPage() {
  const isAdminView = false;
  const router = useRouter();
  const params = useParams();
  const eventId = params?.eventId as string;
  const event = MOCK_EVENTS.find((item) => item.id === eventId);
  const eventDetailsData = event
    ? {
        name: event.title,
        description: `Join us at ${event.school} for hands-on garden support and community impact.`,
        location: event.school,
        startDateTime: toDateTime(event.date, event.startTime),
        endDateTime: toDateTime(event.date, event.endTime),
        imageUrl: event.imageUrl,
      }
    : undefined;

  // Later: fetch event by eventId from Mongo.
  // For now, your EventDetails already has defaultData.
  return (
    <div className={styles.page}>
      <NavBarWrapper />
      <main className={styles.main}>
        {isAdminView && (
          <div className="mb-3 flex justify-end">
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => router.push(`/events/${eventId}/qr`)}
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
          <VolunteerList canViewVolunteers={isAdminView} />
        </section>
      </main>
    </div>
  );
}
