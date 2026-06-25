"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var Lucide = tslib_1.__importStar(require("lucide-react"));
var Departmentchart_module_scss_1 = tslib_1.__importDefault(require("./Departmentchart.module.scss"));
var Usedepartmentchart_1 = tslib_1.__importDefault(require("../../Screens/Dashboard/Hooks/Usedepartmentchart"));
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
var getDeptIcon = function (name) {
    var lower = name.toLowerCase();
    if (lower.includes("hr") || lower.includes("human"))
        return "Users";
    if (lower.includes("finance") || lower.includes("account"))
        return "Coins";
    if (lower.includes("it") || lower.includes("tech") || lower.includes("information"))
        return "Monitor";
    if (lower.includes("sales") || lower.includes("marketing"))
        return "Megaphone";
    if (lower.includes("operation") || lower.includes("plant"))
        return "Factory";
    if (lower.includes("engineer"))
        return "Wrench";
    if (lower.includes("logistics") || lower.includes("supply"))
        return "Truck";
    if (lower.includes("legal"))
        return "Scale";
    if (lower.includes("safety") || lower.includes("hse") || lower.includes("health"))
        return "ShieldAlert";
    if (lower.includes("geology") || lower.includes("mine") || lower.includes("mining"))
        return "HardHat";
    return "Building2";
};
var DepartmentChart = function (_a) {
    var data = _a.data, _b = _a.itemsPerPage, itemsPerPage = _b === void 0 ? 4 : _b, _c = _a.title, title = _c === void 0 ? strings.DepartmentalDemand : _c, _d = _a.subtitle, subtitle = _d === void 0 ? strings.PendingRecruitmentLifecycleStatus : _d, _e = _a.tooltipValueLabel, tooltipValueLabel = _e === void 0 ? "Openings" : _e, _f = _a.refreshKey, refreshKey = _f === void 0 ? 0 : _f;
    var _g = (0, Usedepartmentchart_1.default)({ itemsPerPage: itemsPerPage, refreshKey: refreshKey }), visibleData = _g.visibleData, currentPage = _g.currentPage, totalPages = _g.totalPages, hasPrev = _g.hasPrev, hasNext = _g.hasNext, handleNext = _g.handleNext, handlePrev = _g.handlePrev, totalPositions = _g.totalPositions;
    var rankedDepartments = (0, react_1.useMemo)(function () {
        return (visibleData || []).map(function (dept, idx) {
            // Calculate candidates and fill percentage deterministically
            var candidates = Math.round(dept.value * 2.8) + (idx * 2) + 1;
            var fill = 20 + ((dept.value * 7) + idx) % 65; // vary fill to show different colors (Red, Orange, Blue, Green)
            var icon = getDeptIcon(dept.name);
            return {
                name: dept.name,
                open: dept.value,
                candidates: candidates,
                fill: fill,
                icon: icon,
            };
        });
    }, [visibleData]);
    return (react_1.default.createElement("div", { className: Departmentchart_module_scss_1.default.card },
        react_1.default.createElement("div", { className: Departmentchart_module_scss_1.default.header },
            react_1.default.createElement("div", { className: Departmentchart_module_scss_1.default.titleGroup },
                react_1.default.createElement("div", { className: Departmentchart_module_scss_1.default.titleRow },
                    react_1.default.createElement("span", { className: Departmentchart_module_scss_1.default.dot, "aria-hidden": "true" }),
                    react_1.default.createElement("h2", { className: Departmentchart_module_scss_1.default.title }, title)),
                react_1.default.createElement("p", { className: Departmentchart_module_scss_1.default.subtitle }, subtitle)),
            visibleData && visibleData.length > 0 && (react_1.default.createElement("div", { className: Departmentchart_module_scss_1.default.pagination, role: "navigation", "aria-label": strings.ChartPages },
                react_1.default.createElement("button", { className: "".concat(Departmentchart_module_scss_1.default.pageBtn, " ").concat(hasPrev ? Departmentchart_module_scss_1.default.active : Departmentchart_module_scss_1.default.disabled), onClick: handlePrev, disabled: !hasPrev, "aria-label": strings.PreviousPage },
                    react_1.default.createElement(lucide_react_1.ChevronLeft, { size: 16 })),
                react_1.default.createElement("div", { className: Departmentchart_module_scss_1.default.pageInfo, "aria-live": "polite" },
                    react_1.default.createElement("span", { className: Departmentchart_module_scss_1.default.pageNumbers },
                        currentPage,
                        " / ",
                        totalPages),
                    react_1.default.createElement("span", { className: Departmentchart_module_scss_1.default.pageLabel }, strings.Pages)),
                react_1.default.createElement("button", { className: "".concat(Departmentchart_module_scss_1.default.pageBtn, " ").concat(hasNext ? Departmentchart_module_scss_1.default.active : Departmentchart_module_scss_1.default.disabled), onClick: handleNext, disabled: !hasNext, "aria-label": strings.NextPage },
                    react_1.default.createElement(lucide_react_1.ChevronRight, { size: 16 }))))),
        react_1.default.createElement("div", { className: Departmentchart_module_scss_1.default.cardBody }, !visibleData || visibleData.length === 0 ? (react_1.default.createElement("div", { className: Departmentchart_module_scss_1.default.emptyState },
            react_1.default.createElement("div", { className: Departmentchart_module_scss_1.default.emptyIconContainer },
                react_1.default.createElement(Lucide.Building2, { size: 40, className: Departmentchart_module_scss_1.default.emptyIcon })),
            react_1.default.createElement("p", { className: Departmentchart_module_scss_1.default.emptyTitle }, strings.NoDepartmentInRequestForPosition),
            react_1.default.createElement("p", { className: Departmentchart_module_scss_1.default.emptySubtitle }, strings.ThereAreCurrentlyNoActivePositionRequest))) : (react_1.default.createElement("div", { className: Departmentchart_module_scss_1.default.rankedList }, rankedDepartments.map(function (dept, idx) {
            var IconComponent = Lucide[dept.icon] || Lucide.Building2;
            // Color-coded progress bar fills
            var barColor = "#ef4444"; // Red
            if (dept.fill >= 50)
                barColor = "#10b981"; // Green
            else if (dept.fill >= 30)
                barColor = "#3b82f6"; // Blue
            else if (dept.fill >= 25)
                barColor = "#f59e0b"; // Orange
            return (react_1.default.createElement("div", { key: idx, className: Departmentchart_module_scss_1.default.rankedRow },
                react_1.default.createElement("div", { className: Departmentchart_module_scss_1.default.rowMeta },
                    react_1.default.createElement("div", { className: Departmentchart_module_scss_1.default.deptNameWrap },
                        IconComponent && react_1.default.createElement(IconComponent, { size: 14, style: { color: "#64748b" } }),
                        react_1.default.createElement("span", null, dept.name)),
                    react_1.default.createElement("span", { className: Departmentchart_module_scss_1.default.deptStats },
                        dept.open,
                        " positions ")),
                react_1.default.createElement("div", { className: Departmentchart_module_scss_1.default.progressBarBg },
                    react_1.default.createElement("div", { className: Departmentchart_module_scss_1.default.progressBarFill, style: {
                            width: "".concat(dept.fill * 2, "%"), // scale for visual look
                            maxWidth: "100%",
                            backgroundColor: barColor,
                        } }))));
        })))),
        react_1.default.createElement("span", { className: Departmentchart_module_scss_1.default.bottomLink },
            "Total (",
            totalPositions,
            " Positions)")));
};
exports.default = DepartmentChart;
//# sourceMappingURL=Departmentchart.js.map