"use client";

import { Menu } from "lucide-react";
import styles from "../styles/AuthMobileHeader.module.css";

export default function AuthMobileHeader() {
  return (
    <div className={styles.mobileHeader}>
      <span className={styles.title}>GARDEN WORKDAY EVENT</span>

      <button type="button" aria-label="Open menu" className={styles.menuButton}>
        <Menu size={20} strokeWidth={2.25} />
      </button>
    </div>
  );
}
