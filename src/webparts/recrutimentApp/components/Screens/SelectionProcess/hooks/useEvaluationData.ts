import { useState, useCallback, useRef } from "react";
import { InterviewLevels } from "../config/EvaluationConfig";
import {
  evaluationService,
  EvaluationServiceHelper,
} from "../services/EvaluationApiService";
import {
  EvaluationCandidate,
  ScoreSheetResult,
  TooltipEntry,
} from "../services/IEvaluationService";
import { StatusId } from "../../../../utilities/Config";

export type SkeletonRow = { __skeleton: true; id: number };
export type TableRow = EvaluationCandidate | SkeletonRow;
export const isSkeleton = (r: TableRow): r is SkeletonRow => "__skeleton" in r;

const makeSkeletons = (): SkeletonRow[] =>
  Array.from({ length: 5 }, (_, i) => ({ __skeleton: true as const, id: i }));

export function useEvaluationData(
  currentUserEmail: string,
  employeeList: any[],
) {
  const [rows, setRows] = useState<TableRow[]>(makeSkeletons());
  const [tooltipData, setTooltip] = useState<TooltipEntry[] | null>(null);
  const panelDataRef = useRef<any[]>([]);

  const fetchData = useCallback(async () => {
    setRows(makeSkeletons());

  

    if (!currentUserEmail) {
      console.warn(" No email provided to hook.");
      setRows([]);
      return;
    }

    const guid = await evaluationService.getCurrentUserGuid(currentUserEmail);

    if (!guid) {
      setRows([]);
      return;
    }

    const panels = await evaluationService.getInterviewPanelsByUser(guid);
    panelDataRef.current = panels;

    if (!panels.length) {
      console.warn(" No panels found for this user.");
      setRows([]);
      return;
    }
    const candidateIDs = Array.from(
      new Set(
        panels
          .map(
            (p: any) => p.CandidateID?.ID ?? p.CandidateId ?? p.CandidateIDId,
          )
          .filter(Boolean),
      ),
    );
 
    if (!candidateIDs.length) {
      setRows([]);
      return;
    }

    const rawCandidates = await evaluationService.getCombinedCandidates(
      candidateIDs,
      employeeList,
    );

    if (!rawCandidates.length) {
      setRows([]);
      return;
    }

    const settled: (EvaluationCandidate | null)[] = new Array(
      rawCandidates.length,
    ).fill(null);

    await Promise.all(
      rawCandidates.map(async (candidate: any, idx: number) => {
        const recruitmentId =
          candidate.RecruitmentID?.ID ??
          candidate.RecruitmentIDId ??
          candidate.RecruitmentID;
        const { grade, level, jobCodeID } =
          await evaluationService.getGradeAndLevel(recruitmentId);
        const row = EvaluationServiceHelper.buildRow(
          candidate,
          grade,
          level,
          jobCodeID,
        );
        settled[idx] = row;
      }),
    );

    const finalRows = (settled.filter(Boolean) as EvaluationCandidate[]).filter(
      (c) => {

        const matchingPanel = panels.find((item: any) => {
          const panelCandidateId =
            item.CandidateID?.ID ?? item.CandidateId ?? item.CandidateIDId;

          if (c.id !== panelCandidateId) return false;

          const cStatusId = Number(c.statusId);
         
          if (
            cStatusId === StatusId.InterviewScheduled &&
            item.InterviewLevel === InterviewLevels.Level1
          ) {
            return true;
          }
          if (
            cStatusId === StatusId.InterviewScheduledforLevel2 &&
            item.InterviewLevel === InterviewLevels.Level2
          ) {
            return true;
          }
          return false;
        });

        return !!matchingPanel;
      },
    );

    setRows(finalRows);
  }, [currentUserEmail, employeeList]);

  const fetchTooltip = useCallback(
    async (statusId: number | string, candidateID: number) => {
      const level =
        statusId === StatusId.InterviewScheduled
          ? InterviewLevels.Level1
          : InterviewLevels.Level2;
      const data = await evaluationService.getTooltipData(candidateID, level);
      setTooltip(data);
    },
    [],
  );

  const checkScoreSheet = useCallback(
    (
      candidateID: number,
      statusId: number | string,
    ): Promise<ScoreSheetResult> =>
      evaluationService.checkScoreSheet(
        candidateID,
        statusId,
        currentUserEmail,
      ),
    [currentUserEmail],
  );

  return { rows, tooltipData, fetchData, fetchTooltip, checkScoreSheet };
}
