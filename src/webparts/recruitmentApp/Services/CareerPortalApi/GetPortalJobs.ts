import * as moment from "moment";
import { AdvertisementDetails, CandidateProfile, CheckMyCandidate, COIType, FilterItem, GetAllMaster, GetMasterByCountry, GetProfileByFilter, GetProfileByJobCode, getQuestionById, jobsApplied, profileDetailAttachments, profileXagent, UpsertMasters, UpsertProfile, UpsertQuestions, WorkflowJson } from "../../Models/ApIInterface";
import { CommanQuestion, QuestionItem } from "../../Models/RecuritmentVRR";
import { agentCode, CategoryID, DataType, DocumentLibraray, ListNames, ResponeStatus, RoleName, RoleProfileMaster, workflowStatusApi } from "../../utilities/Config";
import { GetJobRequestData, getProfileData, GetStateByCountryApi, postAdveDetails, QuestionnaireApi, UploadCandidateCVData } from "../ReviewProfileService/ReviewCandidateService";
import { CommonServices, GetPortalJobsService } from "../ServiceExport";
import SPServices from "../SPService/SPServices";
import { CandidateDetails, COIAttach, DocumentValue, IGetPortalJobs, RescheduledCandidate, UpsertDocument } from "./IGetPortalJobs";
import { ViewQuestion } from "../../Screens/ScreenComponent/ViewQuestionCheckbox";
import { IDocFiles } from "../SPService/ISPServicesProps";
import { CommentsData, DataSyncToRecruitmentResponse } from "../RecruitmentProcess/IRecruitmentProcessService";
import { quesContentId } from "../../utilities/LabelName";

export default class GetPortalJobs implements IGetPortalJobs {
  async UpsertJobs(data: AdvertisementDetails): Promise<ApiResponse<any | null>> {
    try {
      let AdvertisementDetails: AdvertisementDetails = {
        jobCode: data?.jobCode,
        noOfPositions: data?.noOfPositions,
        validFrom: data?.validFrom,
        validTo: data?.validTo,
        employmentType: data?.employmentType,
        departmentId: data?.departmentId,
        role: data?.role,
        functionId: data?.functionId,
        onemdocPath: data?.onemdocPath,
        experience: data?.experience,
        nationality: data?.nationality,
        Descriptions_en: data?.Descriptions_en,
        Descriptions_fr: data?.Descriptions_fr,
        RoleAndTechSkills: data?.RoleAndTechSkills,
        MinAndPreferedQualifications: data?.MinAndPreferedQualifications,
        isActive: data?.isActive,
        IsExtened: data?.IsExtened
      }
      const response = await postAdveDetails.postUpsertJobs(AdvertisementDetails);
      return {
        data: response.data,
        status: response.status,
        message: response.data.message,
      };
    } catch (error) {
      console.error(
        "Error inserting data into AdvertisementDetails:",
        error
      );
      return {
        data: [],
        status: 500,
        message: "Error inserting data into AdvertisementDetails",
      };
    }
  }

  async UpsertAgenciesJobs(data: profileXagent): Promise<ApiResponse<any | null>> {
    try {
      let AgentDetails: profileXagent = {
        jobCode: data?.jobCode,
        jobsXAgents: data?.jobsXAgents
      }
      const response = await postAdveDetails.postAgenciesJobs(AgentDetails);
      return {
        data: response.data,
        status: response.status,
        message: response.data.message,
      };
    } catch (error) {
      console.error(
        "Error inserting data into AdvertisementDetails:",
        error
      );
      return {
        data: [],
        status: 500,
        message: "Error inserting data into AdvertisementDetails",
      };
    }
  }

  async getCandidateDetailsInJobCode(FilterValue: FilterItem): Promise<ApiResponse<GetProfileByJobCode[] | null>> {
    try {
      let GetProfileByJobCodeData: GetProfileByJobCode[] = []
      await getProfileData.GetProfileByJobCode(FilterValue).then((res) => {
        let TotalItems = res?.data?.pagination?.totalItems;
        GetProfileByJobCodeData = res.data.data.map((item: any, index: number) => {
          const JobCode = item?.jobCode?.split('-')[0];
          let createdon = item?.createdOn ? new Date(item.createdOn) : null
          return {
            SNO: index + 1,
            CandidateID: item?.jobRequestId,
            ApplicantName: item?.applicantName,
            PositionTitle: item?.jobTitle?.displayText,
            JobCode: JobCode,
            Status: item?.workflowStatus?.displayText,
            workflowStatusId: item?.workflowStatusId,
            createdOn: moment(createdon).format("DD/MM/YYYY HH:mm:ss"),
            TotalItems: TotalItems,
            applicationStatusId: item?.applicationStatusId,
            applicationStatus: item?.applicationStatus?.displayText
          }
        })
      }
      ).catch((error) => {
        console.log(error, "error");
      })
      return {
        data: GetProfileByJobCodeData,
        status: 200,
        message: "Get Candidate details",
      };
    } catch (error) {
      console.error(
        "Error Get Candidate details:",
        error
      );
      return {
        data: [],
        status: 500,
        message: "Error Get Candidate details",
      };
    }
  }


