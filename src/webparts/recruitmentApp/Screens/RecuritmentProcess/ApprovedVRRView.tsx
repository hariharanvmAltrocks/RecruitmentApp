import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import "../../App.css";
import {
  CommonServices,
  getVRRDetails,
  GetPortalJobsService,
} from "../../Services/ServiceExport";
import {
  ColorCode,
  DocumentLibraray,
  RoleProfileMaster,
  ResponeStatus,
  workflowStatusApi,
} from "../../utilities/Config";
import CustomLoader from "../../Services/Loader/CustomLoader";
import {
  AdvDetails,
  QualificationValue,
  RecuritmentData,
  RoleSpecKnowledge,
  TechnicalSkills,
} from "../../Models/RecuritmentVRR";
import CustomLabel from "../../components/CustomLabel";
import { CommentsData } from "../../Services/RecruitmentProcess/IRecruitmentProcessService";
import CommanComments from "../../components/CommanComments";
import ReuseButton from "../../components/ReuseButton";
import CustomViewDocument from "../../components/CustomViewDocument";
import CustomInput from "../../components/CustomInput";
import LabelHeaderComponents from "../../components/TitleHeader";
import BreadcrumbsComponent, {
  TabNameData,
} from "../../components/CustomBreadcrumps";
import {
  Attachment,
  ButtonAction,
  labelNames,
} from "../../utilities/LabelName";
import PreviewScreen from "./PreviewScreen";
import CandidateList from "../../components/CandidateList";
import { CandidateItem } from "../../components/CandidateCard";
import { FilterItem, GetProfileByJobCode } from "../../Models/ApIInterface";

