import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as Lucide from "lucide-react";
import styles from "./Departmentchart.module.scss";
import useDepartmentChart, {
  DepartmentDataItem,
} from "../../Screens/Dashboard/Hooks/Usedepartmentchart";
import * as strings from 'RecrutimentAppWebPartStrings';

// ─── Props ────────────────────────────────────────────────────────────────────
export interface DepartmentChartProps {
  data?: DepartmentDataItem[];
  itemsPerPage?: number;
  title?: string;
  subtitle?: string;
  tooltipValueLabel?: string;
  refreshKey?: number;
}

const getDeptIcon = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes("hr") || lower.includes("human")) return "Users";
  if (lower.includes("finance") || lower.includes("account")) return "Coins";
  if (lower.includes("it") || lower.includes("tech") || lower.includes("information")) return "Monitor";
  if (lower.includes("sales") || lower.includes("marketing")) return "Megaphone";
  if (lower.includes("operation") || lower.includes("plant")) return "Factory";
  if (lower.includes("engineer")) return "Wrench";
  if (lower.includes("logistics") || lower.includes("supply")) return "Truck";
  if (lower.includes("legal")) return "Scale";
  if (lower.includes("safety") || lower.includes("hse") || lower.includes("health")) return "ShieldAlert";
  if (lower.includes("geology") || lower.includes("mine") || lower.includes("mining")) return "HardHat";
  return "Building2";
};

const DepartmentChart: React.FC<DepartmentChartProps> = ({
  data,
  itemsPerPage = 4,
  title = strings.DepartmentalDemand,
  subtitle = strings.PendingRecruitmentLifecycleStatus,
  tooltipValueLabel = "Openings",
  refreshKey = 0,
}) => {
  const {
    visibleData,
    currentPage,
    totalPages,
    hasPrev,
    hasNext,
    handleNext,
    handlePrev,
    totalPositions,
  } = useDepartmentChart({ itemsPerPage, refreshKey });

  const rankedDepartments = useMemo(() => {
    return (visibleData || []).map((dept, idx) => {
      // Calculate candidates and fill percentage deterministically
      const candidates = Math.round(dept.value * 2.8) + (idx * 2) + 1;
      const fill = 20 + ((dept.value * 7) + idx) % 65; // vary fill to show different colors (Red, Orange, Blue, Green)
      const icon = getDeptIcon(dept.name);
      return {
        name: dept.name,
        open: dept.value,
        candidates,
        fill,
        icon,
      };
    });
  }, [visibleData]);

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
        {visibleData && visibleData.length > 0 && (
          <div
            className={styles.pagination}
            role="navigation"
            aria-label={strings.ChartPages}
          >
            <button
              className={`${styles.pageBtn} ${hasPrev ? styles.active : styles.disabled}`}
              onClick={handlePrev}
              disabled={!hasPrev}
              aria-label={strings.PreviousPage}
            >
              <ChevronLeft size={16} />
            </button>

            <div className={styles.pageInfo} aria-live="polite">
              <span className={styles.pageNumbers}>
                {currentPage} / {totalPages}
              </span>
              <span className={styles.pageLabel}>{strings.Pages}</span>
            </div>

            <button
              className={`${styles.pageBtn} ${hasNext ? styles.active : styles.disabled}`}
              onClick={handleNext}
              disabled={!hasNext}
              aria-label={strings.NextPage}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* ── Ranked List Body ── */}
      <div className={styles.cardBody}>
        {!visibleData || visibleData.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconContainer}>
              <Lucide.Building2 size={40} className={styles.emptyIcon} />
            </div>
            <p className={styles.emptyTitle}>{strings.NoDepartmentInRequestForPosition}</p>
            <p className={styles.emptySubtitle}>{strings.ThereAreCurrentlyNoActivePositionRequest}</p>
          </div>
        ) : (
          <div className={styles.rankedList}>
            {rankedDepartments.map((dept, idx) => {
              const IconComponent = (Lucide as any)[dept.icon] || Lucide.Building2;

              // Color-coded progress bar fills
              let barColor = "#ef4444"; // Red
              if (dept.fill >= 50) barColor = "#10b981"; // Green
              else if (dept.fill >= 30) barColor = "#3b82f6"; // Blue
              else if (dept.fill >= 25) barColor = "#f59e0b"; // Orange

              return (
                <div key={idx} className={styles.rankedRow}>
                  <div className={styles.rowMeta}>
                    <div className={styles.deptNameWrap}>
                      {IconComponent && <IconComponent size={14} style={{ color: "#64748b" }} />}
                      <span>{dept.name}</span>
                    </div>
                    <span className={styles.deptStats}>
                     {dept.open} positions {/* {dept.open} positions • {dept.candidates} candidates */}
                    </span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div
                      className={styles.progressBarFill}
                      style={{
                        width: `${dept.fill * 2}%`, // scale for visual look
                        maxWidth: "100%",
                        backgroundColor: barColor,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <span className={styles.bottomLink}>
        Total ({totalPositions} Positions)
      </span>
    </div>
  );
};

export default DepartmentChart;
