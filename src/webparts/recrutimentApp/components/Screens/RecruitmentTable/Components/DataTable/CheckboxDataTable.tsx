import React, { memo, useMemo } from "react";
import { Check, Eye, Minus } from "lucide-react";
import { RecruitmentItem, TableActionMode } from "../../RecruitmentTable.types";
import "./DataTable.scss";

interface CheckboxDataTableProps {
  items: RecruitmentItem[];
  loading: boolean;
  selectedIds: string[];
  actionMode: TableActionMode;
  onToggleRow: (id: string) => void;
  onToggleAll: () => void;
  onAction: (item: RecruitmentItem) => void;
}

interface CheckboxRowProps {
  item: RecruitmentItem;
  isSelected: boolean;
  onToggle: (id: string) => void;
  actionMode: TableActionMode;
  onAction: (item: RecruitmentItem) => void;
}

const CheckboxRow = memo(({ item, isSelected, onToggle, actionMode, onAction }: CheckboxRowProps) => {
  return (
    <tr className={`data-table__row ${isSelected ? "data-table__row--selected" : ""}`.trim()}>
      <td className="data-table__cell data-table__checkbox-cell">
        <button
          className={`data-table__checkbox ${isSelected ? "data-table__checkbox--checked" : ""}`.trim()}
          type="button"
          aria-pressed={isSelected}
          onClick={() => onToggle(item.id)}
        >
          {isSelected ? <Check size={12} /> : null}
        </button>
      </td>
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
          aria-label={actionMode === "upload" ? "Upload document" : "View vacancy"}
        >
          <Eye size={16} />
          {actionMode === "upload" ? "Upload" : "View"}
        </button>
      </td>
    </tr>
  );
});

CheckboxRow.displayName = "CheckboxRow";

const CheckboxDataTableSkeleton = () => {
  const rows = Array.from({ length: 6 }, (_, index) => index);

  return (
    <>
      {rows.map((row) => (
        <tr className="data-table__row" key={`skeleton-${row}`}>
          <td className="data-table__cell data-table__checkbox-cell">
            <div className="data-table__skeleton data-table__skeleton--short" />
          </td>
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

export const CheckboxDataTable: React.FC<CheckboxDataTableProps> = ({
  items,
  loading,
  selectedIds,
  actionMode,
  onToggleRow,
  onToggleAll,
  onAction,
}) => {
  const allSelected = items.length > 0 && selectedIds.length === items.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < items.length;
  const rows = useMemo(
    () =>
      items.map((item) => (
        <CheckboxRow
          key={item.id}
          item={item}
          isSelected={selectedIds.includes(item.id)}
          onToggle={onToggleRow}
          actionMode={actionMode}
          onAction={onAction}
        />
      )),
    [actionMode, items, onAction, onToggleRow, selectedIds]
  );

  return (
    <table className="data-table">
      <thead className="data-table__head">
        <tr className="data-table__head-row">
          <th className="data-table__checkbox-cell">
            <button
              className={`data-table__checkbox ${allSelected || someSelected ? "data-table__checkbox--checked" : ""}`.trim()}
              type="button"
              aria-pressed={allSelected}
              onClick={onToggleAll}
            >
              {allSelected ? <Check size={12} /> : null}
              {someSelected && !allSelected ? <Minus size={12} /> : null}
            </button>
          </th>
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
        {loading ? <CheckboxDataTableSkeleton /> : rows}
      </tbody>
    </table>
  );
};
