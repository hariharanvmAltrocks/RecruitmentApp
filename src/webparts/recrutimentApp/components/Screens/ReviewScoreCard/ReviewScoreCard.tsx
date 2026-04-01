// ReviewScoreCard.tsx
// Main entry point. Route passes recruitmentId via props or router state.
// Renders:
//   1. CandidateDrawer  — always visible, shows candidates for recruitmentId
//   2. CandidateReviewModal — opens when a candidate is clicked (pencil/eye)
//
// All state lives in ReviewScoreCardProvider (via useReviewScorecard hook).

import React from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ReviewScoreCardProvider, useReviewScoreCardContext } from './State/ReviewScoreCardProvider';
import CandidateDrawer     from './Components/CandidateDrawer';
import CandidateReviewModal from './Components/CandidateReviewModal';
import { useRoleContext }  from '../../../utilities/hooks/RoleContext';

interface ReviewScoreCardProps {
  recruitmentId?: number;
  [key: string]:  any;
}

// ── Inner content (has access to context) ─────────────────────────────────────
const ReviewScoreCardContent: React.FC = () => {
  const { ADGroupData }  = useRoleContext();
  const currentRoleId    = ADGroupData?.roleIDs?.[0] || 0;

  const hook = useReviewScoreCardContext();

  return (
    <div>
      {/* ── Candidate Drawer ── */}
      <AnimatePresence>
        {hook.drawerOpen && (
          <CandidateDrawer
            candidates={hook.paginatedCandidates}
            loading={hook.candidatesLoading}
            onClose={() => { /* drawer stays open — no close needed for main view */ }}
            onReview={hook.openReview}
            recruitmentId={hook.recruitmentId}
          />
        )}
      </AnimatePresence>

      {/* ── Review Modal ── */}
      <AnimatePresence>
        {hook.reviewingCandidate && (
          <CandidateReviewModal
            candidate={hook.reviewingCandidate}
            reviewData={hook.reviewData}
            reviewLoading={hook.reviewLoading}
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

// ── Public export with Provider wrapper ───────────────────────────────────────
const ReviewScoreCard: React.FC<ReviewScoreCardProps> = ({ recruitmentId }) => {
  const location = useLocation();
  const routeState = location.state as {
    recruitmentId?: number;
    ID?:            number;
    candidateId?:   number;
    department?:    string;
  } | undefined;

  const effectiveRecruitmentId = Number(
    recruitmentId ?? routeState?.recruitmentId ?? routeState?.ID ?? 0
  );
  const departmentFromRoute = routeState?.department || '';

  console.log('[ReviewScoreCard] recruitmentId:', effectiveRecruitmentId, 'routeState:', routeState);

  const { ADGroupData } = useRoleContext();
  const currentUserEmail = ADGroupData?.EmailId?.[0] || '';
  return (
    <ReviewScoreCardProvider
      recruitmentId={effectiveRecruitmentId}
      currentUserEmail={currentUserEmail}
      department={departmentFromRoute}
    >
      <ReviewScoreCardContent />
    </ReviewScoreCardProvider>
  );
};

export default ReviewScoreCard;