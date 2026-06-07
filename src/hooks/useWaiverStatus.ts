"use client";

import { useEffect, useState } from "react";
import { AppEvent, isUpcomingEvent } from "@/data/events";

type WaiverStatusResponse = {
  waiverCompleted?: boolean;
  completedSchools?: string[];
  error?: string;
};

export function applyWaiverStatusToEvent(event: AppEvent, completedSchools: string[]): AppEvent {
  if (!isUpcomingEvent(event) || !event.location) {
    return event;
  }

  const normalizedEventSchool = normalizeSchool(event.location);
  const hasCompletedWaiver = completedSchools.includes(normalizedEventSchool);

  return {
    ...event,
    waiverSigned: hasCompletedWaiver,
  };
}

export function useWaiverStatus(enabled: boolean) {
  const [completedSchools, setCompletedSchools] = useState<string[]>([]);
  const [waiverCompleted, setWaiverCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setCompletedSchools([]);
      setWaiverCompleted(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const loadWaiverStatus = async () => {
      try {
        const response = await fetch("/api/me/waiver-status", {
          cache: "no-store",
        });

        if (!response.ok) {
          if (response.status === 401) {
            if (!cancelled) {
              setCompletedSchools([]);
              setWaiverCompleted(false);
              setError("unauthorized");
            }
            return;
          }

          const failed = (await response.json().catch(() => null)) as WaiverStatusResponse | null;

          throw new Error(failed?.error || "Failed to load waiver status");
        }

        const data = (await response.json()) as WaiverStatusResponse;

        if (!cancelled) {
          setWaiverCompleted(Boolean(data.waiverCompleted));
          setCompletedSchools(Array.isArray(data.completedSchools) ? data.completedSchools : []);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setCompletedSchools([]);
          setWaiverCompleted(false);
          setError(err instanceof Error ? err.message : "Failed to load waiver status");
        }
      }
    };

    loadWaiverStatus();

    const interval = setInterval(loadWaiverStatus, 5000);
    window.addEventListener("focus", loadWaiverStatus);

    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener("focus", loadWaiverStatus);
    };
  }, [enabled]);

  return { waiverCompleted, completedSchools, error };
}

function normalizeSchool(school: string): string {
  return school.toLowerCase().trim().replace(/\./g, "").replace(/\s+/g, " ");
}
