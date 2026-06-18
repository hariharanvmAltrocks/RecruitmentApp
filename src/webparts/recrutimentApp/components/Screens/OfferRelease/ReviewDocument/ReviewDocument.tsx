// ReviewDocument.tsx — conditions moved to config
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCandidatDetails } from "./Hooks/getCandidateDetails";
import { FileCheck, X } from "lucide-react";
import { ReviewDocumentInner } from "./Component/ReviewDocumentInner";

export interface ReviewDocumentProps {
  drawerOpen: boolean;
  selectedJobId: number | null;
  CandidateID: number;
  selectedcandidateID: number;
  IsExpat: boolean;
  jobrequestID: string;
  reviewerComments: string;
  acknowledgementCheckbox: boolean;
  loadingState: boolean;
  onClose: () => void;
  onCommentsChange: (value: string) => void;
  onToggleAcknowledgement: () => void;
  setLoadingState: (value: boolean) => void;
  refreshKey: () => void;
}

const SkeletonBlock: React.FC<{ width?: string; height?: string }> = ({
  width = "100%",
  height = "14px",
}) => <div className="review-document__skeleton" style={{ width, height }} />;

const PositionSkeleton = () => (
  <div className="review-document__skeleton-wrapper">
    <SkeletonBlock height="24px" width="250px" />
    <SkeletonBlock height="14px" width="180px" />
    <div style={{ marginTop: 16 }}>
      <SkeletonBlock height="100px" />
    </div>
    <div style={{ marginTop: 16 }}>
      <SkeletonBlock height="60px" />
    </div>
    <div style={{ marginTop: 16 }}>
      <SkeletonBlock height="40px" />
    </div>
  </div>
);


export const ReviewDocument: React.FC<ReviewDocumentProps> = (props) => {
  const {
    drawerOpen,
    selectedJobId,
    CandidateID,
    selectedcandidateID,
    jobrequestID,
    IsExpat,
    onClose,
  } = props;

  const { data: positionDetails, loading: positionLoading } =
    useCandidatDetails(
      selectedJobId,
      CandidateID,
      selectedcandidateID,
      jobrequestID,
      IsExpat,
    );

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <div className="review-document">
            <motion.div
              className="review-document__backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            <motion.div
              className="review-document__panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
                duration: 0.3,
              }}
            >
              {positionLoading || !positionDetails ? (
                <>
                  <div className="review-document__header">
                    <div className="review-document__header-left">
                      <div className="review-document__header-icon">
                        <FileCheck size={22} />
                      </div>
                      <div>
                        <h2 className="review-document__title">
                          <SkeletonBlock width="220px" />
                        </h2>
                        <div className="review-document__meta">
                          <SkeletonBlock width="160px" />
                        </div>
                      </div>
                    </div>
                    <div
                      className="review-document__header-right"
                      style={{ display: "flex", alignItems: "center", gap: "12px" }}
                    >
                      <button
                        type="button"
                        className="review-document__close"
                        onClick={onClose}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="review-document__content">
                    <PositionSkeleton />
                  </div>
                </>
              ) : (
                <ReviewDocumentInner
                  {...props}
                  positionDetails={positionDetails}
                />
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};




