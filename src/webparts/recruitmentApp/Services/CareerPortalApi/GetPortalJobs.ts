import { AdvertisementDetails, CandidateProfile, GetProfileByFilter, GetProfileByJobCode, profileJobsComments, WorkflowJson } from "../../Models/ApIInterface";
import { DocumentLibraray, RoleProfileMaster } from "../../utilities/Config";
import { getProfileData, postAdveDetails } from "../ReviewProfileService/ReviewCandidateService";
import { CommonServices } from "../ServiceExport";
import { IGetPortalJobs } from "./IGetPortalJobs";

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
        MinAndPreferedQualifications: data?.MinAndPreferedQualifications
      }
      await postAdveDetails.postUpsertJobs(AdvertisementDetails).then((res) =>
        console.log(res, "res")
      ).catch((error) => {
        console.log(error, "error");
      })
      return {
        data: [],
        status: 200,
        message: "Failed to insert AdvertisementDetails",
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

  async getCandidateDetailsInJobCode(JobCode: string, FilterValue: GetProfileByFilter): Promise<ApiResponse<GetProfileByJobCode[] | null>> {
    try {
      let GetProfileByJobCodeData: GetProfileByJobCode[] = []
      await getProfileData.GetProfileByJobCode("JC0005", FilterValue).then((res) => {

        console.log(res, "res");
        debugger;
        GetProfileByJobCodeData = res.data.data.map((item: any) => {
          return {
            CandidateID: item.jobRequestId,
            ApplicantName: item.applicantName,
            PositionTitle: item.jobTitle?.displayText,
            JobGrade: item.jobCode,
            Status: item.workflowStatus?.displayText
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

  async getCandidateProfile(CandidateID: string,): Promise<ApiResponse<CandidateProfile[] | null>> {
    try {
      let GetProfileByJobCodeData: CandidateProfile[] = [];
      await getProfileData.getCandidateProfile(CandidateID).then(async (res) => {

        const op = res.data.data;
        console.log(res, "res");
        const [
          RoleProfileDocment,
          AdvertismentDocment,
          CandidateCVDoc
        ] = await Promise.all([
          CommonServices.GetAttachmentToLibrary(DocumentLibraray.RoleProfileMaster, op.JobCode, RoleProfileMaster.RoleProfile),
          CommonServices.GetAttachmentToLibrary(DocumentLibraray.RecruitmentAdvertisementDocument, op.JobCode),
          CommonServices.GetAttachmentToLibrary(DocumentLibraray.InterviewPanelCandidateCV, op.JobCode, op?.jobRequestId)
        ]);
        const RoleProfileDoc = RoleProfileDocment.data || [];
        const AdvertismentDocPromises = AdvertismentDocment.data || [];
        const CandidateCVDocPromises = CandidateCVDoc.data || [];
        let CommentsData: profileJobsComments[] = op?.profileJobsComments.map((item: any) => {
          return {
            comments: item?.comments,
            RoleName: item?.createdBy,
            createdDate: item.createdOn,
            jobRequestId: item?.jobRequestId
          }
        })

        let GetProfileDahboard: CandidateProfile = {
          CandidateID: op?.jobRequestId,
          JobCode: op?.jobCode,
          JobTitle: op?.jobDetail?.descriptions_en?.jobTitle,
          ApplicantName: `${op?.profile?.firstName || ""} ${op?.profile?.middleName || ""} ${op?.profile?.lastName || ""}`,
          ApplicantSurName: op?.profile?.lastName,
          Nationality: op?.profile?.nationality,
          Gender: op?.profile?.gender,
          HighestQualification: op?.profile?.education?.displayText,
          ExperienceMining: op?.profile?.totalYearOfExperiance,
          ExperRelatedfield: op?.profile?.releventExperience,
          Status: op?.workflowStatus?.displayText,
          Agencies: op?.profile?.profileXAgent?.agent?.name,
          CandidateResume: CandidateCVDocPromises,//op?.profileJobsDocuments[0]?.filePath,
          RoleProfile: RoleProfileDoc,
          Advertisement: AdvertismentDocPromises,
          Comments: CommentsData
        }
        GetProfileByJobCodeData.push(GetProfileDahboard)
      }
      ).catch((error) => {
        console.log(error, "error");
      })
      return {
        data: GetProfileByJobCodeData,
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

  async UpdateCandidateStatus(data: WorkflowJson): Promise<ApiResponse<any | null>> {
    try {
      let Response: any
      Response = await getProfileData.UpdateCandidateStatus(data);
      console.log(Response, "res");

      return {
        data: Response,
        status: 200,
        message: "Failed to insert AdvertisementDetails",
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
