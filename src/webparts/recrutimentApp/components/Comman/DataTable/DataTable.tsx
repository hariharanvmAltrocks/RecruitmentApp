import React, { ReactNode, useMemo } from "react";
import { Check, Minus } from "lucide-react";
import "./DataTable.scss";

export type DataTableAlign = "left" | "center" | "right";

export interface DataTableColumn<T> {
  id: string;
  header: string;
  accessor?: keyof T;
  render?: (row: T) => ReactNode;
  align?: DataTableAlign;
  width?: number | string;
  headerClassName?: string;
  cellClassName?: string;
  hideOnMobile?: boolean;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  enableCheckbox?: boolean;
  selectedRowIds?: string[];
  getRowId?: (row: T, index: number) => string;
  onToggleRow?: (id: string) => void;
  onToggleAll?: () => void;
  pageSize: number;
  currentPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

const getRowIdFallback = <T,>(row: T, index: number): string => {
  const possibleId = (row as { id?: string }).id;
  return possibleId ?? String(index);
};

const buildCellValue = <T,>(row: T, column: DataTableColumn<T>): ReactNode => {
  if (column.render) {
    return column.render(row);
  }

  if (column.accessor) {
    const value = row[column.accessor];
    return value === null || value === undefined ? "-" : String(value);
  }

  return "-";
};

export const DataTable = <T,>({
  columns,
  data,
  enableCheckbox = false,
  selectedRowIds = [],
  getRowId = getRowIdFallback,
  onToggleRow,
  onToggleAll,
  pageSize,
  currentPage,
  totalCount,
  onPageChange,
  pageSizeOptions = [5, 10, 20, 50],
  onPageSizeChange,
  loading = false,
  emptyMessage = "No records found.",
  onRowClick,
}: DataTableProps<T>) => {
  const rowIds = useMemo(() => data.map((row, index) => getRowId(row, index)), [data, getRowId]);
  const allSelected = enableCheckbox && rowIds.length > 0 && rowIds.every((id) => selectedRowIds.includes(id));
  const someSelected = enableCheckbox && rowIds.some((id) => selectedRowIds.includes(id)) && !allSelected;

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const rangeStart = totalCount === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(safeCurrentPage * pageSize, totalCount);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePrev = () => {
    if (safeCurrentPage > 1) {
      onPageChange(safeCurrentPage - 1);
    }
  };

  const handleNext = () => {
    if (safeCurrentPage < totalPages) {
      onPageChange(safeCurrentPage + 1);
    }
  };

  const skeletonRows = useMemo(() => Array.from({ length: 6 }, (_, index) => index), []);
  const totalColumns = columns.length + (enableCheckbox ? 1 : 0);

  return (
    <div className="data-table__wrapper">
      <table className="data-table">
        <thead className="data-table__head">
          <tr className="data-table__head-row">
            {enableCheckbox && (
              <th className="data-table__checkbox-cell">
                <button
                  className={`data-table__checkbox ${allSelected || someSelected ? "data-table__checkbox--checked" : ""}`.trim()}
                  type="button"
                  aria-pressed={allSelected}
                  aria-label="Select all rows"
                  onClick={onToggleAll}
                  disabled={!onToggleAll}
                >
                  {allSelected ? <Check size={12} /> : null}
                  {someSelected && !allSelected ? <Minus size={12} /> : null}
                </button>
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.id}
                className={[
                  "data-table__head-cell",
                  column.align ? `data-table__head-cell--${column.align}` : "",
                  column.hideOnMobile ? "data-table__cell--mobile-hidden" : "",
                  column.headerClassName ?? "",
                ].join(" ").trim()}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <>
              {skeletonRows.map((row) => (
                <tr className="data-table__row" key={`skeleton-${row}`}>
                  {enableCheckbox && (
                    <td className="data-table__cell data-table__checkbox-cell">
                      <div className="data-table__skeleton data-table__skeleton--short" />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={`${column.id}-skeleton-${row}`}
                      className={[
                        "data-table__cell",
                        column.hideOnMobile ? "data-table__cell--mobile-hidden" : "",
                        column.cellClassName ?? "",
                      ].join(" ").trim()}
                    >
                      <div className="data-table__skeleton data-table__skeleton--short" />
                    </td>
                  ))}
                </tr>
              ))}
            </>
          )}
          {!loading && data.length === 0 && (
            <tr className="data-table__row">
              <td className="data-table__cell data-table__empty" colSpan={totalColumns}>
                {emptyMessage}
              </td>
            </tr>
          )}
          {!loading &&
            data.map((row, index) => {
              const rowId = getRowId(row, index);
              const isSelected = selectedRowIds.includes(rowId);

              return (
                <tr
                  key={rowId}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  style={onRowClick ? { cursor: "pointer" } : undefined}
                  className={`data-table__row ${isSelected ? "data-table__row--selected" : ""}`.trim()}
                >
                  {enableCheckbox && (
                    <td className="data-table__cell data-table__checkbox-cell">
                      <button
                        className={`data-table__checkbox ${isSelected ? "data-table__checkbox--checked" : ""}`.trim()}
                        type="button"
                        aria-pressed={isSelected}
                        aria-label="Select row"
                        onClick={() => onToggleRow?.(rowId)}
                        disabled={!onToggleRow}
                      >
                        {isSelected ? <Check size={12} /> : null}
                      </button>
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={`${column.id}-${rowId}`}
                      className={[
                        "data-table__cell",
                        column.align ? `data-table__cell--${column.align}` : "",
                        column.hideOnMobile ? "data-table__cell--mobile-hidden" : "",
                        column.cellClassName ?? "",
                      ].join(" ").trim()}
                    >
                      {buildCellValue(row, column)}
                    </td>
                  ))}
                </tr>
              );
            })}
        </tbody>
      </table>

      <div className="data-table__pagination">
      {/* Left: summary text */}
      <div className="data-table__pagination-summary">
        {totalCount === 0 ? (
          "No records"
        ) : (
          <>
            Showing <strong>{rangeStart}</strong> to <strong>{rangeEnd}</strong> of{" "}
            <strong>{totalCount}</strong> results
          </>
        )}
      </div>

      {onPageSizeChange && (
  <div className="data-table__page-size">
    <span className="data-table__page-size-label">Rows per page</span>
    <div className="data-table__page-size-group">
      {pageSizeOptions.map((size) => (
        <button
          key={size}
          type="button"
          className={`data-table__page-size-btn ${
            size === pageSize ? "data-table__page-size-btn--active" : ""
          }`}
          onClick={() => {
            onPageSizeChange(size);
            onPageChange(1);
          }}
        >
          {size}
        </button>
      ))}
    </div>
  </div>
)}
 
      <div className="data-table__pagination-controls">
        {/* Prev arrow */}
        <button
          className="data-table__page-arrow"
          type="button"
          onClick={handlePrev}
          disabled={safeCurrentPage <= 1}
          aria-label="Previous page"
        >
          ‹
        </button>
 
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={`data-table__page-number ${
              page === safeCurrentPage ? "data-table__page-number--active" : ""
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
 
        <button
          className="data-table__page-arrow"
          type="button"
          onClick={handleNext}
          disabled={safeCurrentPage >= totalPages}
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </div>
    </div>
  );
};
