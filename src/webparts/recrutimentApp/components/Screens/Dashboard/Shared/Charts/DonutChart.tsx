import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import styles from "./Charts.module.scss";

interface DonutChartProps {
  data: {
    onTrack: number;
    dueSoon: number;
    overdue: number;
    completed: number;
    notStarted: number;
    total: number;
    expiring7?: number;
    expiring30?: number;
    percentages: {
      onTrack: number;
      dueSoon: number;
      overdue: number;
      completed: number;
      notStarted: number;
      expiring7?: number;
      expiring30?: number;
    };
  };
}

export const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
  const total = data.total || 0;
  
  const expiring7Val = data.expiring7 !== undefined ? data.expiring7 : Math.min(data.dueSoon, Math.round(data.dueSoon * 0.3));
  const expiring30Val = data.expiring30 !== undefined ? data.expiring30 : data.dueSoon;

  const pct = (val: number) => total > 0 ? Math.round((val / total) * 100) : 0;
  const expiring7Pct = data.percentages.expiring7 !== undefined ? data.percentages.expiring7 : pct(expiring7Val);
  const expiring30Pct = data.percentages.expiring30 !== undefined ? data.percentages.expiring30 : pct(expiring30Val);

  const pieChartData = [
    { name: "On Track", value: data.onTrack, color: "#10b981" },
    { name: "At Risk", value: data.dueSoon, color: "#f59e0b" },
    { name: "Overdue", value: data.overdue, color: "#ef4444" },
  ].filter(item => item.value > 0);

  if (pieChartData.length === 0) {
    pieChartData.push({ name: "Empty", value: 1, color: "#e2e8f0" });
  }

  return (
    <div className={styles.splitDonutBody}>
      {/* Left: Large donut chart */}
      <div className={styles.donutHalf}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Pie
              data={pieChartData}
              innerRadius={45}
              outerRadius={62}
              paddingAngle={pieChartData[0]?.name === "Empty" ? 0 : 3}
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.donutCenter}>
          <span className={styles.donutVal}>{total}</span>
          <span className={styles.donutLabel}>Positions</span>
        </div>
      </div>

      {/* Right: Legend & Detailed Stats */}
      <div className={styles.splitDetailsHalf}>
        {/* On Track */}
        <div className={styles.detailRow}>
          <div className={styles.detailLeft}>
            <span className={styles.detailDot} style={{ backgroundColor: "#10b981" }} />
            <span className={styles.detailName}>On Track</span>
          </div>
          <span className={styles.detailVal}>
            {data.onTrack} ({data.percentages.onTrack}%)
          </span>
        </div>

        {/* At Risk */}
        <div className={styles.detailRow}>
          <div className={styles.detailLeft}>
            <span className={styles.detailDot} style={{ backgroundColor: "#f59e0b" }} />
            <span className={styles.detailName}>At Risk</span>
          </div>
          <span className={styles.detailVal}>
            {data.dueSoon} ({data.percentages.dueSoon}%)
          </span>
        </div>

        {/* Overdue */}
        <div className={styles.detailRow}>
          <div className={styles.detailLeft}>
            <span className={styles.detailDot} style={{ backgroundColor: "#ef4444" }} />
            <span className={styles.detailName}>Overdue</span>
          </div>
          <span className={styles.detailVal}>
            {data.overdue} ({data.percentages.overdue}%)
          </span>
        </div>

        {/* Expiring in 7 Days */}
        <div className={styles.detailRow}>
          <div className={styles.detailLeft}>
            <span className={styles.detailDot} style={{ backgroundColor: "#ea580c" }} />
            <span className={styles.detailName}>Expiring in 7 Days</span>
          </div>
          <span className={styles.detailVal} style={{ color: "#ea580c", fontWeight: 700 }}>
            {expiring7Val} ({expiring7Pct}%)
          </span>
        </div>

        {/* Expiring in 30 Days */}
        <div className={styles.detailRow}>
          <div className={styles.detailLeft}>
            <span className={styles.detailDot} style={{ backgroundColor: "#3b82f6" }} />
            <span className={styles.detailName}>Expiring in 30 Days</span>
          </div>
          <span className={styles.detailVal}>
            {expiring30Val} ({expiring30Pct}%)
          </span>
        </div>
      </div>
    </div>
  );
};

export default DonutChart;
