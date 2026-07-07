"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineManagerDashboard = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var LineManagerDashboard_module_scss_1 = tslib_1.__importDefault(require("./LineManagerDashboard.module.scss"));
var Lucide = tslib_1.__importStar(require("lucide-react"));
var framer_motion_1 = require("framer-motion");
var Dashboard_1 = require("../../Dashboard");
var matric_1 = tslib_1.__importDefault(require("../../../../Comman/MatricBox/matric"));
var useLMDashbaord_1 = tslib_1.__importDefault(require("../../Hooks/useLMDashbaord"));
var CommonSummaryCards_1 = tslib_1.__importDefault(require("../../DashboardComman/CommonSummaryCards"));
var LMComponents_1 = require("../../DashboardComman/LMComponenet/LMComponents");
var LineManagerDashboard = function (_a) {
    var userName = _a.userName, metrics = _a.metrics, onCardClick = _a.onCardClick, loading = _a.loading, handleRefresh = _a.handleRefresh, active = _a.active;
    var _b = (0, useLMDashbaord_1.default)(), data = _b.data, lmLoading = _b.loading, lmRefresh = _b.refresh;
    var isDashboardLoading = loading || lmLoading;
    var summaryCardsData = (0, react_1.useMemo)(function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        if (!(data === null || data === void 0 ? void 0 : data.summary))
            return [];
        return [
            {
                id: "team_members",
                title: "My Team Members",
                value: (_a = data.summary.myTeamMembers) !== null && _a !== void 0 ? _a : 0,
                trendText: (_b = data.summary.myTeamMembersTrend) !== null && _b !== void 0 ? _b : "",
                trendType: ((_c = data.summary.myTeamMembersTrendColor) !== null && _c !== void 0 ? _c : "neutral"),
                iconName: "Users"
            },
            {
                id: "open_positions",
                title: "Open Positions (My Team)",
                value: (_d = data.summary.openPositionsMyTeam) !== null && _d !== void 0 ? _d : 0,
                trendText: (_e = data.summary.openPositionsMyTeamTrend) !== null && _e !== void 0 ? _e : "",
                trendType: ((_f = data.summary.openPositionsMyTeamTrendColor) !== null && _f !== void 0 ? _f : "neutral"),
                iconName: "Briefcase"
            },
            {
                id: "tasks_pending",
                title: "Tasks Pending",
                value: (_g = data.summary.tasksPending) !== null && _g !== void 0 ? _g : 0,
                trendText: (_h = data.summary.tasksPendingTrend) !== null && _h !== void 0 ? _h : "",
                trendType: ((_j = data.summary.tasksPendingTrendColor) !== null && _j !== void 0 ? _j : "neutral"),
                iconName: "CheckSquare"
            },
            {
                id: "leave_requests",
                title: "Leave Requests",
                value: (_k = data.summary.leaveRequests) !== null && _k !== void 0 ? _k : 0,
                trendText: (_l = data.summary.leaveRequestsTrend) !== null && _l !== void 0 ? _l : "",
                trendType: ((_m = data.summary.leaveRequestsTrendColor) !== null && _m !== void 0 ? _m : "neutral"),
                iconName: "FileText"
            },
            {
                id: "performance_reviews",
                title: "Performance Reviews",
                value: (_o = data.summary.performanceReviews) !== null && _o !== void 0 ? _o : 0,
                trendText: (_p = data.summary.performanceReviewsTrend) !== null && _p !== void 0 ? _p : "",
                trendType: ((_q = data.summary.performanceReviewsTrendColor) !== null && _q !== void 0 ? _q : "neutral"),
                iconName: "UserCheck"
            },
            {
                id: "upcoming_interviews",
                title: "Upcoming Interviews",
                value: (_r = data.summary.upcomingInterviews) !== null && _r !== void 0 ? _r : 0,
                trendText: (_s = data.summary.upcomingInterviewsTrend) !== null && _s !== void 0 ? _s : "",
                trendType: ((_t = data.summary.upcomingInterviewsTrendColor) !== null && _t !== void 0 ? _t : "neutral"),
                iconName: "CalendarDays"
            }
        ];
    }, [data === null || data === void 0 ? void 0 : data.summary]);
    return (react_1.default.createElement("div", { className: LineManagerDashboard_module_scss_1.default.dashboardContainer, "aria-label": "Line Manager Dashboard" },
        react_1.default.createElement(framer_motion_1.motion.div, { className: "metrics-grid", variants: Dashboard_1.metricsContainer, initial: "hidden", animate: "visible" },
            react_1.default.createElement(matric_1.default, { metrics: metrics, onCardClick: function (metric) { return onCardClick(metric); }, loading: loading, handleRefresh: handleRefresh, active: active })),
        react_1.default.createElement("div", { className: LineManagerDashboard_module_scss_1.default.refreshToolbar },
            react_1.default.createElement("button", { type: "button", className: LineManagerDashboard_module_scss_1.default.refreshBtn, onClick: function () {
                    handleRefresh();
                    lmRefresh();
                }, disabled: loading || lmLoading, "aria-label": "Refresh Dashboard Data" },
                react_1.default.createElement(Lucide.RefreshCw, { size: 13, className: (loading || lmLoading) ? LineManagerDashboard_module_scss_1.default.spin : undefined }),
                react_1.default.createElement("span", null, "Refresh Dashboard Data"))),
        react_1.default.createElement(CommonSummaryCards_1.default, { cards: summaryCardsData, loading: isDashboardLoading }),
        react_1.default.createElement("div", { className: LineManagerDashboard_module_scss_1.default.grid2 },
            react_1.default.createElement(LMComponents_1.TeamHeadcountTrend, { data: data === null || data === void 0 ? void 0 : data.teamHeadcountTrend, loading: isDashboardLoading }),
            react_1.default.createElement(LMComponents_1.MyTeamPositions, { data: data === null || data === void 0 ? void 0 : data.myTeamPositions, loading: isDashboardLoading })),
        react_1.default.createElement("div", { className: LineManagerDashboard_module_scss_1.default.grid3 },
            react_1.default.createElement(LMComponents_1.MyTeamTasks, { data: data === null || data === void 0 ? void 0 : data.myTeamTasks, loading: isDashboardLoading }),
            react_1.default.createElement(LMComponents_1.TeamStatusOverview, { data: data === null || data === void 0 ? void 0 : data.teamStatusOverview, loading: isDashboardLoading }),
            react_1.default.createElement(LMComponents_1.QuickActions, { loading: isDashboardLoading }))));
};
exports.LineManagerDashboard = LineManagerDashboard;
exports.default = exports.LineManagerDashboard;
//# sourceMappingURL=LineManagerDashboard.js.map