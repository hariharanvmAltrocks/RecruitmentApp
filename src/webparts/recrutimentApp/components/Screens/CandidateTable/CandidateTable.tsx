import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useFetchCandidateDashboardDetails } from "./Hooks/fetchCandidateDashboardDetails";
import { ShowCandidateDetailsPopup } from "./Components/ShowCandidateDetailsPopup";
import "./CandidateTable.scss";

const rowVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.05, duration: 0.35, ease: "easeOut" }
  })
};

const tableVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } }
};

export const CandidateTable: React.FC = () => {
  const { data, loading, error } = useFetchCandidateDashboardDetails();
  const [activeCandidateId, setActiveCandidateId] = useState<string | null>(null);

  const headerMeta = useMemo(() => {
    if (!data.length) {
      return { code: "", title: "" };
    }
    const primary = data[0];
    return { code: primary.jobCode, title: primary.jobTitle };
  }, [data]);

  return (
    <div className="candidate-table">
      <div className="candidate-table__header">
        <div className="candidate-table__title">
          <div className="candidate-table__title-icon">RC</div>
          <div>
            <h2>Review Candidate Profiles</h2>
            <p>
              <span className="candidate-table__job-code">{headerMeta.code}</span>
              <span className="candidate-table__separator">•</span>
              {headerMeta.title}
            </p>
          </div>
        </div>
      </div>

      <div className="candidate-table__card">
        {loading && <div className="candidate-table__state">Loading candidates...</div>}
        {error && <div className="candidate-table__state candidate-table__state--error">{error}</div>}

        {!loading && !error && (
          <motion.table
            className="candidate-table__table"
            initial="hidden"
            animate="visible"
            variants={tableVariants}
          >
            <thead>
              <tr>
                <th>Job Code</th>
                <th>Job Title</th>
                <th>Business Unit Code</th>
                <th>Position Request</th>
                <th>Nationality</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((candidate, index) => (
                <motion.tr
                  key={candidate.id}
                  custom={index}
                  variants={rowVariants}
                  whileHover={{ y: -2, boxShadow: "0 12px 24px rgba(16, 24, 40, 0.12)" }}
                >
                  <td>
                    <span className="candidate-table__code">{candidate.jobCode}</span>
                  </td>
                  <td>
                    <div className="candidate-table__name">{candidate.jobTitle}</div>
                    <div className="candidate-table__subtext">{candidate.applicantName}</div>
                  </td>
                  <td>{candidate.businessUnitCode}</td>
                  <td>{candidate.positionRequest}</td>
                  <td>{candidate.nationality}</td>
                  <td>
                    <span
                      className={`candidate-table__status candidate-table__status--${candidate.statusTone}`}
                    >
                      {candidate.statusLabel}
                    </span>
                  </td>
                  <td>
                    <motion.button
                      type="button"
                      className="candidate-table__review"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveCandidateId(candidate.id)}
                    >
                      Review
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        )}

        <div className="candidate-table__footer">
          <button type="button" className="candidate-table__footer-btn candidate-table__footer-btn--ghost">
            Cancel
          </button>
          <button type="button" className="candidate-table__footer-btn candidate-table__footer-btn--primary">
            Submit Review
          </button>
        </div>
      </div>

      <AnimatePresence>
        {activeCandidateId && (
          <ShowCandidateDetailsPopup
            isOpen={!!activeCandidateId}
            candidateId={activeCandidateId}
            onClose={() => setActiveCandidateId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