const ApprovedVRRView: React.FC = (props: any) => {
  const [tabVisibility, setTabVisibility] = useState({
    tab1: true,
    tab2: false,
    tab3: false,
  });

  const [data, setData] = useState<RecuritmentData>({
    VRRID: 0,
    BusinessUnitCodeID: 0,
    DepartmentID: 0,
    SubDepartmentID: 0,
    SectionID: 0,
    DepartmentCodeID: 0,
    JobNameInEnglishID: 0,
    JobNameInFrenchID: 0,
    PatersonGradeID: 0,
    DRCGradeID: 0,
    JobCodeId: 0,
    BusinessUnitCode: "",
    BusinessUnitName: "",
    BusinessUnitDescription: "",
    Department: "",
    SubDepartment: "",
    Section: "",
    DepartmentCode: "",
    Nationality: "",
    JobNameInEnglish: "",
    JobNameInFrench: "",
    NoofPositionAssigned: "",
    PatersonGrade: "",
    DRCGrade: "",
    EmployementCategory: "",
    ContractType: "",
    JobCode: "",
    AreaOfWork: "",
    ReasonForVacancy: "",
    RecruitmentAuthorised: "",
    IsPayrollEmailed: "",
    EnterNumberOfMonths: 0,
    DateRequried: "",
    IsRevert: "",
    VacancyConfirmed: "",

    RoleProfileDocument: [],
    GradingDocument: [],
    AdvertisementDocument: [],
    AssignRecruitmentHR: { key: 0, text: "" },
    AssignRecruitmentHROption: [],
    OnamSignedStampsAttchment: [],
    OnamSignedStampsDocument: [],
    AssignAgencies: { key: 0, text: "" },
    AssignAgenciesOption: [],
    CandidateCVAttachment: [],
    Comments: "",
    RoleProfileDocument_fr: [],
    GradingDocument_fr: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [iscandidateLoading, setIsCandidateLoading] = useState<boolean>(false);
  const [MainComponent, setMainComponent] = useState<boolean>(true);
  const [CommentData, setCommentsData] = useState<CommentsData[] | undefined>();
  const [TabNameData, setTabNameData] = useState<TabNameData[]>([]);
  const [activeTab, setactiveTab] = useState<string>("tab1");
  const [Preview, setPreview] = useState<boolean>(false);
  const [CandidateData, setCandidateData] = useState<
    GetProfileByJobCode[] | null
  >([]);
  const [candidateListPage, setCandidateListPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [jobUniqueKey, setJobUniqueKey] = useState<string>("");
  const [advDetails, setAdvDetails] = useState<AdvDetails>({
    RoleDetailsID: 0,
    MinQualificationOption: [],
    PrefeQualificationOption: [],
    RoleSpeKnowledgeoption: [],
    RequiredLeveloption: [],
    TechnicalSkillsOption: [],
    LevelProficiencyOption: [],
    RolePurpose: "",
    JobDescription: "",
    addMasterQualification: "",
    TotalExperience: { key: 0, text: "" },
    ExperienceinMiningIndustry: { key: 0, text: "" },
    TotalExperienceOption: [],
    ExperienceinMiningIndustryOption: [],
    YearofExperience: " ",
    PreferredExperience: "",
    ValidFrom: undefined,
    ValidTo: undefined,
    FunctionType: "",
    JobFunctionalType: { key: 0, text: "" },
    JobFunctionalTypeOption: [],
    addMasterMinimumQualification: "",
    AdvertisementAttachement: [],
    JobcodeChecked: false,
    JobTitleofFunctionalManager: { key: 0, text: "" },
    FunctionalManagerName: { key: 0, text: "" },
    JobTitleofLineManagerSupervisor: { key: 0, text: "" },
    LineManagerSupervisorName: { key: 0, text: "" },
    JobFunctionalType_fr: { key: 0, text: "" },
    JobDescription_fr: "",
    RolePurpose_fr: "",
    IsMasterData: false,
    JobTilteFunctionalManager_fr: { key: 0, text: "" },
    JobTitleofLineManagerSupervisor_fr: { key: 0, text: "" },
    JobTitleofFunctionalManagerOption: [],
    JobTitleofLineManagerSupervisorOption: [],
    JobBasedBGVVerification: [],
  });
  const [agentMaster, setAgentMaster] = useState<any[]>([]);
  const [RoleSpeKnowledgeValue, setRoleSpeKnowledgeValue] = useState<
    RoleSpecKnowledge[]
  >([
    {
      RoleSpeKnowledge: { key: 0, text: "" },
      RequiredLevel: { key: 0, text: "" },
      RoleSpeKnowledge_fr: { key: 0, text: "" },
      RequiredLevel_fr: { key: 0, text: "" },
    },
  ]);
  const [qualificationValue, setQualificationValue] =
    useState<QualificationValue>({
      MinQualification: [],
      PrefeQualification: [],
      MinQualification_fr: [],
      PrefeQualification_fr: [],
    });
  const [TechnicalSkillValue, setTechnicalSkillValue] = useState<
    TechnicalSkills[]
  >([
    {
      TechnicalSkills: { key: 0, text: "" },
      LevelProficiency: { key: 0, text: "" },
      TechnicalSkills_fr: { key: 0, text: "" },
      LevelProficiency_fr: { key: 0, text: "" },
    },
  ]);

  const fetchRoleProfileData = async (JobCodeID: number) => {
    try {
      let filterConditions = [
        {
          FilterKey: "JobCode",
          Operator: "eq",
          FilterValue: JobCodeID,
        },
      ];
      const response = await getVRRDetails.GetHRMSRecruitmentRoleProfileDetails(
        filterConditions,
        "",
      );

      if (response.status === 200) {
        const data = response.data;

        if (data && data.length > 0) {
          const items = data[0];
          setAdvDetails((prevState) => ({
            ...prevState,
            RoleDetailsID: items?.ID,
            RolePurpose: items?.RolePurpose || "",
            JobDescription: items?.JobDescription || "",
            RolePurpose_fr: items?.RolePurpose_fr || "",
            JobDescription_fr: items?.JobDescription_fr || "",
            TotalExperience: items?.TotalExperience || "",
            ExperienceinMiningIndustry: items?.ExperienceinMiningIndustry || "",
            JobFunctionalType: items?.JobFunctionalType,
            JobFunctionalType_fr: items?.JobFunctionalType_fr,
            JobcodeChecked: true,
            JobBasedBGVVerification: items.JobBasedBGVVerification,
          }));
          setRoleSpeKnowledgeValue(items.RoleSpeKnowledgeValue);
          setTechnicalSkillValue(items.TechnicalSkillValue);
          setQualificationValue(items.qualificationValue);
        } else {
          setAdvDetails((prev) => ({
            ...prev,
            JobcodeChecked: false,
          }));
          console.warn("No data found for the given filter.");
        }
      } else {
        console.error("Error fetching data:", response.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

//   const fetchCandidateData = async (page: number, jobUniqueValue: string) => {
//     debugger
//     try {

//       setIsCandidateLoading(true);
//       const filterValue: FilterItem = {
//         jobCode: jobUniqueValue,
    
//         workflowStausId: [
//           workflowStatusApi.HRPending,
//           workflowStatusApi.LineManagerL1Pending,
//           workflowStatusApi.LineManagerL2Pending,
//           workflowStatusApi.InterviewScheduled,
//           workflowStatusApi.pendingHODSelection,
//           workflowStatusApi.CandidateSelectedIPanel,
//           workflowStatusApi.CandidateOnHoldIPanel,
//           workflowStatusApi.CandidateRejectedIPanel,
//           workflowStatusApi.PendingRecruitmentHRscheduleInterview,
//           workflowStatusApi.HRRejected,
//           workflowStatusApi.HROnHold,
//           workflowStatusApi.LineManagerLevel1OnHold,
//           workflowStatusApi.LineManagerLevel2OnHold,
//           workflowStatusApi.LineManagerLevel1Rejected,
//           workflowStatusApi.LineManagerLevel2Rejected,
//           workflowStatusApi.PendingCandidateUploadBGVDocs,
//           workflowStatusApi.UploadedtheCandidateBGVDocs,
//           workflowStatusApi.initiatetheBGVProcess,
//           workflowStatusApi.Offerdecline,
//           workflowStatusApi.SysytmeDecline,
//           workflowStatusApi.Pendingwithcandidatetosignofferletter,
//           workflowStatusApi.CandidateuploadedtheSignedOfferLetter,
//           workflowStatusApi.PendingwithCandidatetouploadotherDocuments,
//           workflowStatusApi.CandidateUploadedcandidatepersonalDocs,
//           workflowStatusApi.PendingwithCandidatetosignEmployementContract,
//           workflowStatusApi.UploadedthesignedEmployementcontractform,
//           workflowStatusApi.PendingHROfferInitiate,
//           workflowStatusApi.PendingLabourHireOfferRelease,
//           workflowStatusApi.PendingLabourhireWPPayment,
//           workflowStatusApi.PendingFinancePaymentReview,
//           workflowStatusApi.PendingLHWorkPermitProcess,
//           workflowStatusApi.PendingHREmploymentContractInit,
//           workflowStatusApi.PendingLHECRelease,
//           workflowStatusApi.OnboardingInprogress,
//           workflowStatusApi.RevertedBacktoCandidateforreuploadofferLetter,
//           workflowStatusApi.RevertedBacktoCandidateforreuploadDocs,
//           workflowStatusApi.RevertedBacktoCandidateforreuploadEmploymentContract,
//           workflowStatusApi.RevertedtheLabourHireOfferRelease,
//           workflowStatusApi.RevertedtheLabourHireEmployementContract,
//           workflowStatusApi.RevetedBacktoBGVDocuments,
//         ],
//         pagination: {
//           filterValue: "",
//           sortBy: "",
//           sortOrder: 0,
//           pageSize: 5,
//           currentPage: page,
//           totalItems: 0,
//         },
//       };
//       console.log("Filter Value for API:", filterValue);
   
//       const res =
//         await GetPortalJobsService.getCandidateDetailsInJobCode(filterValue);
//         console.log("Candidate API Response:", res);
// debugger
//       if (res.data && res.data.length > 0) {
//         const total = res.data[0]?.TotalItems || 0;
// console.log("Job Unique Key:", jobUniqueKey);
// console.log("Candidate Page:", candidateListPage);
// console.log("Candidate API Response:", res.data);
//         setTotalItems(total);
// debugger
//         setCandidateData(
//           res.data.map((item: any) => ({
//             CandidateID: item.CandidateID,
//             ApplicantName: item.ApplicantName,
//             PositionTitle: item.PositionTitle,
//             JobCode: item.JobCode,
//             Status: item.Status,
//             workflowStatusId: item.workflowStatusId,
//             applicationStatusId: item.applicationStatusId,
//             createdOn: item.createdOn
//               ? moment(item.createdOn, "DD/MM/YYYY").toDate()
//               : new Date(),
//             applicationStatus: item.applicationStatus,
//             createdBy: item.createdBy,
//             tblProfilesKcsas: item.tblProfilesKcsas || [],
//           })),
//         );
//       } else {
//         setCandidateData([]);
//         setTotalItems(0);
//       }
//     } catch (error) {
//       console.error("Candidate API failed:", error);
//       setCandidateData([]);
//       setTotalItems(0);
//     } finally {
//       setIsCandidateLoading(false);
//     }
//   };
 
const fetchCandidateData = async (
  page: number,
  jobUniqueValue: string,
  retry = true
) => {
  try {
    setIsCandidateLoading(true);

    const filterValue: FilterItem = {
      jobCode: jobUniqueValue,
            workflowStausId: [
          workflowStatusApi.HRPending,
          workflowStatusApi.LineManagerL1Pending,
          workflowStatusApi.LineManagerL2Pending,
          workflowStatusApi.InterviewScheduled,
          workflowStatusApi.pendingHODSelection,
          workflowStatusApi.CandidateSelectedIPanel,
          workflowStatusApi.CandidateOnHoldIPanel,
          workflowStatusApi.CandidateRejectedIPanel,
          workflowStatusApi.PendingRecruitmentHRscheduleInterview,
          workflowStatusApi.HRRejected,
          workflowStatusApi.HROnHold,
          workflowStatusApi.LineManagerLevel1OnHold,
          workflowStatusApi.LineManagerLevel2OnHold,
          workflowStatusApi.LineManagerLevel1Rejected,
          workflowStatusApi.LineManagerLevel2Rejected,
          workflowStatusApi.PendingCandidateUploadBGVDocs,
          workflowStatusApi.UploadedtheCandidateBGVDocs,
          workflowStatusApi.initiatetheBGVProcess,
          workflowStatusApi.Offerdecline,
          workflowStatusApi.SysytmeDecline,
          workflowStatusApi.Pendingwithcandidatetosignofferletter,
          workflowStatusApi.CandidateuploadedtheSignedOfferLetter,
          workflowStatusApi.PendingwithCandidatetouploadotherDocuments,
          workflowStatusApi.CandidateUploadedcandidatepersonalDocs,
          workflowStatusApi.PendingwithCandidatetosignEmployementContract,
          workflowStatusApi.UploadedthesignedEmployementcontractform,
          workflowStatusApi.PendingHROfferInitiate,
          workflowStatusApi.PendingLabourHireOfferRelease,
          workflowStatusApi.PendingLabourhireWPPayment,
          workflowStatusApi.PendingFinancePaymentReview,
          workflowStatusApi.PendingLHWorkPermitProcess,
          workflowStatusApi.PendingHREmploymentContractInit,
          workflowStatusApi.PendingLHECRelease,
          workflowStatusApi.OnboardingInprogress,
          workflowStatusApi.RevertedBacktoCandidateforreuploadofferLetter,
          workflowStatusApi.RevertedBacktoCandidateforreuploadDocs,
          workflowStatusApi.RevertedBacktoCandidateforreuploadEmploymentContract,
          workflowStatusApi.RevertedtheLabourHireOfferRelease,
          workflowStatusApi.RevertedtheLabourHireEmployementContract,
          workflowStatusApi.RevetedBacktoBGVDocuments,
        ],
      pagination: {
        filterValue: "",
        sortBy: "",
        sortOrder: 0,
        pageSize: 5,
        currentPage: page,
        totalItems: 0,
      },
    };
    const res =
      await GetPortalJobsService.getCandidateDetailsInJobCode(filterValue);
    if (res.data && res.data.length > 0) {
      const total = res.data[0]?.TotalItems || 0;
      console.log("Job Unique Key:", jobUniqueValue);
      console.log("Candidate Data from API:", res.data);
      setTotalItems(total);
      setCandidateData(res.data);
    } else {
      if (retry) {
        console.log("Retrying candidate API...");
        setTimeout(() => {
          void fetchCandidateData(page, jobUniqueValue, false);
        }, 800);
        return;
      }

      setCandidateData([]);
      setTotalItems(0);
    }
  } catch (error) {
    console.error("Candidate API failed:", error);
    setCandidateData([]);
    setTotalItems(0);
  } finally {
    setIsCandidateLoading(false);
  }
};
const fetchAgentMaster = async () => {
    const res = await CommonServices.GetMasterData("HRMSExternalAgents");

    if (res.status === 200) {
      setAgentMaster(res.data);
    }
  };
  useEffect(() => {
     void fetchAgentMaster();
  }, []);
  const getAppliedBy = (
    createdBy?: string,
    tblProfilesKcsas?: any[],
  ): string => {
    if (!createdBy) return "";

    const isNumeric = /^\d+$/.test(createdBy);

    if (isNumeric && (!tblProfilesKcsas || tblProfilesKcsas.length === 0)) {
      return "Candidate";
    }

    if (isNumeric && tblProfilesKcsas && tblProfilesKcsas.length > 0) {
      return "Internal Job Posting";
    }

    if (!isNumeric) {
      const agent = agentMaster.find((item) => item.AgentCode === createdBy);

      return agent?.AgentName || createdBy;
    }

    return "";
  };
const handleCandidateListPageChange = (page: number) => {
  setCandidateListPage(page);
  void fetchCandidateData(page, jobUniqueKey);
};

  const handleCandidateCardClick = (candidateId: number) => {
    console.log("Candidate clicked:", candidateId);
  };
  const getCandidateListData = (): CandidateItem[] => {
    if (!CandidateData || CandidateData.length === 0) return [];
    return CandidateData.map((item) => ({
      CandidateID: Number(item.CandidateID) || 0,
      ApplicantName: item.ApplicantName || "",
      appliedBy: getAppliedBy(
        (item as any).createdBy,
        (item as any).tblProfilesKcsas,
      ),
      createdOn: item.createdOn ? new Date(item.createdOn) : new Date(),
      Status: item.Status || " ",
      statusId:
        Number((item as any).workflowStatusId) ||
        Number((item as any).applicationStatusId) ||
        undefined,
      PositionTitle: item.PositionTitle || "",
    }));
  };

  const fetchData = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const filterConditionsVRR = [
        {
          FilterKey: "ID",
          Operator: "eq",
          FilterValue: props.stateValue?.ID,
        },
      ];
      const Conditions = "";

      const response = await getVRRDetails.GetRecruitmentDetails(
        filterConditionsVRR,
        Conditions,
      );

      if (response.data.length > 0) {
        const op = response.data[0];

        const BUName =
          props?.BusinessUnitCodeAllColumn.find(
            (item: any) => item.key === op.BusinessUnitCodeId,
          ) || {};

        const [
          RoleProfileDocment,
          GradingDocument,
          AdvertismentDocment,
          OnamSignedStampsDocment,
        ] = await Promise.all([
          CommonServices.GetAttachmentToLibrary(
            DocumentLibraray.RoleProfileMaster,
            op.JobCode,
            RoleProfileMaster.RoleProfile,
          ),
          CommonServices.GetAttachmentToLibrary(
            DocumentLibraray.RoleProfileMaster,
            op.JobCode,
            RoleProfileMaster.Grading,
          ),
          CommonServices.GetAttachmentToLibrary(
            DocumentLibraray.RecruitmentAdvertisementDocument,
            op.JobCode,
          ),
          CommonServices.GetAttachmentToLibrary(
            DocumentLibraray.ONAMSignedStampDocuments,
            op.JobCode,
          ),
        ]);

        if (
          RoleProfileDocment.status === 200 ||
          AdvertismentDocment.status === 200
        ) {
          setData((prevState) => ({
            ...prevState,
            ID: op.ID,
            BusinessUnitCodeID: op.BusinessUnitCodeId,
            DepartmentID: op.DepartmentId,
            SubDepartmentID: op.SubDepartmentId,
            SectionID: op.SectionId,
            DepartmentCodeID: op.DepartmentCodeId,
            JobNameInEnglishID: op.JobTitleEnglishId,
            JobNameInFrenchID: op.JobTitleFrenchId,
            PatersonGradeID: op.PatersonGradeId,
            DRCGradeID: op.DRCGradeId,
            JobCodeID: op.JobCodeId,
            BusinessUnitCode: op.BusinessUnitCode || "",
            BusinessUnitName: BUName.Name || "",
            BusinessUnitDescription: BUName.Description || "",
            Department: op.Department || "",
            SubDepartment: op.SubDepartment || "",
            Section: op.Section || "",
            DepartmentCode: op.DepartmentCode || "",
            Nationality: op.Nationality || "",
            JobNameInEnglish: op.JobTitleEnglish || "",
            JobNameInFrench: op.JobTitleFrench || "",
            PatersonGrade: op.PatersonGrade || "",
            DRCGrade: op.DRCGrade || "",
            EmployementCategory: op.EmploymentCategory || "",
            ContractType: op.TypeOfContract || "",
            JobCode: op.JobCode || "",
            AreaOfWork: op.AreaofWork || "",
            NoofPositionAssigned: op.NumberOfPersonNeeded
              ? op.NumberOfPersonNeeded.toString()
              : "0",
            ReasonForVacancy: op.ReasonForVacancy || "",
            RecruitmentAuthorised: op.RecruitmentAuthorised || "",
            IsPayrollEmailed: op.IsPayrollEmailed || "",
            EnterNumberOfMonths: Number(op.EnterNumberOfMonths) ?? 0,
            DateRequried: String(op.DateRequried),
            VacancyConfirmed: op.VacancyConfirmed || "",
            RoleProfileDocument: RoleProfileDocment.data.English || [],
            GradingDocument: GradingDocument.data.English || [],
            RoleProfileDocument_fr: RoleProfileDocment.data.French || [],
            GradingDocument_fr: GradingDocument.data.French || [],
            AdvertisementDocument: AdvertismentDocment.data || [],
            OnamSignedStampsDocument: OnamSignedStampsDocment.data || [],
          }));
        }
        await fetchRoleProfileData(op.JobCodeId);
        let JobCodeFilter = [
          {
            FilterKey: "JobCodeId",
            Operator: "eq",
            FilterValue: op.JobCodeId,
          },
          { FilterKey: "IsActive", Operator: "eq", FilterValue: 1 },
        ];
        let JobUniqueValueResponse = await getVRRDetails.GetJobUniqueDataValue(
          JobCodeFilter,
          "and",
        );
        if (
          JobUniqueValueResponse.status === ResponeStatus.SUCCESS &&
          JobUniqueValueResponse.data.length > 0
        ) {
          const uniqueKey = JobUniqueValueResponse.data[0]?.JobUniqueKey;
          setJobUniqueKey(uniqueKey);
          setCandidateListPage(1);
        }
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (props.stateValue?.ID) {
      const initialize = async () => {
        setTabVisibility({
          tab1: true,
          tab2: false,
          tab3: false,
        });
        setTabNameData([{ tabName: props.stateValue?.TabName }]);
        try {
          await fetchData();
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      void initialize();
    }
  }, [props.stateValue?.ID]);
useEffect(() => {
  const load = async () => {
    if (jobUniqueKey) {
      await fetchCandidateData(1, jobUniqueKey);
    }
  };
  void load();
}, [jobUniqueKey]);

  const OpenComments = async () => {
    setMainComponent(false);
    let filterConditions = [];
    let Conditions = "";

    filterConditions.push({
      FilterKey: "RecruitmentID",
      Operator: "eq",
      FilterValue: props.stateValue.ID,
    });
    const CommentsList = await getVRRDetails.GetCommentsData(
      props.EmployeeList,
      Conditions,
      filterConditions,
    );
    if (CommentsList.status === 200) {
      setCommentsData(CommentsList.data);
    }
  };

  const tabs = [
    {
      label: "My Submission",
      value: "tab1",
      content: (
        <Card
          variant="outlined"
          sx={{ boxShadow: "0px 2px 4px 3px #d3d3d3", marginTop: "2%" }}
        >
          <CardContent>
            {tabVisibility.tab1 && (
              <div>
                {/* <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg6">
                    <LabelHeaderComponents
                      value={`Job Title - ${data.JobNameInEnglish} (${data.JobCode})`}
                    >
                      {" "}
                    </LabelHeaderComponents>
                  </div>
                  <div className="ms-Grid-col ms-lg6">
                    <LabelHeaderComponents
                      value={`Status - ${props.stateValue?.Status}`}
                    >
                      {" "}
                    </LabelHeaderComponents>
                  </div>
                </div> */}
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.BusinessUnitCode}
                      value={data.BusinessUnitCode}
                      error={false}
                      disabled={true}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          BusinessUnitCode: value,
                        }))
                      }
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.BusinessUnitName}
                      value={data.BusinessUnitName}
                      disabled={true}
                      error={false}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          BusinessUnitName: value,
                        }))
                      }
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.BusinessUnitDescription}
                      value={data.BusinessUnitDescription}
                      error={false}
                      disabled={true}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          BusinessUnitDescription: value,
                        }))
                      }
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.Department}
                      value={data.Department}
                      disabled={true}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          Department: value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.SubDepartment}
                      value={data.SubDepartment}
                      disabled={true}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          SubDepartment: value,
                        }))
                      }
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.Section}
                      value={data.Section}
                      disabled={true}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          Section: value,
                        }))
                      }
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.DepartmentCode}
                      value={data.DepartmentCode}
                      disabled={true}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          DepartmentCode: value,
                        }))
                      }
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.Nationality}
                      value={data.Nationality}
                      disabled={true}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          Nationality: value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.PatersonGrade}
                      value={data.PatersonGrade}
                      disabled={true}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          PatersonGrade: value,
                        }))
                      }
                    />
                  </div>

                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.DRCGrade}
                      value={data.DRCGrade}
                      disabled={true}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          DRCGrade: value,
                        }))
                      }
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.EmploymentCategory}
                      value={data.EmployementCategory}
                      disabled={true}
                      error={false}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          EmployementCategory: value,
                        }))
                      }
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.TypeofContract}
                      value={data.ContractType}
                      disabled={true}
                      error={false}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          ContractType: value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.AreaofWork}
                      value={data.AreaOfWork}
                      disabled={true}
                      error={false}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          AreaOfWork: value,
                        }))
                      }
                    />
                  </div>

                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.NoofPerson}
                      value={data.NoofPositionAssigned}
                      disabled={true}
                      error={false}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          NoofPositionAssigned: value,
                        }))
                      }
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomInput
                      label={labelNames.PositionDetails.DatePositionRequired}
                      value={
                        data.DateRequried
                          ? new Date(data.DateRequried)
                              .toLocaleDateString("en-GB")
                              .replace(/\//g, "-")
                          : ""
                      }
                      disabled={true}
                      error={false}
                      mandatory={false}
                      onChange={(value) =>
                        setData((prevState) => ({
                          ...prevState,
                          DateRequried: value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="ms-Grid-row" style={{ marginLeft: "0%" }}>
                  <LabelHeaderComponents value={Attachment.Attachments} />
                </div>
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-lg3">
                    <CustomLabel
                      value={Attachment.PositionDocument.RoleProfileDocuments}
                    />
                    <CustomViewDocument
                      Attachment={data.RoleProfileDocument}
                      webUrl={props.webURL}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomLabel
                      value={
                        Attachment.PositionDocument.RoleProfileDocuments_fr
                      }
                    />
                    <CustomViewDocument
                      Attachment={data.RoleProfileDocument_fr}
                      webUrl={props.webURL}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomLabel
                      value={Attachment.PositionDocument.GradingDocuments}
                    />
                    <CustomViewDocument
                      Attachment={data.GradingDocument}
                      webUrl={props.webURL}
                    />
                  </div>
                  <div className="ms-Grid-col ms-lg3">
                    <CustomLabel
                      value={Attachment.PositionDocument.GradingDocuments_fr}
                    />
                    <CustomViewDocument
                      Attachment={data.GradingDocument_fr}
                      webUrl={props.webURL}
                    />
                  </div>
                </div>
                <div className="ms-Grid-row">
                  {data.AdvertisementDocument.length > 0 && (
                    <div className="ms-Grid-col ms-lg3">
                      <CustomLabel
                        value={
                          Attachment.PositionDocument.DraftONEMAdvertDocFrench
                        }
                      />
                      <CustomViewDocument
                        Attachment={data.AdvertisementDocument}
                        webUrl={props.webURL}
                      />
                    </div>
                  )}

                  {data.OnamSignedStampsDocument.length > 0 && (
                    <div className="ms-Grid-col ms-lg3">
                      <CustomLabel
                        value={
                          Attachment.PositionDocument.ONEMSignedStampedDocuments
                        }
                      />
                      <CustomViewDocument
                        Attachment={data.OnamSignedStampsDocument}
                        webUrl={props.webURL}
                      />
                    </div>
                  )}
                </div>
                <div className="ms-Grid-row">
                  {advDetails.RolePurpose != "" ? (
                    <div
                      className="ms-Grid-col ms-lg3"
                      style={{ position: "relative", right: "1px" }}
                    >
                      <div>
                        <CustomLabel
                          value={
                            Attachment.PositionDocument.ViewJobAdvertisement
                          }
                        />
                        <ReuseButton
                          Style={{
                            minWidth: "117px",
                            fontSize: "13px",
                            paddingBottom: "24px",
                            display: "flex",
                            flexDirection: "column",
                            height: "41px",
                            paddingTop: "23px",
                            backgroundColor:
                              ColorCode.ButtonColorCode.ButtonColor,
                            color: "white",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          label="VIEW"
                          imgSrc={require("../../assets/viewSubmision-white.svg")}
                          imgSrcHover={require("../../assets/viewSubmision-white.svg")}
                          imgAlt="View"
                          imgAltHover="Hovered View"
                          onClick={async () => {
                            setPreview(true);
                            setMainComponent(false);
                          }}
                          spacing={4}
                        />
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                  <div
                    className="ms-Grid-col ms-lg3"
                    style={{ position: "relative", right: "1px" }}
                  >
                    {/* <div className="ms-Grid-col ms-lg4"> */}
                    <CustomLabel
                      value={Attachment.PositionDocument.ViewComments}
                    />
                    <ReuseButton
                      Style={{
                        minWidth: "117px",
                        fontSize: "13px",
                        paddingBottom: "24px",
                        display: "flex",
                        flexDirection: "column",
                        height: "41px",
                        paddingTop: "23px",
                        backgroundColor: ColorCode.ButtonColorCode.ButtonColor,
                        color: "white",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      label="VIEW"
                      imgSrc={require("../../assets/viewSubmision-white.svg")}
                      imgSrcHover={require("../../assets/viewSubmision-white.svg")}
                      imgAlt="View"
                      imgAltHover="Hovered View"
                      onClick={OpenComments}
                      spacing={4}
                    />
                  </div>
                </div>

                <div style={{ position: "relative" }}>
                  {iscandidateLoading && (
                    <div className="loader-overlay">
                      <CustomLoader isLoading={true} />
                    </div>
                  )}

                  <CandidateList
                    candidates={getCandidateListData()}
                    currentPage={candidateListPage}
                    pageSize={5}
                    totalItems={totalItems}
                    onPageChange={handleCandidateListPageChange}
                    onCardClick={handleCandidateCardClick}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ),
    },
  ];
  const back_fn = () => {
    props.navigation("/RecurimentProcess", {
      state: {
        TabName: props.stateValue?.TabName,
        tab: props.stateValue?.tab,
      },
    });
  };

  const handleBreadcrumbChange = (newItem: string) => {
    setactiveTab(newItem);
  };

  return (
    <>
      {Preview ? (
        <PreviewScreen
          data={advDetails}
          onclose={() => {
            setPreview(false);
            setMainComponent(true);
          }}
          Ok_btnfn={() => {
            setPreview(false);
            setMainComponent(true);
          }}
          RoleSpec={RoleSpeKnowledgeValue}
          Qualification={qualificationValue}
          TechinicalSkills={TechnicalSkillValue}
          JobTitle={data.JobNameInEnglish}
          JobTitle_fr={data.JobNameInFrench}
        />
      ) : MainComponent ? (
        <>
          <CustomLoader isLoading={isLoading}>
            <div className="menu-card">
              <BreadcrumbsComponent
                items={tabs}
                initialItem={activeTab}
                TabName={TabNameData}
                onBreadcrumbChange={handleBreadcrumbChange}
                JobValue={{
                  JobTitle: data.JobNameInEnglish,
                  JobCode: data.JobCode,
                  Status: props.stateValue?.Status,
                }}
                additionalButtons={[
                  {
                    label: ButtonAction.Back,
                    onClick: () => {
                      back_fn();
                    },
                  },
                ]}
              />
            </div>
          </CustomLoader>
        </>
      ) : (
        <>
          <CommanComments
            onClose={() => setMainComponent(true)}
            Comments={CommentData}
          />
        </>
      )}
    </>
  );
};

export default ApprovedVRRView;
