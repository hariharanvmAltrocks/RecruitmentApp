import * as React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./EvaluationTab.module.scss";
import EvaluationTable from "../../components/EvaluationTable/EvaluationTable";
import EvaluationForm from "../../components/EvaluationTable/EvaluationForm/EvaluationForm";
import { useEvaluationData } from "../../hooks/useEvaluationData";
import { useRoleContext } from "../../../../../utilities/hooks/RoleContext";
import { EvaluationCandidate } from "../../services/IEvaluationService";

interface EvaluationTabProps {
  employeeList: any[];
  onFormStateChange?: (isOpen: boolean) => void;
}

const EvaluationTab: React.FC<EvaluationTabProps> = ({ employeeList, onFormStateChange }) => {
  const navigate = useNavigate();

  const { ADGroupData } = useRoleContext();
  const currentUserEmail: string   = ADGroupData?.EmailId?.[0] ?? "";
  const currentRoleIDs:   number[] = ADGroupData?.roleIDs      ?? [];

  const { rows, tooltipData, fetchData, fetchTooltip, checkScoreSheet } =
    useEvaluationData(currentUserEmail, employeeList);

  const [alertMsg,     setAlertMsg]     = React.useState("");
  const [alertIsError, setAlertIsError] = React.useState(false);
  const [alertVisible, setAlertVisible] = React.useState(false);

  const showAlert = (msg: string, type: string) => {
    setAlertMsg(msg);
    setAlertIsError(type === "Error");
    setAlertVisible(true);
  };
  const hideAlert = () => setAlertVisible(false);

  const [selectedRow, setSelectedRow] = React.useState<EvaluationCandidate | null>(null);

  React.useEffect(() => {
    if (currentUserEmail) void fetchData();
  }, [currentUserEmail]);

  React.useEffect(() => {
    if (onFormStateChange) {
      onFormStateChange(selectedRow !== null);
    }
    return () => {
      if (onFormStateChange) onFormStateChange(false);
    };
  }, [selectedRow, onFormStateChange]);

  React.useEffect(() => {
    const handleCloseEvent = () => {
      setSelectedRow(null);
      void fetchData(); 
    };

    window.addEventListener("close-evaluation-form", handleCloseEvent);
    return () => {
      window.removeEventListener("close-evaluation-form", handleCloseEvent);
    };
  }, [fetchData]);

  if (selectedRow) {
    return (
      <EvaluationForm
        candidateId={selectedRow.id}
        recruitmentId={selectedRow.recruitmentID}
        interviewLevel={selectedRow.interviewLevel}
        grade={selectedRow.grade}
        status={selectedRow.status}
        statusId={selectedRow.statusId}
        jobCodeID={selectedRow.jobCodeID}
        currentRoleIDs={currentRoleIDs}
        onBack={() => {
          setSelectedRow(null);
          void fetchData();
        }}
      />
    );
  }

  const alertClass = [
    styles.alertBanner,
    alertIsError ? styles.alertBannerError : styles.alertBannerSuccess,
  ].join(" ");

  return (
    <div className={styles.card}>
      {alertVisible && (
        <div className={alertClass}>
          <span>{alertMsg}</span>
          <button className={styles.alertClose} onClick={hideAlert}>✕</button>
        </div>
      )}

      <div className={styles.header}>
        <h2 className={styles.title}>Candidate Evaluations</h2>
        <button
          className={styles.backBtn}
          onClick={() => navigate("/Dashboard")}
        >
          ↺ BACK TO DASHBOARD
        </button>
      </div>

      <EvaluationTable
        rows={rows}
        tooltipData={tooltipData}
        currentRoleID={currentRoleIDs}
        navigation={(path, options) => navigate(path, options)}
        tabValue="Evaluation"
        onRefresh={fetchData}
        onHover={fetchTooltip}
        onEvaluate={(row) => checkScoreSheet(row.id, row.statusId)}
        onShowAlert={showAlert}
        onOpenForm={(row) => setSelectedRow(row)} 
      />
    </div>
  );
};

export default EvaluationTab;