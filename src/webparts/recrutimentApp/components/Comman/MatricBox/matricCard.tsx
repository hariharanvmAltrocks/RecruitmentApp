import { motion } from "framer-motion";
import React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../../../utilities/cn";
import { Metric } from "../../../models/IDashboard";

interface MetricCardProps {
  metric: Metric;
  active: boolean;
  onClick: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric, active, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ 
        layout: { type: "spring", stiffness: 300, damping: 30 },
        scale: { type: "spring", stiffness: 400, damping: 25 }
      }}
      onClick={onClick}
      className={cn("metric-card", active && "metric-card--active")}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-pressed={active}
    >
      {/* Absolute background element for active state layout animation */}
      {active && (
        <motion.div
          layoutId="active-bg"
          className="metric-card__active-bg"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 999,
            background: "linear-gradient(135deg, #7c3aed, #9333ea)",
            zIndex: 1
          }}
        />
      )}

      {/* Icon + optional active glow dot */}
      <div className="metric-card__icon-wrap">
        <motion.div
          className="metric-card__icon"
          style={{
            background: active
              ? "rgba(255,255,255,0.2)"
              : (metric.bgColor ?? "#f3f4f6"),
            boxShadow: active ? "inset 0 0 0 1px rgba(255,255,255,0.4)" : "none"
          }}
        >
          <metric.icon
            size={20}
            strokeWidth={2.5}
            style={{ color: active ? "#fff" : (metric.color ?? "#6b7280") }}
          />
        </motion.div>
      </div>

      {/* Body */}
      <div className="metric-card__body">
        <motion.span className="metric-card__label">{metric.label}</motion.span>
        <motion.span className="metric-card__value">
          {metric.value.toString().padStart(2, "0")}
        </motion.span>
      </div>

      {/* Arrow — always present because this component is only used for showArrow: true cards */}
      <motion.div className="metric-card__arrow" style={{ zIndex: 2 }}>
        <ChevronRight
          size={16}
          strokeWidth={3}
        />
      </motion.div>
    </motion.div>
  );
};

export default MetricCard;
