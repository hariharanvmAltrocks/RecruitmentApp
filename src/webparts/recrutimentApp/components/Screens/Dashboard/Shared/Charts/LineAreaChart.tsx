import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import styles from "./Charts.module.scss";

const MOCK_TIME_DATA = [
  { name: "May '25", onTrack: 10, atRisk: 3, overdue: 1 },
  { name: "Jun '25", onTrack: 12, atRisk: 4, overdue: 2 },
  { name: "Jul '25", onTrack: 11, atRisk: 3, overdue: 2 },
  { name: "Aug '25", onTrack: 14, atRisk: 5, overdue: 3 },
  { name: "Sep '25", onTrack: 15, atRisk: 4, overdue: 3 },
  { name: "Oct '25", onTrack: 18, atRisk: 6, overdue: 3 }
];

export const LineAreaChart: React.FC = () => {
  return (
    <div className={styles.lineChartContainer}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={MOCK_TIME_DATA}
          margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorOnTrack" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorAtRisk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorOverdue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: "#64748b", fontSize: 11 }}
          />
          <YAxis 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: "#64748b", fontSize: 11 }} 
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className={styles.lineChartTooltip}>
                    <div className={styles.tooltipTitle}>{label}</div>
                    {payload.map((p, index) => (
                      <div key={index} className={styles.tooltipItem}>
                        <span className={styles.tooltipDot} style={{ backgroundColor: p.color }} />
                        <span className={styles.tooltipLabel}>{p.name}:</span>
                        <span className={styles.tooltipValue}>{p.value}</span>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="onTrack"
            name="On Track"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorOnTrack)"
          />
          <Area
            type="monotone"
            dataKey="atRisk"
            name="At Risk"
            stroke="#f59e0b"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorAtRisk)"
          />
          <Area
            type="monotone"
            dataKey="overdue"
            name="Overdue"
            stroke="#ef4444"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorOverdue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
export default LineAreaChart;
