"use strict";
// utilities/Config.ts
// ── Only the constants needed for InterviewPanel / Evaluation tab ──
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewPanelRoutes = exports.InterviewLevels = exports.StatusId = exports.ListNames = void 0;
// ─── SharePoint List Names ────────────────────────────────────────────────────
exports.ListNames = {
    HRMSInterviewPanelDetails: "HRMSInterviewPanelDetails",
    HRMSRecruitmentCandidatePersonalDetails: "HRMSRecruitmentCandidatePersonalDetails",
    HRMSVacancyReplacementRequest: "HRMSVacancyReplacementRequest",
    HRMSGradeMaster: "HRMS_Grade_Master",
};
// ─── Status IDs used by InterviewPanel ───────────────────────────────────────
exports.StatusId = {
    InterviewScheduled: 40, // Level 1 interview
    InterviewScheduledforLevel2: 129, // Level 2 interview
};
// ─── Interview Level strings (from old Config) ────────────────────────────────
// Level3 is defined in old code but NOT used in InterviewPanel logic – kept for completeness
exports.InterviewLevels = {
    Level1: "Level 1",
    Level2: "Level 2",
    Level3: "Level 3", // exists in DB but InterviewPanel only uses Level1 & Level2
    Levels2: "Level 1 & 2", // display value when DB level = "Level 2"
};
// ─── Route paths used by EVALUATE button navigation ──────────────────────────
exports.InterviewPanelRoutes = {
    InterviewPanelEdit: "/InterviewPanelList/InterviewPanelEdit",
    HodViewScorecard: "/InterviewPanelList/HodViewScorecard",
};
//# sourceMappingURL=Config.js.map