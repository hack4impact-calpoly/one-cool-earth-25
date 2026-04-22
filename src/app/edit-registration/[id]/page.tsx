"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "@/styles/EditEventRegistration.module.css";
import { TbSignature, TbSignatureOff } from "react-icons/tb";
import { MdRemoveCircle } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { BeatLoader } from "react-spinners";

type Reservation = {
  title: string;
  description: string;
  location: string;
  start: string;
};

type Participant = {
  name: string;
  email: string;
  mainAttendee?: boolean;
  waiverSigned: boolean;
  attending: boolean;
};

export default function EditRegistration() {
  const params = useParams();
  const id = params.id as string;

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([
    {
      name: "John Doe",
      email: "jdoe@gmail.com",
      mainAttendee: true,
      waiverSigned: true,
      attending: true,
    },
    {
      name: "Jane Doe",
      email: "janedoe@gmail.com",
      waiverSigned: false,
      attending: false,
    },
    {
      name: "John Doe",
      email: "jdoe@gmail.com",
      waiverSigned: false,
      attending: true,
    },
  ]);

  const tempOrganizations = ["N/A", "One Cool Earth", "PG&E", "Other Organization"];
  const [affiliatedOrganization, setAffiliatedOrganization] = useState("N/A");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [sigHovered, setSigHovered] = useState<null | number>(null);
  const [attendeeHovered, setAttendeeHovered] = useState<null | number>(null);
  const [orgsOpen, setOrgsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchReservation = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/api/events/${id}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch reservation");
        }

        const result = await response.json();
        setReservation(result);
      } catch (error) {
        console.error("Error fetching reservation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [id]);

  function formatDate(date: string): string {
    if (!date) return "";
    const d = new Date(date);
    const month = d.toLocaleString("en-US", { month: "long" });
    const day = d.getDate();

    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
          ? "nd"
          : day % 10 === 3 && day !== 13
            ? "rd"
            : "th";

    const hours = d.getHours() % 12 || 12;
    const pmAm = d.getHours() >= 12 ? "pm" : "am";

    return `${month} ${day}${suffix}, ${hours}${pmAm}`;
  }

  const changeInfo = (index: number, field: string, edits: string | boolean) => {
    const tempParticipants = participants.map((participant, i) => {
      if (i === index) {
        return { ...participant, [field]: edits };
      }
      return participant;
    });

    setParticipants(tempParticipants);
  };

  const addParticipant = () => {
    setParticipants([
      ...participants,
      {
        name: "",
        email: "",
        mainAttendee: false,
        waiverSigned: false,
        attending: true,
      },
    ]);
  };

  const removeParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <BeatLoader />
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className={styles.page}>
        <p>Unable to load registration.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div>
        <h1 className={styles.title}>{reservation.title}</h1>
        <h2 className={styles.subTitle}>{reservation.description}</h2>
        <h2 className={styles.date}>{formatDate(reservation.start)}</h2>
      </div>

      <div className={styles.participants}>
        <label>Party Members</label>
        {participants.map((participant, index) => (
          <div className={styles.participant} key={index}>
            <input
              value={participant.name}
              disabled={participant.mainAttendee}
              onChange={(e) => changeInfo(index, "name", e.target.value)}
            />
            <input
              value={participant.email}
              disabled={participant.mainAttendee}
              onChange={(e) => changeInfo(index, "email", e.target.value)}
            />
            <div>
              {participant.waiverSigned ? (
                <TbSignature fontSize={30} color={"#888a8cff"} />
              ) : (
                <div
                  onMouseEnter={() => setSigHovered(index)}
                  onMouseLeave={() => setSigHovered(null)}
                  className={styles.popupContainer}
                >
                  <TbSignatureOff fontSize={30} color={"#4171B0"} />
                  {sigHovered === index && (
                    <div className={styles.popup} onClick={() => changeInfo(index, "waiverSigned", true)}>
                      sign waiver
                    </div>
                  )}
                </div>
              )}

              <div
                onMouseEnter={() => setAttendeeHovered(index)}
                onMouseLeave={() => setAttendeeHovered(null)}
                className={styles.popupContainer}
              >
                <MdRemoveCircle fontSize={30} color={"#CE7F7F"} />
                {attendeeHovered === index && (
                  <div className={styles.popup} onClick={() => removeParticipant(index)}>
                    remove attendee
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.add} onClick={addParticipant}>
        <FaPlus size={10} fill={"#568264"} />
      </div>

      <div className={styles.inputField}>
        <label>Affiliated Organization:</label>
        <div style={{ width: "100%", position: "relative" }}>
          <input value={affiliatedOrganization} readOnly onClick={() => setOrgsOpen(!orgsOpen)} />
          {orgsOpen && (
            <div className={styles.dropdown}>
              {tempOrganizations.map((org, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setAffiliatedOrganization(org);
                    setOrgsOpen(false);
                  }}
                >
                  {org}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.inputField}>
        <label>Anything else you&apos;d like us to know?</label>
        <textarea value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} />
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.red}>cancel registration</button>
        <button>save</button>
      </div>
    </div>
  );
}
