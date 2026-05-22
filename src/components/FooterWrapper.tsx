// components/FooterWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper({ hasSignedWaiver }: { hasSignedWaiver: boolean }) {
  const pathname = usePathname();

  const hideFooter =
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/create-account");

  if (hideFooter) return null;

  return <Footer hasSignedWaiver={hasSignedWaiver} />;
}
