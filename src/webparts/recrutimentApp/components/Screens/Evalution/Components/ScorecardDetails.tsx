import * as React from 'react';
import type {
  ScorecardField,
  Recommendation,
  Candidate,
} from '../State/CommonStateManagement';
import styles from './ScorecardDetails.module.scss';

const SCORECARD_FIELDS: {
  key: keyof ScorecardField;
  label: string;
  icon: string;
}[] = [
  { key: 'Qualifications', label: 'QUALIFICATIONS',  icon: '📄' },
  { key: 'Experience',     label: 'EXPERIENCE',       icon: '📈' },
  { key: 'Knowledge',      label: 'KNOWLEDGE',        icon: '🧩' },
  { key: 'EnergyLevel',    label: 'ENERGY LEVEL',     icon: '⚡' },
  { key: 'JobRequirements',label: 'JOB REQUIREMENTS', icon: '⏱' },
  { key: 'CultureFit',     label: 'CULTURE FIT',      icon: '👥' },
  { key: 'ExpatLocal',     label: 'EXPAT/LOCAL',       icon: '🌐' },
  { key: 'OtherCriteria',  label: 'OTHER CRITERIA',   icon: '📄' },
];

interface ScorecardDetailsProps {
  scorecard:        ScorecardField;
  scorecardErrors:  Record<string, boolean>;
  onScorecardChange: (key: keyof ScorecardField, value: number) => void;

  recommendation:   Recommendation;
  recError:         boolean;
  onRecommendationChange: (r: Recommendation) => void;

  overallFeedback:  string;
  feedbackError:    boolean;
  onFeedbackChange: (v: string) => void;

  acknowledged:     boolean;
  ackError:         boolean;
  onAcknowledgedChange: (b: boolean) => void;

  candidate:        Candidate | null;
}

export default function ScorecardDetails({
  scorecard,
  scorecardErrors,
  onScorecardChange,
  recommendation,
  recError,
  onRecommendationChange,
  overallFeedback,
  feedbackError,
  onFeedbackChange,
  acknowledged,
  ackError,
  onAcknowledgedChange,
  candidate,
}: ScorecardDetailsProps): JSX.Element {
  const reviewerName  = candidate?.reviewerName  || '';
  const jobTitleEn    = candidate?.jobTitleEn    || '';
  const jobTitleFr    = candidate?.jobTitleFr    || '';
  const userInitial   = (reviewerName || 'J').charAt(0).toUpperCase();

  return (
    <section>
      {/* Section header */}
      <div className={styles.sectionTitle}>
        <div className={styles.sectionAccentGreen} />
        <div>
          <h2 className={styles.sectionH2}>SCORECARD DETAILS</h2>
          <p className={styles.sectionSub}>Core Competency Assessment (1–5 Scale)</p>
        </div>
      </div>

      <div className={styles.scorecardCard}>
        {/* 2-column grid of 8 criteria */}
        <div className={styles.scorecardGrid}>
          {SCORECARD_FIELDS.map((field) => (
            <div key={field.key} className={styles.scorecardField}>
              <p
                className={[
                  styles.scorecardFieldLabel,
                  scorecardErrors[field.key] ? styles.errLabel : '',
                ].filter(Boolean).join(' ')}
              >
                {field.icon} {field.label} <span className={styles.req}>*</span>
                {scorecardErrors[field.key] && (
                  <span className={styles.fieldErr}> — Required</span>
                )}
              </p>
              <div className={styles.fiveRow}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    className={[
                      styles.fiveBtn,
                      scorecard[field.key] === n ? styles.fiveBtnActive : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => onScorecardChange(field.key, n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Recommendation + Overall Feedback */}
        <div className={styles.recRow}>
          <div className={styles.recLeft}>
            <p
              className={[
                styles.scorecardFieldLabel,
                recError ? styles.errLabel : '',
              ].filter(Boolean).join(' ')}
            >
              RECOMMENDATION <span className={styles.req}>*</span>
              {recError && <span className={styles.fieldErr}> — Required</span>}
            </p>
            <div className={styles.recBtnRow}>
              <button
                className={[
                  styles.recBtn,
                  recommendation === 'consider' ? styles.recBtnActive : '',
                ].filter(Boolean).join(' ')}
                onClick={() => onRecommendationChange('consider')}
              >
                {recommendation === 'consider' && <span style={{ fontSize: 14 }}>✅</span>}
                Consider for Employment
              </button>
              <button
                className={[
                  styles.recBtn,
                  recommendation === 'doNotConsider' ? styles.recBtnDeny : '',
                ].filter(Boolean).join(' ')}
                onClick={() => onRecommendationChange('doNotConsider')}
              >
                ✕ Do Not Consider
              </button>
            </div>
          </div>

          <div className={styles.recRight}>
            <p
              className={[
                styles.scorecardFieldLabel,
                feedbackError ? styles.errLabel : '',
              ].filter(Boolean).join(' ')}
            >
              OVERALL EVALUATION FEEDBACK <span className={styles.req}>*</span>
              {feedbackError && <span className={styles.fieldErr}> — Required</span>}
            </p>
            <textarea
              className={[
                styles.feedbackArea,
                feedbackError ? styles.inputErr : '',
              ].filter(Boolean).join(' ')}
              rows={4}
              value={overallFeedback}
              onChange={(e) => onFeedbackChange(e.target.value)}
              placeholder="Enter your overall evaluation feedback here…"
            />
          </div>
        </div>

        {/* Acknowledgement + Reviewer card */}
        <div
          className={[styles.ackBox, ackError ? styles.ackBoxErr : ''].filter(Boolean).join(' ')}
        >
          <label className={styles.ackRow}>
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => onAcknowledgedChange(e.target.checked)}
              className={styles.ackChk}
            />
            <span className={styles.ackText}>
              I hereby acknowledge that I have completed the candidate evaluation and scorecard
              entry, and I confirm that the scores and feedback provided are accurate.
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
  );
}