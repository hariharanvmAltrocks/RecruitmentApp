import * as React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TextField } from "office-ui-fabric-react";
import { Icon } from "@fluentui/react";
import ReuseButton from "./ReuseButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import { FilterMatchMode } from "primereact/api";
import CustomCheckBox from "./CustomCheckBox";
import CustomAutoComplete from "./CustomAutoComplete";
import { FilterData } from "./CustomDataTable";
import { AutoCompleteItem } from "../Models/Screens";

interface ColumnConfig {
  field: string;
  header: string | ((item?: any) => React.ReactNode);
  sortable: boolean;
  body?: (item?: any, index?: number, column?: ColumnConfig) => React.ReactNode;
}

interface SearchableDataTableProps {
  data: any[];
  columns: ColumnConfig[];
  rows: number;
  onPageChange: (event: any) => void;
  handleAssignBtn: () => void;
  AssignBtnValidation: boolean;
  handleCheckbox: (value: any, rowData: any) => void;
  onSelectAllChange: (value: any) => void;
  selectAll: boolean;
  handleRefresh: () => void;
  assignLabel?: string;
  MasterData: any
}

const CheckboxDataTable: React.FC<SearchableDataTableProps> = ({
  data,
  columns,
  rows,
  onPageChange,
  handleAssignBtn,
  AssignBtnValidation,
  handleCheckbox,
  onSelectAllChange,
  handleRefresh,
  selectAll,
  assignLabel,
  MasterData
}) => {
  const [filteredItems, setFilteredItems] = React.useState<any[]>(data);
  // const [first, setFirst] = React.useState<number>(0);
  // const [isLoading, setIsLoading] = React.useState<boolean>(false);
  // const [assignbtnVisible, setAssignbtnVisible] = React.useState<boolean>(false);
  const [dashboardSearch, setDashboardSearch] = React.useState<any>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [FilterData, setFilterData] = React.useState<FilterData>({
    Department: { key: 0, text: "" },
    BusinessUnitCode: { key: 0, text: "" },
    BusinessUnitName: { key: 0, text: "" },
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

  const onSelectionChange = (event: any) => {
    const value = event.value;
    console.log(value);
  };

  const search_fn = (field: string, item: AutoCompleteItem) => {
    debugger;
    let filtered = data.filter(i => {
      if (field === "Department") return i.Department === item.text;
      if (field === "BusinessUnitCode") return i.BusinessUnitCode === item.text;
      if (field === "BusinessUnitName") return i.BusinessUnitCode === item.key;
      return false;
    });

    setFilteredItems(filtered);
  };

  const handleAutoComplete = (field: keyof FilterData, item: AutoCompleteItem | null) => {
    setFilterData(prev => ({
      ...prev,
      [field]: item,
    }));

    if (item) {
      search_fn(field, item);
    }
  };

  return (
    <>
      {/* <CustomLoader isLoading={isLoading}> */}
      <div>
        <div className="ms-Grid-row">
          <div
            className="ms-Grid-col ms-lg10 search_div"
            style={{
              paddingLeft: "2%",
              position: "relative",
              display: "inline-block",
            }}
          >
            <TextField
              type="text"
              placeholder="Search..."
              styles={{
                fieldGroup: {
                  borderRadius: "4px",
                  boxShadow: "0px 0px 4px 4px rgba(0,0,0,.1)",
                  borderColor: "red",
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
                top: "5%",
                right: "11px",
                color: "black",
              }}
            />
          </div>
          <div className="ms-Grid-col ms-lg1">
            <ReuseButton
              icon={
                <RefreshIcon
                  style={{
                    fontSize: "2rem",
                    marginTop: "4%",
                    marginLeft: "18%",
                  }}
                />
              }
              onClick={() => {
                setDashboardSearch({
                  global: {
                    value: "",
                    matchMode: FilterMatchMode.CONTAINS,
                  },
                })
                handleRefresh()
              }}
              spacing={4}
              height="33px"
              width="32%"
              Style={{ marginRight: "11px" }}
            />
          </div>
        </div>


        <div className="ms_Grid-row" style={{ marginLeft: "5px" }}>
          <div className="ms-Grid-col ms-lg3">
            <CustomAutoComplete
              label="Department"
              options={MasterData?.Department}
              value={FilterData.Department}
              disabled={false}
              mandatory={true}
              onChange={(item) => handleAutoComplete("Department", item)
              }
            />
          </div>
          <div className="ms-Grid-col ms-lg3">
            <CustomAutoComplete
              label="Business Unit Code"
              options={MasterData?.BusinessUnitCodeAllColumn
                .map((data: any) => ({
                  key: data.key,
                  text: data.text,
                }))}
              value={FilterData.BusinessUnitCode}
              disabled={false}
              mandatory={true}
              onChange={(item) => handleAutoComplete("BusinessUnitCode", item)
              }
            />
          </div>
          <div className="ms-Grid-col ms-lg3">
            <CustomAutoComplete
              label="Business Unit Name"
              options={Array.from(
                new Map(
                  MasterData?.BusinessUnitCodeAllColumn.map(
                    (data: any) => [data.Name, { key: data.text, text: data.Name }]
                  )
                ).values()
              ) as AutoCompleteItem[]}
              value={FilterData.BusinessUnitName}
              disabled={false}
              mandatory={true}
              onChange={(item) => handleAutoComplete("BusinessUnitName", item)
              }
            />
          </div>

          <div className="ms-Grid-col ms-lg3" style={{ marginTop: "4%" }}>
            <ReuseButton
              label={assignLabel}
              onClick={handleAssignBtn}
              spacing={4}
              error={AssignBtnValidation}
              Style={{ width: "78%" }}
            />
          </div>
        </div>

        <div className="ms-Grid-row" style={{ marginTop: "1%" }}>
          <div className="ms-Grid-col ms-lg12">
            <DataTable
              value={filteredItems}
              // first={first}
              rows={rows}
              paginator
              onSelectionChange={onSelectionChange}
              dataKey="id"
              paginatorTemplate=" RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
              currentPageReportTemplate="{first} to {last} of {totalRecords}"
              stripedRows
              scrollable
              // scrollHeight="300px"
              filters={dashboardSearch}
            >
              {columns.map((col) => {
                if (col.field === "Checkbox") {
                  return (
                    <Column
                      key={col.field}
                      header={() => (
                        <CustomCheckBox
                          label=""
                          value={selectAll}
                          onChange={(e, value: boolean) =>
                            onSelectAllChange(value)
                          }
                        />
                      )}
                      sortable={false}
                      body={(rowData: any) => {
                        return (
                          <div>
                            <CustomCheckBox
                              label=""
                              value={rowData?.Checked === true}
                              onChange={(e, value: boolean) =>
                                handleCheckbox(value, rowData)
                              }
                            />
                          </div>
                        );
                      }}
                    />
                  );
                }
                if (col.field === "Interviewed") {
                  return (
                    <Column
                      key={col.field}
                      header={col.header}
                      sortable={false}
                      body={(rowData: any) => {
                        return (
                          <div>
                            <CustomCheckBox
                              label=""
                              value={rowData?.Checked === true}
                              onChange={(e, value: boolean) =>
                                handleCheckbox(value, rowData)
                              }
                            />
                          </div>
                        );
                      }}
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
                  />
                );
              })}
            </DataTable>
          </div>
        </div>
      </div>
      {/* </CustomLoader> */}
    </>
  );
};

export default CheckboxDataTable;
