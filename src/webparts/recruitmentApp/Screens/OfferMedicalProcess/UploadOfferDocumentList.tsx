import * as React from "react";
import TabsComponent from "../../components/TabsComponent ";
import "../../App.css";
import {
  TabName,
  tabType,
  StatusId,
  Choices,
  workflowStatusApi,
  RoleID,
  WorkflowAction,
} from "../../utilities/Config";
import CustomLoader from "../../Services/Loader/CustomLoader";
import { Card, CardContent } from "@mui/material";
import { StatusDetails, TabDetails } from "../../Models/Master";
import {
  GetPortalJobsService,
  laborHireService,
  OfferLetterServices,
} from "../../Services/ServiceExport";
import { DataSyncToResiProcess } from "../../Services/InitiateOfferLetter/IOfferLetterService";
import PostRecrutimentDataTable from "../../components/PostRecrutimentDataTable";
import { tabStyle } from "../../components/TabMerge";
import { ButtonAction, EmployeementCategory } from "../../utilities/LabelName";
import ToolTipButton from "../../components/Tooltip";
import { BGVStatus } from "../../Models/ApIInterface";
type tabcount = {
  BGVCount: number;
  LabourHireCount: number;
  KCSACount: number;
};
const UploadOfferDocumentList = (props: any) => {
  const [data, setData] = React.useState<DataSyncToResiProcess[]>([]);
  const [rows, setRows] = React.useState<number>(5);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<string>("");
  const [TabNameData, setTabNameData] = React.useState<TabDetails[]>(
    props.TabDetails
  );
  const [pendingInfo, setPendingInfo] = React.useState<any>(null);
  const [pagination, setPagination] = React.useState({
    first: 0,
    rows: rows,
    totalPages: 1,
  });
  const [pendingcount, setPendingCount] = React.useState<tabcount>({
    BGVCount: 0,
    LabourHireCount: 0,
    KCSACount: 0,
  });

  const OfferLettertabs = React.useRef("");

  const handleHover = async (statusId: number, rowData: any) => {
    try {
      let FilterValue: BGVStatus = {
        hrUserId: String(props.userDetails[0]?.ID),
        pagination: {
          filterValue: rowData?.CandidateDetails?.JobRequestID,
          sortBy: "",
          sortOrder: 0,
          pageSize: 5,
          currentPage: 0,
          totalItems: 0,
        },
      };
      await laborHireService
        .CheckBGVerification(FilterValue)
        .then(async (res) => {
          const mappedArray = res.data.data[0]?.bgVerification
            ?.filter((item: any) => item.bgType)
            ?.map((item: any) => ({
              Key: item.bgType,
              Value: item.status,
            }));
          setPendingInfo(mappedArray);
          const allCompleted =
            mappedArray.every((item: any) => item.Value === "completed") ||
            false;
          console.log(allCompleted, "allCompleted");
          if (allCompleted) {
            const matchedData = {
              ID: rowData?.ID,
              ActionId: WorkflowAction.Approved,
            };

            await OfferLetterServices.UpdateStatusInSpfxlist([matchedData]);
          }
        })
        .catch((error) => {
          console.log("Candidate details doesn't fetch the data", error);
        });
    } catch (error) {
      console.log("GetVacancyDetails doesn't fetch the data", error);
    }
  };

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
        const isTooltipStatus = [StatusId.PendingDOTAficaVerification].includes(
          rowData.StatusID
        );
        if (isTooltipStatus) {
          return (
            <div>
              <ToolTipButton
                Title=""
                CurrentMenuId={props.ModalDropDown?.CurrentMenuId}
                Rowdata={rowData}
                ApproverData={pendingInfo}
                onHover={() => handleHover(rowData.StatusId, rowData)}
                BGDocs={true}
              />
              <span>{rowData.Status}</span>
            </div>
          );
        }
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
            {(rowData?.StatusID === StatusId.PendingHROfferInitiate &&
              rowData?.RecruitmentDetails?.EmploymentCategory ===
                EmployeementCategory.KCSAEmployee) ||
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
                StatusId.PendingCandidateOfferLetterUpload ||
              rowData?.StatusID ===
                StatusId.PendingCandidateWorkPermitreleatedDoc ||
              rowData?.StatusID ===
                StatusId.PendingCandidateEmploymentContractUpload ||
              rowData?.StatusID === StatusId.PendingLabourHireOfferRelease ||
              rowData?.StatusID === StatusId.PendingLabourhireWPPayment ||
              rowData?.StatusID === StatusId.PendingLHWorkPermitProcess ||
              rowData?.StatusID === StatusId.PendingLHECRelease ||
              rowData?.StatusID === StatusId.PendingDOTAficaVerification ||
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
            ) : rowData?.StatusID === StatusId.PendingHRBGVInitiation ||
              rowData?.StatusID === StatusId.PendingHROfferInitiate ? (
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
      case TabName.BackgroundVerification:
      case TabName.OfferLetterKSCA:
      case TabName.OfferLetterLabourHire:
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

  const pendingCount = async () => {
    setIsLoading(true);
    try {
      const filters = [
        {
          FilterKey: "ItemCreated",
          Operator: "eq",
          FilterValue: Choices.No,
        },
      ];

      if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
        filters.push({
          FilterKey: "RecruitmentHR",
          Operator: "eq",
          FilterValue: props.userDetails[0]?.EmailId,
        });
      }
      await OfferLetterServices.fetchResiCandidateDetails(filters, "and").then(
        (res) => {
          let labourdata = res.data.filter(
            (item: any) =>
              item.RecruitmentDetails?.EmploymentCategory ===
              EmployeementCategory.LaborhireContractor
          );
          let KSCAdata = res.data.filter(
            (item: any) =>
              item.RecruitmentDetails?.EmploymentCategory ===
              EmployeementCategory.KCSAEmployee
          );

          const BGVCounts = res.data.filter(
            (item) =>
              item.StatusID === StatusId.PendingHRBGVInitiation ||
              item.StatusID === StatusId.PendingHRReviewBGCheck
          );
          const LabourHireCounts = labourdata.filter(
            (item) =>
              item.StatusID === StatusId.PendingHROfferInitiate ||
              item.StatusID === StatusId.PendingHROfferReview ||
              item.StatusID === StatusId.PendingHRReviewOfferWorkPermitInit ||
              item.StatusID === StatusId.PendingHREmploymentContractInit ||
              item.StatusID === StatusId.PendingHREmploymentContractReview ||
              item.StatusID ===
                StatusId.PendingCandidateEmploymentContractUpload ||
              item.StatusID ===
                StatusId.PendingHREmploymentContractVerification ||
              item.StatusID === StatusId.PendingHRpreonboardingchecklist
          );
          const FinaceRoleData = labourdata.filter(
            (item) => item.StatusID === StatusId.PendingFinancePaymentReview
          );
          const KCSACounts = KSCAdata.filter(
            (item) =>
              item.StatusID === StatusId.PendingHROfferInitiate ||
              item.StatusID === StatusId.PendingHRReviewOfferWorkPermitInit ||
              item.StatusID === StatusId.PendingHRReviewWorkpermitDocs ||
              item.StatusID ===
                StatusId.WorkPermitAcknowledgedContractUploaded ||
              item.StatusID ===
                StatusId.PendingHREmploymentContractVerification ||
              item.StatusID === StatusId.PendingHRpreonboardingchecklist
          );

          setPendingCount({
            BGVCount: BGVCounts.length,
            LabourHireCount: props.CurrentRoleID.includes(
              RoleID.FinanceDepartment
            )
              ? FinaceRoleData.length
              : LabourHireCounts.length,
            KCSACount: KCSACounts.length,
          });
        }
      );
      setIsLoading(false);
    } catch (error) {
      console.log("Get Pending Count doesn't fetch the data", error);
    }
  };

  const UpdateListPortal = async (items: DataSyncToResiProcess[]) => {
    let FilterDataCareerportal: DataSyncToResiProcess[] = [];
    switch (OfferLettertabs.current) {
      case TabName.BackgroundVerification:
        FilterDataCareerportal = items.filter(
          (item) => item.StatusID === StatusId.PendingBGdocuploadedbycandidate
        );
        break;
      case TabName.OfferLetterKSCA:
        FilterDataCareerportal = items.filter(
          (item) =>
            item.StatusID === StatusId.PendingCandidateOfferLetterUpload ||
            item.StatusID === StatusId.PendingCandidateWorkPermitreleatedDoc ||
            item.StatusID === StatusId.PendingCandidateEmploymentContractUpload
        );
        break;
      case TabName.OfferLetterLabourHire:
        FilterDataCareerportal = items.filter(
          (item) =>
            item.StatusID === StatusId.PendingLabourHireOfferRelease ||
            item.StatusID === StatusId.PendingCandidateOfferLetterUpload ||
            item.StatusID === StatusId.PendingLabourhireWPPayment ||
            item.StatusID === StatusId.PendingLHWorkPermitProcess ||
            item.StatusID === StatusId.PendingLHECRelease ||
            item.StatusID === StatusId.PendingCandidateEmploymentContractUpload
        );
        break;
      default:
        break;
    }

    let FilterData = FilterDataCareerportal.map(
      (item) => item.CandidateDetails?.JobRequestID
    );
    let UpdatedStatus = await GetPortalJobsService.GetJobRequestData(
      FilterData
    );
    const getStatusById = (UpdatedStatus?.data?.data ?? []).map(
      (item: { jobRequestId: any; workflowStatusId: any }) => {
        let matchedRes: any = [];
        switch (OfferLettertabs.current) {
          case TabName.BackgroundVerification:
            matchedRes = FilterDataCareerportal.find(
              (res: any) =>
                res.CandidateDetails?.JobRequestID ===
                  String(item.jobRequestId) &&
                [workflowStatusApi.UploadedtheCandidateBGVDocs].includes(
                  item.workflowStatusId
                )
            );
            break;
          case TabName.OfferLetterKSCA:
            matchedRes = FilterDataCareerportal.find(
              (res: any) =>
                res.CandidateDetails?.JobRequestID ===
                  String(item.jobRequestId) &&
                [
                  workflowStatusApi.CandidateuploadedtheSignedOfferLetter,
                  workflowStatusApi.CandidateUploadedcandidatepersonalDocs,
                  workflowStatusApi.UploadedthesignedEmployementcontractform,
                ].includes(item.workflowStatusId)
            );
            break;
          case TabName.OfferLetterLabourHire:
            matchedRes = FilterDataCareerportal.find(
              (res: any) =>
                res.CandidateDetails?.JobRequestID ===
                  String(item.jobRequestId) &&
                [
                  workflowStatusApi.PendingLabourHireOfferRelease,
                  workflowStatusApi.CandidateuploadedtheSignedOfferLetter,
                  workflowStatusApi.PendingLabourhireWPPayment,
                  workflowStatusApi.PendingLHWorkPermitProcess,
                  workflowStatusApi.PendingLHECRelease,
                  workflowStatusApi.UploadedthesignedEmployementcontractform,
                ].includes(item.workflowStatusId)
            );
            break;
          default:
            break;
        }

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
  };

  // const CheckBGVStatus = async (
  //   items: DataSyncToResiProcess[],
  //   row?: number
  // ) => {
  //   setIsLoading(true);
  //   try {
  //     let FilterValue: BGVStatus = {
  //       hrUserId: props.userDetails[0]?.ID,
  //       pagination: {
  //         filterValue: "",
  //         sortBy: "",
  //         sortOrder: 0,
  //         pageSize: row ? row : rows,
  //         currentPage: 0,
  //         totalItems: 0,
  //       },
  //     };
  //     await laborHireService
  //       .CheckBGVerification(FilterValue)
  //       .then(async (res) => {
  //         // setCandidateData(res.data);
  //       })
  //       .catch((error) => {
  //         console.log("Candidate details doesn't fetch the data", error);
  //       });
  //   } catch (error) {
  //     console.log("GetVacancyDetails doesn't fetch the data", error);
  //   }
  //   setIsLoading(false);
  // };

  const fetchData = async (activeTab: string, row?: number) => {
    setIsLoading(true);
    try {
      let response: any;
      let filterConditions = [];
      let Conditions = "and";
      let TabValue = OfferLettertabs.current
        ? OfferLettertabs.current
        : TabName.BackgroundVerification;
      switch (TabValue) {
        case TabName.BackgroundVerification:
          filterConditions.push({
            FilterKey: "StatusId",
            Operator: "in",
            FilterValue: [
              StatusId.PendingHRBGVInitiation,
              StatusId.PendingBGdocuploadedbycandidate,
              StatusId.PendingHRReviewBGCheck,
              StatusId.PendingDOTAficaVerification,
            ],
          });
          break;
        case TabName.OfferLetterKSCA:
          filterConditions.push({
            FilterKey: "StatusId",
            Operator: "in",
            FilterValue: [
              StatusId.PendingHROfferInitiate,
              StatusId.PendingCandidateOfferLetterUpload,
              StatusId.PendingHRReviewOfferWorkPermitInit,
              StatusId.PendingCandidateWorkPermitreleatedDoc,
              StatusId.PendingHRReviewWorkpermitDocs,
              StatusId.WorkPermitAcknowledgedContractUploaded,
              StatusId.PendingCandidateEmploymentContractUpload,
              StatusId.PendingHREmploymentContractVerification,
              StatusId.PendingHRpreonboardingchecklist,
            ],
          });
          break;
        case TabName.OfferLetterLabourHire:
          if (props.CurrentRoleID.includes(RoleID.FinanceDepartment)) {
            filterConditions.push({
              FilterKey: "StatusId",
              Operator: "eq",
              FilterValue: StatusId.PendingFinancePaymentReview,
            });
          } else {
            filterConditions.push({
              FilterKey: "StatusId",
              Operator: "in",
              FilterValue: [
                StatusId.PendingHROfferInitiate,
                StatusId.PendingLabourHireOfferRelease,
                StatusId.PendingHROfferReview,
                StatusId.PendingCandidateOfferLetterUpload,
                StatusId.PendingHRReviewOfferWorkPermitInit,
                StatusId.PendingLabourhireWPPayment,
                StatusId.PendingLHWorkPermitProcess,
                StatusId.PendingHRCandidateResign,
                StatusId.PendingHREmploymentContractInit,
                StatusId.PendingLHECRelease,
                StatusId.PendingHREmploymentContractReview,
                StatusId.PendingCandidateEmploymentContractUpload,
                StatusId.PendingHREmploymentContractVerification,
                StatusId.PendingHRpreonboardingchecklist,
              ],
            });
          }

          break;
        case TabName.MySubmission:
          filterConditions.push({
            FilterKey: "StatusId",
            Operator: "in",
            FilterValue: [
              StatusId.PendingHRpreonboardingchecklist,
              StatusId.PendingwithTAforMedicalScreening,
              StatusId.OnboardingProcessinitiatedforDRC,
              StatusId.OnboardingProcessinitiatedforExpat,
              StatusId.PendingFinancePaymentReview,
            ],
          });
          break;
      }

      filterConditions.push({
        FilterKey: "ItemCreated",
        Operator: "eq",
        FilterValue: Choices.No,
      });
      if (props.CurrentRoleID.includes(RoleID.RecruitmentHR)) {
        filterConditions.push({
          FilterKey: "RecruitmentHR",
          Operator: "eq",
          FilterValue: props.userDetails[0]?.EmailId,
        });
      }

      const respons = await OfferLetterServices.fetchResiCandidateDetails(
        filterConditions,
        Conditions
      );
      response = respons.data;

      let categoryresponse: any;
      if (TabValue === TabName.OfferLetterLabourHire) {
        categoryresponse = response.filter(
          (item: any) =>
            item.RecruitmentDetails?.EmploymentCategory ===
            EmployeementCategory.LaborhireContractor
        );
      } else if (TabValue === TabName.OfferLetterKSCA) {
        categoryresponse = response.filter(
          (item: any) =>
            item.RecruitmentDetails?.EmploymentCategory ===
            EmployeementCategory.KCSAEmployee
        );
      } else {
        categoryresponse = response;
      }
      setData(categoryresponse);
      void UpdateListPortal(categoryresponse);
    } catch (error) {
      console.log("GetVacancyDetails doesn't fetch the data", error);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    const fetchDataAndGetADGroupsOption = async () => {
      try {
        await fetchData(activeTab, rows);
        void pendingCount();
        setTabNameData(props.TabDetails[0] ?? []);
      } catch (error) {
        console.error(error);
      }
    };

    void fetchDataAndGetADGroupsOption();
  }, [activeTab]);

  const handleRefresh = (tab: string) => {
    void fetchData(activeTab, rows);
    void pendingCount();
  };

  React.useEffect(() => {
    if (props.stateValue) {
      OfferLettertabs.current = props.stateValue?.TabNames;
      setActiveTab(props.stateValue?.tab);
    } else {
      if (!OfferLettertabs.current) {
        if (props.TabDetails[0]) {
          OfferLettertabs.current = props.TabDetails[0]?.[0]?.TabName ?? "";
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
    void pendingCount();
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
      case TabName.BackgroundVerification:
      case TabName.OfferLetterKSCA:
      case TabName.OfferLetterLabourHire:
      case TabName.MySubmission:
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
      case TabName.BackgroundVerification:
        return tabStyle(tab.TabName, pendingcount.BGVCount);
      case TabName.OfferLetterKSCA:
        return tabStyle(tab.TabName, pendingcount.KCSACount);
      case TabName.OfferLetterLabourHire:
        return tabStyle(tab.TabName, pendingcount.LabourHireCount);
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
