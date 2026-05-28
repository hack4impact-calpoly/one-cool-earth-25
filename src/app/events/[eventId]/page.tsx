"use client";

import { useRouter, useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { LoaderCircle } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import EventDetails from "@/components/EventDetails";
import VolunteerList from "@/components/VolunteerList";
import NavBarWrapper from "@/components/NavbarWrapper";
import styles from "@/styles/events.module.css";
import { useEffect, useState } from "react";
import { AppEvent } from "@/data/events";

export default function EventPage() {
  const role = useRole();
  const { isLoaded } = useUser();
  const isAdminView = role === "admin";
  const isVolunteerView = !isAdminView;
  const router = useRouter();
  const params = useParams();
  const eventId = params?.eventId as string;
  const [event, setEvent] = useState<AppEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Failed to fetch event");
        }

        const formattedEvent: AppEvent = {
          ...data,
          startTime: new Date(data.startTime),
          endTime: new Date(data.endTime),
        };

        setEvent(formattedEvent);
      } catch (error) {
        console.error("Failed to fetch event:", error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (!isLoaded || loading) {
    return (
      <div className={styles.page}>
        <NavBarWrapper />
        <main className={styles.pageLoading} aria-live="polite">
          <LoaderCircle className={styles.loadingIcon} aria-hidden="true" />
          <span>Loading event...</span>
        </main>
      </div>
    );
  }

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

        <div className={styles.titleRow}>
          <h1 className={styles.pageTitle}>{event?.title ?? "Event Not Found"}</h1>

          <button type="button" className={styles.backBtn} onClick={() => router.push("/calendar")}>
            ← Back to Calendar
          </button>
        </div>

        <section className={isAdminView ? styles.grid : styles.volunteerEventOnly}>
          <div className={isAdminView ? styles.eventCard : styles.fullEventCard}>
            <EventDetails event={event} isEditable={isAdminView} />
          </div>

          {isAdminView && <VolunteerList canViewVolunteers eventId={eventId} />}
        </section>
      </main>
    </div>
  );
}
