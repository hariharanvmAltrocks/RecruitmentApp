import { motion } from 'framer-motion';
import React from 'react';
import { cn } from '../../../utilities/cn';
import { ChevronRight } from "lucide-react";
import './matricard.scss';
import { Metric } from '../../../models/IDashboard';

interface MetricCardProps {
  metric: Metric;
  active: boolean;
  onClick: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric, active, onClick }) => {
   const getStatusClass = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'ACTIVE') return 'status-active';
    if (s === 'CRITICAL') return 'status-critical';
    if (s === 'SUCCESS') return 'status-success';
    if (s === 'LOST') return 'status-lost';
    return 'status-default'; 
  };
  return(
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={cn(
        "metric-card",
        active ? "metric-card--active" : ""
      )}
    >
      <div className="metric-card__header">
        {/* Using style for icon bg to match your BASE_METRICS colors */}
        <div className="metric-card__icon" style={{ backgroundColor: metric.bgColor }}>
          <metric.icon size={20} style={{ color: metric.color }} strokeWidth={2} />
        </div>

        <span className={cn("metric-card__status", getStatusClass(metric.status))}>
          {metric.status}
        </span>
      </div>

      <div className="metric-card__content">
        <div className="metric-card__value">
          {metric.value.toString().padStart(2, "0")}
        </div>

        <div className="metric-card__footer">
          <div className="metric-card__label">
            {metric.label}
          </div>

          {metric.showArrow && (
            <ChevronRight size={16} className="metric-card__arrow" />
          )}
        </div>
      </div>
    </motion.div>
)};

export default MetricCard;