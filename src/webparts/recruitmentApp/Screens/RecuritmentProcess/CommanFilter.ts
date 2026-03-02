import { FilterItem } from "../../Models/ApIInterface";
import { DataSyncToRecruitmentResponse } from "../../Services/RecruitmentProcess/IRecruitmentProcessService";
import { GetPortalJobsService, getVRRDetails } from "../../Services/ServiceExport";
import { Choices, RoleID, StatusId, TabName, workflowStatusApi } from "../../utilities/Config";
import { ButtonAction, EmployeementCategory } from "../../utilities/LabelName";

export const getBaseFilters = () => ([
  { FilterKey: "StatusId", Operator: "eq", FilterValue: StatusId.ReadyforRecruitmentProcess },
  { FilterKey: "IsDataSyncToRecruitment", Operator: "eq", FilterValue: Choices.Yes },
  { FilterKey: "ItemCreated", Operator: "eq", FilterValue: Choices.No },
]);

export const getRecruitmentFiltersByTab = (props: any, tab: string) => {
  const filters: any[] = [];
  let jobAppliedFilter: string[] = [];

  const userEmail = props.userDetails[0]?.EmailId;

  switch (tab) {
    case TabName.UploadONEMDoc:
      filters.push({ FilterKey: "StatusId", Operator: "eq", FilterValue: StatusId.PendingwithHRLeadtouploadONEMsigneddoc });
      break;

    case TabName.UploadAdvertisement:
      filters.push(
        { FilterKey: "StatusId", Operator: "eq", FilterValue: StatusId.PendingwithRecruitmentHRtouploadAdv },
        { FilterKey: "AssignedHR", Operator: "eq", FilterValue: userEmail }
      );
      break;

    case TabName.AssignAgencies:
      filters.push(
        { FilterKey: "StatusId", Operator: "eq", FilterValue: StatusId.RecruitmentInProgress },
        { FilterKey: "AssignedHR", Operator: "eq", FilterValue: userEmail }
      );
      break;

    case TabName.InterviewQuestion:
      filters.push(
        { FilterKey: "StatusId", Operator: "in", FilterValue: [StatusId.PendingwithHRandLMtocreateinterviewQuestion, StatusId.PendingwithLMcreateDisqualificationQuestion] },
      );
      break;

    case TabName.ReviewScorecard:
      filters.push(
        { FilterKey: "StatusId", Operator: "eq", FilterValue: StatusId.RecruitmentInProgress },
      );
      break;

    case TabName.ReviewProfile:
      filters.push(
        { FilterKey: "StatusId", Operator: "eq", FilterValue: StatusId.RecruitmentInProgress },
        { FilterKey: "LineManager", Operator: "eq", FilterValue: userEmail }
      );
      jobAppliedFilter = [
        workflowStatusApi.LineManagerL1Pending,
        workflowStatusApi.LineManagerL2Pending,
        workflowStatusApi.LineManagerLevel1OnHold,
        workflowStatusApi.LineManagerLevel2OnHold,
      ];
      break;

    case TabName.ReviewJobAdvertisement:
      if (props.CurrentRoleID.includes(RoleID.LineManager)) {
        filters.push(
          { FilterKey: "StatusId", Operator: "eq", FilterValue: StatusId.PendingwithLineManagereviewAdv },
          { FilterKey: "LineManager", Operator: "eq", FilterValue: userEmail }
        );
      } else if (props.CurrentRoleID.includes(RoleID.HOD)) {
        filters.push(
          { FilterKey: "StatusId", Operator: "eq", FilterValue: StatusId.PendingwithHODtoreviewAdv },
          { FilterKey: "HOD", Operator: "eq", FilterValue: userEmail }
        );
      }
      break;
  }

  filters.push({ FilterKey: "ItemCreated", Operator: "eq", FilterValue: Choices.No });

  return { filters, jobAppliedFilter };
};

export const toDate = (value?: string): Date | undefined =>
  value ? new Date(value) : undefined;

export const getTotalAppliedCount = async (
  getJobAppiledCount: DataSyncToRecruitmentResponse[],
  FilterItem: string[],
) => {
  const counts = await Promise.all(
    getJobAppiledCount.map(async (item) => {
      const jobCodeFilter = [
        {
          FilterKey: "JobCodeId",
          Operator: "eq",
          FilterValue: String(item?.JobCodeId),
        },
        {
          FilterKey: "IsActive",
          Operator: "eq",
          FilterValue: 1,
        },
      ];

      const jobUniqueValue = await getVRRDetails.GetJobUniqueDataValue(
        jobCodeFilter,
        "and",
      );

      const jobUniqueKey = jobUniqueValue?.data?.[0]?.JobUniqueKey;
      if (!jobUniqueKey) return 0;

      const filterValue: FilterItem = {
        jobCode: jobUniqueKey,
        workflowStausId: FilterItem ?? [],
        pagination: {
          filterValue: "",
          sortBy: "",
          sortOrder: 0,
          pageSize: 10000,
          currentPage: 0,
          totalItems: 0,
        },
      };

      const jobAppliedCount =
        await GetPortalJobsService.getCandidateDetailsInJobCode(filterValue);

      return jobAppliedCount?.data?.length || 0;
    }),
  );

  const totalCount = counts.reduce((sum, count) => sum + count, 0);

  return totalCount;
};

