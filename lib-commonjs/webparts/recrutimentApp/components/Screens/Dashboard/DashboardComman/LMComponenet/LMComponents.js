"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickActions = exports.TeamStatusOverview = exports.MyTeamTasks = exports.MyTeamPositions = exports.TeamHeadcountTrend = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var Lucide = tslib_1.__importStar(require("lucide-react"));
var recharts_1 = require("recharts");
var LMComponents_module_scss_1 = tslib_1.__importDefault(require("./LMComponents.module.scss"));
var TeamHeadcountTrend = function (_a) {
    var data = _a.data, loading = _a.loading;
    if (loading || !data) {
        return (react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.card },
            react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.header },
                react_1.default.createElement(Lucide.TrendingUp, { size: 16, className: LMComponents_module_scss_1.default.iconBlue }),
                react_1.default.createElement("h3", { className: LMComponents_module_scss_1.default.title }, "My Team Headcount Trend")),
            react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.skeletonChart })));
    }
    return (react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.card },
        react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.header },
            react_1.default.createElement(Lucide.TrendingUp, { size: 16, className: LMComponents_module_scss_1.default.iconBlue }),
            react_1.default.createElement("h3", { className: LMComponents_module_scss_1.default.title }, "My Team Headcount Trend")),
        react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.chartWrapper },
            react_1.default.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: 220 },
                react_1.default.createElement(recharts_1.BarChart, { data: data, margin: { top: 10, right: 10, left: -25, bottom: 0 } },
                    react_1.default.createElement(recharts_1.CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f5f9" }),
                    react_1.default.createElement(recharts_1.XAxis, { dataKey: "month", tick: { fontSize: 10 } }),
                    react_1.default.createElement(recharts_1.YAxis, { tick: { fontSize: 10 } }),
                    react_1.default.createElement(recharts_1.Tooltip, { cursor: { fill: "rgba(0, 0, 0, 0.02)" } }),
                    react_1.default.createElement(recharts_1.Bar, { dataKey: "headcount", fill: "#2563eb", radius: [4, 4, 0, 0], barSize: 24 }))))));
};
exports.TeamHeadcountTrend = TeamHeadcountTrend;
var MyTeamPositions = function (_a) {
    var data = _a.data, loading = _a.loading;
    if (loading || !data) {
        return (react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.card },
            react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.header },
                react_1.default.createElement(Lucide.Briefcase, { size: 16, className: LMComponents_module_scss_1.default.iconBlue }),
                react_1.default.createElement("h3", { className: LMComponents_module_scss_1.default.title }, "My Team Positions")),
            react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.skeletonTable }, Array.from({ length: 4 }).map(function (_, i) { return (react_1.default.createElement("div", { key: i, className: "dashboard-skeleton__bar", style: { width: "100%", height: "14px", marginBottom: "12px" } })); }))));
    }
    return (react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.card },
        react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.header },
            react_1.default.createElement(Lucide.Briefcase, { size: 16, className: LMComponents_module_scss_1.default.iconBlue }),
            react_1.default.createElement("h3", { className: LMComponents_module_scss_1.default.title }, "My Team Positions")),
        react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.tableWrapper },
            react_1.default.createElement("table", { className: LMComponents_module_scss_1.default.table },
                react_1.default.createElement("thead", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("th", { style: { textAlign: "left" } }, "Job Role"),
                        react_1.default.createElement("th", null, "Total"),
                        react_1.default.createElement("th", null, "Filled"),
                        react_1.default.createElement("th", null, "Open"),
                        react_1.default.createElement("th", null, "% Filled"))),
                react_1.default.createElement("tbody", null, data.map(function (item, idx) { return (react_1.default.createElement("tr", { key: idx },
                    react_1.default.createElement("td", { style: { textAlign: "left", fontWeight: 600 } }, item.jobRole),
                    react_1.default.createElement("td", null, item.total),
                    react_1.default.createElement("td", null, item.filled),
                    react_1.default.createElement("td", null, item.open),
                    react_1.default.createElement("td", null,
                        react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.progressContainer },
                            react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.progressBar, style: { width: "".concat(item.percentage, "%") } }),
                            react_1.default.createElement("span", { className: LMComponents_module_scss_1.default.progressText },
                                item.percentage,
                                "%"))))); })))),
        react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.cardFooter },
            react_1.default.createElement("a", { href: "#/positions", className: LMComponents_module_scss_1.default.link }, "View all positions"))));
};
exports.MyTeamPositions = MyTeamPositions;
var MyTeamTasks = function (_a) {
    var data = _a.data, loading = _a.loading;
    if (loading || !data) {
        return (react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.card },
            react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.header },
                react_1.default.createElement(Lucide.CheckSquare, { size: 16, className: LMComponents_module_scss_1.default.iconBlue }),
                react_1.default.createElement("h3", { className: LMComponents_module_scss_1.default.title }, "My Team Tasks")),
            react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.skeletonTable }, Array.from({ length: 4 }).map(function (_, i) { return (react_1.default.createElement("div", { key: i, className: "dashboard-skeleton__bar", style: { width: "100%", height: "14px", marginBottom: "12px" } })); }))));
    }
    return (react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.card },
        react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.header },
            react_1.default.createElement(Lucide.CheckSquare, { size: 16, className: LMComponents_module_scss_1.default.iconBlue }),
            react_1.default.createElement("h3", { className: LMComponents_module_scss_1.default.title }, "My Team Tasks")),
        react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.tableWrapper },
            react_1.default.createElement("table", { className: LMComponents_module_scss_1.default.table },
                react_1.default.createElement("thead", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("th", { style: { textAlign: "left" } }, "Task"),
                        react_1.default.createElement("th", null, "Due Date"),
                        react_1.default.createElement("th", null, "Status"))),
                react_1.default.createElement("tbody", null, data.map(function (item) {
                    var statusClass = LMComponents_module_scss_1.default.badgeGrey;
                    if (item.status === "Pending")
                        statusClass = LMComponents_module_scss_1.default.badgeOrange;
                    else if (item.status === "In Progress")
                        statusClass = LMComponents_module_scss_1.default.badgeBlue;
                    return (react_1.default.createElement("tr", { key: item.id },
                        react_1.default.createElement("td", { style: { textAlign: "left", fontWeight: 600 } }, item.task),
                        react_1.default.createElement("td", null, item.dueDate),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement("span", { className: "".concat(LMComponents_module_scss_1.default.badge, " ").concat(statusClass) }, item.status))));
                })))),
        react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.cardFooter },
            react_1.default.createElement("a", { href: "#/tasks", className: LMComponents_module_scss_1.default.link }, "View all tasks"))));
};
exports.MyTeamTasks = MyTeamTasks;
var TeamStatusOverview = function (_a) {
    var data = _a.data, loading = _a.loading;
    var total = react_1.default.useMemo(function () {
        return data ? data.reduce(function (sum, item) { return sum + item.count; }, 0) : 0;
    }, [data]);
    if (loading || !data) {
        return (react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.card },
            react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.header },
                react_1.default.createElement(Lucide.PieChart, { size: 16, className: LMComponents_module_scss_1.default.iconBlue }),
                react_1.default.createElement("h3", { className: LMComponents_module_scss_1.default.title }, "Team Status Overview")),
            react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.skeletonDonut })));
    }
    return (react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.card },
        react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.header },
            react_1.default.createElement(Lucide.PieChart, { size: 16, className: LMComponents_module_scss_1.default.iconBlue }),
            react_1.default.createElement("h3", { className: LMComponents_module_scss_1.default.title }, "Team Status Overview")),
        react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.donutBody },
            react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.donutVisual },
                react_1.default.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: "100%" },
                    react_1.default.createElement(recharts_1.PieChart, { margin: { top: 0, right: 0, left: 0, bottom: 0 } },
                        react_1.default.createElement(recharts_1.Pie, { data: data, innerRadius: 36, outerRadius: 50, paddingAngle: 4, dataKey: "count" }, data.map(function (entry, index) { return (react_1.default.createElement(recharts_1.Cell, { key: "cell-".concat(index), fill: entry.color })); })))),
                react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.donutCenter },
                    react_1.default.createElement("span", { className: LMComponents_module_scss_1.default.donutCenterVal }, total),
                    react_1.default.createElement("span", { className: LMComponents_module_scss_1.default.donutCenterLabel }, "TOTAL"))),
            react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.donutLegend }, data.map(function (item, index) { return (react_1.default.createElement("div", { key: index, className: LMComponents_module_scss_1.default.legendRow },
                react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.legendLeft },
                    react_1.default.createElement("span", { className: LMComponents_module_scss_1.default.dot, style: { backgroundColor: item.color } }),
                    react_1.default.createElement("span", { className: LMComponents_module_scss_1.default.legendName }, item.name)),
                react_1.default.createElement("span", { className: LMComponents_module_scss_1.default.legendCount },
                    item.count,
                    " (",
                    item.percentage,
                    "%)"))); }))),
        react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.cardFooter },
            react_1.default.createElement("a", { href: "#/team", className: LMComponents_module_scss_1.default.link }, "View team details"))));
};
exports.TeamStatusOverview = TeamStatusOverview;
var QuickActions = function (_a) {
    var loading = _a.loading;
    if (loading) {
        return (react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.card },
            react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.header },
                react_1.default.createElement(Lucide.Sliders, { size: 16, className: LMComponents_module_scss_1.default.iconBlue }),
                react_1.default.createElement("h3", { className: LMComponents_module_scss_1.default.title }, "Quick Actions")),
            react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.skeletonTable }, Array.from({ length: 4 }).map(function (_, i) { return (react_1.default.createElement("div", { key: i, className: "dashboard-skeleton__bar", style: { width: "100%", height: "35px", marginBottom: "8px", borderRadius: "6px" } })); }))));
    }
    var actions = [
        { title: "Request New Position", icon: react_1.default.createElement(Lucide.PlusCircle, { size: 14 }), href: "#/request-position" },
        { title: "Add Team Member", icon: react_1.default.createElement(Lucide.UserPlus, { size: 14 }), href: "#/add-member" },
        { title: "Schedule Interview", icon: react_1.default.createElement(Lucide.CalendarDays, { size: 14 }), href: "#/schedule-interview" },
        { title: "Assign Task", icon: react_1.default.createElement(Lucide.FileSpreadsheet, { size: 14 }), href: "#/assign-task" }
    ];
    return (react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.card },
        react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.header },
            react_1.default.createElement(Lucide.Sliders, { size: 16, className: LMComponents_module_scss_1.default.iconBlue }),
            react_1.default.createElement("h3", { className: LMComponents_module_scss_1.default.title }, "Quick Actions")),
        react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.actionsList }, actions.map(function (act, index) { return (react_1.default.createElement("a", { key: index, href: act.href, className: LMComponents_module_scss_1.default.actionItem },
            act.icon,
            react_1.default.createElement("span", null, act.title))); })),
        react_1.default.createElement("div", { className: LMComponents_module_scss_1.default.cardFooter },
            react_1.default.createElement("a", { href: "#/actions", className: LMComponents_module_scss_1.default.link }, "View all actions"))));
};
exports.QuickActions = QuickActions;
//# sourceMappingURL=LMComponents.js.map