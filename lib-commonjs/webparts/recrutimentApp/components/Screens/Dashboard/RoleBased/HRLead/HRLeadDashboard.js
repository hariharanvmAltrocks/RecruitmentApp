"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HRLeadDashboard = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var useKPICards_1 = tslib_1.__importDefault(require("../../Hooks/useKPICards"));
var useContractsByEndDate_1 = tslib_1.__importDefault(require("../../Hooks/useContractsByEndDate"));
var useUpcomingContracts_1 = tslib_1.__importDefault(require("../../Hooks/useUpcomingContracts"));
var useSLACompliance_1 = tslib_1.__importDefault(require("../../Hooks/useSLACompliance"));
var KPICard_1 = tslib_1.__importDefault(require("../../Shared/Cards/KPICard"));
var DonutChart_1 = tslib_1.__importDefault(require("../../Shared/Charts/DonutChart"));
var GaugeChart_1 = tslib_1.__importDefault(require("../../Shared/Charts/GaugeChart"));
var HRPerformanceCard_1 = tslib_1.__importDefault(require("../../Shared/Cards/HRPerformanceCard"));
var UpcomingContractsTable_1 = tslib_1.__importDefault(require("../../Shared/Tables/UpcomingContractsTable"));
var Dashboard_module_scss_1 = tslib_1.__importDefault(require("../../Dashboard.module.scss"));
var Lucide = tslib_1.__importStar(require("lucide-react"));
var Departmentchart_1 = tslib_1.__importDefault(require("../../../../Comman/Departmentchart/Departmentchart"));
var RecrutimentAppWebPartStrings_1 = tslib_1.__importDefault(require("RecrutimentAppWebPartStrings"));
var HRLeadDashboard = function (_a) {
    var userName = _a.userName, roleSwitcher = _a.roleSwitcher, notificationCenter = _a.notificationCenter;
    var kpis = (0, useKPICards_1.default)().data;
    var _b = (0, useContractsByEndDate_1.default)(), donutData = _b.data, loadingDonut = _b.loading;
    var _c = (0, useUpcomingContracts_1.default)(), upcomingContracts = _c.data, loadingUpcoming = _c.loading;
    var _d = (0, useSLACompliance_1.default)(), slaStats = _d.data, loadingSla = _d.loading;
    return (react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.dashboardContainer },
        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.headerRow },
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.welcomeSection },
                react_1.default.createElement("h1", null,
                    "Welcome, ",
                    react_1.default.createElement("span", null, userName)),
                react_1.default.createElement("p", null, "HR Lead Dashboard \u2022 Recruitment Workflow Management"))),
        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.kpiGrid },
            react_1.default.createElement(KPICard_1.default, { title: "Total Positions", value: "64", iconName: "TrendingUp", iconTheme: "blue" }),
            react_1.default.createElement(KPICard_1.default, { title: "Active Positions", value: (kpis === null || kpis === void 0 ? void 0 : kpis.assignedContracts) || 92, iconName: "FileText", iconTheme: "purple" }),
            react_1.default.createElement(KPICard_1.default, { title: "Due This Month", value: "25 / 92", iconName: "CheckCircle2", iconTheme: "green" }),
            react_1.default.createElement(KPICard_1.default, { title: "Overdue Positions", value: (kpis === null || kpis === void 0 ? void 0 : kpis.overdueContracts) || 8, iconName: "AlertCircle", iconTheme: "red" }),
            react_1.default.createElement(KPICard_1.default, { title: "Complete Position", value: (kpis === null || kpis === void 0 ? void 0 : kpis.candidates) || 184, iconName: "Users", iconTheme: "gray" }),
            react_1.default.createElement(KPICard_1.default, { title: "Total Recrutiment HR", value: (kpis === null || kpis === void 0 ? void 0 : kpis.candidates) || 184, iconName: "Users", iconTheme: "gray" })),
        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.chartsGrid3 },
            react_1.default.createElement(Departmentchart_1.default, { itemsPerPage: 6, title: RecrutimentAppWebPartStrings_1.default.DepartmentalDemand, subtitle: RecrutimentAppWebPartStrings_1.default.PendingLifecycle, tooltipValueLabel: "Openings" }),
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.dashboardCard },
                react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.cardHeader },
                    react_1.default.createElement("h2", null,
                        react_1.default.createElement(Lucide.CalendarClock, { size: 16, style: { color: "#3b82f6" } }),
                        "Contracts by End Date Status")),
                loadingDonut || !donutData ? (react_1.default.createElement("div", { style: { height: "260px", display: "flex", alignItems: "center", justifyContent: "center" } }, "Loading chart...")) : (react_1.default.createElement(DonutChart_1.default, { data: donutData }))),
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.dashboardCard },
                react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.cardHeader },
                    react_1.default.createElement("h2", null,
                        react_1.default.createElement(Lucide.Gauge, { size: 16, style: { color: "#ea580c" } }),
                        "SLA Dashboard")),
                loadingSla || !slaStats ? (react_1.default.createElement("div", { style: { height: "260px", display: "flex", alignItems: "center", justifyContent: "center" } }, "Loading SLA gauge...")) : (react_1.default.createElement(GaugeChart_1.default, { value: slaStats.overallSla })))),
        react_1.default.createElement(HRPerformanceCard_1.default, null),
        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.tableSection },
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.dashboardCard },
                react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.cardHeader },
                    react_1.default.createElement("h2", null,
                        react_1.default.createElement(Lucide.AlertTriangle, { size: 16, style: { color: "#ef4444" } }),
                        "Upcoming & Overdue Contracts")),
                loadingUpcoming || !upcomingContracts ? (react_1.default.createElement("div", { style: { padding: "30px", textAlign: "center" } }, "Loading alert database...")) : (react_1.default.createElement(UpcomingContractsTable_1.default, { contracts: upcomingContracts }))))));
};
exports.HRLeadDashboard = HRLeadDashboard;
exports.default = exports.HRLeadDashboard;
//# sourceMappingURL=HRLeadDashboard.js.map