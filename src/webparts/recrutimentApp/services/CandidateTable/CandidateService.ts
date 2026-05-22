import moment from "moment";
import { ApiResponse } from "../../models/apimodels";
import {
  CandidateProfile,
  COIType,
  CommentsData,
  CompanyDetails,
  employeeReferenceDetail,
  GetProfileByJobCode,
  PPEDetail,
  PreviousEmployer,
  sendEmail,
  WorkflowJson,
} from "../../models/Icareerportal";
import {
  EmailService,
  GetJobRequestData,
  getProfileData,
  PPEMasterTable,
} from "../AxiosService/CareerPortalAPI";
import {
  CandidateDetails,
  dedupe,
  FetchInterviewPanelOptions,
  FilterItem,
  ICandidateService,
  InterviewscheduleL2,
  PanelEntry,
  panelMember,
  RescheduledCandidate,
  resolveName,
  toPanelEntry,
} from "./ICandidateService";
import {
  agentCode,
  CategoryID,
  InterviewLevels,
  NationalityCode,
  quesContentId,
  RoleName,
} from "../../utilities/ConditionConfig";
import {
  CareerPotalServices,
  CommonServices,
  masterService,
} from "../ServiceExport";
import {
  calculateTotalExperienceYears,
  getcountryCode,
} from "../../components/Hooks/reusehooks";
import { AttachmentDetails } from "../../components/Screens/RecruitmentTable/AdvertReviewDrawer/Hooks/getAttachmentDetails";
import { BatchQuery, IDocFiles } from "../SPService/Ispservice";
import {
  formatToDateTimeLocal,
  toAttachment,
} from "../../components/Hooks/dateConfigfn";
import { PanelMember } from "../../components/Screens/CandidateTable/Hooks/fetchPanelMembers";
import SPServices, { getSP } from "../SPService/spservice";
import {
  DocumentLibraray,
  ListNames,
  RoleID,
  StatusId,
  workflowStatusApi,
} from "../../utilities/Config";
import { COIAttach } from "../CareerPortal/ICareerPortal";
import { count } from "../../utilities/ApiConfig";

export default class CandidateService implements ICandidateService {
  async getCandidateDetailsInJobCode(
    FilterValue: FilterItem,
  ): Promise<ApiResponse<GetProfileByJobCode[]>> {
    try {
      const res = await getProfileData.GetProfileByJobCode(FilterValue);

      if (!res?.data?.data) {
        return {
          data: [],
          status: 200,
          message: "No candidate data",
        };
      }

      const totalItems = res.data.pagination?.totalItems || 0;

      const mappedData: GetProfileByJobCode[] = res.data.data.map(
        (item: any, index: number) => {
          const JobCode = item?.jobCode?.split("-")[0];

          const CreatedBy =
            typeof item?.createdBy === "string" &&
            item.createdBy.startsWith("ANT")
              ? "Agent"
              : /^\d+$/.test(item?.createdBy)
                ? "Candidate"
                : "Internal Employee";

          return {
            SNO: index + 1,
            CandidateID: item?.jobRequestId,
            ApplicantName: item?.applicantName,
            PositionTitle: item?.jobTitle?.displayText,
            JobCode: JobCode,
            Status: item?.workflowStatus?.displayText,
            workflowStatusId: item?.workflowStatusId,
            createdOn: moment(item?.createdOn).format("DD/MM/YYYY"),
            TotalItems: totalItems,
            applicationStatusId: item?.applicationStatusId,
            applicationStatus: item?.applicationStatus?.displayText,
            createdBy: CreatedBy,
            tblProfilesKcsas: item?.tblProfilesKcsas || [],
          };
        },
      );
      // console.log("Mapped Candidate Data:", mappedData);
      return {
        data: mappedData,
        status: 200,
        message: "Get Candidate details",
      };
    } catch (error) {
      console.error("Error Get Candidate details:", error);

      return {
        data: [],
        status: 500,
        message: "Error Get Candidate details",
      };
    }
  }

  async GetDashboardDetailsL2(
    filterParam: any,
    filterConditions: any,
  ): Promise<ApiResponse<GetProfileByJobCode[]>> {
    try {
      let GridResult: GetProfileByJobCode[] = [];

      const res: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        Select: `*,JobCode/JobCode,Status/StatusDescription,RecruitmentID/Id`,
        Filter: filterParam,
        FilterCondition: filterConditions,
        Expand: `RecruitmentID,Status,JobCode`,
        Topcount: count.Topcount,
        Orderby: "ID",
        Orderbydecorasc: true,
      });

      if (!res.length) {
        return { data: [], status: 200, message: "No records found" };
      }

      const ids: number[] = res
        .map((item: any) => item.RecruitmentID?.Id)
        .filter(Boolean);

      if (!ids.length) {
        return {
          data: [],
          status: 200,
          message: "No linked recruitment records found",
        };
      }

      const recruitmentFilter = [
        { FilterKey: "ID", Operator: "in", FilterValue: ids },
      ];

