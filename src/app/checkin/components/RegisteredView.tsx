"use client";

import { useRouter } from "next/navigation";
import styles from "../../../styles/CheckinOverlay.module.css";

export default function RegisteredView({ eventId }: { eventId: string }) {
  const router = useRouter();

  return (
    <div className={styles.content}>
      <div className={styles.successIcon}>✅</div>
      <h2 className={styles.title}>Thank you for confirming your attendance, User_Name!</h2>

      <button className={styles.primaryButton} onClick={() => router.push(`/events/${eventId}`)}>
        Back to Event
      </button>
    </div>
  );
}
