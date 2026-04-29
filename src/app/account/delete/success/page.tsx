"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import NavBarWrapper from "@/components/NavbarWrapper";
import styles from "@/styles/Account.module.css";

export default function DeleteSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div>
      <NavBarWrapper />

      <main className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.deleteCard}>
            <h2 className={styles.successTitle}>Account deleted</h2>

            <p className={styles.successText}>
              Your profile and associated account data have been permanently removed. You will now be signed out.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
