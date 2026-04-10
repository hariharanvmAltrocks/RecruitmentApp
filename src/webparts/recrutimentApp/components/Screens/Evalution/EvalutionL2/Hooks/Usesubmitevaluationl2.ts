import { useRef, useState, useCallback } from "react";
import { EvaluationserviceL2 } from "../../../../../services/ServiceExport";
import { userInfo } from "../../../../../utilities/hooks/RoleContext";
import { RoleID } from "../../../../../utilities/Config";

export interface SubmitEvaluationL2Deps {
  candidateId: number;
  panelId: number;
  onSuccess?: () => void;
}

export interface UseSubmitEvaluationL2Return {
  comments: string;
  acknowledgementCheckbox: boolean;
  commentError: boolean;
  checkboxError: boolean;
  submitError: string; // ← NEW: separate error for API failures

  submitting: boolean;
  isSubmittingRef: React.MutableRefObject<boolean>;

  onCommentsChange: (value: string) => void;
  onToggleAcknowledgement: (checked: boolean) => void;
  handleSubmitClick: () => Promise<void>;
  handleCancelClick: () => void;
}

export function useSubmitEvaluationL2(
  deps: SubmitEvaluationL2Deps,
): UseSubmitEvaluationL2Return {
  const { roleIDs } = userInfo();

  // FIX 3: destructure panelId here so it's stable in dep arrays
  const { candidateId, panelId, onSuccess } = deps;

  const [comments, setComments] = useState<string>("");
  const [acknowledgementCheckbox, setAcknowledgementCheckbox] =
    useState<boolean>(false);

  const [commentError, setCommentError] = useState<boolean>(false);
  const [checkboxError, setCheckboxError] = useState<boolean>(false);

  // FIX 4: dedicated error state for API/submit failures — never pollutes field errors
  const [submitError, setSubmitError] = useState<string>("");

  const [submitting, setSubmitting] = useState<boolean>(false);
  const isSubmittingRef = useRef<boolean>(false);

  const onCommentsChange = useCallback((value: string) => {
    setComments(value);
    if (value.trim()) setCommentError(false);
  }, []);

  const onToggleAcknowledgement = useCallback((checked: boolean) => {
    setAcknowledgementCheckbox(checked);
    if (checked) setCheckboxError(false);
  }, []);

  const handleSubmitClick = useCallback(async () => {
    // FIX 1: validate INLINE — reads comments + acknowledgementCheckbox
    // directly from this closure, always fresh, no stale useCallback capture
    let valid = true;

    if (!comments.trim()) {
      setCommentError(true);
      valid = false;
    } else {
      setCommentError(false);
    }

    if (!acknowledgementCheckbox) {
      setCheckboxError(true);
      valid = false;
    } else {
      setCheckboxError(false);
    }

    if (!valid) return;

    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    setSubmitting(true);
    setSubmitError("");

    try {
      // FIX 2: Array.includes() only accepts ONE argument
      // roleIDs.includes(RoleID.LineManager, RoleID.HOD) ← WRONG (second arg is ignored)
      const isLineManagerOrHOD =
        roleIDs.includes(RoleID.LineManager) || roleIDs.includes(RoleID.HOD);

      const roleId = isLineManagerOrHOD ? RoleID.LineManager : roleIDs[0];

      await EvaluationserviceL2.submitEvaluationL2({
        candidateId,
        panelId: deps.panelId,
        comments: {
          Comments: comments.trim(),
          CandidateIDId: candidateId,
          RoleId: roleId,
          level: "Level 2",
        },
      });

      onSuccess?.();
    } catch (error) {
      console.error("[useSubmitEvaluationL2] submit error:", error);
      // FIX 4: use submitError — never set commentError on API failure
      setSubmitError("Submission failed. Please try again or contact support.");
    } finally {
      // eslint-disable-next-line require-atomic-updates
      isSubmittingRef.current = false;
      setSubmitting(false);
    }
  }, [
    comments,
    acknowledgementCheckbox,
    candidateId,
    panelId,
    roleIDs,
    onSuccess,
  ]);

  const handleCancelClick = useCallback(() => {
    if (isSubmittingRef.current) return;
    setComments("");
    setAcknowledgementCheckbox(false);
    setCommentError(false);
    setCheckboxError(false);
    setSubmitError("");
    onSuccess?.();
  }, [onSuccess]);

  return {
    comments,
    acknowledgementCheckbox,
    commentError,
    checkboxError,
    submitError,
    submitting,
    isSubmittingRef,
    onCommentsChange,
    onToggleAcknowledgement,
    handleSubmitClick,
    handleCancelClick,
  };
}
