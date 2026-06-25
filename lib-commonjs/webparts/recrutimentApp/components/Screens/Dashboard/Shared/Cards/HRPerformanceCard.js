"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HRPerformanceCard = exports.SingleHRCard = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var Lucide = tslib_1.__importStar(require("lucide-react"));
var Cards_module_scss_1 = tslib_1.__importDefault(require("./Cards.module.scss"));
var useContractsByHR_1 = tslib_1.__importDefault(require("../../Hooks/useContractsByHR"));
exports.SingleHRCard = react_1.default.memo(function (_a) {
    var workflow = _a.workflow;
    var avatarText = (0, react_1.useMemo)(function () {
        return workflow.hrAvatar || workflow.hrName.substring(0, 2).toUpperCase();
    }, [workflow.hrAvatar, workflow.hrName]);
    return (react_1.default.createElement("div", { className: Cards_module_scss_1.default.hrWorkflowCardItem },
        react_1.default.createElement("div", { className: Cards_module_scss_1.default.hrCardHeaderRow },
            react_1.default.createElement("div", { className: Cards_module_scss_1.default.hrCardInfo },
                react_1.default.createElement("div", { className: Cards_module_scss_1.default.hrCardAvatar }, avatarText),
                react_1.default.createElement("div", { className: Cards_module_scss_1.default.hrCardMeta },
                    react_1.default.createElement("span", { className: Cards_module_scss_1.default.hrCardName }, workflow.hrName),
                    react_1.default.createElement("span", { className: Cards_module_scss_1.default.hrCardContractsCount },
                        workflow.assignedContracts,
                        " Contracts"))),
            react_1.default.createElement("span", { className: Cards_module_scss_1.default.hrCardCompletionPercentage },
                workflow.completionPercentage,
                "%")),
        react_1.default.createElement("div", { className: Cards_module_scss_1.default.hrCardProgressBarBg },
            react_1.default.createElement("div", { className: Cards_module_scss_1.default.hrCardProgressBarFill, style: { width: "".concat(workflow.completionPercentage, "%") } })),
        react_1.default.createElement("div", { className: Cards_module_scss_1.default.hrCardMetricsRow },
            react_1.default.createElement("div", { className: Cards_module_scss_1.default.hrCardMetricBox },
                react_1.default.createElement("span", { className: "".concat(Cards_module_scss_1.default.hrCardMetricVal, " ").concat(Cards_module_scss_1.default.valOrange) }, workflow.balance),
                react_1.default.createElement("span", { className: Cards_module_scss_1.default.hrCardMetricLabel }, "Pending")),
            react_1.default.createElement("div", { className: Cards_module_scss_1.default.hrCardMetricBox },
                react_1.default.createElement("span", { className: "".concat(Cards_module_scss_1.default.hrCardMetricVal, " ").concat(Cards_module_scss_1.default.valGreen) }, workflow.filledPositions),
                react_1.default.createElement("span", { className: Cards_module_scss_1.default.hrCardMetricLabel }, "Done")),
            react_1.default.createElement("div", { className: Cards_module_scss_1.default.hrCardMetricBox },
                react_1.default.createElement("span", { className: "".concat(Cards_module_scss_1.default.hrCardMetricVal, " ").concat(Cards_module_scss_1.default.valBlue) }, workflow.requiredPositions),
                react_1.default.createElement("span", { className: Cards_module_scss_1.default.hrCardMetricLabel }, "Total")))));
});
// ─── Skeleton Loading Component ──────────────────────────────────────────────
var SkeletonCard = function () { return (react_1.default.createElement("div", { className: "".concat(Cards_module_scss_1.default.hrWorkflowCardItem, " ").concat(Cards_module_scss_1.default.skeletonCard) },
    react_1.default.createElement("div", { className: Cards_module_scss_1.default.hrCardHeaderRow },
        react_1.default.createElement("div", { className: Cards_module_scss_1.default.hrCardInfo },
            react_1.default.createElement("div", { className: "".concat(Cards_module_scss_1.default.hrCardAvatar, " ").concat(Cards_module_scss_1.default.skeletonPulse) }),
            react_1.default.createElement("div", { className: Cards_module_scss_1.default.hrCardMeta, style: { width: "80px" } },
                react_1.default.createElement("div", { className: "".concat(Cards_module_scss_1.default.skeletonLine, " ").concat(Cards_module_scss_1.default.skeletonPulse), style: { height: "12px", width: "100%" } }),
                react_1.default.createElement("div", { className: "".concat(Cards_module_scss_1.default.skeletonLine, " ").concat(Cards_module_scss_1.default.skeletonPulse), style: { height: "8px", width: "60%", marginTop: "4px" } }))),
        react_1.default.createElement("div", { className: "".concat(Cards_module_scss_1.default.skeletonLine, " ").concat(Cards_module_scss_1.default.skeletonPulse), style: { height: "14px", width: "30px" } })),
    react_1.default.createElement("div", { className: "".concat(Cards_module_scss_1.default.hrCardProgressBarBg, " ").concat(Cards_module_scss_1.default.skeletonPulse), style: { marginTop: "16px", height: "6px" } }),
    react_1.default.createElement("div", { className: Cards_module_scss_1.default.hrCardMetricsRow, style: { marginTop: "16px" } },
        react_1.default.createElement("div", { className: Cards_module_scss_1.default.hrCardMetricBox },
            react_1.default.createElement("div", { className: "".concat(Cards_module_scss_1.default.skeletonLine, " ").concat(Cards_module_scss_1.default.skeletonPulse), style: { height: "16px", width: "20px", margin: "0 auto" } })),
        react_1.default.createElement("div", { className: Cards_module_scss_1.default.hrCardMetricBox },
            react_1.default.createElement("div", { className: "".concat(Cards_module_scss_1.default.skeletonLine, " ").concat(Cards_module_scss_1.default.skeletonPulse), style: { height: "16px", width: "20px", margin: "0 auto" } })),
        react_1.default.createElement("div", { className: Cards_module_scss_1.default.hrCardMetricBox },
            react_1.default.createElement("div", { className: "".concat(Cards_module_scss_1.default.skeletonLine, " ").concat(Cards_module_scss_1.default.skeletonPulse), style: { height: "16px", width: "20px", margin: "0 auto" } }))))); };
