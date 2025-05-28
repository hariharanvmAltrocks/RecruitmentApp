import * as React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "../App.css";
import { TextField } from "office-ui-fabric-react";
import { Icon } from "@fluentui/react";
import ReuseButton from "./ReuseButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import { FilterMatchMode } from "primereact/api";

interface ColumnConfig {
  field: string;
  header: string;
  sortable: boolean;
  body?: (item?: any, index?: number, column?: ColumnConfig) => any;
  style?: React.CSSProperties;
}

interface SearchableDataTableProps {
  data: any[];
  columns: ColumnConfig[];
  rows: number;
  onPageChange: (event: any) => void;
  handleRefresh: () => void;
}
const InterviewPanelDataTable: React.FC<SearchableDataTableProps> = ({
  data,
  columns,
  rows,
  onPageChange,
  handleRefresh,
}) => {
  const [filteredItems, setFilteredItems] = React.useState<any[]>(data);
  const [dashboardSearch, setDashboardSearch] = React.useState<any>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  React.useEffect(() => {
    setFilteredItems(data);
  }, [data]);

  const handleSearch = (event: any) => {
    setDashboardSearch({
      global: {
        value: event.target.value,
        matchMode: FilterMatchMode.CONTAINS,
      },
    });
  };

  return (
    <div>
      <div className="ms-Grid-row">
        <div
          className="ms-Grid-col ms-lg10 search_div"
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
                height: "42px",
              },
            }}
            value={dashboardSearch.global.value}
            onChange={handleSearch}
          />
          <Icon
            iconName="Search"
            style={{
              fontSize: "28px",
              position: "absolute",
              top: "5%",
              right: "11px",
              color: "black",
            }}
          />
        </div>
        <div className="ms-Grid-col ms-lg2">
          <ReuseButton
            icon={
              <RefreshIcon
                style={{
                  fontSize: "38px",
                  marginTop: "1%",
                  marginLeft: "6%",
                  minWidth: "119px",
                  height: "43px",
                }}
              />
            }
            onClick={() => {
              setDashboardSearch({
                global: {
                  value: "",
                  matchMode: FilterMatchMode.CONTAINS,
                },
              });
              handleRefresh();
            }}
            spacing={4}
            height="33px"
            width="32%"
            Style={{ marginRight: "11px", minWidth: "118px", height: "42px" }}
          />
        </div>
      </div>

      <div className="ms-Grid-row" style={{ marginTop: "2%" }}>
        <div className="ms-Grid-col ms-lg12">
          <DataTable
            value={filteredItems}
            rows={rows}
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            scrollable
            scrollHeight="400px"
            paginatorDropdownAppendTo="self"
            rowsPerPageOptions={[5, 10, 20]}
            paginator
            stripedRows
            filters={dashboardSearch}
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

export default InterviewPanelDataTable;
