"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "@/styles/Navbar.module.css";

type NavMode = "Admin" | "VolunteerNotLoggedIn" | "VolunteerLoggedIn";

type NavItem = {
  label: string;
  href: string;
};

const NAV_LINKS: Record<NavMode, NavItem[]> = {
  Admin: [
    { label: "Calendar", href: "/admin-calendar" },
    { label: "Events", href: "/admin-events" },
    { label: "Inbox", href: "/inbox" },
    { label: "Report", href: "/report" },
    { label: "Account", href: "/admin-account" },
  ],
  VolunteerNotLoggedIn: [
    { label: "Calendar", href: "/calendar" },
    { label: "Login", href: "/login" },
  ],
  VolunteerLoggedIn: [
    { label: "Calendar", href: "/calendar" },
    { label: "My Events", href: "/events" },
    { label: "Inbox", href: "/inbox" },
    { label: "My Account", href: "/account" },
  ],
};

const isActivePath = (pathname: string, href: string) => pathname === href || pathname.startsWith(href + "/");

export default function NavBar({ mode }: { mode: NavMode }) {
  const pathname = usePathname();
  const links = NAV_LINKS[mode] ?? [];

  return (
    <nav className={styles.nav}>
      {/* LEFT SIDE */}
      <div className={styles.brand}>
        <Link href="/calendar" className={styles.brandLink}>
          <Image src="/logo.png" alt="Garden Workday Logo" width={55} height={61} className={styles.logo} />
          <span className={styles.brandText}>GARDEN WORKDAY EVENTS</span>
        </Link>
      </div>

      {/* RIGHT SIDE (your existing pill nav unchanged) */}
      <div className={styles.container}>
        {links.map((item) => {
          const active = isActivePath(pathname, item.href);
          return (
            <Link key={item.href} href={item.href} className={`${styles.link} ${active ? styles.active : ""}`}>
              {item.label.toUpperCase()}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
