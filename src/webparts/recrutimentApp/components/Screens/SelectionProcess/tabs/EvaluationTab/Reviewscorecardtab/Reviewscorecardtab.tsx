
import * as React from "react";
import { AnimatePresence } from "framer-motion";
import styles from "./Reviewscorecardtab.module.scss";
import JobListTable from "./components/Joblisttable";
import { isLevel2, useReviewScorecard } from "./hooks/UseReviewScorecard";
import { useRoleContext } from "../../../../../../utilities/hooks/RoleContext";
import CandidateDrawer from "./components/Candidatedrawer";
import CandidateReviewModal from "./components/Candidatereviewmodal";

interface Props {
  employeeList:       any[];
  userDetails?:       any[];
  CurrentUserEmailId: string;
  onFormStateChange?: (isOpen: boolean) => void;
}

const ReviewScorecardTab: React.FC<Props> = ({
  CurrentUserEmailId, onFormStateChange,
}) => {
  const { ADGroupData }   = useRoleContext();
  const effectiveEmail    = CurrentUserEmailId || ADGroupData?.EmailId?.[0] || "";
  const currentRoleId     = ADGroupData?.roleIDs?.[0] || 0;

  const hook = useReviewScorecard(effectiveEmail);

  React.useEffect(() => {
    onFormStateChange?.(!!hook.reviewingCandidate);
  }, [hook.reviewingCandidate, onFormStateChange]);

  return (
    <div className={styles.container}>
      <JobListTable
        jobRows={hook.paginatedJobs}
        totalItems={hook.filteredJobs.length}
        currentPage={hook.currentPage}
        totalPages={hook.totalPages}
        pageSize={hook.pageSize}
        onPageChange={hook.setCurrentPage}
        onPageSizeChange={(s) => { hook.setPageSize(s); hook.setCurrentPage(1); }}
        searchTerm={hook.searchTerm}
        onSearch={(v) => { hook.setSearchTerm(v); hook.setCurrentPage(1); }}
        onSelectJob={hook.openJob}
        loading={hook.jobsLoading}
      />


      <AnimatePresence>
        {hook.drawerOpen && hook.selectedJob && (
          <CandidateDrawer
            job={hook.selectedJob}
            candidates={hook.candidates}
            loading={hook.candidatesLoading}
            onClose={hook.closeJob}
            onReview={hook.openReview}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hook.reviewingCandidate && (
          <CandidateReviewModal
            candidate={hook.reviewingCandidate}
            reviewData={hook.reviewData}
            reviewLoading={hook.reviewLoading}
            job={hook.selectedJob}
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
            isLevel2Status={isLevel2(hook.reviewingCandidate.statusId)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewScorecardTab;