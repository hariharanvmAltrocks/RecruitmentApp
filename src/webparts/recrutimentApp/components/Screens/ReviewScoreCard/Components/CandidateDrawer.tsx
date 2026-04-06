
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, AlertCircle, Pencil, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "../ReviewScorecard.module.scss";
import { ScorecardCandidateRow } from "../State/types";
import { EDITABLE_STATUS_IDS, VIEW_ONLY_STATUS_IDS } from "../Hooks/useReviewScorecard";

interface Props {
  candidates:    ScorecardCandidateRow[];
  loading:       boolean;
  onClose:       () => void;
  onReview:      (c: ScorecardCandidateRow) => void;
  recruitmentId: number;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const getStatusClass = (statusId: number) => {
  if (statusId === 122)                        return styles.statusSelected;
  if (VIEW_ONLY_STATUS_IDS.includes(statusId)) return styles.statusRejected;
  return styles.statusPending;
};

const getInterviewLevelLabel = (interviewLevel?: string): string => {
  const lvl = (interviewLevel || "").trim();
  if (/level\s*2/i.test(lvl)) return "Level 1 of 1 & Level 2 of 2";
  if (/level\s*1/i.test(lvl)) return "Level 1 of 1";
  return lvl || " ";
};

const CandidateDrawer: React.FC<Props> = ({
  candidates,
  loading,
  onClose,
  onReview,
  recruitmentId,
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize,    setPageSize]    = React.useState(5);
  React.useEffect(() => { setCurrentPage(1); }, [candidates.length]);
  const totalRecords  = candidates.length;
  const totalPages    = Math.max(1, Math.ceil(totalRecords / pageSize));
  const startIndex    = (currentPage - 1) * pageSize;
  const endIndex      = Math.min(startIndex + pageSize, totalRecords);
  const pageRows      = candidates.slice(startIndex, endIndex);

  const pendingCount  = candidates.filter(c => EDITABLE_STATUS_IDS.includes(c.statusId)).length;

  const handleClose = () => {
    navigate('/RecruitmentTable');
  };

  const handlePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <AnimatePresence>
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={styles.drawerOverlay}
          onClick={handleClose}
        />

        {/* Drawer panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className={styles.drawer}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className={styles.drawerHeader}>
            <div className={styles.headerContent}>
              <div className={styles.iconBox}>
                <Users size={24} />
              </div>
              <div>
                <h2>
                  Candidate Selection{" "}
                  {pendingCount > 0 && (
                    <span className={styles.badge}>{pendingCount}</span>
                  )}
                </h2>
              </div>
            </div>
            <button onClick={handleClose} className={styles.closeButton}>
              <X size={24} />
            </button>
          </div>

          {/* ── Body ── */}
          <div className={styles.drawerBody}>
            <div className={styles.innerCard}>
              <div className={styles.tableScroll}>
              <table className={styles.styledTable}>
                <thead>
                  <tr>
                    <th>S.NO</th>
                    <th>Applicant Name</th>
                    <th>Position Title</th>
                    <th>Interview Level</th>
                    <th>Grade</th>
                    <th style={{ textAlign: "center" }}>GPA</th>
                    <th>Status</th>
                    <th style={{ textAlign: "center", minWidth: "80px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className={styles.noData}>
                        Loading candidates...
                      </td>
                    </tr>
                  ) : pageRows.length === 0 ? (
                    <tr>
                      <td colSpan={8} className={styles.noData}>
                        No candidates found.
                      </td>
                    </tr>
                  ) : (
                    pageRows.map((c, idx) => {
                      const edit = EDITABLE_STATUS_IDS.includes(c.statusId);
                      const view = VIEW_ONLY_STATUS_IDS.includes(c.statusId);
                      return (
                        <tr key={c.id}>
                          <td
                            className={styles.textMuted}
                            style={{ fontWeight: "bold" }}
                          >
                            {startIndex + idx + 1}
                          </td>
                          <td className={styles.jobTitle}>{c.fullName}</td>
                          <td className={styles.textMuted}>
                            {c.positionTitle || ""}
                          </td>
                          <td className={styles.textMuted}>
                            {getInterviewLevelLabel(c.interviewLevel)}
                          </td>
                          <td className={styles.textMuted}>{c.grade || ""}</td>
                          <td style={{ textAlign: "center" }}>
                            <div className={styles.gpaBadge}>{c.gpa || ""}</div>
                          </td>
                          <td>
                            <span
                              className={`${styles.statusBadgeText} ${getStatusClass(c.statusId)}`}
                            >
                              {c.status || ""}
                            </span>
                          </td>
                          <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                            {edit ? (
                              <button
                                onClick={() => onReview(c)}
                                className={styles.iconButton}
                                title="Edit / Review"
                                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                              >
                                <Pencil size={16} />
                              </button>
                            ) : view ? (
                              <button
                                onClick={() => onReview(c)}
                                className={styles.iconButton}
                                title="View"
                                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                              >
                                <Eye size={16} />
                              </button>
                            ) : (
                              <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                                —
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
</div>
            {/* ── Pagination Bar (mirrors Image 2) ── */}
            {!loading && totalRecords > 0 && (
              <div className={styles.paginationBar}>
                {/* Left: "Showing X to Y of Z results" */}
                <div className={styles.paginationInfo}>
                  Showing <strong>{startIndex + 1}</strong> to{" "}
                  <strong>{endIndex}</strong> of{" "}
                  <strong>{totalRecords}</strong> results
                </div>

                {/* Centre: Rows per page */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    Rows per page
                  </span>
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <button
                      key={size}
                      onClick={() => { setPageSize(size); setCurrentPage(1); }}
                      style={{
                        minWidth: "2rem",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "0.4rem",
                        border: "1px solid #e2e8f0",
                        background: pageSize === size ? "#2563eb" : "#f8fafc",
                        color: pageSize === size ? "#fff" : "#334155",
                        fontWeight: pageSize === size ? 700 : 400,
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {/* Right: prev / page numbers / next */}
                <div className={styles.paginationControls}>
                  <button
                    className={styles.pageBtn}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    title="Previous"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (pg) =>
                        pg === 1 ||
                        pg === totalPages ||
                        Math.abs(pg - currentPage) <= 1
                    )
                    .reduce<(number | "…")[]>((acc, pg, i, arr) => {
                      if (i > 0 && pg - (arr[i - 1] as number) > 1) acc.push("…");
                      acc.push(pg);
                      return acc;
                    }, [])
                    .map((pg, i) =>
                      pg === "…" ? (
                        <span
                          key={`ellipsis-${i}`}
                          style={{ padding: "0 0.25rem", color: "#94a3b8" }}
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={pg}
                          className={
                            currentPage === pg
                              ? `${styles.pageBtn} ${styles.pageBtnActive}`
                              : styles.pageBtn
                          }
                          onClick={() => setCurrentPage(pg as number)}
                        >
                          {pg}
                        </button>
                      )
                    )}

                  <button
                    className={styles.pageBtn}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    title="Next"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className={styles.drawerFooter}>
            <div className={styles.footerHint}>
              <AlertCircle size={16} />
              <span>Click a candidate to review their scorecard</span>
            </div>
            <div className={styles.footerActions}>
              <button onClick={handleClose} className={styles.cancelBtn}>
                CLOSE
              </button>
            </div>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
};

export default CandidateDrawer;