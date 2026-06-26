import React from "react";
import * as Lucide from "lucide-react";
import styles from "./SummaryCards.module.scss";
import useKPICards from "../../Hooks/useKPICards";

export const SummaryCards: React.FC = () => {
  const { data: kpiData } = useKPICards();

  const totalPositions = 184;
  const activePositions = kpiData?.assignedContracts ?? 92;
  const completedPositions = 8;
  const totalVacant = 184;

  const [selectedDate, setSelectedDate] = React.useState<Date>(() => new Date(2026, 5, 1)); // Default: June 2026

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

  const dueThisMonth = React.useMemo(() => {
    const month = selectedDate.getMonth();
    const mockNumerators: Record<number, number> = {
      4: 32, // May
      5: 25, // June
      6: 18, // July
      7: 15, // August
      8: 22, // September
    };
    const numerator = mockNumerators[month] ?? ((month * 5 + 11) % 30 + 5);
    return `${numerator} / ${activePositions}`;
  }, [selectedDate, activePositions]);

  const overduePositions = kpiData?.overdueContracts ?? 8;

  return (
    <>
      {/* 1. POSITIONS OVERVIEW */}
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
            <Lucide.ChevronLeft size={14} />
          </button>
          <span className={styles.cardTitle}>DUE {monthName} MONTH</span>
          <button 
            type="button" 
            className={styles.navBtn} 
            onClick={handleNextMonth}
            aria-label="Next Month"
          >
            <Lucide.ChevronRight size={14} />
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
