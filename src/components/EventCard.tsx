"use client";
import { useRouter } from "next/navigation";

interface EventProps {
  eventId: string;
  eventTitle: string;
  date: Date;
  detailsRouteBase?: string;
}

export default function EventCard({ eventId, eventTitle, date, detailsRouteBase = "/events" }: EventProps) {
  const datePart = date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const timePart = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const router = useRouter();

  // Format the date into a string like "Nov 10, 11:00 AM" (exact format depends on the locale)
  const formattedDateTime: string = `${datePart}, ${timePart}`;
  return (
    <div className="flex flex-col items-center space-y-2 w-42 shrink-0 m-4 p-4 bg-[#fcfce6] rounded-xl">
      <h1 className="text-2xl mb-1 font-bold">{eventTitle}</h1>
      <div className="text-lg">{formattedDateTime}</div>
      <button
        onClick={() => router.push(`${detailsRouteBase}/${eventId}`)}
        className="bg-[#448EBF] bg-opacity-20 m-1 p-2"
      >
        Learn More
      </button>
      <button className="bg-[#226999] m-1 p-2 text-white">Register!</button>
    </div>
  );
}
