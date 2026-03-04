"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import EventQrPage from "@/app/events/[eventId]/qr/page";

export default function CheckinOverlayPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.eventId as string;

  return (
    <>
      {/* ✅ Render the QR page in the background */}
      <EventQrPage />

      {/* ✅ Dim overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.25)",
          zIndex: 20,
        }}
      />

      {/* ✅ Modal */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 21,
          display: "grid",
          placeItems: "center",
        }}
      >
        <div
          style={{
            width: 560,
            maxWidth: "90%",
            background: "white",
            borderRadius: 10,
            boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
            padding: "26px 26px 22px",
            textAlign: "center",
            fontFamily: "Lora, serif",
          }}
        >
          <button
            onClick={() => router.push(`/events/${eventId}/qr`)}
            style={{
              position: "absolute",
              right: 24,
              top: 18,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            ✕
          </button>

          <div style={{ fontSize: 34, color: "crimson", marginBottom: 8 }}>❗</div>

          <div style={{ fontSize: 34, fontWeight: 700, marginBottom: 14 }}>
            You Haven’t Registered for
            <br />
            this Event
          </div>

          <div style={{ height: 1, background: "#d1d5db", margin: "0 auto 16px", width: "86%" }} />

          <div style={{ fontFamily: "system-ui", fontSize: 14, marginBottom: 16 }}>
            Our records show you are not registered for <strong>“Garden Workday”</strong>.
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            <button
              style={{
                border: "1px solid #86efac",
                background: "#dcfce7",
                borderRadius: 3,
                padding: "8px 14px",
                fontWeight: 700,
                color: "#166534",
              }}
            >
              Go to Register Page →
            </button>

            <button
              style={{
                border: "1px solid #568264",
                background: "transparent",
                borderRadius: 3,
                padding: "8px 14px",
                fontWeight: 700,
                color: "#568264",
              }}
              onClick={() => router.push(`/events/${eventId}/qr`)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
