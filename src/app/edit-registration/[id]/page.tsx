"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "@/styles/EditEventRegistration.module.css";
import { TbSignature, TbSignatureOff } from "react-icons/tb";
import { MdRemoveCircle } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { BeatLoader } from "react-spinners";
import Link from "next/link";
import { useWaiverStatus } from "@/hooks/useWaiverStatus";

type Reservation = {
  eventId: Event;
  start: string;
  additionalComments: string;
  affiliatedOrganization: string;
  partyMembers: [Participant];
};

type Participant = {
  name: string;
  email: string;
  mainAttendee?: boolean;
  waiverSigned: boolean;
  attending: boolean;
};

type Event = {
  description: string;
  location: string;
  name: string;
  time: string;
};

export default function EditRegistration() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [registration, setRegistration] = useState<Reservation | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const tempOrganizations = ["N/A", "One Cool Earth", "PG&E", "Other Organization"];
  const [affiliatedOrganization, setAffiliatedOrganization] = useState("N/A");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [sigHovered, setSigHovered] = useState<null | number>(null);
  const [attendeeHovered, setAttendeeHovered] = useState<null | number>(null);
  const [orgsOpen, setOrgsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { waiverCompleted } = useWaiverStatus(true);

  const hasSignedWaiver = waiverCompleted;

  useEffect(() => {
    if (!id) return;

    const fetchReservation = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/api/events/registration/${id}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch reservation");
        }

        const result = await response.json();
        setRegistration(result.registration);
      } catch (error) {
        console.error("Error fetching reservation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [id]);

  useEffect(() => {
    if (registration) {
      console.log(registration);
      setParticipants(registration.partyMembers);
      setEvent(registration.eventId);
      setAdditionalInfo(registration.additionalComments);
      setAffiliatedOrganization(registration.affiliatedOrganization);
    }
  }, [registration]);

  useEffect(() => {
    if (!hasSignedWaiver) return;

    setParticipants((prev) =>
      prev.map((participant) => (participant.mainAttendee ? { ...participant, waiverSigned: true } : participant)),
    );
  }, [hasSignedWaiver]);

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

  const onSave = async () => {
    try {
      setEditing(true);
      const newDoc = {
        partyMembers: participants,
        affiliatedOrganization: affiliatedOrganization,
        additionalComments: additionalInfo,
      };

      const response = await fetch(`/api/events/registration/${id}`, {
        method: "PATCH",
        body: JSON.stringify(newDoc),
      });

      if (response.ok) {
        console.log("Success updating");
        setShowConfirmation(true);
      } else {
        throw Error("Failure to patch");
      }
    } catch (error) {
      alert("Could not edit registration");
    } finally {
      setEditing(false);
    }
  };

  const removeRegistration = async () => {
    try {
      setDeleting(true);
      const response = await fetch(`/api/events/registration/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("success deleting");
        router.push("/events");
      } else {
        throw Error("Fail to delete");
      }
    } catch (error) {
      alert("Could not delete registration");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <BeatLoader />
      </div>
    );
  }

  if (!registration) {
    return (
      <div className={styles.page}>
        <p>Unable to load registration.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div>
        <h1 className={styles.title}>{event?.name ? event.name : ""}</h1>
        <h2 className={styles.subTitle}>{event?.description ? event.description : ""}</h2>
        <h2 className={styles.date}>{formatDate(event?.time ? event.time : "")}</h2>
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
                    <Link href="https://form.jotform.com/70895957565174" target="_blank" className={styles.popup}>
                      sign waiver
                    </Link>
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
        <button className={styles.red} onClick={removeRegistration}>
          {deleting ? <BeatLoader size={8} /> : "cancel registration"}
        </button>
        <button onClick={onSave}>{editing ? <BeatLoader size={8} /> : "save"}</button>
      </div>

      {showConfirmation && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Registration Confirmed</h2>

            <p>
              <strong>Event:</strong> {event?.name}
            </p>

            <p>
              <strong>Date:</strong> {formatDate(event?.time || "")}
            </p>

            <p>
              <strong>Location:</strong> {event?.location || "TBD"}
            </p>

            <p>
              <strong>Affiliated Organization:</strong> {affiliatedOrganization}
            </p>

            <div className={styles.confirmedMembers}>
              <strong>Party Members:</strong>

              {participants.map((participant, index) => (
                <div key={index} className={styles.confirmedMember}>
                  <span>
                    {participant.name || "Unnamed attendee"} — {participant.email || "No email"}
                  </span>

                  <span>
                    Waiver signed? {participant.waiverSigned ? "Yes" : "No"}
                    {!participant.waiverSigned && (
                      <>
                        {" "}
                        <Link href="/waiver" className={styles.waiverLink}>
                          Fill out waiver
                        </Link>
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>

            {additionalInfo && (
              <p>
                <strong>Additional Comments:</strong> {additionalInfo}
              </p>
            )}

            <button className={styles.confirmButton} onClick={() => router.push("/events")}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
