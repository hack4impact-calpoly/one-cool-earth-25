"use client";

import { useRouter } from "next/navigation";
import styles from "../../../styles/CheckinOverlay.module.css";

export default function NotRegisteredView({ eventId }: { eventId: string }) {
  const router = useRouter();

  return (
    <div className={styles.content}>
      <div className={styles.errorIcon}>❗</div>
      <h2 className={styles.title}>
        You Haven’t Registered for
        <br />
        this Event
      </h2>

      <div className={styles.divider} />

      <p className={styles.description}>Our records show you are not registered for this event yet.</p>

      <div className={styles.buttonGroup}>
        <button className={styles.primaryButton} onClick={() => router.push(`/events/${eventId}/register?checkin=1`)}>
          Register for This Event →
        </button>

        <button className={styles.secondaryButton} onClick={() => router.push(`/events/${eventId}/qr`)}>
          Cancel
        </button>
      </div>
    </div>
  );
}
