import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./EvaluationTab.module.scss";
import EvaluationTable from "../../components/EvaluationTable/EvaluationTable";
import { useEvaluationData } from "../../hooks/useEvaluationData";
import { useRoleContext } from "../../../../../utilities/hooks/RoleContext";

interface EvaluationTabProps {
  employeeList: any[];        
}

const EvaluationTab: React.FC<EvaluationTabProps> = ({ employeeList }) => {
  const navigate = useNavigate();
  
  const { ADGroupData } = useRoleContext();
  const currentUserEmail = ADGroupData?.EmailId?.[0] || "";
  
  const { rows, tooltipData, fetchData, fetchTooltip, checkScoreSheet } = useEvaluationData(currentUserEmail, employeeList);
  
  const [alert, setAlert] = useState<{ msg: string; type: string } | null>(null);

  useEffect(() => {
    if (currentUserEmail) {
      void fetchData();
    }
  }, [fetchData, currentUserEmail]);

  return (
    <div className={styles.card}>
      {alert && (
        <div className={`${styles.alert} ${alert.type ? styles[alert.type as keyof typeof styles] : ""}`}>
          <span>{alert.msg}</span>
          <button className={styles.alertClose} onClick={() => setAlert(null)}>✕</button>
        </div>
      )}

      <div className={styles.header}>
        <h2 className={styles.title}>Candidate Evaluations</h2>
        <button className={styles.backBtn} onClick={() => navigate("/Dashboard")}>
          ↺ BACK TO DASHBOARD
        </button>
      </div>

      <EvaluationTable
        rows={rows}
        tooltipData={tooltipData}
        currentRoleID={["RecruitmentHR"]} 
        navigation={(path, options) => navigate(path, options)} 
        tabValue="Evaluation"
        onRefresh={fetchData}
        onHover={fetchTooltip}
        onEvaluate={(row) => checkScoreSheet(row.id, row.statusId)}
        onShowAlert={(msg, type) => setAlert({ msg, type })}
      />
    </div>
  );
};
export default EvaluationTab;