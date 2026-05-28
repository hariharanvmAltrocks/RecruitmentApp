import React, { useCallback, useMemo, useState } from "react";
import { BadgeCheck, Loader2, Send, X } from "lucide-react";
import {
  AssignmentPayload,
  HrMember,
  RecruitmentItem,
} from "../../RecruitmentTable.types";
import "./AssignHRPopup.scss";
import * as strings from 'RecrutimentAppWebPartStrings';

interface AssignHRPopupProps {
  isOpen: boolean;
  selectedItems: RecruitmentItem[];
  assignedMember: HrMember | null;
  onClose: () => void;
  oncancel: () => void;
  onConfirm: (payload: AssignmentPayload) => void;
}

export const AssignHRPopup: React.FC<AssignHRPopupProps> = ({
  isOpen,
  selectedItems,
  assignedMember,
  onClose,
  oncancel,
  onConfirm,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<string>("");
  const [commentsTouched, setCommentsTouched] = useState<boolean>(false);
  const isCommentsValid = useMemo(() => comments.trim().length > 0, [comments]);
  const showCommentsError = commentsTouched && !isCommentsValid;

  const handleConfirm = useCallback(async () => {
    if (isSubmitting) {
      return;
    }
    if (!isCommentsValid) {
      setCommentsTouched(true);
      return;
    }
    setIsSubmitting(true);
    try {
      await onConfirm({
        vacancies: selectedItems,
        member: assignedMember,
        comments,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    comments,
    onConfirm,
    assignedMember,
    selectedItems,
    isSubmitting,
    isCommentsValid,
  ]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-popup" role="dialog" aria-modal="true">
      <div className="modal-popup__card">
        <button
          className="modal-popup__close"
          type="button"
          onClick={onClose}
          aria-label={strings.Close}
        >
          <X size={20} />
        </button>
        <div className="modal-popup__title">
          <span className="modal-popup__title-icon">
            <BadgeCheck size={20} />
          </span>
          {strings.FinalizeAssignment}</div>

        <div className="modal-popup__section">
          <div className="modal-popup__section-title">{strings.SelectedVacancies}</div>
          <div className="modal-popup__vacancies">
            {selectedItems.length} {strings.Vacancies}</div>
          <div className="modal-popup__vacancies-subtext">
            {selectedItems.map((item) => item.title).join(", ")}
          </div>
        </div>

        <div className="modal-popup__section">
          <div className="modal-popup__section-title">{strings.AssigningTo}</div>
          <div className="modal-popup__assignee">
            <span className="modal-popup__avatar">
              {assignedMember?.initials ?? "HR"}
            </span>
            <div>
              <div className="modal-popup__assignee-name">
                {assignedMember?.name ?? strings.NoMemberSelected}
              </div>
              <div className="modal-popup__assignee-role">
                {assignedMember?.role ?? strings.SelectAMemberToProceed}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-popup__section">
          <div className="modal-popup__section-title">
            {strings.InstructionsCommentsForStaff}</div>
          <textarea
            className="modal-popup__input"
            placeholder={strings.EnterSpecificInstructionsForTheAssignedH}
            value={comments}
            onChange={(event) => setComments(event.target.value)}
            onBlur={() => setCommentsTouched(true)}
            disabled={isSubmitting}
          />
        </div>

        <div className="modal-popup__footer">
          <button
            className="modal-popup__btn modal-popup__btn--ghost"
            type="button"
            onClick={oncancel}
            disabled={isSubmitting}
          >
            {strings.Cancel}</button>
          <button
            className="modal-popup__btn modal-popup__btn--primary"
            type="button"
            disabled={isSubmitting || !isCommentsValid}
            onClick={handleConfirm}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="modal-popup__spinner" />
                {strings.Sending}</>
            ) : (
              <>
                <Send size={16} style={{ marginRight: 8 }} />
                Confirm &amp; Send
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
