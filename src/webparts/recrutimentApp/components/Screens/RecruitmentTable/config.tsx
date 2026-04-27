import { useEffect, useMemo, useRef } from "react";
import { Eye, Upload } from "lucide-react";
import { DataTableColumn } from "../../Comman/DataTable/DataTable";
import { EvalutionItem, RecruitmentItem } from "./RecruitmentTable.types";
import React from "react";
import { StatusId } from "../../../utilities/Config";
import { useUIState } from "../../RecrutimentApp/UIStateContext";
import { MatricID } from "../../../utilities/ConditionConfig";

export type ColumnRole = "default" | "evaluation";

interface UseRecruitmentColumnsOptions {
  role: ColumnRole;
  actionMode: "Upload" | "View";
  onAction: (item: RecruitmentItem) => void;
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
            actionMode === "Upload" ? "Upload document" : "View vacancy"
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
        header: "Job Code",
        accessor: "jobCode",
        cellClassName: "data-table__job-code",
      },
      {
        id: "title",
        header: "Job Title & Dept",
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
        header: "Request Type",
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

  const evaluationColumns: DataTableColumn<any>[] = useMemo(
    () => [
      {
        id: "applicantName",
        header: "Applicant Name",
        accessor: "applicantName",
        cellClassName: "data-table__job-code",
        hideOnMobile: true,
      },
      {
        id: "title",
        header: "Position Title",
        render: (item) => (
          <div className="data-table__job-title">
            <span>{item.title}</span>
            <span className="data-table__job-dept">{item.department}</span>
          </div>
        ),
      },
      {
        id: "interviewDate",
        header: "Interview Date",
        accessor: "interviewDate",
        align: "center",
        cellClassName: "data-table__cell--count",
        hideOnMobile: true,
      },
      {
        id: "interviewLevels",
        header: "Interview Levels",
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

  const columnMap: Record<ColumnRole, DataTableColumn<any>[]> = {
    default: defaultColumns,
    evaluation: evaluationColumns,
  };

  return columnMap[role] ?? defaultColumns;
};
