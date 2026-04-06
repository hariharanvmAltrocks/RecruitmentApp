import * as React from 'react';
import { motion } from 'framer-motion';
import { X, Users, ChevronRight } from 'lucide-react';
import styles from '../ReviewScorecard.module.scss';
import {
  ScorecardCandidateRow,
  HODDecision,
  PositionOption,
  CommentEntry,
  CandidateReviewData,
  ErrorsType,
} from '../State/types';
import QuestionnaireTab  from './QuestionnaireTab';
import ScoreTable        from './ScoreTable';
import HODDecisionPanel  from './HODDecisionPanel';
import CommentsModal     from './Commentsmodal';
import { canEdit }       from '../Hooks/useReviewScorecard';
import { SubmitHookDeps } from './useSubmitReviewScoreCard';

const SCORE_CRITERIA = [
  { field: 'RelevantQualification',            label: 'Qualification (Relevant)'            },
  { field: 'ReleventExperience',               label: 'Experience (Relevant)'               },
  { field: 'Knowledge',                        label: 'Knowledge'                           },
  { field: 'EnergyLevel',                      label: 'Energy Level'                        },
  { field: 'MeetJobRequirement',               label: 'Meets All Job Requirements'          },
  { field: 'ContributeTowardsCultureRequried', label: 'Will Contribute to Culture Required' },
  { field: 'Experience',                       label: 'Experience'                          },
  { field: 'OtherCriteriaScore',               label: 'Other Criteria Recognized by Panel'  },
];
const MAX_OVERALL_PER_PANEL = 40;
interface Props {
  candidate:     ScorecardCandidateRow;
  reviewData:    CandidateReviewData | null;
  reviewLoading: boolean;
  job?:          any;
  scoreData:     any[];
  scoreLoading:  boolean;

  showComments:    boolean;
  level1Comments:  CommentEntry[];
  level2Comments:  CommentEntry[];
  commentsLoading: boolean;
  onViewComments:  () => void;
  onCloseComments: () => void;

  hodDecision:          HODDecision;
  decisionComment:      string;
  confirmed:            boolean;
  selectedPositionId:   number | null;
  selectedPositionText: string;
  positionOptions:      PositionOption[];
  submitting:           boolean;
  submitError:          string;
  successMessage:       string;
  errors:               ErrorsType;
  shouldShowPositionId: (statusId: number, decision: HODDecision) => boolean;

  onDecisionChange: (d: HODDecision) => void;
  onCommentChange:  (v: string) => void;
  onConfirmChange:  (v: boolean) => void;
  onPositionChange: (id: number | null, text: string) => void;
  onClose:          () => void;

  currentRoleId:  number;
  isLevel2Status: boolean;
  submitDeps: SubmitHookDeps;
}

type ScorecardTabKey = 'questions' | 'qEval' | 'overall';

const MField = ({ label, value }: { label: string; value: string }) => (
  <div className={styles.mfField}>
    <span className={styles.mfLabel}>{label}</span>
    <div className={styles.mfValue}>{value || '—'}</div>
  </div>
);

