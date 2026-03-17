"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvalQueryConfig = exports.EvalUIConfig = exports.EvalMessages = exports.EvalAlertOptions = exports.EvalNavigationPaths = exports.EvalRoleID = exports.InterviewLevels = exports.EvalStatusId = exports.EvalListNames = void 0;
exports.EvalListNames = {
    HRMSInterviewPanelDetails: "HRMSInterviewPanelDetails",
    HRMSCandidatePersonalDetails: "HRMSRecruitmentCandidatePersonalDetails",
    HRMSRecruitmentDptDetails: "HRMSRecruitmentDptDetails",
    HRMSGradeMaster: "HRMSGradeMaster",
    HRMSCandidateScoreCard: "HRMSCandidateScoreCard",
};
exports.EvalStatusId = {
    InterviewScheduled: 40,
    InterviewScheduledforLevel2: 129,
};
exports.InterviewLevels = {
    Level1: "Level 1",
    Level2: "Level 2",
    Level3: "Level 3",
    Levels2: "Level 1 & 2",
};
exports.EvalRoleID = {
    RecruitmentHRLead: 1,
    RecruitmentHR: 2,
    HOD: 3,
    LineManager: 4,
    InterviewPanel: 5,
};
exports.EvalNavigationPaths = {
    HODLevel1: "/RecurimentProcess/InterviewPanelList/InterviewPanelEdit",
    PanelLevel1: "InterviewPanelList/InterviewPanelEdit",
    DefaultLevel1: "/ReviewProfileList/InterviewPanelList/InterviewPanelEdit",
    HODLevel2: "/RecurimentProcess/HodViewScorecard",
    PanelLevel2: "/InterviewPanelList/HodViewScorecard",
    DefaultLevel2: "/ReviewProfileList/HodViewScorecard",
};
exports.EvalAlertOptions = {
    Error: "Error",
    Success: "Success",
};
exports.EvalMessages = {
    InterviewScoredAlready: "The scorecard for the candidate has already been submitted.",
    InterviewScoreCommentsAlready: "The scorecard for the candidate comments has already been submitted.",
};
exports.EvalUIConfig = {
    SkeletonRowCount: 5,
    DefaultSortKey: "applicantName",
    DefaultSortDir: "asc",
    InterviewDateDisplayFormat: "DD-MMM-YYYY hh:mm A",
    InterviewDateParseFormat: "YYYY-MM-DD HH:mm",
    CompareDateFormat: "YYYY-MM-DD",
    ScoreSheetUploadedValue: "Yes",
    ItemCreatedNo: "No",
};
exports.EvalQueryConfig = {
    InterviewPanel: {
        Select: "ID, CandidateID/ID, RecruitmentID/ID, InterviewLevel, InterviewPanel/Id, InterviewPanel/Title, InterviewPanel/EMail, IsScoreSheetUploaded",
        Expand: "InterviewPanel,RecruitmentID,CandidateID",
    },
    CandidateDetails: {
        Select: "*,JobCode/JobCode,AssignByInterviewPanel/EMail,RecruitmentID/ID,Status/ID,Status/StatusDescription,ID",
        Expand: "JobCode,AssignByInterviewPanel,RecruitmentID,Status",
    },
};
//# sourceMappingURL=EvaluationConfig.js.map