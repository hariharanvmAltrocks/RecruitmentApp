import React, { useEffect } from 'react';
import { ReviewScoreCardProvider, useReviewScoreCard } from './State/ReviewScorecardState';
import CandidateDrawer from './Components/CandidateDrawer';
import QuestionnaireTab from './Components/QuestionnaireTab';
import ScorecardDetails from './Components/ScorecardDetails';
import HODDecisionPanel from './Components/HODDecisionPanel';
import styles from './ReviewScorecard.module.scss';
import { userInfo } from '../../../utilities/hooks/RoleContext';

interface ReviewScoreCardProps {
    candidateId: number;
    isOpen: boolean;
    onClose: () => void;
}

const ReviewScoreCardContent: React.FC<ReviewScoreCardProps> = ({
    candidateId,
    isOpen,
    onClose
}) => {
    const { ADGroupData } = userInfo();
    const currentUserEmail = ADGroupData?.EmailId?.[0] ?? '';
    console.log('ReviewScoreCard props:', { candidateId, isOpen });
    const { state, loadReviewScoreCardData } = useReviewScoreCard();
    console.log('ReviewScoreCard state:', state);

    useEffect(() => {
        if (isOpen && candidateId && currentUserEmail) {
            console.log('Loading review scorecard data for:', candidateId, currentUserEmail);
            loadReviewScoreCardData(candidateId, currentUserEmail);
        }
    }, [isOpen, candidateId, currentUserEmail, loadReviewScoreCardData]);

    if (!isOpen) return null;

    return (
        <CandidateDrawer
            isOpen={isOpen}
            onClose={onClose}
            candidateData={state.data}
            loading={state.loading}
            error={state.error}
        >
            {state.data && (
                <div className={styles.tabsContainer}>
                    <QuestionnaireTab questions={state.data.questions} />
                    <ScorecardDetails
                        scorecard={state.data.scorecard}
                        level2Scorecard={state.data.level2Scorecard}
                        interviewLevel={state.data.interviewLevel}
                    />
                    <HODDecisionPanel hodDecision={state.data.hodDecision} />
                </div>
            )}
        </CandidateDrawer>
    );
};

const ReviewScoreCard: React.FC<ReviewScoreCardProps> = (props) => {
    console.log('ReviewScoreCard component rendered with props:', props);
    return (
        <ReviewScoreCardProvider>
            <ReviewScoreCardContent {...props} />
        </ReviewScoreCardProvider>
    );
};

export default ReviewScoreCard;