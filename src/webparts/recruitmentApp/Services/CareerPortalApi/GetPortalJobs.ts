import * as moment from "moment";
import { AdvertisementDetails, CandidateProfile, FilterItem, GetAllMaster, GetProfileByJobCode, getQuestionById, profileJobsComments, profileXagent, UpsertMasters, UpsertQuestions, WorkflowJson } from "../../Models/ApIInterface";
import { QuestionItem } from "../../Models/RecuritmentVRR";
import { DataType, DocumentLibraray, ListNames, RoleProfileMaster } from "../../utilities/Config";
import { getProfileData, postAdveDetails, QuestionnaireApi } from "../ReviewProfileService/ReviewCandidateService";
import { CommonServices } from "../ServiceExport";
import { IDocFiles } from "../SPService/ISPServicesProps";
import SPServices from "../SPService/SPServices";
import { CandidateDetails, IGetPortalJobs, RescheduledCandidate } from "./IGetPortalJobs";
import { ViewQuestion } from "../../Screens/ScreenComponent/ViewQuestionCheckbox";

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
        IsActive: data?.IsActive
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
        GetProfileByJobCodeData = res.data.data.map((item: any) => {
          let createdon = item?.createdOn ? new Date(item.createdOn) : null
          return {
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

  async getCandidateProfile(CandidateID: string): Promise<ApiResponse<CandidateProfile[] | null>> {
    try {
      let GetProfileByJobCodeData: CandidateProfile[] = [];
      await getProfileData.getCandidateProfile(CandidateID).then(async (res) => {
        const op = res.data.data;
        console.log(op, "OP");
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

        let CommentsData: profileJobsComments[] = op?.profileJobsComments.map((item: any) => {
          return {
            comments: item?.comments,
            RoleName: item?.createdBy,
            createdDate: item.createdOn,
            jobRequestId: item?.jobRequestId
          };
        }) || [];

        let url = op?.document?.filePath || "";

        // Initialize filteredFiles as an empty array
        let filteredFiles: IDocFiles[] = [];

        if (url) {
          const extractedPath = url.split("/root:/")[1]?.split(":/content")[0] || "";

          if (extractedPath) {
            const folderPath = extractedPath.substring(0, extractedPath.lastIndexOf("/")) || "";

            try {
              let FileData = (await SPServices.getDocLibFiles({
                FilePath: `${DocumentLibraray.HRMSCareerPortalCandidateCV}/${folderPath}`,
              })) as IDocFiles[];

              if (FileData && FileData.length > 0) {
                const fileName = extractedPath.split("/").pop();
                filteredFiles = FileData.filter((file) => file.name === fileName);
              } else {
                console.warn("Warning: No files found in the directory");
              }
            } catch (error) {
              console.error("Error fetching document library files:", error);
            }
          }
        }

        let GetProfileDahboard: CandidateProfile = {
          CandidateID: op?.jobRequestId,
          profileID: op?.profileId,
          JobCode: op?.jobCode,
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
          Agencies: op?.profile?.profileXAgent?.agent?.name,
          CandidateResume: filteredFiles,
          RoleProfile: RoleProfileDoc,
          Advertisement: AdvertismentDocPromises,
          Comments: CommentsData,
          workflowStatusId: op?.workflowStatusId,
          hrComments: op?.hrComments,
          JobVaildFromDate: op?.jobDetail?.validFrom,
          JobVaildToDate: op?.jobDetail?.validTo,
          CandidateResumeLink: op?.document?.filePath
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

      console.log(GetAllMasterData, "GetAllMasterData");

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
      console.log(response, "GetAllMasterData");
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
        const expectedAnswer = item?.question?.questionXAnswers?.[0]?.optContent?.contentEn ?? "";

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


      console.log(response, "GetAllMasterData");
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
}
