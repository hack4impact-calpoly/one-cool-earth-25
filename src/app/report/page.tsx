"use client";

import { useCallback, useEffect, useState } from "react";
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

type ReportData = {
  summary: {
    volunteers: number;
    returning: number;
    events: number;
    hours: number;
  };
  schools: Table[];
  organizations: Table[];
};

export default function WorkdayReport() {
  const { isLoaded } = useUser();
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-12-31");
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    if (!isLoaded) return;

    setIsReportLoading(true);
    setReportError(null);

    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
      });

      const response = await fetch(`/api/report?${params.toString()}`, {
        cache: "no-store",
      });
      const data = (await response.json().catch(() => null)) as (ReportData & { error?: string }) | null;

      if (!response.ok || !data) {
        throw new Error(data?.error || "Failed to load report");
      }

      setReportData({
        summary: data.summary,
        schools: data.schools,
        organizations: data.organizations,
      });
    } catch (error) {
      setReportData(null);
      setReportError(error instanceof Error ? error.message : "Failed to load report");
    } finally {
      setIsReportLoading(false);
    }
  }, [endDate, isLoaded, startDate]);

  useEffect(() => {
    void fetchReport();
  }, [fetchReport]);

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
              <button
                type="button"
                className={styles.arrowButton}
                onClick={() => {
                  void fetchReport();
                }}
                disabled={isReportLoading}
                aria-label="Refresh report"
              >
                →
              </button>
            </div>
          </div>

          <div className={styles.summaryRow}>
            <div className={styles.summaryBox}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryValueBold}>{reportData?.summary.volunteers ?? 0} volunteers</span>
              </div>

              <div className={styles.summaryItem}>
                <span className={styles.summaryValue}>{reportData?.summary.returning ?? 0} returning</span>
              </div>
            </div>

            <div className={styles.summaryBox}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryValueBold}>{reportData?.summary.events ?? 0} events</span>
              </div>

              <div className={styles.summaryItem}>
                <span className={styles.summaryValue}>{reportData?.summary.hours ?? 0} hours</span>
              </div>
            </div>
          </div>

          {isReportLoading ? (
            <div className={styles.reportStatus}>Loading report data...</div>
          ) : reportError ? (
            <div className={styles.reportError}>{reportError}</div>
          ) : null}

          <div className={styles.subTitle}>Schools</div>
          {reportData && reportData.schools.length > 0 ? (
            <WorkdayReportCard tableData={reportData.schools} />
          ) : (
            <div className={styles.emptyReport}>No school data found for this date range.</div>
          )}

          <div className={styles.subTitle}>Organizations</div>
          {reportData && reportData.organizations.length > 0 ? (
            <WorkdayReportCard tableData={reportData.organizations} />
          ) : (
            <div className={styles.emptyReport}>No organization data found for this date range.</div>
          )}
        </div>
      )}
    </div>
  );
}
