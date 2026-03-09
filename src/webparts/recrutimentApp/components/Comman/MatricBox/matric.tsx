import { motion } from 'framer-motion';
import React from 'react';
import { Metric } from '../../../models';
import { cn } from '../../../utilities/cn';
import './matricard.scss';

interface MetricCardProps {
  metric: Metric;
  active: boolean;
  onClick: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric, active, onClick }) => (
  <motion.div
    whileHover={{ y: -2 }}
    onClick={onClick}
    className={cn(
      "metric-card",
      active ? "metric-card--active" : ""
    )}
  >
    <div className="metric-card__header">
      <div className={cn("metric-card__icon", metric.bgColor)}>
        <metric.icon size={18} className={metric.color} />
      </div>

      <span
        className={cn(
          "metric-card__status",
          metric.status === "CRITICAL"
            ? "status-critical"
            : metric.status === "ACTIVE"
              ? "status-active"
              : "status-default"
        )}
      >
        {metric.status}
      </span>
    </div>

    <div className="metric-card__content">
      <div className="metric-card__value">
        {metric.value.toString().padStart(2, "0")}
      </div>

      <div className="metric-card__label">
        {metric.label}
      </div>
    </div>
  </motion.div>
);

export default MetricCard; 