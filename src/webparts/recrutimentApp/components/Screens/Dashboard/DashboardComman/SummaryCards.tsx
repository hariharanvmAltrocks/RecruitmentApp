import React from "react";
import * as Lucide from "lucide-react";
import styles from "../DashboardComman/SummaryCards.module.scss";
import { IHRLeadDashboard, IDueMonth } from "../Types";

interface ISummaryCardProps {
  data: IHRLeadDashboard | null | undefined;
  loading?: boolean;
}

export const SummaryCards: React.FC<ISummaryCardProps> = ({ data, loading }) => {

  const [selectedDate, setSelectedDate] = React.useState<Date>(() => new Date(2026, 6, 1)); // Default: July 2026

  const handlePrevMonth = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const monthName = React.useMemo(() => {
    return selectedDate.toLocaleString("default", { month: "long" }).toUpperCase();
  }, [selectedDate]);

  const monthAbbrs: Record<number, keyof IDueMonth> = {
    0: "Jan", 1: "Feb", 2: "Mar", 3: "Apr", 4: "May", 5: "June", 6: "July", 7: "Aug", 8: "Sep", 9: "Jan", 10: "Nov", 11: "Dec"
  };

  const dueThisMonth = React.useMemo(() => {
    if (!data || !data.Duemonth) return "0 / 0";
    const m = selectedDate.getMonth();
    const key = monthAbbrs[m] || "Jan";
    return data.Duemonth[key] || "0 / 0";
  }, [selectedDate, data]);

  const totalPositions = data?.TotalOpenPosition ?? 0;
  const activePositions = data?.RecruitmentInProgress ?? 0;
  const completedPositions = data?.Onboarding ?? 0;
  const totalVacant = data?.OnemDocumentStage ?? 0;
  const overduePositions = data?.OverDuePosition ?? 0;

  if (loading) {
    return (
      <>
        {/* Overview Card Skeleton */}
        <div className={styles.overviewCard}>
          <div className={styles.cardHeader}>
            <div className="dashboard-skeleton__bar" style={{ width: "120px", height: "14px" }} />
          </div>
          <div className={styles.overviewGrid}>
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className={styles.subCard} style={{ borderStyle: "dashed", opacity: 0.7 }}>
                <div className="dashboard-skeleton__bar" style={{ width: "80%", height: "10px", marginBottom: "8px" }} />
                <div className="dashboard-skeleton__bar" style={{ width: "40%", height: "24px" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Due this month skeleton */}
        <div className={styles.kpiCard}>
          <div className={styles.cardHeaderWithNav}>
            <div className="dashboard-skeleton__bar" style={{ width: "120px", height: "14px" }} />
          </div>
          <div className={styles.kpiCardBody}>
            <div className="dashboard-skeleton__bar" style={{ width: "38px", height: "38px", borderRadius: "8px", marginBottom: "8px" }} />
            <div className="dashboard-skeleton__bar" style={{ width: "60px", height: "24px", marginBottom: "6px" }} />
            <div className="dashboard-skeleton__bar" style={{ width: "50px", height: "10px" }} />
          </div>
        </div>

        {/* Overdue positions skeleton */}
        <div className={styles.kpiCard}>
          <div className={styles.cardHeader}>
            <div className="dashboard-skeleton__bar" style={{ width: "120px", height: "14px" }} />
          </div>
          <div className={styles.kpiCardBody}>
            <div className="dashboard-skeleton__bar" style={{ width: "38px", height: "38px", borderRadius: "8px", marginBottom: "8px" }} />
            <div className="dashboard-skeleton__bar" style={{ width: "60px", height: "24px", marginBottom: "6px" }} />
            <div className="dashboard-skeleton__bar" style={{ width: "50px", height: "10px" }} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.overviewCard}>
        <div className={styles.cardHeader}>
          <Lucide.TrendingUp size={16} className={styles.iconBlue} />
          <span className={styles.cardTitle}>POSITIONS OVERVIEW</span>
        </div>
        <div className={styles.overviewGrid}>
          {/* Sub card 1: Total */}
          <div className={styles.subCard}>
            <span className={styles.subCardLabel}>TOTAL OPEN POSITIONS</span>
            <span className={styles.subCardValue}>{totalPositions}</span>
          </div>
          {/* Sub card 2: Active */}
          <div className={styles.subCard}>
            <span className={styles.subCardLabel}>RECRUITMENT IN PROGRESS</span>
            <span className={styles.subCardValue}>{activePositions}</span>
          </div>
          {/* Sub card 3: Completed */}
          <div className={styles.subCard}>
            <span className={styles.subCardLabel}>ONBOARDED</span>
            <span className={styles.subCardValue}>{completedPositions}</span>
          </div>
          {/* Sub card 4: Vacant */}
          <div className={styles.subCard}>
            <span className={styles.subCardLabel}>ONEM DOCUMENT STAGE</span>
            <span className={styles.subCardValue}>{totalVacant}</span>
          </div>
        </div>
      </div>

      {/* 2. DUE THIS MONTH */}
      <div className={styles.kpiCard}>
        <div className={styles.cardHeaderWithNav}>
          <button 
            type="button" 
            className={styles.navBtn} 
            onClick={handlePrevMonth}
            aria-label="Previous Month"
          >
            <Lucide.ChevronLeft size={16} />
          </button>
          <span className={styles.cardTitle}>DUE {monthName} MONTH</span>
          <button 
            type="button" 
            className={styles.navBtn} 
            onClick={handleNextMonth}
            aria-label="Next Month"
          >
            <Lucide.ChevronRight size={16} />
          </button>
        </div>
        <div className={styles.kpiCardBody}>
          <div className={styles.iconContainerGreen}>
            <Lucide.CalendarDays size={20} />
          </div>
          <span className={styles.kpiCardValue}>{dueThisMonth}</span>
          <span className={styles.kpiCardSubtitle}>Positions</span>
        </div>
      </div>

      {/* 3. OVERDUE POSITIONS */}
      <div className={styles.kpiCard}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>OVERDUE POSITIONS</span>
        </div>
        <div className={styles.kpiCardBody}>
          <div className={styles.iconContainerRed}>
            <Lucide.AlertCircle size={20} />
          </div>
          <span className={styles.kpiCardValue}>{overduePositions}</span>
          <span className={styles.kpiCardSubtitle}>Positions</span>
        </div>
      </div>
    </>
  );
};

export default SummaryCards;
