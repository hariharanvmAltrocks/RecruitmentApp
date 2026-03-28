import React from 'react';
import { ReviewScoreCardResult } from '../ReviewScoreCardServies/ReviewScoreCardServices';
import styles from '../ReviewScorecard.module.scss';

interface CandidateInfoProps {
    candidateData: ReviewScoreCardResult;
}

const CandidateInfo: React.FC<CandidateInfoProps> = ({ candidateData }) => {
    return (
        <div className={styles.candidateInfo}>
            <h3>{candidateData.applicantName}</h3>
            <div className={styles.infoGrid}>
                <div><strong>Nationality:</strong> {candidateData.nationality}</div>
                <div><strong>Gender:</strong> {candidateData.gender}</div>
                <div><strong>Qualification:</strong> {candidateData.qualification}</div>
                <div><strong>Mining Experience:</strong> {candidateData.miningExp}</div>
                <div><strong>Relevant Experience:</strong> {candidateData.relevantExp}</div>
                <div><strong>Disability:</strong> {candidateData.disability}</div>
                <div><strong>Conflicts of Interest:</strong> {candidateData.conflictsOfInterest}</div>
            </div>
        </div>
    );
};

export default CandidateInfo;