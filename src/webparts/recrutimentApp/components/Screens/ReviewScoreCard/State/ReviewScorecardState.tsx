import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useRoleContext } from '../../../../utilities/hooks/RoleContext';
import { ReviewScoreCardProvider, useReviewScoreCardContext } from './ReviewScoreCardProvider';
import CandidateDrawer from '../Components/CandidateDrawer';
import CandidateReviewModal from '../Components/CandidateReviewModal';

const ReviewScoreCardContent: React.FC = () => {
    const { ADGroupData } = useRoleContext();
    const currentRoleId = ADGroupData?.roleIDs?.[0] || 0;
    const hook = useReviewScoreCardContext();

    return (
        <div>
            <CandidateDrawer
                candidates={hook.paginatedCandidates}
                loading={hook.candidatesLoading}
                onClose={() => {}}
                onReview={hook.openReview}
                recruitmentId={hook.recruitmentId}
            />

            <AnimatePresence>
                {hook.reviewingCandidate && (
                    <CandidateReviewModal
                        candidate={hook.reviewingCandidate}
                        reviewData={hook.reviewData}
                        reviewLoading={hook.reviewLoading}
                        job={null}
                        scoreData={hook.scoreData}
                        scoreLoading={hook.scoreLoading}
                        showComments={hook.showComments}
                        level1Comments={hook.level1Comments}
                        level2Comments={hook.level2Comments}
                        commentsLoading={hook.commentsLoading}
                        onViewComments={hook.openComments}
                        onCloseComments={() => hook.setShowComments(false)}
                        hodDecision={hook.hodDecision}
                        decisionComment={hook.decisionComment}
                        confirmed={hook.confirmed}
                        selectedPositionId={hook.selectedPositionId}
                        selectedPositionText={hook.selectedPositionText}
                        positionOptions={hook.positionOptions}
                        submitting={hook.submitting}
                        submitError={hook.submitError}
                        successMessage={hook.successMessage}
                        errors={hook.errors}
                        shouldShowPositionId={hook.shouldShowPositionId}
                        onDecisionChange={hook.setHodDecision}
                        onCommentChange={hook.setDecisionComment}
                        onConfirmChange={hook.setConfirmed}
                        onPositionChange={(id, text) => {
                            hook.setSelectedPositionId(id);
                            hook.setSelectedPositionText(text);
                            hook.setErrors({ ...hook.errors, position: false });
                        }}
                        onSubmit={hook.submitDecision}
                        onClose={hook.closeReview}
                        currentRoleId={currentRoleId}
                        isLevel2Status={hook.isLevel2(hook.reviewingCandidate.statusId)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const ReviewScoreCard: React.FC<any> = (props) => {
    const location = useLocation();

    // ID comes from location.state (navigated via navigate('/ReviewScoreCard', { state: { ID: 636 } }))
    // OR from props directly
    const locState = location.state as any;
    const recruitmentId = Number(
        locState?.ID ||
        locState?.recruitmentId ||
        locState?.RecruitmentID ||
        props?.ID ||
        props?.recruitmentId ||
        props?.RecruitmentID ||
        0
    );

    console.log('[ReviewScoreCard] recruitmentId resolved:', recruitmentId, 'from state:', locState, 'props:', props);

    const { ADGroupData } = useRoleContext();
    const currentUserEmail = ADGroupData?.EmailId?.[0] || '';

    if (!recruitmentId) {
        return (
            <div style={{ padding: 32, textAlign: 'center', color: '#b00020', fontSize: '1rem' }}>
                <strong>Recruitment ID is missing.</strong><br />
                Please open this page via the Review Score Card action button on the job row.
            </div>
        );
    }

    return (
        <ReviewScoreCardProvider recruitmentId={recruitmentId} currentUserEmail={currentUserEmail}>
            <ReviewScoreCardContent />
        </ReviewScoreCardProvider>
    );
};

export default ReviewScoreCard;