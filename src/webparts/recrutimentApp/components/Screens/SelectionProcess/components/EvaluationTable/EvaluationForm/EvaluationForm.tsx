import * as React from "react";
import styles from "./EvaluationForm.module.scss";
import { useRoleContext } from "../../../../../../utilities/hooks/RoleContext";
import { evaluationService } from "../../../services/EvaluationApiService";

const ScoreRating = [
  { key: 1, text: "Not Acceptable" },
  { key: 2, text: "Acceptable" },
  { key: 3, text: "Excellent" },
];

const SCORECARD_FIELDS = [
  { key: "Qualifications",  label: "QUALIFICATIONS",  icon: "📄" },
  { key: "Experience",      label: "EXPERIENCE",      icon: "📈" },
  { key: "Knowledge",       label: "KNOWLEDGE",        icon: "🧩" },
  { key: "EnergyLevel",     label: "ENERGY LEVEL",     icon: "⚡" },
  { key: "JobRequirements", label: "JOB REQUIREMENTS", icon: "⏱" },
  { key: "CultureFit",      label: "CULTURE FIT",      icon: "👥" },
  { key: "ExpatLocal",      label: "EXPAT/LOCAL",      icon: "🌐" },
  { key: "OtherCriteria",   label: "OTHER CRITERIA",   icon: "📄" },
] as const;

type ScorecardKey = typeof SCORECARD_FIELDS[number]["key"];

export interface EvaluationFormProps {
  candidateId:    number;
  recruitmentId:  number;
  interviewLevel: string;
  grade:          string;
  status:         string;
  statusId:       number | string;
  jobCodeID:      number;
  onBack:         () => void;
  currentRoleIDs: number[];
}

