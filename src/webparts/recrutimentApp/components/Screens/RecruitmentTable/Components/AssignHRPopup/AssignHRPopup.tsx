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
  changeHR?: boolean;
  members?: HrMember[];
}

export const AssignHRPopup: React.FC<AssignHRPopupProps> = ({
  isOpen,
  selectedItems,
  assignedMember,
  onClose,
  oncancel,
  onConfirm,
  changeHR = false,
  members = [],
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<string>("");
  const [commentsTouched, setCommentsTouched] = useState<boolean>(false);

  // Local state to track the selected assignee inside the popup
  const [localMember, setLocalMember] = useState<HrMember | null>(assignedMember);

  // Sync state if assignedMember changes
  React.useEffect(() => {
    setLocalMember(assignedMember);
  }, [assignedMember]);

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
        member: localMember,
        comments,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    comments,
    onConfirm,
    localMember,
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
          {changeHR ? (
            <div className="modal-popup__change-hr">
              <select
                value={localMember?.id ?? ""}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  const found = members.find((m) => m.id === id);
                  setLocalMember(found ?? null);
                }}
                className="modal-popup__select"
                disabled={isSubmitting}
              >
                <option value="">{strings.ChooseHrMember}</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} - {member.role}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="modal-popup__assignee">
              <span className="modal-popup__avatar">
                {localMember?.initials ?? "HR"}
              </span>
              <div>
                <div className="modal-popup__assignee-name">
                  {localMember?.name ?? strings.NoMemberSelected}
                </div>
                <div className="modal-popup__assignee-role">
                  {localMember?.role ?? strings.SelectAMemberToProceed}
                </div>
              </div>
            </div>
          )}
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
            disabled={isSubmitting || !isCommentsValid || (changeHR && !localMember)}
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
