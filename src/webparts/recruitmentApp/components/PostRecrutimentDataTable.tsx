import * as React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "../App.css";
import { TextField } from "office-ui-fabric-react";
import { Icon } from "@fluentui/react";
import ReuseButton from "./ReuseButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import { FilterMatchMode } from "primereact/api";
import { AutoCompleteItem } from "../Models/Screens";
import CustomAutoComplete from "./CustomAutoComplete";

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
  UploadCV?: string;
  totalItem?: number;
  pagination: { first: number; rows: number; totalPages: number };
}
export type FilterData = {
  Department: AutoCompleteItem;
  DepartmentOption: AutoCompleteItem[];
  BusinessUnitCode: AutoCompleteItem;
  BusinessUnitCodeOption: AutoCompleteItem[];
  BusinessUnitName: AutoCompleteItem;
  BusinessUnitNameOption: AutoCompleteItem[];
  JobTitle: AutoCompleteItem;
  JobTitleOption: AutoCompleteItem[];
  WorkflowStatus: AutoCompleteItem;
  WorkflowStatusOption: AutoCompleteItem[];
};

const PostRecrutimentDataTable: React.FC<SearchableDataTableProps> = ({
  data,
  columns,
  rows,
  onPageChange,
  handleRefresh,
  pagination,
  UploadCV,
}) => {
  const [filteredItems, setFilteredItems] = React.useState<any[]>(data);
  const [dashboardSearch, setDashboardSearch] = React.useState<any>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [FilterData, setFilterData] = React.useState<FilterData>({
    Department: { key: 0, text: "" },
    BusinessUnitCode: { key: 0, text: "" },
    JobTitle: { key: 0, text: "" },
    BusinessUnitName: { key: 0, text: "" },
    DepartmentOption: [],
    BusinessUnitCodeOption: [],
    JobTitleOption: [],
    BusinessUnitNameOption: [],
    WorkflowStatus: { key: 0, text: "" },
    WorkflowStatusOption: [],
  });
  // const [totalItem, setTotalItem] = React.useState<number>(0);

  React.useEffect(() => {
    console.log(data, "data");

    // const PagewiseData =
    //   pagination.totalPages === 0
    //     ? data
    //     : data.slice(pagination.first, pagination.first + pagination.rows);
    setFilteredItems(data);
    // setTotalItem(data[0]?.TotalItems ?? data.length);
    const workflowStatusoption: AutoCompleteItem[] = Array.from(
      data.map((sta) => ({
        key: sta.StatusID,
        text: sta.Status,
      }))
    );

    setFilterData((prev) => ({
      ...prev,
      WorkflowStatusOption: workflowStatusoption,
    }));
  }, [data]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;

    setDashboardSearch({
      global: {
        value: searchValue,
        matchMode: FilterMatchMode.CONTAINS,
      },
    });

    const filtered = data.filter((item: any) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchValue.toLowerCase())
      )
    );

    setFilteredItems(filtered);
  };

  React.useEffect(() => {
    // setTotalItem(filteredItems[0]?.TotalItems ?? filteredItems.length);
  }, [filteredItems]);

  const search_fn = (field: string, item: AutoCompleteItem) => {
    let filtered = data.filter((i) => {
      if (field === "Department") return i.Department === item.text;
      if (field === "BusinessUnitCode") return i.BusinessUnitCode === item.text;
      if (field === "JobTitle") return i.JobTitle === item.text;
      if (field === "WorkflowStatus") return i.Status === item.text;
      return false;
    });

    setFilteredItems(filtered);
  };

  const handleAutoComplete = (
    field: keyof FilterData,
    item: AutoCompleteItem | null
  ) => {
    setFilterData((prev) => ({
      ...prev,
      [field]: item ?? { key: 0, text: "" },
    }));
    if (!item) {
      if (field === "JobTitle") {
        setFilterData((prev) => ({
          ...prev,
          JobTitle: { key: 0, text: "" },
        }));
        setFilteredItems(
          data.filter((row) => {
            return (
              (!FilterData.Department.text ||
                row.Department === FilterData.Department.text) &&
              (!FilterData.BusinessUnitCode.text ||
                row.BusinessUnitCode === FilterData.BusinessUnitCode.text)
            );
          })
        );
      } else if (field === "BusinessUnitCode") {
        setFilterData((prev) => ({
          ...prev,
          BusinessUnitCode: { key: 0, text: "" },
          JobTitleOption: [],
          JobTitle: { key: 0, text: "" },
        }));
        setFilteredItems(
          data.filter((row) => {
            return (
              !FilterData.Department.text ||
              row.Department === FilterData.Department.text
            );
          })
        );
      } else if (field === "Department") {
        setFilterData((prev) => ({
          ...prev,
          Department: { key: 0, text: "" },
          BusinessUnitCodeOption: [],
          JobCodeOption: [],
          BusinessUnitCode: { key: 0, text: "" },
          JobTitle: { key: 0, text: "" },
        }));
        setFilteredItems(data);
      } else if (field === "WorkflowStatus") {
        setFilteredItems(data);
      }
      return;
    }

    search_fn(field, item);

    if (field === "Department") {
      const departmentToBU = data.filter(
        (row) => row.Department === item?.text
      );
      const businessUnitOptions: AutoCompleteItem[] = Array.from(
        new Set(departmentToBU.map((row) => row.BusinessUnitCode))
      ).map((buCode) => ({
        key: buCode,
        text: buCode,
      }));

      const jobCodeOptions: AutoCompleteItem[] = Array.from(
        new Set(departmentToBU.map((row) => row.JobTitle))
      ).map((JobTitle) => ({
        key: JobTitle,
        text: JobTitle,
      }));

      setFilterData((prev) => ({
        ...prev,
        BusinessUnitCodeOption: businessUnitOptions,
        JobCodeOption: jobCodeOptions,
        BusinessUnitCode: { key: 0, text: "" },
        JobTitle: { key: 0, text: "" },
      }));
    }

    if (field === "BusinessUnitCode") {
      const buToJobCode = data.filter(
        (row) => row.BusinessUnitCode === item?.text
      );
      const jobCodeOptions: AutoCompleteItem[] = buToJobCode.map((item) => ({
        key: item.ID,
        text: item?.JobTitle,
      }));

      setFilterData((prev) => ({
        ...prev,
        JobTitleOption: jobCodeOptions,
        JobTitle: { key: 0, text: "" },
      }));
    }
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
        <div className="ms-Grid-col ms-lg2">
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
            Style={{ marginRight: "11px", minWidth: "54%", height: "31px" }}
          />
        </div>
      </div>
      <div className="ms_Grid-row">
        <div className="ms-Grid-col ms-lg3">
          <CustomAutoComplete
            label="Department"
            options={Array.from(new Set(data.map((row) => row.Department))).map(
              (department) => ({
                key: department,
                text: department,
              })
            )}
            value={FilterData.Department}
            disabled={false}
            onChange={(item) => handleAutoComplete("Department", item)}
            MinHeight={"1px"}
          />
        </div>
        <div className="ms-Grid-col ms-lg3">
          <CustomAutoComplete
            label="Business Unit Code"
            options={FilterData.BusinessUnitCodeOption ?? []}
            value={FilterData.BusinessUnitCode}
            disabled={false}
            onChange={(item) => handleAutoComplete("BusinessUnitCode", item)}
            MinHeight={"1px"}
          />
        </div>
        <div className="ms-Grid-col ms-lg3">
          <CustomAutoComplete
            label="Job Title"
            options={FilterData.JobTitleOption ?? []}
            value={FilterData.JobTitle}
            disabled={false}
            onChange={(item) => handleAutoComplete("JobTitle", item)}
            MinHeight={"1px"}
          />
        </div>
        <div className="ms-Grid-col ms-lg3">
          <CustomAutoComplete
            label="Workflow Status"
            options={FilterData.WorkflowStatusOption ?? []}
            value={FilterData.WorkflowStatus}
            disabled={false}
            onChange={(item) => handleAutoComplete("WorkflowStatus", item)}
            MinHeight={"1px"}
          />
        </div>
      </div>
      <div className="ms-Grid-row" style={{ marginTop: "2%" }}>
        <div className="ms-Grid-col ms-lg12">
          <DataTable
            className="normalTable"
            value={filteredItems}
            // lazy
            rows={rows}
            // first={pagination.first}
            totalRecords={filteredItems[0]?.TotalItems ?? filteredItems.length}
            // onPage={(event) => {
            //   onPageChange(event);
            // }}
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            scrollable
            scrollHeight="40vh"
            // paginatorDropdownAppendTo="self"
            rowsPerPageOptions={[5, 10, 20]}
            paginator
            stripedRows
            filters={dashboardSearch}
            // onFilter={(e) => setFilteredItems(e.filteredValue || data)}
            // style={{ overflow: "visible" }}
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

export default PostRecrutimentDataTable;
