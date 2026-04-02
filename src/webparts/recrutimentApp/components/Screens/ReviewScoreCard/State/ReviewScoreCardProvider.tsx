
import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';
import { useReviewScorecard } from '../Hooks/useReviewScorecard';
import { ScorecardCandidateRow, HODDecision, CommentEntry, PositionOption, CandidateReviewData } from './types';
type ErrorsType = { decision: boolean; comment: boolean; checkbox: boolean; position: boolean };
interface ReviewScoreCardProviderProps {
  recruitmentId:    number;
  currentUserEmail: string;
  department?:      string;
  children:         React.ReactNode;
}
interface ReviewScoreCardContextType {
  recruitmentId:        number;
  candidates:           ScorecardCandidateRow[];
  candidatesLoading:    boolean;
  paginatedCandidates:  ScorecardCandidateRow[];
  filteredCandidates:   ScorecardCandidateRow[];
  currentPage:          number;
  setCurrentPage:       Dispatch<SetStateAction<number>>;
  pageSize:             number;
  setPageSize:          Dispatch<SetStateAction<number>>;
  searchTerm:           string;
  setSearchTerm:        Dispatch<SetStateAction<string>>;
  totalPages:           number;
  loadCandidates:       () => Promise<void>;
  drawerOpen:           boolean;
  refreshCandidates:    () => Promise<void>;

  reviewingCandidate:   ScorecardCandidateRow | null;
  reviewData:           CandidateReviewData | null;
  reviewLoading:        boolean;
  scoreData:            any[];
  scoreLoading:         boolean;
  openReview:           (candidate: ScorecardCandidateRow) => Promise<void>;
  closeReview:          () => void;

  showComments:         boolean;
  level1Comments:       CommentEntry[];
  level2Comments:       CommentEntry[];
  commentsLoading:      boolean;
  openComments:         () => Promise<void>;
  setShowComments:      Dispatch<SetStateAction<boolean>>;

  hodDecision:          HODDecision;
  setHodDecision:       Dispatch<SetStateAction<HODDecision>>;
  decisionComment:      string;
  setDecisionComment:   Dispatch<SetStateAction<string>>;
  confirmed:            boolean;
  setConfirmed:         Dispatch<SetStateAction<boolean>>;
  selectedPositionId:   number | null;
  setSelectedPositionId:Dispatch<SetStateAction<number | null>>;
  selectedPositionText: string;
  setSelectedPositionText: Dispatch<SetStateAction<string>>;
  positionOptions:      PositionOption[];
  submitting:           boolean;
  submitError:          string;
  successMessage:       string;
  errors:               ErrorsType;
  setErrors:            Dispatch<SetStateAction<ErrorsType>>;
  shouldShowPositionId: (statusId: number, decision: HODDecision) => boolean;
  submitDecision:       (roleId: number) => Promise<void>;
  isLevel2:             (statusId: number) => boolean;
}

const ReviewScoreCardContext = React.createContext<ReviewScoreCardContextType | null>(null);

export const useReviewScoreCardContext = (): ReviewScoreCardContextType => {
  const ctx = React.useContext(ReviewScoreCardContext);
  if (!ctx) throw new Error('useReviewScoreCardContext must be used within ReviewScoreCardProvider');
  return ctx;
};

export const ReviewScoreCardProvider: React.FC<ReviewScoreCardProviderProps> = ({
  recruitmentId, currentUserEmail, department, children,
}) => {
  const hook = useReviewScorecard(recruitmentId, currentUserEmail, department);

  const value: ReviewScoreCardContextType = {
    recruitmentId,
    candidates:           hook.candidates,
    candidatesLoading:    hook.candidatesLoading,
    paginatedCandidates:  hook.paginatedCandidates,
    filteredCandidates:   hook.filteredCandidates,
    currentPage:          hook.currentPage,
    setCurrentPage:       hook.setCurrentPage,
    pageSize:             hook.pageSize,
    setPageSize:          hook.setPageSize,
    searchTerm:           hook.searchTerm,
    setSearchTerm:        hook.setSearchTerm,
    totalPages:           hook.totalPages,
    loadCandidates:       hook.loadCandidates,
    drawerOpen:           hook.drawerOpen,
    refreshCandidates:    hook.refreshCandidates,

    reviewingCandidate:   hook.reviewingCandidate,
    reviewData:           hook.reviewData,
    reviewLoading:        hook.reviewLoading,
    scoreData:            hook.scoreData,
    scoreLoading:         hook.scoreLoading,
    openReview:           hook.openReview,
    closeReview:          hook.closeReview,

    showComments:         hook.showComments,
    level1Comments:       hook.level1Comments,
    level2Comments:       hook.level2Comments,
    commentsLoading:      hook.commentsLoading,
    openComments:         hook.openComments,
    setShowComments:      hook.setShowComments,

    hodDecision:          hook.hodDecision,
    setHodDecision:       hook.setHodDecision,
    decisionComment:      hook.decisionComment,
    setDecisionComment:   hook.setDecisionComment,
    confirmed:            hook.confirmed,
    setConfirmed:         hook.setConfirmed,
    selectedPositionId:   hook.selectedPositionId,
    setSelectedPositionId:hook.setSelectedPositionId,
    selectedPositionText: hook.selectedPositionText,
    setSelectedPositionText: hook.setSelectedPositionText,
    positionOptions:      hook.positionOptions,
    submitting:           hook.submitting,
    submitError:          hook.submitError,
    successMessage:       hook.successMessage,
    errors:               hook.errors,
    setErrors:            hook.setErrors,
    shouldShowPositionId: hook.shouldShowPositionId,
    submitDecision:       hook.submitDecision,
    isLevel2:             hook.isLevel2,
  };

  return (
    <ReviewScoreCardContext.Provider value={value}>
      {children}
    </ReviewScoreCardContext.Provider>
  );
};