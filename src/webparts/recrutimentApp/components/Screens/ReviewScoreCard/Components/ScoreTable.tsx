
import * as React from "react";
import styles from "../ReviewScorecard.module.scss";
import * as strings from 'RecrutimentAppWebPartStrings';
import { Text } from '@microsoft/sp-core-library';

interface ScoreRow {
  criteria: string;
  total?:   number | string;
  [key: string]: any;
}

interface Props {
  title:        string;
  subtitle:     string;
  accentColor:  string;
  rows:         ScoreRow[];
  panelMembers: string[];
  showTotal?:   boolean;
  emptyText?:   string;
}

const ScoreTable: React.FC<Props> = ({
  title, subtitle, accentColor, rows, panelMembers,
  showTotal = false, emptyText = strings.NoDataAvailable,
}) => (
  <div className={styles.mSection}>
    <div className={styles.mSectionHeader}>
      <div className={styles.mSectionBar} style={{ background: accentColor }} />
      <div>
        <div className={styles.mSectionTitle}>{title}</div>
        <div className={styles.mSectionSub}>{subtitle}</div>
      </div>
    </div>
    <div className={styles.tableScroll}>
      <table className={styles.scoreTable}>
        <thead>
          <tr>
            <th>{strings.Criteria}</th>
            {panelMembers.map((name, i) => (
              <th key={i}>
                {strings.Interviewer}{i + 1}<br />
                <span className={styles.interviewerName}>({name || ""})</span>
              </th>
            ))}
            {showTotal && <th>{strings.Total}</th>}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={panelMembers.length + (showTotal ? 2 : 1)}
                className={styles.noData}
              >
                {emptyText}
              </td>
            </tr>
          ) : rows.map((row, idx) => (
            <tr
              key={idx}
              className={
                row.criteria === "Total" ? styles.totalRow
                  : idx % 2 === 0 ? styles.stripedRow : ""
              }
            >
              <td><strong>{row.criteria}</strong></td>
              {panelMembers.map((_, j) => (
                <td key={j}>{row[Text.format(strings.Panel, )] ?? ""}</td>
              ))}
              {showTotal && <td><strong>{row.total}</strong></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ScoreTable;