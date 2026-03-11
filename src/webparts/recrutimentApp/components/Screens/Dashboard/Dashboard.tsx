import React, { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { TrackerRow } from '../../../models';
import { METRICS, PRIORITY_DATA, TRACKER_DATA, URGENT_TASKS } from '../../MockData/data';
import { motion } from 'framer-motion';
import MetricCard from '../../Comman/MatricBox/matric';
import './Dashboard.scss';
import { useDashboardMetrics } from './Hooks/useDashboardMetrics';
import { useTrackerData } from './Hooks/usetrackerdata';
import Tracker from '../../Comman/Tracker/Tracker';
import PriorityWidget from '../../Comman/PriorityWidget/PriorityWidget';
import UrgentWidget from '../../Comman/UrgentWidget/UrgentWidget';
import { useUrgentTasks } from './Hooks/useUrgentTasks';
import { DataSyncToRecruitmentResponse } from '../../../services/Dashboard/IDashboard';

interface DashboardProps {
  onRowClick: (row: TrackerRow) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onRowClick }) => {
  const [activeMetric, setActiveMetric] = useState<string>("");
  const [trackerRowData, setTrackerRowData] = useState<DataSyncToRecruitmentResponse[]>([]);
  const martics = useDashboardMetrics()
  console.log(martics);
  const trackdata = useTrackerData(martics.metrics[0]?.id)
  console.log(trackdata, "trackdata");


  useEffect(() => {
    if (martics.metrics.length > 0 && !activeMetric) {
      setActiveMetric(martics.metrics[0].id);
    }
    if (trackdata.trackerData.length > 0) {
      setTrackerRowData(trackdata.trackerData)
    }
  }, [martics.metrics, trackdata.trackerData]);

  const { urgentTasks } = useUrgentTasks();

  console.log(activeMetric, "Active");


  const onMetricChange = (id: string) => {
    setActiveMetric(id);
  };

  const selectedMetric = martics.metrics.find(m => m.id === activeMetric) || martics.metrics[0];

  const hodReviewsValue = martics.metrics.find(m => m.id === 'hod-review')?.value || 0;
  const posMappingValue = martics.metrics.find(m => m.id === 'pos-mapping')?.value || 0;
  const totalPriority = hodReviewsValue + posMappingValue;

  const priorityData = [
    {
      name: 'HOD Reviews',
      value: hodReviewsValue,
      percent: totalPriority > 0 ? Math.round((hodReviewsValue / totalPriority) * 100) : 0,
      color: '#3B82F6'
    },
    {
      name: 'Position Mapping',
      value: posMappingValue,
      percent: totalPriority > 0 ? Math.round((posMappingValue / totalPriority) * 100) : 0,
      color: '#F59E0B'
    }
  ];

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
            rows={trackerRowData}
            selectedMetric={selectedMetric}
            activeMetric={activeMetric}
          // onRowClick={onRowClick}
          />
        </div>

        <div className="priority-panel">
          <PriorityWidget data={priorityData} total={totalPriority} />
        </div>

        <div className="urgent-panel">
          <UrgentWidget tasks={urgentTasks} />
        </div>
      </div>

    </motion.div>
  );
};

export default Dashboard;