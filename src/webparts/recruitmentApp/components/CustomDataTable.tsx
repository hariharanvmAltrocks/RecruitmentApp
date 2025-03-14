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
  MasterData: any;
  handleAssignBtn?: () => void;
}
export type FilterData = {
  Department: AutoCompleteItem;
  DepartmentOption: AutoCompleteItem[];
  BusinessUnitCode: AutoCompleteItem;
  BusinessUnitCodeOption: AutoCompleteItem[];
  BusinessUnitName: AutoCompleteItem;
  BusinessUnitNameOption: AutoCompleteItem[];
};

const SearchableDataTable: React.FC<SearchableDataTableProps> = ({
  data,
  columns,
  rows,
  onPageChange,
  handleRefresh,
  MasterData,
  handleAssignBtn,
}) => {
  const [filteredItems, setFilteredItems] = React.useState<any[]>(data);
  // const [first, setFirst] = React.useState<number>(0);
  // const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [dashboardSearch, setDashboardSearch] = React.useState<any>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [FilterData, setFilterData] = React.useState<FilterData>({
    Department: { key: 0, text: "" },
    BusinessUnitCode: { key: 0, text: "" },
    BusinessUnitName: { key: 0, text: "" },
    DepartmentOption: [],
    BusinessUnitCodeOption: [],
    BusinessUnitNameOption: [],
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

  const search_fn = (field: string, item: AutoCompleteItem) => {
    let filtered = data.filter((i) => {
      if (field === "Department") return i.Department === item.text;
      if (field === "BusinessUnitCode") return i.BusinessUnitCode === item.text;
      if (field === "BusinessUnitName") return i.BusinessUnitCode === item.key;
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
      [field]: item,
    }));

    if (item) {
      search_fn(field, item);
    }
    if (field === "Department") {
      const DepatmentToBu = MasterData?.BuCodeToDepartmentMappingList.filter(
        (data: any) => data.DepartmentName === item?.text
      );
      const DepatrmentOption: AutoCompleteItem[] = DepatmentToBu.map(
        (item: { key: any; text: any }) => ({
          key: item.key,
          text: item.text,
        })
      );
      setFilterData((prev) => ({
        ...prev,
        BusinessUnitCodeOption: DepatrmentOption,
      }));
    }
    if (field === "BusinessUnitCode") {
      const BUCodeTOBUName = MasterData?.BusinessUnitCodeAllColumn.filter(
        (data: any) => data.text === item?.text
      );
      const BUNameOption: AutoCompleteItem[] = BUCodeTOBUName.map(
        (item: { Name: any; key: any; text: any }) => ({
          key: item.text,
          text: item.Name,
        })
      );
      setFilterData((prev) => ({
        ...prev,
        BusinessUnitNameOption: BUNameOption,
      }));
    }
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
        {handleAssignBtn && (
          <div className="ms-Grid-col ms-lg2">
            <ReuseButton
              label="Assign HR"
              onClick={handleAssignBtn}
              spacing={4}
              Style={{
                width: "fit-content",
                height: "35px",
              }}
            />
          </div>
        )}
      </div>
      <div
        className="ms_Grid-row"
        style={{ marginRight: "-12%", marginLeft: "5px" }}
      >
        <div className="ms-Grid-col ms-lg3">
          <CustomAutoComplete
            label="Department"
            options={MasterData?.Department}
            value={FilterData.Department}
            disabled={false}
            mandatory={true}
            onChange={(item) => handleAutoComplete("Department", item)}
          />
        </div>
        <div className="ms-Grid-col ms-lg3">
          <CustomAutoComplete
            label="Business Unit Code"
            options={FilterData.BusinessUnitCodeOption ?? []}
            value={FilterData.BusinessUnitCode}
            disabled={false}
            mandatory={true}
            onChange={(item) => handleAutoComplete("BusinessUnitCode", item)}
          />
        </div>
        <div className="ms-Grid-col ms-lg3">
          <CustomAutoComplete
            label="Business Unit Name"
            options={FilterData?.BusinessUnitNameOption ?? []}
            value={FilterData.BusinessUnitName}
            disabled={false}
            mandatory={true}
            onChange={(item) => handleAutoComplete("BusinessUnitName", item)}
          />
        </div>
      </div>
      <div className="ms-Grid-row" style={{ marginTop: "2%" }}>
        <div className="ms-Grid-col ms-lg12">
          <DataTable
            value={filteredItems}
            // first={first}
            rows={rows}
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            scrollable
            // scrollHeight="300px"
            rowsPerPageOptions={[5, 10, 20]}
            paginator
            // onPage={onPageChange}
            stripedRows
            filters={dashboardSearch}
          >
            {/* Render Dynamic Columns */}
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
    // </CustomLoader>
  );
};

export default SearchableDataTable;
