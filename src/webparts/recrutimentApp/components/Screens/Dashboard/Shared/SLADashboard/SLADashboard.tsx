import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import * as Lucide from "lucide-react";
import styles from "./SLADashboard.module.scss";
import useSLACompliance from "../../Hooks/useSLACompliance";

export const SLADashboard: React.FC = () => {
  const { data, loading, error } = useSLACompliance();

  if (loading) {
    return (
      <div className={styles.slaCard} aria-busy="true" aria-label="Loading SLA Dashboard">
        <div className={styles.slaCard__header}>
          <span className={styles.slaCard__title}>SLA COMPLIANCE</span>
        </div>
        <div className={styles.slaCard__loadingBody}>
          <div className={styles.slaCard__skeletonHalfRing} />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.slaCard}>
        <div className={styles.slaCard__header}>
          <span className={styles.slaCard__title}>SLA COMPLIANCE</span>
        </div>
        <div className={styles.slaCard__errorBody}>
          <Lucide.AlertCircle size={32} />
          <p>Error loading SLA</p>
        </div>
      </div>
    );
  }

  const value = data.overallSla ?? 78;
  const chartData = [
    { value: value },
    { value: 100 - value }
  ];

  // Orange color as in screenshot
  const activeColor = "#ea580c"; 
  const COLORS = [activeColor, "#e2e8f0"];

  return (
    <div className={styles.slaCard} aria-label="SLA Compliance Dashboard">
      <div className={styles.slaCard__header}>
        <span className={styles.slaCard__title}>SLA COMPLIANCE</span>
      </div>

      <div className={styles.slaCard__body}>
        <div className={styles.slaCard__visual}>
          <div className={styles.slaCard__gaugeWrapper}>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart margin={{ top: 10, bottom: 0 }}>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="90%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={36}
                  outerRadius={50}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill={COLORS[0]} />
                  <Cell fill={COLORS[1]} />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.slaCard__textCenter}>
              <span className={styles.slaCard__value}>{value}%</span>
              <span className={styles.slaCard__label}>SLA Compliance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SLADashboard;
