"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/styles/Navbar.module.css";

type NavMode = "Admin" | "VolunteerNotLoggedIn" | "VolunteerLoggedIn";
type NavItem = {
  label: string;
  href: string;
};

const NAV_LINKS: Record<NavMode, NavItem[]> = {
  Admin: [
    { label: "Calendar", href: "/calendar" },
    { label: "Events", href: "/events" },
    { label: "Inbox", href: "/inbox" },
    { label: "Report", href: "/report" },
    { label: "Account", href: "/account" },
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
  const links = NAV_LINKS[mode];

  return (
    <nav className={styles.nav}>
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
