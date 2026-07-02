"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HRSummaryCards = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var Lucide = tslib_1.__importStar(require("lucide-react"));
var HRSummaryCards_module_scss_1 = tslib_1.__importDefault(require("./HRSummaryCards.module.scss"));
var Card_1 = tslib_1.__importDefault(require("../Common/Card"));
var HRSummaryCards = function (_a) {
    var summary = _a.summary, _b = _a.loading, loading = _b === void 0 ? false : _b;
    if (loading || !summary) {
        return (react_1.default.createElement("div", { className: HRSummaryCards_module_scss_1.default.grid }, Array.from({ length: 6 }).map(function (_, idx) { return (react_1.default.createElement(Card_1.default, { key: idx, className: HRSummaryCards_module_scss_1.default.summaryCard },
            react_1.default.createElement("div", { className: HRSummaryCards_module_scss_1.default.header },
                react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "32px", height: "32px", borderRadius: "8px" } }),
                react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "110px", height: "12px", marginLeft: "12px" } })),
            react_1.default.createElement("div", { className: HRSummaryCards_module_scss_1.default.body, style: { marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" } },
                react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "50px", height: "28px" } }),
                react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "100px", height: "10px" } })))); })));
    }
    var cardsData = [
        {
            id: "open",
            title: "My Open Positions",
            value: summary.myOpenPositions,
            trend: summary.myOpenPositionsTrend,
            trendColor: summary.myOpenPositionsTrendColor,
            icon: react_1.default.createElement(Lucide.Compass, { size: 18, className: HRSummaryCards_module_scss_1.default.iconBlue }),
            iconWrapClass: HRSummaryCards_module_scss_1.default.iconWrapBlue,
        },
        {
            id: "filled",
            title: "My Filled Positions",
            value: summary.myFilledPositions,
            trend: summary.myFilledPositionsTrend,
            trendColor: summary.myFilledPositionsTrendColor,
            icon: react_1.default.createElement(Lucide.FolderCheck, { size: 18, className: HRSummaryCards_module_scss_1.default.iconGreen }),
            iconWrapClass: HRSummaryCards_module_scss_1.default.iconWrapGreen,
        },
        {
            id: "total",
            title: "My Total Positions",
            value: summary.myTotalPositions,
            trend: summary.myTotalPositionsTrend,
            trendColor: "primary",
            icon: react_1.default.createElement(Lucide.CalendarDays, { size: 18, className: HRSummaryCards_module_scss_1.default.iconBlue }),
            iconWrapClass: HRSummaryCards_module_scss_1.default.iconWrapBlue,
        },
        {
            id: "candidates",
            title: "Active Candidates",
            value: summary.activeCandidates,
            trend: summary.activeCandidatesTrend,
            trendColor: "primary",
            icon: react_1.default.createElement(Lucide.UserCheck, { size: 18, className: HRSummaryCards_module_scss_1.default.iconBlue }),
            iconWrapClass: HRSummaryCards_module_scss_1.default.iconWrapBlue,
        },
        {
            id: "tasks",
            title: "Tasks Pending",
            value: summary.tasksPending,
            trend: summary.tasksPendingTrend,
            trendColor: summary.tasksPendingTrendColor,
            icon: react_1.default.createElement(Lucide.FileText, { size: 18, className: HRSummaryCards_module_scss_1.default.iconOrange }),
            iconWrapClass: HRSummaryCards_module_scss_1.default.iconWrapOrange,
        },
        {
            id: "interviews",
            title: "Interviews This Month",
            value: summary.interviewsThisMonth,
            trend: summary.interviewsThisMonthTrend,
            trendColor: "primary",
            icon: react_1.default.createElement(Lucide.CalendarClock, { size: 18, className: HRSummaryCards_module_scss_1.default.iconBlue }),
            iconWrapClass: HRSummaryCards_module_scss_1.default.iconWrapBlue,
        },
    ];
    return (react_1.default.createElement("div", { className: HRSummaryCards_module_scss_1.default.grid }, cardsData.map(function (card) {
        var trendClass = HRSummaryCards_module_scss_1.default.trendNeutral;
        if (card.trendColor === "success")
            trendClass = HRSummaryCards_module_scss_1.default.trendSuccess;
        else if (card.trendColor === "danger")
            trendClass = HRSummaryCards_module_scss_1.default.trendDanger;
        else if (card.trendColor === "warning")
            trendClass = HRSummaryCards_module_scss_1.default.trendWarning;
        else if (card.trendColor === "primary")
            trendClass = HRSummaryCards_module_scss_1.default.trendPrimary;
        return (react_1.default.createElement(Card_1.default, { key: card.id, className: HRSummaryCards_module_scss_1.default.summaryCard, hoverable: true },
            react_1.default.createElement("div", { className: HRSummaryCards_module_scss_1.default.header },
                react_1.default.createElement("div", { className: "".concat(HRSummaryCards_module_scss_1.default.iconWrap, " ").concat(card.iconWrapClass) }, card.icon),
                react_1.default.createElement("span", { className: HRSummaryCards_module_scss_1.default.title }, card.title)),
            react_1.default.createElement("div", { className: HRSummaryCards_module_scss_1.default.body },
                react_1.default.createElement("span", { className: HRSummaryCards_module_scss_1.default.value }, card.value),
                react_1.default.createElement("span", { className: "".concat(HRSummaryCards_module_scss_1.default.trend, " ").concat(trendClass) }, card.trend))));
    })));
};
exports.HRSummaryCards = HRSummaryCards;
exports.default = exports.HRSummaryCards;
//# sourceMappingURL=HRSummaryCards.js.map