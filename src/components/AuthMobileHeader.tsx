"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "../styles/AuthMobileHeader.module.css";

const links = [
  { label: "Calendar", href: "/calendar" },
  { label: "Login", href: "/login" },
];

const isActivePath = (pathname: string, href: string) => pathname === href || pathname.startsWith(href + "/");

export default function AuthMobileHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.mobileHeader}>
      <span className={styles.title}>GARDEN WORKDAY EVENT</span>

      <button
        type="button"
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
        className={styles.menuButton}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className={styles.menuLine}></span>
        <span className={styles.menuLine}></span>
        <span className={styles.menuLine}></span>
      </button>

      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}>
        {links.map((item) => {
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.mobileLink} ${active ? styles.active : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label.toUpperCase()}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
