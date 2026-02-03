"use client";

import { useState } from "react";
import Image from "next/image";

import approvedWaiver from "../icons/approvedWaiver.svg";
import missingWaiver from "../icons/missingWaiver.svg";
import attended from "../icons/attended.svg";
import notAttended from "../icons/notAttended.svg";
import hoveredAttended from "../icons/hoverAttended.svg";

type Volunteer = {
  name: string;
  email: string;
  waiver: string;
  attendance: boolean;
};

type VolunteerMap = Record<string, Volunteer>;

const initialVolunteerData: VolunteerMap = {
  volunteer1: {
    name: "Jane Doe",
    email: "jdoe@gmail.com",
    waiver: approvedWaiver,
    attendance: true,
  },
  volunteer2: {
    name: "Jane Doe",
    email: "jdoe@gmail.com",
    waiver: missingWaiver,
    attendance: false,
  },
  volunteer3: {
    name: "Jane Doe",
    email: "jdoe@gmail.com",
    waiver: approvedWaiver,
    attendance: false,
  },
  volunteer4: {
    name: "Jane Doe",
    email: "jdoe@gmail.com",
    waiver: missingWaiver,
    attendance: true,
  },
};

export default function VolunteerList() {
  const [volunteers, setVolunteers] = useState<VolunteerMap>(initialVolunteerData);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const toggleAttendance = (id: string) => {
    setVolunteers((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        attendance: !prev[id].attendance,
      },
    }));
  };

  return (
    <div>
      <h1>Volunteers</h1>

      <div>
        <table>
          <tbody>
            {Object.entries(volunteers).map(([id, volunteer]: [string, Volunteer]) => (
              <tr key={id}>
                <td>{volunteer.name}</td>
                <td>{volunteer.email}</td>
                <td>
                  <Image src={volunteer.waiver} alt="Waiver status" width={24} height={24} />
                </td>
                <td>
                  <button
                    onClick={() => toggleAttendance(id)}
                    onMouseEnter={() => setHoveredId(id)}
                    onMouseLeave={() => setHoveredId(null)}
                    title={volunteer.attendance ? "mark as not attended" : "mark as attended"}
                  >
                    <Image
                      src={
                        hoveredId === id && !volunteer.attendance
                          ? hoveredAttended
                          : volunteer.attendance
                            ? attended
                            : notAttended
                      }
                      alt="Attendance status"
                      width={24}
                      height={24}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
