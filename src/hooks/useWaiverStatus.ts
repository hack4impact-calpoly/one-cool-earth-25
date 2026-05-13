"use client";

import { useEffect, useState } from "react";
import { AppEvent, isUpcomingEvent } from "@/data/events";

export type ApiWaiverStatus = "complete" | "incomplete";

type WaiverStatusResponse = {
  status?: ApiWaiverStatus;
  error?: string;
};

export function applyWaiverStatusToEvent(event: AppEvent, waiverStatus: ApiWaiverStatus): AppEvent {
  if (!isUpcomingEvent(event)) {
    return event;
  }

  return {
    ...event,
    waiverSigned: waiverStatus === "complete",
  };
}

export function useWaiverStatus(enabled: boolean) {
  const [status, setStatus] = useState<ApiWaiverStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setStatus(null);
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
              setStatus(null);
              setError("unauthorized");
            }
            return;
          }

          const failed = (await response.json().catch(() => null)) as WaiverStatusResponse | null;
          throw new Error(failed?.error || "Failed to load waiver status");
        }

        const data = (await response.json()) as WaiverStatusResponse;

        if (data.status === "complete" || data.status === "incomplete") {
          if (!cancelled) {
            setStatus(data.status);
            setError(null);
          }
          return;
        }

        throw new Error("Invalid waiver status response");
      } catch (err) {
        if (!cancelled) {
          setStatus(null);
          setError(err instanceof Error ? err.message : "Failed to load waiver status");
        }
      }
    };

    loadWaiverStatus();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { status, error };
}
