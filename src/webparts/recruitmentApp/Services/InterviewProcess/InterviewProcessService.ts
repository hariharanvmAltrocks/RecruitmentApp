import { CandidateData } from "../../Models/RecuritmentVRR";
import { AutoCompleteItem, InterviewPanaldata } from "../../Models/Screens";
import { count, DocumentLibraray, ListNames } from "../../utilities/Config";
import { CommonServices } from "../ServiceExport";
import { IDocFiles } from "../SPService/ISPServicesProps";
import SPServices from "../SPService/SPServices";
import {
  ActionUpdate,
  AssignPositionID,
  CommentsDatas,
  IInterviewProcessService,
} from "./IInterviewProcessService";

export default class InterviewProcessService
  implements IInterviewProcessService
{
  async GetInterviewPanelDetails(
    filterConditions: any[] = []
  ): Promise<ApiResponse<InterviewPanaldata[]>> {
    let InterviewPanelDetails: InterviewPanaldata[] = [];

    try {
      let listItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSInterviewPanelDetails,
        Select:
          "ID, CandidateID/ID, RecruitmentID/ID, InterviewLevel, InterviewPanel/Id, InterviewPanel/Title, InterviewPanel/EMail,IsScoreSheetUploaded",
        Expand: "InterviewPanel,RecruitmentID,CandidateID",
        Filter: filterConditions,
      });
      const panelEmails = listItems
        .map((interview) => interview.InterviewPanel?.EMail)
        .filter((email) => email);

      let emailToAuthorMap: Record<string, string> = {};

      if (panelEmails.length > 0) {
        const sageListItems: any[] = await SPServices.SPReadItems({
          Listname: ListNames.HRMSSageList,
          Select: "EmailId, FirstName, LastName",
          FilterCondition: [
            {
              FilterKey: "EmailId",
              Operator: "in",
              FilterValue: panelEmails.join(","),
            },
          ],
        });

        emailToAuthorMap = sageListItems.reduce((acc, item) => {
          acc[item.EmailId] = `${item.FirstName}`;
          return acc;
        }, {} as Record<string, string>);
      }

      InterviewPanelDetails = listItems.map((objresult: any) => {
        const panelEmail = objresult.InterviewPanel?.EMail || "N/A";
        const authorName = emailToAuthorMap[panelEmail] || "Unknown";

        return {
          ID: objresult.ID,
          CandidateID: objresult.CandidateID?.ID || 0,
          RecruitmentID: objresult.RecruitmentID?.ID || 0,
          InterviewLevel: objresult.InterviewLevel || "N/A",
          InterviewPanel: objresult.InterviewPanel?.Id || 0,
          InterviewPanelTitle: authorName,
          InterviewPanalNames: objresult.InterviewPanel?.Title
            ? [objresult.InterviewPanel.Title]
            : [],
          IsScoreSheetUploaded: objresult.IsScoreSheetUploaded || "",
        };
      });
      return {
        data: InterviewPanelDetails,
        status: 200,
        message: "Interview Panel Details fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching interview panel details:", error);
      return {
        data: [],
        status: 400,
        message: "Error fetching data",
      };
    }
  }

  async GetCandidateDetailsInterviewPanalDashboard(
    filterConditions: any[] = []
  ) {
    try {
      const candidateItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        Select: "*,Status/ID,Status/StatusDescription,RecruitmentID/ID",
        Expand: "Status,RecruitmentID",
        Filter: filterConditions,
        Topcount: count.Topcount,
      });

      const CandidateDetails: CandidateData[] = candidateItems.map((item) => ({
        ID: item.ID,
        JobCode: item?.JobCode?.JobCode || "",
        JobCodeId: item?.JobCodeId || "",
        PassportID: item?.PassportID || "",
        FristName: item?.FristName || "",
        MiddleName: item?.MiddleName || "",
        LastName: item?.LastName || "",
        FullName: `${item?.FristName ?? ""} ${item?.MiddleName ?? ""} ${
          item?.LastName ?? ""
        }`.trim(),
        PositionTitle: item?.PositionTitle || "",
        JobGrade: item?.JobGrade || "",
        Status: item?.Status?.StatusDescription || "",
        StatusId: item?.StatusId || 0,
        ContactNumber: item?.ContactNumber || "",
        Email: item?.Email || "",
        ResidentialAddress: item?.ResidentialAddress || "",
        DOB: item?.DOB || "",
        Nationality: item?.Nationality || "",
        Gender: item?.Gender || "",
        TotalYearOfExperiance: item?.TotalYearOfExperiance || "",
        Skills: item?.Skills || "",
        LanguageKnown: item?.LanguageKnown || "",
        ReleventExperience: item?.ReleventExperience || "",
        Qualification: item?.Qualification || "",
        RecuritmentHR: item?.RecuritmentHR || "",
        AssignByInterviewPanel: item?.AssignByInterviewPanel?.EMail || "",
        CandidateCVDoc: [],
        RoleProfileDocument: [],
        AdvertisementDocument: [],
        ShortlistedValue: "",
        ExternalAgentDetails: item?.ExternalAgentDetails
          ? { AgentName: item?.ExternalAgentDetails?.AgentName }
          : null,
        RecruitmentID: item?.RecruitmentID?.ID || 0,
      }));

      return {
        data: CandidateDetails,
        status: 200,
        message:
          "Filtered Candidates with Interview Scheduled status fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching candidate details:", error);
      return {
        data: [],
        status: 500,
        message: "Error fetching candidate details",
      };
    }
  }

  // HRMSCandidateScoreCard(
   
  //   filterParam: any,
  //   filterConditions: any,
  //   candidateID: number
  // ): Promise<ApiResponse<any | null>> {
  //   let CommentsData: CommentsDatas[] = [];

  //   return SPServices.SPReadItems({
      
  //     Listname: ListNames.HRMSInterviewPanelDetails,
  //     Select:
  //       "ID,RecruitmentID/ID,InterviewLevel,InterviewPanel/Title,InterviewPanel/ID,CandidateID/ID,InterviewPanel/EMail",
  //     Expand: "RecruitmentID,InterviewPanel,CandidateID",
  //     Orderby: "ID",
  //     Orderbydecorasc: false,
  //     Filter: filterParam,
  //     FilterCondition: filterConditions,
  //   })
  //     .then((interviewPanelItems) => {
  //       return SPServices.SPReadItems({
  //         Listname: ListNames.HRMSCandidateScoreCard,
  //         Select:
  //           "InterviewPanelID/ID,RelevantQualification,ReleventExperience,Knowledge,EnergyLevel,MeetJobRequirement,ContributeTowardsCultureRequried,Experience,OtherCriteriaScore,ConsiderForEmployment,Feedback,RecruitmentID/ID,Role/RoleTitle,InterviewPersonName/Title,OverAllEvaluationFeedback,Created,QuestionJson",
  //         Expand: "InterviewPanelID,RecruitmentID,Role,InterviewPersonName",
  //         Orderby: "ID",
  //         Orderbydecorasc: false,
  //         FilterCondition: [
  //           {
  //             FilterKey: "InterviewPanelID/CandidateID/ID",
  //             Operator: "eq",
  //             FilterValue: candidateID,
  //           },
  //         ],
  //       }).then((candidateScoreCardItems) => {
  //         const panelEmails = interviewPanelItems
  //           .map((interview) => interview.InterviewPanel?.EMail)
  //           .filter((email) => email);

  //         if (panelEmails.length === 0) {
  //           return {
  //             interviewPanelItems,
  //             candidateScoreCardItems,
  //             emailToAuthorMap: {},
  //           };
  //         }

  //         return SPServices.SPReadItems({
  //           Listname: ListNames.HRMSSageList,
  //           Select:
  //             "EmailId,FirstName,LastName,MiddleName,Title,HomeAddress,ContactNumber,Department/DepartmentName,BusinessUnit/Title,JobTitleInEnglish/JobTitleInEnglish,JobTitleInFrench/JobTitleInFrench,DRCGrade/Title,PatersonGrade/Title",
  //           Expand:
  //             "Department,BusinessUnit,JobTitleInEnglish,JobTitleInFrench,DRCGrade,PatersonGrade",
  //           FilterCondition: [
  //             {
  //               FilterKey: "EmailId",
  //               Operator: "in",
  //               FilterValue: panelEmails.join(","),
  //             },
  //           ],
  //         }).then((sageListItems) => {
  //           const emailToAuthorMap = sageListItems.reduce((acc, item) => {
  //             acc[item.EmailId] = {
  //               FullName: `${item.FirstName || ""} ${
  //                 item.LastName || ""
  //               }`.trim(),
  //               Department: item.Department?.DepartmentName || "",
  //               JobTitleInEnglish: item.JobTitleInEnglish || "",
  //               JobTitleInFrench: item.JobTitleInFrench || "",
  //             };
  //             return acc;
  //           }, {});

  //           return {
  //             interviewPanelItems,
  //             candidateScoreCardItems,
  //             emailToAuthorMap,
  //           };
  //         });
  //       });
  //     })
  //     .then(
  //       ({
  //         interviewPanelItems,
  //         candidateScoreCardItems,
  //         emailToAuthorMap,
  //       }) => {
  //         let sumOverallScores = 0;
  //         const maxOverallScore = interviewPanelItems.length * 40;
  //         const formattedItems = interviewPanelItems.map((interview) => {
        
  //           const relatedScores = candidateScoreCardItems.filter(
  //             (score) => score?.InterviewPanelID?.ID === interview?.ID
  //           );
  //           const totalScore = relatedScores.reduce((sum, score) => {
  //             return (
  //               sum +
  //               (Number(score.RelevantQualification) || 0) +
  //               (Number(score.ReleventExperience) || 0) +
  //               (Number(score.Knowledge) || 0) +
  //               (Number(score.EnergyLevel) || 0) +
  //               (Number(score.MeetJobRequirement) || 0) +
  //               (Number(score.ContributeTowardsCultureRequried) || 0) +
  //               (Number(score.Experience) || 0) +
  //               (Number(score.OtherCriteriaScore) || 0) +
  //               (Number(score.ConsiderForEmployment) || 0)
  //             );
  //           }, 0);
            
  //           sumOverallScores += totalScore;
  //           const panelEmail = interview.InterviewPanel?.EMail || "N/A";
  //           const panelDetails = emailToAuthorMap[panelEmail] || {
  //             FullName: "Unknown",
  //             Title: "",
  //             Department: "",
  //             JobTitleInEnglish: "",
  //             JobTitleInFrench: "",
  //           };

  //           const formattedItem: CommentsDatas = {
  //             Id: interview.ID.toString(),
  //             JobTitleInEnglish: panelDetails.JobTitleInEnglish || "",
  //             JobTitleInFrench: panelDetails.JobTitleInFrench || "",
  //             comments: "",
  //             Department: panelDetails.Department || "",
  //             Date: interview?.Created ? new Date(interview.Created) : null,

  //             JobTitle: panelDetails.Title || "",
  //             Name: panelDetails.FullName,
  //             ID: interview.ID,
  //             RecruitmentID: interview?.RecruitmentID?.ID || 0,
  //             InterviewLevel: interview.InterviewLevel || "",
  //             InterviewPanelTitle: [panelDetails.FullName],
  //             CandidateID: interview.CandidateID?.ID || 0,
  //             CandidateScoreCard: relatedScores.map((score) => ({
  //               InterviewPanelID: score.InterviewPanelID?.ID || 0,
  //               RelevantQualification: score.RelevantQualification || "",
  //               ReleventExperience: score.ReleventExperience || "",
  //               Knowledge: score.Knowledge || "",
  //               EnergyLevel: score.EnergyLevel || "",
  //               MeetJobRequirement: score.MeetJobRequirement || "",
  //               ContributeTowardsCultureRequried:
  //                 score.ContributeTowardsCultureRequried || "",
  //               Experience: score.Experience || "",
  //               OtherCriteriaScore: score.OtherCriteriaScore || "",
  //               ConsiderForEmployment: score.ConsiderForEmployment || "",
  //               Feedback: score.Feedback || "",
  //               RecruitmentID: score.RecruitmentID?.ID || 0,
  //               Role: score.Role?.RoleTitle || "No Role",
  //               InterviewPersonName: score.InterviewPersonName?.Title || "",
  //               OverAllEvaluationFeedback:
  //                 score.OverAllEvaluationFeedback || "",
  //               CreatedDate: score.Created
  //                 ? new Date(score.Created).toLocaleString()
  //                 : "N/A",
  //                 QuestionJson: score.QuestionJson ? JSON.parse(score.QuestionJson) : [], 
  //                 OverallScore: totalScore,
  //                 MaxOverallScore: 40,
  //                 CandidateScoreCards: relatedScores,
  //             })),
            
  //             Role:
  //               relatedScores.length > 0
  //                 ? relatedScores[0].Role?.RoleTitle || "No Role"
  //                 : "No Role",
  //           };

  //           CommentsData.push(formattedItem);
  //           console.log(" QuestionJson: score.QuestionJson ? JSON.parse(score.QuestionJson)",formattedItem)
  //           return formattedItem;
  //         });

  //         return {
  //           data: formattedItems,
  //           sumOverallScores,
  //           maxOverallScore,
  //           status: 200,
  //           message:
  //             "HRMSInterviewPanelDetails and HRMSCandidateScoreCard fetched successfully",
  //         };
  //       }
  //     )
  //     .catch((error) => {
  //       console.error(error);
  //       return {
  //         data: [],
  //         status: 500,
  //         message:
  //           "Error fetching data from HRMSInterviewPanelDetails and HRMSCandidateScoreCard",
  //       };
  //     });
  // }


  //  async GetCombinedCandidatePositionDetails(
  //   filterParam: any,
  //   filterConditions: any
  // ) {
  //   try {
  //     debugger
  //     const CandidateDetails: CandidateData[] = [];
  //     const candidateItems: any[] = await SPServices.SPReadItems({
  //       Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
  //       Select:
  //         "*,JobCode/JobCode,AssignByInterviewPanel/EMail,RecruitmentID/ID,ExternalAgentDetails/AgentCode,ExternalAgentDetails/AgentName,Status/ID,Status/StatusDescription,ID",
  //       Expand:
  //         "JobCode,AssignByInterviewPanel,RecruitmentID,ExternalAgentDetails,Status",
  //       Filter: filterParam,
  //       FilterCondition: filterConditions,
  //       Topcount: count.Topcount,
  //     });

  //     const formattedItems = await Promise.all(
  //       candidateItems.map(async (item) => {
  //         const response = await CommonServices.GetAttachmentToLibrary(
  //           DocumentLibraray.InterviewPanelCandidateCV,
  //           item.JobCode?.JobCode,
  //           item?.PassportID
  //         );
  //         let candidateCV: IDocFiles[] = [];
  //         if (response.status === 200 && response.data) {
  //           candidateCV = response.data;
  //         } else {
  //           console.error(response.message);
  //         }

  //         return {
  //           ID: item.ID,
  //           RecruitmentID: item?.RecruitmentID?.ID,
  //           JobCode: item?.JobCode?.JobCode,
  //           JobCodeId: item?.JobCodeId,
  //           PassportID: item?.PassportID,
  //           FristName: item?.FristName,
  //           MiddleName: item?.MiddleName,
  //           LastName: item?.LastName,
  //           FullName:
  //             (item?.FristName ?? "") +
  //             " " +
  //             (item?.MiddleName ?? "") +
  //             " " +
  //             (item?.LastName ?? ""),
  //           ResidentialAddress: item?.ResidentialAddress,
  //           DOB: item?.DOB,
  //           ContactNumber: item?.ContactNumber,
  //           Email: item?.Email,
  //           Nationality: item?.Nationality,
  //           Gender: item?.Gender,
  //           TotalYearOfExperiance: item?.TotalYearOfExperiance,
  //           Skills: item?.Skills,
  //           LanguageKnown: item?.LanguageKnown,
  //           ReleventExperience: item?.ReleventExperience,
  //           Qualification: item?.Qualification,
  //           RecuritmentHR: item?.RecuritmentHR,
  //           AssignByInterviewPanel: item?.AssignByInterviewPanel?.EMail,
  //           CandidateCVDoc: candidateCV,
  //           Status: item?.Status?.StatusDescription || "",
  //           RoleProfileDocument: [],
  //           AdvertisementDocument: [],
  //           ShortlistedValue: "",
  //           PositionTitle: item.PositionTitle,
  //           JobGrade: item.JobGrade,
  //           ExternalAgentDetails: item?.ExternalAgentDetails
  //             ? {
  //                 AgentName: item?.ExternalAgentDetails?.AgentName,
  //               }
  //             : null,
  //         };
  //       })
  //     );

  //     CandidateDetails.push(...formattedItems);
  //     console.log("CandidateDetails",CandidateDetails)
  //     return {
  //       data: CandidateDetails,
  //       status: 200,
  //       message:
  //         "Combined Candidate and External Agent Details fetched successfully",
  //     };
  //   } catch (error) {
  //     console.error(error);
  //     return {
  //       data: [],
  //       status: 500,
  //       message:
  //         "Error fetching combined data from Candidate and External Agent Details",
  //     };
  //   }
  // }

  async GetCombinedCandidatePositionDetails(
    filterParam: any,
    filterConditions: any
  ) {
    try {
      debugger;
      const CandidateDetails: CandidateData[] = [];
  
      const candidateItems: any[] = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        Select:
          "*,JobCode/JobCode,AssignByInterviewPanel/EMail,RecruitmentID/ID,ExternalAgentDetails/AgentCode,ExternalAgentDetails/AgentName,Status/ID,Status/StatusDescription,ID",
        Expand:
          "JobCode,AssignByInterviewPanel,RecruitmentID,ExternalAgentDetails,Status",
        Filter: filterParam,
        FilterCondition: filterConditions,
        Topcount: count.Topcount,
      });
  
      const formattedItems = await Promise.all(
        candidateItems.map(async (item) => {
          // Fetch candidate CVs
          const response = await CommonServices.GetAttachmentToLibrary(
            DocumentLibraray.InterviewPanelCandidateCV,
            item.JobCode?.JobCode,
            item?.PassportID
          );
          
          const candidateCV: IDocFiles[] = response.status === 200 && response.data ? response.data : [];
          if (response.status !== 200) {
            console.error(response.message);
          }
  
          // Fetch interview scorecard details
          const filter = [{ FilterKey: "CandidateID", Operator: "eq", FilterValue: item.ID }];
          const positionResult = await this.HRMSCandidateScoreCard(filter, filterConditions, item.ID);
   console.log("POS",positionResult)
   console.log("fd", positionResult?.data?.length > 0 ? positionResult.data[0].GPA : null)
   const roundGPA = (gpa: number): number => {
    return Math.round(gpa * 100) / 100;
  };
   const lastCandidateGPA =
   positionResult?.data && positionResult.data.length > 0
     ? positionResult.data[positionResult.data.length - 1].GPA
     : null;
     const roundedGPA = lastCandidateGPA ? roundGPA(lastCandidateGPA) : null;
 console.log("lastCandidateGPA", lastCandidateGPA);
          return {
            ID: item.ID,
            RecruitmentID: item?.RecruitmentID?.ID,
            JobCode: item?.JobCode?.JobCode,
            JobCodeId: item?.JobCodeId,
            PassportID: item?.PassportID,
            FristName: item?.FristName,
            MiddleName: item?.MiddleName,
            LastName: item?.LastName,
            FullName: `${item?.FristName ?? ""} ${item?.MiddleName ?? ""} ${item?.LastName ?? ""}`.trim(),
            ResidentialAddress: item?.ResidentialAddress,
            DOB: item?.DOB,
            ContactNumber: item?.ContactNumber,
            Email: item?.Email,
            Nationality: item?.Nationality,
            Gender: item?.Gender,
            TotalYearOfExperiance: item?.TotalYearOfExperiance,
            Skills: item?.Skills,
            LanguageKnown: item?.LanguageKnown,
            ReleventExperience: item?.ReleventExperience,
            Qualification: item?.Qualification,
            RecuritmentHR: item?.RecuritmentHR,
            AssignByInterviewPanel: item?.AssignByInterviewPanel?.EMail,
            CandidateCVDoc: candidateCV,
            Status: item?.Status?.StatusDescription || "",
            RoleProfileDocument: [],
            AdvertisementDocument: [],
            ShortlistedValue: "",
            PositionTitle: item.PositionTitle,
            JobGrade: item.JobGrade,
            ExternalAgentDetails: item?.ExternalAgentDetails
              ? { AgentName: item?.ExternalAgentDetails?.AgentName }
              : null,
            HRMSCandidateScoreCard: positionResult?.data || [],
            GPA:roundedGPA
          };
        })
      );
  
      CandidateDetails.push(...formattedItems);
      console.log("CandidateDetails", CandidateDetails);
  
      return {
        data: CandidateDetails,
        status: 200,
        message: "Combined Candidate and External Agent Details fetched successfully",
      };
    } catch (error) {
      console.error(error);
      return {
        data: [],
        status: 500,
        message: "Error fetching combined data from Candidate and External Agent Details",
      };
    }
  }
  
  // async HRMSCandidateScoreCard(
  //   filterParam: any,
  //   filterConditions: any,
  //   candidateID: number
  // ): Promise<ApiResponse<any | null>> {
  //   try {
  //     debugger;
  //     let sumOverallScores = 0;
  //     let sumQuestionScores = 0;
  //     let maxQuestionScore = 0;
  
  //     // Fetch Interview Panel Details
  //     const interviewPanelItems = await SPServices.SPReadItems({
  //       Listname: ListNames.HRMSInterviewPanelDetails,
  //       Select:
  //         "ID,RecruitmentID/ID,InterviewLevel,InterviewPanel/Title,InterviewPanel/ID,CandidateID/ID,InterviewPanel/EMail",
  //       Expand: "RecruitmentID,InterviewPanel,CandidateID",
  //       Orderby: "ID",
  //       Orderbydecorasc: false,
  //       Filter: filterParam,
  //       FilterCondition: filterConditions,
  //     });
  
  //     // Fetch Candidate Score Card Details
  //     const candidateScoreCardItems = await SPServices.SPReadItems({
  //       Listname: ListNames.HRMSCandidateScoreCard,
  //       Select:
  //         "InterviewPanelID/ID,RelevantQualification,ReleventExperience,Knowledge,EnergyLevel,MeetJobRequirement,ContributeTowardsCultureRequried,Experience,OtherCriteriaScore,ConsiderForEmployment,Feedback,RecruitmentID/ID,Role/RoleTitle,InterviewPersonName/Title,OverAllEvaluationFeedback,Created,QuestionJson",
  //       Expand: "InterviewPanelID,RecruitmentID,Role,InterviewPersonName",
  //       Orderby: "ID",
  //       Orderbydecorasc: false,
  //       FilterCondition: [
  //         { FilterKey: "InterviewPanelID/CandidateID/ID", Operator: "eq", FilterValue: candidateID },
  //       ],
  //     });
  
  //     const formattedItems = interviewPanelItems.map((interview) => {
  //       const relatedScores = candidateScoreCardItems.filter(
  //         (score) => score?.InterviewPanelID?.ID === interview?.ID
  //       );
  
  //       const totalScore = relatedScores.reduce((sum, score) => {
  //         return sum + Object.values(score).reduce((acc:any, value) => acc + (Number(value) || 0), 0);
  //       }, 0);
  
  //       sumOverallScores += totalScore;
  
  //       relatedScores.forEach((score) => {
  //         const questionData = score.QuestionJson ? JSON.parse(score.QuestionJson) : [];
  //         sumQuestionScores += questionData.reduce((acc:any, q:any) => acc + Object.values(q).reduce((sum:any, value) => sum + Number(value), 0), 0);
  //         maxQuestionScore += questionData.length * 3;
  //       });
  
  //       return {
  //         InterviewPanelID: interview.ID,
  //         Name: interview.InterviewPanel?.Title || "Unknown",
  //         TotalScore: totalScore,
  //         MaxPossibleScore: sumOverallScores + sumQuestionScores,
  //       };
  //     });
  
  //     return { data: formattedItems, status: 200, message: "Scorecards fetched successfully" };
  //   } catch (error) {
  //     console.error(error);
  //     return { data: [], status: 500, message: "Error fetching scorecards" };
  //   }
  // }
  
  async HRMSCandidateScoreCard(
    filterParam: any,
    filterConditions: any,
    candidateID: number
  ): Promise<ApiResponse<any | null>> {
    let CommentsData: CommentsDatas[] = [];
    let interviewPanelItems: any[] = [];
    let candidateScoreCardItems: any[] = [];
    let emailToAuthorMap: { [key: string]: any } = {};
    let sumOverallScores = 0;
   
    let sumQuestionScores = 0;
    let maxQuestionScore = 0;
    try {
      debugger
      // Fetching Interview Panel Details
      interviewPanelItems = await SPServices.SPReadItems({
        Listname: ListNames.HRMSInterviewPanelDetails,
        Select:
          "ID,RecruitmentID/ID,InterviewLevel,InterviewPanel/Title,InterviewPanel/ID,CandidateID/ID,InterviewPanel/EMail",
        Expand: "RecruitmentID,InterviewPanel,CandidateID",
        Orderby: "ID",
        Orderbydecorasc: false,
        Filter: filterParam,
        FilterCondition: filterConditions,
      });
  
      // Fetching Candidate Score Card Details
      candidateScoreCardItems = await SPServices.SPReadItems({
        Listname: ListNames.HRMSCandidateScoreCard,
        Select:
          "InterviewPanelID/ID,RelevantQualification,ReleventExperience,Knowledge,EnergyLevel,MeetJobRequirement,ContributeTowardsCultureRequried,Experience,OtherCriteriaScore,ConsiderForEmployment,Feedback,RecruitmentID/ID,Role/RoleTitle,InterviewPersonName/Title,OverAllEvaluationFeedback,Created,QuestionJson",
        Expand: "InterviewPanelID,RecruitmentID,Role,InterviewPersonName",
        Orderby: "ID",
        Orderbydecorasc: false,
        FilterCondition: [
          {
            FilterKey: "InterviewPanelID/CandidateID/ID",
            Operator: "eq",
            FilterValue: candidateID,
          },
        ],
      });
  
      const panelEmails = interviewPanelItems
        .map((interview) => interview.InterviewPanel?.EMail)
        .filter((email) => email);
  
      // If no panel emails are found, return empty result
      if (panelEmails.length === 0) {
        return {
          data: [],
          status: 200,
          message: "No email found for the interview panel.",
        };
      }
  
      // Fetching Sage List for panel details
      const sageListItems = await SPServices.SPReadItems({
        Listname: ListNames.HRMSSageList,
        Select:
          "EmailId,FirstName,LastName,MiddleName,Title,HomeAddress,ContactNumber,Department/DepartmentName,BusinessUnit/Title,JobTitleInEnglish/JobTitleInEnglish,JobTitleInFrench/JobTitleInFrench,DRCGrade/Title,PatersonGrade/Title",
        Expand:
          "Department,BusinessUnit,JobTitleInEnglish,JobTitleInFrench,DRCGrade,PatersonGrade",
        FilterCondition: [
          {
            FilterKey: "EmailId",
            Operator: "in",
            FilterValue: panelEmails.join(","),
          },
        ],
      });
  
      // Mapping emails to author details
      emailToAuthorMap = sageListItems.reduce((acc, item) => {
        acc[item.EmailId] = {
          FullName: `${item.FirstName || ""} ${item.LastName || ""}`.trim(),
          Department: item.Department?.DepartmentName || "",
          JobTitleInEnglish: item.JobTitleInEnglish || "",
          JobTitleInFrench: item.JobTitleInFrench || "",
        };
        return acc;
      }, {});
  
      // Calculating total scores and formatting the items
      const formattedItems = interviewPanelItems.map((interview) => {
        const relatedScores = candidateScoreCardItems.filter(
          (score) => score?.InterviewPanelID?.ID === interview?.ID
        );
        const totalScore = relatedScores.reduce((sum, score) => {
          return (
            sum +
            (Number(score.RelevantQualification) || 0) +
            (Number(score.ReleventExperience) || 0) +
            (Number(score.Knowledge) || 0) +
            (Number(score.EnergyLevel) || 0) +
            (Number(score.MeetJobRequirement) || 0) +
            (Number(score.ContributeTowardsCultureRequried) || 0) +
            (Number(score.Experience) || 0) +
            (Number(score.OtherCriteriaScore) || 0) +
            (Number(score.ConsiderForEmployment) || 0)
          );
        }, 0);
  
        sumOverallScores += totalScore;
        relatedScores.forEach((score) => {
          const questionData = score.QuestionJson ? JSON.parse(score.QuestionJson) : [];
          const questionScore = questionData.reduce((acc:any, q:any) => {
              return acc + Object.values(q).reduce((sum:any, value) => sum + Number(value), 0);
          }, 0);
          sumQuestionScores += questionScore;
          maxQuestionScore += questionData.length * 3; 
      });
  
        const panelEmail = interview.InterviewPanel?.EMail || "N/A";
        const panelDetails = emailToAuthorMap[panelEmail] || {
          FullName: "Unknown",
          Title: "",
          Department: "",
          JobTitleInEnglish: "",
          JobTitleInFrench: "",
        };
  
        const maxOverallScore = interviewPanelItems.length * 40;
        const combinedScore = sumOverallScores + sumQuestionScores;
        const maxPossibleScore = maxOverallScore + maxQuestionScore;
        const gpa = (combinedScore / maxPossibleScore) * 5;
        
        const formattedItem: CommentsDatas = {
          Id: interview.ID.toString(),
          JobTitleInEnglish: panelDetails.JobTitleInEnglish || "",
          JobTitleInFrench: panelDetails.JobTitleInFrench || "",
          comments: "",
          Department: panelDetails.Department || "",
          Date: interview?.Created ? new Date(interview.Created) : null,
          JobTitle: panelDetails.Title || "",
          Name: panelDetails.FullName,
          ID: interview.ID,
          RecruitmentID: interview?.RecruitmentID?.ID || 0,
          InterviewLevel: interview.InterviewLevel || "",
          InterviewPanelTitle: [panelDetails.FullName],
          CandidateID: interview.CandidateID?.ID || 0,
          CandidateScoreCard: relatedScores.map((score) => ({
            InterviewPanelID: score.InterviewPanelID?.ID || 0,
            RelevantQualification: score.RelevantQualification || "",
            ReleventExperience: score.ReleventExperience || "",
            Knowledge: score.Knowledge || "",
            EnergyLevel: score.EnergyLevel || "",
            MeetJobRequirement: score.MeetJobRequirement || "",
            ContributeTowardsCultureRequried: score.ContributeTowardsCultureRequried || "",
            Experience: score.Experience || "",
            OtherCriteriaScore: score.OtherCriteriaScore || "",
            ConsiderForEmployment: score.ConsiderForEmployment || "",
            Feedback: score.Feedback || "",
            RecruitmentID: score.RecruitmentID?.ID || 0,
            Role: score.Role?.RoleTitle || "No Role",
            InterviewPersonName: score.InterviewPersonName?.Title || "",
            OverAllEvaluationFeedback: score.OverAllEvaluationFeedback || "",
            CreatedDate: score.Created ? new Date(score.Created).toLocaleString() : "N/A",
            QuestionJson: score.QuestionJson ? JSON.parse(score.QuestionJson) : [],
            OverallScore: totalScore,
            MaxOverallScore: maxOverallScore,  
            CandidateScoreCards: relatedScores,
          })),
          Role: relatedScores.length > 0 ? relatedScores[0].Role?.RoleTitle || "No Role" : "No Role",
          MaxOverallScore: maxOverallScore, 
          SumOverallScores: sumOverallScores,
          QuestionBasedScore: sumQuestionScores,
          MaxQuestionScore: maxQuestionScore,
          CombinedScore: combinedScore, 
          MaxPossibleScore: maxPossibleScore, 
          GPA: gpa, 
        };
  
        CommentsData.push(formattedItem);
     
                console.log("QuestionJson: score.QuestionJso",formattedItem)
        return formattedItem;
      });
  
      return {
        data: formattedItems,
        status: 200,
        message: "HRMSInterviewPanelDetails and HRMSCandidateScoreCard fetched successfully",
      };
    } catch (error) {
      console.error(error);
      return {
        data: [],
        status: 500,
        message: "Error fetching data from HRMSInterviewPanelDetails and HRMSCandidateScoreCard",
      };
    }
  }
  
  
 
  async GetHRMSPositionDetails(filterParam: any, filterConditions: any): Promise<ApiResponse<AutoCompleteItem[]>> {
    let positionOptions: AutoCompleteItem[] = [];
  
    return SPServices.SPReadItems({
      Listname: ListNames.HRMSPositionIDMaster,
      Select: "*,JobCode/JobCode,Department/DepartmentName",
      Expand: "JobCode,Department",
      Filter: filterParam,
      FilterCondition: filterConditions,
      Topcount: 100,
    })
      .then((positionItems: any[]) => {
        if (!positionItems || positionItems.length === 0) {
          return { data: [], status: 200, message: "No position details found" };
        }
  
       
        const formattedData = positionItems.map((item) => ({
          ID: item.ID,
          PositionID: item.PositionID || "",
          JobCode: item.JobCode?.JobCode || "",
          Department: item.Department?.DepartmentName || "",
          PositionIDStatus: item.PositionIDStatus || "",
        }));
  
        console.log("Formatted Data:", formattedData);
  
        positionOptions = formattedData.map((pos) => ({
          key: pos.ID,
          text:pos.PositionID , 
        }));
  
        console.log("Position Options:", positionOptions);
  
        return {
          data: positionOptions,
          status: 200,
          message: "HRMS Position Details fetched successfully",
        };
      })
      .catch((error) => {
        console.error("Error fetching HRMS Position Details:", error?.message || error);
  
        return {
          data: [],
          status: 400,
          message: "Error fetching HRMS Position Details",
        };
      });
  }
  
  async CandidateSeletionApi(
    obj: ActionUpdate,
    ListName: string
  ): Promise<ApiResponse<null>> {
    try {
      await SPServices.SPUpdateItem({
        Listname: ListName,
        RequestJSON: obj,
        ID: obj.Id,
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

  async AssignPositionID(
    obj: AssignPositionID,
    ListName: string
  ): Promise<ApiResponse<null>> {
    try {
      await SPServices.SPAddItem({
        Listname: ListName,
        RequestJSON: obj,
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
}
