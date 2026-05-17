"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import QRCode from "qrcode";
import { AppEvent } from "@/data/events";

function formatDate(date: Date) {
  return `${date.getMonth() + 1}/${date.getDate()}/${String(date.getFullYear()).slice(-2)}`;
}

export default function EventQrPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.eventId as string;
  const [event, setEvent] = useState<AppEvent | null>(null);

  const [qrDataUrl, setQrDataUrl] = useState("");

  const checkinUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    if (!eventId) return;
    return `${window.location.origin}/checkin/${eventId}`;
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Failed to fetch event");
        }

        setEvent({
          ...data,
          startTime: new Date(data.startTime),
          endTime: new Date(data.endTime),
        });
      } catch (error) {
        console.error("Failed to fetch event:", error);
        setEvent(null);
      }
    };

    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    if (!checkinUrl) return;

    (async () => {
      const dataUrl = await QRCode.toDataURL(checkinUrl, {
        width: 280,
        margin: 1,
        errorCorrectionLevel: "M",
      });
      setQrDataUrl(dataUrl);
    })();
  }, [checkinUrl]);

  return (
    <div style={styles.shell}>
      <div style={styles.topRow}>
        <div>
          <h1 style={styles.title}>{event?.title ?? "Garden Workday"}</h1>
          <div style={styles.meta}>{event?.location ?? "Unknown Location"}</div>
          <div style={styles.meta}>{event ? formatDate(event.startTime) : ""}</div>
        </div>

        <button onClick={() => router.push(`/events/${eventId}`)} style={styles.backBtn}>
          ← Back to Event
        </button>
      </div>

      <div style={styles.center}>
        {qrDataUrl && <Image src={qrDataUrl} alt="Event QR" width={280} height={280} style={styles.qr} unoptimized />}
        <div style={styles.caption}>Please scan to log attendance!</div>
      </div>

      <button onClick={() => window.print()} style={styles.printBtn} aria-label="Print" title="Print">
        🖨
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  shell: {
    minHeight: "100vh",
    background: "white",
    padding: "24px 26px",
    position: "relative",
    fontFamily: "Lora, Georgia, serif",
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  title: {
    fontSize: 44,
    margin: 0,
    lineHeight: 1.05,
    fontWeight: 700,
  },

  meta: {
    marginTop: 6,
    fontSize: 16,
  },

  backBtn: {
    border: "1px solid #568264",
    background: "transparent",
    color: "#568264",
    borderRadius: 6,
    padding: "6px 12px",
    fontWeight: 700,
    cursor: "pointer",
    height: 34,
    marginTop: 6,
    whiteSpace: "nowrap",
  },

  center: {
    display: "grid",
    placeItems: "center",
    marginTop: 70,
  },

  qr: {
    width: 280,
    height: 280,
    imageRendering: "pixelated",
  },

  caption: {
    marginTop: 12,
    fontWeight: 700,
    fontSize: 16,
  },

  printBtn: {
    position: "absolute",
    right: 26,
    bottom: 26,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: 52,
    lineHeight: 1,
  },
};
