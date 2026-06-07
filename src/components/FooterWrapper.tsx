"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function FooterWrapper({ initialHasSignedWaiver }: { initialHasSignedWaiver: boolean }) {
  const pathname = usePathname();

  const hideFooter =
    pathname.startsWith("/login") || pathname.startsWith("/create-account") || pathname.startsWith("/forgot-password");

  if (hideFooter) return null;

  return <Footer hasSignedWaiver={initialHasSignedWaiver} />;
}
