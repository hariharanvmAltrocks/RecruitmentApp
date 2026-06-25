import React from "react";
import styles from "./Charts.module.scss";

interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  color?: string; // Optional custom fill color
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  label, 
  color, 
  showLabel = true 
}) => {
  const boundedValue = Math.min(Math.max(value, 0), 100);

  // Default color logic if not specified
  let barColor = color;
  if (!barColor) {
    if (boundedValue >= 75) barColor = "#10b981";      // success green
    else if (boundedValue >= 40) barColor = "#3b82f6"; // primary blue
    else if (boundedValue >= 15) barColor = "#f59e0b"; // warning yellow
    else barColor = "#ef4444";                         // danger red
  }

  return (
    <div className={styles.progressBarWrapper}>
      {showLabel && (label || showLabel) && (
        <div className={styles.progressLabel}>
          <span>{label}</span>
          <span>{boundedValue}%</span>
        </div>
      )}
      <div className={styles.progressBarBg}>
        <div 
          className={styles.progressBarFill} 
          style={{ 
            width: `${boundedValue}%`,
            backgroundColor: barColor 
          }} 
        />
      </div>
    </div>
  );
};
export default ProgressBar;
