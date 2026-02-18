import { Button } from "@mui/material";

interface EventProps {
  eventTitle: string;
  date: Date;
}

export default function EventCard({ eventTitle, date }: EventProps) {
  const datePart = date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const timePart = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  // Format the date into a string like "Nov 10, 11:00 AM" (exact format depends on the locale)
  const formattedDateTime: string = `${datePart}, ${timePart}`;
  return (
    <div className="flex flex-col items-center space-y-2 w-42 shrink-0 m-4 p-4 bg-[#fcfce6] rounded-xl">
      <h1 className="text-2xl mb-1 font-bold">{eventTitle}</h1>
      <div>{formattedDateTime}</div>
      <button className="font-patua bg-[#448EBF] bg-opacity-20 m-1 p-2">Learn More</button>
      <button className="font-patua bg-[#226999] m-1 p-2 text-white">Register!</button>
    </div>
  );
}
