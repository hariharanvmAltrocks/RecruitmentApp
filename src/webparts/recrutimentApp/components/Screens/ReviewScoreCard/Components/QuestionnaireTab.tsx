// Components/QuestionnaireTab.tsx
// Exact old-code UI (Questionnairetab.tsx):
//   - Q-badge cards with rating label (EXCELLENT/ACCEPTABLE/NOT ACCEPTABLE) + score /3
//   - SCORECARD DETAILS section below: progress bars 1-5, recommendation badge, feedback

import * as React from "react";
import styles from "../ReviewScorecard.module.scss";

const SCORECARD_BAR_LABELS = [
  { key: "RelevantQualification",            label: "QUALIFICATIONS" },
  { key: "ReleventExperience",               label: "EXPERIENCE"     },
  { key: "Knowledge",                        label: "KNOWLEDGE"      },
  { key: "EnergyLevel",                      label: "ENERGY"         },
  { key: "MeetJobRequirement",               label: "REQUIREMENTS"   },
  { key: "ContributeTowardsCultureRequried", label: "CULTURE"        },
  { key: "Experience",                       label: "EXPAT EXP."     },
  { key: "OtherCriteriaScore",               label: "OTHER"          },
];

interface Props {
  questions:         any[];
  activeScore:       any;    // scorecard for the active panel tab
  activeQJson:       any[];  // parsed QuestionJson for active panel
  panelMemberName:   string;
  fetchingQuestions: boolean;
}

const ratingLabel = (score: number) => {
  if (score >= 3) return { text: `${score} — EXCELLENT`,      color: "#16a34a", bg: "#f0fdf4" };
  if (score === 2) return { text: `${score} — ACCEPTABLE`,    color: "#2563eb", bg: "#eff6ff" };
  return               { text: `${score} — NOT ACCEPTABLE`, color: "#ef4444", bg: "#fef2f2" };
};

const QuestionnaireTab: React.FC<Props> = ({
  questions, activeScore, activeQJson, panelMemberName, fetchingQuestions,
}) => (
  <div className={styles.mSection}>
    {/* Section header */}
    <div className={styles.mSectionHeader}>
      <div className={styles.mSectionBar} style={{ background: "#f97316" }} />
      <div>
        <div className={styles.mSectionTitle}>INTERVIEW QUESTIONNAIRES</div>
        <div className={styles.mSectionSub}>
          Panel Assessment Results{panelMemberName ? ` — ${panelMemberName}` : ""}
        </div>
      </div>
    </div>

    {/* Scrollable area for Q cards + scorecard bars */}
    <div style={{ maxHeight: "500px", overflowY: "auto" }}>

      {/* Q cards */}
      {fetchingQuestions ? (
        <div className={styles.mNoData}>Loading questions…</div>
      ) : questions.length === 0 ? (
        <div className={styles.mNoData}>No questions found for this job.</div>
      ) : questions.map((q: any, idx: number) => {
        const qScore = activeQJson[idx]
          ? Number(Object.values(activeQJson[idx])[0] || 0) : 0;
        const rl = ratingLabel(qScore);
        const answerText = (q.answer || q.response || "")
          .replace(/<p>|<\/p>|<br\s*\/?>/gi, "").trim();

        return (
          <div key={idx} className={styles.mQCard}>
            <div className={styles.mQTop}>
              <div className={styles.mQBadge}>Q{idx + 1}</div>
              <div style={{ flex: 1 }}>
                <p
                  className={styles.mQText}
                  dangerouslySetInnerHTML={{
                    __html: (q.question || "").replace(/<p>|<\/p>|<br\s*\/?>/gi, "").trim(),
                  }}
                />
                {answerText && (
                  <p className={styles.mQAnswer}>
                    <strong>Expected Answer:</strong> {answerText}
                  </p>
                )}
              </div>
            </div>
            <div className={styles.mQBottom}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className={styles.mRatingLabel}>RATING:</span>
                <span
                  className={styles.mRatingBadge}
                  style={{ color: rl.color, background: rl.bg, border: `1px solid ${rl.color}33` }}
                >
                  {rl.text}
                </span>
              </div>
              <div className={styles.mScoreDisplay}>
                <span className={styles.mScoreLabel}>SCORE</span>
                <span className={styles.mScoreNum}>
                  {qScore}<span className={styles.mScoreMax}>/3</span>
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Scorecard progress bars for the active panel member */}
      {activeScore && (
        <div style={{ marginTop: "1.5rem" }}>
          <div className={styles.mSectionHeader}>
            <div className={styles.mSectionBar} style={{ background: "#22c55e" }} />
            <div>
              <div className={styles.mSectionTitle}>SCORECARD DETAILS</div>
              <div className={styles.mSectionSub}>Core Competency Assessment (1–5 Scale)</div>
            </div>
          </div>
          <div className={styles.mScoreCard}>
            <div className={styles.mScoreGrid}>
              {SCORECARD_BAR_LABELS.map(({ key, label }) => {
                const val = Number((activeScore as any)[key] || 0);
                return (
                  <div key={key} className={styles.mScoreItem}>
                    <div className={styles.mScoreRow}>
                      <span className={styles.mScoreFieldLabel}>{label}</span>
                      <span className={styles.mScoreFieldVal}>{val}/5</span>
                    </div>
                    <div className={styles.mProgressBar}>
                      <div
                        className={styles.mProgressFill}
                        style={{ width: `${(val / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Panel recommendation + overall feedback */}
            <div className={styles.mRecFeedbackRow}>
              <div className={styles.mRecCol}>
                <div className={styles.mRecLabel}>PANEL RECOMMENDATION</div>
                {activeScore.ConsiderForEmployment === "Yes" ? (
                  <div className={styles.mRecBadgeYes}>✓ Consider for Employment</div>
                ) : (
                  <div className={styles.mRecBadgeNo}>✕ Do Not Consider</div>
                )}
              </div>
              {activeScore.OverAllEvaluationFeedback && (
                <div className={styles.mFeedbackCol}>
                  <div className={styles.mRecLabel}>OVERALL EVALUATION FEEDBACK</div>
                  <div className={styles.mFeedbackText}>
                    "{activeScore.OverAllEvaluationFeedback}"
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default QuestionnaireTab;