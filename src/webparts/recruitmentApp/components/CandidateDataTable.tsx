import * as React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TextField } from "office-ui-fabric-react";
import { Icon } from "@fluentui/react";
import ReuseButton from "./ReuseButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import { FilterMatchMode } from "primereact/api";
import CandidateCheckbox from "./CandidateCheckbox";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import CustomTextArea from "./CustomTextArea";
import { ColorCode } from "../utilities/Config";
import { alertPropsData } from "../Models/Screens";
import CustomAlert from "./CustomAlert/CustomAlert";

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
  onStatusChange: (selectedCandidates: any[]) => void;
}

interface Candidate {
  Status: string;
  ApplicantName: string;
  GPA: string;
  [key: string]: any;
}

const CandidateDataTable: React.FC<SearchableDataTableProps> = ({
  data,
  columns,
  rows,
  onPageChange,
  handleRefresh,
  onStatusChange,
}) => {
  const [filteredItems, setFilteredItems] = React.useState<any[]>(data);
  const [dashboardSearch, setDashboardSearch] = React.useState<any>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [selectedCandidates, setSelectedCandidates] = React.useState<any[]>([]);
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const [AlertPopupOpen, setAlertPopupOpen] = React.useState<boolean>(false);
  const [alertProps, setalertProps] = React.useState<alertPropsData>({
    Message: "",
    Type: "",
    ButtonAction: null,
    visible: false,
  });
  const [pagination, setPagination] = React.useState({ first: 0, rows: rows });
  const [CommentsData, setComments] = React.useState<string>("");
  interface ValidationError {
    Comments: boolean;
  }

  const [validationErrors, setValidationErrors] =
    React.useState<ValidationError>({
      Comments: false,
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

  const isCheckboxDisabled = (candidate: Candidate) =>
    candidate.Status === "Selected" ||
    candidate.Status === "OnHold by HOD" ||
    candidate.Status === "Rejected by HOD";

  const handleCheckbox = (checked: boolean, candidate: Candidate) => {
    if (checked) {
      setSelectedCandidates((prev) => [...prev, candidate]);
    } else {
      setSelectedCandidates((prev) => prev.filter((c) => c !== candidate));
    }
  };

  const onSelectAllChange = (value: boolean) => {
    const currentPageItems = filteredItems.slice(
      pagination.first,
      pagination.first + pagination.rows
    );
    const allValid = currentPageItems.filter(
      (item) => !isCheckboxDisabled(item)
    );
    if (value) {
      const newSelections = allValid.filter(
        (candidate) => !selectedCandidates.includes(candidate)
      );
      setSelectedCandidates([...selectedCandidates, ...newSelections]);
    } else {
      setSelectedCandidates(
        selectedCandidates.filter((candidate) => !allValid.includes(candidate))
      );
    }
  };

  const handleRejectAllClick = () => {
    if (selectedCandidates.length > 0) {
      setIsPopupOpen(true);
    } else {
      let CancelAlert = {
        Message: "Please select at least one candidate to reject.",
        Type: "Error",
        visible: true,
        ButtonAction: async (userClickedOK: boolean) => {
          if (userClickedOK) {
            setAlertPopupOpen(false);
          }
        },
      };

      setAlertPopupOpen(true);
      setalertProps(CancelAlert);
    }
  };

  const handleInputChangeTextArea = (value: string) => {
    setComments(value);
    setValidationErrors((prevState) => ({
      ...prevState,
      Comments: false,
    }));
  };

  const handlePopupSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!CommentsData.trim()) {
      setValidationErrors((prevState) => ({
        ...prevState,
        Comments: true,
      }));
      return;
    }
    const updatedCandidates = selectedCandidates.map((candidate) => ({
      ...candidate,
      Comments: CommentsData,
    }));
    setIsPopupOpen(false);
    setComments("");
    onStatusChange(updatedCandidates);
  };

  const isSelected = (row: any) => selectedCandidates.includes(row);

  return (
    <div>
      <div className="ms-Grid-row">
        <div
          className="ms-Grid-col ms-lg9 search_div"
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
            Style={{ width: "100%", height: "31px" }}
          />
        </div>
        <div className="ms-Grid-col ms-lg2">
          <ReuseButton
            label="Reject All"
            onClick={handleRejectAllClick}
            spacing={4}
            Style={{ width: "72%", height: "31px" }}
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
            paginator
            rowsPerPageOptions={[5, 10, 20]}
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            stripedRows
            scrollable
            scrollHeight="40vh"
            paginatorDropdownAppendTo="self"
            filters={dashboardSearch}
            rowClassName={(rowData: Candidate) =>
              isCheckboxDisabled(rowData) ? "disabled-row" : ""
            }
          >
            {columns.map((col) => {
              if (col.field === "Checkbox") {
                return (
                  <Column
                    key={col.field}
                    header={() => {
                      const currentPageItems = filteredItems.slice(
                        pagination.first,
                        pagination.first + pagination.rows
                      );
                      const selectableItems = currentPageItems.filter(
                        (item) => !isCheckboxDisabled(item)
                      );
                      const allSelected =
                        selectableItems.length > 0 &&
                        selectableItems.every(isSelected);
                      return (
                        <CandidateCheckbox
                          label=""
                          checked={allSelected}
                          onChange={(value) => onSelectAllChange(value)}
                        />
                      );
                    }}
                    body={(rowData: any) => (
                      <CandidateCheckbox
                        label=""
                        checked={isSelected(rowData)}
                        onChange={(value: boolean) => {
                          handleCheckbox(value, rowData);
                        }}
                        disabled={isCheckboxDisabled(rowData)}
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
      <Dialog
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "26px",
            fontFamily: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
          },
        }}
        sx={{ overflow: "hidden" }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "16px 24px",
            color: ColorCode.LabelStyleColorCode.LabelStyleColor,
            fontWeight: "bold",
            position: "relative",
            marginTop: "8px",
          }}
        >
          <span style={{ flexGrow: 1, textAlign: "center" }}>
            Reject Candidates
          </span>
        </DialogTitle>

        <form onSubmit={handlePopupSubmit}>
          <DialogContent sx={{ pt: 1, marginTop: "-11px" }}>
            <div style={{ marginBottom: "16px" }}>
              <p
                style={{
                  fontWeight: 600,
                  marginBottom: "8px",
                  fontSize: "12px",
                  color: "rgb(50, 49, 48)",
                  fontFamily: `"Segoe UI", sans-serif`,
                }}
              >
                Selected Candidates:
              </p>
              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "8px",
                  maxHeight: "150px",
                  overflowY: "auto",
                }}
              >
                {selectedCandidates.map((candidate, index) => (
                  <p
                    key={index}
                    style={{
                      margin: "4px 0",
                      fontSize: "14px",
                      color: "rgb(50, 49, 48)",
                      fontFamily: `"Segoe UI", sans-serif`,
                    }}
                  >
                    {index + 1}. {candidate.FullName} - GPA: {candidate.GPA}
                  </p>
                ))}
              </div>
            </div>
            <CustomTextArea
              label="Reasons"
              value={CommentsData}
              onChange={(value) => handleInputChangeTextArea(value)}
              error={validationErrors.Comments}
              placeholder="Reason for Reject"
              mandatory={true}
            />
          </DialogContent>

          <DialogActions
            sx={{ p: 3, pt: 0, display: "flex", justifyContent: "center" }}
          >
            <Button
              onClick={() => setIsPopupOpen(false)}
              variant="outlined"
              sx={{
                borderColor: ColorCode.ButtonColorCode.ButtonColor,
                color: ColorCode.ButtonColorCode.color,
                backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
                textTransform: "capitalize",
                mr: 2.5,
                "&:hover": {
                  borderColor: ColorCode.ButtonColorCode.ButtonColor,
                  backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
                  color: ColorCode.ButtonColorCode.color,
                },
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="outlined"
              sx={{
                borderColor: ColorCode.ButtonColorCode.ButtonColor,
                color: ColorCode.ButtonColorCode.color,
                backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
                textTransform: "capitalize",
                mr: 2.5,
                "&:hover": {
                  borderColor: ColorCode.ButtonColorCode.ButtonColor,
                  backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
                  color: ColorCode.ButtonColorCode.color,
                },
              }}
            >
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {AlertPopupOpen && (
        <CustomAlert {...alertProps} onClose={() => setAlertPopupOpen(false)} />
      )}
    </div>
  );
};

export default CandidateDataTable;
