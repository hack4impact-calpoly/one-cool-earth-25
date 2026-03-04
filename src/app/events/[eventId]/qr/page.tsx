"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import QRCode from "qrcode";

export default function EventQrPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.eventId as string;

  const [qrDataUrl, setQrDataUrl] = useState("");

  const checkinUrl = useMemo(() => {
    return `${window.location.origin}/checkin/${eventId}`;
  }, [eventId]);

  useEffect(() => {
    (async () => {
      const dataUrl = await QRCode.toDataURL(checkinUrl, {
        width: 280, // ✅ closer to mock
        margin: 1,
        errorCorrectionLevel: "M",
      });
      setQrDataUrl(dataUrl);
    })();
  }, [checkinUrl]);

  return (
    <div style={styles.shell}>
      {/* Top row */}
      <div style={styles.topRow}>
        <div>
          <h1 style={styles.title}>Garden Workday</h1>
          <div style={styles.meta}>Los Osos Elementary</div>
          <div style={styles.meta}>3/11/25</div>
        </div>

        <button onClick={() => router.push(`/events/${eventId}`)} style={styles.backBtn}>
          ← Back to Events
        </button>
      </div>

      {/* Center QR */}
      <div style={styles.center}>
        {qrDataUrl && <img src={qrDataUrl} alt="Event QR" style={styles.qr} />}
        <div style={styles.caption}>Please scan to log your attendance!</div>
      </div>

      {/* Print icon bottom-right */}
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
