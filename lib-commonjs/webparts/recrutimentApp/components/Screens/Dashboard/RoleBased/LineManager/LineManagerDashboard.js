"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineManagerDashboard = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var useContractAllocation_1 = tslib_1.__importDefault(require("../../Hooks/useContractAllocation"));
var KPICard_1 = tslib_1.__importDefault(require("../../Shared/Cards/KPICard"));
var ContractAllocationTable_1 = tslib_1.__importDefault(require("../../Shared/Tables/ContractAllocationTable"));
var Dashboard_module_scss_1 = tslib_1.__importDefault(require("../../Dashboard.module.scss"));
var Lucide = tslib_1.__importStar(require("lucide-react"));
var LineManagerDashboard = function (_a) {
    var userName = _a.userName, roleSwitcher = _a.roleSwitcher, notificationCenter = _a.notificationCenter;
    var _b = (0, useContractAllocation_1.default)(), contracts = _b.data, loading = _b.loading;
    // Filter department contracts for LM context
    var lmContracts = (0, react_1.useMemo)(function () {
        if (!contracts)
            return [];
        return contracts.filter(function (c) { return c.department === "TECHNOLOGY" || c.department === "MINING OPERATIONS"; });
    }, [contracts]);
    return (react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.dashboardContainer },
        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.headerRow },
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.welcomeSection },
                react_1.default.createElement("h1", null,
                    "Welcome, ",
                    react_1.default.createElement("span", null, userName)),
                react_1.default.createElement("p", null, "Line Manager Console \u2022 Interview Evaluations & Approvals")),
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.actionsSection },
                roleSwitcher,
                notificationCenter,
                react_1.default.createElement("button", { className: Dashboard_module_scss_1.default.actionButton },
                    react_1.default.createElement(Lucide.CalendarClock, { size: 14 }),
                    "My Calendar"))),
        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.alertBar, style: { backgroundColor: "#fef3c7", borderColor: "#fde68a", color: "#92400e" } },
            react_1.default.createElement("span", { className: Dashboard_module_scss_1.default.alertBadge, style: { backgroundColor: "#d97706" } }, "Action"),
            react_1.default.createElement("span", null, "INTERVIEW FEEDBACK DUE: You have 2 candidate scorecards pending your technical review for Underground Shift Supervisor."),
            react_1.default.createElement(Lucide.ArrowRight, { size: 14, style: { marginLeft: "auto" } })),
        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.kpiGrid },
            react_1.default.createElement(KPICard_1.default, { title: "Pending Interviews", value: "3", iconName: "Calendar", iconTheme: "blue", footerText: "View schedule" }),
            react_1.default.createElement(KPICard_1.default, { title: "Candidate Reviews", value: "4", iconName: "FileCheck", iconTheme: "purple", footerText: "Open evaluations" }),
            react_1.default.createElement(KPICard_1.default, { title: "Offer Approvals", value: "1", iconName: "PenTool", iconTheme: "orange", footerText: "Review offers" }),
            react_1.default.createElement(KPICard_1.default, { title: "Open Requisitions", value: "2", iconName: "Briefcase", iconTheme: "green", footerText: "View details" })),
        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.chartsGrid2 },
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.dashboardCard },
                react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.cardHeader },
                    react_1.default.createElement("h2", null,
                        react_1.default.createElement(Lucide.CalendarDays, { size: 16, style: { color: "#3b82f6" } }),
                        "Interview Calendar")),
                react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.timelineContainer },
                    react_1.default.createElement("div", { className: "".concat(Dashboard_module_scss_1.default.timelineItem, " ").concat(Dashboard_module_scss_1.default.timelineActive) },
                        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.timelineDot }),
                        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.timelineContent },
                            react_1.default.createElement("div", null,
                                react_1.default.createElement("span", { className: Dashboard_module_scss_1.default.timelineTitle }, "Level 1 Interview: Marie-Claire Mwamba"),
                                react_1.default.createElement("p", { className: Dashboard_module_scss_1.default.timelineDesc }, "Position: Underground Shift Supervisor (UND-101)")),
                            react_1.default.createElement("span", { className: Dashboard_module_scss_1.default.timelineDate }, "Today, 02:30 PM"))),
                    react_1.default.createElement("div", { className: "".concat(Dashboard_module_scss_1.default.timelineItem, " ").concat(Dashboard_module_scss_1.default.timelineOnhold) },
                        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.timelineDot }),
                        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.timelineContent },
                            react_1.default.createElement("div", null,
                                react_1.default.createElement("span", { className: Dashboard_module_scss_1.default.timelineTitle }, "Level 2 Panel Assessment: John Doe"),
                                react_1.default.createElement("p", { className: Dashboard_module_scss_1.default.timelineDesc }, "Position: Mobile App Specialist (1013-CT-14-016)")),
                            react_1.default.createElement("span", { className: Dashboard_module_scss_1.default.timelineDate }, "June 28, 10:00 AM"))))),
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.dashboardCard },
                react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.cardHeader },
                    react_1.default.createElement("h2", null,
                        react_1.default.createElement(Lucide.History, { size: 16, style: { color: "#10b981" } }),
                        "Recent Activities")),
                react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.timelineContainer },
                    react_1.default.createElement("div", { className: "".concat(Dashboard_module_scss_1.default.timelineItem, " ").concat(Dashboard_module_scss_1.default.timelineCompleted) },
                        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.timelineDot }),
                        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.timelineContent },
                            react_1.default.createElement("div", null,
                                react_1.default.createElement("span", { className: Dashboard_module_scss_1.default.timelineTitle }, "Submitted Scorecard: Jean Kabongo"),
                                react_1.default.createElement("p", { className: Dashboard_module_scss_1.default.timelineDesc }, "Gave 82% score for Safety Officer L1 interview.")),
                            react_1.default.createElement("span", { className: Dashboard_module_scss_1.default.timelineDate }, "Yesterday"))),
                    react_1.default.createElement("div", { className: "".concat(Dashboard_module_scss_1.default.timelineItem, " ").concat(Dashboard_module_scss_1.default.timelineCompleted) },
                        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.timelineDot }),
                        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.timelineContent },
                            react_1.default.createElement("div", null,
                                react_1.default.createElement("span", { className: Dashboard_module_scss_1.default.timelineTitle }, "Approved Job Advert Requisition"),
                                react_1.default.createElement("p", { className: Dashboard_module_scss_1.default.timelineDesc }, "Approved job specs for IT Support Services Phase II.")),
                            react_1.default.createElement("span", { className: Dashboard_module_scss_1.default.timelineDate }, "3 days ago")))))),
        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.tableSection },
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.dashboardCard },
                react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.cardHeader },
                    react_1.default.createElement("h2", null,
                        react_1.default.createElement(Lucide.Layers, { size: 16, style: { color: "#2563eb" } }),
                        "My Department Vacancies")),
                loading ? (react_1.default.createElement("div", { style: { padding: "40px", textAlign: "center" } }, "Loading requisitions...")) : (react_1.default.createElement(ContractAllocationTable_1.default, { contracts: lmContracts }))))));
};
exports.LineManagerDashboard = LineManagerDashboard;
exports.default = exports.LineManagerDashboard;
//# sourceMappingURL=LineManagerDashboard.js.map