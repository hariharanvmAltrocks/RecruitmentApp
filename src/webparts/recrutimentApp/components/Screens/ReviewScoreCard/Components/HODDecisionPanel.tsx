import React from 'react';
import styles from '../ReviewScorecard.module.scss';

interface HODDecisionPanelProps {
    hodDecision: any;
}

const HODDecisionPanel: React.FC<HODDecisionPanelProps> = ({ hodDecision }) => {
    if (!hodDecision) {
        return (
            <div className={styles.hodSection}>
                <h3>HOD Decision</h3>
                <p>No HOD decision data available.</p>
            </div>
        );
    }

    return (
        <div className={styles.hodSection}>
            <h3>HOD Decision</h3>

            <div className={styles.hodDetails}>
                <div className={styles.hodItem}>
                    <label>Decision:</label>
                    <span>{hodDecision.Decision || 'N/A'}</span>
                </div>

                <div className={styles.hodItem}>
                    <label>Comments:</label>
                    <p>{hodDecision.Comments || 'No comments provided'}</p>
                </div>

                <div className={styles.hodItem}>
                    <label>Decision Date:</label>
                    <span>{hodDecision.DecisionDate ? new Date(hodDecision.DecisionDate).toLocaleDateString() : 'N/A'}</span>
                </div>

                <div className={styles.hodItem}>
                    <label>HOD Name:</label>
                    <span>{hodDecision.HODName || 'N/A'}</span>
                </div>
            </div>
        </div>
    );
};

export default HODDecisionPanel;