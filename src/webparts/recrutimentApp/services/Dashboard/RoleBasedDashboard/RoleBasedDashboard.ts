import moment from "moment";
import { 
  IHRLeadDashboard, 
  IDueMonth, 
  IPositionStatus, 
  IPositionSource, 
  IPositionDetails, 
  IHRDashboardData, 
  IHRTask, 
  IHODDashbaord, 
  ISeniorHRSummary
} from "../../../components/Screens/Dashboard/Types";
import { ApiResponse } from "../../../models/apimodels";
import { StatusId } from "../../../utilities/Config";
import { IRoleBasedDashboard } from "./IRoleBasedDashboard";
import { 
  BuildHRSummary, 
  BuildJobRoleSummary, 
  BuildMonthlyTracker, 
  BuildPositionStatus, 
  GetCandidateData, 
  GetRecruitmentData, 
  GetSelectedCandiadtesData, 
  HODBuildApprovals,
  LMBuildApprovals, 
  BuildTasks, 
  GetOpenRecruitmentData,
  BuildHRLeadSummary,
  BuildPositionSource,
  BuildPositionDetails,
  BuildDepartmentDetails,
  HODBuildSummary,
  HRBuildSummary,
  BuildCandidatePipeLine,
  SeniorHRBuildSummary,
  BuildHRLeadSource,
  BuildHRMonthlyTracker,
  conflictOfInterestAlerts,
  BuildSeniorHRMonthlyTracker,
  SeniorHRBuildTasks
} from "./CommanService";

export default class RoleBasedDashboardService implements IRoleBasedDashboard {


  async GetHRLeadDashboard(EmailId: string): Promise<ApiResponse<IHRLeadDashboard>> {
    try {
       const result = await GetOpenRecruitmentData(EmailId, "RecruitmentHRLead");

       if (!result || !result[1] || !result[1].length) {
        return {
          status: 200,
          message: "No recruitments found.",
          data: {} as IHRLeadDashboard
        };
      }

      const OpenRecruitment = result[0] || [];
      const recruitmentProcess = result[1] || [];
      const candidates = await GetCandidateData(recruitmentProcess);
      const candidateDetails = candidates || [];

      const summary = BuildHRLeadSummary(OpenRecruitment, recruitmentProcess);
      const PositionStatus = BuildPositionStatus(recruitmentProcess);

      const PositionSource = await BuildPositionSource(recruitmentProcess);

      const activeRecruitments = recruitmentProcess.filter(
        (item: any) => Number(item.StatusId) !== StatusId.Onboarded
      );

      const positionDetails = await BuildPositionDetails(activeRecruitments, candidateDetails);
      
      const departmentPositions = BuildDepartmentDetails(recruitmentProcess);
      const GridResult: IHRLeadDashboard = {
        HRLeadSummary: summary,
        PositionByStatus: PositionStatus,
        PositionSource,
        positionDetails,
        departmentPositions
      };

      return {
        data: GridResult,
        status: 200,
        message: "GetHRLeadDashboard fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching GetHRLeadDashboard:", error);
      return {
        data: {} as IHRLeadDashboard,
        status: 500,
        message: "Error fetching dashboard data",
      };
    }
  }

  async GetHRDashboardData(EmailId: string): Promise<ApiResponse<IHRDashboardData>> {
    try {
      const recruitments = await GetRecruitmentData(EmailId, "AssignedHR");

      if (!recruitments.length) {
        return {
          status: 200,
          message: "No recruitments found.",
          data: {} as IHRDashboardData
        };
      }

      const candidates = await GetCandidateData(recruitments);
      const selectedcandidates = await GetSelectedCandiadtesData(candidates);

      const summary = HRBuildSummary(recruitments, candidates);
      const monthlyTracker = BuildHRMonthlyTracker(recruitments);
      const departmentPositions = BuildDepartmentDetails(recruitments);
      const candidatePipeline = await BuildCandidatePipeLine(recruitments, candidates, selectedcandidates);
      const activeRecruitments = recruitments.filter(
        (item) => Number(item.StatusId) !== StatusId.Onboarded
      );
      const taskItems: IHRTask[] = BuildTasks(activeRecruitments, selectedcandidates);

      return {
        data: {
          summary: summary,
          monthlyTracker,
          departmentPositions,
          candidatePipeline,
          tasks: taskItems
        },
        status: 200,
        message: "HR Dashboard data retrieved and aggregated successfully"
      };
    } catch (error) {
      console.error("GetHRDashboardData Error:", error);
      return {
        data: {} as IHRDashboardData,
        status: 500,
        message: "Error retrieving HR Dashboard data"
      };
    }
  }

