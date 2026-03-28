import React from 'react';
import { ReviewScoreCardResult } from '../ReviewScoreCardServies/ReviewScoreCardServices';
import styles from '../ReviewScorecard.module.scss';

interface CandidateDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    candidateData: ReviewScoreCardResult | null;
    loading: boolean;
    error: string | null;
    children: React.ReactNode;
}

const CandidateDrawer: React.FC<CandidateDrawerProps> = ({
    isOpen,
    onClose,
    candidateData,
    loading,
    error,
    children
}) => {
    if (!isOpen) return null;

    return (
        <div className={styles.drawerOverlay} onClick={onClose}>
            <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.drawerHeader}>
                    <h2>Candidate Review Scorecard</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                <div className={styles.drawerContent}>
                    {loading && <div className={styles.loading}>Loading...</div>}

                    {error && <div className={styles.error}>{error}</div>}

                    {candidateData && (
                        <div className={styles.candidateInfo}>
                            <h3>{candidateData.applicantName}</h3>
                            <div className={styles.infoGrid}>
                                <div><strong>Position:</strong> {candidateData.positionTitle}</div>
                                <div><strong>Grade:</strong> {candidateData.grade}</div>
                                <div><strong>Interview Level:</strong> {candidateData.interviewLevel}</div>
                                <div><strong>Interview Date:</strong> {candidateData.interviewDate}</div>
                            </div>

                            <div className={styles.panelMembers}>
                                <h4>Panel Members:</h4>
                                <ul>
                                    {candidateData.panelMembers.map((member, index) => (
                                        <li key={index}>
                                            {member.name} - {member.jobTitle} ({member.department})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {children}
                </div>
            </div>
        </div>
    );
};

export default CandidateDrawer;