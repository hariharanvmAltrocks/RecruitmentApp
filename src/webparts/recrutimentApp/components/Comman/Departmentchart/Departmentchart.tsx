import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  TooltipProps,
} from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./departmentChart.module.scss";
import useDepartmentChart, {
  DepartmentDataItem,
} from "../../Screens/Dashboard/Hooks/Usedepartmentchart";
import { useTheme } from "../../../theme/ThemeContext";

// ─── Props ────────────────────────────────────────────────────────────────────
export interface DepartmentChartProps {
  data?: DepartmentDataItem[];
  itemsPerPage?: number;
  title?: string;
  subtitle?: string;
  tooltipValueLabel?: string;
  refreshKey?: number;
}

const CustomTooltip: React.FC<
  TooltipProps<number, string> & { tooltipValueLabel?: string }
> = ({ active, payload, tooltipValueLabel = "Openings" }) => {
  if (!active || !payload?.length) return null;

  const { name, value } = payload[0].payload as DepartmentDataItem;

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{name}</p>
      <p className={styles.tooltipValue}>{value}</p>
      <p className={styles.tooltipSub}>{tooltipValueLabel}</p>
    </div>
  );
};

const DepartmentChart: React.FC<DepartmentChartProps> = ({
  data,
  itemsPerPage = 7,
  title = "Departmental Demand",
  subtitle = "Pending recruitment lifecycle status",
  tooltipValueLabel = "Openings",
  refreshKey = 0,
}) => {
  const theme = useTheme();
  const resolvedGradientStart =  theme.primaryColor;
  const resolvedGradientEnd =  theme.secondaryColor;

  const {
    visibleData,
    currentPage,
    totalPages,
    hasPrev,
    hasNext,
    handleNext,
    handlePrev,
  } = useDepartmentChart({ itemsPerPage, refreshKey });

  const gradientId = "deptBarGradient";

  return (
    <div className={styles.card}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.titleRow}>
            <span className={styles.dot} aria-hidden="true" />
            <h2 className={styles.title}>{title}</h2>
          </div>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        {/* ── Pagination ── */}
        <div
          className={styles.pagination}
          role="navigation"
          aria-label="Chart pages"
        >
          <button
            className={`${styles.pageBtn} ${hasPrev ? styles.active : styles.disabled}`}
            onClick={handlePrev}
            disabled={!hasPrev}
            aria-label="Previous page"
          >
            <ChevronLeft size={20} />
          </button>

          <div className={styles.pageInfo} aria-live="polite">
            <span className={styles.pageNumbers}>
              {currentPage} / {totalPages}
            </span>
            <span className={styles.pageLabel}>Pages</span>
          </div>

          <button
            className={`${styles.pageBtn} ${hasNext ? styles.active : styles.disabled}`}
            onClick={handleNext}
            disabled={!hasNext}
            aria-label="Next page"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* ── Chart ── */}
      <div className={styles.chartArea}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={visibleData}
            margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={resolvedGradientStart} stopOpacity={1} />
                <stop offset="100%" stopColor={resolvedGradientEnd} stopOpacity={0.9} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--app-sidenav-border, #f1f5f9)"
            />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--app-text-color, #64748b)", fontSize: 10, fontWeight: 900 }}
              interval={0}
              height={50}
              padding={{ left: 20, right: 20 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--app-text-color, #94a3b8)", fontSize: 10, fontWeight: 900 }}
            />

            <Tooltip
              cursor={{ fill: "var(--app-secondary-color, #f8fafc)", radius: [12, 12, 0, 0] } as object}
              content={<CustomTooltip tooltipValueLabel={tooltipValueLabel} />}
            />

            <Bar
              dataKey="value"
              fill={`url(#${gradientId})`}
              radius={[12, 12, 4, 4]}
              maxBarSize={45}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {visibleData.map((_, index) => (
                <Cell key={`cell-${index}`} fillOpacity={1 - index * 0.05} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DepartmentChart;
