import { useEffect, useMemo, useRef } from "react";
import { Eye, Pencil, Play, Upload } from "lucide-react";
import { DataTableColumn } from "../../Comman/DataTable/DataTable";
import {
  EvalutionItem,
  ISelectedCandidate,
  RecruitmentItem,
} from "./RecruitmentTable.types";
import React from "react";
import { StatusId } from "../../../utilities/Config";
import { useUIState } from "../../RecrutimentApp/UIStateContext";
import { MatricID } from "../../../utilities/ConditionConfig";
import { StatusTooltip } from "../../Comman/StatusTooltip/StatusTooltip";
import { tooltipInterviewPanel } from "../../../services/Dashboard/IDashboard";
import { ActionMode } from "../OfferRelease/OfferTable";
import {
  EDIT_STATUSES,
  Initiate_STAUES,
  REVIEW_STATUSES,
} from "../OfferRelease/Config";
import * as strings from 'RecrutimentAppWebPartStrings';

export type ColumnRole = "default" | "evaluation" | "OfferRelease";

interface UseRecruitmentColumnsOptions {
  role: ColumnRole;
  actionMode: "Upload" | "View";
  onAction: (item: any) => void;
}

const getActionLabel = (
  actionMode: "Upload" | "View",
  item: RecruitmentItem,
  matricID: number,
) => {
  const submissionMatricIds = [
    MatricID.MySubmission,
    MatricID.MySubmissionHR,
    MatricID.MySubmissionLM,
    MatricID.MySubmissionHOD,
    MatricID.MySubmissionBGV,
  ];
  if (submissionMatricIds.includes(matricID)) {
    return "VIEW";
  } else if (actionMode === "Upload") {
    return "UPLOAD";
  } else if (
    item.statusId === StatusId.CareerPortalQuestions ||
    item.statusId === StatusId.PendingInterviewquestion
  ) {
    return "CREATE";
  } else if (
    item.statusId === StatusId.PendingReviewAdvertHOD ||
    item.statusId === StatusId.PendingwithLineManagereviewAdv
  ) {
    return "REVIEW";
  } else {
    return "VIEW";
  }
};

