import { CandidateData } from "../../Models/RecuritmentVRR";
import { AutoCompleteItem, InterviewPanaldata } from "../../Models/Screens";
import { count, DocumentLibraray, ListNames } from "../../utilities/Config";
import { IDocFiles } from "../SPService/ISPServicesProps";
import SPServices from "../SPService/SPServices";
import {
  ActionUpdate,
  AssignPositionID,
  CandidateComment,
  CandidateDetails,
  CandidateLevel2ScoreCard,
  CommentsData,
  CommentsDatas,
  Employee,
  IInterviewProcessService,
  InterviewPanelDetails,
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
        Select: "*,Status/ID,Status/StatusDescription,RecruitmentID/ID,JobCode/JobCode",
        Expand: "Status,RecruitmentID,JobCode",
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
      console.log("Fetching candidate personal details...");
      const CandidateDetails: CandidateData[] = [];
      let candidateItems: any[] = [];

      await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentCandidatePersonalDetails,
        Select: "*,JobCode/JobCode,AssignByInterviewPanel/EMail,RecruitmentID/ID,ExternalAgentDetails/AgentCode,ExternalAgentDetails/AgentName,Status/ID,Status/StatusDescription,ID",
        Expand: "JobCode,AssignByInterviewPanel,RecruitmentID,ExternalAgentDetails,Status",
        Filter: filterParam,
        FilterCondition: filterConditions,
        Topcount: count.Topcount,
      }).then((data) => {
        candidateItems = data;
      });

      const formattedItems: any[] = await Promise.all(
        candidateItems.map(async (item, index) => {
          let candidateCV: IDocFiles[] = [];

          const resumeLink = item?.CandidateResumeLink || "";
          if (resumeLink) {
            try {
              const extractedPath = resumeLink.split("/root:/")[1]?.split(":/content")[0] || "";
              if (extractedPath) {
                const folderPath = extractedPath.substring(0, extractedPath.lastIndexOf("/"));
                const fileName = extractedPath.split("/").pop();
                if (folderPath && fileName) {
                  const response = (await SPServices.getDocLibFiles({
                    FilePath: `${DocumentLibraray.HRMSCareerPortalCandidateCV}/${folderPath}`,
                  })) as IDocFiles[];

                  candidateCV = response.filter((file) => file.name === fileName);

                  if (candidateCV.length > 0) {
                    console.log("Matching CV file(s) found:", candidateCV.map(f => f.name));
                  } else {
                    console.warn(`CV not found at CandidateResumeLink: ${resumeLink}`);
                  }
                }
              }
            } catch (error) {
              console.error("Error while extracting CV from CandidateResumeLink:", error);
            }
          } else {
            console.log("CandidateResumeLink not available.");
          }

          const filter = [{ FilterKey: "CandidateID", Operator: "eq", FilterValue: item.ID }];
          let positionResult: any = { data: [] };

          console.log("Fetching interview panel details...");
          await this.getInterviewPanelDetails(filter, filterConditions, item.ID, EmployeeList)
            .then((data) => {
              positionResult = data;
              console.log("Interview panel data fetched:", positionResult);
            })
            .catch((error) => {
              console.error("Error fetching candidate scorecard:", error);
            });

          console.log("Fetching candidate comments...");
          const candidateComments = await this.getCandidateComments(item.ID);
          console.log("Candidate comments:", candidateComments);

          const lastCandidateGPA = positionResult?.data?.length
            ? positionResult.data[positionResult.data.length - 1].GPA
            : null;

          const fullName = `${item?.FristName ?? ""} ${item?.MiddleName ?? ""} ${item?.LastName ?? ""}`.trim();
          console.log("Constructed full name:", fullName);

          return {
            ID: item.ID,
            RecruitmentID: item?.RecruitmentID?.ID,
            JobCode: item?.JobCode?.JobCode,
            JobCodeId: item?.JobCodeId,
            PassportID: item?.PassportID,
            FristName: item?.FristName,
            MiddleName: item?.MiddleName,
            LastName: item?.LastName,
            FullName: fullName,
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
            StatusId: item?.StatusId,
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
            InterviewLinkLevel2: item?.InterviewLinkLevel2,
            CandidateComments: candidateComments,
            CandidateResumeLink: resumeLink,
          };
        })
      );

      CandidateDetails.push(...formattedItems);

      console.log("\nFinal Combined Candidate Details:", CandidateDetails);

      return {
        data: CandidateDetails,
        status: 200,
        message: "Combined Candidate and External Agent Details fetched successfully",
      };
    } catch (error) {
      console.error("Exception in GetCombinedCandidatePositionDetails:", error);
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

  async getCandidateComments(candidateID: number) {
    try {
      const comments = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentCandidateComments,
        Select: "*,CandidateID/ID,Role/RoleTitle,Level,Comments",
        Expand: "CandidateID,Role",
        FilterCondition: [
          {
            FilterKey: "CandidateID/ID",
            Operator: "eq",
            FilterValue: candidateID,
          },
        ],
      });

      const groupedCommentsByCandidate: Record<number, any[]> = {};

      comments.forEach((comment: any) => {
        const id = comment?.CandidateID?.ID;
        if (!id) return;

        if (!groupedCommentsByCandidate[id]) {
          groupedCommentsByCandidate[id] = [];
        }

        groupedCommentsByCandidate[id].push({
          Level: comment.Level ?? "",
          Comments: comment.Comments ?? "",
          Role: comment.Role?.RoleTitle ?? "",
        });
      });

      console.log("Grouped Comments1:", groupedCommentsByCandidate);
      return groupedCommentsByCandidate;
    } catch (error) {
      console.error(`Error fetching comments for candidate ID ${candidateID}:`, error);
      return {};
    }
  }

  async getCandidateLevel2ScoreCard(
    filterConditions: any[] = []
  ): Promise<ApiResponse<CandidateLevel2ScoreCard[]>> {
    try {
      const items = await SPServices.SPReadItems({
        Listname: ListNames.HRMSCandidateLevel2ScoreCard,
        Select: "ID,CandidateID/ID,CandidateID/Title,Comments,Role/ID,Role/RoleTitle,Level",
        Expand: "CandidateID,Role",
        Filter: filterConditions,
        Topcount: count.Topcount,
      });

      const scoreCardData: CandidateLevel2ScoreCard[] = items.map((item: any) => ({
        ID: item.ID,
        CandidateID: item.CandidateID?.ID || 0,
        CandidateName: item.CandidateID?.Title || "",
        RoleId: item.Role?.ID || 0,
        RoleTitle: item.Role?.RoleTitle || "",
        Comments: item.Comments || "",
        Level: item.Level || "",
      }));

      return {
        data: scoreCardData,
        status: 200,
        message: "Level 2 ScoreCard data fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching Level 2 scorecard:", error);
      return {
        data: [],
        status: 500,
        message: "Error fetching Level 2 scorecard",
      };
    }
  }

  async getCandidateLevel1ScoreCard(
    filterConditions: any[] = []
  ): Promise<ApiResponse<CandidateComment[]>> {
    try {
      const items = await SPServices.SPReadItems({
        Listname: ListNames.HRMSRecruitmentCandidateComments,
        Select: "ID,CandidateID/ID,CandidateID/Title,Comments,Role/ID,Role/RoleTitle,Level",
        Expand: "CandidateID,Role",
        Filter: filterConditions,
        Topcount: count.Topcount,
      });

      const result = items.map((item: any) => ({
        ID: item.ID,
        CandidateID: item.CandidateID?.ID ?? 0,
        CandidateName: item.CandidateID?.Title ?? "",
        RoleId: item.Role?.ID ?? 0,
        RoleTitle: item.Role?.RoleTitle ?? "",
        Comments: item.Comments ?? "",
        Level: item.Level ?? "",
      }));

      return {
        data: result,
        status: 200,
        message: "Level 1 comments fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching Level 1 comments:", error);
      return {
        data: [],
        status: 500,
        message: "Error fetching Level 1 comments",
      };
    }
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
    obj: ActionUpdate & { Comments?: string },
    ListName: string
  ): Promise<ApiResponse<null>> {
    try {
      const payload = {
        ActionId: obj.ActionId,
        ItemCreated: obj.ItemCreated,
        Comments: obj.Comments, // Include Comments in the payload
      };

      await SPServices.SPUpdateItem({
        Listname: ListName,
        RequestJSON: payload,
        ID: obj.Id,
      });

      return {
        data: null,
        status: 200,
        message: "Data Submitted successfully",
      };
    } catch (error) {
      console.error("Error in CandidateSeletionApi:", error);
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

  async GetSelectedCandidateDetailsByHOD(
    filterParam: any,
    filterConditions: any
  ): Promise<ApiResponse<CandidateDetails[]>> {
    try {
      const selectedCandidateItems: any[] = await SPServices.SPReadItems({
        Listname: "HRMSSelectedCandidateDetailsByHOD",
        Select: `
        *,BusinessUnitCode/ID,BusinessUnitCode/Title,
        PositionID/ID,PositionID/PositionID,
        Status/ID,Status/StatusDescription,
        LineManager/ID,LineManager/Title,LineManager/EMail,
        AssignBy/ID,AssignBy/Title,AssignBy/EMail,
        JobCode/ID,JobCode/JobCode,
        CandidateID/ID,CandidateID/Title,
        RecruitmentID/ID
      `,
        Expand: `
        BusinessUnitCode,
        PositionID,
        Status,
        LineManager,
        AssignBy,
        JobCode,
        CandidateID,
        RecruitmentID
      `,
        Filter: filterParam,
        FilterCondition: filterConditions,
        Topcount: count.Topcount,
      });

      const selectedCandidateDetails: CandidateDetails[] = selectedCandidateItems.map(item => ({
        ID: item.ID,
        BusinessUnitCode: item?.BusinessUnitCode?.Title || "",
        DateRequried: item?.DateRequried || "",
        AreaofWork: item?.AreaofWork || "",
        PositionID: item?.PositionID?.PositionID || "",
        Position: item?.PositionID?.ID || "",
        Status: item?.Status?.StatusDescription || "",
        FirstName: item?.FirstName || "",
        LastName: item?.LastName || "",
        MiddleName: item?.MiddleName || "",
        ExpatriatePosition: item?.ExpatriatePosition || "",
        Location: item?.Location || "",
        LineManager: item?.LineManager?.Title || "",
        LineManagerEmail: item?.LineManager?.EMail || "",
        PassportNumber: item?.PassportNumber || "",
        RecuritmentHR: item?.RecuritmentHR || "",
        LineManagerAction: item?.LineManagerAction || "",
        JobCode: item?.JobCode?.JobCode || "",
        AssignBy: item?.AssignBy?.Title || "",
        AssignByEmail: item?.AssignBy?.EMail || "",
        CandidateID: item?.CandidateID?.ID || 0,
        RecruitmentID: item?.RecruitmentID?.ID || 0,
      }));
      console.log("Selected Candidate Details:", selectedCandidateDetails);
      return {
        data: selectedCandidateDetails,
        status: 200,
        message: "Selected candidate details fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching selected candidate details:", error);
      return {
        data: [],
        status: 500,
        message: "Error fetching selected candidate details",
      };
    }
  }
  async CandidateSeletionApiData(
    obj: CommentsData,
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

  async SubmitCandidateCommentsApi(
    obj: InterviewPanelDetails,
    ListName: string
  ): Promise<ApiResponse<null>> {
    try {
      const response = await SPServices.SPAddItem({
        Listname: ListName,
        RequestJSON: obj,
      });
      console.log("Response from SubmitCandidateCommentsApi:", response);
      return {
        data: response.data,
        status: 200,
        message: "Data Submitted successfully",
      };
    } catch (error) {
      console.error("Error posting user data:", error);
      return {
        data: null,
        status: 400,
        message: "Error On Posting Data",
      };
    }
  }


}
