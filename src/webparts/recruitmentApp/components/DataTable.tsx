import * as React from "react";
import {
  DataTable,
  DataTablePageEvent,
  DataTableSortEvent,
  SortOrder,
} from "primereact/datatable";
import { Column } from "primereact/column";
import SignatureCheckbox from "./SignatureCheckbox";

export const buildGlobalFilter = (search: any, fields: string[]) => {
  if (!search || !fields.length) return "";

  const s = search.replace(/'/g, "''");

  return `(${fields.map((f) => `substringof('${s}', ${f})`).join(" or ")})`;
};

export const buildFinalFilter = (
  baseFilter: string,
  globalFilter: string
): string => {
  if (baseFilter && globalFilter) {
    return `(${baseFilter}) and ${globalFilter}`;
  }
  return baseFilter || globalFilter || "";
};

export type ColumnConfig = {
  field: string;
  header: string;
  sortable?: boolean;
  body?: (rowData: any, options?: any) => React.ReactNode;
  style?: React.CSSProperties;
};

export type LazyParams = {
  first: number;
  rows: number;
  totalPages: number;
  sortField?: string;
  sortOrder?: 1 | -1;
  globalFilter?: string;
  searchFields?: string[];
};

type DataTableProps = {
  data: any[];
  totalRecords: number;
  loading: boolean;

  rows: number;
  first: number;

  sortField?: string;
  sortOrder?: SortOrder;

  columns: ColumnConfig[];

  onPageChange: (e: DataTablePageEvent) => void;
  onSort: (e: DataTableSortEvent) => void;

  dataKey?: string;

  isAllSelected?: boolean;
  onRowSelectChange?: (checked: boolean, row: any) => void;
  onSelectAllChange?: (checked: boolean, rows: any[]) => void;
};

const LazyDataTable: React.FC<DataTableProps> = ({
  data,
  totalRecords,
  loading,
  rows,
  first,
  sortField,
  sortOrder,
  columns,
  onPageChange,
  onSort,
  dataKey,
  isAllSelected,
  onRowSelectChange,
  onSelectAllChange,
}) => {
  return (
    <DataTable
      value={data}
      lazy
      paginator
      // dataKey={"data.ID"}
      rows={rows}
      first={first}
      totalRecords={data[0]?.totalRecords}
      loading={loading}
      onPage={onPageChange}
      onSort={onSort}
      sortField={sortField}
      sortOrder={sortOrder}
      rowsPerPageOptions={[5, 10, 20]}
      scrollable
      scrollHeight="40vh"
    >
      {columns.map((col) => {
        if (col.field === "Checkbox") {
          return (
            <Column
              header={() => (
                <SignatureCheckbox
                  label=""
                  checked={!!isAllSelected}
                  onChange={(checked: boolean) =>
                    onSelectAllChange?.(checked, data)
                  }
                />
              )}
              body={(rowData: any) => (
                <SignatureCheckbox
                  label=""
                  checked={!!rowData?.Checked}
                  onChange={(checked: boolean) =>
                    onRowSelectChange?.(checked, rowData)
                  }
                />
              )}
              style={{ width: "3rem" }}
            />
          );
        }

        return (
          <Column
            key={col.field}
            field={col.field}
            header={col.header}
            sortable={col.sortable}
            body={col.body}
            style={col.style}
          />
        );
      })}
    </DataTable>
  );
};

export default LazyDataTable;
