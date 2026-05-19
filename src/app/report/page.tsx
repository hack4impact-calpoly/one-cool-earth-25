"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { LoaderCircle } from "lucide-react";
import styles from "../../styles/WorkdayReport.module.css";
import WorkdayReportCard from "../../components/WorkdayReportCard";
import NavBarWrapper from "@/components/NavbarWrapper";

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
  entry3: { name: "School 3", events: 4, volunteers: 23, hours: 52 },
  entry4: { name: "School 4", events: 2, volunteers: 8, hours: 28 },
  entry5: { name: "School 5", events: 1, volunteers: 17, hours: 20 },
};

const organizationData: TableMap = {
  entry1: { name: "Company Name 1", events: 3, volunteers: 15, hours: 40 },
  entry2: { name: "Company Name 2", events: 2, volunteers: 17, hours: 28 },
  entry3: { name: "Company Name 3", events: 4, volunteers: 23, hours: 52 },
  entry4: { name: "Company Name 4", events: 2, volunteers: 8, hours: 28 },
  entry5: { name: "Company Name 5", events: 1, volunteers: 17, hours: 20 },
};

export default function WorkdayReport() {
  const { isLoaded } = useUser();
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-12-31");

  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <div>
      <div className={styles.desktopNav}>
        <NavBarWrapper />
      </div>

      {!isLoaded ? (
        <main className={styles.pageLoading} aria-live="polite">
          <LoaderCircle className={styles.loadingIcon} aria-hidden="true" />
          <span>Loading report...</span>
        </main>
      ) : (
        <div className={styles.container}>
          <div className={styles.mobileHeader}>
            <div className={styles.mobileHeaderBar}>
              <div className={styles.mobileBrand}>GARDEN WORKDAY EVENTS</div>

              <button type="button" className={styles.mobileMenuButton} aria-label="Open menu">
                <span className={styles.mobileMenuLine} />
                <span className={styles.mobileMenuLine} />
                <span className={styles.mobileMenuLine} />
              </button>
            </div>
          </div>

          <div className={styles.topBar}>
            <div className={styles.headerTitleRow}>
              <div className={styles.headerTitle}>Garden Workday Report</div>

              <button type="button" className={styles.mobilePdfButton} onClick={handleDownloadPdf}>
                PDF
              </button>
            </div>

            <div className={styles.dateFilter}>
              <button type="button" className={styles.desktopPdfButton} onClick={handleDownloadPdf}>
                PDF
              </button>

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
              <button type="button" className={styles.arrowButton}>
                →
              </button>
            </div>
          </div>

          <div className={styles.summaryRow}>
            <div className={styles.summaryBox}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryValueBold}>54 volunteers</span>
              </div>

              <div className={styles.summaryItem}>
                <span className={styles.summaryValue}>12 returning</span>
              </div>
            </div>

            <div className={styles.summaryBox}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryValueBold}>12 events</span>
              </div>

              <div className={styles.summaryItem}>
                <span className={styles.summaryValue}>120 hours</span>
              </div>
            </div>
          </div>

          <div className={styles.subTitle}>Schools</div>
          <WorkdayReportCard tableData={schoolData} />

          <div className={styles.subTitle}>Organizations</div>
          <WorkdayReportCard tableData={organizationData} />
        </div>
      )}
    </div>
  );
}
