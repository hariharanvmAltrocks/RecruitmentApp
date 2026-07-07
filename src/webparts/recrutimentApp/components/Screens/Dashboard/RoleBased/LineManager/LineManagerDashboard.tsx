import React, { useMemo } from "react";
import styles from "./LineManagerDashboard.module.scss";
import * as Lucide from "lucide-react";
import { motion } from "framer-motion";
import { Metric } from "../../../../../models/IDashboard";
import { metricsContainer } from "../../Dashboard";
import MetricDashboard from "../../../../Comman/MatricBox/matric";
import useLMDashboard from "../../Hooks/useLMDashbaord";
import CommonSummaryCards from "../../DashboardComman/CommonSummaryCards";
import {
  TeamHeadcountTrend,
  MyTeamPositions,
  MyTeamTasks,
  TeamStatusOverview,
  QuickActions
} from "../../DashboardComman/LMComponenet/LMComponents";

interface LineManagerDashboardProps {
  userName: string;
  metrics: Metric[];
  onCardClick: (metric: Metric) => void;
  loading: boolean;
  handleRefresh: () => void;
  active: number | string | null;
}

export const LineManagerDashboard: React.FC<LineManagerDashboardProps> = ({ 
  userName,
  metrics,
  onCardClick,
  loading,
  handleRefresh,
  active
}) => {
  const { data, loading: lmLoading, refresh: lmRefresh } = useLMDashboard();

  const isDashboardLoading = loading || lmLoading;

  const summaryCardsData = useMemo(() => {
    if (!data?.summary) return [];
    return [
      {
        id: "team_members",
        title: "My Team Members",
        value: data.summary.myTeamMembers ?? 0,
        trendText: data.summary.myTeamMembersTrend ?? "",
        trendType: (data.summary.myTeamMembersTrendColor ?? "neutral") as any,
        iconName: "Users" as const
      },
      {
        id: "open_positions",
        title: "Open Positions (My Team)",
        value: data.summary.openPositionsMyTeam ?? 0,
        trendText: data.summary.openPositionsMyTeamTrend ?? "",
        trendType: (data.summary.openPositionsMyTeamTrendColor ?? "neutral") as any,
        iconName: "Briefcase" as const
      },
      {
        id: "tasks_pending",
        title: "Tasks Pending",
        value: data.summary.tasksPending ?? 0,
        trendText: data.summary.tasksPendingTrend ?? "",
        trendType: (data.summary.tasksPendingTrendColor ?? "neutral") as any,
        iconName: "CheckSquare" as const
      },
      {
        id: "leave_requests",
        title: "Leave Requests",
        value: data.summary.leaveRequests ?? 0,
        trendText: data.summary.leaveRequestsTrend ?? "",
        trendType: (data.summary.leaveRequestsTrendColor ?? "neutral") as any,
        iconName: "FileText" as const
      },
      {
        id: "performance_reviews",
        title: "Performance Reviews",
        value: data.summary.performanceReviews ?? 0,
        trendText: data.summary.performanceReviewsTrend ?? "",
        trendType: (data.summary.performanceReviewsTrendColor ?? "neutral") as any,
        iconName: "UserCheck" as const
      },
      {
        id: "upcoming_interviews",
        title: "Upcoming Interviews",
        value: data.summary.upcomingInterviews ?? 0,
        trendText: data.summary.upcomingInterviewsTrend ?? "",
        trendType: (data.summary.upcomingInterviewsTrendColor ?? "neutral") as any,
        iconName: "CalendarDays" as const
      }
    ];
  }, [data?.summary]);

  return (
    <div className={styles.dashboardContainer} aria-label="Line Manager Dashboard">
      <motion.div
        className="metrics-grid"
        variants={metricsContainer}
        initial="hidden"
        animate="visible"
      >
        <MetricDashboard
          metrics={metrics}
          onCardClick={(metric) => onCardClick(metric)}
          loading={loading}
          handleRefresh={handleRefresh}
          active={active}
        />
      </motion.div>
      
      <div className={styles.refreshToolbar}>
        <button
          type="button"
          className={styles.refreshBtn}
          onClick={() => {
            handleRefresh();
            lmRefresh();
          }}
          disabled={loading || lmLoading}
          aria-label="Refresh Dashboard Data"
        >
          <Lucide.RefreshCw size={13} className={(loading || lmLoading) ? styles.spin : undefined} />
          <span>Refresh Dashboard Data</span>
        </button>
      </div>

      <CommonSummaryCards cards={summaryCardsData} loading={isDashboardLoading} />

      <div className={styles.grid2}>
        <TeamHeadcountTrend data={data?.teamHeadcountTrend} loading={isDashboardLoading} />
        <MyTeamPositions data={data?.myTeamPositions} loading={isDashboardLoading} />
      </div>

      <div className={styles.grid3}>
        <MyTeamTasks data={data?.myTeamTasks} loading={isDashboardLoading} />
        <TeamStatusOverview data={data?.teamStatusOverview} loading={isDashboardLoading} />
        <QuickActions loading={isDashboardLoading} />
      </div>
    </div>
  );
};

export default LineManagerDashboard;
