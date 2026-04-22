"use client";
import React, { CSSProperties, useState, useRef } from "react";
import Image from "next/image";
import editIcon from "../icons/editIcon.svg";
import styles from "../styles/EventDetails.module.css";

interface EventDetailsProps {
  eventData?: EventData;
  isEditable?: boolean;
}

interface EventData {
  name: string;
  description: string;
  location: string;
  startDateTime: Date;
  endDateTime: Date;
  imageUrl?: string;
}

const EventDetails: React.FC<EventDetailsProps> = ({ eventData, isEditable = false }) => {
  const defaultData: EventData = {
    name: "Garden Workday",
    description:
      "We have ongoing garden workday opportunities that happen all over the county throughout the year. These workdays typically occur after school or on Saturdays and include tasks such as spreading wood chips, building beds, planting, weeding, spreading mulch, etc.",
    location: "Baywood Elementary",
    startDateTime: new Date("2025-03-11T15:00:00"),
    endDateTime: new Date("2025-03-11T17:00:00"),
    imageUrl: undefined,
  };

  const [data, setData] = useState<EventData>(eventData || defaultData);
  const [draft, setDraft] = useState<EventData>(data);
  const [isEditing, setIsEditing] = useState(false);

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
    setDraft(data);
    setIsEditing(true);
  };

  const saveEditing = () => {
    setData(draft);
    setIsEditing(false);
  };

  const handleDateChange = (dateStr: string) => {
    const newDate = new Date(dateStr);
    const newStart = new Date(draft.startDateTime);
    const newEnd = new Date(draft.endDateTime);
    newStart.setFullYear(newDate.getFullYear());
    newStart.setMonth(newDate.getMonth());
    newStart.setDate(newDate.getDate());
    newEnd.setFullYear(newDate.getFullYear());
    newEnd.setMonth(newDate.getMonth());
    newEnd.setDate(newDate.getDate());
    setDraft({ ...draft, startDateTime: newStart, endDateTime: newEnd });
  };

  const handleStartTimeChange = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const newStart = new Date(draft.startDateTime);
    newStart.setHours(hours, minutes, 0, 0);
    setDraft({ ...draft, startDateTime: newStart });
  };

  const handleEndTimeChange = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const newEnd = new Date(draft.endDateTime);
    newEnd.setHours(hours, minutes, 0, 0);
    setDraft({ ...draft, endDateTime: newEnd });
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
            <span className={styles.detailValue}>{data.name}</span>
          ) : (
            <div style={{ marginTop: "8px" }}>
              <input
                className={styles.input}
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </div>
          )}
        </div>

        <div>
          <span className={styles.detailLabel}>Description: </span>
          {!isEditing ? (
            <span className={styles.detailValue}>{data.description}</span>
          ) : (
            <div style={{ marginTop: "8px" }}>
              <textarea
                className={styles.textarea}
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </div>
          )}
        </div>

        <div>
          <span className={styles.detailLabel}>Location: </span>
          {!isEditing ? (
            <span className={styles.detailValue}>{data.location}</span>
          ) : (
            <div style={{ marginTop: "8px" }}>
              <input
                className={styles.input}
                value={draft.location}
                onChange={(e) => setDraft({ ...draft, location: e.target.value })}
              />
            </div>
          )}
        </div>

        <div>
          <span className={styles.detailLabel}>Date: </span>
          {!isEditing ? (
            <span className={styles.detailValue}>{formatDate(data.startDateTime)}</span>
          ) : (
            <div style={{ marginTop: "8px" }}>
              <input
                type="date"
                className={styles.input}
                value={toDateInputValue(draft.startDateTime)}
                onChange={(e) => handleDateChange(e.target.value)}
              />
            </div>
          )}
        </div>

        <div>
          <span className={styles.detailLabel}>Time: </span>
          {!isEditing ? (
            <span className={styles.detailValue}>{formatTime(data.startDateTime, data.endDateTime)}</span>
          ) : (
            <div className={styles.timeInputRow}>
              <input
                type="time"
                className={styles.input}
                style={{ width: "auto", flex: 1 }}
                value={toTimeInputValue(draft.startDateTime)}
                onChange={(e) => handleStartTimeChange(e.target.value)}
              />
              <span>-</span>
              <input
                type="time"
                className={styles.input}
                style={{ width: "auto", flex: 1 }}
                value={toTimeInputValue(draft.endDateTime)}
                onChange={(e) => handleEndTimeChange(e.target.value)}
              />
            </div>
          )}
        </div>

        <div>
          <span className={styles.detailLabel}>Image: </span>
          {!isEditing ? (
            data.imageUrl ? (
              <div style={{ marginTop: "10px" }}>
                <Image
                  src={data.imageUrl}
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
