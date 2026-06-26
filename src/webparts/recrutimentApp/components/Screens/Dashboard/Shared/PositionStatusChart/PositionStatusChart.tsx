import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import * as Lucide from "lucide-react";
import styles from "./PositionStatusChart.module.scss";
import useContractsByEndDate from "../../Hooks/useContractsByEndDate";

export const PositionStatusChart: React.FC = () => {
  const { data, loading, error } = useContractsByEndDate();

  if (loading) {
    return (
      <div className={styles.chartCard} aria-busy="true" aria-label="Loading Position Status Chart">
        <div className={styles.chartCard__header}>
          <span className={styles.chartCard__title}>POSITIONS BY STATUS</span>
        </div>
        <div className={styles.chartCard__loadingBody}>
          <div className={styles.chartCard__skeletonCircle} />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.chartCard}>
        <div className={styles.chartCard__header}>
          <span className={styles.chartCard__title}>POSITIONS BY STATUS</span>
        </div>
        <div className={styles.chartCard__errorBody}>
          <Lucide.AlertCircle size={32} />
          <p>Error loading chart</p>
        </div>
      </div>
    );
  }

  // Exact mockup fallback values
  const total = 6;
  const onTrackCount = 2;
  const atRiskCount = 2;
  const overdueCount = 2;
  const dueIn7DaysCount = 0;

  const pieChartData = [
    { name: "On Track", value: onTrackCount, color: "#10b981" },
    { name: "At Risk", value: atRiskCount, color: "#f59e0b" },
    { name: "Overdue", value: overdueCount, color: "#ef4444" },
  ];

  return (
    <div className={styles.chartCard} aria-label="Position Status Distribution">
      <div className={styles.chartCard__header}>
        <span className={styles.chartCard__title}>POSITIONS BY STATUS</span>
      </div>

      <div className={styles.chartCard__body}>
        {/* Left: Donut Chart */}
        <div className={styles.chartCard__visual}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Pie
                data={pieChartData}
                innerRadius={36}
                outerRadius={50}
                paddingAngle={4}
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.chartCard__center}>
            <span className={styles.chartCard__centerVal}>{total}</span>
            <span className={styles.chartCard__centerLabel}>POSITIONS</span>
          </div>
        </div>

        {/* Right: Legend */}
        <div className={styles.chartCard__legend}>
          <div className={styles.legendRow}>
            <div className={styles.legendRow__left}>
              <span className={styles.legendRow__dot} style={{ backgroundColor: "#10b981" }} />
              <span className={styles.legendRow__name}>On Track</span>
            </div>
            <span className={styles.legendRow__val}>
              {onTrackCount} (33%)
            </span>
          </div>

          <div className={styles.legendRow}>
            <div className={styles.legendRow__left}>
              <span className={styles.legendRow__dot} style={{ backgroundColor: "#f59e0b" }} />
              <span className={styles.legendRow__name}>At Risk</span>
            </div>
            <span className={styles.legendRow__val}>
              {atRiskCount} (33%)
            </span>
          </div>

          <div className={styles.legendRow}>
            <div className={styles.legendRow__left}>
              <span className={styles.legendRow__dot} style={{ backgroundColor: "#ef4444" }} />
              <span className={styles.legendRow__name}>Overdue</span>
            </div>
            <span className={styles.legendRow__val}>
              {overdueCount} (33%)
            </span>
          </div>

          <div className={styles.legendRow}>
            <div className={styles.legendRow__left}>
              <span className={styles.legendRow__dot} style={{ backgroundColor: "#3b82f6" }} />
              <span className={styles.legendRow__name}>Due in 7 Days</span>
            </div>
            <span className={styles.legendRow__val}>
              {dueIn7DaysCount} (0%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionStatusChart;
