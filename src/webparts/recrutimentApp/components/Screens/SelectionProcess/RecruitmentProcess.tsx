import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./RecruitmentProcess.module.scss";
import EvaluationTab from "./tabs/EvaluationTab/EvaluationTab";

const TABS = [
  { id: "my-submission",     label: "My Submission" },
  { id: "review-advert",    label: "Review Advert" },
  { id: "Evaluation",       label: "Evaluation" },
  { id: "review-scorecard", label: "Review Scorecard" },
] as const;

type TabId = typeof TABS[number]["id"];

interface RecruitmentProcessProps {
  EmployeeList?: any[];
  [key: string]: any;
}

const RecruitmentProcess: React.FC<RecruitmentProcessProps> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const defaultTab = ((location.state as any)?.defaultTab as TabId) ?? "my-submission";
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);

  const renderContent = () => {
    switch (activeTab) {
      case "Evaluation":
        return (
          <EvaluationTab
            employeeList={props.EmployeeList ?? []}
          />
        );
      default:
        return (
          <div className={styles.placeholder}>
            {TABS.find((t) => t.id === activeTab)?.label} — coming soon.
          </div>
        );
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.tabBar}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{renderContent()}</div>
    </div>
  );
};

export default RecruitmentProcess;