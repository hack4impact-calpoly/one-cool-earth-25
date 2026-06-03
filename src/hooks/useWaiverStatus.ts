"use client";

import { useEffect, useState } from "react";
import { AppEvent, isUpcomingEvent } from "@/data/events";

type WaiverStatusResponse = {
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
  const [completedSchools, setCompletedSchools] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setCompletedSchools(null);
      setError(null);
      return;
    }

    let cancelled = false;

    const loadWaiverStatus = async () => {
      try {
        const response = await fetch("/api/me/waiver-status", { cache: "no-store" });

        if (!response.ok) {
          if (response.status === 401) {
            if (!cancelled) {
              setCompletedSchools(null);
              setError("unauthorized");
            }
            return;
          }

          const failed = (await response.json().catch(() => null)) as WaiverStatusResponse | null;
          throw new Error(failed?.error || "Failed to load waiver status");
        }

        const data = (await response.json()) as WaiverStatusResponse;

        if (Array.isArray(data.completedSchools)) {
          if (!cancelled) {
            setCompletedSchools(data.completedSchools);
            setError(null);
          }
          return;
        }

        throw new Error("Invalid waiver status response");
      } catch (err) {
        if (!cancelled) {
          setCompletedSchools(null);
          setError(err instanceof Error ? err.message : "Failed to load waiver status");
        }
      }
    };

    loadWaiverStatus();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { completedSchools, error };
}

function normalizeSchool(school: string): string {
  return school.toLowerCase().trim().replace(/\./g, "").replace(/\s+/g, " ");
}
