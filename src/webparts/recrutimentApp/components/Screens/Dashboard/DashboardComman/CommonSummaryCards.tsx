import React from "react";
import * as Lucide from "lucide-react";
import styles from "./CommonSummaryCards.module.scss";

export interface ISummaryCardItem {
  id: string;
  title: string;
  value: string | number;
  trendText?: string;
  trendType?: "success" | "danger" | "warning" | "primary" | "neutral";
  iconName: keyof typeof Lucide;
}

interface ICommonSummaryCardsProps {
  cards: ISummaryCardItem[] ;
  loading?: boolean;
}

export const CommonSummaryCards: React.FC<ICommonSummaryCardsProps> = ({ cards, loading = false }) => {
  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: cards.length || 6 }).map((_, idx) => (
          <div key={`skeleton-${idx}`} className={styles.skeletonCard}>
            <div className={styles.skeletonHeader}>
              <div className="dashboard-skeleton__bar" style={{ width: "32px", height: "32px", borderRadius: "8px" }} />
              <div className="dashboard-skeleton__bar" style={{ width: "110px", height: "12px", marginLeft: "12px" }} />
            </div>
            <div className={styles.skeletonBody}>
              <div className="dashboard-skeleton__bar" style={{ width: "60px", height: "28px" }} />
              <div className="dashboard-skeleton__bar" style={{ width: "100px", height: "10px" }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {cards.map((card) => {
        const IconComponent = (Lucide as any)[card.iconName] || Lucide.HelpCircle;
        
        let trendClass = styles.trendNeutral;
        let trendIcon = null;

        if (card.trendType === "success") {
          trendClass = styles.trendSuccess;
          trendIcon = <Lucide.ArrowUp size={12} />;
        } else if (card.trendType === "danger") {
          trendClass = styles.trendDanger;
          trendIcon = <Lucide.ArrowDown size={12} />;
        } else if (card.trendType === "warning") {
          trendClass = styles.trendWarning;
        } else if (card.trendType === "primary") {
          trendClass = styles.trendPrimary;
        }

        // Determine icon color theme wrapper
        let iconThemeClass = styles.iconWrapBlue;
        if (card.trendType === "success") iconThemeClass = styles.iconWrapGreen;
        else if (card.trendType === "danger") iconThemeClass = styles.iconWrapRed;
        else if (card.trendType === "warning") iconThemeClass = styles.iconWrapOrange;

        return (
          <div key={card.id} className={styles.summaryCard}>
            <div className={styles.cardHeader}>
              <div className={`${styles.iconWrap} ${iconThemeClass}`}>
                <IconComponent size={18} />
              </div>
              <span className={styles.title}>{card.title}</span>
            </div>
            <div className={styles.cardBody}>
              <span className={styles.value}>{card.value}</span>
              {card.trendText && (
                <div className={`${styles.trend} ${trendClass}`}>
                  {trendIcon}
                  <span>{card.trendText}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommonSummaryCards;
