import React, { memo, useMemo } from "react";
import { Eye, Upload } from "lucide-react";
import { RecruitmentItem, TableActionMode } from "../../Screens/RecruitmentTable/RecruitmentTable.types";
import "../../Screens/RecruitmentTable/Components/DataTable/DataTable.scss";

interface NormalDataTableProps {
  items: RecruitmentItem[];
  loading: boolean;
  actionMode: TableActionMode;
  onAction: (item: RecruitmentItem) => void;
}

interface NormalDataRowProps {
  item: RecruitmentItem;
  actionMode: TableActionMode;
  onAction: (item: RecruitmentItem) => void;
}

const NormalDataRow = memo(({ item, actionMode, onAction }: NormalDataRowProps) => {
  return (
    <tr className="data-table__row">
      <td className="data-table__cell data-table__cell--muted">{item.jobCode}</td>
      <td className="data-table__cell">
        <div className="data-table__job-title">{item.title}</div>
        <div className="data-table__job-dept">{item.department}</div>
      </td>
      <td className="data-table__cell data-table__cell--count">{String(item.count).padStart(2, "0")}</td>
      <td className="data-table__cell data-table__cell--muted">{item.requestType}</td>
      <td className="data-table__cell data-table__cell--muted">{item.nationality}</td>
      <td className="data-table__cell">
        <span className="data-table__status-badge status-badge">{item.status}</span>
      </td>
      <td className="data-table__cell data-table__cell--actions">
        <button
          className="data-table__action-btn"
          onClick={() => onAction(item)}
          type="button"
          aria-label={actionMode === "Upload" ? "Upload document" : "View vacancy"}
        >
          {actionMode === "Upload" ? <Upload size={16} /> : <Eye size={16} />}
          {actionMode === "Upload" ? "Upload" : "View"}
        </button>
      </td>
    </tr>
  );
});

NormalDataRow.displayName = "NormalDataRow";

const NormalDataTableSkeleton = () => {
  const rows = Array.from({ length: 6 }, (_, index) => index);

  return (
    <>
      {rows.map((row) => (
        <tr className="data-table__row" key={`skeleton-${row}`}>
          <td className="data-table__cell data-table__cell--muted">
            <div className="data-table__skeleton data-table__skeleton--short" />
          </td>
          <td className="data-table__cell">
            <div className="data-table__skeleton data-table__skeleton--title" />
            <div className="data-table__skeleton data-table__skeleton--subtitle" style={{ marginTop: 6 }} />
          </td>
          <td className="data-table__cell">
            <div className="data-table__skeleton data-table__skeleton--short" />
          </td>
          <td className="data-table__cell">
            <div className="data-table__skeleton data-table__skeleton--short" />
          </td>
          <td className="data-table__cell">
            <div className="data-table__skeleton data-table__skeleton--short" />
          </td>
          <td className="data-table__cell">
            <div className="data-table__skeleton data-table__skeleton--short" />
          </td>
          <td className="data-table__cell data-table__cell--actions">
            <div className="data-table__skeleton data-table__skeleton--short" style={{ marginLeft: "auto" }} />
          </td>
        </tr>
      ))}
    </>
  );
};

export const NormalDataTable: React.FC<NormalDataTableProps> = ({
  items,
  loading,
  actionMode,
  onAction,
}) => {
  const rows = useMemo(
    () => items.map((item) => (
      <NormalDataRow key={item.id} item={item} actionMode={actionMode} onAction={onAction} />
    )),
    [actionMode, items, onAction]
  );

  return (
    <table className="data-table">
      <thead className="data-table__head">
        <tr className="data-table__head-row">
          <th>Job Code</th>
          <th>Job Title &amp; Dept</th>
          <th>Count</th>
          <th>Request Type</th>
          <th>Nationality</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {loading ? <NormalDataTableSkeleton /> : rows}
      </tbody>
    </table>
  );
};
