"use client";

import { ReactNode } from "react";
import styles from "../../../styles/CheckinOverlay.module.css";

type Props = {
  children: ReactNode;
  onClose: () => void;
};

export default function CheckinModal({ children, onClose }: Props) {
  return (
    <>
      <div className={styles.overlay} />
      <div className={styles.centered}>
        <div className={styles.modal}>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
          {children}
        </div>
      </div>
    </>
  );
}
