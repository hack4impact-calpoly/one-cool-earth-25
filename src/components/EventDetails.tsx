"use client";
import React, { CSSProperties, useState } from "react";
import Image from "next/image";
import editIcon from "../icons/editIcon.svg";

interface EventDetailsProps {
  eventData?: EventData;
}

interface EventData {
  description: string;
  location: string;
  startDateTime: Date;
  endDateTime: Date;
}

const EventDetails: React.FC<EventDetailsProps> = ({ eventData }) => {
  const defaultData: EventData = {
    description:
      "We have ongoing garden workday opportunities that happen all over the county throughout the year. These workdays typically occur after school or on Saturdays and include tasks such as spreading wood chips, building beds, planting, weeding, spreading mulch, etc.",
    location: "Baywood Elementary",
    startDateTime: new Date("2025-03-11T15:00:00"),
    endDateTime: new Date("2025-03-11T17:00:00"),
  };

  const [data, setData] = useState<EventData>(eventData || defaultData);
  const [draft, setDraft] = useState<EventData>(data);
  const [isEditing, setIsEditing] = useState(false);

  // Format Date object
  const formatDate = (date: Date): string => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear().toString().slice(-2);
    return `${month}/${day}/${year}`;
  };

  // Format time to match "3:00pm - 5:00 pm"
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

  // Convert Date to YYYY-MM-DD for date input
  const toDateInputValue = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Convert Date to HH:MM for time input
  const toTimeInputValue = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const styles: { [key: string]: CSSProperties } = {
    container: {
      background: "#F9FBFF",
      border: "1px solid #527ABE",
      borderRadius: "5px",
      padding: "10px 15px 10px 15px",
      width: "100%",
      maxWidth: "none",
      maxHeight: "none",
      display: "flex",
      flexDirection: "column",
      gap: "25px",
      fontFamily: "Lora, serif",
    },
    headerTitle: {
      margin: 0,
      fontSize: "22px",
      fontWeight: 700,
      fontFamily: "Lora, serif",
    },
    detailLabel: {
      fontWeight: 700,
      fontSize: "20px",
      fontFamily: "Lora, serif",
    },
    detailValue: {
      fontWeight: 400,
      fontSize: "20px",
      fontFamily: "Lora, serif",
    },
    headerRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
    input: {
      width: "100%",
      fontWeight: 400,
      fontSize: "20px",
      fontFamily: "Lora, serif",
      padding: "8px 12px",
      borderRadius: "5px",
      border: "1px solid #527ABE",
      background: "white",
      boxSizing: "border-box",
    },
    textarea: {
      width: "100%",
      minHeight: "110px",
      fontWeight: 400,
      fontSize: "20px",
      fontFamily: "Lora, serif",
      padding: "8px 12px",
      borderRadius: "5px",
      border: "1px solid #527ABE",
      background: "white",
      boxSizing: "border-box",
      resize: "vertical",
    },
    timeInputRow: {
      display: "flex",
      gap: "10px",
      alignItems: "center",
      marginTop: "8px",
    },
    footerRow: {
      display: "flex",
      justifyContent: "flex-end",
      width: "100%",
    },
    saveButton: {
      border: "1px solid #568264",
      background: "#DCF9C9",
      color: "#568264",
      borderRadius: "2px",
      padding: "5px 12px",
      fontFamily: "Lora, serif",
      fontWeight: 700,
      fontSize: "25px",
      cursor: "pointer",
    },
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

    setDraft({
      ...draft,
      startDateTime: newStart,
      endDateTime: newEnd,
    });
  };

  const handleStartTimeChange = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const newStart = new Date(draft.startDateTime);
    newStart.setHours(hours, minutes, 0, 0);

    setDraft({
      ...draft,
      startDateTime: newStart,
    });
  };

  const handleEndTimeChange = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const newEnd = new Date(draft.endDateTime);
    newEnd.setHours(hours, minutes, 0, 0);

    setDraft({
      ...draft,
      endDateTime: newEnd,
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h3 style={styles.headerTitle}>Event Details</h3>

        {!isEditing && (
          <Image
            src={editIcon}
            alt="edit event details"
            width={28}
            height={28}
            onClick={startEditing}
            role="button"
            style={{
              cursor: "pointer",
              opacity: 0.85,
            }}
          />
        )}
      </div>

      <div>
        <span style={styles.detailLabel}>Description: </span>
        {!isEditing ? (
          <span style={styles.detailValue}>{data.description}</span>
        ) : (
          <div style={{ marginTop: "8px" }}>
            <textarea
              style={styles.textarea}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </div>
        )}
      </div>

      <div>
        <span style={styles.detailLabel}>Location: </span>
        {!isEditing ? (
          <span style={styles.detailValue}>{data.location}</span>
        ) : (
          <div style={{ marginTop: "8px" }}>
            <input
              style={styles.input}
              value={draft.location}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
            />
          </div>
        )}
      </div>

      <div>
        <span style={styles.detailLabel}>Date: </span>
        {!isEditing ? (
          <span style={styles.detailValue}>{formatDate(data.startDateTime)}</span>
        ) : (
          <div style={{ marginTop: "8px" }}>
            <input
              type="date"
              style={styles.input}
              value={toDateInputValue(draft.startDateTime)}
              onChange={(e) => handleDateChange(e.target.value)}
            />
          </div>
        )}
      </div>

      <div>
        <span style={styles.detailLabel}>Time: </span>
        {!isEditing ? (
          <span style={styles.detailValue}>{formatTime(data.startDateTime, data.endDateTime)}</span>
        ) : (
          <div style={styles.timeInputRow}>
            <input
              type="time"
              style={{ ...styles.input, width: "auto", flex: 1 }}
              value={toTimeInputValue(draft.startDateTime)}
              onChange={(e) => handleStartTimeChange(e.target.value)}
            />
            <span style={{ fontFamily: "Lora, serif" }}>-</span>
            <input
              type="time"
              style={{ ...styles.input, width: "auto", flex: 1 }}
              value={toTimeInputValue(draft.endDateTime)}
              onChange={(e) => handleEndTimeChange(e.target.value)}
            />
          </div>
        )}
      </div>

      {isEditing && (
        <div style={styles.footerRow}>
          <button type="button" style={styles.saveButton} onClick={saveEditing}>
            save
          </button>
        </div>
      )}
      <div></div>
    </div>
  );
};

export default EventDetails;
