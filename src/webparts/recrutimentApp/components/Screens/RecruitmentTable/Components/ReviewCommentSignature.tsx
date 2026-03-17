import React from "react";
import { CheckCircle2, MessageSquare } from "lucide-react";
import "../RecruitmentTable.scss"
import { SignatureDetails } from "../AdvertReviewDrawer/Hooks/getSignatureDetails";


export interface ReviewCommentSignatureProps {
  reviewerComments: string;
  acknowledgementCheckbox: boolean;
  signatureDetails: SignatureDetails | null;
  isLoading: boolean;
  onCommentsChange: (value: string) => void;
  onToggleAcknowledgement: () => void;
}

const SkeletonBlock: React.FC<{ width?: string; height?: string }> = ({ width = "100%", height = "14px" }) => (
  <div className="advert-review-drawer__skeleton" style={{ width, height }} />
);

export const ReviewCommentSignature: React.FC<ReviewCommentSignatureProps> = ({
  reviewerComments,
  acknowledgementCheckbox,
  signatureDetails,
  isLoading,
  onCommentsChange,
  onToggleAcknowledgement,
}) => (
  <section className="advert-review-drawer__section advert-review-drawer__section--comments">
    <h3 className="advert-review-drawer__section-title">
      <MessageSquare size={12} />
      Reviewer Comments
    </h3>
    <textarea
      className="advert-review-drawer__textarea"
      placeholder="Add your feedback or notes here..."
      value={reviewerComments}
      onChange={(event) => onCommentsChange(event.target.value)}
    />

    <div className="advert-review-drawer__signature">
      <label className="advert-review-drawer__acknowledge">
        <span className={`advert-review-drawer__checkbox ${acknowledgementCheckbox ? "is-checked" : ""}`.trim()}>
          <input
            type="checkbox"
            checked={acknowledgementCheckbox}
            onChange={onToggleAcknowledgement}
          />
          <CheckCircle2 size={12} />
        </span>
        <span>
          I hereby acknowledge that I have reviewed the job advertisement details and attachments, and I confirm that the
          information is accurate and ready for publication.
        </span>
      </label>

      <div className="advert-review-drawer__signature-details">
        <div className="advert-review-drawer__avatar">
          {isLoading ? "" : (signatureDetails?.reviewerInitial ?? "JD")}
        </div>
        <div className="advert-review-drawer__signature-meta">
          <div>
            <div className="advert-review-drawer__signature-label">Reviewer Name</div>
            <div className="advert-review-drawer__signature-value">
              {isLoading ? <SkeletonBlock width="120px" /> : signatureDetails?.reviewerName}
            </div>
          </div>
          <div>
            <div className="advert-review-drawer__signature-label">Job Title (EN)</div>
            <div className="advert-review-drawer__signature-value">
              {isLoading ? <SkeletonBlock width="140px" /> : signatureDetails?.jobTitleEN}
            </div>
          </div>
          <div>
            <div className="advert-review-drawer__signature-label">Job Title (FR)</div>
            <div className="advert-review-drawer__signature-value">
              {isLoading ? <SkeletonBlock width="160px" /> : signatureDetails?.jobTitleFR}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
