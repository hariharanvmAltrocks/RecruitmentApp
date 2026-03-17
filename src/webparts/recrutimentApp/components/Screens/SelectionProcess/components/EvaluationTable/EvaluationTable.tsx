import React, { useState } from "react";
import styles from "./EvaluationTable.module.scss";
import { EvalAlertOptions, EvalMessages, EvalNavigationPaths, EvalRoleID, EvalStatusId, EvalUIConfig, InterviewLevels } from "../../config/EvaluationConfig";
import { TableRow, isSkeleton } from "../../hooks/useEvaluationData";
import moment from "moment";
import { EvaluationCandidate, ScoreSheetResult, TooltipEntry } from "../../services/IEvaluationService";

type SortKey = keyof Pick<EvaluationCandidate, "applicantName" | "positionTitle" | "interviewDate" | "interviewLevel" | "grade">;

interface EvaluationTableProps {
  rows: TableRow[];
  tooltipData: TooltipEntry[] | null;
  currentRoleID: number[];                              
  navigation: (path: string, options?: any) => void;
  tabValue: string;
  onHover: (statusId: number | string, candidateID: number) => void;
  onEvaluate: (row: EvaluationCandidate) => Promise<ScoreSheetResult>;
  onShowAlert: (msg: string, type: string) => void;
  onRefresh: () => void;
  onOpenForm: (row: EvaluationCandidate) => void;       
}

