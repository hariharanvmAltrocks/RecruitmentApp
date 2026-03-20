import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useFetchCandidateDetails } from "../Hooks/fetchCandidateDetails";
import "./ShowCandidateDetailsPopup.scss";

interface ShowCandidateDetailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string;
}

type DecisionType = "YES" | "NO" | "HOLD" | null;

const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.15 } }
};

export const ShowCandidateDetailsPopup: React.FC<ShowCandidateDetailsPopupProps> = ({
  isOpen,
  onClose,
  candidateId
}) => {
  const { data, loading } = useFetchCandidateDetails(candidateId);
  const [decision, setDecision] = useState<DecisionType>(null);
  const [comments, setComments] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setDecision(null);
      setComments("");
    }
  }, [isOpen]);

  const decisionDisabled = useMemo(() => !decision || comments.trim().length === 0, [decision, comments]);

  if (!isOpen) {
    return null;
  }

  return (
    <motion.div className="candidate-modal" variants={modalVariants} initial="hidden" animate="visible" exit="exit">
      <motion.div className="candidate-modal__card" variants={cardVariants}>
        <header className="candidate-modal__header">
          <div className="candidate-modal__title">
            <div className="candidate-modal__title-icon">CR</div>
            <div>
              <span className="candidate-modal__breadcrumb">Review Profile / Candidate Details</span>
              <h2>Candidate Profile Review</h2>
              <div className="candidate-modal__meta">
                <span className="candidate-modal__chip">{data?.jobCode ?? "FIN003"}</span>
                <span>{data?.jobTitle ?? "Senior Mining Engineer"}</span>
              </div>
            </div>
          </div>
          <div className="candidate-modal__gpa">
            <span>Overall GPA</span>
            <strong>{data?.gpa?.toFixed(1) ?? "5.0"}</strong>
          </div>
          <button className="candidate-modal__close" type="button" onClick={onClose}>
            ?
          </button>
        </header>

        <div className="candidate-modal__body">
          <aside className="candidate-modal__sidebar">
            <div className="candidate-modal__profile">
              <h3>{data?.applicantName ?? "Alyse E"}</h3>
              <span className="candidate-modal__badge">{data?.classification ?? "EXPAT"}</span>
            </div>

            <div className="candidate-modal__sidebar-section">
              <div className="candidate-modal__item">
                <span>Nationality</span>
                <strong>{data?.nationality ?? "Malian (Mali)"}</strong>
              </div>
              <div className="candidate-modal__item">
                <span>Gender</span>
                <strong>{data?.gender ?? "Female"}</strong>
              </div>
              <div className="candidate-modal__item">
                <span>Qualification</span>
                <strong>{data?.qualification ?? "BSc Mining Engineering"}</strong>
              </div>
              <div className="candidate-modal__item">
                <span>Mining Experience</span>
                <strong>{data?.miningExp ?? "8 Years"}</strong>
              </div>
              <div className="candidate-modal__item">
                <span>Related Experience</span>
                <strong>{data?.relatedExp ?? "5-10 Years"}</strong>
              </div>
              <div className="candidate-modal__item">
                <span>Interview Date</span>
                <strong>{data?.interviewDate ?? "2026-03-05"}</strong>
              </div>
              <div className="candidate-modal__item">
                <span>Levels</span>
                <strong>{data?.interviewLevels ?? "Level 1"}</strong>
              </div>
              <div className="candidate-modal__item">
                <span>Conflicts</span>
                <strong>{data?.conflicts ?? "No"}</strong>
              </div>
              <div className="candidate-modal__item">
                <span>Disability</span>
                <strong>{data?.disability ?? "No"}</strong>
              </div>
            </div>

            <div className="candidate-modal__panel">
              <h4>Interview Panel</h4>
              <ul>
                {(data?.panel ?? ["Michael Lopez", "Amina Kone", "Ravi Sharma"]).map((member) => (
                  <li key={member}>{member}</li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="candidate-modal__content">
            <motion.section
              className="candidate-modal__section"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="candidate-modal__section-title">
                <span className="candidate-modal__section-accent"></span>
                Interview Questionnaires
              </div>
              <p className="candidate-modal__section-subtitle">Panel Assessment Results</p>

              <div className="candidate-modal__questions">
                {(data?.questionnaires ?? []).map((question, index) => (
                  <motion.div
                    key={question.id}
                    className="candidate-modal__question-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.25 }}
                  >
                    <div className="candidate-modal__question-index">Q{index + 1}</div>
                    <div className="candidate-modal__question-body">
                      <h5>{question.question}</h5>
                      <div className="candidate-modal__rating">
                        <span>Rating:</span>
                        <span className="candidate-modal__rating-badge">{question.score} - {question.rating}</span>
                      </div>
                    </div>
                    <div className="candidate-modal__score">
                      <span>Score</span>
                      <strong>
                        {question.score}/{question.maxScore}
                      </strong>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <motion.section
              className="candidate-modal__section"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
            >
              <div className="candidate-modal__section-title">
                <span className="candidate-modal__section-accent candidate-modal__section-accent--green"></span>
                Scorecard Details
              </div>
              <p className="candidate-modal__section-subtitle">Core Competency Assessment (1-5 Scale)</p>

              <div className="candidate-modal__scores">
                {(data?.scores ?? []).map((score) => {
                  const percent = Math.min(100, (score.score / score.maxScore) * 100);
                  return (
                    <div key={score.label} className="candidate-modal__score-row">
                      <div className="candidate-modal__score-header">
                        <span>{score.label}</span>
                        <strong>
                          {score.score}/{score.maxScore}
                        </strong>
                      </div>
                      <div className="candidate-modal__progress">
                        <motion.div
                          className="candidate-modal__progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="candidate-modal__recommendation">
                <div
                  className={`candidate-modal__recommendation-badge ${
                    data?.recommendation === "Do Not Consider"
                      ? "candidate-modal__recommendation-badge--danger"
                      : "candidate-modal__recommendation-badge--success"
                  }`}
                >
                  {data?.recommendation ?? "Consider for Employment"}
                </div>
                <div className="candidate-modal__feedback">
                  <p>"{data?.panelFeedback ?? "Exceptional candidate with deep technical knowledge and strong leadership potential."}"</p>
                </div>
              </div>
            </motion.section>

            <motion.section
              className="candidate-modal__section"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.1 }}
            >
              <div className="candidate-modal__decision">
                <h4>Do you wish to select this candidate?</h4>
                <p>As LM, please review the evaluation above and provide your final decision.</p>

                <div className="candidate-modal__decision-grid">
                  {([
                    { key: "YES", label: "Yes, Select", tone: "success" },
                    { key: "NO", label: "No, Reject", tone: "danger" },
                    { key: "HOLD", label: "On Hold", tone: "warning" }
                  ] as const).map((option) => (
                    <motion.button
                      key={option.key}
                      type="button"
                      className={`candidate-modal__decision-card candidate-modal__decision-card--${option.tone} ${
                        decision === option.key ? "candidate-modal__decision-card--active" : ""
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setDecision(option.key)}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>

                <label className="candidate-modal__comment">
                  <span>LM Decision Justification / Comments *</span>
                  <textarea
                    placeholder="Provide your final decision rationale..."
                    value={comments}
                    onChange={(event) => setComments(event.target.value)}
                  />
                </label>
              </div>
            </motion.section>
          </div>
        </div>

        <footer className="candidate-modal__footer">
          <button type="button" className="candidate-modal__footer-btn candidate-modal__footer-btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="candidate-modal__footer-btn candidate-modal__footer-btn--primary"
            disabled={decisionDisabled}
          >
            Submit Action
          </button>
        </footer>

        {loading && <div className="candidate-modal__loading">Loading details...</div>}
      </motion.div>
    </motion.div>
  );
};
