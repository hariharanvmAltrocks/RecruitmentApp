import React from "react";
import * as Lucide from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import styles from "./PositionStatusChart.module.scss";
import { IPositionStatus } from "../../Types";

interface IPositionStatusChartProps {
  data: IPositionStatus | null | undefined;
  loading?: boolean;
}

export const PositionStatusChart: React.FC<IPositionStatusChartProps> = ({ data, loading }) => {

  const onTrackCount = data?.OnTrack ?? 0;
  const atRiskCount = data?.atRisk ?? 0;
  const overdueCount = data?.overduecount ?? 0;
  const dueIn7DaysCount = data?.dueLast7days ?? 0;
  const total = data?.total ?? 0;

  const getPercentageStr = (count: number) => {
    if (total === 0) return "0%";
    return `${Math.round((count / total) * 100)}%`;
  };

  const pieChartData = [
    { name: "On Track", value: onTrackCount, color: "#10b981" },
    { name: "At Risk", value: atRiskCount, color: "#f59e0b" },
    { name: "Overdue", value: overdueCount, color: "#ef4444" },
  ];

  if (loading) {
    return (
      <div className={styles.chartCard} aria-label="Position Status Distribution Loading">
        <div className={styles.chartCard__header}>
          <div className="dashboard-skeleton__bar" style={{ width: "130px", height: "14px" }} />
        </div>
        <div className={styles.chartCard__body}>
          {/* Left: Donut Chart Placeholder */}
          <div className={styles.chartCard__visual} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="dashboard-skeleton__bar" style={{ width: "90px", height: "90px", borderRadius: "50%" }} />
          </div>
          {/* Right: Legend Placeholder */}
          <div className={styles.chartCard__legend} style={{ display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center" }}>
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className={styles.legendRow}>
                <div className={styles.legendRow__left}>
                  <div className="dashboard-skeleton__bar" style={{ width: "10px", height: "10px", borderRadius: "50%", marginRight: "8px" }} />
                  <div className="dashboard-skeleton__bar" style={{ width: "70px", height: "10px" }} />
                </div>
                <div className="dashboard-skeleton__bar" style={{ width: "40px", height: "10px" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chartCard} aria-label="Position Status Distribution">
      <div className={styles.chartCard__header}>
        <Lucide.PieChart size={16} className={styles.iconBlue} />
        <h3 className={styles.chartCard__title}>POSITIONS BY STATUS</h3>
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
              {onTrackCount} ({getPercentageStr(onTrackCount)})
            </span>
          </div>

          <div className={styles.legendRow}>
            <div className={styles.legendRow__left}>
              <span className={styles.legendRow__dot} style={{ backgroundColor: "#f59e0b" }} />
              <span className={styles.legendRow__name}>At Risk</span>
            </div>
            <span className={styles.legendRow__val}>
              {atRiskCount} ({getPercentageStr(atRiskCount)})
            </span>
          </div>

          <div className={styles.legendRow}>
            <div className={styles.legendRow__left}>
              <span className={styles.legendRow__dot} style={{ backgroundColor: "#ef4444" }} />
              <span className={styles.legendRow__name}>Overdue</span>
            </div>
            <span className={styles.legendRow__val}>
              {overdueCount} ({getPercentageStr(overdueCount)})
            </span>
          </div>

          <div className={styles.legendRow}>
            <div className={styles.legendRow__left}>
              <span className={styles.legendRow__dot} style={{ backgroundColor: "#3b82f6" }} />
              <span className={styles.legendRow__name}>Due in 7 Days</span>
            </div>
            <span className={styles.legendRow__val}>
              {dueIn7DaysCount} ({getPercentageStr(dueIn7DaysCount)})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionStatusChart;
