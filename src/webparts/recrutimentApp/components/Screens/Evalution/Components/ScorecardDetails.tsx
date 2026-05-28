import * as React from 'react';
import type {
  ScorecardField,
  Recommendation,
  Candidate,
} from '../State/CommonStateManagement';

import styles from './ScorecardDetails.module.scss';
import { NationalityCode } from '../../../../utilities/ConditionConfig';
import * as strings from 'RecrutimentAppWebPartStrings';

const BASE_SCORECARD_FIELDS: {
  key: keyof ScorecardField;
  isDynamic?: boolean;
  label: string;
  icon: string;
}[] = [
  { key: 'Qualifications',  label: strings.QualificationsRelevant,           icon: '📄' },
  { key: 'Experience',      label: strings.ExperienceRelevant,               icon: '📈' },
  { key: 'Knowledge',       label: 'KNOWLEDGE',                         icon: '🧩' },
  { key: 'EnergyLevel',     label: strings.EnergyLevel,                      icon: '⚡' },
  { key: 'JobRequirements', label: strings.MeetsJobRequirements,            icon: '⏱' },
  { key: 'CultureFit',      label: strings.WillContributeCultureRequired,  icon: '👥' },
  { key: 'ExpatLocal',      label: strings.ExpatExperience, isDynamic: true, icon: '🌐' },
  { key: 'OtherCriteria',   label: strings.OtherCriteriaRecognisedByPanel,icon: '📄' },
];

const SCORE_OPTIONS = [1, 2, 3, 4, 5];
const SCORE_LABELS: Record<number, string> = {
  1: 'Poor', 2: strings.BelowAvg, 3: 'Average', 4: 'Good', 5: 'Excellent',
};

interface ScorecardDetailsProps {
  scorecard:         ScorecardField;
  scorecardErrors:   Record<string, boolean>;
  onScorecardChange: (key: keyof ScorecardField, value: number) => void;

  recommendation:         Recommendation;
  recError:               boolean;
  onRecommendationChange: (r: Recommendation) => void;

  overallFeedback:  string;
  feedbackError:    boolean;
  onFeedbackChange: (v: string) => void;

  evaluationFeedback:   string;
  evalFeedbackError:    boolean;
  onEvalFeedbackChange: (v: string) => void;

  acknowledged:        boolean;
  ackError:            boolean;
  onAcknowledgedChange:(b: boolean) => void;

  candidate: Candidate | null;
}

