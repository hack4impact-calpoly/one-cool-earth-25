import React from "react";
import { CalendarEvent } from "@/app/calendar/page";

interface SearchResultProps {
  results: CalendarEvent[];
}

export default function SearchResultList({ results }: SearchResultProps) {
  return (
    <div className="w-full rounded-xl shadow-md">
      {results
        .sort((e1, e2) => {
          if (e1.date < e2.date) {
            return -1;
          } else if (e2.date == e2.date) {
            return 0;
          } else return 1;
        })
        .map((event) => (
          <div key={event.id}>
            <a href={`events/${event.id}`}>
              <div className="m-2 p-2 rounded-xl shadow-lg ">
                <div className="text-xl">
                  <strong>{event.title}</strong>
                </div>
                <div className="text-md">
                  {event.date.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                </div>
              </div>
            </a>
          </div>
        ))}
    </div>
  );
}
