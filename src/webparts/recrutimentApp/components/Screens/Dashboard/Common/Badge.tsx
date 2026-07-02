import React from "react";
import styles from "./Badge.module.scss";

export type BadgeVariant = "primary" | "success" | "warning" | "danger" | "neutral";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "neutral", className = "" }) => {
  return (
    <span className={`${styles.badge} ${styles[`badge--${variant}`]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
