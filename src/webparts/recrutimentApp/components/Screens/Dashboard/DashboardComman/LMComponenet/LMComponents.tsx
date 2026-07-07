import React from "react";
import * as Lucide from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import styles from "./LMComponents.module.scss";

// ─────────────────────────────────────────────────────────────────────────────
// 1. Team Headcount Trend Component
// ─────────────────────────────────────────────────────────────────────────────
interface IHeadcountTrendProps {
  data: any[];
  loading?: boolean;
}

export const TeamHeadcountTrend: React.FC<IHeadcountTrendProps> = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <Lucide.TrendingUp size={16} className={styles.iconBlue} />
          <h3 className={styles.title}>My Team Headcount Trend</h3>
        </div>
        <div className={styles.skeletonChart} />
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Lucide.TrendingUp size={16} className={styles.iconBlue} />
        <h3 className={styles.title}>My Team Headcount Trend</h3>
      </div>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.02)" }} />
            <Bar dataKey="headcount" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. My Team Positions Component
// ─────────────────────────────────────────────────────────────────────────────
interface ITeamPositionsProps {
  data: any[];
  loading?: boolean;
}

export const MyTeamPositions: React.FC<ITeamPositionsProps> = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <Lucide.Briefcase size={16} className={styles.iconBlue} />
          <h3 className={styles.title}>My Team Positions</h3>
        </div>
        <div className={styles.skeletonTable}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="dashboard-skeleton__bar" style={{ width: "100%", height: "14px", marginBottom: "12px" }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Lucide.Briefcase size={16} className={styles.iconBlue} />
        <h3 className={styles.title}>My Team Positions</h3>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Job Role</th>
              <th>Total</th>
              <th>Filled</th>
              <th>Open</th>
              <th>% Filled</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                <td style={{ textAlign: "left", fontWeight: 600 }}>{item.jobRole}</td>
                <td>{item.total}</td>
                <td>{item.filled}</td>
                <td>{item.open}</td>
                <td>
                  <div className={styles.progressContainer}>
                    <div className={styles.progressBar} style={{ width: `${item.percentage}%` }} />
                    <span className={styles.progressText}>{item.percentage}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.cardFooter}>
        <a href="#/positions" className={styles.link}>View all positions</a>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. My Team Tasks Component
// ─────────────────────────────────────────────────────────────────────────────
interface ITeamTasksProps {
  data: any[];
  loading?: boolean;
}

export const MyTeamTasks: React.FC<ITeamTasksProps> = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <Lucide.CheckSquare size={16} className={styles.iconBlue} />
          <h3 className={styles.title}>My Team Tasks</h3>
        </div>
        <div className={styles.skeletonTable}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="dashboard-skeleton__bar" style={{ width: "100%", height: "14px", marginBottom: "12px" }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Lucide.CheckSquare size={16} className={styles.iconBlue} />
        <h3 className={styles.title}>My Team Tasks</h3>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Task</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              let statusClass = styles.badgeGrey;
              if (item.status === "Pending") statusClass = styles.badgeOrange;
              else if (item.status === "In Progress") statusClass = styles.badgeBlue;

              return (
                <tr key={item.id}>
                  <td style={{ textAlign: "left", fontWeight: 600 }}>{item.task}</td>
                  <td>{item.dueDate}</td>
                  <td>
                    <span className={`${styles.badge} ${statusClass}`}>{item.status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={styles.cardFooter}>
        <a href="#/tasks" className={styles.link}>View all tasks</a>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. Team Status Overview Component
// ─────────────────────────────────────────────────────────────────────────────
interface IStatusOverviewProps {
  data: any[];
  loading?: boolean;
}

export const TeamStatusOverview: React.FC<IStatusOverviewProps> = ({ data, loading }) => {
  const total = React.useMemo(() => {
    return data ? data.reduce((sum, item) => sum + item.count, 0) : 0;
  }, [data]);

  if (loading || !data) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <Lucide.PieChart size={16} className={styles.iconBlue} />
          <h3 className={styles.title}>Team Status Overview</h3>
        </div>
        <div className={styles.skeletonDonut} />
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Lucide.PieChart size={16} className={styles.iconBlue} />
        <h3 className={styles.title}>Team Status Overview</h3>
      </div>
      <div className={styles.donutBody}>
        <div className={styles.donutVisual}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Pie
                data={data}
                innerRadius={36}
                outerRadius={50}
                paddingAngle={4}
                dataKey="count"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.donutCenter}>
            <span className={styles.donutCenterVal}>{total}</span>
            <span className={styles.donutCenterLabel}>TOTAL</span>
          </div>
        </div>
        <div className={styles.donutLegend}>
          {data.map((item, index) => (
            <div key={index} className={styles.legendRow}>
              <div className={styles.legendLeft}>
                <span className={styles.dot} style={{ backgroundColor: item.color }} />
                <span className={styles.legendName}>{item.name}</span>
              </div>
              <span className={styles.legendCount}>
                {item.count} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.cardFooter}>
        <a href="#/team" className={styles.link}>View team details</a>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. Quick Actions Component
// ─────────────────────────────────────────────────────────────────────────────
interface IQuickActionsProps {
  loading?: boolean;
}

export const QuickActions: React.FC<IQuickActionsProps> = ({ loading }) => {
  if (loading) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <Lucide.Sliders size={16} className={styles.iconBlue} />
          <h3 className={styles.title}>Quick Actions</h3>
        </div>
        <div className={styles.skeletonTable}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="dashboard-skeleton__bar" style={{ width: "100%", height: "35px", marginBottom: "8px", borderRadius: "6px" }} />
          ))}
        </div>
      </div>
    );
  }

  const actions = [
    { title: "Request New Position", icon: <Lucide.PlusCircle size={14} />, href: "#/request-position" },
    { title: "Add Team Member", icon: <Lucide.UserPlus size={14} />, href: "#/add-member" },
    { title: "Schedule Interview", icon: <Lucide.CalendarDays size={14} />, href: "#/schedule-interview" },
    { title: "Assign Task", icon: <Lucide.FileSpreadsheet size={14} />, href: "#/assign-task" }
  ];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Lucide.Sliders size={16} className={styles.iconBlue} />
        <h3 className={styles.title}>Quick Actions</h3>
      </div>
      <div className={styles.actionsList}>
        {actions.map((act, index) => (
          <a key={index} href={act.href} className={styles.actionItem}>
            {act.icon}
            <span>{act.title}</span>
          </a>
        ))}
      </div>
      <div className={styles.cardFooter}>
        <a href="#/actions" className={styles.link}>View all actions</a>
      </div>
    </div>
  );
};
