import * as React from "react";
import "../../App.css";
import {
  TabName,
  StatusId,
  Choices,
  workflowStatusApi,
  RoleID,
  WorkflowAction,
} from "../../utilities/Config";
import CustomLoader from "../../Services/Loader/CustomLoader";
import { StatusDetails } from "../../Models/Master";
import {
  GetPortalJobsService,
  laborHireService,
  OfferLetterServices,
} from "../../Services/ServiceExport";
import { DataSyncToResiProcess } from "../../Services/InitiateOfferLetter/IOfferLetterService";
import PostRecrutimentDataTable from "../../components/PostRecrutimentDataTable";
import {
  ButtonAction,
  DotAfricaStatus,
  DotTooltipStatus,
  EmployeementCategory,
} from "../../utilities/LabelName";
import ToolTipButton from "../../components/Tooltip";
import { useEffect } from "react";

const DocumentDashboard = (props: any) => {
  const [data, setData] = React.useState<DataSyncToResiProcess[]>([]);
  const [rows, setRows] = React.useState<number>(5);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [pendingInfo, setPendingInfo] = React.useState<any>(null);
  const [pagination, setPagination] = React.useState({
    first: 0,
    rows: rows,
    totalPages: 1,
  });

  const [IsIDCSSkipped, setIsIDCSSkipped] = React.useState<any[]>([]);
  const [currentTab, setCurrentTab] = React.useState<string>("");

  const IsActionIcon_fn = async (
    statusId: number,
    rowData: any,
  ): Promise<boolean> => {
    try {
      const res = await laborHireService.CheckBGVerification(
        rowData?.CandidateDetails?.JobRequestID,
      );

      const IDCTYpeStatus = res.data[0]?.bgVerification
        // ?.filter((bgItem: any) => bgItem.bgTypeCode === "IDCS")
        ?.every(
          (bgItem: any) =>
            bgItem.status?.trim().toLowerCase() ===
              DotAfricaStatus.skipped.toLowerCase() ||
            bgItem.status?.trim().toLowerCase() ===
              DotAfricaStatus.skiped.toLowerCase() ||
            bgItem.status?.trim().toLowerCase() ===
              DotAfricaStatus.error.toLowerCase() ||
            bgItem.status?.trim().toLowerCase() ===
              DotAfricaStatus.cancelled.toLowerCase(),
        );

      return !!IDCTYpeStatus;
    } catch (error) {
      console.log("Candidate details fetch failed", error);
      return false;
    }
  };

  const UpdateListPortal = async () => {
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
    const items = await OfferLetterServices.fetchResiCandidateDetails(
      filters,
      "and",
    );
    let FilterDataCareerportal: any[] = [];
    FilterDataCareerportal = items.data.filter(
      (item) =>
        item.StatusID === StatusId.PendingBGdocuploadedbycandidate ||
        item.StatusID === StatusId.PendingCandidateOfferLetterUpload ||
        item.StatusID === StatusId.PendingCandidateWorkPermitreleatedDoc ||
        item.StatusID === StatusId.PendingCandidateEmploymentContractUpload ||
        item.StatusID === StatusId.PendingLabourHireOfferRelease ||
        item.StatusID === StatusId.PendingLabourhireWPPayment ||
        item.StatusID === StatusId.PendingLHWorkPermitProcess ||
        item.StatusID === StatusId.PendingLHECRelease,
    );

    let FilterData = FilterDataCareerportal.map(
      (item) => item?.CandidateDetails?.JobRequestID,
    );
    let UpdatedStatus =
      await GetPortalJobsService.GetJobRequestData(FilterData);
    const getStatusById = (UpdatedStatus?.data?.data ?? []).map(
      (item: { jobRequestId: any; workflowStatusId: any }) => {
        let matchedRes: any = null;
        matchedRes = FilterDataCareerportal.find(
          (res: any) =>
            res?.CandidateDetails?.JobRequestID === String(item.jobRequestId) &&
            [
              workflowStatusApi.UploadedtheCandidateBGVDocs,
              workflowStatusApi.CandidateuploadedtheSignedOfferLetter,
              res.RecruitmentDetails.EmploymentCategory ===
              EmployeementCategory.KCSAEmployee
                ? workflowStatusApi.CandidateUploadedcandidatepersonalDocs
                : "",
              workflowStatusApi.UploadedthesignedEmployementcontractform,
              workflowStatusApi.PendingLabourHireOfferRelease,
              workflowStatusApi.PendingLabourhireWPPayment,
              workflowStatusApi.PendingLHWorkPermitProcess,
              workflowStatusApi.PendingLHECRelease,
            ].includes(item.workflowStatusId),
        );

        const Offerdecline = FilterDataCareerportal.find(
          (res: any) =>
            res?.CandidateDetails?.JobRequestID === String(item.jobRequestId) &&
            [
              workflowStatusApi.Offerdecline,
              workflowStatusApi.SysytmeDecline,
            ].includes(item.workflowStatusId),
        );

        if (Offerdecline) {
          return {
            ...item,
            ID: Offerdecline.ID,
            ActionId: WorkflowAction.Decline,
          };
        }

        if (matchedRes) {
          return {
            ...item,
            ID: matchedRes.ID,
            ActionId: WorkflowAction.Approved,
          };
        }

        return null;
      },
    );
    let nullChecked = getStatusById.filter(
      (item: any) => item !== null && item !== undefined,
    );
    if (nullChecked.length > 0) {
      await OfferLetterServices.UpdateStatusInSpfxlist(nullChecked);
    }
  };

  const fetchData = async (tab: string) => {
    setIsLoading(true);
    try {
      let response: any;
      let filterConditions = [];
      let Conditions = "and";
      switch (tab) {
        case TabName.BackgroundVerification:
          filterConditions.push({
            FilterKey: "StatusId",
            Operator: "in",
            FilterValue: [
              StatusId.PendingHRBGVInitiation,
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
              StatusId.PendingHRReviewOfferWorkPermitInit,
              StatusId.PendingHRReviewWorkpermitDocs,
              StatusId.WorkPermitAcknowledgedContractUploaded,
              StatusId.PendingHREmploymentContractVerification,
              StatusId.PendingHRpreonboardingchecklist,
              StatusId.PendingHRReviewOfferanduploadEmployementContract,
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
                StatusId.PendingHROfferReview,
                StatusId.PendingHRReviewOfferWorkPermitInit,
                StatusId.PendingHRReviewOfferuploadEmploymentInit,
                StatusId.PendingHREmploymentContractInit,
                StatusId.PendingHREmploymentContractReview,
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
              StatusId.PendingDOTAficaVerification,
              StatusId.PendingBGdocuploadedbycandidate,
              StatusId.PendingCandidateOfferLetterUpload,
              StatusId.PendingCandidateWorkPermitreleatedDoc,
              StatusId.PendingCandidateEmploymentContractUpload,
              StatusId.PendingLabourHireOfferRelease,
              StatusId.PendingLHWorkPermitProcess,
              // StatusId.PendingCandidateOfferLetterUpload,
              StatusId.PendingLabourhireWPPayment,
              StatusId.PendingCandidateEmploymentContractUpload,
              StatusId.PendingLHECRelease,
              StatusId.PendingwithTAforMedicalScreening,
              StatusId.OnboardingProcessinitiatedforDRC,
              StatusId.OnboardingProcessinitiatedforExpat,
              StatusId.PendingFinancePaymentReview,
              StatusId.RESIProcessInitiatedforDRC,
              StatusId.RESIProcessInitiatedforExpatriate,
              StatusId.BackgroundCheckVerificationFailed,
              StatusId.RESProcessInitiated,
              StatusId.FailedmedicalscreeningUnfit,
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
        Conditions,
      );
      response = respons.data;

      let categoryresponse: any;
      if (tab === TabName.OfferLetterLabourHire) {
        categoryresponse = response.filter(
          (item: any) =>
            item.RecruitmentDetails?.EmploymentCategory ===
            EmployeementCategory.LaborhireContractor,
        );
      } else if (tab === TabName.OfferLetterKSCA) {
        categoryresponse = response.filter(
          (item: any) =>
            item.RecruitmentDetails?.EmploymentCategory ===
            EmployeementCategory.KCSAEmployee,
        );
      } else {
        categoryresponse = response;
      }
      setData(categoryresponse);
      const PendingDotAfrica = categoryresponse.filter(
        (item: any) => item.StatusID === StatusId.PendingDOTAficaVerification,
      );

      const getRequestIDs = await Promise.all(
        PendingDotAfrica.map(async (item: any) => {
          const ActionStatus = await IsActionIcon_fn(item.StatusID, item);

          return {
            requestID: item?.CandidateDetails?.JobRequestID,
            IsActionIcon: ActionStatus,
          };
        }),
      );
      console.log("getRequestIDs", getRequestIDs);
      setIsIDCSSkipped(getRequestIDs);
      void UpdateListPortal();
    } catch (error) {
      console.log("GetVacancyDetails doesn't fetch the data", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (props.stateValue) {
      setCurrentTab(props.stateValue?.TabName);
    } else {
      if (props?.TabDetails?.TabName) {
        setCurrentTab(props.TabDetails.TabName);
      }
    }
    void fetchData(props.TabDetails.TabName);
  }, [props.TabDetails.TabName]);

  const handleHover = async (statusId: number, rowData: any) => {
    try {
      await laborHireService
        .CheckBGVerification(rowData?.CandidateDetails?.JobRequestID)
        .then(async (res) => {
          const mappedArray = res.data[0]?.bgVerification
            ?.filter((item: any) => item.bgType)
            ?.map((item: any) => {
              const status = item.status?.trim().toLowerCase();
              const result = item.result?.trim().toLowerCase();

              return {
                Key: item.bgType,
                Value:
                  status === DotAfricaStatus.Completed.trim().toLowerCase() &&
                  result === DotAfricaStatus.Confirmed.trim().toLowerCase()
                    ? DotTooltipStatus.Passed
                    : [
                          DotAfricaStatus.skipped,
                          DotAfricaStatus.skiped,
                          DotAfricaStatus.error,
                          DotAfricaStatus.cancelled,
                        ]
                          .map((s) => s.trim().toLowerCase())
                          .includes(status)
                      ? DotTooltipStatus.Failed
                      : [DotAfricaStatus.pending, DotAfricaStatus.new]
                            .map((s) => s.trim().toLowerCase())
                            .includes(status)
                        ? DotTooltipStatus.Pending
                        : DotTooltipStatus.Pending,
              };
            });

          setPendingInfo(mappedArray);
          // if (mappedArray.length > 0) {
          //   const allCompleted =
          //     mappedArray.every(
          //       (item: any) => item.Value === DotTooltipStatus.Passed
          //     ) || false;
          //   const IDCTYpeStatus = res.data[0]?.bgVerification
          //     ?.filter((item: any) => item.bgTypeCode === "IDCS")
          //     ?.every(
          //       (item: any) =>
          //         item.status?.trim().toLowerCase() ===
          //           DotAfricaStatus.skipped.trim().toLowerCase() ||
          //         item.status?.trim().toLowerCase() ===
          //           DotAfricaStatus.error.trim().toLowerCase() ||
          //         item.status?.trim().toLowerCase() ===
          //           DotAfricaStatus.cancelled.trim().toLowerCase()
          //     );
          //   const RejectStatus = res.data[0]?.bgVerification
          //     ?.filter((item: any) => item.bgTypeCode !== "IDCS")
          //     ?.some(
          //       (item: any) =>
          //         item.status?.trim().toLowerCase() ===
          //           DotAfricaStatus.skipped.trim().toLowerCase() ||
          //         item.status?.trim().toLowerCase() ===
          //           DotAfricaStatus.error.trim().toLowerCase() ||
          //         item.status?.trim().toLowerCase() ===
          //           DotAfricaStatus.cancelled.trim().toLowerCase() ||
          //         false
          //     );

          //   if (
          //     rowData.StatusID === StatusId.PendingDOTAficaVerification &&
          //     rowData.ActionID === WorkflowAction.Transfer &&
          //     listupdateflag
          //   ) {
          //     let matchedData: any;
          //     if (allCompleted) {
          //       matchedData = {
          //         ID: rowData?.ID,
          //         ActionId: WorkflowAction.Approved,
          //       };
          //     } else if (IDCTYpeStatus) {
          //       // matchedData = {
          //       //   ID: rowData?.ID,
          //       //   ActionId: WorkflowAction.Revert,
          //       // };
          //     } else if (RejectStatus) {
          //       matchedData = {
          //         ID: rowData?.ID,
          //         ActionId: WorkflowAction.Reject,
          //       };
          //     }
          //     let UpdateData = await OfferLetterServices.UpdateStatusInSpfxlist(
          //       [matchedData]
          //     );
          //     if (UpdateData.status === ResponeStatus.SUCCESS) {
          //       setListUpdateFlag(false);
          //       if (allCompleted) {
          //         const BGVResult = mappedArray.map((item: any) => ({
          //           [item.Key]: item.Value,
          //         }));

          //         let datas = {
          //           ID: rowData?.CandidateDetails.CandidateID,
          //           BackgroundChecksResults: JSON.stringify(BGVResult) ?? [],
          //         };
          //         await getVRRDetails.InsertRecruitmentCandidateDetails(datas);
          //       }
          //     }
          //   }
          // }
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
    TabNames: string,
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
          rowData.StatusID,
        );
        if (isTooltipStatus) {
          return (
            <div style={{ marginLeft: "-11.1%" }}>
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
        console.log(IsIDCSSkipped, "IsIDCSSkipped");
        let ActionIcon = IsIDCSSkipped.filter(
          (item: any) =>
            item.requestID === rowData?.CandidateDetails?.JobRequestID,
        );
        console.log(ActionIcon, "ActionIcon");
        let IsIDCSFailed =
          ActionIcon.length > 0 ? ActionIcon[0]?.IsActionIcon : false;
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
              StatusId.WorkPermitAcknowledgedContractUploaded ||
            rowData?.StatusID ===
              StatusId.PendingHRReviewOfferanduploadEmployementContract ? (
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
                      ButtonAction.Upload,
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
              // rowData?.StatusID === StatusId.PendingDOTAficaVerification ||
              rowData?.StatusID === StatusId.OnboardingProcessinitiatedforDRC ||
              rowData?.StatusID ===
                StatusId.OnboardingProcessinitiatedforExpat ||
              rowData?.StatusID === StatusId.PendingwithTAforMedicalScreening ||
              currentTab === TabName.MySubmission ? (
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
                      ButtonAction.View,
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
                      ButtonAction.Initiated,
                    )
                  }
                />
              </>
            ) : IsIDCSFailed &&
              rowData?.StatusID === StatusId.PendingDOTAficaVerification ? (
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
                      ButtonAction.View,
                    )
                  }
                />
              </>
            ) : !IsIDCSFailed &&
              rowData?.StatusID === StatusId.PendingDOTAficaVerification ? (
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
                      ButtonAction.View,
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
                    ButtonAction.Review,
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
    ButtonAction: string,
  ) {
    switch (TabNames) {
      case TabName.BackgroundVerification:
      case TabName.OfferLetterKSCA:
      case TabName.OfferLetterLabourHire:
      case TabName.MySubmission:
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
            rowData,
          },
        });
        break;

      default:
        console.warn("Unknown TabName:", TabNames);
        break;
    }
  }

  const handleRefresh = (tab: string) => {
    void fetchData(tab);
  };

  const onPageChange = (event: any) => {
    // setFirst(event.first);
    setPagination({
      first: event.first,
      rows: event.rows,
      totalPages: event.totalPages,
    });
    setRows(event.rows);
    // let PageItem = event.rows * event.totalPages;
    // void fetchData(activeTab);
  };

  const renderTable = (
    TabNames: string,
    TabValue: string,
    StatusData: StatusDetails[],
  ) => {
    let Action: any;
    if (StatusData) {
      Action = StatusData.filter((item) => item.Action);
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
            handleRefresh={() => handleRefresh(TabNames)}
            pagination={pagination}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <CustomLoader isLoading={isLoading}>
        <React.Fragment>
          {renderTable(
            props?.TabDetails?.TabName,
            props?.TabDetails?.Value,
            props?.TabDetails?.StatusDetails,
          )}
        </React.Fragment>
      </CustomLoader>
    </>
  );
};
export default DocumentDashboard;
