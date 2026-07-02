import React from "react";
import styles from "./ProgressBar.module.scss";

interface ProgressBarProps {
  value: number; // 0 to 100
  color?: string; // custom hex color or css class
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, color, className = "" }) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className={`${styles.container} ${className}`}>
      <div
        className={styles.fill}
        style={{
          width: `${clampedValue}%`,
          backgroundColor: color,
        }}
      />
    </div>
  );
};

export default ProgressBar;
