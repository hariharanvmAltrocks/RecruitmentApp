import { AnimatePresence, motion } from "framer-motion";
import React, { useRef, useState } from "react";
import {
  Activity,
  Calendar,
  FileText,
  UserCheck,
  UserPlus,
  XCircle,
  Zap,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { cn } from "../../../utilities/cn";
import "./matricard.scss";
import { Metric } from "../../../models/IDashboard";
import MetricCard from "./matricCard";
import { userInfo } from "../../../utilities/hooks/RoleContext";
import TaskPattern from "./Taskpattern";
import * as strings from 'RecrutimentAppWebPartStrings';

interface MetricDashboardProps {
  metrics: Metric[];
  onCardClick: (metric: Metric) => void;
  loading: boolean;
  handleRefresh: () => void;
  active: number | string | null;
}

const OVERSIGHT_ICON_MAP: Record<
  string,
  { icon: React.ElementType; color: string; bg: string }
> = {
  interviews_scheduled: { icon: Calendar, color: "#3b82f6", bg: "#eff6ff" },
  offer_letters_released: { icon: FileText, color: "#10b981", bg: "#f0fdf4" },
  offers_accepted: { icon: UserCheck, color: "#8b5cf6", bg: "#f5f3ff" },
  offers_rejected: { icon: XCircle, color: "#ef4444", bg: "#fef2f2" },
  candidates_onboarded: { icon: UserPlus, color: "#f97316", bg: "#fff7ed" },
};

const FALLBACK_OVERSIGHT = { icon: Activity, color: "#6b7280", bg: "#f9fafb" };

// ─── OversightStat ────────────────────────────────────────────────────────────

interface OversightStatProps {
  metric: Metric;
  index: number;
  onClick: (metric: Metric) => void;
}

const OversightStat: React.FC<OversightStatProps> = ({
  metric,
  index,
  onClick,
}) => {
  const slug =
    metric.id?.toString() ?? metric.label.toLowerCase().replace(/\s+/g, "_");
  const resolved = OVERSIGHT_ICON_MAP[slug] ?? FALLBACK_OVERSIGHT;
  const Icon = metric.icon ?? resolved.icon;
  const color = metric.color ?? resolved.color;

  return (
    <motion.div
      className="oversight-stat"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.2 }}
      onClick={() => onClick(metric)}
    >
      <div className="oversight-stat__top">
        <div className="oversight-stat__icon-wrap">
          <Icon size={20} style={{ color }} strokeWidth={2.5} />
        </div>
        <span className="oversight-stat__num">
          {metric.value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="oversight-stat__label">
        {metric.label.toUpperCase()}
      </span>
    </motion.div>
  );
};

// ─── MetricDashboard ──────────────────────────────────────────────────────────

