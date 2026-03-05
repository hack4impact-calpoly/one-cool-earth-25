"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "../styles/VolunteerList.module.css";

import approvedWaiver from "../icons/approvedWaiver.svg";
import missingWaiver from "../icons/missingWaiver.svg";
import attended from "../icons/attended.svg";
import notAttended from "../icons/notAttended.svg";
import hoveredAttended from "../icons/hoverAttended.svg";
import mail from "../icons/mail.svg";

type Volunteer = {
  name: string;
  email: string;
  waiver: any;
  attendance: boolean;
};

type VolunteerMap = Record<string, Volunteer>;

const initialVolunteerData: VolunteerMap = {
  volunteer1: { name: "Jane Doe", email: "jdoe@gmail.com", waiver: approvedWaiver, attendance: true },
  volunteer2: { name: "Jane Doe", email: "jdoe@gmail.com", waiver: missingWaiver, attendance: false },
  volunteer3: { name: "Jane Doe", email: "jdoe@gmail.com", waiver: approvedWaiver, attendance: false },
  volunteer4: { name: "Jane Doe", email: "jdoe@gmail.com", waiver: missingWaiver, attendance: true },
};

export default function VolunteerList({ canViewVolunteers = false }: { canViewVolunteers?: boolean }) {
  const [volunteers, setVolunteers] = useState<VolunteerMap>(initialVolunteerData);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (!canViewVolunteers) return null;

  const toggleAttendance = (id: string) => {
    setVolunteers((prev) => ({
      ...prev,
      [id]: { ...prev[id], attendance: !prev[id].attendance },
    }));
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>Volunteers</h1>
        <div className={styles.headerIcon}>
          <Image src={mail} alt="Email volunteers" width={25} height={25} />
        </div>
      </div>

      <div className={styles.list}>
        <table className={styles.table}>
          <colgroup>
            <col className={styles.colName} />
            <col className={styles.colGap} />
            <col className={styles.colEmail} />
            <col className={styles.colFlex} />
            <col className={styles.colActions} />
          </colgroup>

          <tbody>
            {Object.entries(volunteers).map(([id, volunteer]: [string, Volunteer]) => (
              <tr key={id} className={styles.row}>
                <td className={styles.name}>{volunteer.name}</td>
                <td className={styles.gap} />
                <td className={styles.email}>{volunteer.email}</td>
                <td className={styles.flex} />
                <td className={styles.actions}>
                  <Image src={volunteer.waiver} alt="Waiver status" width={25} height={25} />
                  <button
                    type="button"
                    className={styles.iconButton}
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
                      width={25}
                      height={25}
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
