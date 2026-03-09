import React from 'react';
import { RotateCcw } from 'lucide-react';
import { TrackerRow } from '../../../models';
import { METRICS, PRIORITY_DATA, TRACKER_DATA, URGENT_TASKS } from '../../MockData/data';
import { motion } from 'framer-motion';
import MetricCard from '../../Comman/MatricBox/matric';
import TrackerTable from '../TrackerTable';
import PriorityWidget from '../PriorityWidget';
import UrgentWidget from '../UrgentWidget';
import './Dashboard.scss';

interface DashboardProps {
  activeMetric: string;
  onMetricChange: (id: string) => void;
  onRowClick: (row: TrackerRow) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ activeMetric, onMetricChange, onRowClick }) => {
  const selectedMetric = METRICS.find(m => m.id === activeMetric) || METRICS[0];

  return (
    <motion.div
      className="dashboard"
      key="dashboard"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >

      {/* Metrics Grid */}
      <div className="metrics-grid">
        {METRICS.map((metric) => (
          <MetricCard
            key={metric.id}
            metric={metric}
            active={activeMetric === metric.id}
            onClick={() => onMetricChange(metric.id)}
          />
        ))}
      </div>

      <div className="dashboard-layout">
        <div className="dashboard-main">
          <TrackerTable
            data={TRACKER_DATA}
            activeMetric={activeMetric}
            selectedMetric={selectedMetric}
            onRowClick={onRowClick}
          />
        </div>

        <div className="dashboard-sidebar">
          <PriorityWidget data={PRIORITY_DATA} />
          <UrgentWidget tasks={URGENT_TASKS} />
        </div>
      </div>

    </motion.div>
  );
};

export default Dashboard;