import * as React from "react";
import { CommentEntry } from "../../../ReviewScoreCard/ReviewScoreCardServies/ReviewScoreCardServices";
import {
  ScorecardCandidateRow,
  CandidateReviewData,
} from "../../../ReviewScoreCard/State/types";
import { EvaluationserviceL2 } from "../../../../../services/ServiceExport";
import { userInfo } from "../../../../../utilities/hooks/RoleContext";

export function fetchCandidateValue(
  CandidateId: number,
  recruitmentID: number,
) {
  const { ADGroupData } = userInfo();
  const [candidates, setCandidates] = React.useState<ScorecardCandidateRow[]>(
    [],
  );
  const [candidatesLoading, setCandidatesLoading] = React.useState(true);
  const [drawerOpen] = React.useState(true);
  const [reviewingCandidate, setReviewingCandidate] =
    React.useState<ScorecardCandidateRow | null>(null);
  const [reviewData, setReviewData] =
    React.useState<CandidateReviewData | null>(null);
  const [scoreData, setScoreData] = React.useState<any[]>([]);

  const [showComments, setShowComments] = React.useState(false);
  const [level1Comments, setLevel1Comments] = React.useState<CommentEntry[]>(
    [],
  );
  const [level2Comments, setLevel2Comments] = React.useState<CommentEntry[]>(
    [],
  );
  const [commentsLoading, setCommentsLoading] = React.useState(false);

  const [reviewLoading, setReviewLoading] = React.useState(false);
  const [scoreLoading, setScoreLoading] = React.useState(false);

  function _parseQJson(raw: any): Record<string, number>[] {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  function calculateGPA(scorecards: any[]): string {
    if (!scorecards || scorecards.length === 0) return "";
    try {
      const level1Panels = scorecards.filter(
        (s) => !s.InterviewLevel || /level\s*1/i.test(s.InterviewLevel || ""),
      );
      const panels = level1Panels.length > 0 ? level1Panels : scorecards;
      const maxOverall = panels.length * 40;
      let sumOverall = 0,
        sumQuestion = 0,
        maxQuestion = 0;
      for (const sc of panels) {
        sumOverall +=
          (Number(sc.RelevantQualification) || 0) +
          (Number(sc.ReleventExperience) || 0) +
          (Number(sc.Knowledge) || 0) +
          (Number(sc.EnergyLevel) || 0) +
          (Number(sc.MeetJobRequirement) || 0) +
          (Number(sc.ContributeTowardsCultureRequried) || 0) +
          (Number(sc.Experience) || 0) +
          (Number(sc.OtherCriteriaScore) || 0);
        const qJson = _parseQJson(sc.QuestionJson);
        const qScore = qJson.reduce(
          (sum: number, q: any) => sum + (Number(Object.values(q)[0]) || 0),
          0,
        );
        sumQuestion += qScore;
        maxQuestion += qJson.length * 3;
      }
      const combined = sumOverall + sumQuestion;
      const maxPossible = maxOverall + maxQuestion;
      if (maxPossible <= 0) return "";
      return String(Math.floor((combined / maxPossible) * 5 * 100) / 100);
    } catch (e) {
      console.warn("[calculateGPA]", e);
      return "";
    }
  }

  const loadCandidates = React.useCallback(async () => {
    if (!CandidateId || !recruitmentID) return;
    setCandidatesLoading(true);
    try {
      const list = await EvaluationserviceL2.getCandidatesByRecruitmentId(
        CandidateId,
        recruitmentID,
      );
      const mapped: ScorecardCandidateRow[] = list.map((c: any) => ({
        id: c.id,
        recruitmentID: c.recruitmentID,
        jobCode: c.jobCode || "",
        jobCodeID: c.jobCodeID || 0,
        fullName: c.fullName || "",
        nationality: c.nationality || "",
        gender: c.gender || "",
        status: c.status || "",
        statusId: c.statusId || 0,
        interviewDate: c.interviewDate || "",
        interviewLevel: c.interviewLevel || "",
        grade: c.grade || "",
        department: c.department || "",
        gpa: c.gpa || "",
        positionTitle: c.positionTitle || "",
        disability: c.disability || "",
        jobTitle: c.jobTitle || "",
      }));
      setCandidates(mapped);
      setReviewingCandidate(mapped[0]);
      setReviewLoading(true);
      setScoreLoading(true);
      const result = await EvaluationserviceL2.getReviewScoreCardData(
        CandidateId,
        ADGroupData.EmailId[0],
        { ...mapped[0], department: mapped[0].department },
      );

      setReviewData({
        candidateData: {
          Nationality: result.nationality,
          Gender: result.gender,
          Qualification: result.qualification,
          TotalYearOfExperiance: result.miningExp,
          ReleventExperience: result.relevantExp,
          InterviewDate: result.interviewDate,
          ConflictsOfInterest: result.conflictsOfInterest,
          Disability: result.disability,
          PositionTitle: result.positionTitle,
          level2ScorecardId: result.level2Scorecard?.ID ?? null,
          jobRequestId: result.jobRequestId ?? null,
        },
        panelMembers: (result.panelMembers || []).map((m: any) =>
          typeof m === "string" ? m : m.name || "",
        ),
        currentUserPanelId: result.currentUserPanelId ?? 0,
        questions: result.questions || [],
        reviewerName: result.reviewerName || "",
        jobTitleEn: result.jobTitleEn || "",
        jobTitleFr: result.jobTitleFr || "",
      });

      const scorecardArr = Array.isArray(result.scorecard)
        ? result.scorecard
        : result.scorecard
          ? [result.scorecard]
          : [];
      setScoreData(scorecardArr);

      if (!mapped[0].gpa && scorecardArr.length > 0) {
        const calculatedGPA = calculateGPA(scorecardArr);
        if (calculatedGPA) {
          setReviewingCandidate((prev) =>
            prev ? { ...prev, gpa: calculatedGPA } : prev,
          );
        }
      }
      setReviewLoading(false);
      setScoreLoading(false);
    } catch (e) {
      console.error("[useReviewScorecard] loadCandidates error:", e);
      setCandidates([]);
    } finally {
      setCandidatesLoading(false);
    }
  }, [CandidateId]);

  React.useEffect(() => {
    void loadCandidates();
  }, [loadCandidates]);

  const refreshCandidates = React.useCallback(async () => {
    await loadCandidates();
  }, [loadCandidates]);

  const closeReview = React.useCallback(() => {
    setShowComments(false);
  }, []);

  const openComments = React.useCallback(async () => {
    if (!reviewingCandidate) return;
    setShowComments(true);
    setCommentsLoading(true);
    setLevel1Comments([]);
    setLevel2Comments([]);
    try {
      const { level1, level2 } = await EvaluationserviceL2.fetchComments(
        reviewingCandidate.id,
      );
      setLevel1Comments(Array.isArray(level1) ? level1 : []);
      setLevel2Comments(Array.isArray(level2) ? level2 : []);
    } catch (e) {
      console.error("[useReviewScorecard] openComments error:", e);
    } finally {
      setCommentsLoading(false);
    }
  }, [reviewingCandidate]);
  return {
    // list
    candidates,
    candidatesLoading,
    drawerOpen,
    loadCandidates,
    refreshCandidates,

    // review modal
    reviewingCandidate,
    reviewData,
    scoreData,
    closeReview,

    showComments,
    setShowComments,
    level1Comments,
    level2Comments,
    commentsLoading,
    openComments,

    scoreLoading,
    reviewLoading,
  };
}
