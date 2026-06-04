"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import { useWaiverStatus } from "@/hooks/useWaiverStatus";

export default function FooterWrapper({ initialHasSignedWaiver }: { initialHasSignedWaiver: boolean }) {
  const pathname = usePathname();

  const { waiverCompleted } = useWaiverStatus(true);

  const hasSignedWaiver = initialHasSignedWaiver || waiverCompleted;

  const hideFooter =
    pathname.startsWith("/login") || pathname.startsWith("/create-account") || pathname.startsWith("/forgot-password");

  if (hideFooter) return null;

  return <Footer hasSignedWaiver={hasSignedWaiver} />;
}
