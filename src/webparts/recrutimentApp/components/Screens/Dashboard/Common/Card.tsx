import React from "react";
import styles from "./Card.module.scss";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = "", onClick, hoverable = false }) => {
  return (
    <div
      className={`${styles.card} ${hoverable ? styles["card--hoverable"] : ""} ${onClick ? styles["card--clickable"] : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
