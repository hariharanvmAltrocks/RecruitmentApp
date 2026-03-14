import { useState, useCallback, useRef } from "react";
import { InterviewLevels } from "../config/EvaluationConfig";
import { evaluationService, EvaluationServiceHelper } from "../services/EvaluationApiService";
import { EvaluationCandidate, ScoreSheetResult, TooltipEntry } from "../services/IEvaluationService";
import { StatusId } from "../../../../utilities/Config";

export type SkeletonRow = { __skeleton: true; id: number };
export type TableRow = EvaluationCandidate | SkeletonRow;
export const isSkeleton = (r: TableRow): r is SkeletonRow => "__skeleton" in r;

const makeSkeletons = (): SkeletonRow[] => Array.from({ length: 5 }, (_, i) => ({ __skeleton: true as const, id: i }));

export function useEvaluationData(currentUserEmail: string, employeeList: any[]) {
  const [rows, setRows] = useState<TableRow[]>(makeSkeletons());
  const [tooltipData, setTooltip] = useState<TooltipEntry[] | null>(null);
  const panelDataRef = useRef<any[]>([]);

  const fetchData = useCallback(async () => {
    setRows(makeSkeletons());

    console.log(" STEP 1: Starting fetchData. Current User Email:", currentUserEmail);

    if (!currentUserEmail) {
      console.warn(" No email provided to hook.");
      setRows([]);
      return;
    }

    const guid = await evaluationService.getCurrentUserGuid(currentUserEmail);
    console.log(" STEP 2: Current User GUID from SP:", guid);

    if (!guid) { setRows([]); return; }

    const panels = await evaluationService.getInterviewPanelsByUser(guid);
    panelDataRef.current = panels;
    console.log(" STEP 3: Panels fetched for User:", panels);

    if (!panels.length) {
      console.warn(" No panels found for this user.");
      setRows([]);
      return;
    }

    // Extract candidate IDs robustly mapping to SP expanded object
    const candidateIDs = Array.from(
      new Set(
        panels.map((p: any) => p.CandidateID?.ID ?? p.CandidateId ?? p.CandidateIDId).filter(Boolean)
      )
    );
    console.log(" STEP 4: Extracted Candidate IDs from Panels:", candidateIDs);

    if (!candidateIDs.length) { setRows([]); return; }

    const rawCandidates = await evaluationService.getCombinedCandidates(candidateIDs, employeeList);
    console.log(" STEP 5: Raw Candidates fetched from SP:", rawCandidates);

    if (!rawCandidates.length) { setRows([]); return; }

    const settled: (EvaluationCandidate | null)[] = new Array(rawCandidates.length).fill(null);

    await Promise.all(
      rawCandidates.map(async (candidate: any, idx: number) => {
        const recruitmentId = candidate.RecruitmentID?.ID ?? candidate.RecruitmentIDId ?? candidate.RecruitmentID;
        const { grade, level, jobCodeID } = await evaluationService.getGradeAndLevel(recruitmentId);
        const row = EvaluationServiceHelper.buildRow(candidate, grade, level, jobCodeID);
        settled[idx] = row;
      })
    );

    console.log(" STEP 6: Formatted Candidates (Before Filter):", settled);

    // Exact matching filter logic
    const finalRows = (settled.filter(Boolean) as EvaluationCandidate[]).filter((c) => {
      console.log(` Evaluating Candidate: ${c.applicantName} (ID: ${c.id}, StatusId: ${c.statusId})`);

      const matchingPanel = panels.find((item: any) => {
        const panelCandidateId = item.CandidateID?.ID ?? item.CandidateId ?? item.CandidateIDId;

        if (c.id !== panelCandidateId) return false;

        const cStatusId = Number(c.statusId);
        console.log(`   -> Found matching panel for Candidate ${c.id}. Panel Level: ${item.InterviewLevel}`);

        if (cStatusId === StatusId.InterviewScheduled && item.InterviewLevel === InterviewLevels.Level1) {
          console.log(`  MATCH: Status is InterviewScheduled & Level is 1`);
          return true;
        }
        if (cStatusId === StatusId.InterviewScheduledforLevel2 && item.InterviewLevel === InterviewLevels.Level2) {
          console.log(`   MATCH: Status is InterviewScheduledforLevel2 & Level is 2`);
          return true;
        }

        console.log(`    NO MATCH: Status (${cStatusId}) and Level (${item.InterviewLevel}) combination didn't match requirements.`);
        return false;
      });

      if (matchingPanel) console.log(`    Candidate ${c.id} PASSED the filter.`);
      else console.log(`    Candidate ${c.id} FAILED the filter.`);

      return !!matchingPanel;
    });

    console.log("\ STEP 7: FINAL Filtered Rows applied to UI:", finalRows);
    setRows(finalRows);
  }, [currentUserEmail, employeeList]);

  const fetchTooltip = useCallback(async (statusId: number | string, candidateID: number) => {
    const level = statusId === StatusId.InterviewScheduled ? InterviewLevels.Level1 : InterviewLevels.Level2;
    const data = await evaluationService.getTooltipData(candidateID, level);
    setTooltip(data);
  }, []);

  const checkScoreSheet = useCallback((candidateID: number, statusId: number | string): Promise<ScoreSheetResult> =>
    evaluationService.checkScoreSheet(candidateID, statusId, currentUserEmail), [currentUserEmail]);

  return { rows, tooltipData, fetchData, fetchTooltip, checkScoreSheet };
}