      GridResult = await Promise.all(
        res.map(async (item, index) => {
          let GradeLevel;
          try {
            GradeLevel = await masterService.GetGradeLevel(item?.JobGrade);
          } catch (err) {
            console.error("GradeLevel API failed:", err);
            GradeLevel = { data: [] }; // fallback
          }

          return {
            SNO: index + 1,
            CandidateID: item.ID,
            ApplicantName: [item.FristName, item.MiddleName, item.LastName]
              .filter(Boolean)
              .join(" ")
              .trim(),
            PositionTitle: item?.PositionTitle,
            JobCode: item?.JobCode?.JobCode,
            JobGrade: item?.JobGrade,
            Nationality: item?.Nationality,

            interviewLevels: GradeLevel?.data || [],
            jobrequestID: item?.JobRequestID,

            Status: item?.Status?.StatusDescription ?? "",
            workflowStatusId: item?.StatusId,

            createdOn: moment(item?.Created).format("DD/MM/YYYY"),
            TotalItems: 0,
            applicationStatusId: "",
            applicationStatus: "",
            createdBy: item.ExternalAgentDetails,
            tblProfilesKcsas: [],
          };
        }),
      );

      return { data: GridResult, status: 200, message: "Success" };
    } catch (error) {
      console.error(`Error fetching from Candidate details:`, error);
      return { data: [], status: 500, message: "Error fetching data" };
    }
  }

  async fetchCandidateDetails(
    CandidateID: string,
  ): Promise<ApiResponse<CandidateProfile[] | null>> {
    try {
      const GetProfileByJobCodeData: CandidateProfile[] = [];
      await getProfileData
        .getCandidateProfile(CandidateID)
        .then(async (res) => {
          const op = res.data.data;
          const CandidateCV = await CommonServices.GetDocumentinUrl(
            op?.document?.filePath,
          );
          const BusinessLinkPath = op?.profile?.profileDetailAttachments.filter(
            (item: any) => item.attachmentTypeCoe === "PA01",
          );
          const BusinessDocument = await CommonServices.GetDocumentinUrl(
            BusinessLinkPath[0]?.document?.filePath,
          );
          const FamilyLinkPath = op?.profile?.profileDetailAttachments.filter(
            (item: any) => item.attachmentTypeCoe === "PA02",
          );
          const FamilyDocument = await CommonServices.GetDocumentinUrl(
            FamilyLinkPath[0]?.document?.filePath,
          );

          const ProofIdentity = await masterService.GetAllMaster(
            CategoryID.ProofofIdentity,
          );
          const totalExperienceYears = calculateTotalExperienceYears(
            op?.profile?.profileDetailExperiences,
          );

          const CountryCode = await masterService.GetCountryMaster();

          const profileExperiance =
            Array.isArray(op?.profile?.profileDetailExperiences) &&
            op.profile.profileDetailExperiences.length > 0
              ? op.profile.profileDetailExperiences[
                  op.profile.profileDetailExperiences.length - 1
                ]
              : undefined;
          const dob = new Date(new Date(op?.profile?.dob));
          const today = new Date();

          let age = today.getFullYear() - dob.getFullYear();
          const monthDiff = today.getMonth() - dob.getMonth();
          const dayDiff = today.getDate() - dob.getDate();

          if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
          }
          const getOptAnswers = op?.profile?.profileXOptAnswers
            .filter(
              (item: { question: { scopeId: string } }) =>
                item.question?.scopeId === "S7",
            )
            .sort((a: any, b: any) => {
              const textA = typeof a.text === "string" ? a.text : "";
              const textB = typeof b.text === "string" ? b.text : "";
              return textA.localeCompare(textB);
            });
          // console.log(getOptAnswers, "getOptAnswers");
          // let AgenName = op?.profile?.profileXAgent === null ? op?.profile?.kcsaEmployees ? "Internal Employee" :op?.profile?.profileXAgent?.agentCode === agentCode.RecruitmentHR ? RoleName.RecruitmentHR : op?.profile?.profileXAgent?.agent?.name;
          const profileXAgent = op?.profile?.profileXAgent;

          const AgenName =
            !profileXAgent ||
            (Array.isArray(profileXAgent) && profileXAgent.length === 0)
              ? op?.profile?.kcsaEmployees &&
                op?.profile?.kcsaEmployees.length === 0
                ? "Candidate"
                : "Internal Employee"
              : profileXAgent?.agentCode === agentCode.RecruitmentHR
                ? RoleName.RecruitmentHR
                : profileXAgent?.agent?.name || "";

          const IdentityID = ProofIdentity.data?.filter(
            (item) => item?.value === op?.profile?.identityTypeId,
          );
          const familyDetails = op?.profile?.familyDetails?.map((item: any) => {
            const code = getcountryCode(
              CountryCode?.data ?? [],
              item?.contactNumber,
            );
            return {
              name: item?.name,
              // "age": item?.age,
              // "genderId": item?.genderId,
              relationshipDetail: item?.relationshipDetail?.displayText,
              contactNumber: code,
            };
          });
          const emergencyContacts = op?.profile?.emergencyContacts?.map(
            (item: any) => {
              const code = getcountryCode(
                CountryCode?.data ?? [],
                item?.contactNumber,
              );
              return {
                name: item?.contactName,
                // "age": item?.age,
                // "genderId": item?.genderId,
                relationshipDetail: item?.relationshipDetail?.displayText,
                contactNumber: code,
              };
            },
          );
          const employeeReferenceDetail = {
            empId: op?.profile?.employeeReferenceDetails?.empId,
            empName: op?.profile?.employeeReferenceDetails?.empName,
            empEmail: op?.profile?.employeeReferenceDetails?.empEmail,
            company: op?.profile?.employeeReferenceDetails?.company,
          };
          const companyDetails = {
            operation:
              op?.profile?.profileDetailEmploymentHistory?.workedOperation,
            role: op?.profile?.profileDetailEmploymentHistory?.workRole,
            region: op?.profile?.profileDetailEmploymentHistory?.territory,
          };
          let PPEData: PPEDetail[] = [];

          if (op?.tblJobProfilePpeRequests) {
            const PPEMaster = await PPEMasterTable.getPPEMaster();

            const ppeMap = new Map<number, any>(
              PPEMaster.data.data.map((ppe: any) => [ppe.id, ppe]),
            );

            PPEData = op.tblJobProfilePpeRequests.map(
              (item: any): PPEDetail => {
                const ppe = ppeMap.get(item.ppeid);

                const size = ppe?.tblMstPpeSizes?.find(
                  (s: any) => s.ppedid === item.sizeId,
                );

                return {
                  PPEType: ppe?.ppename ?? "",
                  PPESize: size?.sizeText ?? "",
                };
              },
            );
          }

          const JobCode = op?.jobCode?.split("-")[0];
          const willingRelocated = getOptAnswers.filter(
            (item: any) =>
              item.question?.quesContentId === quesContentId.WillingRelocate,
          );
          const code = getcountryCode(
            CountryCode?.data ?? [],
            profileExperiance?.refMobile,
          );
          const PreviousEmployer = {
            name: profileExperiance?.refName,
            Designation: profileExperiance?.refDesignationDetail?.displayText,
            Email: profileExperiance?.refEmail,
            ContractNumber: code ?? "",
            CompanyName: profileExperiance?.company,
          };
          const candidateLanguages: string[] =
            op?.profile?.profileDetailLanguages?.map(
              (item: { language: string }) => item.language,
            ) || [];
          const [years, months] = (
            op?.profile?.totalYearOfExperiance ?? "0-0"
          ).split("-");
          const formattedExperience = `${years} years ${months} months`;
          const ContactNumber = getcountryCode(
            CountryCode?.data ?? [],
            op?.profile?.contactNumber1,
          );

          const OverallAttachment: AttachmentDetails[] = [
            ...(CandidateCV.data.length > 0
              ? [toAttachment("Candidate Resume", CandidateCV.data)]
              : []),

            ...(FamilyDocument.data?.length > 0
              ? [toAttachment("Family Link Document", FamilyDocument.data)]
              : []),

            ...(BusinessDocument.data?.length > 0
              ? [toAttachment("Business Link Document", BusinessDocument.data)]
              : []),
          ];
          const GetProfileDahboard: CandidateProfile = {
            CandidateID: op?.jobRequestId,
            profileID: op?.profileId,
            JobCode: JobCode,
            JobTitle: op?.jobDetail?.descriptions_en?.jobTitle,
            ApplicantName: `${op?.profile?.firstName || ""} ${op?.profile?.middleName || ""} ${op?.profile?.lastName || ""}`,
            ApplicantSurName: op?.profile?.lastName,
            FristName: op?.profile?.firstName,
            MiddleName: op?.profile?.middleName,
            ResidentialAddress: op?.profile?.profileAddress?.address1,
            DOB: op?.profile?.dob,
            ContactNumber: ContactNumber ?? "",
            Email: op?.profile?.email,
            Nationality: op?.profile?.nationality?.displayText,
            NatioCode: op?.profile?.nationality?.value,
            Gender: op?.profile?.gender?.displayText
              ? op?.profile?.gender?.displayText
              : op?.profile?.genderId,
            HighestQualification: op?.profile?.education?.displayText,
            ExperienceMining: op?.profile?.profileXAgent
              ? formattedExperience
              : totalExperienceYears,
            ExperRelatedfield: op?.profile?.releventExperience,
            Status: op?.workflowStatus?.displayText,
            StatusId: op?.workflowStatusId,
            Agencies: AgenName,
            CandidateResume: CandidateCV.data,
            Comments: [], // CommentsData,
            workflowStatusId: op?.workflowStatusId,
            hrComments: op?.hrComments,
            JobVaildFromDate: op?.jobDetail?.validFrom,
            JobVaildToDate: op?.jobDetail?.validTo,
            CandidateResumeLink: op?.document?.filePath,
            ConflictsOfInterest:
              op?.profile?.profileXOptAnswers[0]?.answerContent?.contentEn,
            disability:
              op?.profile?.profileDetailDisclosure?.hasDisability === 1
                ? "Yes"
                : "No",
            disabilityReason:
              op?.profile?.profileDetailDisclosure?.disabilityDetails,
            identityValue: op?.profile?.identityValue,
            identityType:
              IdentityID && IdentityID.length > 0
                ? IdentityID[0].displayText
                : "Passport",

            NumberOftax: op?.profile?.taxDependents ?? "",
            CurrentEmployer: profileExperiance?.company,
            CurrentPosition: profileExperiance?.title,
            WillingToRelocate: willingRelocated[0]?.answerContent?.contentEn,
            previouslyworkedMine:
              op?.profile?.profileDetailEmploymentHistory
                ?.hasIvanhoeZijinExperienceId === "1"
                ? "Yes"
                : op?.profile?.profileDetailEmploymentHistory
                      ?.hasIvanhoeZijinExperienceId === undefined
                  ? undefined
                  : "No",
            familylinks:
              op?.profile?.hasEmployeeRelation === "1" ? "Yes" : "No",
            businesslinks: op?.profile?.hasBusinessLinks === "1" ? "Yes" : "No",
            familyDocuments: FamilyDocument.data,
            businessDocuments: BusinessDocument.data,
            Age: String(age),
            CountryofOrgin: op?.profile?.nationality?.displayText ?? "",
            Citizenship: op?.profile?.nationality?.displayText ?? "",

            FamilyLink: FamilyLinkPath[0]?.document?.filePath,
            BusinessLink: BusinessLinkPath[0]?.document?.filePath,
            GPA: 0,

            COIAppreve: op?.profile?.profileDetailCoi?.approver ?? "",
            COIComments: op?.profile?.profileDetailCoi?.comments ?? "",
            COIReason: op?.profile?.coiReason ?? "",

            countryOfResidency:
              op?.profile?.countryOfResidencyDetail?.countryName ?? "",
            residentStatus:
              op?.profile?.residentStatus === "Y"
                ? "Yes"
                : op?.profile?.residentStatus === "N"
                  ? "No"
                  : "",
            maritalStatus: op?.profile?.maritalStatusDetail?.displayText ?? "",
            childrenDetails:
              op?.profile?.nationalityId === "N0"
                ? familyDetails
                : emergencyContacts,
            employeeReferenceDetails: employeeReferenceDetail,
            maritalStatusId: op?.profile?.maritalStatus ?? "",
            joiningDate: op?.startDate ?? "",
            noticePeriod: op?.noticePeriodDays ?? "",
            hasIvanhoeZijinExperience:
              op?.profile?.profileDetailEmploymentHistory
                ?.hasIvanhoeZijinExperienceId === "3"
                ? "No"
                : (op?.profile?.profileDetailEmploymentHistory
                    ?.hasIvanhoeZijinExperience?.displayText ?? ""),
            companyDetails: companyDetails,
            businesslinkscompany:
              op?.profile?.businessLinkCompany === "CD03"
                ? op?.profile?.whichCompany
                : op?.profile?.businessLinkCompanyDetail?.displayText,
            PreviousEmployerDetails: PreviousEmployer,
            LanguageKnown: candidateLanguages,

            PPEDetails: PPEData,
            RoleProfile: [],
            OverallAtttachment: OverallAttachment,

            NationalityShort:
              op?.profile?.nationality?.value === NationalityCode.Nationals
                ? "DRC"
                : "EXPAT",
          };

          GetProfileByJobCodeData.push(GetProfileDahboard);
        })
        .catch((error) => {
          console.log(error, "error");
        });

      return {
        data: GetProfileByJobCodeData,
        status: 200,
        message: "Success",
      };
    } catch (error) {
      console.error(
        "Error inserting data into HRMSRecruitmentDptDetails:",
        error,
      );
      return {
        data: [],
        status: 500,
        message: "Error inserting data into HRMSRecruitmentDptDetails",
      };
    }
  }

  async getCandidateDetailsL2(
    CandidateID: number,
  ): Promise<ApiResponse<CandidateProfile[]>> {
    try {
      const res: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        Select:
          "*,JobCode/JobCode,RecruitmentID/ID,Status/ID,Status/StatusDescription,ID",
        Expand: "JobCode,RecruitmentID,Status",
        FilterCondition: "and",
        Filter: [
          {
            FilterKey: "ID",
            Operator: "eq",
            FilterValue: CandidateID,
          },
        ],
        Topcount: 1000,
      });
      let defaultGrade = "",
        defaultLevel = "";
      try {
        const posRes: any[] = await SPServices.SPReadItems({
          Listname: ListNames.HRMSRecruitmentPositionDetails,
          Select: "*,PatersonGrade/PatersonGrade",
          Expand: "PatersonGrade",
          Filter: [
            {
              FilterKey: "RecruitmentID",
              Operator: "eq",
              FilterValue: res[0]?.RecruitmentID?.ID,
            },
          ],
        });
        defaultGrade =
          posRes?.[0]?.PatersonGrade?.PatersonGrade ||
          posRes?.[0]?.PatersonGrade ||
          "";
        if (defaultGrade) {
          const gr: any[] = await SPServices.SPReadItems({
            Listname: ListNames.HRMSGradeMaster,
            Select: "*",
            Filter: [
              {
                FilterKey: "PatersonGrade",
                Operator: "eq",
                FilterValue: defaultGrade,
              },
            ],
          });
          defaultLevel = gr?.[0]?.Levels || "";
        }
      } catch (_) {}
      const enriched: CandidateProfile[] = await Promise.all(
        (res || []).map(async (item: any) => {
          const CandidateCV = await CommonServices.GetDocumentinUrl(
            item?.CandidateResumeLink,
          );
          const BusinessDocument = await CommonServices.GetDocumentinUrl(
            item?.BusinessLink,
          );
          const FamilyDocument = await CommonServices.GetDocumentinUrl(
            item?.FamilyLink,
          );
          const OverallAttachment: AttachmentDetails[] = [
            ...(CandidateCV.data.length > 0
              ? [toAttachment("Candidate Resume", CandidateCV.data)]
              : []),

            ...(FamilyDocument.data?.length > 0
              ? [toAttachment("Family Link Document", FamilyDocument.data)]
              : []),

            ...(BusinessDocument.data?.length > 0
              ? [toAttachment("Business Link Document", BusinessDocument.data)]
              : []),
          ];
          // const gpa = await _calculateGPA(candidateId);
          return {
            CandidateID: item.ID,
            profileID: item.ProfileID,
            JobCode: item.JobCode?.JobCode,
            JobTitle: item.JobTitle,
            ApplicantName: [item.FristName, item.MiddleName, item.LastName]
              .filter(Boolean)
              .join(" ")
              .trim(),
            FristName: item.FristName,
            MiddleName: item.MiddleName,
            ResidentialAddress: item.ResidentialAddress,
            DOB: item.DOB,
            ContactNumber: item.ContactNumber,
            Email: item.Email,
            ApplicantSurName: item.LastName,
            Nationality: item.Nationality,
            Gender: item.Gender,
            HighestQualification: item.Qualification,
            ExperienceMining: item.TotalYearOfExperiance,
            ExperRelatedfield: item.ReleventExperience,
            Status: item?.Status?.StatusDescription,
            StatusId: item.Status?.ID,
            Agencies: item.Agencies,
            CandidateResume: CandidateCV.data,
            RoleProfile: [],
            OverallAtttachment: OverallAttachment,
            Comments: [],
            workflowStatusId: "",
            hrComments: "",
            JobVaildFromDate: "",
            JobVaildToDate: "",
            CandidateResumeLink: "",
            ConflictsOfInterest:
              item?.ConflictsOfInterest === "Yes" ? "Yes" : "No",
            disability: item?.Disability === "Yes" ? "Yes" : "No",
            disabilityReason: item?.DisabilityDetails,
            identityValue: "",
            identityType: "",
            NatioCode: item?.NationalityCode,

            Age: "",
            NumberOftax: item.NumberOfTaxDependents,
            CurrentEmployer: item?.LastOrCurrentEmployer,
            CurrentPosition: item?.LastOrCurrentPosition,
            WillingToRelocate: "",
            previouslyworkedMine: "",
            familylinks: "",
            businesslinks: "",
            familyDocuments: FamilyDocument.data,
            businessDocuments: BusinessDocument.data,
            CountryofOrgin: "",
            Citizenship: "",

            FamilyLink: "",
            BusinessLink: "",
            GPA: 0,

            COIAppreve: item?.COIEmail,
            COIComments: item?.COIComments,
            COIReason: item?.COIReason,

            countryOfResidency: "",
            residentStatus: "",
            maritalStatus: "",
            childrenDetails: [],
            employeeReferenceDetails: {} as employeeReferenceDetail,
            maritalStatusId: "",

            joiningDate: "",
            noticePeriod: "",

            hasIvanhoeZijinExperience: "",
            companyDetails: {} as CompanyDetails,

            businesslinkscompany: "",
            PreviousEmployerDetails: {} as PreviousEmployer,
            LanguageKnown: [],

            PPEDetails: [],

            InterviewStartDate: formatToDateTimeLocal(item?.InterviewDate),
            InterviewStartTime: item?.InterviewTime,
            InterviewEndTime: item?.InterviewLink,

            NationalityShort:
              item?.NationalityCode === NationalityCode.Nationals
                ? "DRC"
                : "EXPAT",
          } as CandidateProfile;
        }),
      );
      return {
        data: enriched,
        status: 200,
        message: "Interview panel details fetched successfully",
      };
    } catch (error) {
      console.error("fetchInterviewPanelDetails failed:", error);
      return {
        data: [],
        status: 500,
        message: "Error fetching interview panel details",
      };
    }
  }

  async fetchInterviewPanelDetails({
    BUCodeID,
    assignHREmail,
    candidateID,
    statusID,
  }: FetchInterviewPanelOptions): Promise<ApiResponse<panelMember | null>> {
    const empty: panelMember = {
      Level1: [],
      Level2: [],
    };

    try {
      const jdeQuery: BatchQuery = {
        StateValue: 1,
        ListName: ListNames.JDEDataMapping,
        Filter: [
          {
            FilterKey: "BUCId",
            Operator: "eq",
            FilterValue: BUCodeID,
          },
        ],
        FilterCondition: "and",
        select: [
          "*",
          "BUC/BusineesUnitCode",
          "LineManager/EMail",
          "HOD/EMail",
          "HR/EMail",
          "EXCO/EMail",
        ],
        expand: ["BUC", "LineManager", "HOD", "HR", "EXCO"],
      };

      const userRoleQuery: BatchQuery = {
        StateValue: 2,
        ListName: ListNames.HRMSRecruitmentUserRole,
        Filter: [],
        FilterCondition: "",
        select: ["*"],
        expand: [],
      };

      const batchRes: Record<number, any[]> = await SPServices.batchGet([
        jdeQuery,
        userRoleQuery,
      ]);

      const jdeItems = batchRes[1] ?? [];
      const userRoles = batchRes[2] ?? [];
      const jdeItem = jdeItems[0];

      if (!jdeItem) {
        return { data: empty, status: 200, message: "No JDE mapping found" };
      }

      const panelRoleEntry = userRoles.find(
        (r: any) => r.ID === RoleID.InterviewPanel,
      );
      const adGroupOptions = panelRoleEntry?.ADGroupID
        ? ((await CommonServices.GetADgruopsEmailIDs(panelRoleEntry.ADGroupID))
            .data ?? [])
        : [];

      let existingLevel1: any[] = [];
      let existingLevel2: any[] = [];
      if (
        Number(statusID) ===
        StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel
      ) {
        const levels =
          Number(statusID) ===
          StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel
            ? [InterviewLevels.Level1, InterviewLevels.Level2]
            : [InterviewLevels.Level1];

        const existingPanelFilter = [
          {
            FilterKey: "CandidateID",
            Operator: "eq",
            FilterValue: candidateID,
          },
          { FilterKey: "InterviewLevel", Operator: "in", FilterValue: levels },
        ];

        const existingPanelQuery: BatchQuery = {
          StateValue: 3,
          ListName: ListNames.HRMSInterviewPanelDetails,
          Filter: existingPanelFilter,
          FilterCondition: "and",
          select: [
            "ID",
            "CandidateID/ID",
            "RecruitmentID/ID",
            "InterviewLevel",
            "InterviewPanel/Id",
            "InterviewPanel/Title",
            "InterviewPanel/EMail",
            "IsScoreSheetUploaded",
          ],
          expand: ["InterviewPanel", "RecruitmentID", "CandidateID"],
        };
        const panelBatch: Record<number, any[]> = await SPServices.batchGet([
          existingPanelQuery,
        ]);
        let existingPanelItems = panelBatch[3] ?? [];

        const resolvedExistingPanel = (
          await Promise.all(
            existingPanelItems.map((item) => toPanelEntry(item)),
          )
        ).filter((e): e is PanelEntry => e !== null);

        existingLevel1 = resolvedExistingPanel.filter(
          (p) => p.Levels === InterviewLevels.Level1,
        );
        existingLevel2 = resolvedExistingPanel.filter(
          (p) => p.Levels === InterviewLevels.Level2,
        );
      }

      type NameTask = { key: string; email: string };
      const nameTasks: NameTask[] = [];

      let assignHRId = await CommonServices.getUserGuidByEmail(assignHREmail);

      if (jdeItem.LineManager?.EMail)
        nameTasks.push({
          key: String(jdeItem?.LineManagerId),
          email: jdeItem.LineManager.EMail,
        });
      if (jdeItem.HOD?.EMail)
        nameTasks.push({
          key: String(jdeItem?.HODId),
          email: jdeItem.HOD.EMail,
        });
      if (jdeItem.EXCO?.EMail)
        nameTasks.push({
          key: String(jdeItem?.EXCOId),
          email: jdeItem.EXCO.EMail,
        });
      if (assignHREmail)
        nameTasks.push({
          key: String(assignHRId.data?.key),
          email: assignHREmail,
        });

      const nameResults = await Promise.all(
        nameTasks.map(async (t) => ({
          key: t.key,
          label: await resolveName(t.email),
        })),
      );
      const nameMap = Object.fromEntries(
        nameResults.map((r) => [r.key, r.label]),
      );

      const basePanelLevel1: PanelEntry[] = [];
      const basePanelLevel2: PanelEntry[] = [];

      if (
        String(statusID) ===
        workflowStatusApi.PendingRecruitmentHRscheduleInterview
      ) {
        if (jdeItem.LineManagerId && nameMap[String(jdeItem.LineManagerId)]) {
          basePanelLevel1.push({
            value: jdeItem.LineManagerId,
            label: nameMap[String(jdeItem.LineManagerId)],
            Email: jdeItem.LineManager.EMail,
            Role: RoleName.LineManager,
          });
        }
        if (jdeItem.HODId && nameMap[String(jdeItem.HODId)]) {
          basePanelLevel1.push({
            value: jdeItem.HODId,
            label: nameMap[String(jdeItem.HODId)],
            Email: jdeItem.HOD.EMail,
            Role: RoleName.HOD,
          });
        }
        if (assignHRId?.data?.key && nameMap[String(assignHRId.data.key)]) {
          basePanelLevel1.push({
            value: assignHRId.data.key,
            label: nameMap[String(assignHRId.data.key)],
            Email: assignHREmail,
            Role: RoleName.RecruitmentHR,
          });
        }
      } else if (
        Number(statusID) ===
        StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel
      ) {
        // if (jdeItem.LineManagerId && nameMap[String(jdeItem.LineManagerId)]) {
        //   basePanelLevel1.push({
        //     value: jdeItem.LineManagerId,
        //     label: nameMap[String(jdeItem.LineManagerId)],
        //     Email: jdeItem.LineManager.EMail,
        //     Role: RoleName.LineManager,
        //   });
        // }
        // if (jdeItem.HODId && nameMap[String(jdeItem.HODId)]) {
        //   basePanelLevel1.push({
        //     value: jdeItem.HODId,
        //     label: nameMap[String(jdeItem.HODId)],
        //     Email: jdeItem.HOD.EMail,
        //     Role: RoleName.HOD,
        //   });
        // }
        //  if (assignHRId?.data?.key && nameMap[String(assignHRId.data.key)]) {
        //   basePanelLevel1.push({
        //     value: assignHRId.data.key,
        //     label: nameMap[String(assignHRId.data.key)],
        //     Email: assignHREmail,
        //     Role: RoleName.RecruitmentHR,
        //   });
        // }
        basePanelLevel1.push(...existingLevel1);
        if (jdeItem.EXCOId && nameMap[String(jdeItem.EXCOId)]) {
          basePanelLevel2.push({
            value: jdeItem.EXCOId,
            label: nameMap[String(jdeItem.EXCOId)],
            Email: jdeItem.EXCO.EMail,
            Role: RoleName.EXCO,
          });
        }
        if (assignHRId?.data?.key && nameMap[String(assignHRId.data.key)]) {
          basePanelLevel2.push({
            value: assignHRId.data.key,
            label: nameMap[String(assignHRId.data.key)],
            Email: assignHREmail,
            Role: RoleName.RecruitmentHR,
          });
        }
        if (jdeItem.HODId && nameMap[String(jdeItem.HODId)]) {
          basePanelLevel2.push({
            value: jdeItem.HODId,
            label: nameMap[String(jdeItem.HODId)],
            Email: jdeItem.HOD.EMail,
            Role: RoleName.HOD,
          });
        }
        basePanelLevel2.push(...existingLevel2);
      } else {
        basePanelLevel1.push(...existingLevel1);
        basePanelLevel2.push(...existingLevel2);
        if (jdeItem.LineManagerId && nameMap[String(jdeItem.LineManagerId)]) {
          basePanelLevel1.push({
            value: jdeItem.LineManagerId,
            label: nameMap[String(jdeItem.LineManagerId)],
            Email: jdeItem.LineManager.EMail,
            Role: RoleName.LineManager,
          });
        }
        if (jdeItem.HODId && nameMap[String(jdeItem.HODId)]) {
          basePanelLevel1.push({
            value: jdeItem.HODId,
            label: nameMap[String(jdeItem.HODId)],
            Email: jdeItem.HOD.EMail,
            Role: RoleName.HOD,
          });
        }
        if (assignHRId?.data?.key && nameMap[String(assignHRId.data.key)]) {
          basePanelLevel1.push({
            value: assignHRId.data.key,
            label: nameMap[String(assignHRId.data.key)],
            Email: assignHREmail,
            Role: RoleName.RecruitmentHR,
          });
        }
      }

      const adOptions: PanelEntry[] = Array.isArray(adGroupOptions)
        ? adGroupOptions.map((o: any) => ({
            value: o.key ?? o.Id ?? 0,
            label: o.text ?? o.label ?? "",
            Email: o.Email ?? "",
            Role: RoleName.InterviewPanel,
          }))
        : [];

      let level1Panel: PanelEntry[] = [];
      let level2Panel: PanelEntry[] = [];

      // const allOptions = dedupe([...basePanelLevel1, ...basePanelLevel2, ...adOptions]);
      let panelMember = dedupe(basePanelLevel1);
      if (panelMember.length === 3) {
        level1Panel = dedupe(basePanelLevel1);
      } else {
        basePanelLevel1.push(...adOptions);
        level1Panel = dedupe(basePanelLevel1);
      }
      let panelMember2 = dedupe(basePanelLevel2);
      if (panelMember2.length === 3) {
        level2Panel = dedupe(basePanelLevel2);
      } else {
        basePanelLevel2.push(...adOptions);
        level2Panel = dedupe(basePanelLevel2);
      }

      const result: panelMember = {
        Level1: level1Panel,
        Level2: level2Panel,
      };

      return {
        data: result,
        status: 200,
        message: "Interview panel details fetched successfully",
      };
    } catch (error) {
      console.error("fetchInterviewPanelDetails failed:", error);
      return {
        data: empty,
        status: 500,
        message: "Error fetching interview panel details",
      };
    }
  }

  async UpdateCandidateStatus(
    data: WorkflowJson,
  ): Promise<ApiResponse<any | null>> {
    try {
      const Response = await getProfileData.UpdateCandidateStatus(data);
      return {
        data: Response.data,
        status: Response.status,
        message: Response.data.message,
      };
    } catch (error) {
      console.error("Error inserting data into AdvertisementDetails:", error);
      return {
        data: [],
        status: 500,
        message: "Error inserting data into AdvertisementDetails",
      };
    }
  }

  async SendEmailNotification(
    data: sendEmail,
  ): Promise<ApiResponse<any | null>> {
    try {
      const Response = await EmailService.emailnotification(data);
      return {
        data: Response.data,
        status: Response.status,
        message: Response.data.message,
      };
    } catch (error) {
      console.error("Error inserting data into AdvertisementDetails:", error);
      return {
        data: [],
        status: 500,
        message: "Error inserting data into AdvertisementDetails",
      };
    }
  }

  async UploadCOIAttachment(
    DocumentName: COIAttach,
    AttachFile: IDocFiles[],
  ): Promise<ApiResponse<any>> {
    try {
      let response;
      if (AttachFile.length > 0) {
        response = await SPServices.addDocLibFiles({
          FilePath: DocumentLibraray.HRMSCareerPortalCandidateCV,
          FolderNames: [
            `${DocumentName.RequestID.toString()}`,
            `${DocumentName.DocumentName.toString()}`,
          ],
          Datas: AttachFile,
        });

        return {
          data: response,
          status: 200,
          message: "Attachment replaced successfully",
        };
      }
      return {
        data: response,
        status: 400,
        message: "No attachments provided",
      };
    } catch (error) {
      console.error("Error during file replacement process:", error);
      return {
        data: null,
        status: 500,
        message: `Error during file replacement`,
      };
    }
  }

  async GetUpsertCOI(data: COIType): Promise<ApiResponse<any | null>> {
    try {
      const Response = await GetJobRequestData.UpsertCOI(data);
      return {
        data: Response.data,
        status: Response.status,
        message: Response.data.message,
      };
    } catch (error) {
      console.error("Error inserting data into AdvertisementDetails:", error);
      return {
        data: [],
        status: 500,
        message: "Error inserting data into AdvertisementDetails",
      };
    }
  }

  async InsertCandidateDetailsInList(
    CandidateDetails: CandidateDetails,
    InterviewPanel: any,
  ): Promise<ApiResponse<any | null>> {
    try {
      const response: any = await SPServices.SPAddItem({
        Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        RequestJSON: CandidateDetails,
      });

      if (response?.ID) {
        const jobDetailsResponse = await this.InsertInterviewPanel(
          InterviewPanel,
          parseInt(response?.ID),
        );
        return {
          data: jobDetailsResponse.data,
          status: jobDetailsResponse.status,
          message: jobDetailsResponse.message,
        };
      }

      return {
        data: [],
        status: 200,
        message: "Failed to insert RecruitmentDptDetails",
      };
    } catch (error) {
      console.error(
        "Error inserting data into HRMSRecruitmentDptDetails:",
        error,
      );
      return {
        data: [],
        status: 500,
        message: "Error inserting data into HRMSRecruitmentDptDetails",
      };
    }
  }

  async InsertInterviewPanel(
    InterviewPanel: any[],
    CandidateId: number,
  ): Promise<ApiResponse<any | null>> {
    try {
      const insertedRecords: any[] = [];

      for (const item of InterviewPanel) {
        const JobDetailsInsert = {
          RecruitmentIDId: item.RecruitmentIDId,
          InterviewLevel: item.InterviewLevel,
          InterviewPanelId: item.InterviewPanel,
          CandidateIDId: CandidateId,
        };

        const response = await SPServices.SPAddItem({
          Listname: ListNames.HRMSInterviewPanelDetails,
          RequestJSON: JobDetailsInsert,
        });

        insertedRecords.push(response);
      }

      return {
        data: insertedRecords,
        status: 200,
        message: "Job details inserted successfully",
      };
    } catch (error) {
      console.error("Error inserting job details:", error);
      return {
        data: [],
        status: 500,
        message: "Error inserting job details",
      };
    }
  }

  async RescheduledInterview(
    obj: RescheduledCandidate,
    ListName: string,
  ): Promise<ApiResponse<null>> {
    try {
      await SPServices.SPUpdateItem({
        Listname: ListName,
        RequestJSON: obj,
        ID: obj.ID,
      });

      return {
        data: null,
        status: 200,
        message: "Data Submitted successfully",
      };
    } catch (error) {
      console.error(error);
      return {
        data: null,
        status: 400,
        message: "Error On Posting Data",
      };
    }
  }

  async fetchCOIAttachment(DocumentName: COIAttach): Promise<ApiResponse<any>> {
    try {
      let response;
      const getLatestFile = (files: any[] = []): any[] => {
        if (!files.length) return [];

        const latest = files.reduce((latest, current) => {
          const currDate = new Date(
            current?.TimeLastModified || current?.Modified || current?.Created,
          );
          const latestDate = new Date(
            latest?.TimeLastModified || latest?.Modified || latest?.Created,
          );

          return currDate > latestDate ? current : latest;
        });

        return [latest];
      };

      const files = (await SPServices.getDocLibFiles({
        FilePath: `${DocumentLibraray.HRMSCareerPortalCandidateCV}/${DocumentName.RequestID}/${DocumentName.DocumentName}`,
      })) as IDocFiles[];

      let getFile = getLatestFile(files);
      response = getFile;

      return {
        data: response,
        status: 200,
        message: "Attachment replaced successfully",
      };
    } catch (error) {
      console.error("Error during file replacement process:", error);
      return {
        data: null,
        status: 500,
        message: `Error during file replacement`,
      };
    }
  }

  async InterviewScheduleLevel2(
    payloads: InterviewscheduleL2,
  ): Promise<ApiResponse<any[]>> {
    try {
      if (!payloads || !payloads.interviewPanelL2?.length) {
        return { data: [], status: 200, message: "No payloads to insert" };
      }

      const [batchedSP, execute] = getSP().batched();

      const results: any[] = [];

      payloads.interviewPanelL2.forEach((item) => {
        void batchedSP.web.lists
          .getByTitle(ListNames.HRMSInterviewPanelDetails)
          .items.add({
            RecruitmentIDId: item.RecruitmentIDId,
            InterviewLevel: item.InterviewLevel,
            InterviewPanelId: item.InterviewPanelId,
            CandidateIDId: item.CandidateIDId,
          })
          .then((res) => results.push(res));
      });

      void batchedSP.web.lists
        .getByTitle(ListNames.HRMSRecruitmentCandidatePersonalDetails)
        .items.getById(payloads.candidateUpdate.ID)
        .update({
          StatusId: payloads.candidateUpdate.StatusId,
          InterviewDateLevel2: payloads.candidateUpdate.InterviewDateLevel2,
          InterviewTimeLevel2: payloads.candidateUpdate.InterviewTimeLevel2,
          InterviewLinkLevel2: payloads.candidateUpdate.InterviewLinkLevel2,
        });

      await execute();

      return {
        data: results,
        status: 200,
        message: `Batch insert successful for ${payloads.interviewPanelL2.length} record(s)`,
      };
    } catch (error) {
      console.error("InterviewScheduleLevel2 error:", error);
      return { data: [], status: 500, message: "Batch insert failed" };
    }
  }
}
