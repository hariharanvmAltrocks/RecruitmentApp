import * as React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import "../App.css";
import { TextField } from "office-ui-fabric-react";
import { Icon } from "@fluentui/react";
import ReuseButton from "./ReuseButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import { FilterMatchMode } from "primereact/api";
import { AutoCompleteItem } from "../Models/Screens";
import CustomAutoComplete from "./CustomAutoComplete";
import { ColorCode, NationalityOption, TabName } from "../utilities/Config";
import { labelNames } from "../utilities/LabelName";

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
  UploadCV?: string;
}
export type FilterData = {
  PositionRequest: AutoCompleteItem;
  PositionRequestOption: AutoCompleteItem[];
  BusinessUnitCode: AutoCompleteItem;
  BusinessUnitCodeOption: AutoCompleteItem[];
  BusinessUnitName: AutoCompleteItem;
  BusinessUnitNameOption: AutoCompleteItem[];
  JobCode: AutoCompleteItem;
  JobCodeOption: AutoCompleteItem[];
  Nationality: AutoCompleteItem;
};

const SearchableDataTable: React.FC<SearchableDataTableProps> = ({
  data,
  columns,
  rows,
  onPageChange,
  handleRefresh,
  handleAssignBtn,
  UploadCV,
}) => {
  const [filteredItems, setFilteredItems] = React.useState<any[]>(data);
  const [dashboardSearch, setDashboardSearch] = React.useState<any>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [FilterData, setFilterData] = React.useState<FilterData>({
    PositionRequest: { key: 0, text: "" },
    BusinessUnitCode: { key: 0, text: "" },
    JobCode: { key: 0, text: "" },
    BusinessUnitName: { key: 0, text: "" },
    PositionRequestOption: [],
    BusinessUnitCodeOption: [],
    JobCodeOption: [],
    BusinessUnitNameOption: [],
    Nationality: { key: 0, text: "" },
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
    let filtered = filteredItems.filter((i) => {
      if (field === "Department") return i.Department === item.text;
      if (field === "BusinessUnitCode") return i.BusinessUnitCode === item.text;
      if (field === "JobCode") return i.JobCode === item.text;
      if (field === "Nationality") return i.Nationality === item.text;
      if (field === "PositionRequest") return i.Type === item.text;
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
      if (field === "JobCode") {
        setFilterData((prev) => ({
          ...prev,
          JobCode: { key: 0, text: "" },
        }));
        setFilteredItems(filteredItems);
      } else if (field === "PositionRequest") {
        setFilterData((prev) => ({
          ...prev,
          PositionRequest: { key: 0, text: "" },
        }));
        setFilteredItems(filteredItems);
      } else if (field === "Nationality") {
        setFilterData((prev) => ({
          ...prev,
          Nationality: { key: 0, text: "" },
        }));
        setFilteredItems(filteredItems);
      }
      return;
    }
    search_fn(field, item);
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
      <div
        className="ms_Grid-row"
        style={{ marginRight: "-12%", marginLeft: "5px" }}
      >
        <div className="ms-Grid-col ms-lg3">
          <CustomAutoComplete
            label={labelNames.DashboardGridFilter.PositionRequest}
            options={Array.from(new Set(data.map((row) => row.Type))).map(
              (Type) => ({
                key: Type,
                text: Type,
              })
            )}
            value={FilterData.PositionRequest}
            disabled={false}
            onChange={(item) => handleAutoComplete("PositionRequest", item)}
            MinHeight={"1px"}
          />
        </div>
        <div className="ms-Grid-col ms-lg3">
          <CustomAutoComplete
            label={labelNames.DashboardGridFilter.Nationality}
            options={NationalityOption ?? []}
            value={FilterData.Nationality}
            disabled={false}
            onChange={(item) => handleAutoComplete("Nationality", item)}
            MinHeight={"1px"}
          />
        </div>
        <div className="ms-Grid-col ms-lg3">
          <CustomAutoComplete
            label={labelNames.DashboardGridFilter.JobCode}
            options={Array.from(new Set(data.map((row) => row.JobCode))).map(
              (JobCode) => ({
                key: JobCode,
                text: JobCode,
              })
            )}
            value={FilterData.JobCode}
            disabled={false}
            onChange={(item) => handleAutoComplete("JobCode", item)}
            MinHeight={"1px"}
          />
        </div>
        {UploadCV === TabName.UploadCV && (
          <div className="ms-Grid-col ms-lg2" style={{ marginTop: "43px" }}>
            <ReuseButton
              label={UploadCV === TabName.UploadCV ? "Upload" : ""}
              onClick={handleAssignBtn}
              spacing={4}
              // error={AssignBtnValidation}
              Style={{
                width: "80%",
                backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
                color: "white",
                height: "42px",
                lineHeight: "normal",
                marginTop: "1px",
              }}
            />
          </div>
        )}
      </div>
      <div className="ms-Grid-row" style={{ marginTop: "2%" }}>
        <div className="ms-Grid-col ms-lg12">
          <DataTable
            className="normalTable"
            value={filteredItems}
            rows={rows}
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            scrollable
            scrollHeight="40vh"
            // paginatorDropdownAppendTo="self"
            rowsPerPageOptions={[5, 10, 20]}
            paginator
            stripedRows
            filters={dashboardSearch}
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

export default SearchableDataTable;
