"use client";

import { useState } from "react";
import styles from "../styles/WorkdayReport.module.css";
import WorkdayReportCard from "./WorkdayReportCard";

type Table = {
  name: string;
  events: number;
  volunteers: number;
  hours: number;
};

type TableMap = Record<string, Table>;

const schoolData: TableMap = {
  entry1: { name: "School 1", events: 3, volunteers: 15, hours: 40 },
  entry2: { name: "School 2", events: 2, volunteers: 17, hours: 28 },
  entry3: { name: "School 3", events: 4, volunteers: 18, hours: 20 },
  entry4: { name: "School 4", events: 2, volunteers: 19, hours: 15 },
};

const organizationData: TableMap = {
  entry1: { name: "Company Name 1", events: 3, volunteers: 15, hours: 40 },
  entry2: { name: "Company Name 2", events: 2, volunteers: 17, hours: 28 },
  entry3: { name: "Company Name 3", events: 4, volunteers: 18, hours: 20 },
  entry4: { name: "Company Name 4", events: 2, volunteers: 19, hours: 15 },
};

export default function WorkdayReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.headerTitle}>Garden Workday Report</div>

        <div className={styles.dateFilter}>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={styles.dateInput}
          />
          <span className={styles.toText}>to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={styles.dateInput}
          />
          <button className={styles.arrowButton}>→</button>
        </div>
      </div>

      <div className={styles.summaryRow}>
        <div className={styles.summaryBox}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryValue}>120 Volunteers</span>
          </div>

          <div className={styles.summaryItem}>
            <span className={styles.summaryValue}>45 Returning</span>
          </div>
        </div>

        <div className={styles.summaryBox}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryValue}>22 Events</span>
          </div>

          <div className={styles.summaryItem}>
            <span className={styles.summaryValue}>310 Hours</span>
          </div>
        </div>
      </div>

      <div className={styles.subTitle}>Schools</div>
      <WorkdayReportCard tableData={schoolData} />

      <div className={styles.subTitle}>Organizations</div>
      <WorkdayReportCard tableData={organizationData} />
    </div>
  );
}
