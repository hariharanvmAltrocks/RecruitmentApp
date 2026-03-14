"use strict";
// ═══════════════════════════════════════════════════════════════════════════
//  EvaluationConfig.ts
//  Evaluation tab + EvaluationService-ல் use ஆகும் எல்லா constants இங்கே
//  Source: InterviewPanelList.tsx + InterviewProcessService.ts → Config.ts
// ═══════════════════════════════════════════════════════════════════════════
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvalUIConfig = exports.EvalQueryConfig = exports.EvalButtonAction = exports.EvalTabName = exports.EvalMessages = exports.EvalAlertOptions = exports.EvalNavigationPaths = exports.EvalRoleID = exports.EvalInterviewLevels = exports.EvalStatusId = exports.EvalListNames = void 0;
// ───────────────────────────────────────────────────────────────────────────
// 1. SP LIST NAMES
//    எந்த list எங்கே use ஆகிறது என்று comment போட்டிருக்கிறேன்
// ───────────────────────────────────────────────────────────────────────────
exports.EvalListNames = {
    // Service method 2 — getInterviewPanelsByUser()
    // Service method 5 — getTooltipData()
    // Service method 6 — checkScoreSheet()
    // InterviewProcessService.GetInterviewPanelDetails()
    HRMSInterviewPanelDetails: "HRMSInterviewPanelDetails",
    // Service method 3 — getCombinedCandidates()
    // InterviewProcessService.GetCombinedCandidatePositionDetails()
    HRMSCandidatePersonalDetails: "HRMSRecruitmentCandidatePersonalDetails",
    // Service method 4 — getGradeAndLevel() → GetRecruitmentDetails()
    HRMSRecruitmentDptDetails: "HRMSRecruitmentDptDetails",
    // Service method 4 — getGradeAndLevel() → GetGradeLevel()
    HRMSGradeMaster: "HRMSGradeMaster",
    // InterviewProcessService internal — getCandidateScoreCard()
    HRMSCandidateScoreCard: "HRMSCandidateScoreCard",
    // InterviewProcessService internal — getCandidateComments()
    HRMSCandidateComments: "HRMSRecruitmentCandidateComments",
    // InterviewProcessService internal — getCandidateLevel2ScoreCardData()
    HRMSCandidateLevel2ScoreCard: "HRMSCandidateLevel2ScoreCard",
    // InterviewProcessService internal — GetInterviewPanelDetails (Sage lookup)
    HRMSSageList: "HRMSSageList",
};
// ───────────────────────────────────────────────────────────────────────────
// 2. STATUS IDs
//    InterviewPanelList.tsx line 61, 68, 189, 309, 332
//    EvaluationService — getCombinedCandidates(), checkScoreSheet()
// ───────────────────────────────────────────────────────────────────────────
exports.EvalStatusId = {
    // StatusId.InterviewScheduled — Level 1 interview scheduled
    // Used: filter, navigation path decision, level determination
    InterviewScheduled: 16,
    // StatusId.InterviewScheduledforLevel2 — Level 2 interview scheduled
    // Used: filter, navigation path decision, level determination
    InterviewScheduledforLevel2: 20,
};
// ───────────────────────────────────────────────────────────────────────────
// 3. INTERVIEW LEVELS
//    InterviewPanelList.tsx line 170, 171, 189, 191, 311, 335
//    useEvaluationData — level filter logic
//    EvaluationService — checkScoreSheet(), getTooltipData()
// ───────────────────────────────────────────────────────────────────────────
exports.EvalInterviewLevels = {
    // InterviewLevels.Level1 — "Level 1"
    Level1: "Level 1",
    // InterviewLevels.Level2 — "Level 2"
    Level2: "Level 2",
    // InterviewLevels.Levels2 — display label used in table rows
    Levels2: "Level 2",
};
// ───────────────────────────────────────────────────────────────────────────
// 4. ROLE IDs
//    InterviewPanelList.tsx line 62–74, 87, 101, 115, 652
//    Used: navigation path + conditional render
// ───────────────────────────────────────────────────────────────────────────
exports.EvalRoleID = {
    // RoleID.HOD
    HOD: "HOD",
    // RoleID.LineManager
    LineManager: "LineManager",
    // RoleID.InterviewPanel
    InterviewPanel: "InterviewPanel",
    // RoleID.RecruitmentHR
    RecruitmentHR: "RecruitmentHR",
};
// ───────────────────────────────────────────────────────────────────────────
// 5. NAVIGATION PATHS
//    InterviewPanelList.tsx handleRedirectView() — line 60–75
//    Used: evaluate button click → navigate to score sheet
// ───────────────────────────────────────────────────────────────────────────
exports.EvalNavigationPaths = {
    // HOD / LineManager → Level 1 score sheet
    HODLevel1: "/RecurimentProcess/InterviewPanelList/InterviewPanelEdit",
    // InterviewPanel role → Level 1 score sheet
    PanelLevel1: "InterviewPanelList/InterviewPanelEdit",
    // Other roles → Level 1 score sheet
    DefaultLevel1: "/ReviewProfileList/InterviewPanelList/InterviewPanelEdit",
    // HOD / LineManager → Level 2 score card
    HODLevel2: "/RecurimentProcess/HodViewScorecard",
    // InterviewPanel role → Level 2 score card
    PanelLevel2: "/InterviewPanelList/HodViewScorecard",
    // Other roles → Level 2 score card
    DefaultLevel2: "/ReviewProfileList/HodViewScorecard",
    // Back to dashboard button
    Dashboard: "/Dashboard",
};
// ───────────────────────────────────────────────────────────────────────────
// 6. ALERT OPTIONS
//    InterviewPanelList.tsx line 153, 173 — HRMSAlertOptions.Error
// ───────────────────────────────────────────────────────────────────────────
exports.EvalAlertOptions = {
    Error: "Error",
    Success: "Success",
    Warning: "Warning",
};
// ───────────────────────────────────────────────────────────────────────────
// 7. ALERT MESSAGES
//    InterviewPanelList.tsx handleAlert() — line 168–184
//    RecuritmentHRMsg.InterviewScoredAlready
//    RecuritmentHRMsg.InterviewScoreCommentsAlready
// ───────────────────────────────────────────────────────────────────────────
exports.EvalMessages = {
    // Shown when Level 1 score sheet already uploaded — handleAlert(Level1)
    InterviewScoredAlready: "You have already submitted the interview score for this candidate.",
    // Shown when Level 2 score card already submitted — handleAlert(Level2)
    InterviewScoreCommentsAlready: "You have already submitted the interview comments for this candidate.",
};
// ───────────────────────────────────────────────────────────────────────────
// 8. TAB NAME
//    InterviewPanelList.tsx line 605, 626, 664 — TabName.Evaluation
// ───────────────────────────────────────────────────────────────────────────
exports.EvalTabName = {
    Evaluation: "Evaluation",
};
// ───────────────────────────────────────────────────────────────────────────
// 9. BUTTON ACTION
//    InterviewPanelList.tsx line 329, 347 — ButtonAction.View
// ───────────────────────────────────────────────────────────────────────────
exports.EvalButtonAction = {
    View: "View",
};
// ───────────────────────────────────────────────────────────────────────────
// 10. SP QUERY CONFIG (Select / Expand strings used in service calls)
//     Extracted from InterviewProcessService.ts
// ───────────────────────────────────────────────────────────────────────────
exports.EvalQueryConfig = {
    // GetInterviewPanelDetails — service method 2 + method 5
    InterviewPanel: {
        Select: "ID, CandidateID/ID, RecruitmentID/ID, InterviewLevel, InterviewPanel/Id, InterviewPanel/Title, InterviewPanel/EMail, IsScoreSheetUploaded",
        Expand: "InterviewPanel,RecruitmentID,CandidateID",
    },
    // GetCombinedCandidatePositionDetails — service method 3
    CandidateDetails: {
        Select: "*,JobCode/JobCode,AssignByInterviewPanel/EMail,RecruitmentID/ID,Status/ID,Status/StatusDescription,ID",
        Expand: "JobCode,AssignByInterviewPanel,RecruitmentID,Status",
    },
};
// ───────────────────────────────────────────────────────────────────────────
// 11. UI CONFIG
//     Skeleton rows, sort defaults, date format
// ───────────────────────────────────────────────────────────────────────────
exports.EvalUIConfig = {
    // Number of shimmer skeleton rows shown while data loads (no spinner)
    SkeletonRowCount: 5,
    // Default table sort
    DefaultSortKey: "applicantName",
    DefaultSortDir: "asc",
    // Date format used in InterviewPanelList — moment().format()
    InterviewDateDisplayFormat: "DD-MMM-YYYY hh:mm A",
    InterviewDateParseFormat: "YYYY-MM-DD HH:mm",
    CompareDateFormat: "YYYY-MM-DD",
    // IsScoreSheetUploaded check value
    ScoreSheetUploadedValue: "Yes",
    // ItemCreated filter value
    ItemCreatedNo: "No",
};
//# sourceMappingURL=EvaluationConfig.js.map