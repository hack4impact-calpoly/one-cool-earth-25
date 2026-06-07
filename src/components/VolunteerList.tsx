"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../styles/VolunteerList.module.css";

import approvedWaiver from "../icons/approvedWaiver.svg";
import missingWaiver from "../icons/missingWaiver.svg";
import attended from "../icons/attended.svg";
import notAttended from "../icons/notAttended.svg";
import hoveredAttended from "../icons/hoverAttended.svg";
import mail from "../icons/mail.svg";

type Volunteer = {
  registrationId: string;
  memberIndex: number;
  name: string;
  email: string;
  waiver: any;
  attendance: boolean;
  waiverSigned: boolean;
};

type VolunteerMap = Record<string, Volunteer>;

type PartyMember = {
  name: string;
  email: string;
  waiverSigned?: boolean;
  attending?: boolean;
  attended?: boolean;
};

type Registration = {
  _id: string;
  partyMembers?: PartyMember[];
};

type VolunteerListProps = {
  canViewVolunteers?: boolean;
  eventId?: string;
};

export default function VolunteerList({ canViewVolunteers = false, eventId }: VolunteerListProps) {
  const [volunteers, setVolunteers] = useState<VolunteerMap>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedVolunteerIds, setSelectedVolunteerIds] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("No Template");
  const [message, setMessage] = useState("Dear [Volunteer],");
  const [loading, setLoading] = useState(false);
  const [savingAttendanceIds, setSavingAttendanceIds] = useState<string[]>([]);

  useEffect(() => {
    if (!canViewVolunteers || !eventId) return;

    const fetchVolunteers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/events/registration/event/${eventId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Failed to fetch volunteers");
        }

        const nextVolunteers = (data.registrations as Registration[]).reduce<VolunteerMap>((result, registration) => {
          registration.partyMembers
            ?.filter((member) => member.attending !== false)
            .forEach((member, index) => {
              const waiverSigned = Boolean(member.waiverSigned);
              result[`${registration._id}-${index}`] = {
                registrationId: registration._id,
                memberIndex: index,
                name: member.name,
                email: member.email,
                waiver: waiverSigned ? approvedWaiver : missingWaiver,
                waiverSigned,
                attendance: Boolean(member.attended),
              };
            });

          return result;
        }, {});

        setVolunteers(nextVolunteers);
        setSelectedVolunteerIds(Object.keys(nextVolunteers));
      } catch (error) {
        console.error("Failed to fetch volunteers:", error);
        setVolunteers({});
        setSelectedVolunteerIds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, [canViewVolunteers, eventId]);

  if (!canViewVolunteers) return null;

  const volunteerEntries = Object.entries(volunteers);
  const selectedVolunteers = volunteerEntries.filter(([id]) => selectedVolunteerIds.includes(id));

  const toggleAttendance = async (id: string) => {
    const volunteer = volunteers[id];

    if (!volunteer || savingAttendanceIds.includes(id)) return;

    const nextAttendance = !volunteer.attendance;

    setVolunteers((prev) => ({
      ...prev,
      [id]: { ...prev[id], attendance: nextAttendance },
    }));
    setSavingAttendanceIds((prev) => [...prev, id]);

    try {
      const response = await fetch(`/api/events/registration/${volunteer.registrationId}/attendance`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberIndex: volunteer.memberIndex,
          attended: nextAttendance,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "Failed to update attendance");
      }
    } catch (error) {
      console.error("Failed to update attendance:", error);
      setVolunteers((prev) => ({
        ...prev,
        [id]: { ...prev[id], attendance: volunteer.attendance },
      }));
    } finally {
      setSavingAttendanceIds((prev) => prev.filter((savingId) => savingId !== id));
    }
  };

  const toggleVolunteerSelection = (id: string) => {
    setSelectedVolunteerIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const selectVolunteersByWaiver = (waiverSigned: boolean) => {
    setSelectedVolunteerIds(
      volunteerEntries.filter(([, volunteer]) => volunteer.waiverSigned === waiverSigned).map(([id]) => id),
    );
  };

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);

    if (template === "Signup") {
      setMessage("Dear [Volunteer],\n\nThank you for signing up for this event.");
      return;
    }

    if (template === "Event Reminder") {
      setMessage("Dear [Volunteer],\n\nThis is a reminder about your upcoming event.");
      return;
    }

    setMessage("Dear [Volunteer],");
  };

  const sendEmail = () => {
    const bcc = selectedVolunteers.map(([, volunteer]) => volunteer.email).join(",");
    const mailtoUrl = `mailto:?bcc=${encodeURIComponent(bcc)}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h1 className={styles.title}>Volunteers</h1>
        <button
          type="button"
          className={styles.headerIconButton}
          onClick={() => setIsEmailModalOpen(true)}
          aria-label="Email volunteers"
          title="Email volunteers"
        >
          <Image src={mail} alt="Email volunteers" width={25} height={25} />
        </button>
      </div>

      <div className={styles.list}>
        {loading ? (
          <div className={styles.emptyState}>Loading volunteers...</div>
        ) : volunteerEntries.length === 0 ? (
          <div className={styles.emptyState}>No registered volunteers yet.</div>
        ) : (
          <table className={styles.table}>
            <colgroup>
              <col className={styles.colName} />
              <col className={styles.colGap} />
              <col className={styles.colEmail} />
              <col className={styles.colFlex} />
              <col className={styles.colActions} />
            </colgroup>

            <tbody>
              {volunteerEntries.map(([id, volunteer]: [string, Volunteer]) => (
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
                      onClick={() => {
                        void toggleAttendance(id);
                      }}
                      onMouseEnter={() => setHoveredId(id)}
                      onMouseLeave={() => setHoveredId(null)}
                      title={volunteer.attendance ? "mark as not attended" : "mark as attended"}
                      disabled={savingAttendanceIds.includes(id)}
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
        )}
      </div>

      {isEmailModalOpen && (
        <div className={styles.emailOverlay} onClick={() => setIsEmailModalOpen(false)}>
          <div
            className={styles.emailModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="email-volunteers-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setIsEmailModalOpen(false)}
              aria-label="Close email popup"
            >
              X
            </button>

            <h2 id="email-volunteers-title" className={styles.emailTitle}>
              Email {selectedVolunteers.length} Volunteers
            </h2>

            <div className={styles.recipientActions}>
              <button
                type="button"
                className={styles.filterButton}
                onClick={() => setSelectedVolunteerIds(Object.keys(volunteers))}
              >
                Select All
              </button>
              <button type="button" className={styles.filterButton} onClick={() => setSelectedVolunteerIds([])}>
                Deselect All
              </button>
              <button type="button" className={styles.filterButton} onClick={() => selectVolunteersByWaiver(false)}>
                Select Unsigned Waivers
              </button>
              <button type="button" className={styles.filterButton} onClick={() => selectVolunteersByWaiver(true)}>
                Select Signed Waivers
              </button>
            </div>

            <div className={styles.recipientList}>
              {volunteerEntries.map(([id, volunteer]) => {
                const isSelected = selectedVolunteerIds.includes(id);

                return (
                  <button
                    key={id}
                    type="button"
                    className={`${styles.recipientRow} ${isSelected ? styles.recipientRowSelected : ""}`}
                    onClick={() => toggleVolunteerSelection(id)}
                  >
                    <span className={styles.checkColumn}>{isSelected ? "✓" : ""}</span>
                    <span className={styles.recipientName}>{volunteer.name}</span>
                    <span className={styles.recipientEmail}>{volunteer.email}</span>
                  </button>
                );
              })}
            </div>

            <div className={styles.templateSection}>
              <div className={styles.templateLabel}>Templates:</div>
              <div className={styles.templateButtons}>
                {["Signup", "Event Reminder", "No Template"].map((template) => (
                  <button
                    key={template}
                    type="button"
                    className={`${styles.templateButton} ${selectedTemplate === template ? styles.templateButtonActive : ""}`}
                    onClick={() => handleTemplateChange(template)}
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              className={styles.emailMessage}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              aria-label="Email message"
            />

            <div className={styles.sendRow}>
              <button
                type="button"
                className={styles.sendButton}
                onClick={sendEmail}
                disabled={selectedVolunteers.length === 0}
              >
                send &gt;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