export default function ScorecardDetails({
  scorecard, scorecardErrors, onScorecardChange,
  recommendation, recError, onRecommendationChange,
  overallFeedback, feedbackError, onFeedbackChange,
  evaluationFeedback, evalFeedbackError, onEvalFeedbackChange,
  acknowledged, ackError, onAcknowledgedChange,
  candidate,
}: ScorecardDetailsProps): JSX.Element {
  const reviewerName = candidate?.reviewerName || '';
  const jobTitleEn   = candidate?.jobTitleEn   || '';
  const jobTitleFr   = candidate?.jobTitleFr   || '';
  const userInitial  = (reviewerName || 'J').charAt(0).toUpperCase();

  const expatLocalLabel =
    candidate?.nationalityCode === NationalityCode.Nationals
      ? strings.CongoleseExperience
      : 'EXPAT EXPERIENCE';
  const shouldShowEvalFeedback = Object.values(scorecard).some(
    (v) => v !== null && Number(v) <= 2
  );

  return (
    <section>
      <div className={styles.sectionTitle}>
        <div className={styles.sectionAccentGreen} />
        <div>
          <h2 className={styles.sectionH2}>{strings.ScorecardDetails}</h2>
          <p className={styles.sectionSub}>{strings.CoreCompetencyAssessment15Scale}</p>
        </div>
        <div className={styles.scaleLegend}>
          {SCORE_OPTIONS.map((n) => (
            <span key={n} className={styles.scaleLegendItem}>
              <b>{n}</b> {SCORE_LABELS[n]}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.scorecardCard}>
        <div className={styles.scorecardGrid}>
          {BASE_SCORECARD_FIELDS.map((field) => {
            const label    = field.isDynamic ? expatLocalLabel : field.label;
            const hasError = !!scorecardErrors[field.key];
            return (
              <div key={field.key} className={styles.scorecardField}>
                <p className={[styles.fieldLabel, hasError ? styles.errLabel : ''].filter(Boolean).join(' ')}>
                  {field.icon} {label} <span className={styles.req}>*</span>
                  {hasError && <span className={styles.fieldErrMsg}> {strings.Required1}</span>}
                </p>
                <div className={styles.btnRow}>
                  {SCORE_OPTIONS.map((n) => (
                    <button
                      key={n}
                      title={SCORE_LABELS[n]}
                      className={[
                        styles.scoreBtn,
                        scorecard[field.key] === n ? styles.scoreBtnActive : '',
                      ].filter(Boolean).join(' ')}
                      onClick={() => onScorecardChange(field.key, n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {shouldShowEvalFeedback && (
          <div className={styles.evalFeedbackBox}>
            <p className={[styles.fieldLabel, evalFeedbackError ? styles.errLabel : ''].filter(Boolean).join(' ')}>
              {strings.FeedbackRequiredRatingsBelow3}{' '}
              <span className={styles.req}>*</span>
              {evalFeedbackError && <span className={styles.fieldErrMsg}> — Required</span>}
            </p>
            <textarea
              className={[styles.textArea, evalFeedbackError ? styles.inputErr : ''].filter(Boolean).join(' ')}
              rows={3}
              value={evaluationFeedback}
              onChange={(e) => onEvalFeedbackChange(e.target.value)}
              placeholder={strings.PleaseProvideFeedbackExplainingRatingsBe}
            />
          </div>
        )}

        {/* Consider for Employment + Overall Feedback */}
        <div className={styles.recRow}>
          <div className={styles.recLeft}>
            <p className={[styles.fieldLabel, recError ? styles.errLabel : ''].filter(Boolean).join(' ')}>
              {strings.ConsiderForEmployment}<span className={styles.req}>*</span>
              {recError && <span className={styles.fieldErrMsg}> — Required</span>}
            </p>
            <div className={styles.recBtnRow}>
              <button
                className={[styles.recBtn, recommendation === 'consider' ? styles.recBtnYes : ''].filter(Boolean).join(' ')}
                onClick={() => onRecommendationChange('consider')}
              >
                {recommendation === 'consider' ? strings.Yes : 'Yes'}
              </button>
              <button
                className={[styles.recBtn, recommendation === 'doNotConsider' ? styles.recBtnNo : ''].filter(Boolean).join(' ')}
                onClick={() => onRecommendationChange('doNotConsider')}
              >
                {recommendation === 'doNotConsider' ? strings.No : 'No'}
              </button>
            </div>
          </div>

          <div className={styles.recRight}>
            <p className={[styles.fieldLabel, feedbackError ? styles.errLabel : ''].filter(Boolean).join(' ')}>
              {strings.OverallEvaluationFeedback}<span className={styles.req}>*</span>
              {feedbackError && <span className={styles.fieldErrMsg}> — Required</span>}
            </p>
            <textarea
              className={[styles.textArea, feedbackError ? styles.inputErr : ''].filter(Boolean).join(' ')}
              rows={4}
              value={overallFeedback}
              onChange={(e) => onFeedbackChange(e.target.value)}
              placeholder={strings.EnterYourOverallEvaluationFeedbackHere}
            />
          </div>
        </div>

        {/* Acknowledgement + Reviewer signature */}
        <div className={[styles.ackBox, ackError ? styles.ackBoxErr : ''].filter(Boolean).join(' ')}>
          <label className={styles.ackRow}>
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => onAcknowledgedChange(e.target.checked)}
              className={styles.ackChk}
            />
            <span className={styles.ackText}>
              {strings.IHerebyAcknowledgeThatIHaveCompletedTheC}</span>
          </label>

          <div className={styles.reviewerCard}>
            <div className={styles.reviewerAvatar}>{userInitial}</div>
            <div className={styles.reviewerInfo}>
              <div className={styles.reviewerCol}>
                <p className={styles.reviewerMeta}>{strings.ReviewerName1}</p>
                <p className={styles.reviewerVal}>{reviewerName}</p>
              </div>
              <div className={styles.reviewerCol}>
                <p className={styles.reviewerMeta}>{strings.JobTitleEn1}</p>
                <p className={styles.reviewerVal}>{jobTitleEn}</p>
                <p className={styles.reviewerMeta} style={{ marginTop: 12 }}>{strings.JobTitleFr1}</p>
                <p className={styles.reviewerVal}>{jobTitleFr}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}