  async GetLMDashboardData(EmailId: string): Promise<ApiResponse<IHODDashbaord>> {
    try {
      const recruitments = await GetRecruitmentData(EmailId, "LineManager");

      if (!recruitments.length) {
        return {
          status: 200,
          message: "No recruitments found.",
          data: {} as IHODDashbaord
        };
      }

      const candidates = await GetCandidateData(recruitments);
      const selectedcandidates = await GetSelectedCandiadtesData(candidates);

      const summary = HODBuildSummary(recruitments, candidates);
      const monthlyTracker = BuildMonthlyTracker(recruitments);
      const positionsJobRole = BuildJobRoleSummary(recruitments, selectedcandidates);
      const hrSummary = await BuildHRSummary(recruitments);
      const positionStatus = BuildPositionStatus(recruitments);
      const approvals = await LMBuildApprovals(recruitments, candidates);
      const tasks = BuildTasks(recruitments, selectedcandidates);

      return {
        status: 200,
        message: "HOD Dashboard loaded successfully.",
        data: {
          summary,
          monthlyTracker,
          positionsJobRole,
          HRSummary: hrSummary,
          PositionStatus: positionStatus,
          MyApprovals: approvals,
          tasks
        }
      };
    } catch (error) {
      console.error("GetLMDashboardData error:", error);
      return {
        status: 500,
        message: "Unable to load HOD Dashboard.",
        data: {} as IHODDashbaord
      };
    }
  }


  async GetHODDashboardData(EmailId: string): Promise<ApiResponse<IHODDashbaord>> {
    try {
      const recruitments = await GetRecruitmentData(EmailId, "HOD");

      if (!recruitments.length) {
        return {
          status: 200,
          message: "No recruitments found.",
          data: {} as IHODDashbaord
        };
      }

      const candidates = await GetCandidateData(recruitments);
      const selectedcandidates = await GetSelectedCandiadtesData(candidates);

      const summary = HODBuildSummary(recruitments, candidates);
      const monthlyTracker = BuildMonthlyTracker(recruitments);
      const positionsJobRole = BuildJobRoleSummary(recruitments, selectedcandidates);
      const hrSummary = await BuildHRSummary(recruitments);
      const positionStatus = BuildPositionStatus(recruitments);
      const approvals = HODBuildApprovals(recruitments, candidates);
      const tasks = BuildTasks(recruitments, selectedcandidates);

      return {
        status: 200,
        message: "HOD Dashboard loaded successfully.",
        data: {
          summary,
          monthlyTracker,
          positionsJobRole,
          HRSummary: hrSummary,
          PositionStatus: positionStatus,
          MyApprovals: approvals,
          tasks
        }
      };
    } catch (error) {
      console.error("GetHODDashboardData error:", error);
      return {
        status: 500,
        message: "Unable to load HOD Dashboard.",
        data: {} as IHODDashbaord
      };
    }
  }

  async GetSeniorHRDashboardData(EmailId: string): Promise<ApiResponse<ISeniorHRSummary>> {
    try {
       const result = await GetOpenRecruitmentData(EmailId, "RecruitmentHRLead");

       if (!result || !result[1] || !result[1].length) {
        return {
          status: 200,
          message: "No recruitments found.",
          data: {} as ISeniorHRSummary
        };
      }

      const openRecruiment = result[1] || [];
      const recruitmentProcess = result[2] || [];
      const candidates = await GetCandidateData(recruitmentProcess);
      const selectedcandidates = await GetSelectedCandiadtesData(candidates);

      const summary = SeniorHRBuildSummary(openRecruiment, recruitmentProcess, candidates);
      const positionsOverview =  BuildSeniorHRMonthlyTracker(recruitmentProcess);
      const departmentDemand = BuildDepartmentDetails(recruitmentProcess);
      const hrLeadsPerformance = await BuildHRLeadSource(recruitmentProcess);
       const tasks = await SeniorHRBuildTasks(recruitmentProcess, selectedcandidates);


      const coiCandidates = candidates.filter((item: any) => item.ConflictsOfInterest === "Yes");
      
      const parsedConflictOfInterest = coiCandidates.map((item: any) => {
        const name = [item.FristName, item.LastName].filter(Boolean).join(" ");
        return {
          name: name || "Unknown",
          JobTitle: item.PositionTitle || "N/A",
          coiReason: item.COIReason || "tested",
          currentstatus: item.Status?.StatusDescription || "HR Pending"
        };
      });

      const coiAlerts = parsedConflictOfInterest.length > 0 ? parsedConflictOfInterest : [];

      return {
        data: {
          summary,
          monthlyTracker: positionsOverview,
          departmentPositions: departmentDemand,
          HrLeadPerformance: hrLeadsPerformance,
          conflictOfInterestAlerts: coiAlerts as any[],
          tasks
        },
        status: 200,
        message: "Senior HR Dashboard data fetched successfully"
      };
    } catch (error) {
      console.error("GetSeniorHRDashboardData Error:", error);
      return {
        data: {} as ISeniorHRSummary,
        status: 500,
        message: "Error retrieving Senior HR Dashboard data"
      };
    }
  }
}
