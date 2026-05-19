"use client";

import { useState, useEffect, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { LoaderCircle } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { applyWaiverStatusToEvent, useWaiverStatus } from "@/hooks/useWaiverStatus";
import styles from "@/styles/VolunteerEventsPage.module.css";
import VolunteerEventCard from "@/components/VolunteerEventCard";
import AdminEventCard from "@/components/AdminEventCard";
import { AppEvent, isPastEvent, isUpcomingEvent } from "@/data/events";

type RegistrationEvent = {
  _id?: string;
  id?: string;
};

type UserRegistration = {
  _id?: string;
  eventId?: string | RegistrationEvent | null;
};

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
    </div>
  );
}

function EventCardList({
  events,
  isAdminView,
  emptyMessage,
  registrationIdsByEventId,
}: {
  events: AppEvent[];
  isAdminView: boolean;
  emptyMessage: string;
  registrationIdsByEventId?: Record<string, string>;
}) {
  return (
    <div className={styles.row}>
      {events.length === 0 ? (
        <div className={styles.emptyEventCard}>{emptyMessage}</div>
      ) : (
        events.map((event) =>
          isAdminView ? (
            <AdminEventCard key={event.id} event={event} />
          ) : (
            <VolunteerEventCard
              key={event.id}
              event={event}
              registered
              registrationId={registrationIdsByEventId?.[event.id]}
            />
          ),
        )
      )}
    </div>
  );
}

function isInDateRange(date: Date, start: Date, end: Date) {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  return startDay <= day && day <= endDay;
}

// Not only Volunteer, renders both Volunteer and Admin
export default function VolunteerEventsPage() {
  const role = useRole();
  const { isLoaded, user } = useUser();
  const isAdminView = role === "admin";
  const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  const { completedSchools } = useWaiverStatus(isLoaded && !isAdminView);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [registrationIdsByEventId, setRegistrationIdsByEventId] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const curYear = new Date().getFullYear();
  const [upStart, setUpStart] = useState(new Date(curYear, 0, 1));
  const [upEnd, setUpEnd] = useState(new Date(curYear, 11, 31));
  const [pastStart, setPastStart] = useState(new Date(curYear, 0, 1));
  const [pastEnd, setPastEnd] = useState(new Date(curYear, 11, 31));

  useEffect(() => {
    const fetchEvents = async () => {
      if (!isLoaded) return;

      try {
        setLoading(true);
        const response = await fetch("/api/events");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Failed to fetch events");
        }

        const formattedEvents: AppEvent[] = data.map((event: AppEvent) => ({
          ...event,
          startTime: new Date(event.startTime),
          endTime: new Date(event.endTime),
        }));

        if (isAdminView) {
          setEvents(formattedEvents);
          setRegistrationIdsByEventId({});
          return;
        }

        if (!userEmail) {
          setEvents([]);
          setRegistrationIdsByEventId({});
          return;
        }

        const registrationResponse = await fetch(`/api/events/registration/users/${encodeURIComponent(userEmail)}`);
        const registrationData = await registrationResponse.json();

        if (!registrationResponse.ok) {
          throw new Error(registrationData?.error || "Failed to fetch registrations");
        }

        const nextRegistrationIdsByEventId = (registrationData.registrations as UserRegistration[]).reduce<
          Record<string, string>
        >((result, registration) => {
          const eventId = registration.eventId;

          if (!eventId || !registration._id) return result;

          const id = typeof eventId === "string" ? eventId : eventId.id || eventId._id;
          if (id) {
            result[id] = registration._id;
          }

          return result;
        }, {});

        setRegistrationIdsByEventId(nextRegistrationIdsByEventId);
        setEvents(formattedEvents.filter((event) => nextRegistrationIdsByEventId[event.id]));
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [isAdminView, isLoaded, userEmail]);

  const eventsWithWaiverStatus = useMemo(() => {
    if (isAdminView || completedSchools === null) {
      return events;
    }

    return events.map((event) => applyWaiverStatusToEvent(event, completedSchools));
  }, [events, isAdminView, completedSchools]);

  if (!isLoaded || loading) {
    return (
      <main className={styles.pageLoading} aria-live="polite">
        <LoaderCircle className={styles.loadingIcon} aria-hidden="true" />
        <span>Loading events...</span>
      </main>
    );
  }

  const upcoming = eventsWithWaiverStatus.filter(
    (e) => isUpcomingEvent(e) && isInDateRange(e.startTime, upStart, upEnd),
  );
  const past = eventsWithWaiverStatus.filter((e) => isPastEvent(e) && isInDateRange(e.startTime, pastStart, pastEnd));

  const upcomingSorted = [...upcoming].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  const pastSorted = [...past].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{isAdminView ? "Upcoming Events:" : "Your Upcoming Events:"}</h2>

        <DateRangeControl start={upStart} end={upEnd} setStart={setUpStart} setEnd={setUpEnd} />

        <EventCardList
          events={upcomingSorted}
          isAdminView={isAdminView}
          emptyMessage={isAdminView ? "No upcoming events" : "No upcoming registrations"}
          registrationIdsByEventId={registrationIdsByEventId}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{isAdminView ? "Past Events:" : "Your Past Events:"}</h2>

        <DateRangeControl start={pastStart} end={pastEnd} setStart={setPastStart} setEnd={setPastEnd} />

        <EventCardList
          events={pastSorted}
          isAdminView={isAdminView}
          emptyMessage={isAdminView ? "No past events" : "No past registrations"}
          registrationIdsByEventId={registrationIdsByEventId}
        />
      </section>
    </main>
  );
}
