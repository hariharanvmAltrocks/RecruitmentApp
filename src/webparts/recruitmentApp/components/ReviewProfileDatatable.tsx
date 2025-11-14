import * as React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TextField } from "office-ui-fabric-react";
import ReuseButton from "./ReuseButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import { FilterMatchMode } from "primereact/api";
import { TabName } from "../utilities/Config";
import { Icon } from "@fluentui/react";

interface ColumnConfig {
  field: string;
  header: string | ((item?: any) => React.ReactNode);
  sortable: boolean;
  body?: (item?: any, index?: number, column?: ColumnConfig) => React.ReactNode;
  style?: React.CSSProperties;
}

interface SearchableDataTableProps {
  data: any[];
  columns: ColumnConfig[];
  rows: number;
  onPageChange: (event: any) => void;
  handleRefresh: () => void;
  totalItem?: number;
  pagination: { first: number; rows: number; totalPages: number };
  handleUploadCV?: () => void;
  UploadCV?: string;
}

const ReviewProfileDatatable: React.FC<SearchableDataTableProps> = ({
  data,
  columns,
  rows,
  onPageChange,
  handleRefresh,
  pagination,
  handleUploadCV,
  UploadCV,
}) => {
  const [filteredItems, setFilteredItems] = React.useState<any[]>([]);
  const [dashboardSearch, setDashboardSearch] = React.useState<any>({
    global: { value: "", matchMode: FilterMatchMode.CONTAINS },
  });
  const [totalItem, setTotalItem] = React.useState<number>(0);
  const [sortMeta, setSortMeta] = React.useState<any[]>([]);

  const fetchData = React.useCallback(() => {
    let result = [...data];

    const searchValue = dashboardSearch.global.value?.toLowerCase();
    if (searchValue) {
      result = result.filter((item: any) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchValue)
        )
      );
    }

    if (sortMeta.length) {
      sortMeta.forEach(({ field, order }) => {
        result.sort((a, b) => {
          const value1 = a[field];
          const value2 = b[field];
          const result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
          return order * result;
        });
      });
    }

    const paginated = result.slice(
      pagination.first,
      pagination.first + pagination.rows
    );

    setFilteredItems(paginated);
    setTotalItem(data[0]?.TotalItems === undefined ? 0 : data[0]?.TotalItems);
  }, [data, pagination, dashboardSearch, sortMeta]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDashboardSearch({
      global: {
        value: event.target.value,
        matchMode: FilterMatchMode.CONTAINS,
      },
    });
  };

  const handleSort = (event: any) => {
    const { multiSortMeta } = event;
    setSortMeta(multiSortMeta || []);
  };

  const handleReset = () => {
    setDashboardSearch({
      global: {
        value: "",
        matchMode: FilterMatchMode.CONTAINS,
      },
    });
    handleRefresh();
  };

  return (
    <div>
      {/* Search and action buttons */}
      <div className="ms-Grid-row">
        <div
          className="ms-Grid-col ms-lg9 search_div"
          style={{
            paddingLeft: "2%",
            position: "relative",
            display: "inline-block",
            height: "13px",
          }}
        >
          <TextField
            type="text"
            placeholder="Search..."
            styles={{
              fieldGroup: {
                borderRadius: "4px",
                boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
                borderColor: "#c9bdbd",
                height: "33px",
              },
            }}
            value={dashboardSearch.global.value}
            onChange={handleSearch}
          />
          <Icon
            iconName="Search"
            style={{
              fontSize: "20px",
              position: "absolute",
              top: "20%",
              right: "14px",
              color: "black",
            }}
          />
        </div>

        <div className="ms-Grid-col ms-lg1">
          <ReuseButton
            icon={
              <RefreshIcon
                style={{
                  fontSize: "38px",
                  marginTop: "1%",
                  marginLeft: "6%",
                  minWidth: "119px",
                  height: "30px",
                }}
              />
            }
            onClick={handleReset}
            spacing={4}
            Style={{ marginRight: "11px", minWidth: "100%", height: "31px" }}
          />
        </div>

        {UploadCV === TabName.UploadCV && (
          <div className="ms-Grid-col ms-lg1" style={{ marginLeft: "4%" }}>
            <ReuseButton
              label="Upload"
              onClick={handleUploadCV}
              spacing={4}
              Style={{ marginLeft: "-42px", minWidth: "100%", height: "31px" }}
            />
          </div>
        )}
      </div>

      {/* Table */}
      <div className="ms-Grid-row" style={{ marginTop: "1%" }}>
        <div className="ms-Grid-col ms-lg12">
          <DataTable
            value={filteredItems}
            lazy
            sortMode="multiple"
            multiSortMeta={sortMeta}
            onSort={handleSort}
            paginator
            rows={pagination.rows}
            first={pagination.first}
            totalRecords={totalItem}
            onPage={onPageChange}
            rowsPerPageOptions={[5, 10, 20]}
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            stripedRows
            scrollable
            scrollHeight="35vh"
            style={{ overflow: "visible" }}
            emptyMessage="No Record Found"
          >
            {columns.map((col) => (
              <Column
                key={col.field}
                field={col.field}
                header={col.header}
                sortable={col.sortable}
                body={col.body}
                style={col.style}
              />
            ))}
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default ReviewProfileDatatable;