const EvaluationTable: React.FC<EvaluationTableProps> = ({ rows, tooltipData, currentRoleID, navigation, tabValue, onHover, onEvaluate, onShowAlert, onRefresh, onOpenForm }) => {
  const [sortKey, setSortKey] = useState<SortKey>(EvalUIConfig.DefaultSortKey);
  const [sortDir, setSortDir] = useState<"asc"|"desc">(EvalUIConfig.DefaultSortDir);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const handleSort = (key: SortKey) => {
    setSortDir((d) => sortKey === key ? (d === "asc" ? "desc" : "asc") : "asc");
    setSortKey(key);
    setCurrentPage(1); 
  };

  const sortedRows = [...rows].sort((a, b) => {
    if (isSkeleton(a) || isSkeleton(b)) return 0;
    const va = String((a as EvaluationCandidate)[sortKey] ?? "");
    const vb = String((b as EvaluationCandidate)[sortKey] ?? "");
    return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  const totalPages = Math.ceil(sortedRows.length / ITEMS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRows = sortedRows.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const getNavigationPath = (statusId: number | string): string => {
    if (statusId === EvalStatusId.InterviewScheduled) {
      if (currentRoleID.includes(EvalRoleID.HOD) || currentRoleID.includes(EvalRoleID.LineManager)) return EvalNavigationPaths.HODLevel1;
      if (currentRoleID.includes(EvalRoleID.InterviewPanel)) return EvalNavigationPaths.PanelLevel1;
      return EvalNavigationPaths.DefaultLevel1;
    }
    if (statusId === EvalStatusId.InterviewScheduledforLevel2) {
      if (currentRoleID.includes(EvalRoleID.HOD) || currentRoleID.includes(EvalRoleID.LineManager)) return EvalNavigationPaths.HODLevel2;
      if (currentRoleID.includes(EvalRoleID.InterviewPanel)) return EvalNavigationPaths.PanelLevel2;
      return EvalNavigationPaths.DefaultLevel2;
    }
    return "";
  };

  const handleEvaluateClick = async (row: EvaluationCandidate) => {
    setLoadingId(row.id);
    try {
      const today = moment().startOf('day');
      const interviewDate = moment(row.interviewDateTime).startOf('day');
      if (today.isBefore(interviewDate)) {
        const displayDate = interviewDate.format("DD-MMM-YYYY");
        onShowAlert(
          `Interview is scheduled for ${displayDate}. You can evaluate on or after the interview date.`, 
          EvalAlertOptions.Error
        );
        return;
      }
      const result = await onEvaluate(row);
      if (!result.canProceed) {
        const msg = result.level === InterviewLevels.Level1 
          ? EvalMessages.InterviewScoredAlready 
          : EvalMessages.InterviewScoreCommentsAlready;
        onShowAlert(msg, EvalAlertOptions.Error);
        return;
      }
      onOpenForm(row);
    } catch (error) {
      console.error("Evaluation error:", error);
    } finally {
      setLoadingId(null);
    }
  };

  const SortIcon: React.FC<{ col: SortKey }> = ({ col }) => (
    <span className={styles.sortIcon}>{sortKey === col ? (sortDir === "asc" ? "↑" : "↓") : "↑↓"}</span>
  );

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th onClick={() => handleSort("applicantName")}>APPLICANTNAME <SortIcon col="applicantName" /></th>
            <th onClick={() => handleSort("positionTitle")}>POSITION TITLE <SortIcon col="positionTitle" /></th>
            <th onClick={() => handleSort("interviewDate")}>INTERVIEW DATE <SortIcon col="interviewDate" /></th>
            <th onClick={() => handleSort("interviewLevel")}>INTERVIEW LEVELS <SortIcon col="interviewLevel" /></th>
            <th onClick={() => handleSort("grade")}>GRADE <SortIcon col="grade" /></th>
            <th>STATUS</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRows.map((row, idx) => isSkeleton(row) ? (
              <tr key={`sk-${idx}`} className={styles.skRow}>
                {[65, 80, 55, 45, 30, 60, 40].map((w, ci) => (<td key={ci}><span className={styles.shimmer} style={{ width: `${w}%` }} /></td>))}
              </tr>
            ) : (
              <tr key={(row as EvaluationCandidate).id} className={styles.row}>
                <td className={styles.nameCell}>{(row as EvaluationCandidate).applicantName}</td>
                <td className={styles.posCell}>{(row as EvaluationCandidate).positionTitle}</td>
                <td>{(row as EvaluationCandidate).interviewDate}</td>
                <td>{(row as EvaluationCandidate).interviewLevel}</td>
                <td>
                  <div className={styles.grade}>
                    <span>{(row as EvaluationCandidate).grade}</span>
                    {(row as EvaluationCandidate).gradeLabel && (<span className={styles.gradeLabel}>{(row as EvaluationCandidate).gradeLabel}</span>)}
                  </div>
                </td>
                <td>
                  <div className={styles.statusWrap} onMouseEnter={() => { setHoveredId((row as EvaluationCandidate).id); onHover((row as EvaluationCandidate).statusId, (row as EvaluationCandidate).id); }} onMouseLeave={() => setHoveredId(null)}>
                    <span className={styles.dot} />
                    <span>{(row as EvaluationCandidate).status}</span>
                    {hoveredId === (row as EvaluationCandidate).id && tooltipData?.length ? (
                      <div className={styles.tooltip}>
                        {tooltipData.map((entry, i) => (
                          <div key={i} className={styles.tooltipRow}>
                            <span className={styles.tooltipName}>{entry.Key}</span>
                            <span className={`${styles.badge} ${entry.Value === "Completed" ? styles.completed : styles.pending}`}>{entry.Value}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </td>
                <td>
                  <div className={styles.actionCell}>
                    <img src={require("../../../../../assets/Viewicon.svg")} alt="View" className={`${styles.viewIcon} ${loadingId === (row as EvaluationCandidate).id ? styles.loading : ""}`} onClick={() => handleEvaluateClick(row as EvaluationCandidate)} />
                  </div>
                </td>
              </tr>
            )
          )}
          {paginatedRows.length === 0 && (<tr><td colSpan={7} className={styles.empty}>No candidates found.</td></tr>)}
        </tbody>
      </table>

      {sortedRows.length > 0 && !isSkeleton(sortedRows[0]) && (
        <div className={styles.pagination}>
          <span className={styles.pageInfo}>
            Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, sortedRows.length)} of {sortedRows.length} entries
          </span>
          <div className={styles.pageControls}>
            <button 
              onClick={handlePrevPage} 
              disabled={safeCurrentPage === 1}
              className={styles.pageBtn}
            >
              Prev
            </button>
            <span className={styles.pageNumbers}>
              Page {safeCurrentPage} of {totalPages}
            </span>
            <button 
              onClick={handleNextPage} 
              disabled={safeCurrentPage === totalPages}
              className={styles.pageBtn}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default EvaluationTable;