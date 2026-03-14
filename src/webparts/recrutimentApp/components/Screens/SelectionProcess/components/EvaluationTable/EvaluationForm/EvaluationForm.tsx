import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./EvaluationForm.module.scss";
import { evaluationService } from "../../../services/EvaluationApiService";
import { useRoleContext } from "../../../../../../utilities/hooks/RoleContext";


const COMPETENCY_FIELDS = [
  { key: "qualifications", label: "Qualifications" },
  { key: "experience", label: "Experience" },
  { key: "knowledge", label: "Knowledge" },
  { key: "energyLevel", label: "Energy Level" },
  { key: "jobRequirements", label: "Job Requirements" },
  { key: "cultureFit", label: "Culture Fit" },
  { key: "expatLocal", label: "Expat/Local" },
  { key: "otherCriteria", label: "Other Criteria" },
];

const EvaluationForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ADGroupData } = useRoleContext();
  
  const currentUserEmail = ADGroupData?.EmailId?.[0] || "";
  const currentUserName =  "Current User";
  const jobTitleEn =  "HOD - Mining";
  const jobTitleFr =  "Chef de département - Mines";

  // Data passed from EvaluationTable row click
  const { ID: candidateId, RecruitmentID, InterviewLevel, grade: passedGrade } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [candidateInfo, setCandidateInfo] = useState<any>({});
  const [panelMembers, setPanelMembers] = useState<string[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentUserPanelId, setCurrentUserPanelId] = useState<number | null>(null);

  const [questionScores, setQuestionScores] = useState<Record<number, number>>({});
  const [competencies, setCompetencies] = useState<Record<string, number>>({
    qualifications: 0, experience: 0, knowledge: 0, energyLevel: 0,
    jobRequirements: 0, cultureFit: 0, expatLocal: 0, otherCriteria: 0
  });
  const [recommendation, setRecommendation] = useState<"Consider" | "DoNotConsider" | null>(null);
  const [feedback, setFeedback] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    if (!candidateId) {
      navigate("/Dashboard");
      return;
    }
    fetchFormData();
  }, [candidateId]);

  const fetchFormData = async () => {
    setLoading(true);
    // Passing RecruitmentID to correctly fetch the JobCode string for the API
    const res = await evaluationService.getEvaluationFormData(candidateId, RecruitmentID, currentUserEmail);
    
    if (res.success) {
      setCandidateInfo(res.candidateData);
      setPanelMembers(res.panelMembers);
      setQuestions(res.questions);
      setCurrentUserPanelId(res.currentUserPanelId);
    } else {
      alert("Error loading candidate data.");
    }
    setLoading(false);
  };

  const handleCompetencyChange = (key: string, value: number) => {
    setCompetencies(prev => ({ ...prev, [key]: value }));
  };

  const handleQuestionScore = (index: number, score: number) => {
    setQuestionScores(prev => ({ ...prev, [index]: score }));
  };

  const isFormValid = () => {
    const allCompetenciesScored = Object.values(competencies).every(val => val > 0);
    const allQuestionsScored = questions.length === 0 || Object.keys(questionScores).length === questions.length;
    return allCompetenciesScored && allQuestionsScored && recommendation !== null && feedback.trim() !== "" && acknowledged;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      alert("Please fill all mandatory fields, scores, and check the acknowledgment.");
      return;
    }
    if (!currentUserPanelId) {
      alert("You are not assigned as a panel member for this candidate.");
      return;
    }

    setLoading(true);
    const payload = {
      InterviewPanelIDId: currentUserPanelId,
      RecruitmentIDId: RecruitmentID,
      RelevantQualification: String(competencies.qualifications),
      ReleventExperience: String(competencies.experience),
      Knowledge: String(competencies.knowledge),
      EnergyLevel: String(competencies.energyLevel),
      MeetJobRequirement: String(competencies.jobRequirements),
      ContributeTowardsCultureRequried: String(competencies.cultureFit),
      Experience: String(competencies.expatLocal), 
      OtherCriteriaScore: String(competencies.otherCriteria),
      ConsiderForEmployment: recommendation === "Consider" ? "Yes" : "No",
      OverAllEvaluationFeedback: feedback,
    };

    const result = await evaluationService.submitScorecard(payload, currentUserPanelId);
    setLoading(false);

    if (result.success) {
      alert(result.message); 
      navigate("/Dashboard");
    } else {
      alert(result.message);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Loading Evaluation Form...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>
        <span>HOME</span> <span className={styles.sep}>&gt;</span>
        <span onClick={() => navigate("/Dashboard")} style={{ cursor: "pointer" }}>DASHBOARD</span> <span className={styles.sep}>&gt;</span>
        <span>CANDIDATE EVALUATIONS</span> <span className={styles.sep}>&gt;</span>
        <span className={styles.active}>EVALUATION FORM</span>
      </div>

      <div className={styles.container}>
        
        {/* LEFT SIDEBAR - CANDIDATE INFO */}
        <div className={styles.sidebar}>
          <h3>CANDIDATE INFO</h3>
          
          <div className={styles.infoGroup}>
            <label>Applicant Name</label>
            <div className={styles.valueBox}>{candidateInfo?.FristName} {candidateInfo?.LastName}</div>
          </div>
          <div className={styles.infoGroup}>
            <label>Nationality</label>
            <div className={styles.valueBox}>{candidateInfo?.Nationality || "N/A"}</div>
          </div>
          <div className={styles.infoGroup}>
            <label>Gender</label>
            <div className={styles.valueBox}>{candidateInfo?.Gender || "N/A"}</div>
          </div>
          <div className={styles.infoGroup}>
            <label>Qualification</label>
            <div className={styles.valueBox}>{candidateInfo?.Qualification || "N/A"}</div>
          </div>

          <div className={styles.rowGrid}>
            <div className={styles.infoGroup}>
              <label>Mining Exp.</label>
              <div className={styles.valueBox}>{candidateInfo?.TotalYearOfExperiance || "0"}</div>
            </div>
            <div className={styles.infoGroup}>
              <label>Related Exp.</label>
              <div className={styles.valueBox}>{candidateInfo?.ReleventExperience || "0"}</div>
            </div>
          </div>

          <div className={styles.rowGrid}>
            <div className={styles.infoGroup}>
              <label>Interview Date</label>
              <div className={styles.valueBox}>{candidateInfo?.InterviewDate ? new Date(candidateInfo.InterviewDate).toISOString().split('T')[0] : "N/A"}</div>
            </div>
            <div className={styles.infoGroup}>
              <label>Levels</label>
              <div className={styles.valueBox}>{InterviewLevel || "Level 1"}</div>
            </div>
          </div>

          <div className={styles.rowGrid}>
            <div className={styles.infoGroup}>
              <label>Grade</label>
              <div className={styles.valueBox}>{passedGrade || "N/A"}</div>
            </div>
            <div className={styles.infoGroup}>
              <label>Conflicts</label>
              <div className={styles.valueBox}>{candidateInfo?.ConflictsOfInterest ? "Yes" : "No"}</div>
            </div>
          </div>

          <div className={styles.infoGroup}>
            <label>Disability</label>
            <div className={styles.valueBox}>{candidateInfo?.Disability || "No"}</div>
          </div>

          <div className={styles.infoGroup}>
            <label>Interview Panel</label>
            <div className={styles.panelList}>
              {panelMembers.map((name, idx) => (
                <div key={idx} className={styles.panelItem}>
                  <div className={styles.avatar}>{idx + 1}</div>
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT MAIN CONTENT */}
        <div className={styles.mainContent}>
          
          {/* SECTION 1: QUESTIONS */}
          {questions.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>INTERVIEW QUESTIONNAIRES</h2>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
                  RATING GUIDE: <span style={{color:'#10b981'}}>● 3 - Excellent</span> &nbsp; <span style={{color:'#3b82f6'}}>● 2 - Acceptable</span> &nbsp; <span style={{color:'#ef4444'}}>● 1 - Not Acceptable</span>
                </div>
              </div>

              {questions.map((q, index) => (
                <div key={index} className={styles.questionCard}>
                  <div className={styles.qHeader}>
                    <div className={styles.qNum}>Q{index + 1}</div>
                    <div className={styles.qText}>{q.question || "Question text not provided."}</div>
                  </div>
                  
                  <div className={styles.expectedResponse}>
                    <div className={styles.erTitle}>✓ EXPECTED RESPONSE GUIDE</div>
                    <div>{q.answer || "Look for key indicators relevant to the question."}</div>
                  </div>

                  <div className={styles.ratingArea}>
                    <div>
                      <span className={styles.ratingLabel}>PANEL RATING <span>*</span></span>
                      <div className={styles.ratingButtons}>
                        <button 
                          type="button"
                          className={questionScores[index] === 1 ? styles.activeNotAcceptable : ""} 
                          onClick={() => handleQuestionScore(index, 1)}>Not Acceptable</button>
                        <button 
                          type="button"
                          className={questionScores[index] === 2 ? styles.activeAcceptable : ""} 
                          onClick={() => handleQuestionScore(index, 2)}>Acceptable</button>
                        <button 
                          type="button"
                          className={questionScores[index] === 3 ? styles.activeExcellent : ""} 
                          onClick={() => handleQuestionScore(index, 3)}>Excellent</button>
                      </div>
                    </div>
                    <div className={styles.scoreDisplay}>
                      <div className={styles.scoreLabel}>SCORE</div>
                      <div className={styles.scoreValue}>{questionScores[index] || 0}<span>/3</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SECTION 2: SCORECARD */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>SCORECARD DETAILS</h2>
            </div>
            
            <div className={styles.competencyGrid}>
              {COMPETENCY_FIELDS.map(comp => (
                <div key={comp.key} className={styles.compItem}>
                  <label>{comp.label} <span>*</span></label>
                  <div className={styles.scaleOptions}>
                    {[1, 2, 3, 4, 5].map(num => (
                      <button 
                        key={num} 
                        type="button"
                        className={`${styles.scaleBtn} ${competencies[comp.key] === num ? styles.selected : ""}`}
                        onClick={() => handleCompetencyChange(comp.key, num)}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.feedbackGrid}>
              <div className={styles.recGroup}>
                <label>RECOMMENDATION <span>*</span></label>
                <div className={styles.recBtns}>
                  <button 
                    type="button"
                    className={recommendation === "Consider" ? styles.activeConsider : ""}
                    onClick={() => setRecommendation("Consider")}
                  >✓ Consider for Employment</button>
                  <button 
                    type="button"
                    className={recommendation === "DoNotConsider" ? styles.activeDoNot : ""}
                    onClick={() => setRecommendation("DoNotConsider")}
                  >✕ Do Not Consider</button>
                </div>
              </div>
              <div className={styles.feedGroup}>
                <label>OVERALL EVALUATION FEEDBACK <span>*</span></label>
                <textarea 
                  value={feedback} 
                  onChange={(e) => setFeedback(e.target.value)} 
                  placeholder="Enter overall feedback..."
                />
              </div>
            </div>

            <div className={styles.ackBox}>
              <input 
                type="checkbox" 
                checked={acknowledged} 
                onChange={(e) => setAcknowledged(e.target.checked)} 
              />
              <div className={styles.ackContent}>
                <p>I hereby acknowledge that I have completed the candidate evaluation and scorecard entry, and I confirm that the scores and feedback provided are accurate.</p>
                
                <div className={styles.reviewerBlock}>
                  <div className={styles.reviewerAvatar}>{currentUserName.charAt(0).toUpperCase()}</div>
                  <div className={styles.reviewerDetails}>
                    <div className={styles.reviewerNameGroup}>
                      <span>REVIEWER NAME</span>
                      <h4>{currentUserName}</h4>
                    </div>
                    <div className={styles.reviewerJobGroup}>
                      <span>JOB TITLE (EN)</span>
                      <h4>{jobTitleEn}</h4>
                      <span className={styles.frTitle}>JOB TITLE (FR)</span>
                      <h4>{jobTitleFr}</h4>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className={styles.footerActions}>
              <button type="button" className={styles.cancelBtn} onClick={() => navigate("/Dashboard")}>Cancel</button>
              <button 
                type="button" 
                className={styles.submitBtn} 
                onClick={handleSubmit}
                disabled={!isFormValid() || loading}
              >
                {loading ? "Submitting..." : "Submit Evaluation"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationForm;