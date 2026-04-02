import * as React from 'react';
import type { Answer, InterviewQuestion } from '../State/CommonStateManagement';
import styles from './InterviewQuestion.module.scss';

interface InterviewQuestionListProps {
  questions: InterviewQuestion[];
  answers: Record<number, Answer>;
  ratingErrors?: Record<number, boolean>;
  onAnswerChange: (questionId: number, patch: Partial<Answer>) => void;
}

const ScoreRating = [
  { key: 1, text: 'Not Acceptable' },
  { key: 2, text: 'Acceptable' },
  { key: 3, text: 'Excellent' },
];

function cleanHTML(text: string = ''): string {
  return text
    .replace(/<p>/gi, '')
    .replace(/<\/p>/gi, '')
    .replace(/<br\s*\/?>/gi, '')
    .trim();
}

export default function InterviewQuestionList({
  questions,
  answers,
  ratingErrors,
  onAnswerChange,
}: InterviewQuestionListProps): JSX.Element {
  if (!questions.length) return <></>;

  return (
    <section>
      {/* Section header */}
      <div className={styles.sectionTitle}>
        <div className={styles.sectionAccentOrange} />
        <div>
          <h2 className={styles.sectionH2}>INTERVIEW QUESTIONNAIRES</h2>
          <p className={styles.sectionSub}>Technical &amp; Behavioral Assessment</p>
        </div>
        <div className={styles.ratingGuide}>
          <span className={styles.ratingGuideLabel}>RATING GUIDE:</span>
          <span className={`${styles.dot} ${styles.dotGreen}`} />
          <span className={styles.guideItem}>3 - <b>Excellent</b></span>
          <span className={`${styles.dot} ${styles.dotBlue}`} />
          <span className={styles.guideItem}>2 - <b>Acceptable</b></span>
          <span className={`${styles.dot} ${styles.dotRed}`} />
          <span className={styles.guideItem}>1 - <b>Not Acceptable</b></span>
        </div>
      </div>

      {questions.map((question, idx) => {
        const answer = answers[question.id];
        const questionHasError = answer?.rating === null || answer?.rating === undefined;
        const showError = ratingErrors?.[question.id] || (questionHasError && Object.keys(ratingErrors || {}).length > 0);

        return (
          <div
            key={question.id}
            className={[styles.qCard, showError ? styles.qCardError : ''].filter(Boolean).join(' ')}
          >
            {/* Question text */}
            <div className={styles.qTop}>
              <span className={styles.qBadge}>Q{idx + 1}</span>
              <p
                className={styles.qText}
                dangerouslySetInnerHTML={{ __html: cleanHTML(question.text) }}
              />
            </div>
            {/* Expected response guide */}
            {question.expectedResponse && (
              <div className={styles.guideBox}>
                <div className={styles.guideBoxHeader}>
                  <span className={styles.guideCheck}>✅</span>
                  <span className={styles.guideBoxLabel}>EXPECTED RESPONSE GUIDE</span>
                  <span className={styles.guideBoxIcon}>📋</span>
                </div>
                <p
                  className={styles.guideBoxText}
                  dangerouslySetInnerHTML={{ __html: cleanHTML(question.expectedResponse) }}
                />
              </div>
            )}

            {/* Rating + score */}
            <div className={styles.qBottom}>
              <div>
                <p className={styles.panelRatingLabel}>
                  PANEL RATING <span className={styles.req}>*</span>
                </p>
                <div className={styles.ratingBtnRow}>
                  {ScoreRating.map(({ key, text }) => {
                    const active = answer?.rating === key;
                    const btnClass = [
                      styles.ratingBtn,
                      active && key === 3 ? styles.ratingExcellent     : '',
                      active && key === 2 ? styles.ratingAcceptable    : '',
                      active && key === 1 ? styles.ratingNotAcceptable : '',
                    ].filter(Boolean).join(' ');

                    return (
                      <button
                        key={key}
                        className={btnClass}
                        onClick={() => onAnswerChange(question.id, { rating: key })}
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
                  {answer?.rating ?? 0}
                  <span className={styles.scoreMax}>/3</span>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}