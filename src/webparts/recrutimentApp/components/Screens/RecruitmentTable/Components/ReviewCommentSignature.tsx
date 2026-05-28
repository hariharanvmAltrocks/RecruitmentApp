import React from "react";
import { CheckCircle2, MessageSquare, User } from "lucide-react";
import "../AdvertReviewDrawer/AdvertReviewDrawer.scss";
import { SignatureDetails } from "../AdvertReviewDrawer/Hooks/getSignatureDetails";
import * as strings from 'RecrutimentAppWebPartStrings';

export interface ReviewCommentSignatureProps {
  reviewerComments: string;
  acknowledgementCheckbox: boolean;
  signatureDetails: SignatureDetails | null;
  isLoading: boolean;
  onCommentsChange: (value: string) => void;
  onToggleAcknowledgement: (value: boolean) => void;
  commentError?: boolean;
  checkboxError?: boolean;
  disabled?: boolean;
  ReviewLabel?: string;
  acknowledgementLabel?: string;
}

const SkeletonBlock: React.FC<{ width?: string; height?: string }> = ({
  width = "100%",
  height = "14px",
}) => (
  <div className="advert-review-drawer__skeleton" style={{ width, height }} />
);

export const ReviewCommentSignature: React.FC<ReviewCommentSignatureProps> = ({
  reviewerComments,
  acknowledgementCheckbox,
  signatureDetails,
  isLoading,
  onCommentsChange,
  onToggleAcknowledgement,
  commentError = false,
  checkboxError = false,
  disabled = false,
  ReviewLabel,
  acknowledgementLabel,
}) => (
  <section className="advert-review-drawer__section advert-review-drawer__section--comments">
    <h3 className="advert-review-drawer__section-title">
      <MessageSquare size={12} />
      {ReviewLabel ? ReviewLabel : strings.ReviewerComments}
    </h3>

    {/* ── Textarea — red border when commentError=true ── */}
    <textarea
      className={[
        "advert-review-drawer__textarea",
        commentError ? "advert-review-drawer__textarea--error" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      placeholder={strings.AddYourFeedbackOrNotesHere}
      value={reviewerComments}
      onChange={(e) => onCommentsChange(e.target.value)}
      rows={4}
      disabled={disabled}
    />
    {commentError && (
      <span className="advert-review-drawer__field-error">
        {strings.ReviewerCommentIsRequired}</span>
    )}

    <div className="advert-review-drawer__signature">
      {/* ── Acknowledgement row — red border when checkboxError=true ── */}
      <label
        className={[
          "advert-review-drawer__acknowledge",
          checkboxError ? "advert-review-drawer__acknowledge--error" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span
          className={[
            "advert-review-drawer__checkbox",
            acknowledgementCheckbox ? "is-checked" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <input
            type="checkbox"
            checked={acknowledgementCheckbox}
            onChange={(e) => onToggleAcknowledgement(e.target.checked)}
            disabled={disabled}
          />
          <CheckCircle2 size={12} />
        </span>
        <span>
          {acknowledgementLabel
            ? acknowledgementLabel
            : strings.IHerebyAcknowledgeThatIHaveReviewedTheJo}
        </span>
      </label>
      {checkboxError && (
        <span className="advert-review-drawer__field-error">
          {strings.PleaseAcknowledgeBeforeApproving}</span>
      )}

      {/* ── Signature card ── */}
      <div className="advert-review-drawer__signature-details">
        <div className="advert-review-drawer__avatar">
          {isLoading ? "" : <User size={24} />}
        </div>
        <div className="advert-review-drawer__signature-meta">
          <div>
            <div className="advert-review-drawer__signature-label">
              {strings.ReviewerName}</div>
            <div className="advert-review-drawer__signature-value">
              {isLoading ? (
                <SkeletonBlock width="120px" />
              ) : (
                signatureDetails?.reviewerName
              )}
            </div>
          </div>
          <div>
            <div className="advert-review-drawer__signature-label">
              {strings.JobTitleEn}</div>
            <div className="advert-review-drawer__signature-value">
              {isLoading ? (
                <SkeletonBlock width="140px" />
              ) : (
                signatureDetails?.jobTitleEN
              )}
            </div>
          </div>
          <div>
            <div className="advert-review-drawer__signature-label">
              {strings.JobTitleFr}</div>
            <div className="advert-review-drawer__signature-value">
              {isLoading ? (
                <SkeletonBlock width="160px" />
              ) : (
                signatureDetails?.jobTitleFR
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
