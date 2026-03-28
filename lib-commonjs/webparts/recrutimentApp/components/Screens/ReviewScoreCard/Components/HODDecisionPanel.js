"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var ReviewScorecard_module_scss_1 = tslib_1.__importDefault(require("../ReviewScorecard.module.scss"));
var HODDecisionPanel = function (_a) {
    var hodDecision = _a.hodDecision;
    if (!hodDecision) {
        return (react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.hodSection },
            react_1.default.createElement("h3", null, "HOD Decision"),
            react_1.default.createElement("p", null, "No HOD decision data available.")));
    }
    return (react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.hodSection },
        react_1.default.createElement("h3", null, "HOD Decision"),
        react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.hodDetails },
            react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.hodItem },
                react_1.default.createElement("label", null, "Decision:"),
                react_1.default.createElement("span", null, hodDecision.Decision || 'N/A')),
            react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.hodItem },
                react_1.default.createElement("label", null, "Comments:"),
                react_1.default.createElement("p", null, hodDecision.Comments || 'No comments provided')),
            react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.hodItem },
                react_1.default.createElement("label", null, "Decision Date:"),
                react_1.default.createElement("span", null, hodDecision.DecisionDate ? new Date(hodDecision.DecisionDate).toLocaleDateString() : 'N/A')),
            react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.hodItem },
                react_1.default.createElement("label", null, "HOD Name:"),
                react_1.default.createElement("span", null, hodDecision.HODName || 'N/A')))));
};
exports.default = HODDecisionPanel;
//# sourceMappingURL=HODDecisionPanel.js.map