export const getInterviewPanelCount = async (
  getJobAppiledCount: DataSyncToRecruitmentResponse[],
) => {
  const counts = await Promise.all(
    getJobAppiledCount.map(async (item) => {
      const jobCodeFilter = [
        {
          FilterKey: "RecruitmentIDId",
          Operator: "eq",
          FilterValue: String(item?.ID),
        },
        {
          FilterKey: "JobCodeId",
          Operator: "eq",
          FilterValue: String(item?.JobCodeId),
        },
        {
          FilterKey: "StatusId",
          Operator: "in",
          FilterValue: [
            StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel,
          ],
        },
        {
          FilterKey: "ItemCreated",
          Operator: "eq",
          FilterValue: "No",
        },
      ];

      const scorecardValue = await getVRRDetails.getReviewScoreCardCount(
        jobCodeFilter,
        "and",
      );

      return Number(scorecardValue?.data) || 0;
    }),
  );

  const totalCount = counts.reduce((sum, count) => sum + count, 0);

  return totalCount;
};

export const getScoreCardCount = async (
  getJobAppiledCount: DataSyncToRecruitmentResponse[],
) => {
  const counts = await Promise.all(
    getJobAppiledCount.map(async (item) => {
      const jobCodeFilter = [
        {
          FilterKey: "RecruitmentIDId",
          Operator: "eq",
          FilterValue: String(item?.ID),
        },
        {
          FilterKey: "JobCodeId",
          Operator: "eq",
          FilterValue: String(item?.JobCodeId),
        },
        {
          FilterKey: "StatusId",
          Operator: "in",
          FilterValue: [
            StatusId.PendingwithHODtoselectthecandidate,
            StatusId.OnHoldbyHOD,
            StatusId.PendingwithHODtoAssignPositionID,
            StatusId.CandidateOnHoldbyHODLevel1,
            StatusId.CandidateOnHoldbyHODLevel2,
          ],
        },
        {
          FilterKey: "ItemCreated",
          Operator: "eq",
          FilterValue: "No",
        },
      ];

      const scorecardValue = await getVRRDetails.getReviewScoreCardCount(
        jobCodeFilter,
        "and",
      );

      return Number(scorecardValue?.data) || 0;
    }),
  );

  const totalCount = counts.reduce((sum, count) => sum + count, 0);

  return totalCount;
};

export const getActionConfig = (
  rowData: any,
  isMySubmission: boolean,
  isIDCSFailed: boolean
) => {
  if (isMySubmission) {
    return { action: ButtonAction.View, icon: require("../../assets/Viewicon.svg") };
  }

  const status = rowData?.StatusID;
  const employmentCategory =
    rowData?.RecruitmentDetails?.EmploymentCategory;

  const uploadStatuses = [
    StatusId.WorkPermitAcknowledgedContractUploaded,
    StatusId.PendingHRReviewOfferanduploadEmployementContract,
  ];

  const viewStatuses = [
    StatusId.PendingBGdocuploadedbycandidate,
    StatusId.PendingCandidateOfferLetterUpload,
    StatusId.PendingCandidateWorkPermitreleatedDoc,
    StatusId.PendingCandidateEmploymentContractUpload,
    StatusId.PendingLabourHireOfferRelease,
    StatusId.PendingLabourhireWPPayment,
    StatusId.PendingLHWorkPermitProcess,
    StatusId.PendingLHECRelease,
    StatusId.OnboardingProcessinitiatedforDRC,
    StatusId.OnboardingProcessinitiatedforExpat,
    StatusId.PendingwithTAforMedicalScreening,
    StatusId.RESIProcessInitiatedforDRC,
    StatusId.RESIProcessInitiatedforExpatriate
  ];

  if (
    (status === StatusId.PendingHROfferInitiate &&
      employmentCategory === EmployeementCategory.KCSAEmployee) ||
    uploadStatuses.includes(status)
  ) {
    return { action: ButtonAction.Upload, icon: require("../../assets/UploadIcon.svg")};
  }

  if (viewStatuses.includes(status)) {
    return { action: ButtonAction.View, icon: require("../../assets/Viewicon.svg")};
  }

  if (
    status === StatusId.PendingHRBGVInitiation ||
    status === StatusId.PendingHROfferInitiate
  ) {
    return { action: ButtonAction.Initiated, icon: require("../../assets/Editbutton.svg") };
  }

  if (status === StatusId.PendingDOTAficaVerification) {
    return {
      action: ButtonAction.View,
      icon: require("../../assets/Editbutton.svg")  //isIDCSFailed ? require("../../assets/Editbutton.svg") : require("../../assets/Viewicon.svg"),
    };
  }

  return { action: ButtonAction.Review, icon: require("../../assets/Review.svg")};
};
