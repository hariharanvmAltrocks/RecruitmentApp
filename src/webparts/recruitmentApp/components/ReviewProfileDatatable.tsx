import * as React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TextField } from "office-ui-fabric-react";
import { Icon } from "@fluentui/react";
import ReuseButton from "./ReuseButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import { FilterMatchMode } from "primereact/api";

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
}

const ReviewProfileDatatable: React.FC<SearchableDataTableProps> = ({
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
  const [totalItem, setTotalItem] = React.useState<number>(0);

  React.useEffect(() => {
    setFilteredItems(data);
    const totalItem = data.length > 0 ? data[0].TotalItems : 0;
    setTotalItem(totalItem);
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
    // <CustomLoader isLoading={isLoading}>
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
                // boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
                // borderColor: "red",
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
              // padding: '3px',
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
      <div className="ms-Grid-row" style={{ marginTop: "1%" }}>
        <div className="ms-Grid-col ms-lg12">
          <DataTable
            value={filteredItems}
            rows={rows}
            totalRecords={totalItem}
            paginator
            rowsPerPageOptions={[5, 10, 20]}
            onPage={(event) => {
              setFilteredItems(
                data.slice(event.first, event.first + event.rows)
              );
              onPageChange(event);
            }}
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            stripedRows
            scrollable
            scrollHeight="400px"
            paginatorDropdownAppendTo="self"
            filters={dashboardSearch}
            onFilter={(e) => setFilteredItems(e.filteredValue || data)}
            style={{ overflow: "hidden" }}
          >
            {columns.map((col) => {
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
        </div>
      </div>
      {/* <div className="ms-Grid-row" style={{ marginBottom: "2%" }}>
                    <div className="ms-Grid-col ms-lg6"></div>
                    <div
                        className="ms-Grid-col ms-lg6"
                        style={{ display: "flex", justifyContent: "end", marginLeft: "48%" }}
                    >
                        <div style={{ marginRight: "10px" }}>
                            <ReuseButton label="Submit" onClick={handleSubmit} spacing={4} />
                        </div>
                    </div>
                </div> */}
    </div>
    // </CustomLoader>
  );
};

export default ReviewProfileDatatable;
