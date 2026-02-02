import React, { CSSProperties } from "react";

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

  const data = eventData || defaultData;

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
  };

  return (
    <div style={styles.container}>
      <div>
        <h3 style={styles.headerTitle}>Event Details</h3>
      </div>

      <div>
        <span style={styles.detailLabel}>Description: </span>
        <span style={styles.detailValue}>{data.description}</span>
      </div>
      <div>
        <span style={styles.detailLabel}>Location: </span>
        <span style={styles.detailValue}>{data.location}</span>
      </div>
      <div>
        <span style={styles.detailLabel}>Date: </span>
        <span style={styles.detailValue}>{data.date}</span>
      </div>
      <div>
        <span style={styles.detailLabel}>Time: </span>
        <span style={styles.detailValue}>{data.time}</span>
      </div>
      <div></div>
    </div>
  );
};

export default EventDetails;
