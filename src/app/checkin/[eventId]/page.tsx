"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import EventQrPage from "@/app/events/[eventId]/qr/page";
import CheckinModal from "../components/CheckinModal";
import RegisteredView from "../components/RegisteredView";
import NotRegisteredView from "../components/NotRegisteredView";
import NotLoggedInView from "../components/NotLoggedInView";
import styles from "../../../styles/CheckinOverlay.module.css";

type CheckinStatus = "loading" | "registered" | "not-registered" | "not-logged-in" | "error";

export default function CheckinOverlayPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn } = useUser();
  const eventId = params?.eventId as string;
  const [status, setStatus] = useState<CheckinStatus>("loading");
  const [volunteerName, setVolunteerName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!eventId || !isLoaded) return;

    if (!isSignedIn) {
      setStatus("not-logged-in");
      return;
    }

    let cancelled = false;

    async function checkInVolunteer() {
      setStatus("loading");
      setErrorMessage("");

      try {
        const response = await fetch(`/api/events/${eventId}/checkin`, {
          method: "POST",
          cache: "no-store",
        });
        const data = (await response.json().catch(() => null)) as {
          status?: CheckinStatus;
          name?: string;
          error?: string;
        } | null;

        if (cancelled) return;

        if (response.status === 401) {
          setStatus("not-logged-in");
          return;
        }

        if (response.status === 404 || data?.status === "not-registered") {
          setStatus("not-registered");
          return;
        }

        if (!response.ok) {
          throw new Error(data?.error || "Failed to check in");
        }

        setVolunteerName(data?.name || "");
        setStatus("registered");
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : "Failed to check in");
          setStatus("error");
        }
      }
    }

    void checkInVolunteer();

    return () => {
      cancelled = true;
    };
  }, [eventId, isLoaded, isSignedIn]);

  const redirectPath = searchParams.get("redirect") || `/checkin/${eventId}`;

  return (
    <>
      <EventQrPage />

      <CheckinModal onClose={() => router.push(`/events/${eventId}/qr`)}>
        {status === "loading" && (
          <div className={styles.content}>
            <h2 className={styles.title}>Checking you in...</h2>
            <p className={styles.description}>Please wait while we confirm your registration.</p>
          </div>
        )}

        {status === "registered" && <RegisteredView eventId={eventId} volunteerName={volunteerName} />}

        {status === "not-registered" && <NotRegisteredView eventId={eventId} />}

        {status === "not-logged-in" && <NotLoggedInView eventId={eventId} redirectPath={redirectPath} />}

        {status === "error" && (
          <div className={styles.content}>
            <div className={styles.errorIcon}>!</div>
            <h2 className={styles.title}>Check-in Failed</h2>
            <p className={styles.description}>{errorMessage}</p>
            <button className={styles.primaryButton} onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        )}
      </CheckinModal>
    </>
  );
}