const EvaluationForm: React.FC<EvaluationFormProps> = ({
  candidateId,
  recruitmentId,
  interviewLevel,
  grade,
  onBack,
  currentRoleIDs
}) => {
  const { ADGroupData, userName } = useRoleContext();
  const currentUserEmail = ADGroupData?.EmailId?.[0] ?? "";

  const [loading,            setLoading]            = React.useState(true);
  const [submitting,         setSubmitting]         = React.useState(false);
  const [alertMsg,           setAlertMsg]           = React.useState("");
  const [alertType,          setAlertType]          = React.useState<"success" | "error" | "">("");
  const [candidateData,      setCandidateData]      = React.useState<any>(null);
  const [panelMembers,       setPanelMembers]       = React.useState<string[]>([]);
  const [currentUserPanelId, setCurrentUserPanelId] = React.useState<number | null>(null);

  const [reviewerName, setReviewerName] = React.useState("");
  const [currentUserGuid, setCurrentUserGuid] = React.useState<string | null>(null);
  const [jobTitleEn, setJobTitleEn] = React.useState("—");
  const [jobTitleFr, setJobTitleFr] = React.useState("—");

  const [questionnaire, setQuestionnaire] = React.useState<
    { id: number; question: string; answer: string; rating: number | null }[]
  >([]);
  const [ratingErrors, setRatingErrors] = React.useState<Record<number, boolean>>({});

  const [scorecard, setScorecard] = React.useState<Record<ScorecardKey, number | null>>(
    Object.fromEntries(SCORECARD_FIELDS.map(f => [f.key, null])) as Record<ScorecardKey, number | null>
  );
  const [scorecardErrors, setScorecardErrors] = React.useState<Record<string, boolean>>({});

  const [recommendation,  setRecommendation]  = React.useState<"consider" | "doNotConsider" | null>(null);
  const [recError,        setRecError]        = React.useState(false);
  const [overallFeedback, setOverallFeedback] = React.useState("");
  const [feedbackError,   setFeedbackError]   = React.useState(false);
  const [acknowledged,    setAcknowledged]    = React.useState(false);
  const [ackError,        setAckError]        = React.useState(false);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await evaluationService.getEvaluationFormData(
        candidateId, recruitmentId, currentUserEmail
      );
      if (result.success) {
        setCandidateData(result.candidateData);
        setPanelMembers(result.panelMembers ?? []);
        setCurrentUserPanelId(result.currentUserPanelId);
        
        setReviewerName(result.reviewerName || userName || "—");
        setJobTitleEn(result.jobTitleEn || "—");
        setJobTitleFr(result.jobTitleFr || "—");
        setCurrentUserGuid(result.currentUserGuid ?? null);

        setQuestionnaire(
          (result.questions ?? []).map((q: any, idx: number) => ({
            id:       q.ID ?? q.id ?? idx,
            question: q.Question ?? q.question ?? q.header ?? q.Title ?? "",
            answer:   q.ExpectedResponse ?? q.expectedResponse ?? q.Answer ?? q.answer ?? "",
            rating:   null,
          }))
        );
      }
      setLoading(false);
    })();
  }, []);

  const cleanHTML = (text: string = "") =>
    text.replace(/<p>/gi, "").replace(/<\/p>/gi, "").replace(/<br\s*\/?>/gi, "").trim();

  const handleRatingChange = (id: number, value: { key: number; text: string } | null) => {
    setQuestionnaire(prev =>
      prev.map(q => q.id === id ? { ...q, rating: value?.key ?? null } : q)
    );
    if (value) setRatingErrors(prev => ({ ...prev, [id]: false }));
  };

  const handleScorecardChange = (key: ScorecardKey, value: number) => {
    setScorecard(prev => ({ ...prev, [key]: value }));
    setScorecardErrors(prev => ({ ...prev, [key]: false }));
  };

  const showAlert = (msg: string, type: "success" | "error") => {
    setAlertMsg(msg);
    setAlertType(type);
  };

  const hideAlert = () => {
    setAlertMsg("");
    setAlertType("");
  };

  const handleSubmit = async () => {
    let valid = true;

    const newRatingErrors: Record<number, boolean> = {};
    questionnaire.forEach(q => {
      if (q.rating === null) { newRatingErrors[q.id] = true; valid = false; }
    });
    setRatingErrors(newRatingErrors);

    const newScorecardErrors: Record<string, boolean> = {};
    SCORECARD_FIELDS.forEach(f => {
      if (scorecard[f.key] === null) { newScorecardErrors[f.key] = true; valid = false; }
    });
    setScorecardErrors(newScorecardErrors);

    if (!recommendation)        { setRecError(true);     valid = false; } else { setRecError(false); }
    if (!overallFeedback.trim()) { setFeedbackError(true); valid = false; } else { setFeedbackError(false); }
    if (!acknowledged)          { setAckError(true);     valid = false; } else { setAckError(false); }

    if (!valid) {
      showAlert("Please complete all required fields before submitting.", "error");
      return;
    }
    if (!currentUserPanelId) {
      showAlert("Could not identify your panel entry. Please contact HR.", "error");
      return;
    }

    setSubmitting(true);
    const payload = {
      RecruitmentIDId: recruitmentId,
      Qualifications:  scorecard.Qualifications,
      Experience:      scorecard.Experience,
      Knowledge:       scorecard.Knowledge,
      EnergyLevel:     scorecard.EnergyLevel,
      JobRequirements: scorecard.JobRequirements,
      CultureFit:      scorecard.CultureFit,
      ExpatLocal:      scorecard.ExpatLocal,
      OtherCriteria:   scorecard.OtherCriteria,
      Recommendation:  recommendation === "consider" ? "Consider for Employment" : "Do Not Consider",
      OverallFeedback: overallFeedback,
      QuestionScores: JSON.stringify(
        questionnaire.map(q => ({ id: q.id, rating: q.rating }))
      ),
    };

    const roleIdToSave = currentRoleIDs.includes(4) ? 4 : (currentRoleIDs[0] || 0);

    const result = await evaluationService.submitScorecard(
      payload, 
      currentUserPanelId, 
      roleIdToSave, 
      currentUserGuid || ""
    );
    setSubmitting(false);

    if (result.success) {
      showAlert(result.message, "success");
      setTimeout(() => onBack(), 1600);
    } else {
      showAlert(result.message, "error");
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Loading evaluation form…</p>
      </div>
    );
  }

  const candidateName = candidateData
    ? `${candidateData.FristName ?? ""}${candidateData.MiddleName ? " " + candidateData.MiddleName : ""} ${candidateData.LastName ?? ""}`.trim()
    : "—";

  const userInitial = (reviewerName || "J").charAt(0).toUpperCase();

  const interviewDateDisplay =
    candidateData?.InterviewDateLevel2 || candidateData?.InterviewDate
      ? (candidateData.InterviewDateLevel2 || candidateData.InterviewDate).split("T")[0]
      : "—";

  const alertClass = [
    styles.alert,
    alertType === "error"   ? styles.alertError   : "",
    alertType === "success" ? styles.alertSuccess : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={styles.root}>

      {alertMsg && (
        <div className={alertClass}>
          <span>{alertMsg}</span>
          <button className={styles.alertClose} onClick={hideAlert}>✕</button>
        </div>
      )}
      <div className={styles.layout}>

        <aside className={styles.leftPanel}>
          <div className={styles.leftHeader}>
            <div className={styles.leftAccent} />
            <span className={styles.leftTitle}>CANDIDATE INFO</span>
            <button className={styles.refreshBtn} title="Refresh" onClick={() => window.location.reload()}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 4v6h-6" />
                <path d="M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
            </button>
          </div>

          <div style={{ paddingTop: 8 }}>
            <LeftField icon="👤" label="APPLICANT NAME"  value={candidateName} />
            <LeftField icon="🌐" label="NATIONALITY"     value={candidateData?.Nationality ?? "—"} />
            <LeftField icon="👤" label="GENDER"          value={candidateData?.Gender ?? "—"} />
            <LeftField icon="📄" label="QUALIFICATION"   value={candidateData?.Qualification ?? "—"} />

            <div className={styles.twoCol}>
              <LeftField icon="📈" label="MINING EXP."  value={candidateData?.TotalYearOfExperiance ?? "—"} />
              <LeftField icon="📈" label="RELATED EXP." value={candidateData?.ReleventExperience ?? "—"} />
            </div>
            <div className={styles.twoCol}>
              <LeftField icon="📅" label="INTERVIEW DATE" value={interviewDateDisplay} />
              <LeftField icon="🔲" label="LEVELS"         value={interviewLevel ?? "—"} />
            </div>
            <div className={styles.twoCol}>
              <LeftField icon="📈" label="GRADE"     value={grade || "—"} />
              <LeftField icon="⚠️" label="CONFLICTS" value={candidateData?.ConflictsOfInterest ?? "—"} />
            </div>

            <LeftField
              icon="♿"
              label="DISABILITY"
              value={candidateData?.disability ?? candidateData?.Disability ?? "—"}
            />

            {panelMembers.length > 0 && (
              <div className={styles.panelSection}>
                <div className={styles.panelHeader}>
                  <span className={styles.panelHeaderIcon}>👥</span>
                  <span className={styles.panelHeaderLabel}>INTERVIEW PANEL</span>
                </div>
                {panelMembers.map((name, i) => (
                  <div key={i} className={styles.panelRow}>
                    <span className={styles.panelBadge}>{i + 1}</span>
                    <span className={styles.panelName}>{name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        <main className={styles.rightPanel}>

          {questionnaire.length > 0 && (
            <section>
              <div className={styles.sectionTitle}>
                <div className={styles.sectionAccentOrange} />
                <div>
                  <h2 className={styles.sectionH2}>INTERVIEW QUESTIONNAIRES</h2>
                  <p className={styles.sectionSub}>Technical &amp; Behavioral Assessment</p>
                </div>
                <div className={styles.ratingGuide}>
                  <span className={styles.ratingGuideLabel}>RATING GUIDE:</span>
                  <span className={styles.dot} style={{ background: "#22c55e" }} />
                  <span className={styles.guideItem}>3 - <b>Excellent</b></span>
                  <span className={styles.dot} style={{ background: "#3b82f6" }} />
                  <span className={styles.guideItem}>2 - <b>Acceptable</b></span>
                  <span className={styles.dot} style={{ background: "#ef4444" }} />
                  <span className={styles.guideItem}>1 - <b>Not Acceptable</b></span>
                </div>
              </div>

              {questionnaire.map((q, idx) => {
                const cardClass = [
                  styles.qCard,
                  ratingErrors[q.id] ? styles.qCardError : "",
                ].filter(Boolean).join(" ");

                return (
                  <div key={q.id} className={cardClass}>
                    <div className={styles.qTop}>
                      <span className={styles.qBadge}>Q{idx + 1}</span>
                      <p
                        className={styles.qText}
                        dangerouslySetInnerHTML={{ __html: cleanHTML(q.question) }}
                      />
                    </div>

                    {q.answer && (
                      <div className={styles.guideBox}>
                        <div className={styles.guideBoxHeader}>
                          <span className={styles.guideCheck}>✅</span>
                          <span className={styles.guideBoxLabel}>EXPECTED RESPONSE GUIDE</span>
                          <span className={styles.guideBoxIcon}>📋</span>
                        </div>
                        <p
                          className={styles.guideBoxText}
                          dangerouslySetInnerHTML={{ __html: cleanHTML(q.answer) }}
                        />
                      </div>
                    )}

                    <div className={styles.qBottom}>
                      <div>
                        <p className={styles.panelRatingLabel}>
                          PANEL RATING <span className={styles.req}>*</span>
                          {ratingErrors[q.id] && (
                            <span className={styles.fieldErr}> — This field is required</span>
                          )}
                        </p>
                        <div className={styles.ratingBtnRow}>
                          {ScoreRating.map(({ key, text }) => {
                            const btnClass = [
                              styles.ratingBtn,
                              q.rating === key && key === 3 ? styles.ratingExcellent     : "",
                              q.rating === key && key === 2 ? styles.ratingAcceptable    : "",
                              q.rating === key && key === 1 ? styles.ratingNotAcceptable : "",
                            ].filter(Boolean).join(" ");

                            return (
                              <button
                                key={key}
                                className={btnClass}
                                onClick={() => handleRatingChange(q.id, { key, text })}
                              >
                                {text}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className={styles.scoreDisplay}>
                        <span className={styles.scoreLabel}>SCORE</span>
                        <span className={styles.scoreNum}>
                          {q.rating ?? 0}
                          <span className={styles.scoreMax}>/3</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>
          )}
          <section style={{ marginTop: questionnaire.length > 0 ? 16 : 0 }}>
            <div className={styles.sectionTitle}>
              <div className={styles.sectionAccentGreen} />
              <div>
                <h2 className={styles.sectionH2}>SCORECARD DETAILS</h2>
                <p className={styles.sectionSub}>Core Competency Assessment (1-5 Scale)</p>
              </div>
            </div>

            <div className={styles.scorecardCard}>
              <div className={styles.scorecardGrid}>
                {SCORECARD_FIELDS.map(field => {
                  const lblClass = [
                    styles.scorecardFieldLabel,
                    scorecardErrors[field.key] ? styles.errLabel : "",
                  ].filter(Boolean).join(" ");

                  return (
                    <div key={field.key} className={styles.scorecardField}>
                      <p className={lblClass}>
                        {field.icon} {field.label} <span className={styles.req}>*</span>
                        {scorecardErrors[field.key] && (
                          <span className={styles.fieldErr}> — Required</span>
                        )}
                      </p>
                      <div className={styles.fiveRow}>
                        {[1, 2, 3, 4, 5].map(n => {
                          const btnClass = [
                            styles.fiveBtn,
                            scorecard[field.key] === n ? styles.fiveBtnActive : "",
                          ].filter(Boolean).join(" ");
                          return (
                            <button
                              key={n}
                              className={btnClass}
                              onClick={() => handleScorecardChange(field.key, n)}
                            >
                              {n}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={styles.recRow}>
                <div className={styles.recLeft}>
                  <p className={[styles.scorecardFieldLabel, recError ? styles.errLabel : ""].filter(Boolean).join(" ")}>
                    RECOMMENDATION <span className={styles.req}>*</span>
                    {recError && <span className={styles.fieldErr}> — Required</span>}
                  </p>
                  <div className={styles.recBtnRow}>
                    <button
                      className={[styles.recBtn, recommendation === "consider" ? styles.recBtnActive : ""].filter(Boolean).join(" ")}
                      onClick={() => { setRecommendation("consider"); setRecError(false); }}
                    >
                      {recommendation === "consider" && <span style={{fontSize: 14}}>✅</span>}
                      Consider for Employment
                    </button>
                    <button
                      className={[styles.recBtn, recommendation === "doNotConsider" ? styles.recBtnDeny : ""].filter(Boolean).join(" ")}
                      onClick={() => { setRecommendation("doNotConsider"); setRecError(false); }}
                    >
                      ✕ Do Not Consider
                    </button>
                  </div>
                </div>

                <div className={styles.recRight}>
                  <p className={[styles.scorecardFieldLabel, feedbackError ? styles.errLabel : ""].filter(Boolean).join(" ")}>
                    OVERALL EVALUATION FEEDBACK <span className={styles.req}>*</span>
                    {feedbackError && <span className={styles.fieldErr}> — Required</span>}
                  </p>
                  <textarea
                    className={[styles.feedbackArea, feedbackError ? styles.inputErr : ""].filter(Boolean).join(" ")}
                    rows={4}
                    value={overallFeedback}
                    onChange={e => {
                      setOverallFeedback(e.target.value);
                      if (e.target.value.trim()) setFeedbackError(false);
                    }}
                    placeholder="Enter your overall evaluation feedback here…"
                  />
                </div>
              </div>

              <div className={[styles.ackBox, ackError ? styles.ackBoxErr : ""].filter(Boolean).join(" ")}>
                <label className={styles.ackRow}>
                  <input
                    type="checkbox"
                    checked={acknowledged}
                    onChange={e => { setAcknowledged(e.target.checked); if (e.target.checked) setAckError(false); }}
                    className={styles.ackChk}
                  />
                  <span className={styles.ackText}>
                    I hereby acknowledge that I have completed the candidate evaluation and scorecard entry,
                    and I confirm that the scores and feedback provided are accurate.
                  </span>
                </label>

                <div className={styles.reviewerCard}>
                  <div className={styles.reviewerAvatar}>{userInitial}</div>
                  <div className={styles.reviewerInfo}>
                    <div className={styles.reviewerCol}>
                      <p className={styles.reviewerMeta}>REVIEWER NAME</p>
                      <p className={styles.reviewerVal}>{reviewerName}</p>
                    </div>
                    <div className={styles.reviewerCol}>
                      <p className={styles.reviewerMeta}>JOB TITLE (EN)</p>
                      <p className={styles.reviewerVal}>{jobTitleEn}</p>
                      <p className={styles.reviewerMeta} style={{ marginTop: 12 }}>JOB TITLE (FR)</p>
                      <p className={styles.reviewerVal}>{jobTitleFr}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          <div className={styles.footer}>
            <button
              className={styles.cancelBtn}
              onClick={onBack}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={submitting || !acknowledged}
            >
              {submitting ? "Submitting…" : "+ Submit Evaluation"}
            </button>
          </div>

        </main>
      </div>
    </div>
  );
};
const LeftField: React.FC<{
  icon?: string;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className={styles.leftFieldWrapper}>
    <div className={styles.leftFieldLabelRow}>
      {icon && <span className={styles.leftFieldIcon}>{icon}</span>}
      <span className={styles.leftFieldLabel}>{label}</span>
    </div>
    <div className={styles.leftFieldValueBox}>
      {value || "—"}
    </div>
  </div>
);

export default EvaluationForm;