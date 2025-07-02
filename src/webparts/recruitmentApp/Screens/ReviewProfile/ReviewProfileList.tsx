import * as React from "react";
import { Card, CardContent } from "@mui/material";
//import { Link } from "@mui/material";
import { getVRRDetails } from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import TabsComponent from "../../components/TabsComponent ";
import {
  ActionIcon,
  ButtonAction,
  RoleID,
  StatusId,
  TabName,
  tabType,
} from "../../utilities/Config";

import InterviewPanelList from "../InterviewPanel/InterviewPanelList";
import SearchableDataTable from "../../components/CustomDataTable";
import { StatusDetails, TabDetails } from "../../Models/Master";

const ReviewProfileList = (props: any) => {
  console.log(props, "props in ReviewProfileList");

  const [RecuritmentData, setRecuritmentData] = React.useState<any[]>([]);
  const [rows, setRows] = React.useState<number>(5);
  // const [first, setFirst] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<string>("tab1");
  const [TabNameData, setTabNameData] = React.useState<TabDetails[]>(
    props.TabDetails[0]
  );
  const storedStringRef = React.useRef("");

  const handleRedirectView = (
    rowData: any,
    tab: string,
    TabNames: string,
    ButtonAction: string
  ): void => {
    switch (TabNames) {
      case TabName.ReviewProfile:
      case TabName.AssignInterviewPanel:
        props.navigation("/ReviewProfileList/ReviewCandidateList", {
          state: {
            ID: rowData?.ID,
            JobCode: rowData?.JobCode,
            JobCodeID: rowData?.JobCodeId,
            tab,
            StatusId: rowData?.StatusId,
            Status: rowData?.Status,
            TabNames,
            ButtonAction,
          },
        });
        break;
      case TabName.InterviewQuestion:
        props.navigation("/ReviewProfileList/InterviewQuesEdit", {
          state: {
            ID: rowData?.ID,
            AssignedHRId: rowData?.AssignedHRId,
            tab,
            StatusId: rowData?.StatusId,
            Status: rowData?.Status,
            JobTitleInEnglish: rowData.JobTitleEnglish,
            JobCode: rowData.JobCode,
            JobCodeID: rowData?.JobCodeId,
            TabNames,
            ButtonAction,
          },
        });
        break;
      default:
        props.navigation("/ReviewProfileList/ReviewCandidateList", {
          state: {
            ID: rowData?.ID,
            JobCode: rowData?.JobCode,
            JobCodeID: rowData?.JobCodeId,
            tab,
            StatusId: rowData?.StatusId,
            Status: rowData?.Status,
            TabNames,
            ButtonAction,
          },
        });
        break;
    }
  };

  const columnConfig = (
    tab: string,
    ButtonActions: number,
    TabName: string
  ) => [
    {
      field: "JobCode",
      header: "Job Code",
      sortable: true,
    },
    {
      field: "JobTitleEnglish",
      header: "Job Title",
      sortable: true,
    },
    {
      field: "BusinessUnitCode",
      header: "Business Unit Code",
      sortable: true,
    },
    {
      field: "Status",
      header: "Status",
      fieldName: "Status",
      sortable: false,
      body: (rowData: any) => {
        return <span>{rowData.Status}</span>;
      },
    },
    {
      field: "",
      header: "Action",
      style: { width: "8%" },
      sortable: false,
      body: (rowData: any) => {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px", // slightly more space for small screens
              flexWrap: "wrap", // allow wrapping on smaller screens
            }}
          >
            {ButtonActions === ActionIcon.Edit ? (
              <>
                <img
                  src={require("../../assets/Editbutton.svg")}
                  alt="Stamp Icon"
                  onClick={() =>
                    handleRedirectView(rowData, tab, TabName, ButtonAction.Edit)
                  }
                  style={{
                    width: "2rem", // scales with font size
                    height: "auto",
                    maxWidth: "40px", // limit maximum size
                    cursor: "pointer",
                  }}
                />
              </>
            ) : (
              <>
                <img
                  src={require("../../assets/Viewicon.svg")}
                  alt="Stamp Icon"
                  style={{
                    width: "2rem", // scales with font size
                    height: "auto",
                    maxWidth: "40px", // limit maximum size
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleRedirectView(rowData, tab, TabName, ButtonAction.View)
                  }
                />
              </>
            )}
          </div>
        );
      },
    },
  ];

  const fetchRecuritmentData = async (tabName: any[]) => {
    setIsLoading(true);
    try {
      let filterConditionsRecuritment = [];
      let RecuritmentConditions = "and";
      let TabValue = storedStringRef.current
        ? storedStringRef.current
        : props.stateValue?.TabName;
      switch (TabValue) {
        case TabName.ReviewProfile:
        case TabName.AssignInterviewPanel:
          filterConditionsRecuritment.push({
            FilterKey: "StatusId",
            Operator: "eq",
            FilterValue: StatusId.RecruitmentInProgress,
          });
          filterConditionsRecuritment.push({
            FilterKey: "ItemCreated",
            Operator: "eq",
            FilterValue: "No",
          });
          break;

        case TabName.InterviewQuestion:
          filterConditionsRecuritment.push({
            FilterKey: "StatusId",
            Operator: "eq",
            FilterValue: StatusId.PendingwithHRandLMtocreateinterviewQuestion,
          });
          filterConditionsRecuritment.push({
            FilterKey: "ItemCreated",
            Operator: "eq",
            FilterValue: "No",
          });
          break;
      }
      if (props.CurrentRoleID.includes(RoleID.LineManager)) {
        filterConditionsRecuritment.push({
          FilterKey: "LineManager",
          Operator: "eq",
          FilterValue: props.userDetails[0]?.EmailId,
        });
      } else if (props.CurrentRoleID.includes(RoleID.HOD)) {
        filterConditionsRecuritment.push({
          FilterKey: "HOD",
          Operator: "eq",
          FilterValue: props.userDetails[0]?.EmailId,
        });
      } else if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
        filterConditionsRecuritment.push({
          FilterKey: "AssignedHR",
          Operator: "eq",
          FilterValue: props.userDetails[0]?.EmailId,
        });
      }

      const data = await getVRRDetails.GetRecruitmentDetails(
        filterConditionsRecuritment,
        RecuritmentConditions
      );

      if (data.status === 200 && data.data !== null) {
        setRecuritmentData(data.data);
      }
    } catch (error) {
      console.error("Error fetching recruitment data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchRecuritmentData(props.TabDetails[0]);
        let TabDetails: any;
        if (props.CurrentRoleID.includes(RoleID.InterviewPanel)) {
          TabDetails = (props.TabDetails[0] ?? []).filter(
            (tab: any) => tab.TabName !== TabName.Evaluation
          );
        } else {
          TabDetails = props.TabDetails[0] ?? [];
        }
        setTabNameData(TabDetails);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };
    void fetchData();
  }, [activeTab]);

  React.useEffect(() => {
    if (props.stateValue) {
      storedStringRef.current = props.stateValue?.TabName;
      setActiveTab(props.stateValue?.tab);
    } else {
      if (!storedStringRef.current) {
        if (props.TabDetails[0]) {
          storedStringRef.current = props.TabDetails[0]?.[0]?.Value ?? "";
        }
      }
    }
  }, []);

  const onPageChange = (event: any) => {
    setRows(event.rows);
  };

  const handleRefresh = (tab: string) => {
    void fetchRecuritmentData(props.TabDetails[0]);
    setActiveTab(tab);
  };

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
  };

  const renderTable = (
    TabNames: string,
    TabValue: string,
    StatusData: StatusDetails[]
  ) => {
    // storedStringRef.current = "";
    if (TabValue === activeTab) {
      if (
        TabNames !== TabName.UploadAdvertisement &&
        TabNames !== TabName.AssignAgencies
      ) {
        storedStringRef.current = TabNames;
      } else {
        storedStringRef.current = "";
      }
    }
    let Action: any;
    let StatusID: any;
    if (StatusData) {
      Action = StatusData.filter((item) => item.Action);
      StatusID = StatusData.filter((item) => item.StatusId);
      console.log(StatusID, "StatusID");
    }

    switch (TabNames) {
      case TabName.ReviewProfile:
      case TabName.AssignInterviewPanel:
      case TabName.InterviewQuestion:
        return (
          <SearchableDataTable
            data={RecuritmentData}
            columns={columnConfig(TabValue, Action[0]?.ActionId?.[0], TabNames)}
            rows={rows}
            onPageChange={onPageChange}
            handleRefresh={() => handleRefresh(TabValue)}
            MasterData={props}
          />
        );
      case TabName.Evaluation:
        return <InterviewPanelList {...props} />;
      default:
        return null;
    }
  };

  const tabs = TabNameData.map((tab: TabDetails) => ({
    label: tab.TabName,
    value: tab.Value,
    content: (
      <Card
        variant="outlined"
        sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
      >
        <CardContent>
          <div>{renderTable(tab.TabName, tab.Value, tab.StatusDetails)}</div>
        </CardContent>
      </Card>
    ),
  }));

  return (
    <>
      <CustomLoader isLoading={isLoading}>
        <div className="menu-card">
          <React.Fragment>
            <TabsComponent
              tabs={tabs}
              initialTab={activeTab}
              tabtype={tabType.Dashboard}
              onTabChange={handleTabChange}
              // tabClassName={"Tab"}
            />
          </React.Fragment>
        </div>
      </CustomLoader>
    </>
  );
};
export default ReviewProfileList;
