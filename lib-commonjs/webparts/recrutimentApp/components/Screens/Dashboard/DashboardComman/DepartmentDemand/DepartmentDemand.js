"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentDemand = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var Lucide = tslib_1.__importStar(require("lucide-react"));
var DepartmentDemand_module_scss_1 = tslib_1.__importDefault(require("./DepartmentDemand.module.scss"));
var Usedepartmentchart_1 = tslib_1.__importDefault(require("../../Hooks/Usedepartmentchart"));
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
var DepartmentDemand = function (_a) {
    var _b = _a.itemsPerPage, itemsPerPage = _b === void 0 ? 4 : _b, _c = _a.title, title = _c === void 0 ? "Department Demand" : _c, _d = _a.subtitle, subtitle = _d === void 0 ? "Pending recruiting lifecycle status per business unit" : _d, _e = _a.refreshKey, refreshKey = _e === void 0 ? 0 : _e;
    var _f = (0, Usedepartmentchart_1.default)({ itemsPerPage: itemsPerPage, refreshKey: refreshKey }), visibleData = _f.visibleData, currentPage = _f.currentPage, totalPages = _f.totalPages, hasPrev = _f.hasPrev, hasNext = _f.hasNext, handleNext = _f.handleNext, handlePrev = _f.handlePrev, totalPositions = _f.totalPositions;
    var rankedDepartments = (0, react_1.useMemo)(function () {
        return (visibleData || []).map(function (dept, idx) {
            var candidates = Math.round(dept.value * 2.8) + (idx * 2) + 1;
            var fill = 20 + ((dept.value * 7) + idx) % 65; // vary fill to show different colors
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
    return (react_1.default.createElement("div", { className: DepartmentDemand_module_scss_1.default.deptCard, "aria-label": "Department Demand Statistics" },
        react_1.default.createElement("div", { className: DepartmentDemand_module_scss_1.default.deptCard__header },
            react_1.default.createElement("div", { className: DepartmentDemand_module_scss_1.default.deptCard__titleGroup },
                react_1.default.createElement("div", { className: DepartmentDemand_module_scss_1.default.deptCard__titleRow },
                    react_1.default.createElement("span", { className: DepartmentDemand_module_scss_1.default.deptCard__dot }),
                    react_1.default.createElement("h2", { className: DepartmentDemand_module_scss_1.default.deptCard__title }, title)),
                react_1.default.createElement("p", { className: DepartmentDemand_module_scss_1.default.deptCard__subtitle }, subtitle)),
            visibleData && visibleData.length > 0 && (react_1.default.createElement("div", { className: DepartmentDemand_module_scss_1.default.pagination, role: "navigation", "aria-label": "Chart navigation" },
                react_1.default.createElement("button", { className: "".concat(DepartmentDemand_module_scss_1.default.pagination__btn, " ").concat(hasPrev ? DepartmentDemand_module_scss_1.default["pagination__btn--active"] : DepartmentDemand_module_scss_1.default["pagination__btn--disabled"]), onClick: handlePrev, disabled: !hasPrev, "aria-label": "Previous page" },
                    react_1.default.createElement(Lucide.ChevronLeft, { size: 16 })),
                react_1.default.createElement("div", { className: DepartmentDemand_module_scss_1.default.pagination__info },
                    react_1.default.createElement("span", null,
                        currentPage,
                        " / ",
                        totalPages)),
                react_1.default.createElement("button", { className: "".concat(DepartmentDemand_module_scss_1.default.pagination__btn, " ").concat(hasNext ? DepartmentDemand_module_scss_1.default["pagination__btn--active"] : DepartmentDemand_module_scss_1.default["pagination__btn--disabled"]), onClick: handleNext, disabled: !hasNext, "aria-label": "Next page" },
                    react_1.default.createElement(Lucide.ChevronRight, { size: 16 }))))),
        react_1.default.createElement("div", { className: DepartmentDemand_module_scss_1.default.deptCard__body }, !visibleData || visibleData.length === 0 ? (react_1.default.createElement("div", { className: DepartmentDemand_module_scss_1.default.emptyState },
            react_1.default.createElement(Lucide.Building2, { size: 40, className: DepartmentDemand_module_scss_1.default.emptyState__icon }),
            react_1.default.createElement("p", { className: DepartmentDemand_module_scss_1.default.emptyState__title }, "No department demand data"),
            react_1.default.createElement("p", { className: DepartmentDemand_module_scss_1.default.emptyState__subtitle }, "There are currently no active positions requested."))) : (react_1.default.createElement("div", { className: DepartmentDemand_module_scss_1.default.rankedList }, rankedDepartments.map(function (dept, idx) {
            var IconComponent = Lucide[dept.icon] || Lucide.Building2;
            // Color-coded progress bar fills
            var barColor = "#ef4444"; // Red
            if (dept.fill >= 50)
                barColor = "#10b981"; // Green
            else if (dept.fill >= 30)
                barColor = "#3b82f6"; // Blue
            else if (dept.fill >= 25)
                barColor = "#f59e0b"; // Orange
            return (react_1.default.createElement("div", { key: idx, className: DepartmentDemand_module_scss_1.default.rankedRow },
                react_1.default.createElement("div", { className: DepartmentDemand_module_scss_1.default.rankedRow__meta },
                    react_1.default.createElement("div", { className: DepartmentDemand_module_scss_1.default.rankedRow__deptWrap },
                        react_1.default.createElement(IconComponent, { size: 14, className: DepartmentDemand_module_scss_1.default.rankedRow__icon }),
                        react_1.default.createElement("span", { className: DepartmentDemand_module_scss_1.default.rankedRow__name }, dept.name)),
                    react_1.default.createElement("span", { className: DepartmentDemand_module_scss_1.default.rankedRow__stats },
                        dept.open,
                        " positions")),
                react_1.default.createElement("div", { className: DepartmentDemand_module_scss_1.default.rankedRow__progressBg },
                    react_1.default.createElement("div", { className: DepartmentDemand_module_scss_1.default.rankedRow__progressFill, style: {
                            width: "".concat(dept.fill * 2, "%"),
                            backgroundColor: barColor,
                        } }))));
        })))),
        react_1.default.createElement("div", { className: DepartmentDemand_module_scss_1.default.deptCard__footer },
            react_1.default.createElement("span", { className: DepartmentDemand_module_scss_1.default.deptCard__total },
                "Total (",
                totalPositions,
                " Positions)"))));
};
exports.DepartmentDemand = DepartmentDemand;
exports.default = exports.DepartmentDemand;
//# sourceMappingURL=DepartmentDemand.js.map