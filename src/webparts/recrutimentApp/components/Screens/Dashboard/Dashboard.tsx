import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MetricCard from '../../Comman/MatricBox/matric';
import './Dashboard.scss';
import { useDashboardMetrics } from './Hooks/useDashboardMetrics';
import { useTrackerData } from './Hooks/usetrackerdata';
import Tracker from '../../Comman/Tracker/Tracker';
import PriorityWidget from '../../Comman/PriorityWidget/PriorityWidget';
import UrgentWidget from '../../Comman/UrgentWidget/UrgentWidget';
import { useUrgentTasks } from './Hooks/useUrgentTasks';
import { priorityValues, totalPriority } from './metricColumns.config';

interface DashboardProps {
  props: any
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const [activeMetric, setActiveMetric] = useState<number>(0);

  const martics = useDashboardMetrics();

  const { trackerData } = useTrackerData(activeMetric);

  useEffect(() => {
    if (martics.metrics.length > 0 && !activeMetric) {
      setActiveMetric(martics.metrics[0].id);
    }
  }, [martics.metrics]);

  const { urgentTasks } = useUrgentTasks();

  const onMetricChange = (id: number) => {
    setActiveMetric(id);
  };

  const selectedMetric = martics.metrics.find(m => m.id === activeMetric) ?? martics.metrics[0];
  const priorityData = priorityValues(martics.metrics);
  const total = totalPriority(martics.metrics);

  return (
    <motion.div
      className="dashboard"
      key="dashboard"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="metrics-grid">
        {martics.metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            metric={metric}
            active={activeMetric === metric.id}
            onClick={() => onMetricChange(metric.id)}
          />
        ))}
      </div>

      <div className="dashboard-layout">
        <div className="tracker-panel">
          <Tracker
            rows={trackerData}             
            selectedMetric={selectedMetric}
            activeMetric={activeMetric}
          />
        </div>

        <div className="priority-panel">
          <PriorityWidget data={priorityData} total={total} />
        </div>

        <div className="urgent-panel">
          <UrgentWidget tasks={urgentTasks} />
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;