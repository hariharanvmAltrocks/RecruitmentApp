"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDashboard = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var useKPICards_1 = tslib_1.__importDefault(require("../../Hooks/useKPICards"));
var useContractsByEndDate_1 = tslib_1.__importDefault(require("../../Hooks/useContractsByEndDate"));
var useContractAllocation_1 = tslib_1.__importDefault(require("../../Hooks/useContractAllocation"));
var KPICard_1 = tslib_1.__importDefault(require("../../Shared/Cards/KPICard"));
var DonutChart_1 = tslib_1.__importDefault(require("../../Shared/Charts/DonutChart"));
var HRPerformanceCard_1 = tslib_1.__importDefault(require("../../Shared/Cards/HRPerformanceCard"));
var ContractAllocationTable_1 = tslib_1.__importDefault(require("../../Shared/Tables/ContractAllocationTable"));
var Dashboard_module_scss_1 = tslib_1.__importDefault(require("../../Dashboard.module.scss"));
var Lucide = tslib_1.__importStar(require("lucide-react"));
var AdminDashboard = function (_a) {
    var userName = _a.userName, roleSwitcher = _a.roleSwitcher, notificationCenter = _a.notificationCenter;
    var _b = (0, useKPICards_1.default)(), kpis = _b.data, loadingKpi = _b.loading;
    var _c = (0, useContractsByEndDate_1.default)(), donutData = _c.data, loadingDonut = _c.loading;
    var _d = (0, useContractAllocation_1.default)(), contracts = _d.data, loadingContracts = _d.loading;
    return (react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.dashboardContainer },
        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.headerRow },
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.welcomeSection },
                react_1.default.createElement("h1", null,
                    "Welcome, ",
                    react_1.default.createElement("span", null, userName)),
                react_1.default.createElement("p", null, "System Administrator Dashboard \u2022 Kamoa Copper HRMS Portal")),
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.actionsSection },
                roleSwitcher,
                notificationCenter,
                react_1.default.createElement("button", { className: Dashboard_module_scss_1.default.actionButton },
                    react_1.default.createElement(Lucide.RefreshCw, { size: 14 }),
                    "Sync System"))),
        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.alertBar },
            react_1.default.createElement("span", { className: Dashboard_module_scss_1.default.alertBadge }, "Urgent"),
            react_1.default.createElement("span", null, "SYSTEM UPDATE: 1 approval request is pending in department mining operations. Click here to process."),
            react_1.default.createElement(Lucide.ArrowRight, { size: 14, style: { marginLeft: "auto" } })),
        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.kpiGrid },
            react_1.default.createElement(KPICard_1.default, { title: "Total Positions", value: loadingKpi ? "..." : (kpis === null || kpis === void 0 ? void 0 : kpis.assignedContracts) || 92, iconName: "FileText", iconTheme: "purple", footerText: "View all contracts" }),
            react_1.default.createElement(KPICard_1.default, { title: "Active Positions", value: loadingKpi ? "..." : 68, iconName: "ClipboardCheck", iconTheme: "blue", footerText: "View active" }),
            react_1.default.createElement(KPICard_1.default, { title: "Due This Month", value: loadingKpi ? "..." : (kpis === null || kpis === void 0 ? void 0 : kpis.upcomingSLA) || 11, iconName: "Calendar", iconTheme: "orange", footerText: "View upcoming" }),
            react_1.default.createElement(KPICard_1.default, { title: "Overdue Positions", value: loadingKpi ? "..." : (kpis === null || kpis === void 0 ? void 0 : kpis.overdueContracts) || 8, iconName: "AlertCircle", iconTheme: "red", footerText: "View overdue" }),
            react_1.default.createElement(KPICard_1.default, { title: "Completed", value: loadingKpi ? "..." : 16, iconName: "CheckCircle2", iconTheme: "green", footerText: "View completed" }),
            react_1.default.createElement(KPICard_1.default, { title: "Total Recrutiment HR", value: loadingKpi ? "..." : 14, iconName: "Users", iconTheme: "gray", footerText: "View all HRs" })),
        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.chartsGrid3 },
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.dashboardCard },
                react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.cardHeader },
                    react_1.default.createElement("h2", null,
                        react_1.default.createElement(Lucide.PieChart, { size: 16, style: { color: "#3b82f6" } }),
                        "Positions By End Date Status")),
                loadingDonut || !donutData ? (react_1.default.createElement("div", { style: { height: "300px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8125rem", color: "#64748b" } }, "Loading chart data...")) : (react_1.default.createElement(DonutChart_1.default, { data: donutData })))),
        react_1.default.createElement(HRPerformanceCard_1.default, null),
        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.tableSection },
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.dashboardCard },
                react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.cardHeader },
                    react_1.default.createElement("h2", null,
                        react_1.default.createElement(Lucide.LayoutGrid, { size: 16, style: { color: "#2563eb" } }),
                        "Positions Allocation Table")),
                loadingContracts || !contracts ? (react_1.default.createElement("div", { style: { padding: "40px", textAlign: "center", fontSize: "0.8125rem", color: "#64748b" } }, "Loading allocation database...")) : (react_1.default.createElement(ContractAllocationTable_1.default, { contracts: contracts }))))));
};
exports.AdminDashboard = AdminDashboard;
exports.default = exports.AdminDashboard;
//# sourceMappingURL=AdminDashboard.js.map