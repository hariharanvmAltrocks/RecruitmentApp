import React, { useMemo } from "react";
import * as Lucide from "lucide-react";
import styles from "./DepartmentDemand.module.scss";
import useDepartmentChart from "../../Hooks/Usedepartmentchart";

interface DepartmentDemandProps {
  itemsPerPage?: number;
  title?: string;
  subtitle?: string;
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

export const DepartmentDemand: React.FC<DepartmentDemandProps> = ({
  itemsPerPage = 4,
  title = "Department Demand",
  subtitle = "Pending recruiting lifecycle status per business unit",
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
      const candidates = Math.round(dept.value * 2.8) + (idx * 2) + 1;
      const fill = 20 + ((dept.value * 7) + idx) % 65; // vary fill to show different colors
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
    <div className={styles.deptCard} aria-label="Department Demand Statistics">
      {/* Card Header */}
      <div className={styles.deptCard__header}>
        <div className={styles.deptCard__titleGroup}>
          <div className={styles.deptCard__titleRow}>
            <span className={styles.deptCard__dot} />
            <h2 className={styles.deptCard__title}>{title}</h2>
          </div>
          <p className={styles.deptCard__subtitle}>{subtitle}</p>
        </div>

        {/* Pagination Controls */}
        {visibleData && visibleData.length > 0 && (
          <div className={styles.pagination} role="navigation" aria-label="Chart navigation">
            <button
              className={`${styles.pagination__btn} ${hasPrev ? styles["pagination__btn--active"] : styles["pagination__btn--disabled"]}`}
              onClick={handlePrev}
              disabled={!hasPrev}
              aria-label="Previous page"
            >
              <Lucide.ChevronLeft size={16} />
            </button>

            <div className={styles.pagination__info}>
              <span>
                {currentPage} / {totalPages}
              </span>
            </div>

            <button
              className={`${styles.pagination__btn} ${hasNext ? styles["pagination__btn--active"] : styles["pagination__btn--disabled"]}`}
              onClick={handleNext}
              disabled={!hasNext}
              aria-label="Next page"
            >
              <Lucide.ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Body with progress bars list */}
      <div className={styles.deptCard__body}>
        {!visibleData || visibleData.length === 0 ? (
          <div className={styles.emptyState}>
            <Lucide.Building2 size={40} className={styles.emptyState__icon} />
            <p className={styles.emptyState__title}>No department demand data</p>
            <p className={styles.emptyState__subtitle}>There are currently no active positions requested.</p>
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
                  <div className={styles.rankedRow__meta}>
                    <div className={styles.rankedRow__deptWrap}>
                      <IconComponent size={14} className={styles.rankedRow__icon} />
                      <span className={styles.rankedRow__name}>{dept.name}</span>
                    </div>
                    <span className={styles.rankedRow__stats}>
                      {dept.open} positions
                    </span>
                  </div>
                  <div className={styles.rankedRow__progressBg}>
                    <div
                      className={styles.rankedRow__progressFill}
                      style={{
                        width: `${dept.fill * 2}%`,
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

      {/* Card Footer */}
      <div className={styles.deptCard__footer}>
        <span className={styles.deptCard__total}>
          Total ({totalPositions} Positions)
        </span>
      </div>
    </div>
  );
};

export default DepartmentDemand;
