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
import { alertPropsData, AutoCompleteItem } from "../Models/Screens";
import SignatureCheckbox from "./SignatureCheckbox";
import {
  ColorCode,
  HRMSAlertOptions,
  NationalityOption,
  RecuritmentHRMsg,
} from "../utilities/Config";
import { SelectAll } from "@mui/icons-material";
import CustomAlert from "./CustomAlert/CustomAlert";
import CustomLoader from "../Services/Loader/CustomLoader";

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
  handleAssignBtn: () => void;
  AssignBtnValidation: boolean;
  handleSelectedRow: (item?: any[]) => void;
  onSelectAllRow: (item?: any[]) => void;
  // selectAll: boolean;
  handleRefresh: () => void;
  assignLabel?: string;
  MasterData: any;
}

const CheckboxDataTable: React.FC<SearchableDataTableProps> = ({
  data,
  columns,
  rows,
  onPageChange,
  handleAssignBtn,
  AssignBtnValidation,
  handleSelectedRow,
  onSelectAllRow,
  handleRefresh,
  // selectAll,
  assignLabel,
  MasterData,
}) => {
  const [filteredItems, setFilteredItems] = React.useState<any[]>(data);
  const [dashboardSearch, setDashboardSearch] = React.useState<any>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [FilterData, setFilterData] = React.useState<FilterData>({
    Department: { key: 0, text: "" },
    BusinessUnitCode: { key: 0, text: "" },
    JobCode: { key: 0, text: "" },
    DepartmentOption: [],
    BusinessUnitCodeOption: [],
    JobCodeOption: [],
    BusinessUnitNameOption: [], // Can be removed if not used elsewhere
    BusinessUnitName: { key: 0, text: "" }, // Can be removed if not used elsewhere
    Nationality: { key: 0, text: "" },
  });
  const [pagination, setPagination] = React.useState({ first: 0, rows: rows });
  const [selectAll, setSelectAll] = React.useState<boolean>(false);
  const [checkedData, setCheckedData] = React.useState<any[]>(data);
  const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  const [alertProps, setalertProps] = React.useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    setFilteredItems(data);
    setCheckedData(data);
    setFilterData((prev) => ({
      ...prev,
      JobCode: { key: 0, text: "" },
      BusinessUnitCode: { key: 0, text: "" },
      Department: { key: 0, text: "" },
      Nationality: { key: 0, text: "" },
    }));
    setSelectAll(!SelectAll);
  }, [data]);

  React.useEffect(() => {
    setSelectAll(!SelectAll);
    const updatedDataset = filteredItems.map((item, index) => {
      return {
        ...item,
        Checked: false,
      };
    });
    setFilteredItems(updatedDataset);
  }, [FilterData]);

  const handleSearch = (event: any) => {
    setDashboardSearch({
      global: {
        value: event.target.value,
        matchMode: FilterMatchMode.CONTAINS,
      },
    });
  };

  const search_fn = (field: string, item: AutoCompleteItem) => {
    let filtered = checkedData.filter((i) => {
      if (field === "Department") return i.Department === item.text;
      if (field === "BusinessUnitCode") return i.BusinessUnitCode === item.text;
      if (field === "JobCode") return i.JobCode === item.text;
      if (field === "Nationality") return i.Nationality === item.text;
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
        setFilteredItems(
          checkedData.filter((row) => {
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
          JobCodeOption: [],
          JobCode: { key: 0, text: "" },
        }));
        setFilteredItems(
          checkedData.filter((row) => {
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
          JobCode: { key: 0, text: "" },
        }));
        setFilteredItems(checkedData);
      } else if (field === "Nationality") {
        setFilterData((prev) => ({
          ...prev,
          Nationality: { key: 0, text: "" },
        }));
        setFilteredItems(checkedData);
      }
      return;
    }
    search_fn(field, item);

    if (field === "Department") {
      const departmentToBU = checkedData.filter(
        (row) => row.Department === item?.text
      );
      const businessUnitOptions: AutoCompleteItem[] = Array.from(
        new Set(departmentToBU.map((row) => row.BusinessUnitCode))
      ).map((buCode) => ({
        key: buCode,
        text: buCode,
      }));

      const jobCodeOptions: AutoCompleteItem[] = Array.from(
        new Set(departmentToBU.map((row) => row.JobCode))
      ).map((jobCode) => ({
        key: jobCode,
        text: jobCode,
      }));

      setFilterData((prev) => ({
        ...prev,
        BusinessUnitCodeOption: businessUnitOptions,
        JobCodeOption: jobCodeOptions,
        BusinessUnitCode: { key: 0, text: "" },
        JobCode: { key: 0, text: "" },
      }));
    }

    if (field === "BusinessUnitCode") {
      const buToJobCode = checkedData.filter(
        (row) => row.BusinessUnitCode === item?.text
      );

      const jobCodeOptions: AutoCompleteItem[] = Array.from(
        new Set(buToJobCode.map((row) => row.JobCode))
      ).map((jobCode) => ({
        key: jobCode,
        text: jobCode,
      }));

      setFilterData((prev) => ({
        ...prev,
        JobCodeOption: jobCodeOptions,
        JobCode: { key: 0, text: "" },
      }));
    }
  };

  const handleCheckbox = (value: boolean, item: any) => {
    const itemIdentifier = item.ID;
    const updatedDataset = filteredItems.map((currentItem) => {
      const currentItemIdentifier = currentItem.ID;
      if (currentItemIdentifier === itemIdentifier) {
        return { ...currentItem, Checked: value };
      }

      return currentItem;
    });
    let IsChecked = checkedData.some((item) => item.Checked === true);
    let currentdata = IsChecked ? checkedData : data;
    const updatedData = currentdata.map((currentItem) => {
      const currentItemIdentifier = currentItem.ID;

      if (currentItemIdentifier === itemIdentifier) {
        return { ...currentItem, Checked: value };
      }

      return currentItem;
    });
    setCheckedData(updatedData);
    setFilteredItems(updatedDataset);

    const allChecked = updatedDataset.every((item) => item.Checked === true);
    setSelectAll(allChecked);
    handleSelectedRow(updatedDataset);
  };

  const onSelectAllChange = (value: boolean, pagination?: any) => {
    if (FilterData.Nationality.text === "" && !selectAll) {
      let CancelAlert = {
        Message: RecuritmentHRMsg.NationalityErrorMsg,
        Type: HRMSAlertOptions.Error,
        visible: true,
        ButtonAction: async (userClickedOK: boolean) => {
          if (userClickedOK) {
            setAlertPopupOpen(false);
          }
        },
      };

      setAlertPopupOpen(true);
      setalertProps(CancelAlert);
      setIsLoading(false);
    } else {
      const updatedDataset = filteredItems.map((item, index) => {
        const isCurrentPageItem =
          index >= pagination.first &&
          index < pagination.first + pagination.rows;
        return {
          ...item,
          Checked: isCurrentPageItem ? value : item.Checked,
        };
      });
      setFilteredItems(updatedDataset);
      let IsChecked = checkedData.some((item) => item.Checked === true);
      let currentdata = IsChecked ? checkedData : data;
      const updatedData = currentdata.map((item, index) => {
        const isCurrentPageItem =
          index >= pagination.first &&
          index < pagination.first + pagination.rows;
        return {
          ...item,
          Checked: isCurrentPageItem ? value : item.Checked,
        };
      });
      setCheckedData(updatedData);
      const currentPageItems = updatedData.slice(
        pagination.first,
        pagination.first + pagination.rows
      );
      const allChecked = currentPageItems.every(
        (item) => item.Checked === true
      );
      setSelectAll(allChecked);
      onSelectAllRow(updatedDataset);
    }
  };
  return (
    <>
      <CustomLoader isLoading={isLoading}>
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
                height="33px"
                width="32%"
                Style={{ marginRight: "11px", minWidth: "54%", height: "31px" }}
              />
            </div>
          </div>

          <div
            className="ms_Grid-row"
            style={{ marginLeft: "5px", marginRight: "-12%" }}
          >
            <div className="ms-Grid-col ms-lg3">
              <CustomAutoComplete
                label="Department"
                options={Array.from(
                  new Set(data.map((row) => row.Department))
                ).map((department) => ({
                  key: department,
                  text: department,
                }))}
                value={FilterData.Department}
                disabled={false}
                onChange={(item) => handleAutoComplete("Department", item)}
                MinHeight={"1px"}
              />
            </div>
            <div className="ms-Grid-col ms-lg2">
              <CustomAutoComplete
                label="Business Unit Code"
                options={FilterData.BusinessUnitCodeOption ?? []}
                value={FilterData.BusinessUnitCode}
                disabled={false}
                onChange={(item) =>
                  handleAutoComplete("BusinessUnitCode", item)
                }
                MinHeight={"1px"}
              />
            </div>
            <div className="ms-Grid-col ms-lg2">
              <CustomAutoComplete
                label="Job Code"
                options={FilterData.JobCodeOption ?? []}
                value={FilterData.JobCode}
                disabled={false}
                onChange={(item) => handleAutoComplete("JobCode", item)}
                MinHeight={"1px"}
              />
            </div>
            <div className="ms-Grid-col ms-lg2">
              <CustomAutoComplete
                label="Nationality"
                options={NationalityOption ?? []}
                value={FilterData.Nationality}
                disabled={false}
                onChange={(item) => handleAutoComplete("Nationality", item)}
                MinHeight={"1px"}
              />
            </div>

            {/* {assignLabel === "Assign Agencies" ? (
              <></>
            ) : (
              <>
                <div className="ms-Grid-col ms-lg2">
                  <CustomAutoComplete
                    label="Nationality"
                    options={NationalityOption ?? []}
                    value={FilterData.Nationality}
                    disabled={false}
                    onChange={(item) => handleAutoComplete("Nationality", item)}
                    MinHeight={"1px"}
                  />
                </div>
              </>
            )} */}

            <div className="ms-Grid-col ms-lg2" style={{ marginTop: "43px" }}>
              <ReuseButton
                label={assignLabel}
                onClick={handleAssignBtn}
                spacing={4}
                error={AssignBtnValidation}
                Style={{
                  width: assignLabel === "Assign Agencies" ? "84%" : "64%",
                  backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
                  color: "white",
                  height: "30px",
                  lineHeight: "normal",
                  marginTop: "-4px",
                }}
              />
            </div>
          </div>

          <div className="ms-Grid-row" style={{ marginTop: "1%" }}>
            <div className="ms-Grid-col ms-lg12">
              <DataTable
                value={filteredItems}
                rows={pagination.rows}
                first={pagination.first}
                onPage={(e) => {
                  setPagination({ first: e.first, rows: e.rows });
                  onPageChange(e);
                }}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                scrollable
                scrollHeight="40vh"
                // paginatorDropdownAppendTo="self"
                rowsPerPageOptions={[5, 10, 20]}
                paginator
                filters={dashboardSearch}
                emptyMessage="No Record Found"
              >
                {columns.map((col) => {
                  if (col.field === "Checkbox") {
                    return (
                      <Column
                        key={col.field}
                        header={() => (
                          <SignatureCheckbox
                            label={""}
                            checked={selectAll}
                            onChange={(value: boolean) =>
                              onSelectAllChange(value, pagination)
                            }
                          />
                        )}
                        sortable={false}
                        body={(rowData: any) => (
                          <SignatureCheckbox
                            label={""}
                            checked={rowData?.Checked === true}
                            onChange={(value: boolean) =>
                              handleCheckbox(value, rowData)
                            }
                          />
                        )}
                      />
                    );
                  }
                  if (col.field === "Interviewed") {
                    return (
                      <Column
                        key={col.field}
                        header={col.header}
                        sortable={false}
                        body={(rowData: any) => (
                          <CustomCheckBox
                            label=""
                            value={rowData?.Checked === true}
                            onChange={(e, value: boolean) =>
                              handleCheckbox(value, rowData)
                            }
                          />
                        )}
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
            </div>
          </div>
        </div>
        {AlertPopupOpen ? (
          <CustomAlert
            {...alertProps}
            onClose={() => setAlertPopupOpen(false)}
          />
        ) : null}
      </CustomLoader>
    </>
  );
};

export default CheckboxDataTable;
