"use client";

import styles from "../styles/WorkdayReport.module.css";

type Table = {
  name: string;
  events: number;
  volunteers: number;
  hours: number;
};

type TableMap = Record<string, Table>;

type Props = {
  tableData: TableMap;
};

export default function WorkdayReportCard({ tableData }: Props) {
  return (
    <div className={styles.card}>
      <table className={styles.table}>
        <tbody>
          {Object.entries(tableData).map(([id, data], index) => (
            <tr key={id} className={`${styles.row} ${index % 2 === 0 ? styles.rowLight : styles.rowDark}`}>
              <td className={styles.nameCell}>{data.name}</td>

              <td className={styles.infoCell}>
                <div className={styles.infoGroup}>
                  <span>{data.events} events</span>
                  <span>{data.volunteers} volunteers</span>
                  <span>{data.hours} hrs</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
