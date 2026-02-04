import React, { CSSProperties, useEffect, useState } from "react";
import EditIcon from "../icons/editIcon.svg";

interface EventDetailsProps {
  eventData?: EventData;
}

interface EventData {
  description: string;
  location: string;
  date: string;
  time: string;
}

const EventDetails: React.FC<EventDetailsProps> = ({ eventData }) => {
  const defaultData: EventData = {
    description:
      "We have ongoing garden workday opportunities that happen all over the county throughout the year. These workdays typically occur after school or on Saturdays and include tasks such as spreading wood chips, building beds, planting, weeding, spreading mulch, etc.",
    location: "Baywood Elementary",
    date: "3/11/25",
    time: "3:00pm - 5:00 pm",
  };

  const [data, setData] = useState<EventData>(defaultData);
  const [draft, setDraft] = useState<EventData>(data);
  const [isEditing, setIsEditing] = useState(false);

  const styles: { [key: string]: CSSProperties } = {
    container: {
      background: "#F9FBFF",
      border: "1px solid #527ABE",
      borderRadius: "5px",
      padding: "10px 15px 10px 15px",
      maxWidth: "45%",
      maxHeight: "35%",
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
    content: {
      display: "flex",
      flexDirection: "column",
      gap: "25px",
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
    editIcon: {
      width: "28px",
      height: "28px",
      cursor: "pointer",
      opacity: 0.85,
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

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h3 style={styles.headerTitle}>Event Details</h3>

        {!isEditing && (
          <img src={EditIcon} alt="edit event details" role="button" onClick={startEditing} style={styles.editIcon} />
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
          <span style={styles.detailValue}>{data.date}</span>
        ) : (
          <div style={{ marginTop: "8px" }}>
            <input
              style={styles.input}
              value={draft.date}
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              placeholder="MM/DD/YY"
            />
          </div>
        )}
      </div>

      <div>
        <span style={styles.detailLabel}>Time: </span>
        {!isEditing ? (
          <span style={styles.detailValue}>{data.time}</span>
        ) : (
          <div style={{ marginTop: "8px" }}>
            <input
              style={styles.input}
              value={draft.time}
              onChange={(e) => setDraft({ ...draft, time: e.target.value })}
              placeholder="3:00pm - 5:00pm"
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
