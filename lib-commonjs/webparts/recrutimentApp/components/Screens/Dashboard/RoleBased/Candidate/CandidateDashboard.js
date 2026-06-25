"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateDashboard = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var useCandidateDashboardData_1 = tslib_1.__importDefault(require("../../Hooks/useCandidateDashboardData"));
var KPICard_1 = tslib_1.__importDefault(require("../../Shared/Cards/KPICard"));
var ProgressBar_1 = tslib_1.__importDefault(require("../../Shared/Charts/ProgressBar"));
var Dashboard_module_scss_1 = tslib_1.__importDefault(require("../../Dashboard.module.scss"));
var Lucide = tslib_1.__importStar(require("lucide-react"));
var CandidateDashboard = function (_a) {
    var userName = _a.userName, userEmail = _a.userEmail, roleSwitcher = _a.roleSwitcher, notificationCenter = _a.notificationCenter;
    var _b = (0, useCandidateDashboardData_1.default)(userEmail), candidateData = _b.data, loading = _b.loading;
    if (loading || !candidateData) {
        return (react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.dashboardContainer },
            react_1.default.createElement("div", { style: { padding: "100px", textAlign: "center", fontSize: "0.875rem", color: "#64748b" } }, "Loading your candidate profile...")));
    }
    return (react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.dashboardContainer },
        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.headerRow },
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.welcomeSection },
                react_1.default.createElement("h1", null,
                    "Welcome, ",
                    react_1.default.createElement("span", null, userName)),
                react_1.default.createElement("p", null, "Candidate Recruitment Portal \u2022 Career Path Tracker")),
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.actionsSection },
                roleSwitcher,
                notificationCenter,
                react_1.default.createElement("button", { className: Dashboard_module_scss_1.default.actionButton },
                    react_1.default.createElement(Lucide.MailOpen, { size: 14 }),
                    "Contact Recruiter"))),
        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.alertBar, style: { backgroundColor: "#ecfdf5", borderColor: "#a7f3d0", color: "#065f46" } },
            react_1.default.createElement("span", { className: Dashboard_module_scss_1.default.alertBadge, style: { backgroundColor: "#10b981" } }, "Active"),
            react_1.default.createElement("span", null, "STATUS UPDATE: Your Level 2 Interview is scheduled. Read recruiter messages for instructions."),
            react_1.default.createElement(Lucide.Video, { size: 14, style: { marginLeft: "auto" } })),
        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.kpiGrid },
            react_1.default.createElement(KPICard_1.default, { title: "Applied Position", value: candidateData.appliedPositions, iconName: "Briefcase", iconTheme: "blue" }),
            react_1.default.createElement(KPICard_1.default, { title: "Application Status", value: candidateData.applicationStatus, iconName: "Loader", iconTheme: "purple" }),
            react_1.default.createElement(KPICard_1.default, { title: "Next Interview", value: candidateData.interviewSchedule.split(" (")[0], iconName: "Calendar", iconTheme: "orange" }),
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.dashboardCard, style: { minHeight: "120px", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "1.25rem" } },
                react_1.default.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
                    react_1.default.createElement("span", { style: { fontSize: "0.75rem", fontWeight: 700, color: "#64748b" } }, "Profile Completion"),
                    react_1.default.createElement(Lucide.UserCheck, { size: 18, style: { color: "#10b981" } })),
                react_1.default.createElement(ProgressBar_1.default, { value: candidateData.profileCompletion, label: "Complete details" }))),
        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.chartsGrid3 },
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.dashboardCard },
                react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.cardHeader },
                    react_1.default.createElement("h2", null,
                        react_1.default.createElement(Lucide.Milestone, { size: 16, style: { color: "#3b82f6" } }),
                        "Recruitment Timeline")),
                react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.timelineContainer }, candidateData.timeline.map(function (step, idx) {
                    var timelineClass = "";
                    if (step.status === "completed")
                        timelineClass = Dashboard_module_scss_1.default.timelineCompleted;
                    else if (step.status === "active")
                        timelineClass = Dashboard_module_scss_1.default.timelineActive;
                    else if (step.status === "onhold")
                        timelineClass = Dashboard_module_scss_1.default.timelineOnhold;
                    else if (step.status === "rejected")
                        timelineClass = Dashboard_module_scss_1.default.timelineRejected;
                    return (react_1.default.createElement("div", { key: idx, className: "".concat(Dashboard_module_scss_1.default.timelineItem, " ").concat(timelineClass) },
                        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.timelineDot }),
                        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.timelineContent },
                            react_1.default.createElement("div", null,
                                react_1.default.createElement("span", { className: Dashboard_module_scss_1.default.timelineTitle }, step.title),
                                react_1.default.createElement("p", { className: Dashboard_module_scss_1.default.timelineDesc }, step.description)),
                            step.date && react_1.default.createElement("span", { className: Dashboard_module_scss_1.default.timelineDate }, step.date))));
                }))),
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.dashboardCard },
                react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.cardHeader },
                    react_1.default.createElement("h2", null,
                        react_1.default.createElement(Lucide.FileCheck, { size: 16, style: { color: "#10b981" } }),
                        "Document Checklist")),
                react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.docGrid },
                    candidateData.uploadedDocuments.map(function (doc, idx) {
                        var isApproved = doc.status === "Approved";
                        return (react_1.default.createElement("div", { key: idx, className: Dashboard_module_scss_1.default.docItem },
                            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.docLeft },
                                react_1.default.createElement(Lucide.FileSpreadsheet, { size: 16, style: { color: isApproved ? "#10b981" : "#ea580c" } }),
                                react_1.default.createElement("div", { style: { display: "flex", flexDirection: "column" } },
                                    react_1.default.createElement("span", null, doc.name),
                                    react_1.default.createElement("span", { style: { fontSize: "10px", color: "#64748b" } },
                                        "Uploaded on ",
                                        doc.date))),
                            react_1.default.createElement("span", { style: {
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    color: isApproved ? "#047857" : "#b45309",
                                    backgroundColor: isApproved ? "#ecfdf5" : "#fffbeb",
                                    padding: "2px 8px",
                                    borderRadius: "6px"
                                } }, doc.status)));
                    }),
                    react_1.default.createElement("button", { className: Dashboard_module_scss_1.default.actionButton, style: { width: "100%", justifyContent: "center", borderStyle: "dashed", marginTop: "0.5rem" } },
                        react_1.default.createElement(Lucide.Upload, { size: 14 }),
                        "Upload New Document"))),
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.dashboardCard },
                react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.cardHeader },
                    react_1.default.createElement("h2", null,
                        react_1.default.createElement(Lucide.MessagesSquare, { size: 16, style: { color: "#7c3aed" } }),
                        "Recruiter Messages")),
                react_1.default.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "12px", height: "260px", overflowY: "auto", paddingRight: "4px" } }, candidateData.messages.map(function (msg, idx) {
                    var isRecruiter = msg.sender !== "Candidate";
                    return (react_1.default.createElement("div", { key: idx, style: {
                            alignSelf: isRecruiter ? "flex-start" : "flex-end",
                            maxWidth: "85%",
                            backgroundColor: isRecruiter ? "#f1f5f9" : "#dbeafe",
                            padding: "10px 14px",
                            borderRadius: isRecruiter ? "0px 16px 16px 16px" : "16px 0px 16px 16px",
                            fontSize: "0.75rem",
                            lineHeight: "1.4",
                            color: "#1e293b",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
                        } },
                        react_1.default.createElement("div", { style: { fontWeight: 700, color: isRecruiter ? "#475569" : "#1e40af", marginBottom: "4px" } }, msg.sender),
                        react_1.default.createElement("div", null, msg.text),
                        react_1.default.createElement("div", { style: { fontSize: "9px", color: "#94a3b8", textAlign: "right", marginTop: "4px" } }, msg.time)));
                })),
                react_1.default.createElement("div", { style: { display: "flex", gap: "8px", borderTop: "1px solid #f1f5f9", paddingTop: "0.75rem" } },
                    react_1.default.createElement("input", { type: "text", placeholder: "Type your message...", style: { flex: 1, padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "0.8125rem", outline: "none" } }),
                    react_1.default.createElement("button", { className: Dashboard_module_scss_1.default.actionButton, style: { padding: "0 16px" } }, "Send"))))));
};
exports.CandidateDashboard = CandidateDashboard;
exports.default = exports.CandidateDashboard;
//# sourceMappingURL=CandidateDashboard.js.map