const MetricDashboard: React.FC<MetricDashboardProps> = ({
  metrics,
  onCardClick,
  loading,
  handleRefresh,
  active,
}) => {
  const { ADGroupData } = userInfo();
  const user = ADGroupData?.userDetails?.[0];

  const UserName = [user?.FirstName, user?.MiddleName, user?.LastName]
    .filter(Boolean)
    .join(" ");

  const [oversightOpen, setOversightOpen] = useState(false);
  const [myTasks, setMyTasks] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const taskMetrics = metrics.filter((m) => m.showArrow === true);
  const oversightMetrics = metrics.filter((m) => m.showArrow === false);

  const urgentCount = metrics.filter(
    (m) => m.value > 0 && m.showArrow === true,
  ).length;

  const handleCardClick = (metric: Metric) => {
    onCardClick?.(metric);
  };

  return (
    <div className="metric-dashboard">
      <div className="metric-dashboard__topbar">
        <div className="metric-dashboard__welcome">
          <h1 className="metric-dashboard__welcome-title">
            {strings.Welcome}{" "}
            <span className="metric-dashboard__welcome-name">{UserName}</span>
          </h1>
          {urgentCount > 0 ? (
            <div
              className="metric-dashboard__urgent-banner"
              onClick={() => setMyTasks(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setMyTasks(true)}
            >
              <div className="metric-dashboard__urgent-banner-left">
                <AlertCircle className="metric-dashboard__urgent-icon" size={16} />
                <div className="metric-dashboard__urgent-text-container">
                  <span className="metric-dashboard__urgent-title">
                    {strings.YouHave}{" "}
                    <strong>
                      {urgentCount} {strings.UrgentAction}{urgentCount !== 1 ? "S" : ""}
                    </strong>{" "}
                    {strings.ToProcess}
                  </span>
                  <span className="metric-dashboard__urgent-subtitle">
                    {strings.tasklinkDetails}
                  </span>
                </div>
              </div>
              <ArrowRight className="metric-dashboard__urgent-arrow" size={16} />
            </div>
          ) : (
            <p className="metric-dashboard__no-urgent">
              No urgent actions to process today
            </p>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "end", gap: "10px" }}>
          {taskMetrics.length > 0 && (
            <div className="metric-dashboard__oversight-anchor">
              <button
                ref={btnRef}
                className={cn(
                  "metric-dashboard__oversight-btn",
                  myTasks && "metric-dashboard__oversight-btn--open",
                )}
                onClick={() => setMyTasks((prev) => !prev)}
                aria-expanded={myTasks}
                aria-controls="oversight-panel"
              >
                <div className="metric-dashboard__oversight-btn-icon">
                  <Activity size={14} strokeWidth={2.5} />
                </div>
                <span>{strings.MyTasks}</span>
                <svg
                  className="metric-dashboard__oversight-chevron"
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <AnimatePresence>
                {myTasks && (
                  <>
                    <div
                      className="metric-dashboard__oversight-backdrop"
                      onClick={() => setMyTasks(false)}
                    />

                    <motion.div
                      id="oversight-panel"
                      className={cn(
                        "metric-dashboard__oversight-popup",
                        taskMetrics.length > 6 && "metric-dashboard__oversight-popup--wide"
                      )}
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {/* <div className="oversight-popup__inner"> */}
                      <TaskPattern
                        metrics={taskMetrics}
                        onStepClick={(m) => onCardClick(m)}
                        activeId={3}
                      />
                      {/* {taskMetrics.map((metric, i) => (
                          <OversightStat
                            key={metric.id ?? i}
                            metric={metric}
                            index={i}
                            onClick={() => handleCardClick(metric)}
                          />
                        ))} */}
                      {/* </div> */}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}

          {oversightMetrics.length > 0 && (
            <div className="metric-dashboard__oversight-anchor">
              <button
                ref={btnRef}
                className={cn(
                  "metric-dashboard__oversight-btn",
                  oversightOpen && "metric-dashboard__oversight-btn--open",
                )}
                onClick={() => setOversightOpen((prev) => !prev)}
                aria-expanded={oversightOpen}
                aria-controls="oversight-panel"
              >
                <div className="metric-dashboard__oversight-btn-icon">
                  <Activity size={14} strokeWidth={2.5} />
                </div>
                <span>{strings.OngoingOversights}</span>
                <svg
                  className="metric-dashboard__oversight-chevron"
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* ── Floating popup — overlays content, anchored below button ── */}
              <AnimatePresence>
                {oversightOpen && (
                  <>
                    {/* Backdrop to close on outside click */}
                    <div
                      className="metric-dashboard__oversight-backdrop"
                      onClick={() => setOversightOpen(false)}
                    />

                    <motion.div
                      id="oversight-panel"
                      className="metric-dashboard__oversight-popup_ongoing"
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <div className="oversight-popup__inner">
                        {oversightMetrics.map((metric, i) => (
                          <OversightStat
                            key={metric.id ?? i}
                            metric={metric}
                            index={i}
                            onClick={() => handleCardClick(metric)}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* <div className="metric-dashboard__section-header">
        <div className="metric-dashboard__section-icon">
          <Zap size={15} strokeWidth={2.5} color="#fff" />
        </div>
        <div style={{ width: "100%" }}>
          <p className="metric-dashboard__section-title">TASKS TO FINALIZE</p>
          <p className="metric-dashboard__section-subtitle">
            PROCESS THESE ITEMS TO KEEP MOMENTUM
          </p>
        </div>
        <div className="refresh-btn-container">
          <button
            className="refresh-btn"
            onClick={handleRefresh}
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={loading ? "spin" : ""}
            >
              <path d="M21 2v6h-6" />
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
              <path d="M3 22v-6h6" />
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
            Refresh
          </button>
        </div>
      </div> */}

      {/* <div className="metric-dashboard__grid">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
              >
                <div className="metric-card metric-card--skeleton">
                  <div className="metric-card__icon-wrap">
                    <div className="skeleton-icon" />
                  </div>
                  <div className="metric-card__body">
                    <div className="skeleton-label" />
                    <div className="skeleton-value" />
                  </div>
                </div>
              </motion.div>
            ))
          : taskMetrics.map((metric, i) => (
              <motion.div
                key={metric.id ?? i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.22 }}
              >
                <MetricCard
                  metric={metric}
                  active={active === metric.id}
                  onClick={() => handleCardClick(metric)}
                />
              </motion.div>
            ))}
      </div> */}
    </div>
  );
};

export default MetricDashboard;
