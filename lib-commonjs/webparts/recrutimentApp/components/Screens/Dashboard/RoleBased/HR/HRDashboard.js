"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HRDashboard = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var useContractAllocation_1 = tslib_1.__importDefault(require("../../Hooks/useContractAllocation"));
var recharts_1 = require("recharts");
var HRDashboard_module_scss_1 = tslib_1.__importDefault(require("./HRDashboard.module.scss"));
var Lucide = tslib_1.__importStar(require("lucide-react"));
var HRDashboard = function (_a) {
    var userName = _a.userName, roleSwitcher = _a.roleSwitcher, notificationCenter = _a.notificationCenter;
    var _b = (0, useContractAllocation_1.default)(), contracts = _b.data, loading = _b.loading;
    // Filter for Altkamoa01's contracts to match mock exactly
    var myContracts = (0, react_1.useMemo)(function () {
        if (!contracts)
            return [];
        return contracts.filter(function (c) { return c.assignedHR.toLowerCase() === "altkamoa01"; });
    }, [contracts]);
    // Aggregate stats
    var totals = (0, react_1.useMemo)(function () {
        var req = 0;
        var filled = 0;
        var candidates = 0;
        var overdue = 0;
        var atRisk = 0;
        myContracts.forEach(function (c) {
            req += c.requiredPositions;
            filled += c.filledPositions;
            candidates += c.candidateCount;
            if (c.slaStatus === "Overdue")
                overdue++;
            if (c.slaStatus === "At Risk")
                atRisk++;
        });
        return {
            assignedContracts: myContracts.length,
            requested: req,
            filled: filled,
            balance: req - filled,
            candidates: candidates,
            overdue: overdue,
            atRisk: atRisk
        };
    }, [myContracts]);
    // Donut 1: Positions Summary Data
    var positionsData = [
        { name: "Filled", value: 12, color: "#10b981", pct: "25.5%" },
        { name: "In Progress", value: 18, color: "#3b82f6", pct: "38.3%" },
        { name: "On Hold", value: 5, color: "#f59e0b", pct: "10.6%" },
        { name: "Not Started", value: 12, color: "#2563eb", pct: "25.5%" } // Darker blue to match mockup
    ];
    // Donut 2: SLA Overview Data
    var slaData = [
        { name: "On Track (> 90%)", value: 3, color: "#10b981", pct: "50.0%" },
        { name: "At Risk (70% - 89%)", value: 2, color: "#f59e0b", pct: "33.3%" },
        { name: "Overdue (< 70%)", value: 1, color: "#ef4444", pct: "16.7%" }
    ];
    // Bar 3: Candidate Stage Pipeline Data
    var pipelineData = [
        { name: "Sourced", value: 8 },
        { name: "Screening", value: 12 },
        { name: "Interview", value: 7 },
        { name: "Assessment", value: 6 },
        { name: "Offered", value: 5 }
    ];
    return (react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.container },
        react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.header },
            react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.welcome },
                react_1.default.createElement("h1", null,
                    "Welcome back, ",
                    react_1.default.createElement("span", null, "Altkamoa01"),
                    " \uD83D\uDC4B"),
                react_1.default.createElement("p", null, "Here's your recruitment overview")),
            react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.actions },
                roleSwitcher,
                notificationCenter,
                react_1.default.createElement("button", { className: HRDashboard_module_scss_1.default.datePill },
                    react_1.default.createElement(Lucide.Calendar, { size: 14 }),
                    react_1.default.createElement("span", null, "Today, 20 May 2025"),
                    react_1.default.createElement(Lucide.ChevronDown, { size: 12 })),
                react_1.default.createElement("button", { className: HRDashboard_module_scss_1.default.filterPill },
                    react_1.default.createElement(Lucide.Filter, { size: 14 }),
                    react_1.default.createElement("span", null, "My Assigned Contracts"),
                    react_1.default.createElement(Lucide.ChevronDown, { size: 12 })))),
        react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.kpiGrid },
            react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.kpiCard },
                react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.kpiTop },
                    react_1.default.createElement("div", { className: "".concat(HRDashboard_module_scss_1.default.iconWrap, " ").concat(HRDashboard_module_scss_1.default.iconBlue) },
                        react_1.default.createElement(Lucide.FileText, { size: 18 })),
                    react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.kpiMeta },
                        react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.kpiLabel }, "TOTAL ASSIGNED CONTRACTS"),
                        react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.kpiValue }, loading ? "..." : totals.assignedContracts))),
                react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.kpiLink }, "View all \u2794")),
            react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.kpiCard },
                react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.kpiTop },
                    react_1.default.createElement("div", { className: "".concat(HRDashboard_module_scss_1.default.iconWrap, " ").concat(HRDashboard_module_scss_1.default.iconGreen) },
                        react_1.default.createElement(Lucide.FileCheck, { size: 18 })),
                    react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.kpiMeta },
                        react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.kpiLabel }, "TOTAL POSITIONS REQUESTED"),
                        react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.kpiValue }, loading ? "..." : totals.requested))),
                react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.kpiLink }, "View details \u2794")),
            react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.kpiCard },
                react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.kpiTop },
                    react_1.default.createElement("div", { className: "".concat(HRDashboard_module_scss_1.default.iconWrap, " ").concat(HRDashboard_module_scss_1.default.iconBlue) },
                        react_1.default.createElement(Lucide.Users, { size: 18 })),
                    react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.kpiMeta },
                        react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.kpiLabel }, "TOTAL CANDIDATES"),
                        react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.kpiValue }, loading ? "..." : totals.candidates))),
                react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.kpiLink }, "View candidates \u2794")),
            react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.kpiCard },
                react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.kpiTop },
                    react_1.default.createElement("div", { className: "".concat(HRDashboard_module_scss_1.default.iconWrap, " ").concat(HRDashboard_module_scss_1.default.iconGreen) },
                        react_1.default.createElement(Lucide.CheckCircle2, { size: 18 })),
                    react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.kpiMeta },
                        react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.kpiLabel }, "POSITIONS FILLED"),
                        react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.kpiValue }, loading ? "..." : totals.filled))),
                react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.kpiLink }, "View filled \u2794")),
            react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.kpiCard },
                react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.kpiTop },
                    react_1.default.createElement("div", { className: "".concat(HRDashboard_module_scss_1.default.iconWrap, " ").concat(HRDashboard_module_scss_1.default.iconYellow) },
                        react_1.default.createElement(Lucide.Layers, { size: 18 })),
                    react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.kpiMeta },
                        react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.kpiLabel }, "POSITIONS BALANCE"),
                        react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.kpiValue }, loading ? "..." : totals.balance))),
                react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.kpiLink }, "View balance \u2794")),
            react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.kpiCard },
                react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.kpiTop },
                    react_1.default.createElement("div", { className: "".concat(HRDashboard_module_scss_1.default.iconWrap, " ").concat(HRDashboard_module_scss_1.default.iconRed) },
                        react_1.default.createElement(Lucide.Clock, { size: 18 })),
                    react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.kpiMeta },
                        react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.kpiLabel }, "SLA OVERDUE"),
                        react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.kpiValue, style: { color: "#ef4444" } }, loading ? "..." : 3))),
                react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.kpiLink, style: { color: "#ef4444" } }, "View overdue \u2794"))),
        react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.chartsGrid },
            react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.chartCard },
                react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.chartHeader },
                    react_1.default.createElement("h3", null, "POSITIONS SUMMARY")),
                react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.donutBody },
                    react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.donutContainer },
                        react_1.default.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: 150 },
                            react_1.default.createElement(recharts_1.PieChart, null,
                                react_1.default.createElement(recharts_1.Pie, { data: positionsData, innerRadius: 45, outerRadius: 60, paddingAngle: 3, dataKey: "value" }, positionsData.map(function (entry, index) { return (react_1.default.createElement(recharts_1.Cell, { key: "cell-".concat(index), fill: entry.color })); })))),
                        react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.donutCenter },
                            react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.donutVal }, totals.requested),
                            react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.donutLabel }, "Total Positions"))),
                    react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.donutLegend }, positionsData.map(function (item, idx) { return (react_1.default.createElement("div", { key: idx, className: HRDashboard_module_scss_1.default.legendRow },
                        react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.legendLeft },
                            react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.legendDot, style: { backgroundColor: item.color } }),
                            react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.legendName }, item.name)),
                        react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.legendVal },
                            item.value,
                            " (",
                            item.pct,
                            ")"))); }))),
                react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.bottomLink }, "View position tracker \u2794")),
            react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.chartCard },
                react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.chartHeader },
                    react_1.default.createElement("h3", null, "SLA OVERVIEW")),
                react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.donutBody },
                    react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.donutContainer },
                        react_1.default.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: 150 },
                            react_1.default.createElement(recharts_1.PieChart, null,
                                react_1.default.createElement(recharts_1.Pie, { data: slaData, innerRadius: 45, outerRadius: 60, paddingAngle: 3, dataKey: "value" }, slaData.map(function (entry, index) { return (react_1.default.createElement(recharts_1.Cell, { key: "cell-".concat(index), fill: entry.color })); })))),
                        react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.donutCenter },
                            react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.donutVal, style: { color: "#f59e0b" } }, "3"),
                            react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.donutLabel }, "Overdue"))),
                    react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.donutLegend }, slaData.map(function (item, idx) { return (react_1.default.createElement("div", { key: idx, className: HRDashboard_module_scss_1.default.legendRow },
                        react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.legendLeft },
                            react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.legendDot, style: { backgroundColor: item.color } }),
                            react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.legendName }, item.name)),
                        react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.legendVal },
                            item.value,
                            " (",
                            item.pct,
                            ")"))); }))),
                react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.bottomLink }, "View SLA details \u2794")),
            react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.chartCard },
                react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.chartHeader },
                    react_1.default.createElement("h3", null, "CANDIDATE STAGE PIPELINE")),
                react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.barBody },
                    react_1.default.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: 150 },
                        react_1.default.createElement(recharts_1.BarChart, { data: pipelineData, margin: { top: 10, right: 10, left: -25, bottom: 0 } },
                            react_1.default.createElement(recharts_1.XAxis, { dataKey: "name", tickLine: false, axisLine: false, tick: { fill: "#64748b", fontSize: 10 } }),
                            react_1.default.createElement(recharts_1.YAxis, { tickLine: false, axisLine: false, tick: { fill: "#64748b", fontSize: 10 }, domain: [0, 20] }),
                            react_1.default.createElement(recharts_1.Tooltip, null),
                            react_1.default.createElement(recharts_1.Bar, { dataKey: "value", fill: "#2563eb", radius: [4, 4, 0, 0], barSize: 24 })))),
                react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.bottomLink }, "View all candidates \u2794"))),
        react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.summaryBanner },
            react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.summaryHeader },
                react_1.default.createElement("h3", null, "MY CONTRACT SUMMARY")),
            react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.summaryGrid },
                react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.summaryItem },
                    react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.summaryLabel }, "My Role"),
                    react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.summaryValue, style: { color: "#1e3a8a", fontWeight: 700 } }, "HR - Senior Management")),
                react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.summaryItem },
                    react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.summaryLabel }, "Assigned Contracts"),
                    react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.summaryValue }, totals.assignedContracts)),
                react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.summaryItem },
                    react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.summaryLabel }, "Total Positions"),
                    react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.summaryValue }, totals.requested)),
                react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.summaryItem },
                    react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.summaryLabel }, "Candidates in Process"),
                    react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.summaryValue }, totals.candidates)),
                react_1.default.createElement("div", { className: "".concat(HRDashboard_module_scss_1.default.summaryItem, " ").concat(HRDashboard_module_scss_1.default.summaryItemAlert) },
                    react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.summaryLabel, style: { color: "#b91c1c" } }, "SLA Overdue Contracts"),
                    react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.summaryValue, style: { color: "#ef4444" } }, "3")),
                react_1.default.createElement("div", { className: "".concat(HRDashboard_module_scss_1.default.summaryItem, " ").concat(HRDashboard_module_scss_1.default.summaryItemAlert) },
                    react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.summaryLabel, style: { color: "#b91c1c" } }, "Positions at Risk"),
                    react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.summaryValue, style: { color: "#ef4444" } }, "6")))),
        react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.tableCard },
            react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.tableHeader },
                react_1.default.createElement("h3", null, "MY ASSIGNED CONTRACTS")),
            react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.tableWrapper },
                react_1.default.createElement("table", { className: HRDashboard_module_scss_1.default.table },
                    react_1.default.createElement("thead", null,
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", null, "CONTRACT NAME & ID"),
                            react_1.default.createElement("th", null, "DEPARTMENT"),
                            react_1.default.createElement("th", { style: { textAlign: "center" } }, "REQ."),
                            react_1.default.createElement("th", { style: { textAlign: "center" } }, "FILLED."),
                            react_1.default.createElement("th", { style: { textAlign: "center" } }, "BALANCE"),
                            react_1.default.createElement("th", { style: { textAlign: "center" } },
                                "CANDIDATES",
                                react_1.default.createElement("br", null),
                                "IN PROCESS"),
                            react_1.default.createElement("th", { style: { width: "120px" } }, "SLA PROGRESS"),
                            react_1.default.createElement("th", null, "SLA STATUS"),
                            react_1.default.createElement("th", null, "CONTRACT END DATE"),
                            react_1.default.createElement("th", null, "STATUS"),
                            react_1.default.createElement("th", null, "ACTIONS"))),
                    react_1.default.createElement("tbody", null, loading ? (react_1.default.createElement("tr", null,
                        react_1.default.createElement("td", { colSpan: 11, style: { textAlign: "center", padding: "40px", color: "#64748b" } }, "Loading contracts database..."))) : (myContracts.map(function (c) {
                        var badgeClass = HRDashboard_module_scss_1.default.badgeOnTrack;
                        if (c.slaStatus === "Overdue")
                            badgeClass = HRDashboard_module_scss_1.default.badgeOverdue;
                        else if (c.slaStatus === "At Risk")
                            badgeClass = HRDashboard_module_scss_1.default.badgeAtRisk;
                        var hasBalance = c.balance > 0;
                        var isOverdue = c.slaStatus === "Overdue";
                        return (react_1.default.createElement("tr", { key: c.id },
                            react_1.default.createElement("td", { style: { fontWeight: 600 } },
                                react_1.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px" } },
                                    react_1.default.createElement(Lucide.FileSpreadsheet, { size: 16, style: { color: "#3b82f6" } }),
                                    react_1.default.createElement("div", null,
                                        react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.contractName }, c.contractName),
                                        react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.contractId }, c.contractId)))),
                            react_1.default.createElement("td", null,
                                react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.deptBadge }, c.department)),
                            react_1.default.createElement("td", { style: { textAlign: "center", fontWeight: 600 } }, c.requiredPositions),
                            react_1.default.createElement("td", { style: { textAlign: "center", fontWeight: 600 } }, c.filledPositions),
                            react_1.default.createElement("td", { style: { textAlign: "center", fontWeight: 700, color: hasBalance ? "#ef4444" : "#1e293b" } }, c.balance),
                            react_1.default.createElement("td", { style: { textAlign: "center", fontWeight: 600 } }, c.candidateCount),
                            react_1.default.createElement("td", null,
                                react_1.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px" } },
                                    react_1.default.createElement("span", { style: { fontSize: "11px", fontWeight: 700, minWidth: "26px" } },
                                        c.slaProgress,
                                        "%"),
                                    react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.progBarBg },
                                        react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.progBarFill, style: {
                                                width: "".concat(c.slaProgress, "%"),
                                                backgroundColor: isOverdue ? "#ef4444" : (c.slaProgress >= 80 ? "#10b981" : "#f59e0b")
                                            } })))),
                            react_1.default.createElement("td", null,
                                react_1.default.createElement("span", { className: "".concat(HRDashboard_module_scss_1.default.badge, " ").concat(badgeClass) }, c.slaStatus)),
                            react_1.default.createElement("td", null,
                                react_1.default.createElement("div", { style: { fontWeight: 600 } }, c.endDate),
                                react_1.default.createElement("div", { style: { fontSize: "10px", color: isOverdue ? "#ef4444" : "#64748b", marginTop: "2px" } },
                                    c.remainingDays,
                                    " Days Left")),
                            react_1.default.createElement("td", null,
                                react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.badgeActive }, "Active")),
                            react_1.default.createElement("td", null,
                                react_1.default.createElement("div", { style: { display: "flex", alignItems: "center", gap: "6px" } },
                                    react_1.default.createElement("button", { className: HRDashboard_module_scss_1.default.viewBtn }, "View"),
                                    react_1.default.createElement("button", { className: HRDashboard_module_scss_1.default.moreBtn },
                                        react_1.default.createElement(Lucide.MoreVertical, { size: 14 }))))));
                    }))))),
            react_1.default.createElement("div", { className: HRDashboard_module_scss_1.default.tableFooter },
                react_1.default.createElement("span", null,
                    "Showing 1 to ",
                    myContracts.length,
                    " of ",
                    myContracts.length,
                    " contracts"),
                react_1.default.createElement("span", { className: HRDashboard_module_scss_1.default.footerLink }, "View all my contracts \u2794")))));
};
exports.HRDashboard = HRDashboard;
exports.default = exports.HRDashboard;
//# sourceMappingURL=HRDashboard.js.map