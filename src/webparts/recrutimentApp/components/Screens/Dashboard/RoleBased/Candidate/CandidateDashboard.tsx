import React from "react";
import useCandidateDashboardData from "../../Hooks/useCandidateDashboardData";
import KPICard from "../../Shared/Cards/KPICard";
import ProgressBar from "../../Shared/Charts/ProgressBar";
import styles from "../../Dashboard.module.scss";
import * as Lucide from "lucide-react";

interface CandidateDashboardProps {
  userName: string;
  userEmail: string;
  roleSwitcher?: React.ReactNode;
  notificationCenter?: React.ReactNode;
}

export const CandidateDashboard: React.FC<CandidateDashboardProps> = ({
  userName,
  userEmail,
  roleSwitcher,
  notificationCenter
}) => {
  const { data: candidateData, loading } = useCandidateDashboardData(userEmail);

  if (loading || !candidateData) {
    return (
      <div className={styles.dashboardContainer}>
        <div style={{ padding: "100px", textAlign: "center", fontSize: "0.875rem", color: "#64748b" }}>
          Loading your candidate profile...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Top Header */}
      <div className={styles.headerRow}>
        <div className={styles.welcomeSection}>
          <h1>Welcome, <span>{userName}</span></h1>
          <p>Candidate Recruitment Portal • Career Path Tracker</p>
        </div>
        <div className={styles.actionsSection}>
          {roleSwitcher}
          {notificationCenter}
          <button className={styles.actionButton}>
            <Lucide.MailOpen size={14} />
            Contact Recruiter
          </button>
        </div>
      </div>

      {/* Dynamic Status Banner */}
      <div className={styles.alertBar} style={{ backgroundColor: "#ecfdf5", borderColor: "#a7f3d0", color: "#065f46" }}>
        <span className={styles.alertBadge} style={{ backgroundColor: "#10b981" }}>Active</span>
        <span>STATUS UPDATE: Your Level 2 Interview is scheduled. Read recruiter messages for instructions.</span>
        <Lucide.Video size={14} style={{ marginLeft: "auto" }} />
      </div>

      {/* Candidate KPIs */}
      <div className={styles.kpiGrid}>
        <KPICard
          title="Applied Position"
          value={candidateData.appliedPositions}
          iconName="Briefcase"
          iconTheme="blue"
        />
        <KPICard
          title="Application Status"
          value={candidateData.applicationStatus}
          iconName="Loader"
          iconTheme="purple"
        />
        <KPICard
          title="Next Interview"
          value={candidateData.interviewSchedule.split(" (")[0]}
          iconName="Calendar"
          iconTheme="orange"
        />
        <div className={styles.dashboardCard} style={{ minHeight: "120px", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b" }}>Profile Completion</span>
            <Lucide.UserCheck size={18} style={{ color: "#10b981" }} />
          </div>
          <ProgressBar value={candidateData.profileCompletion} label="Complete details" />
        </div>
      </div>

      {/* Middle Grid */}
      <div className={styles.chartsGrid3}>
        {/* Recruitment Timeline */}
        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <h2>
              <Lucide.Milestone size={16} style={{ color: "#3b82f6" }} />
              Recruitment Timeline
            </h2>
          </div>
          <div className={styles.timelineContainer}>
            {candidateData.timeline.map((step, idx) => {
              let timelineClass = "";
              if (step.status === "completed") timelineClass = styles.timelineCompleted;
              else if (step.status === "active") timelineClass = styles.timelineActive;
              else if (step.status === "onhold") timelineClass = styles.timelineOnhold;
              else if (step.status === "rejected") timelineClass = styles.timelineRejected;

              return (
                <div key={idx} className={`${styles.timelineItem} ${timelineClass}`}>
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineContent}>
                    <div>
                      <span className={styles.timelineTitle}>{step.title}</span>
                      <p className={styles.timelineDesc}>{step.description}</p>
                    </div>
                    {step.date && <span className={styles.timelineDate}>{step.date}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Document Checklist */}
        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <h2>
              <Lucide.FileCheck size={16} style={{ color: "#10b981" }} />
              Document Checklist
            </h2>
          </div>
          <div className={styles.docGrid}>
            {candidateData.uploadedDocuments.map((doc, idx) => {
              const isApproved = doc.status === "Approved";
              return (
                <div key={idx} className={styles.docItem}>
                  <div className={styles.docLeft}>
                    <Lucide.FileSpreadsheet size={16} style={{ color: isApproved ? "#10b981" : "#ea580c" }} />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span>{doc.name}</span>
                      <span style={{ fontSize: "10px", color: "#64748b" }}>Uploaded on {doc.date}</span>
                    </div>
                  </div>
                  <span 
                    style={{ 
                      fontSize: "11px", 
                      fontWeight: 700, 
                      color: isApproved ? "#047857" : "#b45309",
                      backgroundColor: isApproved ? "#ecfdf5" : "#fffbeb",
                      padding: "2px 8px",
                      borderRadius: "6px"
                    }}
                  >
                    {doc.status}
                  </span>
                </div>
              );
            })}
            <button 
              className={styles.actionButton} 
              style={{ width: "100%", justifyContent: "center", borderStyle: "dashed", marginTop: "0.5rem" }}
            >
              <Lucide.Upload size={14} />
              Upload New Document
            </button>
          </div>
        </div>

        {/* Recruiter Messages */}
        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <h2>
              <Lucide.MessagesSquare size={16} style={{ color: "#7c3aed" }} />
              Recruiter Messages
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", height: "260px", overflowY: "auto", paddingRight: "4px" }}>
            {candidateData.messages.map((msg, idx) => {
              const isRecruiter = msg.sender !== "Candidate";
              return (
                <div 
                  key={idx} 
                  style={{
                    alignSelf: isRecruiter ? "flex-start" : "flex-end",
                    maxWidth: "85%",
                    backgroundColor: isRecruiter ? "#f1f5f9" : "#dbeafe",
                    padding: "10px 14px",
                    borderRadius: isRecruiter ? "0px 16px 16px 16px" : "16px 0px 16px 16px",
                    fontSize: "0.75rem",
                    lineHeight: "1.4",
                    color: "#1e293b",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
                  }}
                >
                  <div style={{ fontWeight: 700, color: isRecruiter ? "#475569" : "#1e40af", marginBottom: "4px" }}>
                    {msg.sender}
                  </div>
                  <div>{msg.text}</div>
                  <div style={{ fontSize: "9px", color: "#94a3b8", textAlign: "right", marginTop: "4px" }}>
                    {msg.time}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: "8px", borderTop: "1px solid #f1f5f9", paddingTop: "0.75rem" }}>
            <input 
              type="text" 
              placeholder="Type your message..." 
              style={{ flex: 1, padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "0.8125rem", outline: "none" }}
            />
            <button className={styles.actionButton} style={{ padding: "0 16px" }}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CandidateDashboard;
