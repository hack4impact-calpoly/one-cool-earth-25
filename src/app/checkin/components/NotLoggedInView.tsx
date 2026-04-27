"use client";

import { useRouter } from "next/navigation";
import styles from "../../../styles/CheckinOverlay.module.css";

export default function NotLoggedInView({ eventId }: { eventId: string }) {
  const router = useRouter();

  return (
    <div className={styles.content}>
      <div className={styles.errorIcon}>❗</div>
      <h2 className={styles.title}>Not Logged In</h2>

      <div className={styles.divider} />

      <p className={styles.description}>Please log in with your account before checking in for this event.</p>

      <div className={styles.buttonGroup}>
        <button className={styles.primaryButton} onClick={() => router.push("/login")}>
          Login →
        </button>

        <button className={styles.secondaryButton} onClick={() => router.push(`/events/${eventId}/qr`)}>
          Cancel
        </button>
      </div>
    </div>
  );
}
