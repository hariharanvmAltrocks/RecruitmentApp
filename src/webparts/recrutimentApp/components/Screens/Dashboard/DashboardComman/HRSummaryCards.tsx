import React from "react";
import * as Lucide from "lucide-react";
import styles from "./HRSummaryCards.module.scss";
import Card from "../Common/Card";
import { IHRDashboardSummary } from "../Types";

interface HRSummaryCardsProps {
  summary: IHRDashboardSummary | undefined;
  loading?: boolean;
}

export const HRSummaryCards: React.FC<HRSummaryCardsProps> = ({ summary, loading = false }) => {
  if (loading || !summary) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <Card key={idx} className={styles.summaryCard}>
            <div className={styles.header}>
              <div className="dashboard-skeleton__bar" style={{ width: "32px", height: "32px", borderRadius: "8px" }} />
              <div className="dashboard-skeleton__bar" style={{ width: "110px", height: "12px", marginLeft: "12px" }} />
            </div>
            <div className={styles.body} style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div className="dashboard-skeleton__bar" style={{ width: "50px", height: "28px" }} />
              <div className="dashboard-skeleton__bar" style={{ width: "100px", height: "10px" }} />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const cardsData = [
    {
      id: "open",
      title: "My Open Positions",
      value: summary.myOpenPositions,
      trend: summary.myOpenPositionsTrend,
      trendColor: summary.myOpenPositionsTrendColor,
      icon: <Lucide.Compass size={18} className={styles.iconBlue} />,
      iconWrapClass: styles.iconWrapBlue,
    },
    {
      id: "filled",
      title: "My Filled Positions",
      value: summary.myFilledPositions,
      trend: summary.myFilledPositionsTrend,
      trendColor: summary.myFilledPositionsTrendColor,
      icon: <Lucide.FolderCheck size={18} className={styles.iconGreen} />,
      iconWrapClass: styles.iconWrapGreen,
    },
    {
      id: "total",
      title: "My Total Positions",
      value: summary.myTotalPositions,
      trend: summary.myTotalPositionsTrend,
      trendColor: "primary" as const,
      icon: <Lucide.CalendarDays size={18} className={styles.iconBlue} />,
      iconWrapClass: styles.iconWrapBlue,
    },
    {
      id: "candidates",
      title: "Active Candidates",
      value: summary.activeCandidates,
      trend: summary.activeCandidatesTrend,
      trendColor: "primary" as const,
      icon: <Lucide.UserCheck size={18} className={styles.iconBlue} />,
      iconWrapClass: styles.iconWrapBlue,
    },
    {
      id: "interviews",
      title: "Interviews This Month",
      value: summary.interviewsThisMonth,
      trend: summary.interviewsThisMonthTrend,
      trendColor: "primary" as const,
      icon: <Lucide.CalendarClock size={18} className={styles.iconBlue} />,
      iconWrapClass: styles.iconWrapBlue,
    },
  ];

  return (
    <div className={styles.grid}>
      {cardsData.map((card) => {
        let trendClass = styles.trendNeutral;
        if (card.trendColor === "success") trendClass = styles.trendSuccess;
        else if (card.trendColor === "danger") trendClass = styles.trendDanger;
        // else if (card.trendColor === "warning") trendClass = styles.trendWarning;
        else if (card.trendColor === "primary") trendClass = styles.trendPrimary;

        return (
          <Card key={card.id} className={styles.summaryCard} hoverable>
            <div className={styles.header}>
              <div className={`${styles.iconWrap} ${card.iconWrapClass}`}>
                {card.icon}
              </div>
              <span className={styles.title}>{card.title}</span>
            </div>
            <div className={styles.body}>
              <span className={styles.value}>{card.value}</span>
              <span className={`${styles.trend} ${trendClass}`}>{card.trend}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default HRSummaryCards;
