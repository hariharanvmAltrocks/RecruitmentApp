import React from 'react';
import styles from '../ReviewScorecard.module.scss';

interface ScorecardDetailsProps {
    scorecard: any;
    level2Scorecard: any;
    interviewLevel: string;
}

const ScorecardDetails: React.FC<ScorecardDetailsProps> = ({
    scorecard,
    level2Scorecard,
    interviewLevel
}) => {
    const isLevel2 = interviewLevel?.toLowerCase().includes('level 2') || interviewLevel === '2';

    const currentScorecard = isLevel2 ? level2Scorecard : scorecard;

    if (!currentScorecard) {
        return (
            <div className={styles.scorecardSection}>
                <h3>{isLevel2 ? 'Level 2 Scorecard' : 'Level 1 Scorecard'}</h3>
                <p>No scorecard data available.</p>
            </div>
        );
    }

    return (
        <div className={styles.scorecardSection}>
            <h3>{isLevel2 ? 'Level 2 Scorecard' : 'Level 1 Scorecard'}</h3>

            <div className={styles.scorecardGrid}>
                <div className={styles.scoreItem}>
                    <label>Qualifications:</label>
                    <span>{currentScorecard.RelevantQualification || 'N/A'}</span>
                </div>

                <div className={styles.scoreItem}>
                    <label>Experience:</label>
                    <span>{currentScorecard.ReleventExperience || 'N/A'}</span>
                </div>

                <div className={styles.scoreItem}>
                    <label>Knowledge:</label>
                    <span>{currentScorecard.Knowledge || 'N/A'}</span>
                </div>

                <div className={styles.scoreItem}>
                    <label>Energy Level:</label>
                    <span>{currentScorecard.EnergyLevel || 'N/A'}</span>
                </div>

                <div className={styles.scoreItem}>
                    <label>Job Requirements:</label>
                    <span>{currentScorecard.MeetJobRequirement || 'N/A'}</span>
                </div>

                <div className={styles.scoreItem}>
                    <label>Culture Fit:</label>
                    <span>{currentScorecard.ContributeTowardsCultureRequried || 'N/A'}</span>
                </div>

                <div className={styles.scoreItem}>
                    <label>Expat/Local:</label>
                    <span>{currentScorecard.Experience || 'N/A'}</span>
                </div>

                <div className={styles.scoreItem}>
                    <label>Other Criteria:</label>
                    <span>{currentScorecard.OtherCriteriaScore || 'N/A'}</span>
                </div>

                <div className={styles.scoreItem}>
                    <label>Recommendation:</label>
                    <span>{currentScorecard.ConsiderForEmployment || 'N/A'}</span>
                </div>

                <div className={styles.feedbackItem}>
                    <label>Overall Feedback:</label>
                    <p>{currentScorecard.OverAllEvaluationFeedback || 'No feedback provided'}</p>
                </div>
            </div>

            {currentScorecard.QuestionJson && (
                <div className={styles.questionnaireSection}>
                    <h4>Question Ratings</h4>
                    <div className={styles.questionsList}>
                        {JSON.parse(currentScorecard.QuestionJson || '[]').map((q: any, index: number) => (
                            <div key={index} className={styles.questionItem}>
                                <span>Question {q.id}:</span>
                                <span>Rating {q.rating || 'N/A'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScorecardDetails;