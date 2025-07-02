import * as React from "react";
import { Card, CardContent } from "@mui/material";
import { GetPortalJobsService } from "../../Services/ServiceExport";
import CustomLoader from "../../Services/Loader/CustomLoader";
import { ButtonAction, TabName, tabType } from "../../utilities/Config";
import BreadcrumbsComponent, {
  TabNameData,
} from "../../components/CustomBreadcrumps";
import ReviewProfileDatatable from "../../components/ReviewProfileDatatable";
import {
  GetProfileByFilter,
  GetProfileByJobCode,
} from "../../Models/ApIInterface";
import TabsComponent from "../../components/TabsComponent ";

const UploadCandidateList = (props: any) => {
  const [CandidateData, setCandidateData] = React.useState<
    GetProfileByJobCode[] | null
  >([]);
  const [rows, setRows] = React.useState<number>(5);
  // const [first, setFirst] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [activeTab, setactiveTab] = React.useState<string>("tab1");
  const [breadcrumbTab, setBreadcrumbTab] = React.useState<string>("tab1");
  const [TabNameData, setTabNameData] = React.useState<TabNameData[]>([]);
  const [pagination, setPagination] = React.useState({
    first: 0,
    rows: rows,
    totalPages: 1,
  });

  function handleRedirectView(
    rowData: any,
    tab: string,
    TabNamed: string,
    ButtonAction: string
  ): void {
    props.navigation(
      "/RecurimentProcess/UploadCandidateList/UploadCandidateCV",
      {
        state: {
          ID: rowData?.CandidateID,
          StatusId: rowData?.workflowStatusId,
          tab: props.stateValue?.tab,
          ButtonAction: ButtonAction,
          TabNamed,
          JobCodeID: props.stateValue?.JobCodeID,
          initialTab: props.stateValue?.TabNames,
          JobCode: props.stateValue?.JobCode,
          JobCodeId: props.stateValue?.JobCodeId,
          JobTitle: props.stateValue?.JobTitle,
        },
      }
    );
  }

  const columnConfig = (
    tab: string,
    ButtonActions: string,
    TabNames: string
  ) => [
    {
      field: "SNO",
      header: "S.No",
      sortable: true,
    },
    {
      field: "ApplicantName",
      header: "Applicant Name",
      sortable: true,
    },
    {
      field: "PositionTitle",
      header: "Position Title",
      sortable: true,
    },
    {
      field: "JobCode",
      header: "Job Code",
      sortable: true,
    },
    ...(tab === "tab1"
      ? [
          {
            field: "createdOn",
            header: "Profile Received Date",
            sortable: true,
          },
        ]
      : []),
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
      sortable: false,
      style: { width: "7%" },
      body: (rowData: any) => {
        return (
          <>
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
              <img
                src={require("../../assets/Viewicon.svg")}
                alt="Stamp Icon"
                onClick={() =>
                  handleRedirectView(rowData, tab, TabNames, ButtonAction.View)
                }
                style={{
                  width: "2rem", // scales with font size
                  height: "auto",
                  maxWidth: "40px", // limit maximum size
                  cursor: "pointer",
                }}
              />
            </div>
          </>
        );
      },
    },
  ];

  const fetchCandidateData = async (tabs: string, row?: number) => {
    setIsLoading(true);
    try {
      let FilterValue: GetProfileByFilter = {
        filterValue: "",
        sortBy: "",
        sortOrder: 0,
        pageSize: row ? row : rows,
        currentPage: 0,
        totalItems: 0,
      };

      await GetPortalJobsService.GetCandiateForJobs(
        props.stateValue?.JobCode,
        FilterValue
      )
        .then(async (res) => {
          setCandidateData(res.data);
        })
        .catch((error) => {
          console.log("Candidate details doesn't fetch the data", error);
        });
    } catch (error) {
      console.log("Candidate Api failed", error);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchCandidateData(breadcrumbTab);
    };
    void fetchData();
  }, []);

  const onPageChange = (event: any) => {
    // setFirst(event.first);
    setPagination({
      first: event.first,
      rows: event.rows,
      totalPages: event.totalPages,
    });
    setRows(event.rows);
    let PageItem = event.rows * event.totalPages;
    void fetchCandidateData(breadcrumbTab, PageItem);
  };
  const handleRefresh = (tab: string) => {
    setBreadcrumbTab(tab);
    void fetchCandidateData(tab);
  };

  const UploadCVNavigation = () => {
    props.navigation(
      "/RecurimentProcess/UploadCandidateList/UploadCandidateCV",
      {
        state: {
          tab: props.stateValue?.tab,
          JobCode: props.stateValue?.JobCode,
          JobCodeId: props.stateValue?.JobCodeId,
          JobTitle: props.stateValue?.JobTitle,
        },
      }
    );
  };

  const tabs = (tab: string) => [
    {
      label: TabName.ViewCandidateList,
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{
            boxShadow: "0px 2px 4px 3px #d3d3d3",
            marginTop: "2%",
            "& .MuiPaper-root-MuiCard-root": {
              overflow: "visible",
            },
          }}
        >
          <CardContent>
            <ReviewProfileDatatable
              data={CandidateData ?? []}
              columns={columnConfig(
                tab,
                ButtonAction.Edit,
                TabName.ReviewProfile
              )}
              rows={rows}
              onPageChange={onPageChange}
              handleRefresh={() => handleRefresh(tab)}
              pagination={pagination}
              handleUploadCV={UploadCVNavigation}
              UploadCV={TabName.UploadCV}
            />
          </CardContent>
        </Card>
      ),
    },
  ];

  const handleBreadcrumbChange = (newItem: string) => {
    setactiveTab(newItem);
  };

  React.useEffect(() => {
    const newTabNames = [
      { tabName: TabName.UploadCV },
      { tabName: ButtonAction.View },
      { tabName: TabName.ViewCandidateList },
    ];
    setTabNameData(newTabNames);
  }, [activeTab]);

  const breadcrumbs = [
    {
      label: TabName.UploadCV,
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{
            boxShadow: "0px 2px 4px 3px #d3d3d3",
            marginTop: "2%",
            "& .MuiPaper-root-MuiCard-root": {
              overflow: "visible", // make card content allow overflow
            },
          }}
        >
          <CardContent>
            <BreadcrumbsComponent
              items={tabs("tab1")}
              initialItem={activeTab}
              TabName={TabNameData}
              onBreadcrumbChange={handleBreadcrumbChange}
              additionalButtons={[
                {
                  label: "Back",
                  onClick: async () => {
                    back_fn();
                  },
                },
              ]}
            />
          </CardContent>
        </Card>
      ),
    },
  ];

  const handleTabChange = async (newTab: string) => {
    setBreadcrumbTab(newTab);
    await fetchCandidateData(newTab);
  };

  function back_fn() {
    props.navigation("/RecurimentProcess", {
      state: {
        tab: props.stateValue?.tab,
      },
    });
  }

  return (
    <>
      <>
        <CustomLoader isLoading={isLoading}>
          <div className="menu-card">
            <React.Fragment>
              <TabsComponent
                tabs={breadcrumbs}
                initialTab={breadcrumbTab}
                // tabClassName={"Tab"}
                tabtype={tabType.Dashboard}
                onTabChange={handleTabChange}
              />
            </React.Fragment>
          </div>
        </CustomLoader>
      </>
    </>
  );
};
export default UploadCandidateList;
