import * as React from "react";
import { userInfo } from "../../../../utilities/hooks/RoleContext";
import type {
  Candidate,
  InterviewQuestion,
} from "../State/CommonStateManagement";
import {
  EvaluationFormResult,
  getEvaluationFormData,
} from "../Evaluationservice/Evaluationformservice";

export interface UseCandidateDetailsParams {
  candidateId: number;
  InterviewLevels?: string;
  grade?: string;
}

export interface CandidateDetailsHookResult {
  candidate: Candidate | null;
  questions: InterviewQuestion[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useCandidateDetails({
  candidateId,
  InterviewLevels,
  grade,
}: UseCandidateDetailsParams): CandidateDetailsHookResult {
  const { ADGroupData } = userInfo();
  const currentUserEmail = ADGroupData?.EmailId?.[0] ?? "";

  const [candidate, setCandidate] = React.useState<Candidate | null>(null);
  const [questions, setQuestions] = React.useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);

  React.useEffect(() => {
    if (!candidateId || !currentUserEmail) {
      setLoading(false);
      return;
    }
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result: EvaluationFormResult = await getEvaluationFormData(
          candidateId,
          currentUserEmail,
        );

        if (!isMounted) return;
        if (!result.success) {
          setError("Failed to load candidate data. Please retry.");
          return;
        }
        const jobRequestId = (result as any)._jobRequestId ?? "";

        setCandidate({
          id: result.candidateId,
          applicantName: result.applicantName,
          jobTitle: result.positionTitle,
          grade: grade || result.grade,
          nationality: result.nationality,
          nationalityCode: result.nationalityCode,
          gender: result.gender,
          qualification: result.qualification,
          miningExp: result.miningExp,
          relevantExp: result.relevantExp,
          interviewDate: result.interviewDate,
          interviewLevel: InterviewLevels,
          disability: result.disability,
          conflictsOfInterest: result.conflictsOfInterest,
          panelMembers: result.panelMembers,
          reviewerName: result.reviewerName,
          jobTitleEn: result.jobTitleEn,
          jobTitleFr: result.jobTitleFr,
          currentUserPanelId: result.currentUserPanelId,
          currentUserGuid: result.currentUserGuid,
          recruitmentId: result.recruitmentId,
          jobCodeID: result.jobCodeId,
          jobRequestId,
          currentRoleIDs: ADGroupData?.roleIDs || [4],
        });

        setQuestions(
          result.questions.map((q) => ({
            id: q.id,
            text: q.question,
            expectedResponse: q.answer,
          })),
        );

        console.log("[useCandidateDetails] SUCCESS —", {
          candidateId,
          currentUserPanelId: result.currentUserPanelId,
          questionsCount: result.questions.length,
          jobRequestId,
        });
      } catch (err) {
        console.error("[useCandidateDetails] error:", err);
        if (isMounted)
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load candidate details.",
          );
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void load();
    return () => {
      isMounted = false;
    };
  }, [candidateId, currentUserEmail, grade, InterviewLevels, refreshKey]);

  const reload = React.useCallback(() => setRefreshKey((k) => k + 1), []);

  return { candidate, questions, loading, error, reload };
}
