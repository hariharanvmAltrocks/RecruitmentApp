"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummaryCards = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var Lucide = tslib_1.__importStar(require("lucide-react"));
var SummaryCards_module_scss_1 = tslib_1.__importDefault(require("./SummaryCards.module.scss"));
var useKPICards_1 = tslib_1.__importDefault(require("../../Hooks/useKPICards"));
var SummaryCards = function () {
    var _a, _b;
    var kpiData = (0, useKPICards_1.default)().data;
    var totalPositions = 184;
    var activePositions = (_a = kpiData === null || kpiData === void 0 ? void 0 : kpiData.assignedContracts) !== null && _a !== void 0 ? _a : 92;
    var completedPositions = 8;
    var totalVacant = 184;
    var _c = react_1.default.useState(function () { return new Date(2026, 5, 1); }), selectedDate = _c[0], setSelectedDate = _c[1]; // Default: June 2026
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
    var dueThisMonth = react_1.default.useMemo(function () {
        var _a;
        var month = selectedDate.getMonth();
        var mockNumerators = {
            4: 32, // May
            5: 25, // June
            6: 18, // July
            7: 15, // August
            8: 22, // September
        };
        var numerator = (_a = mockNumerators[month]) !== null && _a !== void 0 ? _a : ((month * 5 + 11) % 30 + 5);
        return "".concat(numerator, " / ").concat(activePositions);
    }, [selectedDate, activePositions]);
    var overduePositions = (_b = kpiData === null || kpiData === void 0 ? void 0 : kpiData.overdueContracts) !== null && _b !== void 0 ? _b : 8;
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
                    react_1.default.createElement(Lucide.ChevronLeft, { size: 14 })),
                react_1.default.createElement("span", { className: SummaryCards_module_scss_1.default.cardTitle },
                    "DUE ",
                    monthName,
                    " MONTH"),
                react_1.default.createElement("button", { type: "button", className: SummaryCards_module_scss_1.default.navBtn, onClick: handleNextMonth, "aria-label": "Next Month" },
                    react_1.default.createElement(Lucide.ChevronRight, { size: 14 }))),
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