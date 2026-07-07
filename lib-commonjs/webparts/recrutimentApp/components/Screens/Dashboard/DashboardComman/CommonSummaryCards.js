"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonSummaryCards = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var Lucide = tslib_1.__importStar(require("lucide-react"));
var CommonSummaryCards_module_scss_1 = tslib_1.__importDefault(require("./CommonSummaryCards.module.scss"));
var CommonSummaryCards = function (_a) {
    var cards = _a.cards, _b = _a.loading, loading = _b === void 0 ? false : _b;
    if (loading) {
        return (react_1.default.createElement("div", { className: CommonSummaryCards_module_scss_1.default.grid }, Array.from({ length: cards.length || 6 }).map(function (_, idx) { return (react_1.default.createElement("div", { key: "skeleton-".concat(idx), className: CommonSummaryCards_module_scss_1.default.skeletonCard },
            react_1.default.createElement("div", { className: CommonSummaryCards_module_scss_1.default.skeletonHeader },
                react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "32px", height: "32px", borderRadius: "8px" } }),
                react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "110px", height: "12px", marginLeft: "12px" } })),
            react_1.default.createElement("div", { className: CommonSummaryCards_module_scss_1.default.skeletonBody },
                react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "60px", height: "28px" } }),
                react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "100px", height: "10px" } })))); })));
    }
    return (react_1.default.createElement("div", { className: CommonSummaryCards_module_scss_1.default.grid }, cards.map(function (card) {
        var IconComponent = Lucide[card.iconName] || Lucide.HelpCircle;
        var trendClass = CommonSummaryCards_module_scss_1.default.trendNeutral;
        var trendIcon = null;
        if (card.trendType === "success") {
            trendClass = CommonSummaryCards_module_scss_1.default.trendSuccess;
            trendIcon = react_1.default.createElement(Lucide.ArrowUp, { size: 12 });
        }
        else if (card.trendType === "danger") {
            trendClass = CommonSummaryCards_module_scss_1.default.trendDanger;
            trendIcon = react_1.default.createElement(Lucide.ArrowDown, { size: 12 });
        }
        else if (card.trendType === "warning") {
            trendClass = CommonSummaryCards_module_scss_1.default.trendWarning;
        }
        else if (card.trendType === "primary") {
            trendClass = CommonSummaryCards_module_scss_1.default.trendPrimary;
        }
        // Determine icon color theme wrapper
        var iconThemeClass = CommonSummaryCards_module_scss_1.default.iconWrapBlue;
        if (card.trendType === "success")
            iconThemeClass = CommonSummaryCards_module_scss_1.default.iconWrapGreen;
        else if (card.trendType === "danger")
            iconThemeClass = CommonSummaryCards_module_scss_1.default.iconWrapRed;
        else if (card.trendType === "warning")
            iconThemeClass = CommonSummaryCards_module_scss_1.default.iconWrapOrange;
        return (react_1.default.createElement("div", { key: card.id, className: CommonSummaryCards_module_scss_1.default.summaryCard },
            react_1.default.createElement("div", { className: CommonSummaryCards_module_scss_1.default.cardHeader },
                react_1.default.createElement("div", { className: "".concat(CommonSummaryCards_module_scss_1.default.iconWrap, " ").concat(iconThemeClass) },
                    react_1.default.createElement(IconComponent, { size: 18 })),
                react_1.default.createElement("span", { className: CommonSummaryCards_module_scss_1.default.title }, card.title)),
            react_1.default.createElement("div", { className: CommonSummaryCards_module_scss_1.default.cardBody },
                react_1.default.createElement("span", { className: CommonSummaryCards_module_scss_1.default.value }, card.value),
                card.trendText && (react_1.default.createElement("div", { className: "".concat(CommonSummaryCards_module_scss_1.default.trend, " ").concat(trendClass) },
                    trendIcon,
                    react_1.default.createElement("span", null, card.trendText))))));
    })));
};
exports.CommonSummaryCards = CommonSummaryCards;
exports.default = exports.CommonSummaryCards;
//# sourceMappingURL=CommonSummaryCards.js.map