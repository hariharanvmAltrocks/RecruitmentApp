import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import styles from "./Charts.module.scss";

interface GaugeChartProps {
  value: number; // 0 to 100
  label?: string;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({ value, label = "SLA Compliance" }) => {
  // Map value to gauge segments (half donut is 180 degrees)
  const chartData = [
    { value: value },
    { value: 100 - value }
  ];

  // Colors based on performance thresholds
  let activeColor = "#ef4444"; // Red < 70%
  if (value >= 90) {
    activeColor = "#10b981"; // Green >= 90%
  } else if (value >= 70) {
    activeColor = "#f59e0b"; // Orange 70-89%
  }

  const COLORS = [activeColor, "#e2e8f0"];

  return (
    <div className={styles.gaugeContainer}>
      <div className={styles.gaugeWrapper}>
        <ResponsiveContainer width="100%" height={150}>
          <PieChart margin={{ top: 10, bottom: 0 }}>
            <Pie
              data={chartData}
              cx="50%"
              cy="90%"
              startAngle={180}
              endAngle={0}
              innerRadius={70}
              outerRadius={95}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={COLORS[0]} />
              <Cell fill={COLORS[1]} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.gaugeTextCenter}>
          <span className={styles.gaugeValue}>{value}%</span>
          <span className={styles.gaugeLabel}>{label}</span>
        </div>
      </div>
      
      <div className={styles.gaugeLegend}>
        <div className={styles.legendRow} style={{ borderBottom: "none" }}>
          <div className={styles.legendLeft}>
            <span className={styles.legendDot} style={{ backgroundColor: "#10b981" }} />
            <span>On Track (≥ 90%)</span>
          </div>
        </div>
        <div className={styles.legendRow} style={{ borderBottom: "none" }}>
          <div className={styles.legendLeft}>
            <span className={styles.legendDot} style={{ backgroundColor: "#f59e0b" }} />
            <span>At Risk (70-89%)</span>
          </div>
        </div>
        <div className={styles.legendRow} style={{ borderBottom: "none" }}>
          <div className={styles.legendLeft}>
            <span className={styles.legendDot} style={{ backgroundColor: "#ef4444" }} />
            <span>Below SLA (&lt; 70%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GaugeChart;