// ─── Main Component Export ───────────────────────────────────────────────────
var HRPerformanceCard = function (_a) {
    var workflow = _a.workflow;
    // If workflow is passed directly, act as a single card (backwards compatibility)
    if (workflow) {
        return react_1.default.createElement(exports.SingleHRCard, { workflow: workflow });
    }
    // Otherwise, render the entire HR Workflow Overview grid container
    var _b = (0, useContractsByHR_1.default)(), workflows = _b.data, loading = _b.loading, error = _b.error, refresh = _b.refresh;
    var renderContent = function () {
        if (loading) {
            return (react_1.default.createElement("div", { className: Cards_module_scss_1.default.hrWorkflowGrid }, Array.from({ length: 4 }).map(function (_, idx) { return (react_1.default.createElement(SkeletonCard, { key: idx })); })));
        }
        if (error) {
            return (react_1.default.createElement("div", { className: Cards_module_scss_1.default.hrWorkflowErrorState },
                react_1.default.createElement(Lucide.AlertCircle, { size: 40, className: Cards_module_scss_1.default.errorIcon }),
                react_1.default.createElement("p", { className: Cards_module_scss_1.default.errorText }, "Failed to load HR performance workflows."),
                react_1.default.createElement("button", { className: Cards_module_scss_1.default.retryBtn, onClick: refresh },
                    react_1.default.createElement(Lucide.RotateCw, { size: 12, style: { marginRight: "4px" } }),
                    " Retry")));
        }
        if (!workflows || workflows.length === 0) {
            return (react_1.default.createElement("div", { className: Cards_module_scss_1.default.hrWorkflowEmptyState },
                react_1.default.createElement(Lucide.Users, { size: 48, className: Cards_module_scss_1.default.emptyIcon }),
                react_1.default.createElement("p", { className: Cards_module_scss_1.default.emptyText }, "No HR assignments available.")));
        }
        return (react_1.default.createElement("div", { className: Cards_module_scss_1.default.hrWorkflowGrid }, workflows.map(function (wf, idx) { return (react_1.default.createElement(exports.SingleHRCard, { key: wf.hrName || idx, workflow: wf })); })));
    };
    return (react_1.default.createElement("div", { className: Cards_module_scss_1.default.hrWorkflowContainerCard },
        react_1.default.createElement("div", { className: Cards_module_scss_1.default.hrWorkflowHeader },
            react_1.default.createElement("div", { className: Cards_module_scss_1.default.hrWorkflowTitleGroup },
                react_1.default.createElement("div", { className: Cards_module_scss_1.default.hrWorkflowTitleRow },
                    react_1.default.createElement("span", { className: Cards_module_scss_1.default.hrWorkflowDot, "aria-hidden": "true" }),
                    react_1.default.createElement("h2", { className: Cards_module_scss_1.default.hrWorkflowTitle }, "HR Workflow Overview")),
                react_1.default.createElement("p", { className: Cards_module_scss_1.default.hrWorkflowSubtitle }, "Track HR contract assignments"))),
        react_1.default.createElement("div", { className: Cards_module_scss_1.default.hrWorkflowBody }, renderContent()),
        react_1.default.createElement("div", { className: Cards_module_scss_1.default.hrWorkflowFooter },
            react_1.default.createElement("span", { className: Cards_module_scss_1.default.viewAllLink },
                "View all HR assignments ",
                react_1.default.createElement(Lucide.ArrowRight, { size: 14, style: { marginLeft: "4px" } })))));
};
exports.HRPerformanceCard = HRPerformanceCard;
exports.default = exports.HRPerformanceCard;
//# sourceMappingURL=HRPerformanceCard.js.map