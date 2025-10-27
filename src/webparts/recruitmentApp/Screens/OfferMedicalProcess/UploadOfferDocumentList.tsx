import * as React from "react";
import TabsComponent from "../../components/TabsComponent ";
import "../../App.css";
import {
  TabName,
  tabType,
  StatusId,
  workflowStatusApi,
  WorkflowAction,
  Choices,
} from "../../utilities/Config";
import CustomLoader from "../../Services/Loader/CustomLoader";
import { Card, CardContent } from "@mui/material";
import { StatusDetails, TabDetails } from "../../Models/Master";
import {
  GetPortalJobsService,
  OfferLetterServices,
} from "../../Services/ServiceExport";
import { DataSyncToResiProcess } from "../../Services/InitiateOfferLetter/IOfferLetterService";
import PostRecrutimentDataTable from "../../components/PostRecrutimentDataTable";
import { tabStyle } from "../../components/TabMerge";
import { ButtonAction } from "../../utilities/LabelName";

type tabcount = {
  CandidateDocumentCount: number;
};
const UploadOfferDocumentList = (props: any) => {
  const [data, setData] = React.useState<DataSyncToResiProcess[]>([]);
  const [rows, setRows] = React.useState<number>(5);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<string>("");
  const [TabNameData, setTabNameData] = React.useState<TabDetails[]>(
    props.TabDetails
  );
  const [pagination, setPagination] = React.useState({
    first: 0,
    rows: rows,
    totalPages: 1,
  });
  const [pendingcount, setPendingCount] = React.useState<tabcount>({
    CandidateDocumentCount: 0,
  });

  const OfferLettertabs = React.useRef("");

  const columnConfig = (
    tab: string,
    ButtonActions: number,
    TabNames: string
  ) => [
    {
      field: "PositionID",
      header: "Position ID",
      sortable: true,
    },
    {
      field: "BusinessUnitCode",
      header: "BusinessUnit Code",
      sortable: true,
    },
    {
      field: "Department",
      header: "Department",
      sortable: true,
    },
    {
      field: "JobTitle",
      header: "Job Title",
      sortable: true,
    },
    {
      field: "ApplicantName",
      header: "Applicant Name",
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
      field: "Action",
      header: "Action",
      sortable: false,
      style: { width: "8%" },
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
            {/* {ButtonActions === ActionIcon.Upload  */}
            {rowData?.StatusID ===
              StatusId.PendingwithRecruitmentHRtoUploadtheOfferLetter ||
            rowData?.StatusID ===
              StatusId.PendingwithRecruitmentHRtoreviewthemedicaldocanduploadtheofferLetter ||
            rowData?.StatusID ===
              StatusId.WorkPermitAcknowledgedContractUploaded ? (
              <>
                <img
                  src={require("../../assets/UploadIcon.svg")}
                  alt="Stamp Icon"
                  style={{
                    width: "50%",
                    height: "auto",
                    maxWidth: "40px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleRedirectView(
                      rowData,
                      tab,
                      TabNames,
                      ButtonAction.Upload
                    )
                  }
                />
              </>
            ) : // ButtonActions === ActionIcon.View
            rowData?.StatusID === StatusId.PendingBGdocuploadedbycandidate ||
              rowData?.StatusID ===
                StatusId.PendingwithCandidatetoSignOfferLetter ||
              rowData?.StatusID ===
                StatusId.PendingWorkPermituploadedbycandidate ||
              // rowData?.StatusID ===
              //   StatusId.PendingwithCandidatetoUploadOtherDocuments ||
              rowData?.StatusID ===
                StatusId.WorkPermitAcknowledgedContractUploaded ||
              rowData?.StatusID === StatusId.OnboardingProcessinitiatedforDRC ||
              rowData?.StatusID ===
                StatusId.OnboardingProcessinitiatedforExpat ||
              rowData?.StatusID ===
                StatusId.RevertedBacktoCandidateforReuploadOfferLetter ||
              rowData?.StatusID ===
                StatusId.RevertedBacktoCandidateforReuploadDocs ||
              rowData?.StatusID ===
                StatusId.RevertedBacktoCandidateforReuploadEmploymentContract ||
              rowData?.StatusID ===
                StatusId.PendingwithTAforMedicalScreening ? (
              <>
                <img
                  src={require("../../assets/Viewicon.svg")}
                  alt="Stamp Icon"
                  style={{
                    width: "50%",
                    height: "auto",
                    maxWidth: "40px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleRedirectView(
                      rowData,
                      tab,
                      TabNames,
                      ButtonAction.View
                    )
                  }
                />
              </>
            ) : rowData?.StatusID === StatusId.PendingHRBGVInitiation ? (
              <>
                <img
                  src={require("../../assets/Editbutton.svg")}
                  alt="Stamp Icon"
                  style={{
                    width: "50%",
                    height: "auto",
                    maxWidth: "40px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleRedirectView(
                      rowData,
                      tab,
                      TabNames,
                      ButtonAction.Initiated
                    )
                  }
                />
              </>
            ) : (
              <img
                src={require("../../assets/Review.svg")}
                alt="Stamp Icon"
                style={{
                  width: "50%",
                  height: "auto",
                  maxWidth: "40px",
                  cursor: "pointer",
                }}
                onClick={() =>
                  handleRedirectView(
                    rowData,
                    tab,
                    TabNames,
                    ButtonAction.Review
                  )
                }
              />
            )}
          </div>
        );
      },
    },
  ];

  async function handleRedirectView(
    rowData: any,
    tab: string,
    TabNames: string,
    ButtonAction: string
  ) {
    switch (TabNames) {
      case TabName.CandidateDocuments:
        props.navigation("/UploadOfferDocumentList/UploadDocument", {
          state: {
            type: rowData?.Location,
            ID: rowData?.ID,
            tab,
            StatusId: rowData?.StatusID,
            Status: rowData?.Status,
            TabName: TabNames,
            ButtonAction,
            JobCode: rowData?.RecruitmentDetails?.JobCode?.toString().trim(),
            JobCodeId: rowData?.RecruitmentDetails?.JobCodeId,
            JobTitle: rowData?.RecruitmentDetails?.JobTitleEnglish,
          },
        });
        break;

      default:
        console.warn("Unknown TabName:", TabNames);
        break;
    }
  }

  const fetchData = async (activeTab: string, row?: number) => {
    setIsLoading(true);
    try {
      let response: any;
      let filterConditions = [];
      let Conditions = "and";
      filterConditions.push({
        FilterKey: "StatusId",
        Operator: "in",
        FilterValue: [
          StatusId.PendingHRBGVInitiation,
          StatusId.PendingBGdocuploadedbycandidate,
          StatusId.PendingHRReviewBGCheck,
          StatusId.PendingHRReviewOfferWorkPermit,
          StatusId.PendingwithRecruitmentHRtoUploadtheOfferLetter,
          StatusId.PendingwithRecruitmentHRtoreviewthemedicaldocanduploadtheofferLetter,
          StatusId.PendingwithCandidatetoSignOfferLetter,
          StatusId.PendingHRReviewOfferWorkPermit,
          StatusId.PendingWorkPermituploadedbycandidate,
          StatusId.WorkPermitHRReview,
          StatusId.WorkPermitAcknowledgedContractUploaded,
          StatusId.HRReviewContractSigned,
          StatusId.PendingHRPreOnboardingChecklist,
          // StatusId.PendingwithCandidatetoUploadOtherDocuments,
          // StatusId.PendingwithRecruitmentHRtoReviewtheCandidatePersonalDocs,
          // StatusId.PendingwithRecruitmentHRtoUploadtheEmploymentContract,
          // StatusId.PendingwithCandidatetoSignEmploymentContract,
          // StatusId.pendingwithRecruitmentHRtoReviewtheEmploymentContractForm,
          // StatusId.OnboardingProcessinitiatedforDRC,
          // StatusId.OnboardingProcessinitiatedforExpat,
          // StatusId.RevertedBacktoCandidateforReuploadOfferLetter,
          // StatusId.RevertedBacktoCandidateforReuploadDocs,
          // StatusId.RevertedBacktoCandidateforReuploadEmploymentContract,
          // StatusId.PendingwithRecruitmentHRtoreviewtheCandidatePersonalDocsanduploadEmployementContract,
          // StatusId.PendingwithTAforMedicalScreening,
        ],
      });
      filterConditions.push({
        FilterKey: "ItemCreated",
        Operator: "eq",
        FilterValue: Choices.No,
      });
      filterConditions.push({
        FilterKey: "RecruitmentHR",
        Operator: "eq",
        FilterValue: props.userDetails[0]?.EmailId,
      });

      const respons = await OfferLetterServices.fetchResiCandidateDetails(
        filterConditions,
        Conditions
      );
      response = respons.data;
      let FilterDataCareerportal = respons.data.filter(
        (item) =>
          item.StatusID === StatusId.PendingwithCandidatetoSignOfferLetter ||
          // item.StatusID ===
          //   StatusId.PendingwithCandidatetoUploadOtherDocuments ||
          // item.StatusID ===
          //   StatusId.PendingwithCandidatetoSignEmploymentContract ||
          item.StatusID ===
            StatusId.RevertedBacktoCandidateforReuploadOfferLetter ||
          item.StatusID === StatusId.RevertedBacktoCandidateforReuploadDocs ||
          item.StatusID ===
            StatusId.RevertedBacktoCandidateforReuploadEmploymentContract
      );
      let FilterData = FilterDataCareerportal.map(
        (item) => item.CandidateDetails?.JobRequestID
      );
      let UpdatedStatus = await GetPortalJobsService.GetJobRequestData(
        FilterData
      );
      const getStatusById = (UpdatedStatus?.data?.data ?? []).map(
        (item: { jobRequestId: any; workflowStatusId: any }) => {
          const matchedRes = response.find(
            (res: any) =>
              res.CandidateDetails?.JobRequestID ===
                String(item.jobRequestId) &&
              [
                workflowStatusApi.CandidateuploadedtheSignedOfferLetter,
                workflowStatusApi.CandidateUploadedcandidatepersonalDocs,
                workflowStatusApi.UploadedthesignedEmployementcontractform,
              ].includes(item.workflowStatusId)
          );
          if (matchedRes) {
            return {
              ...item,
              ID: matchedRes?.ID,
              ActionId: WorkflowAction.Approved,
            };
          } else {
            return null;
          }
        }
      );
      let nullChecked = getStatusById.filter(
        (item: any) => item !== null && item !== undefined
      );
      if (nullChecked.length > 0) {
        await OfferLetterServices.UpdateStatusInSpfxlist(nullChecked);
      }
      setData(response);
      let DocumentCount = response.filter(
        (item: any) =>
          item.StatusID === StatusId.PendingHRBGVInitiation ||
          // item.StatusID === StatusId.PendingBGdocuploadedbycandidate
          item.StatusID === StatusId.PendingHRReviewBGCheck ||
          item.StatusID === StatusId.PendingHRReviewOfferWorkPermit ||
          item.StatusID ===
            StatusId.PendingwithRecruitmentHRtoUploadtheOfferLetter ||
          item.StatusID ===
            StatusId.PendingwithRecruitmentHRtoreviewthemedicaldocanduploadtheofferLetter ||
          item.StatusID ===
            StatusId.RevertedBacktoCandidateforReuploadOfferLetter ||
          item.StatusID === StatusId.WorkPermitHRReview ||
          item.StatusID === StatusId.WorkPermitAcknowledgedContractUploaded ||
          item.StatusID === StatusId.HRReviewContractSigned ||
          item.StatusID === StatusId.PendingHRPreOnboardingChecklist
        // item.StatusID ===
        //   StatusId.PendingwithRecruitmentHRtoreviewtheCandidatePersonalDocsanduploadEmployementContract
        // item.StatusID === StatusId.RevertedBacktoCandidateforReuploadDocs ||
        // item.StatusID ===
        //   StatusId.pendingwithRecruitmentHRtoReviewtheEmploymentContractForm ||
        // item.StatusID ===
        //   StatusId.RevertedBacktoCandidateforReuploadEmploymentContract
      );
      setPendingCount((prev) => ({
        ...prev,
        CandidateDocumentCount: DocumentCount.length,
      }));
    } catch (error) {
      console.log("GetVacancyDetails doesn't fetch the data", error);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    const fetchDataAndGetADGroupsOption = async () => {
      try {
        await fetchData(activeTab, rows);

        setTabNameData(props.TabDetails[0] ?? []);
      } catch (error) {
        console.error(error);
      }
    };

    void fetchDataAndGetADGroupsOption();
  }, [activeTab]);

  const handleRefresh = (tab: string) => {
    void fetchData(activeTab, rows);
  };

  React.useEffect(() => {
    if (props.stateValue) {
      OfferLettertabs.current = props.stateValue?.TabName;
      setActiveTab(props.stateValue?.tab);
    } else {
      if (!OfferLettertabs.current) {
        if (props.TabDetails[0]) {
          OfferLettertabs.current = props.TabDetails[0]?.[0]?.Value ?? "";
        }
      }
      setActiveTab("tab1");
    }
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
    void fetchData(activeTab, PageItem);
  };

  const renderTable = (
    TabNames: string,
    TabValue: string,
    StatusData: StatusDetails[]
  ) => {
    if (TabValue === activeTab) {
      OfferLettertabs.current = TabNames;
    }
    let Action: any;
    // let StatusID: any;
    if (StatusData) {
      Action = StatusData.filter((item) => item.Action);
      // StatusID = StatusData.filter((item) => item.StatusId);
    }
    switch (TabNames) {
      case TabName.CandidateDocuments:
        return (
          <PostRecrutimentDataTable
            data={data ?? []}
            columns={columnConfig(TabValue, Action[0]?.ActionId?.[0], TabNames)}
            rows={rows}
            onPageChange={onPageChange}
            handleRefresh={() => handleRefresh(TabValue)}
            pagination={pagination}
          />
        );
      default:
        return null;
    }
  };

  const getTabLabel = (tab: any) => {
    switch (tab.TabName) {
      case TabName.CandidateDocuments:
        return tabStyle(tab.TabName, pendingcount.CandidateDocumentCount);
      default:
        return tab.TabName;
    }
  };

  const tabs = TabNameData.map((tab: TabDetails) => ({
    label: getTabLabel(tab),
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

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
  };

  return (
    <>
      <CustomLoader isLoading={isLoading}>
        <React.Fragment>
          <div className="menu-card">
            <TabsComponent
              tabs={tabs}
              initialTab={activeTab}
              tabtype={tabType.Dashboard}
              onTabChange={handleTabChange}
            />
          </div>
        </React.Fragment>
      </CustomLoader>
    </>
  );
};
export default UploadOfferDocumentList;
