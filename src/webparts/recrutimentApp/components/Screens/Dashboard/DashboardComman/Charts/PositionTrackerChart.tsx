import React, { useMemo, useState } from "react";
import { ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ComposedChart, Bar, Line } from "recharts";
import styles from "./PositionTrackerChart.module.scss";
import Card from "../../Common/Card";
import { IMonthlyTrackerItem } from "../../Types";

interface PositionTrackerChartProps {
  data: IMonthlyTrackerItem[] | undefined;
  loading?: boolean;
}

export const PositionTrackerChart: React.FC<PositionTrackerChartProps> = ({ data, loading = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const rawChartData = useMemo(() => data || [], [data]);
  const totalPages = Math.ceil(rawChartData.length / itemsPerPage);
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));

  const chartData = useMemo(() => {
    return rawChartData.slice(
      (safeCurrentPage - 1) * itemsPerPage,
      safeCurrentPage * itemsPerPage
    );
  }, [rawChartData, safeCurrentPage]);

  const memoizedOptions = useMemo(() => {
    return {
      tooltipCursor: { fill: "rgba(0, 0, 0, 0.02)" },
      barRadius: [4, 4, 0, 0] as [number, number, number, number],
    };
  }, []);

  if (loading || !data) {
    return (
      <Card className={styles.chartCard}>
        <div className={styles.header}>
          <div className="dashboard-skeleton__bar" style={{ width: "180px", height: "14px" }} />
        </div>
        <div className={styles.chartPlaceholder} style={{ padding: "20px 0" }}>
          <div className="dashboard-skeleton__bar" style={{ width: "100%", height: "200px", borderRadius: "8px" }} />
        </div>
      </Card>
    );
  }

  const pages = Array.from({ length: totalPages }, (_, idx) => idx + 1);

  return (
    <Card className={styles.chartCard}>
      <div className={styles.header}>
        <h3 className={styles.title}>My Positions Tracker (Monthly)</h3>
      </div>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
            />
            <Tooltip cursor={memoizedOptions.tooltipCursor} />
            <Legend
              verticalAlign="top"
              align="left"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingBottom: 15, fontSize: 11, fontWeight: 700, color: "#64748b" }}
            />
            <Bar
              name="Total Positions"
              dataKey="totalPositions"
              fill="#3b82f6"
              radius={memoizedOptions.barRadius}
              barSize={12}
            />
            <Bar
              name="Positions Filled"
              dataKey="positionsFilled"
              fill="#10b981"
              radius={memoizedOptions.barRadius}
              barSize={12}
            />
            <Line
              name="Open Positions"
              type="monotone"
              dataKey="openPositions"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 1, fill: "#fff" }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            type="button"
            className={styles.pageArrow}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={safeCurrentPage === 1}
            aria-label="Previous Page"
          >
            ‹
          </button>
          {pages.map((p) => (
            <button
              key={p}
              type="button"
              className={`${styles.pageNumber} ${p === safeCurrentPage ? styles.active : ""}`}
              onClick={() => setCurrentPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            className={styles.pageArrow}
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={safeCurrentPage === totalPages}
            aria-label="Next Page"
          >
            ›
          </button>
        </div>
      )}
    </Card>
  );
};

export default PositionTrackerChart;
