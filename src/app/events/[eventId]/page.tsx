"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import EventDetails from "@/components/EventDetails";
import VolunteerList from "@/components/VolunteerList";
import NavBar from "@/components/Navbar";
import styles from "@/styles/events.module.css";

export default function EventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.eventId as string;

  // Later: fetch event by eventId from Mongo.
  // For now, your EventDetails already has defaultData.
  return (
    <div className={styles.page}>
      <NavBar mode="VolunteerLoggedIn" />
      <main className={styles.main}>
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => router.push(`/events/${eventId}/qr`)}
            aria-label="Go to QR code"
            title="Go to QR code"
          >
            <span className="grid h-[18px] w-[18px] grid-cols-2 gap-[3px]" aria-hidden="true">
              <span className="rounded-[2px] bg-[#111827]" />
              <span className="rounded-[2px] bg-[#111827]" />
              <span className="rounded-[2px] bg-[#111827]" />
              <span className="rounded-[2px] bg-[#111827]" />
            </span>
          </button>
        </div>

        <h1 className={styles.pageTitle}>Garden Workday</h1>

        <section className={styles.grid}>
          <div className={styles.eventCard}>
            <EventDetails />
          </div>
          <div className={styles.card}>
            <VolunteerList />
          </div>
        </section>
      </main>
    </div>
  );
}
