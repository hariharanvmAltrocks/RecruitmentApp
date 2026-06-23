import React, { ReactNode, useMemo, useState } from "react";
import { Check, Minus, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import "./DataTable.scss";
import * as strings from 'RecrutimentAppWebPartStrings';

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
  sortable?: boolean;
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
  sortBy?: string;
  sortOrder?: "asc" | "desc" | null;
  onSort?: (columnId: string, order: "asc" | "desc" | null) => void;
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
  pageSizeOptions = [10, 20, 50],
  onPageSizeChange,
  loading = false,
  emptyMessage = strings.NoRecordsFound,
  onRowClick,
  sortBy,
  sortOrder,
  onSort,
}: DataTableProps<T>) => {
  const [localSortConfig, setLocalSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | null;
  } | null>(null);

  const isColumnSortable = (column: DataTableColumn<T>): boolean => {
    if (column.sortable === false) return false;
    const idLower = column.id.toLowerCase();
    return !(
      idLower === "actions" ||
      idLower === "action" ||
      idLower === "actionarrow" ||
      idLower.includes("action") ||
      !column.header
    );
  };

  const compareValues = (aVal: any, bVal: any, direction: "asc" | "desc"): number => {
    if (aVal === undefined || aVal === null) aVal = "";
    if (bVal === undefined || bVal === null) bVal = "";

    const aNum = Number(aVal);
    const bNum = Number(bVal);
    if (!isNaN(aNum) && !isNaN(bNum) && aVal !== "" && bVal !== "") {
      return direction === "asc" ? aNum - bNum : bNum - aNum;
    }

    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();

    if (aStr < bStr) return direction === "asc" ? -1 : 1;
    if (aStr > bStr) return direction === "asc" ? 1 : -1;
    return 0;
  };

  const sortedData = useMemo(() => {
    const activeSort = onSort
      ? { key: sortBy, direction: sortOrder }
      : localSortConfig;

    if (!activeSort || !activeSort.key || !activeSort.direction) {
      return data;
    }

    const { key, direction } = activeSort;
    const col = columns.find((c) => c.id === key);
    if (!col) return data;

    return [...data].sort((a, b) => {
      const aVal = col.accessor ? a[col.accessor] : (a as any)[key];
      const bVal = col.accessor ? b[col.accessor] : (b as any)[key];
      return compareValues(aVal, bVal, direction);
    });
  }, [data, columns, sortBy, sortOrder, onSort, localSortConfig]);

  const handleSort = (columnId: string) => {
    let nextDirection: "asc" | "desc" | null = "asc";
    const currentDirection = onSort
      ? sortBy === columnId
        ? sortOrder
        : null
      : localSortConfig?.key === columnId
      ? localSortConfig.direction
      : null;

    if (currentDirection === "asc") {
      nextDirection = "desc";
    } else if (currentDirection === "desc") {
      nextDirection = null;
    } else {
      nextDirection = "asc";
    }

    if (onSort) {
      onSort(columnId, nextDirection);
    } else {
      setLocalSortConfig(nextDirection ? { key: columnId, direction: nextDirection } : null);
    }
  };

  const rowIds = useMemo(
    () => sortedData.map((row, index) => getRowId(row, index)),
    [sortedData, getRowId],
  );
  const allSelected =
    enableCheckbox &&
    rowIds.length > 0 &&
    rowIds.every((id) => selectedRowIds.includes(id));
  const someSelected =
    enableCheckbox &&
    rowIds.some((id) => selectedRowIds.includes(id)) &&
    !allSelected;

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const rangeStart =
    totalCount === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
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

  const skeletonRows = useMemo(
    () => Array.from({ length: 6 }, (_, index) => index),
    [],
  );
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
                  aria-label={strings.SelectAllRows}
                  onClick={onToggleAll}
                  disabled={!onToggleAll}
                >
                  {allSelected ? <Check size={12} /> : null}
                  {someSelected && !allSelected ? <Minus size={12} /> : null}
                </button>
              </th>
            )}
            {columns.map((column) => {
              const sortable = isColumnSortable(column);
              const currentDirection = onSort
                ? sortBy === column.id
                  ? sortOrder
                  : null
                : localSortConfig?.key === column.id
                ? localSortConfig.direction
                : null;

              return (
                <th
                  key={column.id}
                  className={[
                    "data-table__head-cell",
                    column.align ? `data-table__head-cell--${column.align}` : "",
                    column.hideOnMobile ? "data-table__cell--mobile-hidden" : "",
                    sortable ? "data-table__head-cell--sortable" : "",
                    column.headerClassName ?? "",
                  ]
                    .join(" ")
                    .trim()}
                  style={column.width ? { width: column.width } : undefined}
                  onClick={sortable ? () => handleSort(column.id) : undefined}
                >
                  <div className="data-table__header-content">
                    <span>{column.header}</span>
                    {sortable && (
                      <span className={`data-table__sort-icon ${currentDirection ? "data-table__sort-icon--active" : ""}`}>
                        {currentDirection === "asc" && <ArrowUp size={14} />}
                        {currentDirection === "desc" && <ArrowDown size={14} />}
                        {!currentDirection && <ArrowUpDown size={14} />}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
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
                        column.hideOnMobile
                          ? "data-table__cell--mobile-hidden"
                          : "",
                        column.cellClassName ?? "",
                      ]
                        .join(" ")
                        .trim()}
                    >
                      <div className="data-table__skeleton data-table__skeleton--short" />
                    </td>
                  ))}
                </tr>
              ))}
            </>
          )}
          {!loading && sortedData.length === 0 && (
            <tr className="data-table__row">
              <td
                className="data-table__cell data-table__empty"
                colSpan={totalColumns}
              >
                {emptyMessage}
              </td>
            </tr>
          )}
          {!loading &&
            sortedData.map((row, index) => {
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
                        aria-label={strings.SelectRow}
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
                        column.hideOnMobile
                          ? "data-table__cell--mobile-hidden"
                          : "",
                        column.cellClassName ?? "",
                      ]
                        .join(" ")
                        .trim()}
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
            strings.NoRecords
          ) : (
            <>
              {strings.Showing}<strong>{rangeStart}</strong> {strings.To}{" "}
              <strong>{rangeEnd}</strong> {strings.Of}<strong>{totalCount}</strong>{" "}
              {strings.Results}</>
          )}
        </div>

        {onPageSizeChange && (
          <div className="data-table__page-size">
            <span className="data-table__page-size-label">{strings.RowsPerPage}</span>
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
            aria-label={strings.PreviousPage}
          >
            ‹
          </button>

          {pages.map((page) => (
            <button
              key={page}
              type="button"
              className={`data-table__page-number ${
                page === safeCurrentPage
                  ? "data-table__page-number--active"
                  : ""
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
            aria-label={strings.NextPage}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};
