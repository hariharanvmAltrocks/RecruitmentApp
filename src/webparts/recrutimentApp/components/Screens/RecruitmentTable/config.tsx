import { useEffect, useMemo, useRef } from "react";
import { Eye, Upload } from "lucide-react";
import { DataTableColumn } from "../../Comman/DataTable/DataTable";
import { EvalutionItem, RecruitmentItem } from "./RecruitmentTable.types";
import React from "react";


export type ColumnRole = "default" | "evaluation";


interface UseRecruitmentColumnsOptions {
  role: ColumnRole;
  actionMode: "Upload" | "View";
  onAction: (item: RecruitmentItem) => void;
}

export const useRecruitmentColumns = ({
  role,
  actionMode,
  onAction,
}: UseRecruitmentColumnsOptions): DataTableColumn<RecruitmentItem>[] => {

  const onActionRef = useRef(onAction);
  useEffect(() => {
    onActionRef.current = onAction;
  }, [onAction]);

  const actionColumn: DataTableColumn<RecruitmentItem> = useMemo(
    () => ({
      id: "actions",
      header: "Actions",
      align: "right",
      cellClassName: "data-table__cell--actions",
      render: (item) => (
        <button
          className="data-table__action-btn"
          onClick={() => onActionRef.current(item)}
          type="button"
          aria-label={actionMode === "Upload" ? "Upload document" : "View vacancy"}
        >
          {actionMode === "Upload" ? <Upload size={16} /> : <Eye size={16} />}
          {actionMode === "Upload" ? "Upload" : "View"}
        </button>
      ),
    }),
    [actionMode]
  );

  const defaultColumns: DataTableColumn<RecruitmentItem>[] = useMemo(
    () => [
      {
        id: "jobCode",
        header: "Job Code",
        accessor: "jobCode",
        cellClassName: "data-table__cell--muted",
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
      {
        id: "count",
        header: "Count",
        render: (item) => String(item.count).padStart(2, "0"),
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
          <span className="data-table__status-badge status-badge">{item.status}</span>
        ),
      },
      actionColumn,
    ],
    [actionColumn]
  );

  const evaluationColumns: DataTableColumn<any>[] = useMemo(
    () => [
      {
        id: "applicantName",
        header: "Applicant Name",
        accessor: "applicantName",
        cellClassName: "data-table__cell--muted",
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
          <span className="data-table__status-badge status-badge">{item.status}</span>
        ),
      },
      actionColumn,
    ],
    [actionColumn]
  );

  const columnMap: Record<ColumnRole, DataTableColumn<any>[]> = {
    default: defaultColumns,
    evaluation: evaluationColumns,
  };

  return columnMap[role] ?? defaultColumns;
};