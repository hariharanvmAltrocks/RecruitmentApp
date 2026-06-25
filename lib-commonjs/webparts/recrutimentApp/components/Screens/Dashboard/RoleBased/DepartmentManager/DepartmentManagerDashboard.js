"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentManagerDashboard = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var useContractAllocation_1 = tslib_1.__importDefault(require("../../Hooks/useContractAllocation"));
var KPICard_1 = tslib_1.__importDefault(require("../../Shared/Cards/KPICard"));
var GaugeChart_1 = tslib_1.__importDefault(require("../../Shared/Charts/GaugeChart"));
var ContractAllocationTable_1 = tslib_1.__importDefault(require("../../Shared/Tables/ContractAllocationTable"));
var Dashboard_module_scss_1 = tslib_1.__importDefault(require("../../Dashboard.module.scss"));
var Lucide = tslib_1.__importStar(require("lucide-react"));
var DepartmentManagerDashboard = function (_a) {
    var userName = _a.userName, roleSwitcher = _a.roleSwitcher, notificationCenter = _a.notificationCenter;
    var _b = (0, useContractAllocation_1.default)(), allContracts = _b.data, loading = _b.loading;
    // Contextual department matching (Louis Barend belongs to Technology in the screenshots)
    var departmentName = "TECHNOLOGY";
    // Filter department contracts
    var deptContracts = (0, react_1.useMemo)(function () {
        if (!allContracts)
            return [];
        return allContracts.filter(function (c) { return c.department.toLowerCase() === departmentName.toLowerCase(); });
    }, [allContracts]);
    // Aggregate metrics
    var stats = (0, react_1.useMemo)(function () {
        var req = 0;
        var filled = 0;
        var candidates = 0;
        var slaSum = 0;
        deptContracts.forEach(function (c) {
            req += c.requiredPositions;
            filled += c.filledPositions;
            candidates += c.candidateCount;
            slaSum += c.slaProgress;
        });
        var avgSla = deptContracts.length > 0 ? Math.round(slaSum / deptContracts.length) : 0;
        return {
            requestsCount: deptContracts.length,
            required: req,
            filled: filled,
            balance: req - filled,
            candidates: candidates,
            avgSla: avgSla,
            pendingApprovals: 2
        };
    }, [deptContracts]);
    return (react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.dashboardContainer },
        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.headerRow },
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.welcomeSection },
                react_1.default.createElement("h1", null,
                    "Welcome, ",
                    react_1.default.createElement("span", null, userName)),
                react_1.default.createElement("p", null,
                    "Department Manager Dashboard \u2022 ",
                    react_1.default.createElement("span", null, departmentName),
                    " Division")),
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.actionsSection },
                roleSwitcher,
                notificationCenter,
                react_1.default.createElement("button", { className: Dashboard_module_scss_1.default.actionButton },
                    react_1.default.createElement(Lucide.FilePlus, { size: 14 }),
                    "Raise Headcount request"))),
        stats.pendingApprovals > 0 && (react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.alertBar, style: { backgroundColor: "#fffbeb", borderColor: "#fde68a", color: "#b45309" } },
            react_1.default.createElement("span", { className: Dashboard_module_scss_1.default.alertBadge, style: { backgroundColor: "#f59e0b" } }, "Approvals"),
            react_1.default.createElement("span", null,
                "PENDING: You have ",
                stats.pendingApprovals,
                " recruitment requisition requests awaiting your HOD approval signature."),
            react_1.default.createElement(Lucide.FileSignature, { size: 14, style: { marginLeft: "auto" } }))),
        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.kpiGrid },
            react_1.default.createElement(KPICard_1.default, { title: "Department Requests", value: loading ? "..." : stats.requestsCount, iconName: "FileSpreadsheet", iconTheme: "blue" }),
            react_1.default.createElement(KPICard_1.default, { title: "Pending HOD Approval", value: loading ? "..." : stats.pendingApprovals, iconName: "FileCheck", iconTheme: "orange" }),
            react_1.default.createElement(KPICard_1.default, { title: "Total Vacancies", value: loading ? "..." : stats.required, iconName: "Briefcase", iconTheme: "purple" }),
            react_1.default.createElement(KPICard_1.default, { title: "Filled Positions", value: loading ? "..." : stats.filled, iconName: "CheckCircle", iconTheme: "green" }),
            react_1.default.createElement(KPICard_1.default, { title: "Open Headcount", value: loading ? "..." : stats.balance, iconName: "HelpCircle", iconTheme: "gray" })),
        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.chartsGrid2 },
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.dashboardCard },
                react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.cardHeader },
                    react_1.default.createElement("h2", null,
                        react_1.default.createElement(Lucide.Gauge, { size: 16, style: { color: "#ea580c" } }),
                        "Department SLA Status")),
                loading ? (react_1.default.createElement("div", { style: { height: "220px", display: "flex", alignItems: "center", justifyItems: "center" } }, "Loading SLA...")) : (react_1.default.createElement(GaugeChart_1.default, { value: stats.avgSla, label: "".concat(departmentName, " SLA") }))),
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.dashboardCard },
                react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.cardHeader },
                    react_1.default.createElement("h2", null,
                        react_1.default.createElement(Lucide.ListTodo, { size: 16, style: { color: "#10b981" } }),
                        "Recruitment Progress Summary")),
                react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.candidateMetaGrid },
                    react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.metaItem },
                        react_1.default.createElement("span", { className: Dashboard_module_scss_1.default.metaLabel }, "Required Requisitions"),
                        react_1.default.createElement("span", { className: Dashboard_module_scss_1.default.metaVal },
                            stats.required,
                            " Positions")),
                    react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.metaItem },
                        react_1.default.createElement("span", { className: Dashboard_module_scss_1.default.metaLabel }, "Filled (Onboarded)"),
                        react_1.default.createElement("span", { className: Dashboard_module_scss_1.default.metaVal },
                            stats.filled,
                            " Candidates")),
                    react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.metaItem },
                        react_1.default.createElement("span", { className: Dashboard_module_scss_1.default.metaLabel }, "Recruitment Progress"),
                        react_1.default.createElement("span", { className: Dashboard_module_scss_1.default.metaVal },
                            stats.required > 0 ? Math.round((stats.filled / stats.required) * 100) : 0,
                            "% Completed")),
                    react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.metaItem },
                        react_1.default.createElement("span", { className: Dashboard_module_scss_1.default.metaLabel }, "Assigned Candidates"),
                        react_1.default.createElement("span", { className: Dashboard_module_scss_1.default.metaVal },
                            stats.candidates,
                            " Applicants"))))),
        react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.tableSection },
            react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.dashboardCard },
                react_1.default.createElement("div", { className: Dashboard_module_scss_1.default.cardHeader },
                    react_1.default.createElement("h2", null,
                        react_1.default.createElement(Lucide.TableProperties, { size: 16, style: { color: "#2563eb" } }),
                        "Department Vacancy Summary")),
                loading ? (react_1.default.createElement("div", { style: { padding: "40px", textAlign: "center" } }, "Loading department database...")) : (react_1.default.createElement(ContractAllocationTable_1.default, { contracts: deptContracts }))))));
};
exports.DepartmentManagerDashboard = DepartmentManagerDashboard;
exports.default = exports.DepartmentManagerDashboard;
//# sourceMappingURL=DepartmentManagerDashboard.js.map