  async getCandidateProfile(CandidateID: string, EmployeeList?: any[], RecrutimentData?: DataSyncToRecruitmentResponse): Promise<ApiResponse<CandidateProfile[] | null>> {
    try {
      let GetProfileByJobCodeData: CandidateProfile[] = [];
      await getProfileData.getCandidateProfile(CandidateID).then(async (res) => {
        const op = res.data.data;
        // console.log(op, "OP");
        const [
          RoleProfileDocment,
          AdvertismentDocment,
        ] = await Promise.all([
          CommonServices.GetAttachmentToLibrary(DocumentLibraray.RoleProfileMaster, op.jobCode, RoleProfileMaster.RoleProfile),
          CommonServices.GetAttachmentToLibrary(DocumentLibraray.RecruitmentAdvertisementDocument, op.jobCode),
          CommonServices.GetAttachmentToLibrary(DocumentLibraray.InterviewPanelCandidateCV, op.jobCode, op?.jobRequestId),
        ]);

        const RoleProfileDoc = RoleProfileDocment.data || [];
        const AdvertismentDocPromises = AdvertismentDocment.data || [];
        const EmployeeHR = EmployeeList?.find((options: any) => {
          return options.Email?.toLowerCase() === RecrutimentData?.AssignEMail;
        });

        const EmployeeLM = EmployeeList?.find((options: any) => {
          return options.Email?.toLowerCase() === RecrutimentData?.AssignLineManager;
        });

        let CommentsData: CommentsData[] = op?.profileJobsComments.map((item: any, index: number) => {
          let updatedData: CommentsData;

          if (item?.createdBy === RoleName.RecruitmentHR || item?.createdBy === "Recrutiment HR") {
            updatedData = {
              Id: index + 1,
              JobTitleInEnglish: EmployeeHR?.JobTitle ?? "",
              JobTitleInFrench: EmployeeHR?.JobTitleInFrench ?? "",
              comments: item?.comments || "",
              Department: EmployeeHR?.Department ?? "",
              Date: item.createdOn ? new Date(item.createdOn) : null,
              JobTitle: EmployeeHR?.JobTitle ?? "",
              RoleName: RoleName.RecruitmentHR,
              Name: `${EmployeeHR?.FirstName ?? ""} ${EmployeeHR?.MiddleName ?? ""} ${EmployeeHR?.LastName ?? ""}`.trim()
            };
          } else if (item?.createdBy === RoleName.LineManager || item?.createdBy === "Line Manager") {
            updatedData = {
              Id: index + 1,
              JobTitleInEnglish: EmployeeLM?.JobTitle ?? "",
              JobTitleInFrench: EmployeeLM?.JobTitleInFrench ?? "",
              comments: item?.comments || "",
              Department: EmployeeLM?.Department ?? "",
              Date: item.createdOn ? new Date(item.createdOn) : null,
              JobTitle: EmployeeLM?.JobTitle ?? "",
              RoleName: RoleName.LineManager,
              Name: `${EmployeeLM?.FirstName ?? ""} ${EmployeeLM?.MiddleName ?? ""} ${EmployeeLM?.LastName ?? ""}`.trim()
            };
          } else {
            // Provide a fallback to ensure `updatedData` is always assigned
            updatedData = {
              Id: index + 1,
              JobTitleInEnglish: "",
              JobTitleInFrench: "",
              comments: item?.comments || "",
              Department: "",
              Date: item.createdOn ? new Date(item.createdOn) : null,
              JobTitle: "",
              RoleName: item?.createdBy ?? "Unknown",
              Name: "",
            };
          }

          return updatedData;
        }) || [];



        let CandidateCV = await CommonServices.GetDocumentinUrl(
          op?.document?.filePath
        );
        let BusinessLinkPath = op?.profile?.profileDetailAttachments.filter(
          (item: any) => item.attachmentTypeCoe === "PA01"
        );
        let BusinessDocument = await CommonServices.GetDocumentinUrl(
          BusinessLinkPath[0]?.document?.filePath
        );
        let FamilyLinkPath = op?.profile?.profileDetailAttachments.filter(
          (item: any) => item.attachmentTypeCoe === "PA02"
        );
        let FamilyDocument = await CommonServices.GetDocumentinUrl(
          FamilyLinkPath[0]?.document?.filePath
        );

        const ProofIdentity = await GetPortalJobsService.GetAllMaster(
          CategoryID.ProofofIdentity
        );

        let profileExperiance = Array.isArray(op?.profile?.profileDetailExperiences) && op.profile.profileDetailExperiences.length > 0
          ? op.profile.profileDetailExperiences[op.profile.profileDetailExperiences.length - 1]
          : undefined;
        // console.log(profileExperiance, "profileExperiance");

        const dob = new Date(new Date(op?.profile?.dob));
        const today = new Date();

        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        const dayDiff = today.getDate() - dob.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          age--;
        }
        let getOptAnswers = op?.profile?.profileXOptAnswers.filter((item: { question: { scopeId: string; }; }) => item.question?.scopeId === "S7").sort((a: any, b: any) => {
          const textA = typeof a.text === "string" ? a.text : "";
          const textB = typeof b.text === "string" ? b.text : "";
          return textA.localeCompare(textB);
        });
        // console.log(getOptAnswers, "getOptAnswers");
        let AgenName = op?.profile?.profileXAgent?.agentCode === agentCode.RecruitmentHR ? RoleName.RecruitmentHR : op?.profile?.profileXAgent?.agent?.name;
        let IdentityID = ProofIdentity.data?.filter((item) => item?.value === op?.profile?.identityTypeId)
        let familyDetails = op?.profile?.familyDetails?.map((item: any) => {
          return {
            "name": item?.name,
            // "age": item?.age,
            // "genderId": item?.genderId,
            "relationshipDetail": item?.relationshipDetail?.displayText,
            "contactNumber": item?.contactNumber,
          }
        });
        let emergencyContacts = op?.profile?.emergencyContacts?.map((item: any) => {
          return {
            "name": item?.contactName,
            // "age": item?.age,
            // "genderId": item?.genderId,
            "relationshipDetail": item?.relationshipDetail?.displayText,
            "contactNumber": item?.contactNumber,
          }
        });
        let employeeReferenceDetail = {
          "empId": op?.profile?.employeeReferenceDetails?.empId,
          "empName": op?.profile?.employeeReferenceDetails?.empName,
          "empEmail": op?.profile?.employeeReferenceDetails?.empEmail,
          "company": op?.profile?.employeeReferenceDetails?.company,
        };
        let companyDetails = {
          "operation": op?.profile?.profileDetailEmploymentHistory?.workedOperation,
          "role": op?.profile?.profileDetailEmploymentHistory?.workRole,
          "region": op?.profile?.profileDetailEmploymentHistory?.territory,
        }
        console.log(getOptAnswers, "getOptAnswers");

        let willingRelocated = getOptAnswers.filter((item: any) => item.question?.quesContentId === quesContentId.WillingRelocate)
        const JobCode = op?.jobCode?.split('-')[0];
        let GetProfileDahboard: CandidateProfile = {
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
          ContactNumber: op?.profile?.contactNumber1,
          Email: op?.profile?.email,
          Nationality: op?.profile?.nationality?.displayText,
          Gender: op?.profile?.gender?.displayText ? op?.profile?.gender?.displayText : op?.profile?.genderId,
          HighestQualification: op?.profile?.education?.displayText,
          ExperienceMining: op?.profile?.totalYearOfExperiance,
          ExperRelatedfield: op?.profile?.releventExperience,
          Status: op?.workflowStatus?.displayText,
          StatusId: op?.workflowStatusId,
          Agencies: AgenName,
          CandidateResume: CandidateCV.data,
          RoleProfile: RoleProfileDoc,
          Advertisement: AdvertismentDocPromises,
          Comments: CommentsData,
          workflowStatusId: op?.workflowStatusId,
          hrComments: op?.hrComments,
          JobVaildFromDate: op?.jobDetail?.validFrom,
          JobVaildToDate: op?.jobDetail?.validTo,
          CandidateResumeLink: op?.document?.filePath,
          ConflictsOfInterest: op?.profile?.profileXOptAnswers[0]?.answerContent?.contentEn,
          disability: op?.profile?.profileDetailDisclosure?.hasDisability === 1 ? "Yes" : "No",
          disabilityReason: op?.profile?.profileDetailDisclosure?.disabilityDetails,
          identityValue: op?.profile?.identityValue,
          identityType: (IdentityID && IdentityID.length > 0) ? IdentityID[0].displayText : "Passport",

          NumberOftax: "3",//getOptAnswers[0]?.answerContent?.contentEn,
          CurrentEmployer: profileExperiance?.company,
          CurrentPosition: profileExperiance?.title,
          WillingToRelocate: willingRelocated[0]?.answerContent?.contentEn,
          previouslyworkedMine: op?.profile?.profileDetailEmploymentHistory?.hasIvanhoeZijinExperienceId === "3" ? "No" : op?.profile?.profileDetailEmploymentHistory === null ? "No" : "Yes",
          familylinks: op?.profile?.hasEmployeeRelation === "1" ? "Yes" : "No",
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

          countryOfResidency: op?.profile?.countryOfResidency ?? "",
          residentStatus: op?.profile?.residentStatus === "Y" ? "Yes" : op?.profile?.residentStatus === "N" ? "No" : "",
          maritalStatus: op?.profile?.maritalStatusDetail?.displayText ?? "",
          childrenDetails: op?.profile?.nationalityId === "N0" ? familyDetails : emergencyContacts,
          employeeReferenceDetails: employeeReferenceDetail,
          maritalStatusId: op?.profile?.maritalStatus ?? "",
          joiningDate: op?.startDate ?? "",
          noticePeriod: op?.noticePeriodDays ?? "",
          hasIvanhoeZijinExperience: op?.profile?.profileDetailEmploymentHistory?.hasIvanhoeZijinExperienceId === "3" ? "No" : op?.profile?.profileDetailEmploymentHistory?.hasIvanhoeZijinExperience?.displayText ?? "",
          companyDetails: companyDetails,
          businesslinkscompany: op?.profile?.businessLinkCompany === "CD03" ? op?.profile?.whichCompany : op?.profile?.businessLinkCompanyDetail?.displayText
        };

        GetProfileByJobCodeData.push(GetProfileDahboard);
      }).catch((error) => {
        console.log(error, "error");
      });

      return {
        data: GetProfileByJobCodeData,
        status: 200,
        message: "Success",
      };
    } catch (error) {
      console.error("Error inserting data into HRMSRecruitmentDptDetails:", error);
      return {
        data: [],
        status: 500,
        message: "Error inserting data into HRMSRecruitmentDptDetails",
      };
    }
  }


  async UpdateCandidateStatus(data: WorkflowJson): Promise<ApiResponse<any | null>> {
    try {

      const Response = await getProfileData.UpdateCandidateStatus(data);
      return {
        data: Response.data,
        status: Response.status,
        message: Response.data.message,
      };

    } catch (error) {
      console.error(
        "Error inserting data into AdvertisementDetails:",
        error
      );
      return {
        data: [],
        status: 500,
        message: "Error inserting data into AdvertisementDetails",
      };
    }
  }

  async InsertCandidateDetailsInList(
    CandidateDetails: CandidateDetails,
    InterviewPanel: any
  ): Promise<ApiResponse<any | null>> {
    try {
      let response: any = await SPServices.SPAddItem({
        Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        RequestJSON: CandidateDetails,
      });

      if (response?.data?.ID) {
        const jobDetailsResponse = await this.InsertInterviewPanel(
          InterviewPanel,
          parseInt(response?.data?.ID)
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
        error
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
    CandidateId: number
  ): Promise<ApiResponse<any | null>> {
    try {
      let insertedRecords: any[] = [];

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

  async UpsertMaster(data: UpsertMasters[]): Promise<ApiResponse<any | null>> {
    try {
      let MasterDetails: UpsertMasters[] = data.map((item) => ({
        displayText: item.displayText,
        displayText_fr: item.displayText_fr,
        category: item.category,
      }));

      const response = await postAdveDetails.PostMaster(MasterDetails);
      return {
        data: response.data,
        status: response.status,
        message: response.data.message,
      };
    } catch (error) {
      console.error(
        "Error inserting data into AdvertisementDetails:",
        error
      );
      return {
        data: [],
        status: 500,
        message: "Error inserting data into AdvertisementDetails",
      };
    }
  }

  async UpsertQuestions(data: UpsertQuestions[]): Promise<ApiResponse<any | null>> {
    try {
      let UpsertQuestions: UpsertQuestions[] = data.map((item) => ({
        questionEn: item.questionEn,
        questionFr: item.questionFr,
        scopeId: item.scopeId,
        categoryId: item.categoryId,
        questionTypeId: item.questionTypeId,
        isQualifier: item.isQualifier,
        isAnswerValidate: item.isAnswerValidate,
        sequence: item.sequence,
        jobCode: item.jobCode,
        options: item.options,
        answers: item.answers,
      }));

      const response = await QuestionnaireApi.PostQuestionnaire(UpsertQuestions);
      return {
        data: response.data,
        status: response.status,
        message: response.data.message,
      };
    } catch (error) {
      console.error(
        "Error inserting data into AdvertisementDetails:",
        error
      );
      return {
        data: [],
        status: 500,
        message: "Error inserting data into AdvertisementDetails",
      };
    }
  }

  async GetAllMaster(id: number): Promise<ApiResponse<GetAllMaster[] | null>> {
    try {
      const response = await postAdveDetails.getMastersByCategory(id);
      const GetAllMasterData: GetAllMaster[] = response.data.data.map((item: any) => ({
        id: item.id,
        value: item.value,
        displayText: item.displayText,
        displayTextFr: item.displayText_fr,
      }));

      // console.log(GetAllMasterData, "GetAllMasterData");

      return {
        data: GetAllMasterData,
        status: response.status,
        message: "Get Candidate details",
      };

    } catch (error) {
      console.error(
        "Error Get Candidate details:",
        error
      );
      return {
        data: [],
        status: 500,
        message: "Error Get Candidate details",
      };
    }
  }

  async getQuestionnaire(jobCode: string): Promise<ApiResponse<QuestionItem[] | null>> {
    try {
      const response = await QuestionnaireApi.GetQuestionnaire(jobCode);
      const GetQuestionnaire: QuestionItem[] = response.data.data.map((item: any, index: number) => {
        const incrementedIndex = index + 1;
        return {
          id: incrementedIndex,
          question: item?.question?.quesContent?.contentEn,
          answer: item?.question?.questionXAnswers?.[0]?.optContent?.contentEn ?? "",
          rating: 0,
          header: "Q" + incrementedIndex,
        };
      });
      // console.log(response, "GetAllMasterData");
      return {
        data: GetQuestionnaire,
        status: response.status,
        message: "Get Candidate details",
      };
    } catch (error) {
      console.error(
        "Error Get Candidate details:",
        error
      );
      return {
        data: [],
        status: 500,
        message: "Error Get Candidate details",
      };
    }
  }

  async RescheduledInterview(
    obj: RescheduledCandidate,
    ListName: string
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

  async GetQuestionaireByScope(GetExistingQuestion: getQuestionById): Promise<ApiResponse<ViewQuestion[] | null>> {
    try {
      const response = await QuestionnaireApi.GetQuestionaireByScope(GetExistingQuestion);
      const GetQuestionnaire: ViewQuestion[] = response.data.data.map((item: any, index: number) => {
        const incrementedIndex = index + 1;

        const question = item?.question?.quesContent?.contentEn;
        const expectedAnswer = item?.question?.questionXAnswers.map((item: any) => item?.optContent?.contentEn);

        if (!question || !expectedAnswer) {
          return null;
        }

        let options = item?.question?.questionXOptions.map((item: any) => {
          return {
            key: item?.questionId,
            text: item?.optContent?.contentEn,
            isCorrect: false,
          };
        });

        let CareerportalAnswer = item?.question?.questionXAnswers?.map((item: any, index: number) => {
          return {
            key: index,
            text: item?.optContent?.contentEn,
            isCorrect: false,
          };
        });

        return {
          id: incrementedIndex,
          Checked: false,
          header: "Q" + incrementedIndex,
          HeaderLabel: "Question" + incrementedIndex,
          discipline: item?.question?.scopeId,
          questionType: item?.question?.questionTypeId,
          question: question,
          expectedAnswer: expectedAnswer,
          CareerportalAnswer: CareerportalAnswer,
          options: options,
          Disqualification: item?.question?.isQualifier,
          Type: DataType.Existing,
        };
      }).filter((item: null) => item !== null);


      // console.log(response, "GetAllMasterData");
      return {
        data: GetQuestionnaire,
        status: response.status,
        message: "Get Candidate details",
      };
    } catch (error) {
      console.error(
        "Error Get Candidate details:",
        error
      );
      return {
        data: [],
        status: 500,
        message: "Error Get Candidate details",
      };
    }
  }

  async GetCountryMaster(): Promise<ApiResponse<GetMasterByCountry[] | null>> {
    try {
      const response = await GetStateByCountryApi.GetCountryApi();
      const GetAllMasterData: GetMasterByCountry[] = response.data?.data?.map((item: any) => ({
        id: item.isdcode,
        code: item.countryCode,
        text: item.countryName,
      }));

      // console.log(GetAllMasterData, "GetCountryMaster");

      return {
        data: GetAllMasterData,
        status: response.status,
        message: "Get Candidate details",
      };

    } catch (error) {
      console.error(
        "Error Get Candidate details:",
        error
      );
      return {
        data: [],
        status: 500,
        message: "Error Get Candidate details",
      };
    }
  }

  async GetStateByCountry(code: string): Promise<ApiResponse<GetMasterByCountry[] | null>> {
    try {
      const response = await GetStateByCountryApi.GetStatebyCountry(code);
      const GetAllMasterData: GetMasterByCountry[] = response.data?.data?.map((item: any) => ({
        id: item.stateId,
        code: item.stateId,
        text: item.state,
      }));

      // console.log(GetAllMasterData, "GetCountryMaster");
      return {
        data: GetAllMasterData,
        status: response.status,
        message: "Get Candidate details",
      };

    } catch (error) {
      console.error(
        "Error Get Candidate details:",
        error
      );
      return {
        data: [],
        status: 500,
        message: "Error Get Candidate details",
      };
    }
  }

  async GetCitiesByState(code: string): Promise<ApiResponse<GetMasterByCountry[] | null>> {
    try {
      const response = await GetStateByCountryApi.GetCitiesbyState(code);
      const GetAllMasterData: GetMasterByCountry[] = response.data?.data?.map((item: any) => ({
        id: item.stateId,
        code: item.cityId,
        text: item.city,
      }));

      // console.log(GetAllMasterData, "GetCountryMaster");

      return {
        data: GetAllMasterData,
        status: response.status,
        message: "Get Candidate details",
      };

    } catch (error) {
      console.error(
        "Error Get Candidate details:",
        error
      );
      return {
        data: [],
        status: 500,
        message: "Error Get Candidate details",
      };
    }
  }

  async UpsertProfile(data: UpsertProfile, Document: UpsertDocument, jobCode: string): Promise<ApiResponse<any | null>> {
    try {
      let response: any
      let UpsertProfile: UpsertProfile[] = [{
        contactNumber1: data.contactNumber1,
        contactNumber2: data.contactNumber1,
        dob: data.dob,
        documentId: data.documentId,
        educationId: data.educationId,
        email: data.email,
        firstName: data.firstName,
        genderId: data.genderId,
        identityTypeId: data.identityTypeId,
        identityValue: data.identityValue,
        jobsApplied: [],
        lastName: data.lastName,
        middleName: data.middleName,
        nationalityId: data.nationalityId,
        profileAddress: data.profileAddress,
        profileDetailDisciplines: [],
        profileDetailDisclosure: null,
        profileDetailEducations: [],
        profileDetailEmploymentHistory: data.profileDetailEmploymentHistory,
        profileDetailExperiences: [],
        profileDetailLanguages: [],
        profileDetailSkills: [],
        profileId: data.profileId,
        profileXAgent: null,
        profileXOptAnswers: data.profileXOptAnswers,
        profileXTxtAnswers: [],
        releventExperience: data.releventExperience,
        title: data.title,
        totalYearOfExperiance: data.totalYearOfExperiance,
        hasBusinessLinks: String(data.hasBusinessLinks),
        hasEmployeeRelation: String(data.hasEmployeeRelation),
        profileDetailAttachments: []
      }]
      const UpsertData = await UploadCandidateCVData.UpsertProfile(UpsertProfile);
      if (UpsertData.status === ResponeStatus.SUCCESS) {

        let CandidateCV = await GetPortalJobsService.UpsertDocumentUpload({
          DocumentTypeEnum: "0",
          DocumentTypeName: "CV",
          JobCode: jobCode,
          File: Document.CandidateCV[0].content,
          FileName: Document.CandidateCV[0]?.name,
          ProfileId: UpsertData.data.data[0].profileId.toString()
        });
        let FamilyLink: any
        if (Document.familyLink.length > 0) {
          FamilyLink = await GetPortalJobsService.UpsertDocumentUpload({
            DocumentTypeEnum: "0",
            DocumentTypeName: "Employee Relation",
            JobCode: jobCode,
            File: Document.familyLink[0].content,
            FileName: Document.familyLink[0]?.name,
            ProfileId: UpsertData.data.data[0].profileId.toString()
          });
        } else {
          FamilyLink = { status: ResponeStatus.SUCCESS };
        }
        let BusinessLink: any;
        if (Document.businessLink.length > 0) {
          BusinessLink = await GetPortalJobsService.UpsertDocumentUpload({
            DocumentTypeEnum: "0",
            DocumentTypeName: "Business Link",
            JobCode: jobCode,
            File: Document.businessLink[0].content,
            FileName: Document.businessLink[0]?.name,
            ProfileId: UpsertData.data.data[0].profileId.toString()
          });
        } else {
          BusinessLink = { status: ResponeStatus.SUCCESS };
        }

        if (CandidateCV.status === ResponeStatus.SUCCESS && FamilyLink.status === ResponeStatus.SUCCESS && BusinessLink.status === ResponeStatus.SUCCESS) {
          let JobAppiledData: jobsApplied[] = [{
            applicationStatusId: "AS02",
            jobRequestId: 0,
            jobCode: jobCode,
            workflowStatusId: workflowStatusApi.LineManagerL1Pending,
            isSuspended: 0,
            documentId: CandidateCV.data.data.documentId
          }]
          let profileCurrentPosition = data.profileDetailExperiences.map((item) => {
            return ({
              ...item,
              profileId: UpsertData.data.data[0].profileId,
              title: item.title,
              roleDescription: item.roleDescription,
              company: item.company,
              location: item.location,
              startFrom: item.startFrom,
              endTo: item.endTo,
            })
          })
          let profileAttachment: profileDetailAttachments[] = []
          if (Document.businessLink.length > 0) {
            profileAttachment = [
              {
                AttachmentTypeCoe: "PA01",
                DocumentId: BusinessLink.data.data.documentId,
                ProfileId: UpsertData.data.data[0].profileId
              },
            ]
          }

          if (Document.familyLink.length > 0) {
            profileAttachment.push(
              {
                AttachmentTypeCoe: "PA02",
                DocumentId: FamilyLink.data.data.documentId,
                ProfileId: UpsertData.data.data[0].profileId
              }
            )
          }

          UpsertProfile[0].profileId = UpsertData.data.data[0].profileId
          UpsertProfile[0].documentId = CandidateCV.data.data.documentId
          UpsertProfile[0].jobsApplied = JobAppiledData
          UpsertProfile[0].profileDetailExperiences = profileCurrentPosition
          UpsertProfile[0].profileDetailAttachments = profileAttachment ?? []
          response = await UploadCandidateCVData.UpsertProfile(UpsertProfile);
        }
      }
      return {
        data: response.data,
        status: response.status,
        message: response.data.message,
      };
    } catch (error) {
      console.error(
        "Error inserting data into AdvertisementDetails:",
        error
      );
      return {
        data: [],
        status: 500,
        message: "Error inserting data into AdvertisementDetails",
      };
    }
  }

  async UpsertDocumentUpload(DocumentDetails: DocumentValue): Promise<ApiResponse<any | null>> {
    try {
      const formData = new FormData();
      formData.append("DocumentTypeEnum", DocumentDetails.DocumentTypeEnum);
      formData.append("DocumentTypeName", DocumentDetails.DocumentTypeName);
      formData.append("JobCode", DocumentDetails.JobCode);
      formData.append("File", DocumentDetails.File);
      formData.append("FileName", DocumentDetails.FileName);
      formData.append("ProfileId", DocumentDetails.ProfileId);
      const response = await UploadCandidateCVData.UploadDocument(formData);
      // console.log(response, "UploadDocument");

      return {
        data: response.data,
        status: response.status,
        message: response.data.message,
      };
    } catch (error) {
      console.error(
        "Error inserting data into AdvertisementDetails:",
        error
      );
      return {
        data: [],
        status: 500,
        message: "Error inserting data into AdvertisementDetails",
      };
    }
  }

  async CheckMyCandidateAppliedJobs(data: CheckMyCandidate): Promise<ApiResponse<any | null>> {
    try {
      let CheckCandidate: CheckMyCandidate = {
        Email: data?.Email,
        JobCode: data?.JobCode
      }
      const response = await UploadCandidateCVData.CheckMyCandidateAppliedJobs(CheckCandidate);

      return {
        data: response.data,
        status: response.status,
        message: response.data.message,
      };
    } catch (error) {
      console.error(
        "Error inserting data into AdvertisementDetails:",
        error
      );
      return {
        data: [],
        status: 500,
        message: "Error inserting data into AdvertisementDetails",
      };
    }
  }

  async GetCandiateForJobs(JobCode: string, FilterValue: GetProfileByFilter): Promise<ApiResponse<GetProfileByJobCode[] | null>> {
    try {
      let GetProfileByJobCodeData: GetProfileByJobCode[] = []
      await UploadCandidateCVData.GetCandiateForJobs(JobCode, FilterValue).then((res) => {
        let TotalItems = res?.data?.pagination?.totalItems;
        GetProfileByJobCodeData = res.data.data.map((item: any, index: number) => {
          let createdon = item?.createdOn ? new Date(item.createdOn) : new Date(item?.appliedDate)
          return {
            SNO: index + 1,
            CandidateID: item?.jobRequestId,
            ApplicantName: item?.applicantName,
            PositionTitle: item?.jobTitle?.displayText,
            JobCode: item?.jobCode,
            Status: item?.workflowStatus?.displayText,
            workflowStatusId: item?.workflowStatusId,
            createdOn: moment(createdon).format("DD/MM/YYYY HH:mm:ss"),
            TotalItems: TotalItems,
          }
        })
      }
      ).catch((error) => {
        console.log(error, "error");
      })
      return {
        data: GetProfileByJobCodeData,
        status: 200,
        message: "Get Candidate details",
      };
    } catch (error) {
      console.error(
        "Error Get Candidate details:",
        error
      );
      return {
        data: [],
        status: 500,
        message: "Error Get Candidate details",
      };
    }
  }

  async GetJobRequestData(data: any[]): Promise<ApiResponse<any | null>> {
    try {

      const Response = await GetJobRequestData.GetJobRequestStatus(data);
      return {
        data: Response.data,
        status: Response.status,
        message: Response.data.message,
      };

    } catch (error) {
      console.error(
        "Error inserting data into AdvertisementDetails:",
        error
      );
      return {
        data: [],
        status: 500,
        message: "Error inserting data into AdvertisementDetails",
      };
    }
  }

  async GetQuestionByJobCode(jobCode: string): Promise<ApiResponse<CommanQuestion[] | null>> {
    try {
      const response = await UploadCandidateCVData.GetQuestionByJobCode(jobCode);
      let getQueAnswers = response.data.data.jobCommonQuestions.filter((item: any) => item?.scopeId === "S7").sort((a: any, b: any) => {
        const textA = typeof a.text === "string" ? a.text : "";
        const textB = typeof b.text === "string" ? b.text : "";
        return textA.localeCompare(textB);
      });
      const GetQuestionnaire: CommanQuestion[] = getQueAnswers.map((item: any, index: number) => {
        const incrementedIndex = index + 1;
        let OptionContent = item.questionXOptions.map((items: any) => {
          return {
            optContentId: items.optContentId,
            optContent: items?.optContent?.contentEn
          }
        });
        const htmlString = item.quesContent?.contentEn || '';
        const tempElement = document.createElement('div');
        tempElement.innerHTML = htmlString;
        const plainText = tempElement.innerText
          .replace(/\s*\*$/, "")
          .trim();
        return {
          id: incrementedIndex,
          question: plainText,
          questionId: item?.questionId,
          questionXOptions: OptionContent,
          answerContentId: ""
        };
      });
      return {
        data: GetQuestionnaire,
        status: response.status,
        message: "Get Candidate details",
      };
    } catch (error) {
      console.error(
        "Error Get Candidate details:",
        error
      );
      return {
        data: [],
        status: 500,
        message: "Error Get Candidate details",
      };
    }
  }

  UploadCOIAttachment = async (
    DocumentName: COIAttach,
    AttachFile: IDocFiles[],
  ): Promise<ApiResponse<any>> => {
    try {
      let response;
      if (AttachFile.length > 0) {
        response = await SPServices.addDocLibFiles({
          FilePath: DocumentLibraray.HRMSCareerPortalCandidateCV,
          FolderNames: [`${DocumentName.RequestID.toString()}`, `${DocumentName.DocumentName.toString()}`],
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
        message: `Error during file replacement: ${error.message}`,
      };
    }
  };

  fetchCOIAttachment = async (
    DocumentName: COIAttach,
  ): Promise<ApiResponse<any>> => {
    try {
      let response;
      response = (await SPServices.getDocLibFiles({
        FilePath: `${DocumentLibraray.HRMSCareerPortalCandidateCV}/${DocumentName.RequestID}/${DocumentName.DocumentName}`,
      })) as IDocFiles[];

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
        message: `Error during file replacement: ${error.message}`,
      };
    }
  };

  async GetUpsertCOI(data: COIType): Promise<ApiResponse<any | null>> {
    try {

      const Response = await GetJobRequestData.UpsertCOI(data);
      return {
        data: Response.data,
        status: Response.status,
        message: Response.data.message,
      };

    } catch (error) {
      console.error(
        "Error inserting data into AdvertisementDetails:",
        error
      );
      return {
        data: [],
        status: 500,
        message: "Error inserting data into AdvertisementDetails",
      };
    }
  }

}
