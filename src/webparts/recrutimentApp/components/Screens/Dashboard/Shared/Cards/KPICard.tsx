import React from "react";
import * as Lucide from "lucide-react";
import styles from "./Cards.module.scss";

interface KPICardProps {
  title: string;
  value: string | number;
  iconName: keyof typeof Lucide;
  iconTheme?: "purple" | "blue" | "orange" | "red" | "green" | "gray";
  footerText?: string;
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  iconName,
  iconTheme = "blue",
  footerText,
  onClick
}) => {
  // Retrieve Lucide icon dynamically
  const IconComponent = Lucide[iconName] as React.ComponentType<any>;

  let themeClass = styles.iconBlue;
  if (iconTheme === "purple") themeClass = styles.iconPurple;
  else if (iconTheme === "orange") themeClass = styles.iconOrange;
  else if (iconTheme === "red") themeClass = styles.iconRed;
  else if (iconTheme === "green") themeClass = styles.iconGreen;
  else if (iconTheme === "gray") themeClass = styles.iconGray;

  return (
    <div className={styles.glassCard} onClick={onClick}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>{title}</span>
        <div className={`${styles.cardIconContainer} ${themeClass}`}>
          {IconComponent && <IconComponent size={20} />}
        </div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardValue}>{value}</div>
      </div>
      {footerText && (
        <div className={styles.cardFooter}>
          <span>{footerText}</span>
          <span style={{ fontSize: "10px" }}>➔</span>
        </div>
      )}
    </div>
  );
};
export default KPICard;
