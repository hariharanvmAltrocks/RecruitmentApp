"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HRLeadDashboard = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var SummaryCards_1 = tslib_1.__importDefault(require("../../Shared/SummaryCards/SummaryCards"));
var PositionStatusChart_1 = tslib_1.__importDefault(require("../../Shared/PositionStatusChart/PositionStatusChart"));
var HRWorkflowOverview_1 = tslib_1.__importDefault(require("../../Shared/HRWorkflowOverview/HRWorkflowOverview"));
var UpcomingPositionsTable_1 = tslib_1.__importDefault(require("../../Shared/UpcomingPositionsTable/UpcomingPositionsTable"));
var Dashboard_module_scss_1 = tslib_1.__importDefault(require("../../Dashboard.module.scss"));
var HRLeadDashboard = function (_a) {
    var userName = _a.userName, roleSwitcher = _a.roleSwitcher, notificationCenter = _a.notificationCenter;
    return (react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.dashboardContainer, "aria-label": "HR Lead Dashboard" },
        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.headerRow },
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.welcomeSection },
                react_1.default.createElement("h1", null,
                    "Welcome, ",
                    react_1.default.createElement("span", null, userName || "altkamoa03")),
                react_1.default.createElement("p", null, "HR Lead Dashboard \u2022 Recruitment Workflow Management"))),
        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.topDashboardGrid },
            react_1.default.createElement(SummaryCards_1.default, null),
            react_1.default.createElement(PositionStatusChart_1.default, null)),
        react_1.default.createElement(HRWorkflowOverview_1.default, null),
        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.tableSection },
            react_1.default.createElement(UpcomingPositionsTable_1.default, null))));
};
exports.HRLeadDashboard = HRLeadDashboard;
exports.default = exports.HRLeadDashboard;
//# sourceMappingURL=HRLeadDashboard.js.map