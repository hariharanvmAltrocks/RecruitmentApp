"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummaryCards = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var Lucide = tslib_1.__importStar(require("lucide-react"));
var SummaryCards_module_scss_1 = tslib_1.__importDefault(require("../DashboardComman/SummaryCards.module.scss"));
var SummaryCards = function (_a) {
    var _b, _c, _d, _e, _f;
    var data = _a.data, loading = _a.loading;
    var _g = react_1.default.useState(function () { return new Date(2026, 6, 1); }), selectedDate = _g[0], setSelectedDate = _g[1]; // Default: July 2026
    var handlePrevMonth = function () {
        setSelectedDate(function (prev) {
            var newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() - 1);
            return newDate;
        });
    };
    var handleNextMonth = function () {
        setSelectedDate(function (prev) {
            var newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + 1);
            return newDate;
        });
    };
    var monthName = react_1.default.useMemo(function () {
        return selectedDate.toLocaleString("default", { month: "long" }).toUpperCase();
    }, [selectedDate]);
    var monthAbbrs = {
        0: "Jan", 1: "Feb", 2: "Mar", 3: "Apr", 4: "May", 5: "June", 6: "July", 7: "Aug", 8: "Sep", 9: "Jan", 10: "Nov", 11: "Dec"
    };
    var dueThisMonth = react_1.default.useMemo(function () {
        if (!data || !data.Duemonth)
            return "0 / 0";
        var m = selectedDate.getMonth();
        var key = monthAbbrs[m] || "Jan";
        return data.Duemonth[key] || "0 / 0";
    }, [selectedDate, data]);
    var totalPositions = (_b = data === null || data === void 0 ? void 0 : data.TotalOpenPosition) !== null && _b !== void 0 ? _b : 0;
    var activePositions = (_c = data === null || data === void 0 ? void 0 : data.RecruitmentInProgress) !== null && _c !== void 0 ? _c : 0;
    var completedPositions = (_d = data === null || data === void 0 ? void 0 : data.Onboarding) !== null && _d !== void 0 ? _d : 0;
    var totalVacant = (_e = data === null || data === void 0 ? void 0 : data.OnemDocumentStage) !== null && _e !== void 0 ? _e : 0;
    var overduePositions = (_f = data === null || data === void 0 ? void 0 : data.OverDuePosition) !== null && _f !== void 0 ? _f : 0;
    if (loading) {
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("div", { className: SummaryCards_module_scss_1.default.overviewCard },
                react_1.default.createElement("div", { className: SummaryCards_module_scss_1.default.cardHeader },
                    react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "120px", height: "14px" } })),
                react_1.default.createElement("div", { className: SummaryCards_module_scss_1.default.overviewGrid }, Array.from({ length: 4 }).map(function (_, idx) { return (react_1.default.createElement("div", { key: idx, className: SummaryCards_module_scss_1.default.subCard, style: { borderStyle: "dashed", opacity: 0.7 } },
                    react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "80%", height: "10px", marginBottom: "8px" } }),
                    react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "40%", height: "24px" } }))); }))),
            react_1.default.createElement("div", { className: SummaryCards_module_scss_1.default.kpiCard },
                react_1.default.createElement("div", { className: SummaryCards_module_scss_1.default.cardHeaderWithNav },
                    react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "120px", height: "14px" } })),
                react_1.default.createElement("div", { className: SummaryCards_module_scss_1.default.kpiCardBody },
                    react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "38px", height: "38px", borderRadius: "8px", marginBottom: "8px" } }),
                    react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "60px", height: "24px", marginBottom: "6px" } }),
                    react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "50px", height: "10px" } }))),
            react_1.default.createElement("div", { className: SummaryCards_module_scss_1.default.kpiCard },
                react_1.default.createElement("div", { className: SummaryCards_module_scss_1.default.cardHeader },
                    react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "120px", height: "14px" } })),
                react_1.default.createElement("div", { className: SummaryCards_module_scss_1.default.kpiCardBody },
                    react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "38px", height: "38px", borderRadius: "8px", marginBottom: "8px" } }),
                    react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "60px", height: "24px", marginBottom: "6px" } }),
                    react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "50px", height: "10px" } })))));
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: SummaryCards_module_scss_1.default.overviewCard },
            react_1.default.createElement("div", { className: SummaryCards_module_scss_1.default.cardHeader },
                react_1.default.createElement(Lucide.TrendingUp, { size: 16, className: SummaryCards_module_scss_1.default.iconBlue }),
                react_1.default.createElement("span", { className: SummaryCards_module_scss_1.default.cardTitle }, "POSITIONS OVERVIEW")),
            react_1.default.createElement("div", { className: SummaryCards_module_scss_1.default.overviewGrid },
                react_1.default.createElement("div", { className: SummaryCards_module_scss_1.default.subCard },
                    react_1.default.createElement("span", { className: SummaryCards_module_scss_1.default.subCardLabel }, "TOTAL OPEN POSITIONS"),
                    react_1.default.createElement("span", { className: SummaryCards_module_scss_1.default.subCardValue }, totalPositions)),
                react_1.default.createElement("div", { className: SummaryCards_module_scss_1.default.subCard },
                    react_1.default.createElement("span", { className: SummaryCards_module_scss_1.default.subCardLabel }, "RECRUITMENT IN PROGRESS"),
                    react_1.default.createElement("span", { className: SummaryCards_module_scss_1.default.subCardValue }, activePositions)),
                react_1.default.createElement("div", { className: SummaryCards_module_scss_1.default.subCard },
                    react_1.default.createElement("span", { className: SummaryCards_module_scss_1.default.subCardLabel }, "ONBOARDED"),
                    react_1.default.createElement("span", { className: SummaryCards_module_scss_1.default.subCardValue }, completedPositions)),
                react_1.default.createElement("div", { className: SummaryCards_module_scss_1.default.subCard },
                    react_1.default.createElement("span", { className: SummaryCards_module_scss_1.default.subCardLabel }, "ONEM DOCUMENT STAGE"),
                    react_1.default.createElement("span", { className: SummaryCards_module_scss_1.default.subCardValue }, totalVacant)))),
        react_1.default.createElement("div", { className: SummaryCards_module_scss_1.default.kpiCard },
            react_1.default.createElement("div", { className: SummaryCards_module_scss_1.default.cardHeaderWithNav },
                react_1.default.createElement("button", { type: "button", className: SummaryCards_module_scss_1.default.navBtn, onClick: handlePrevMonth, "aria-label": "Previous Month" },
                    react_1.default.createElement(Lucide.ChevronLeft, { size: 16 })),
                react_1.default.createElement("span", { className: SummaryCards_module_scss_1.default.cardTitle },
                    "DUE ",
                    monthName,
                    " MONTH"),
                react_1.default.createElement("button", { type: "button", className: SummaryCards_module_scss_1.default.navBtn, onClick: handleNextMonth, "aria-label": "Next Month" },
                    react_1.default.createElement(Lucide.ChevronRight, { size: 16 }))),
            react_1.default.createElement("div", { className: SummaryCards_module_scss_1.default.kpiCardBody },
                react_1.default.createElement("div", { className: SummaryCards_module_scss_1.default.iconContainerGreen },
                    react_1.default.createElement(Lucide.CalendarDays, { size: 20 })),
                react_1.default.createElement("span", { className: SummaryCards_module_scss_1.default.kpiCardValue }, dueThisMonth),
                react_1.default.createElement("span", { className: SummaryCards_module_scss_1.default.kpiCardSubtitle }, "Positions"))),
        react_1.default.createElement("div", { className: SummaryCards_module_scss_1.default.kpiCard },
            react_1.default.createElement("div", { className: SummaryCards_module_scss_1.default.cardHeader },
                react_1.default.createElement("span", { className: SummaryCards_module_scss_1.default.cardTitle }, "OVERDUE POSITIONS")),
            react_1.default.createElement("div", { className: SummaryCards_module_scss_1.default.kpiCardBody },
                react_1.default.createElement("div", { className: SummaryCards_module_scss_1.default.iconContainerRed },
                    react_1.default.createElement(Lucide.AlertCircle, { size: 20 })),
                react_1.default.createElement("span", { className: SummaryCards_module_scss_1.default.kpiCardValue }, overduePositions),
                react_1.default.createElement("span", { className: SummaryCards_module_scss_1.default.kpiCardSubtitle }, "Positions")))));
};
exports.SummaryCards = SummaryCards;
exports.default = exports.SummaryCards;
//# sourceMappingURL=SummaryCards.js.map