const CandidateReviewModal: React.FC<Props> = ({
  candidate, reviewData, reviewLoading, job,
  scoreData, scoreLoading,
  showComments, level1Comments, level2Comments, commentsLoading,
  onViewComments, onCloseComments,
  hodDecision, decisionComment, confirmed,
  selectedPositionId, selectedPositionText, positionOptions,
  submitting, submitError, successMessage,
  errors, shouldShowPositionId,
  onDecisionChange, onCommentChange, onConfirmChange, onPositionChange,
  onClose,
  currentRoleId, isLevel2Status,
  submitDeps,
}) => {
  const [activePanelTab,     setActivePanelTab]     = React.useState(0);
  const [activeScorecardTab, setActiveScorecardTab] = React.useState<ScorecardTabKey>('questions');

  const panelMembers: string[] = React.useMemo(() => {
    const fromReview = reviewData?.panelMembers || [];
    if (fromReview.length > 0) return fromReview;
    return (scoreData || []).map(
      (s: any, i: number) => s.InterviewPersonName || `Interviewer ${i + 1}`,
    );
  }, [reviewData, scoreData]);

  const activeScore: any    = (scoreData || [])[activePanelTab] || null;
  const activeQJson: any[]  = React.useMemo(() => {
    if (!activeScore?.QuestionJson) return [];
    if (Array.isArray(activeScore.QuestionJson)) return activeScore.QuestionJson;
    try { return JSON.parse(activeScore.QuestionJson); } catch { return []; }
  }, [activeScore]);

  const questionTableRows = React.useMemo(() => {
    const qMap: Record<string, any> = {};
    (scoreData || []).forEach((s: any, i: number) => {
      const qJson: any[] = Array.isArray(s.QuestionJson)
        ? s.QuestionJson
        : (() => { try { return JSON.parse(s.QuestionJson || '[]'); } catch { return []; } })();
      qJson.forEach((q: any) => {
        const key = Object.keys(q)[0];
        if (!qMap[key]) qMap[key] = { criteria: key };
        qMap[key][`panel_${i}`] = q[key];
      });
    });
    return Object.values(qMap);
  }, [scoreData]);

  const overallTableRows = React.useMemo(() => {
    const rows = SCORE_CRITERIA.map(({ field, label }) => {
      const row: any = { criteria: label, total: 0 };
      (scoreData || []).forEach((s: any, i: number) => {
        const val = Number(s[field]) || 0;
        row[`panel_${i}`] = val;
        row.total += val;
      });
      return row;
    });
    const totalRow: any = { criteria: 'Total', total: 0 };
    (scoreData || []).forEach((_: any, i: number) => {
      const sum = rows.reduce((acc, r) => {
        const v = r[`panel_${i}`];
        return typeof v === 'number' ? acc + v : acc;
      }, 0);
      totalRow[`panel_${i}`] = `${sum} / ${MAX_OVERALL_PER_PANEL}`;
    });
    totalRow.total = rows.reduce(
      (acc, r) => acc + (typeof r.total === 'number' ? r.total : 0), 0,
    );
    rows.push(totalRow);
    return rows;
  }, [scoreData]);

  const raw          = reviewData?.candidateData || {};
  const formattedDate = (raw.InterviewDate || raw.InterviewDateLevel2 || candidate.interviewDate || '').split('T')[0] || '';
  const nationLabel  = (() => {
    const n = (candidate.nationality || '').toLowerCase();
    if (n.includes('expat'))                                                        return 'EXPAT';
    if (n.includes('national') || n.includes('congolese') || n.includes('local'))  return 'LOCAL';
    return (candidate.nationality || '').toUpperCase() || '';
  })();
  const userInitial = (reviewData?.reviewerName || '').charAt(0).toUpperCase();
  const safeLevel1  = Array.isArray(level1Comments) ? level1Comments : [];
  const safeLevel2  = Array.isArray(level2Comments) ? level2Comments : [];

  return (
    <div className={styles.modalOverlay}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className={styles.modalWindow}
      >
        {/* ══ HEADER ══ */}
        <div className={styles.mHeader}>
          <div className={styles.mHeaderLeft}>
            <div className={styles.mBreadcrumb}>
              <span>CANDIDATE SELECTION</span>
              <ChevronRight size={11} />
              <span className={styles.mBreadcrumbActive}>Review score card </span>
            </div>
            <div className={styles.mTitleRow}>
              <div className={styles.mIconBox}><Users size={20} /></div>
              <div> 
                <h2 className={styles.mTitle}>Candidate  Details</h2>
                <p className={styles.mSubtitle}>
                  <span className={styles.mJobCode}>{job?.jobCode || candidate.jobCode || ''}</span>
                  <span className={styles.mDot}>›</span>
                  <span>{raw?.PositionTitle || candidate.positionTitle || ''}</span>
                </p>
              </div>
            </div>
          </div>
          <div className={styles.mHeaderRight}>
            <div className={styles.mGpa}>
              <span className={styles.mGpaLabel}>OVERALL GPA</span>
              <span className={styles.mGpaValue}>{candidate.gpa || '—'}</span>
            </div>
            <button onClick={onClose} className={styles.mCloseBtn}><X size={20} /></button>
          </div>
        </div>

        {/* ══ BODY ══ */}
        <div className={styles.mBody}>

          {/* ── LEFT SIDEBAR ── */}
          <aside className={styles.mLeft}>
            <div className={styles.mLeftCard}>
              <div className={styles.mCandidateName}>{candidate.fullName}</div>
              <div className={styles.mCandidateType}>{nationLabel}</div>
              {reviewLoading ? (
                <div className={styles.mNoData}>Loading info...</div>
              ) : (
                <div className={styles.mFieldList}>
                  <MField label="NATIONALITY"   value={raw.Nationality   || candidate.nationality || ''} />
                  <MField label="GENDER"        value={raw.Gender        || candidate.gender      || ''} />
                  <MField label="QUALIFICATION" value={raw.Qualification || ''} />
                  <div className={styles.mTwoCol}>
                    <MField label="MINING EXP."  value={raw.TotalYearOfExperiance || ''} />
                    <MField label="RELATED EXP." value={raw.ReleventExperience    || ''} />
                  </div>
                  <div className={styles.mTwoCol}>
                    <MField label="INTERVIEW DATE" value={formattedDate}              />
                    <MField label="LEVELS"         value={candidate.interviewLevel || ''} />
                  </div>
                  <div className={styles.mTwoCol}>
                    <MField label="GRADE"     value={candidate.grade || ''} />
                    <MField label="CONFLICTS" value={raw.ConflictsOfInterest || ''} />
                  </div>
                  <MField label="DISABILITY" value={raw.Disability || raw.disability || ''} />
                </div>
              )}
              {panelMembers.length > 0 && (
                <div className={styles.mPanelSection}>
                  <div className={styles.mPanelHeader}>
                    <Users size={12} color="#2563eb" />
                    <span>INTERVIEW PANEL</span>
                  </div>
                  <div className={styles.mPanelList}>
                    {panelMembers.map((name, i) => (
                      <div key={i} className={styles.mPanelRow}>
                        <span className={styles.mPanelBadge}>{i + 1}</span>
                        <span className={styles.mPanelName}>{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* ── RIGHT MAIN ── */}
          <main className={styles.mRight}>
            {!scoreLoading && (scoreData || []).length > 0 && (
              <div className={styles.panelTabBar}>
                {(scoreData || []).map((s: any, i: number) => (
                  <button
                    key={i}
                    className={`${styles.panelTab} ${activePanelTab === i ? styles.panelTabActive : ''}`}
                    onClick={() => setActivePanelTab(i)}
                    type="button"
                  >
                    <span className={styles.panelTabNum}>{i + 1}</span>
                    <span className={styles.panelTabName}>
                      {panelMembers[i] || s.InterviewPersonName || `Interviewer ${i + 1}`}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {activeScorecardTab === 'questions' && (
              <QuestionnaireTab
                questions={reviewData?.questions || []}
                activeScore={activeScore}
                activeQJson={activeQJson}
                panelMemberName={panelMembers[activePanelTab] || ''}
                fetchingQuestions={reviewLoading}
              />
            )}
            {activeScorecardTab === 'qEval' && (
              <ScoreTable
                title="QUESTION EVALUATION SCORECARD"
                subtitle="Panel-wise Question Scores — All Interviewers"
                accentColor="#6366f1"
                rows={questionTableRows}
                panelMembers={panelMembers}
                showTotal={false}
                emptyText="No question data available."
              />
            )}
            {activeScorecardTab === 'overall' && (
              <ScoreTable
                title="OVERALL EVALUATION SCORECARD"
                subtitle="Core Criteria Scores — All Interviewers (Max 5 per criterion)"
                accentColor="#22c55e"
                rows={overallTableRows}
                panelMembers={panelMembers}
                showTotal={true}
                emptyText="No scorecard data available."
              />
            )}
            <HODDecisionPanel
              canEdit={canEdit(candidate.statusId)}
              isLevel2Status={isLevel2Status}
              statusId={candidate.statusId}
              hodDecision={hodDecision}
              decisionComment={decisionComment}
              confirmed={confirmed}
              selectedPositionId={selectedPositionId}
              selectedPositionText={selectedPositionText}
              positionOptions={positionOptions || []}
              submitting={submitting}
              submitError={submitError}
              successMessage={successMessage}
              reviewerName={reviewData?.reviewerName || ''}
              jobTitleEn={reviewData?.jobTitleEn    || ''}
              jobTitleFr={reviewData?.jobTitleFr    || ''}
              userInitial={userInitial}
              errors={errors}
              shouldShowPositionId={shouldShowPositionId}
              onDecisionChange={onDecisionChange}
              onCommentChange={onCommentChange}
              onConfirmChange={onConfirmChange}
              onPositionChange={onPositionChange}
              onViewComments={onViewComments}
              onClose={onClose}
              submitDeps={submitDeps}
              roleId={currentRoleId}
            />
          </main>
        </div>
      </motion.div>

      <CommentsModal
        open={showComments}
        loading={commentsLoading}
        level1={safeLevel1}
        level2={safeLevel2}
        onClose={onCloseComments}
      />
    </div>
  );
};

export default CandidateReviewModal;