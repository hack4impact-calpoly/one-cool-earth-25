"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import EventQrPage from "@/app/events/[eventId]/qr/page";
import CheckinModal from "../components/CheckinModal";
import RegisteredView from "../components/RegisteredView";
import NotRegisteredView from "../components/NotRegisteredView";
import NotLoggedInView from "../components/NotLoggedInView";

type CheckinStatus = "registered" | "not-registered" | "not-logged-in";

export default function CheckinOverlayPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const eventId = params?.eventId as string;

  const status = (searchParams.get("status") as CheckinStatus) || "not-registered";

  return (
    <>
      <EventQrPage />

      <CheckinModal onClose={() => router.push(`/events/${eventId}/qr`)}>
        {status === "registered" && <RegisteredView eventId={eventId} />}

        {status === "not-registered" && <NotRegisteredView eventId={eventId} />}

        {status === "not-logged-in" && <NotLoggedInView eventId={eventId} />}
      </CheckinModal>
    </>
  );
}
