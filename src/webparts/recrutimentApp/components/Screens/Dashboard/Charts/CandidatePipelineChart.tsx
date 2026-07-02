import React from "react";
import styles from "./CandidatePipelineChart.module.scss";
import Card from "../Common/Card";
import { ICandidatePipelineStage } from "../Types";

interface CandidatePipelineChartProps {
  data: ICandidatePipelineStage[] | undefined;
  loading?: boolean;
}

export const CandidatePipelineChart: React.FC<CandidatePipelineChartProps> = ({ data, loading = false }) => {
  if (loading || !data) {
    return (
      <Card className={styles.container}>
        <div className={styles.header}>
          <div className="dashboard-skeleton__bar" style={{ width: "180px", height: "14px" }} />
        </div>
        <div className={styles.tablePlaceholder}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className={styles.loadingRow} style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
              <div className="dashboard-skeleton__bar" style={{ width: "100%", height: "12px", borderRadius: "4px" }} />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>My Candidate Pipeline</h3>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thLeft}>Stage</th>
              <th>Count</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {data.map((stage, index) => (
              <tr key={index}>
                <td className={styles.tdStage}>{stage.stage}</td>
                <td className={styles.tdCount}>{stage.count}</td>
                <td className={styles.tdPercent}>{stage.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default CandidatePipelineChart;