export const useRecruitmentColumns = ({
  role,
  actionMode,
  onAction,
}: UseRecruitmentColumnsOptions): DataTableColumn<RecruitmentItem>[] => {
  const { MatricID: matricID } = useUIState();
  const onActionRef = useRef(onAction);
  useEffect(() => {
    onActionRef.current = onAction;
  }, [onAction]);

  const actionColumn: DataTableColumn<RecruitmentItem> = useMemo(
    () => ({
      id: "actions",
      header: "Actions",
      align: "left",
      cellClassName: "data-table__cell--actions",
      render: (item) => (
        <button
          className="data-table__action-btn"
          onClick={() => onActionRef.current(item)}
          type="button"
          aria-label={
            actionMode === strings.Upload ? strings.UploadDocument : strings.ViewVacancy
          }
        >
          {getActionLabel(actionMode, item, matricID)}
        </button>
      ),
    }),
    [actionMode],
  );
  const shouldShowProfile =
    matricID === MatricID.ReviewProfileHR ||
    matricID === MatricID.ReviewProfileLM ||
    matricID === MatricID.AssignInterviewPanel;

  const defaultColumns: DataTableColumn<RecruitmentItem>[] = useMemo(
    () => [
      {
        id: "jobCode",
        header: strings.JobCode,
        accessor: "jobCode",
        cellClassName: "data-table__job-code",
      },
      {
        id: "title",
        header: strings.JobTitleDept,
        render: (item) => (
          <div className="data-table__job-title">
            <span>{item.title}</span>
            <span className="data-table__job-dept">{item.department}</span>
          </div>
        ),
      },
      ...(shouldShowProfile
        ? [
            {
              id: "ProfileCount",
              header: " Profile Count",
              render: (item: any) => String(item.ProfileCount).padStart(2, "0"),
              cellClassName: "data-table__cell--count",
              // align: "center",
              hideOnMobile: true,
            },
          ]
        : []),
      {
        id: "count",
        header: "headCount",
        render: (item: any) => String(item.count).padStart(2, "0"),
        cellClassName: "data-table__cell--count",
        align: "center",
        hideOnMobile: true,
      },
      {
        id: "requestType",
        header: strings.RequestType,
        accessor: "requestType",
        cellClassName: "data-table__cell--muted",
        hideOnMobile: true,
      },
      {
        id: "nationality",
        header: "Nationality",
        accessor: "nationality",
        cellClassName: "data-table__cell--muted",
        hideOnMobile: true,
      },
      {
        id: "status",
        header: "Status",
        render: (item) => {
          let isTooltipStatus: any;
          isTooltipStatus = [StatusId.ReadyforRecruitmentProcess].includes(
            item.statusId,
          );
          if (!isTooltipStatus) {
            return (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <StatusTooltip data={item.StatusTooltip ?? null} />
                <span className="data-table__status-badge status-badge">
                  {item.status}
                </span>
              </div>
            );
          }
          return (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="data-table__status-badge status-badge">
                {item.status}
              </span>
            </div>
          );
        },
      },
      actionColumn,
    ],
    [actionColumn],
  );

  const evaluationColumns: DataTableColumn<any>[] = useMemo(
    () => [
      {
        id: "applicantName",
        header: strings.ApplicantName,
        accessor: "applicantName",
        cellClassName: "data-table__job-code",
        hideOnMobile: true,
      },
      {
        id: "title",
        header: strings.PositionTitle,
        render: (item) => (
          <div className="data-table__job-title">
            <span>{item.title}</span>
            <span className="data-table__job-dept">{item.department}</span>
          </div>
        ),
      },
      {
        id: "interviewDate",
        header: strings.InterviewDate,
        accessor: "interviewDate",
        align: "center",
        cellClassName: "data-table__cell--count",
        hideOnMobile: true,
      },
      {
        id: "interviewLevels",
        header: strings.InterviewLevels,
        accessor: "interviewLevels",
        cellClassName: "data-table__cell--muted",
        hideOnMobile: true,
      },
      {
        id: "grade",
        header: "Grade",
        accessor: "grade",
        cellClassName: "data-table__cell--muted",
        hideOnMobile: true,
      },
      {
        id: "status",
        header: "Status",
        render: (item) => (
          <span className="data-table__status-badge status-badge">
            {item.status}
          </span>
        ),
      },
      actionColumn,
    ],
    [actionColumn],
  );

  function resolveActionMode(statusID: number): ActionMode {
    if (Initiate_STAUES.has(statusID)) return "Initiate";
    if (REVIEW_STATUSES.has(statusID)) return "Review";
    if (EDIT_STATUSES.has(statusID)) return "Edit";
    return "View";
  }

  const ActionCell: React.FC<{
    item: ISelectedCandidate;
    StatusId: number;
    onAction: (item: ISelectedCandidate) => void;
  }> = React.memo(({ item, StatusId, onAction }) => {
    const actionMode = useMemo(() => resolveActionMode(StatusId), [StatusId]);

    const isInitiate = actionMode === "Initiate";
    const isReview = actionMode === "Review";
    const ActionIcon = isInitiate ? Play : isReview ? Pencil : Eye;
    const actionLabel = isInitiate ? "INITIATE" : isReview ? "REVIEW" : "VIEW";

    return (
      <button
        className="data-table__action-btn"
        onClick={() => onAction(item)}
        type="button"
        aria-label={`${actionLabel} action`}
      >
        {/* <ActionIcon size={16} style={{ marginRight: 8 }} /> */}
        {actionLabel}
      </button>
    );
  });

  const offerReleaseColumns: DataTableColumn<any>[] = useMemo(
    () => [
      {
        id: "PositionID",
        header: strings.PositionId,
        accessor: "positionId",
        cellClassName: "data-table__job-code",
        hideOnMobile: true,
      },
      {
        id: "title",
        header: "Job Title & Dept",
        render: (item: any) => (
          <div className="data-table__job-title">
            <span>{item.title}</span>
            <span className="data-table__job-dept">{item.department}</span>
          </div>
        ),
      },
      {
        id: "buCode",
        header: strings.BusinessUnit,
        render: (item: any) => String(item.buCode || "").padStart(2, "0"),
        cellClassName: "data-table__cell--muted",
        align: "center",
        hideOnMobile: true,
      },
      {
        id: "applicantName",
        header: "Applicant Name",
        accessor: "applicantName",
        cellClassName: "data-table__cell--count",
        hideOnMobile: true,
      },
      {
        id: "status",
        header: "Status",
        render: (item) => (
          <span className="data-table__status-badge status-badge">
            {item.status}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        align: "right",
        cellClassName: "data-table__cell--actions",
        render: (item: any) => (
          <ActionCell
            item={item}
            StatusId={item.statusId}
            onAction={() => onActionRef.current(item)}
          />
        ),
      },
    ],
    [onActionRef],
  );

  const columnMap: Record<ColumnRole, DataTableColumn<any>[]> = {
    default: defaultColumns,
    evaluation: evaluationColumns,
    OfferRelease: offerReleaseColumns,
  };

  return columnMap[role] ?? defaultColumns;
};
