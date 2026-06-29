import React from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import {
  ReviewScoreCardProvider,
  useReviewScoreCardContext,
} from "./State/ReviewScoreCardProvider";
import CandidateDrawer from "./Components/CandidateDrawer";
import CandidateReviewModal from "./Components/CandidateReviewModal";
import { useRoleContext } from "../../../utilities/hooks/RoleContext";

interface ReviewScoreCardProps {
  recruitmentId?: number;
  [key: string]: any;
}

const ReviewScoreCardContent: React.FC = () => {
  const { ADGroupData } = useRoleContext();
  const currentRoleId = ADGroupData?.roleIDs?.[0] || 0;
  const hook = useReviewScoreCardContext();

  return (
    <div>
      <AnimatePresence>
        {hook.drawerOpen && (
          <CandidateDrawer
            candidates={hook.paginatedCandidates}
            loading={hook.candidatesLoading}
            onClose={() => {}}
            onReview={hook.openReview}
            recruitmentId={hook.recruitmentId}
            hook={hook}
            currentRoleId={currentRoleId}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const ReviewScoreCard: React.FC<ReviewScoreCardProps> = ({ recruitmentId }) => {
  const location = useLocation();
  const routeState = location.state as
    | {
        recruitmentId?: number;
        ID?: number;
        candidateId?: number;
        department?: string;
      }
    | undefined;

  const effectiveRecruitmentId = Number(
    recruitmentId ?? routeState?.recruitmentId ?? routeState?.ID ?? 0,
  );
  const departmentFromRoute = routeState?.department || "";

  const { ADGroupData } = useRoleContext();
  const currentUserEmail = ADGroupData?.EmailId?.[0] || "";

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
