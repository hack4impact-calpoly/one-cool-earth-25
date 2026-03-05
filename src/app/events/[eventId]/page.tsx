"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import EventDetails from "@/components/EventDetails";
import VolunteerList from "@/components/VolunteerList";
import "@/styles/events.css";

export default function EventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.eventId as string;

  // Later: fetch event by eventId from Mongo.
  // For now, your EventDetails already has defaultData.
  return (
    <div className="eventsShell">
      <div className="topRow">
        <button
          className="qrIconBtn"
          onClick={() => router.push(`/events/${eventId}/qr`)}
          aria-label="Go to QR code"
          title="Go to QR code"
        >
          <span className="gridIcon">
            <span />
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      <h1 className="pageTitle">Garden Workday</h1>

      <div className="twoCol">
        <EventDetails />
        <VolunteerList />
      </div>
    </div>
  );
}
