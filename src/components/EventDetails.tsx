"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import editIcon from "../icons/editIcon.svg";
import styles from "../styles/EventDetails.module.css";
import { AppEvent } from "@/data/events";

interface EventDetailsProps {
  event: AppEvent | null;
  isEditable?: boolean;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, isEditable = false }) => {
  const [draft, setDraft] = useState<AppEvent | null>(event);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setDraft(event);
  }, [event]);

  if (!draft) {
    return <div className={styles.wrapper}>No event found.</div>;
  }

  const formatDate = (date: Date): string => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear().toString().slice(-2);
    return `${month}/${day}/${year}`;
  };

  const formatTime = (start: Date, end: Date): string => {
    const formatHour = (date: Date): string => {
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12 || 12;
      const minuteStr = minutes === 0 ? "00" : minutes.toString().padStart(2, "0");
      return `${hours}:${minuteStr}${ampm}`;
    };
    return `${formatHour(start)} - ${formatHour(end)}`;
  };

  const toDateInputValue = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const toTimeInputValue = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const saveEditing = async () => {
    if (!draft) return;

    try {
      const response = await fetch(`/api/events/${draft.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(draft),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to update event");
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save event:", error);
    }
  };

  const handleDateChange = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);

    const newStart = new Date(draft.startTime);
    const newEnd = new Date(draft.endTime);

    newStart.setFullYear(year, month - 1, day);
    newEnd.setFullYear(year, month - 1, day);

    setDraft({
      ...draft,
      startTime: newStart,
      endTime: newEnd,
    });
  };

  const handleStartTimeChange = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);

    const newStart = new Date(draft.startTime);
    newStart.setHours(hours, minutes, 0, 0);

    setDraft({
      ...draft,
      startTime: newStart,
    });
  };

  const handleEndTimeChange = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);

    const newEnd = new Date(draft.endTime);
    newEnd.setHours(hours, minutes, 0, 0);

    setDraft({
      ...draft,
      endTime: newEnd,
    });
  };

  const handleImageChange = (file: File | null) => {
    if (draft.imageUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(draft.imageUrl);
    }
    if (!file) {
      setDraft({ ...draft, imageUrl: undefined });
      return;
    }
    const url = URL.createObjectURL(file);
    setDraft({ ...draft, imageUrl: url });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <h3 className={styles.headerTitle}>Event Details</h3>
          {isEditable && !isEditing && (
            <Image
              src={editIcon}
              alt="edit event details"
              width={28}
              height={28}
              onClick={startEditing}
              role="button"
              style={{ cursor: "pointer", opacity: 0.85 }}
            />
          )}
        </div>

        <div>
          <span className={styles.detailLabel}>Title: </span>
          {!isEditing ? (
            <span className={styles.detailValue}>{draft.title}</span>
          ) : (
            <div style={{ marginTop: "8px" }}>
              <input
                className={styles.input}
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </div>
          )}
        </div>

        <div>
          <span className={styles.detailLabel}>Description: </span>
          {!isEditing ? (
            <span className={styles.detailValue}>{draft.description}</span>
          ) : (
            <div style={{ marginTop: "8px" }}>
              <textarea
                className={styles.textarea}
                value={draft.description ?? ""}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </div>
          )}
        </div>

        <div>
          <span className={styles.detailLabel}>Location: </span>
          {!isEditing ? (
            <span className={styles.detailValue}>{draft.location}</span>
          ) : (
            <div style={{ marginTop: "8px" }}>
              <input
                className={styles.input}
                value={draft.location ?? ""}
                onChange={(e) => setDraft({ ...draft, location: e.target.value })}
              />
            </div>
          )}
        </div>

        <div>
          <span className={styles.detailLabel}>Date: </span>
          {!isEditing ? (
            <span className={styles.detailValue}>{formatDate(draft.startTime)}</span>
          ) : (
            <div style={{ marginTop: "8px" }}>
              <input
                type="date"
                className={styles.input}
                value={toDateInputValue(draft.startTime)}
                onChange={(e) => handleDateChange(e.target.value)}
              />
            </div>
          )}
        </div>

        <div>
          <span className={styles.detailLabel}>Time: </span>
          {!isEditing ? (
            <span className={styles.detailValue}>{formatTime(draft.startTime, draft.endTime)}</span>
          ) : (
            <div className={styles.timeInputRow}>
              <input
                type="time"
                className={styles.input}
                style={{ width: "auto", flex: 1 }}
                value={toTimeInputValue(draft.startTime)}
                onChange={(e) => handleStartTimeChange(e.target.value)}
              />
              <span>-</span>
              <input
                type="time"
                className={styles.input}
                style={{ width: "auto", flex: 1 }}
                value={toTimeInputValue(draft.endTime)}
                onChange={(e) => handleEndTimeChange(e.target.value)}
              />
            </div>
          )}
        </div>

        <div>
          <span className={styles.detailLabel}>Image: </span>
          {!isEditing ? (
            draft.imageUrl ? (
              <div style={{ marginTop: "10px" }}>
                <Image
                  src={draft.imageUrl}
                  alt="event upload"
                  width={320}
                  height={200}
                  className={styles.imagePreview}
                  unoptimized
                />
              </div>
            ) : (
              <span className={styles.detailValue}>None</span>
            )
          ) : (
            <div style={{ marginTop: "8px", maxWidth: "320px" }}>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                <button type="button" className={styles.imageButton} onClick={() => fileInputRef.current?.click()}>
                  {draft.imageUrl ? "Change Image" : "Upload Image"}
                </button>
                {draft.imageUrl && (
                  <button
                    type="button"
                    className={styles.imageButton}
                    onClick={() => {
                      if (fileInputRef.current) fileInputRef.current.value = "";
                      handleImageChange(null);
                    }}
                  >
                    Remove Image
                  </button>
                )}
              </div>
              {draft.imageUrl && (
                <div style={{ marginTop: "10px" }}>
                  <Image
                    src={draft.imageUrl}
                    alt="event upload preview"
                    width={320}
                    height={200}
                    className={styles.imagePreview}
                    unoptimized
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Save button OUTSIDE the bordered container */}
      {isEditing && (
        <div className={styles.footerRow}>
          <button type="button" className={styles.saveButton} onClick={saveEditing}>
            save
          </button>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
