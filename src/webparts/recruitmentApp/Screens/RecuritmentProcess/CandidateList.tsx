import * as React from "react";
import { Card, CardContent } from "@mui/material";
import { getVRRDetails } from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import { TabName } from "../../utilities/Config";
import SearchableDataTable from "../../components/CustomDataTable";

import { Button } from "primereact/button";
import BreadcrumbsComponent, {
  TabNameData,
} from "../../components/CustomBreadcrumps";

const CandidateList = (props: any) => {
  // console.log("Received Props:", props);

  const [CandidateData, setCandidateData] = React.useState<any[]>([]);
  const [rows, setRows] = React.useState<number>(5);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [TabNameData, setTabNameData] = React.useState<TabNameData[]>([]);
  const [activeTab, setActiveTab] = React.useState<string>("tab1");
  const jobCode = props?.stateValue?.JobCode?.toString().trim();

  const Status = props?.stateValue?.Status;

  function handleRedirectView(
    rowData: any,
    tab: string,
    TabName: string,
    ButtonAction: string
  ) {
    if (tab === "tab1") {
      props.navigation("/RecurimentProcess/HodScoreCard", {
        state: {
          ID: rowData?.ID,
          tab,
          StatusId: rowData?.StatusId,
          Status: rowData?.Status,
          TabName,
          ButtonAction,
          JobPosition: rowData?.PositionTitle,
        },
      });
    }
  }

  const columnConfig = (tab: string, ButtonAction: string, TabName: string) => [
    { field: "ID", header: "Candidate ID", sortable: true },
    { field: "FullName", header: "Applicant Name", sortable: true },
    { field: "JobCode", header: "Job Code", sortable: true },
    { field: "PositionTitle", header: "Position Title", sortable: true },
    { field: "JobGrade", header: "Job Grade", sortable: true },
    { field: "GPA", header: "GPA", sortable: true },
    { field: "Status", header: "Status", sortable: true },
    {
      field: "Action",
      header: "Action",
      sortable: false,
      body: (rowData: any) => {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
            }}
          >
            {ButtonAction === "view" ? (
              <Button
                onClick={() =>
                  handleRedirectView(rowData, tab, TabName, ButtonAction)
                }
                className="table_btn"
                icon="pi pi-eye"
                style={{
                  width: "30px",
                  marginRight: "7px",
                  padding: "3px",
                }}
              />
            ) : (
              <Button
                onClick={() =>
                  handleRedirectView(rowData, tab, TabName, ButtonAction)
                }
                className="table_btn"
                style={{
                  width: "30px",
                  marginRight: "7px",
                  padding: "3px",
                }}
              >
                <img
                  src={require("../../assets/edit_icon.png")}
                  alt="Edit Icon"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const fetchCandidateData = async () => {
    if (!jobCode) {
      console.error("JobCode is missing");
      return;
    }

    setIsLoading(true);
    try {
      const filterConditions = [
        { FilterKey: "JobCode", Operator: "eq", FilterValue: jobCode },
      ];
      const response = await getVRRDetails.GetInterviewPanelCandidateDetails(
        " ",
        filterConditions
      );
      console.log("API Response:", response);

      if (response?.status === 200 && response?.data?.length) {
        const filteredCandidates = response.data
          .filter(
            (candidate: any) => candidate.JobCode?.toString().trim() === jobCode
          )
          .map((candidate: any) => ({
            ...candidate,
            Status: Status || candidate.Status,
          }));

        setCandidateData(filteredCandidates);
      } else {
        setCandidateData([]);
        console.warn("No candidates found.");
      }
    } catch (error) {
      console.error("Error fetching candidate data:", error);
      setCandidateData([]);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (jobCode) {
      fetchCandidateData().catch((error) =>
        console.error("Error in fetching candidate data:", error)
      );
    }
  }, [jobCode]);

  const onPageChange = (event: any) => {
    setRows(event.rows);
  };

  const tabs = [
    {
      label: TabName.ViewCandiadteDetails,
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
        >
          <CardContent>
            <SearchableDataTable
              data={CandidateData}
              columns={columnConfig(
                "tab1",
                "Edit",
                TabName.ViewCandiadteDetails
              )}
              rows={rows}
              onPageChange={onPageChange}
              handleRefresh={fetchCandidateData}
              MasterData={props || {}}
            />
          </CardContent>
        </Card>
      ),
    },
  ];

  const handleBreadcrumbChange = (newItem: string) => {
    setActiveTab(newItem);
    console.log("Breadcrumb changed to:", newItem);
  };

  React.useEffect(() => {
    const activeTabObj = tabs.find((item) => item.value === activeTab);

    if (activeTab === "tab1") {
      const newTabNames = [
        { tabName: props.stateValue?.TabName },
        { tabName: props.stateValue?.ButtonAction },
        { tabName: activeTabObj?.label },
      ];

      if (JSON.stringify(TabNameData) !== JSON.stringify(newTabNames)) {
        setTabNameData(newTabNames);
      }
    }
  }, [activeTab, tabs, props.stateValue, TabNameData]);

  return (
    <CustomLoader isLoading={isLoading}>
      <div className="menu-card">
        <BreadcrumbsComponent
          items={tabs}
          initialItem={activeTab}
          TabName={TabNameData}
          onBreadcrumbChange={handleBreadcrumbChange}
        />
      </div>
    </CustomLoader>
  );
};

export default CandidateList;
