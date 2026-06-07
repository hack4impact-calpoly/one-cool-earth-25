"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const hasLoadedInitialStatus = useRef(false);

  const loadWaiverStatus = useCallback(async () => {
    if (!enabled) {
      setCompletedSchools([]);
      setWaiverCompleted(false);
      setError(null);
      setLoading(false);
      hasLoadedInitialStatus.current = false;
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/me/waiver-status", {
        cache: "no-store",
      });

      if (!response.ok) {
        if (response.status === 401) {
          setCompletedSchools([]);
          setWaiverCompleted(false);
          setError("unauthorized");
          return;
        }

        const failed = (await response.json().catch(() => null)) as WaiverStatusResponse | null;

        throw new Error(failed?.error || "Failed to load waiver status");
      }

      const data = (await response.json()) as WaiverStatusResponse;

      setWaiverCompleted(Boolean(data.waiverCompleted));
      setCompletedSchools(Array.isArray(data.completedSchools) ? data.completedSchools : []);
      setError(null);
    } catch (err) {
      setCompletedSchools([]);
      setWaiverCompleted(false);
      setError(err instanceof Error ? err.message : "Failed to load waiver status");
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (hasLoadedInitialStatus.current) {
      return;
    }

    hasLoadedInitialStatus.current = true;
    loadWaiverStatus();
  }, [loadWaiverStatus]);

  return { waiverCompleted, completedSchools, error, loading, refreshWaiverStatus: loadWaiverStatus };
}

function normalizeSchool(school: string): string {
  return school.toLowerCase().trim().replace(/\./g, "").replace(/\s+/g, " ");
}
