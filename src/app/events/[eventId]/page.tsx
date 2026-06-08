"use client";

import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { LoaderCircle } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import EventDetails from "@/components/EventDetails";
import VolunteerList from "@/components/VolunteerList";
import NavBarWrapper from "@/components/NavbarWrapper";
import styles from "@/styles/events.module.css";
import { useEffect, useState } from "react";
import { AppEvent, isUpcomingEvent } from "@/data/events";

type RegistrationLookup = {
  _id: string;
  eventId?: {
    _id?: string;
    id?: string;
  };
};

export default function EventPage() {
  const role = useRole();
  const { isLoaded, isSignedIn, user } = useUser();
  const isAdminView = role === "admin";
  const isVolunteerView = !isAdminView;
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const eventId = params?.eventId as string;
  const [event, setEvent] = useState<AppEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const showRegistrationConfirmation = searchParams.get("registered") === "1";

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

  useEffect(() => {
    if (!isLoaded || !isSignedIn || isAdminView || !eventId) {
      setRegistrationId(null);
      return;
    }

    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      setRegistrationId(null);
      return;
    }
    const encodedUserEmail = encodeURIComponent(userEmail);

    async function fetchRegistrationStatus() {
      try {
        const response = await fetch(`/api/events/registration/users/${encodedUserEmail}`, {
          cache: "no-store",
        });
        const data = (await response.json().catch(() => null)) as { registrations?: RegistrationLookup[] } | null;

        if (!response.ok) {
          throw new Error("Failed to fetch registration status");
        }

        const matchingRegistration = data?.registrations?.find((registration) => {
          const populatedId = registration.eventId?._id ?? registration.eventId?.id ?? registration.eventId;
          return String(populatedId) === eventId;
        });

        setRegistrationId(matchingRegistration?._id ?? null);
      } catch (error) {
        console.error("Failed to fetch registration status:", error);
        setRegistrationId(null);
      }
    }

    void fetchRegistrationStatus();
  }, [eventId, isAdminView, isLoaded, isSignedIn, user?.primaryEmailAddress?.emailAddress]);

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

        {showRegistrationConfirmation && (
          <div className={styles.confirmationBanner}>Registration confirmed. You are signed up for this event.</div>
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
            {isVolunteerView && event ? (
              <div className={styles.volunteerActions}>
                {registrationId ? (
                  <>
                    <button
                      type="button"
                      className={styles.primaryAction}
                      onClick={() => router.push(`/checkin/${eventId}`)}
                    >
                      Check In
                    </button>
                    <button
                      type="button"
                      className={styles.secondaryAction}
                      onClick={() => router.push(`/edit-registration/${registrationId}`)}
                    >
                      Edit Registration
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className={styles.primaryAction}
                    onClick={() => router.push(isUpcomingEvent(event) ? `/events/${eventId}/register` : "/calendar")}
                  >
                    {isUpcomingEvent(event) ? "Register for This Event" : "Back to Calendar"}
                  </button>
                )}
              </div>
            ) : null}
          </div>

          {isAdminView && <VolunteerList canViewVolunteers eventId={eventId} />}
        </section>
      </main>
    </div>
  );
}
