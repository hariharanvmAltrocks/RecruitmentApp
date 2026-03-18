import React from "react";
import { motion } from "framer-motion";
import "./Dashboard.scss";

const skeletonFade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } }
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <motion.div className="dashboard-skeleton" variants={skeletonFade} initial="hidden" animate="visible" exit="exit">
      <div className="dashboard-skeleton__metrics">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={`metric-skel-${idx}`} className="dashboard-skeleton__metric-card">
            <div className="dashboard-skeleton__bar dashboard-skeleton__bar--sm" />
            <div className="dashboard-skeleton__bar dashboard-skeleton__bar--lg" />
          </div>
        ))}
      </div>

      <div className="dashboard-skeleton__layout">
        <div className="dashboard-skeleton__tracker">
          <div className="dashboard-skeleton__title" />
          <div className="dashboard-skeleton__table">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={`row-skel-${idx}`} className="dashboard-skeleton__row">
                <div className="dashboard-skeleton__line" />
                <div className="dashboard-skeleton__line" />
                <div className="dashboard-skeleton__line" />
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-skeleton__priority">
          <div className="dashboard-skeleton__title" />
          <div className="dashboard-skeleton__progress-group">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={`priority-skel-${idx}`} className="dashboard-skeleton__progress">
                <div className="dashboard-skeleton__bar dashboard-skeleton__bar--md" />
                <div className="dashboard-skeleton__bar dashboard-skeleton__bar--xl" />
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-skeleton__urgent">
          <div className="dashboard-skeleton__title" />
          <div className="dashboard-skeleton__urgent-list">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={`urgent-skel-${idx}`} className="dashboard-skeleton__urgent-card">
                <div className="dashboard-skeleton__bar dashboard-skeleton__bar--md" />
                <div className="dashboard-skeleton__bar dashboard-skeleton__bar--sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
