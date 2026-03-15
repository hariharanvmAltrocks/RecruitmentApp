import React, { useCallback, useState } from "react";
import { BadgeCheck, Send, X } from "lucide-react";
import { AssignmentPayload, HrMember, RecruitmentItem } from "../../RecruitmentTable.types";
import "./AssignHRPopup.scss";

interface AssignHRPopupProps {
  isOpen: boolean;
  selectedItems: RecruitmentItem[];
  assignedMember: HrMember | null;
  onClose: () => void;
  onConfirm: (payload: AssignmentPayload) => void;
}

export const AssignHRPopup: React.FC<AssignHRPopupProps> = ({
  isOpen,
  selectedItems,
  assignedMember,
  onClose,
  onConfirm,
}) => {
  const [comments, setComments] = useState<string>("");

  const handleConfirm = useCallback(() => {
    onConfirm({
      vacancies: selectedItems,
      member: assignedMember,
      comments,
    });
  }, [comments, onConfirm, assignedMember, selectedItems]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-popup" role="dialog" aria-modal="true">
      <div className="modal-popup__card">
        <button className="modal-popup__close" type="button" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        <div className="modal-popup__title">
          <span className="modal-popup__title-icon">
            <BadgeCheck size={20} />
          </span>
          Finalize Assignment
        </div>

        <div className="modal-popup__section">
          <div className="modal-popup__section-title">Selected Vacancies</div>
          <div className="modal-popup__vacancies">
            {selectedItems.length} Vacancies
          </div>
          <div className="modal-popup__vacancies-subtext">
            {selectedItems.map((item) => item.title).join(", ")}
          </div>
        </div>

        <div className="modal-popup__section">
          <div className="modal-popup__section-title">Assigning To</div>
          <div className="modal-popup__assignee">
            <span className="modal-popup__avatar">
              {assignedMember?.initials ?? "HR"}
            </span>
            <div>
              <div className="modal-popup__assignee-name">
                {assignedMember?.name ?? "No member selected"}
              </div>
              <div className="modal-popup__assignee-role">
                {assignedMember?.role ?? "Select a member to proceed"}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-popup__section">
          <div className="modal-popup__section-title">Instructions / Comments for Staff</div>
          <textarea
            className="modal-popup__input"
            placeholder="Enter specific instructions for the assigned HR member..."
            value={comments}
            onChange={(event) => setComments(event.target.value)}
          />
        </div>

        <div className="modal-popup__footer">
          <button className="modal-popup__btn modal-popup__btn--ghost" type="button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="modal-popup__btn modal-popup__btn--primary"
            type="button"
            disabled={!assignedMember || selectedItems.length === 0}
            onClick={handleConfirm}
          >
            <Send size={16} style={{ marginRight: 8 }} />
            Confirm &amp; Send
          </button>
        </div>
      </div>
    </div>
  );
};
