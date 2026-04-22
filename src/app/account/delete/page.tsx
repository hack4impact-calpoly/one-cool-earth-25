"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import NavBarWrapper from "@/components/NavbarWrapper";
import styles from "@/styles/Account.module.css";

export default function DeleteAccountPage() {
  const router = useRouter();

  const handleDelete = async () => {
    router.push("/account/delete/success");
  };

  return (
    <div>
      <NavBarWrapper />

      <main className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.backLinkWrap}>
            <Link href="/account" className={styles.backLink}>
              ← Back to My Account
            </Link>
          </div>

          <div className={styles.deleteCard}>
            <h2 className={styles.deleteCardTitle}>Are you sure you want to delete your account?</h2>

            <p className={styles.deleteCardText}>
              This will permanently delete your account and associated data. This action cannot be undone.
            </p>

            <div className={styles.deleteCardButtons}>
              <Link href="/account">
                <button type="button" className={styles.cancelButton}>
                  Cancel
                </button>
              </Link>

              <button type="button" className={styles.deleteButton} onClick={handleDelete}>
                Delete my account
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
