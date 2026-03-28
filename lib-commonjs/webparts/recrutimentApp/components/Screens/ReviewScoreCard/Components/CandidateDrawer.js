"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var ReviewScorecard_module_scss_1 = tslib_1.__importDefault(require("../ReviewScorecard.module.scss"));
var CandidateDrawer = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, candidateData = _a.candidateData, loading = _a.loading, error = _a.error, children = _a.children;
    if (!isOpen)
        return null;
    return (react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.drawerOverlay, onClick: onClose },
        react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.drawer, onClick: function (e) { return e.stopPropagation(); } },
            react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.drawerHeader },
                react_1.default.createElement("h2", null, "Candidate Review Scorecard"),
                react_1.default.createElement("button", { className: ReviewScorecard_module_scss_1.default.closeButton, onClick: onClose }, "\u00D7")),
            react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.drawerContent },
                loading && react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.loading }, "Loading..."),
                error && react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.error }, error),
                candidateData && (react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.candidateInfo },
                    react_1.default.createElement("h3", null, candidateData.applicantName),
                    react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.infoGrid },
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("strong", null, "Position:"),
                            " ",
                            candidateData.positionTitle),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("strong", null, "Grade:"),
                            " ",
                            candidateData.grade),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("strong", null, "Interview Level:"),
                            " ",
                            candidateData.interviewLevel),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("strong", null, "Interview Date:"),
                            " ",
                            candidateData.interviewDate)),
                    react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.panelMembers },
                        react_1.default.createElement("h4", null, "Panel Members:"),
                        react_1.default.createElement("ul", null, candidateData.panelMembers.map(function (member, index) { return (react_1.default.createElement("li", { key: index },
                            member.name,
                            " - ",
                            member.jobTitle,
                            " (",
                            member.department,
                            ")")); }))))),
                children))));
};
exports.default = CandidateDrawer;
//# sourceMappingURL=CandidateDrawer.js.map