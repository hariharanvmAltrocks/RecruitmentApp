import { CandidateData } from "../../Models/RecuritmentVRR";
import { AutoCompleteItem, InterviewPanaldata } from "../../Models/Screens";
import { count, DocumentLibraray, ListNames } from "../../utilities/Config";
import { IDocFiles } from "../SPService/ISPServicesProps";
import SPServices from "../SPService/SPServices";
import {
  ActionUpdate,
  AssignPositionID,
  CommentsDatas,
  Employee,
  IInterviewProcessService,
  InterviewPanelItem,
  ScoreCard,
} from "./IInterviewProcessService";

export default class InterviewProcessService
  implements IInterviewProcessService {
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
          Select: "EmailId, FirstName, LastName,MiddleName",
          FilterCondition: [
            {
              FilterKey: "EmailId",
              Operator: "in",
              FilterValue: panelEmails.join(","),
            },
          ],
        });
        emailToAuthorMap = sageListItems.reduce((acc, item) => {
          acc[item.EmailId] = `${item?.FristName ?? ""} ${item?.MiddleName ?? ""} ${item?.LastName ?? ""
            }`.trim();
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
        FullName: `${item?.FristName ?? ""} ${item?.MiddleName ?? ""} ${item?.LastName ?? ""
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
  async GetCombinedCandidatePositionDetails(
    filterParam: any,
    filterConditions: any,
    EmployeeList: any[]
  ) {
    try {

      const CandidateDetails: CandidateData[] = [];
      let candidateItems: any[] = [];
      await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        Select: "*,JobCode/JobCode,AssignByInterviewPanel/EMail,RecruitmentID/ID,ExternalAgentDetails/AgentCode,ExternalAgentDetails/AgentName,Status/ID,Status/StatusDescription,ID",
        Expand: "JobCode,AssignByInterviewPanel,RecruitmentID,ExternalAgentDetails,Status",
        Filter: filterParam,
        FilterCondition: filterConditions,
        Topcount: count.Topcount,
      })
        .then((data) => {
          candidateItems = data;
        });
      const formattedItems: any[] = await Promise.all(
        candidateItems.map(async (item) => {
          let candidateCV: IDocFiles[] = [];

          const jobCode = item?.JobCode?.JobCode ?? "";
          const profileID = item?.ProfileID ?? "";

          if (jobCode && profileID) {
            const filePath = `${DocumentLibraray.HRMSCareerPortalCandidateCV}/${profileID}/CV`;

            const response = (await SPServices.getDocLibFiles({
              FilePath: filePath,
            })) as IDocFiles[];
            candidateCV = response.filter((file) =>
              file.name.includes(jobCode)
            );

            if (candidateCV.length === 0) {
              console.log(
                `No CV found for ProfileID: ${profileID}, JobCode: ${jobCode}`
              );
            }
          } else {
            console.log(
              "No JobCode or ProfileID provided, skipping attachment fetch."
            );
          }
          const filter = [{ FilterKey: "CandidateID", Operator: "eq", FilterValue: item.ID }];
          let positionResult: any = { data: [] };

          await this.getInterviewPanelDetails(filter, filterConditions, item.ID, EmployeeList)
            .then((data) => {
              positionResult = data;
            })
            .catch((error) => {
              console.error("Error fetching candidate scorecard:", error);
            });
          const lastCandidateGPA = positionResult?.data?.length
            ? positionResult.data[positionResult.data.length - 1].GPA
            : null;
          return {
            ID: item.ID,
            RecruitmentID: item?.RecruitmentID?.ID,
            JobCode: item?.JobCode?.JobCode,
            JobCodeId: item?.JobCodeId,
            PassportID: item?.PassportID,
            FristName: item?.FristName,
            MiddleName: item?.MiddleName,
            LastName: item?.LastName,
            FullName: `${item?.FristName ?? ""} `.trim(),
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
            CandidateCVDoc: candidateCV, // Attach candidate CV here
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
            GPA: lastCandidateGPA,
            JobRequestID: item?.JobRequestID,
            ProfileID: item?.ProfileID,
            InterviewDate: item?.InterviewDate,
            InterviewTime: item?.InterviewTime,
            InterviewLink: item?.InterviewLink,
            InterviewDateLevel2: item?.InterviewDateLevel2,
            InterviewTimeLevel2: item?.InterviewTimeLevel2,
            InterviewLinkLevel2: item?.InterviewLinkLevel2
          };
        })
      );

      CandidateDetails.push(...formattedItems);

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

  async getInterviewPanelDetails(
    filterParam: any,
    filterConditions: any,
    candidateID: number,
    EmployeeList: Employee[]
  ): Promise<ApiResponse<(InterviewPanelItem & CommentsDatas)[]>> {
    return SPServices.SPReadItems({
      Listname: ListNames.HRMSInterviewPanelDetails,
      Select:
        "*,ID,RecruitmentID/ID,InterviewLevel,InterviewPanel/Title,InterviewPanel/ID,CandidateID/ID,InterviewPanel/EMail",
      Expand: "RecruitmentID,InterviewPanel,CandidateID",
      Orderby: "ID",
      Orderbydecorasc: false,
      Filter: filterParam,
      FilterCondition: filterConditions,
    })
      .then((interviewPanelItems: any[]) => {
        return this.getCandidateScoreCard(candidateID).then(
          (scoreCardResponse) => {
            const scoreCardMap = new Map<number, ScoreCard>();

            if (
              scoreCardResponse.status === 200 &&
              scoreCardResponse.data.length > 0
            ) {
              scoreCardResponse.data.forEach((score: ScoreCard) => {
                scoreCardMap.set(score.InterviewPanelID, score);
              });
            }

            const employeeMap = new Map<string, Employee>(
              EmployeeList.map((emp: Employee) => [
                emp.Email?.toLowerCase(),
                emp,
              ])
            );

            let sumOverallScores = 0;
            let sumQuestionScores = 0;
            let maxQuestionScore = 0;
            let maxOverallScore = 0;
            const combinedItems: (InterviewPanelItem & CommentsDatas)[] =
              interviewPanelItems.map((interview: any) => {
                const scoreCard = scoreCardMap.get(interview.ID) || null;
                const panelEmail =
                  interview?.InterviewPanel?.EMail?.toLowerCase() || "";
                const employee =
                  employeeMap.get(panelEmail) || ({} as Employee);

                const relevantQualification =
                  Number(scoreCard?.RelevantQualification) || 0;
                const relevantExperience =
                  Number(scoreCard?.ReleventExperience) || 0;
                const knowledge = Number(scoreCard?.Knowledge) || 0;
                const energyLevel = Number(scoreCard?.EnergyLevel) || 0;
                const jobRequirement =
                  Number(scoreCard?.MeetJobRequirement) || 0;
                const cultureFit =
                  Number(scoreCard?.ContributeTowardsCultureRequried) || 0;
                const experience = Number(scoreCard?.Experience) || 0;
                const otherCriteria =
                  Number(scoreCard?.OtherCriteriaScore) || 0;

                const totalScore =
                  relevantQualification +
                  relevantExperience +
                  knowledge +
                  energyLevel +
                  jobRequirement +
                  cultureFit +
                  experience +
                  otherCriteria;

                const questionData: any[] = scoreCard?.QuestionJson || [];
                const questionScore = questionData.reduce((sum, q) => {
                  const score = Object.values(q)[0];
                  return sum + (Number(score) || 0);
                }, 0);

                const maxQuestionScoreForPanel = questionData.length * 3;
                const maxOverallScoreCard = 40;
                sumOverallScores += totalScore;
                sumQuestionScores += questionScore;
                maxQuestionScore += maxQuestionScoreForPanel;
                maxOverallScore += maxOverallScoreCard;

                const combinedScore = sumOverallScores + sumQuestionScores;
                const maxPossibleScore = maxQuestionScore + maxOverallScore;

                const rawGpa =
                  maxPossibleScore > 0
                    ? (combinedScore / maxPossibleScore) * 5
                    : 0;
                const gpa = Math.floor(rawGpa * 100) / 100;
                const fullName = `${employee.FirstName ?? ""} ${employee.MiddleName ?? ""} ${employee.LastName ?? ""}`.trim();
                const jobTitleInEnglish = employee?.JobTitle || "";
                const jobTitleInFrench = employee?.JobTitleInFrench || "";

                return {
                  ID: interview.ID,
                  RecruitmentID: interview?.RecruitmentID?.ID || 0,
                  InterviewLevel: interview.InterviewLevel || "",
                  InterviewPanelTitle: [interview.InterviewPanel?.Title || ""],
                  CandidateID: interview.CandidateID?.ID || 0,
                  ScoreCard: scoreCard,
                  SumOverallScores: totalScore,
                  SumQuestionScores: questionScore,
                  MaxOverallScore: maxOverallScore,
                  MaxQuestionScore: maxQuestionScoreForPanel,
                  GPA: gpa,
                  TotalScore: totalScore,
                  QuestionScore: questionScore,
                  RelevantQualification: scoreCard?.RelevantQualification || "",
                  ReleventExperience: scoreCard?.ReleventExperience || "",
                  Knowledge: scoreCard?.Knowledge || "",
                  EnergyLevel: scoreCard?.EnergyLevel || "",
                  MeetJobRequirement: scoreCard?.MeetJobRequirement || "",
                  ContributeTowardsCultureRequried:
                    scoreCard?.ContributeTowardsCultureRequried || "",
                  Experience: scoreCard?.Experience || "",
                  OtherCriteriaScore: scoreCard?.OtherCriteriaScore || "",
                  PanelFullName: fullName,
                  Department: employee?.Department || "",
                  JobTitleInEnglish: jobTitleInEnglish,
                  JobTitleInFrench: jobTitleInFrench,
                  PanelEmail: panelEmail,
                  Id: String(interview.ID),
                  comments: scoreCard?.Feedback || "",
                  Date: scoreCard?.CreatedDate
                    ? new Date(scoreCard.CreatedDate)
                    : null,
                  JobTitle: jobTitleInEnglish,
                  Name: fullName,
                  CandidateScoreCard: scoreCard ? [scoreCard] : [],
                  Role: scoreCard?.Role || "",
                  QuestionBasedScore: questionScore,
                  MaxPossibleScore: maxPossibleScore,
                  CombinedScore: combinedScore,
                };
              });
            return {
              data: combinedItems,
              status: 200,
              message: "Interview panel details fetched successfully.",
            };
          }
        );
      })
      .catch((error) => {
        console.error("Error fetching interview panel details:", error);
        return {
          data: [],
          status: 500,
          message: "Error fetching interview panel details",
        };
      });
  }

  async getCandidateScoreCard(candidateID: number): Promise<ApiResponse<ScoreCard[]>> {
    return SPServices.SPReadItems({
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
    })
      .then((candidateScoreCardItems: any[]) => {
        const formattedItems: ScoreCard[] = candidateScoreCardItems.map((score: any) => ({
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
          Role: score.Role?.RoleTitle || "",
          InterviewPersonName: score.InterviewPersonName?.Title || "",
          OverAllEvaluationFeedback: score.OverAllEvaluationFeedback || "",
          CreatedDate: score.Created ? new Date(score.Created).toLocaleString() : "",
          QuestionJson: score.QuestionJson ? JSON.parse(score.QuestionJson) : [],
        }));
        return {
          data: formattedItems,
          status: 200,
          message: "Candidate scorecard details fetched and formatted",
        };
      })
      .catch((error) => {
        console.error("Error fetching candidate scorecard details:", error);
        return {
          data: [],
          status: 500,
          message: "Error fetching candidate scorecard details",
        };
      });
  }

  async GetHRMSPositionDetails(
    filterParam: any,
    filterConditions: any
  ): Promise<ApiResponse<AutoCompleteItem[]>> {
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
          return {
            data: [],
            status: 200,
            message: "No position details found",
          };
        }
        const formattedData = positionItems.map((item) => ({
          ID: item.ID,
          PositionID: item.PositionID || "",
          JobCode: item.JobCode?.JobCode || "",
          Department: item.Department?.DepartmentName || "",
          PositionIDStatus: item.PositionIDStatus || "",
        }));
        positionOptions = formattedData.map((pos) => ({
          key: pos.ID,
          text: pos.PositionID,
        }));
        return {
          data: positionOptions,
          status: 200,
          message: "HRMS Position Details fetched successfully",
        };
      })
      .catch((error) => {
        console.error(
          "Error fetching HRMS Position Details:",
          error?.message || error
        );

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
