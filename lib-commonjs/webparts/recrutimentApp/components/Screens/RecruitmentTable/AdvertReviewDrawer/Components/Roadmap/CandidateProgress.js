"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateProgress = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var lucide_react_1 = require("lucide-react");
var CandidateProgress_module_scss_1 = tslib_1.__importDefault(require("./CandidateProgress.module.scss"));
var PROGRESS_STEPS = [
    "Candidate Status",
    "Interview Schedules",
    "Assign Position ID",
    "Background Check",
    "Resi Process",
    "Offer Release",
    "Workpermit Process",
    "Employment Contract",
    "Onboarding"
];
var DUMMY_CANDIDATES = [
    {
        id: "1",
        initials: "AR",
        name: "Aarav Rao",
        role: "Software Engineer",
        appliedDate: "12 May 2024",
        avatarClass: CandidateProgress_module_scss_1.default["candidateProgress__candidateInfo__avatar--blue"],
        currentStepIndex: 3, // 0-indexed, so 4th step (Background Check)
    },
    {
        id: "2",
        initials: "PS",
        name: "Priya Singh",
        role: "HR Executive",
        appliedDate: "14 May 2024",
        avatarClass: CandidateProgress_module_scss_1.default["candidateProgress__candidateInfo__avatar--purple"],
        currentStepIndex: 5, // 6th step (Offer Release)
    },
    {
        id: "3",
        initials: "MJ",
        name: "Michael Johnson",
        role: "Data Analyst",
        appliedDate: "16 May 2024",
        avatarClass: CandidateProgress_module_scss_1.default["candidateProgress__candidateInfo__avatar--yellow"],
        currentStepIndex: 1, // 2nd step (Interview Schedules)
    }
];
var CandidateProgress = function () {
    return (react_1.default.createElement("div", { className: CandidateProgress_module_scss_1.default.candidateProgress },
        react_1.default.createElement("div", { className: CandidateProgress_module_scss_1.default.candidateProgress__header },
            react_1.default.createElement("div", { className: CandidateProgress_module_scss_1.default.candidateProgress__title },
                react_1.default.createElement("h3", null, "Candidate Progress"),
                react_1.default.createElement("p", null, "Track progress for each candidate through the recruitment process")),
            react_1.default.createElement("div", { className: CandidateProgress_module_scss_1.default.candidateProgress__actions },
                react_1.default.createElement("div", { className: CandidateProgress_module_scss_1.default.candidateProgress__search },
                    react_1.default.createElement(lucide_react_1.Search, { size: 16 }),
                    react_1.default.createElement("input", { type: "text", placeholder: "Search candidate..." })),
                react_1.default.createElement("button", { className: CandidateProgress_module_scss_1.default.candidateProgress__filterBtn },
                    react_1.default.createElement(lucide_react_1.Filter, { size: 16 }),
                    "Filter"))),
        react_1.default.createElement("div", { className: CandidateProgress_module_scss_1.default.candidateProgress__timelineHeader }, PROGRESS_STEPS.map(function (step, idx) { return (react_1.default.createElement("div", { key: idx, className: CandidateProgress_module_scss_1.default.candidateProgress__stepHeader },
            react_1.default.createElement("div", { className: CandidateProgress_module_scss_1.default.stepNum }, idx + 1),
            react_1.default.createElement("div", { className: CandidateProgress_module_scss_1.default.stepLabel }, step))); })),
        react_1.default.createElement("table", { className: CandidateProgress_module_scss_1.default.candidateProgress__table },
            react_1.default.createElement("thead", null,
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("th", null, "Candidate"),
                    react_1.default.createElement("th", null, "Current Step"),
                    react_1.default.createElement("th", null, "Progress"),
                    react_1.default.createElement("th", null))),
            react_1.default.createElement("tbody", null, DUMMY_CANDIDATES.map(function (candidate) { return (react_1.default.createElement("tr", { key: candidate.id },
                react_1.default.createElement("td", null,
                    react_1.default.createElement("div", { className: CandidateProgress_module_scss_1.default.candidateProgress__candidateInfo },
                        react_1.default.createElement("div", { className: "".concat(CandidateProgress_module_scss_1.default.avatar, " ").concat(candidate.avatarClass) }, candidate.initials),
                        react_1.default.createElement("div", { className: CandidateProgress_module_scss_1.default.details },
                            react_1.default.createElement("span", { className: CandidateProgress_module_scss_1.default.name }, candidate.name),
                            react_1.default.createElement("span", { className: CandidateProgress_module_scss_1.default.role }, candidate.role),
                            react_1.default.createElement("span", { className: CandidateProgress_module_scss_1.default.date },
                                react_1.default.createElement(lucide_react_1.Calendar, { size: 12 }),
                                " Applied on ",
                                candidate.appliedDate)))),
                react_1.default.createElement("td", null,
                    react_1.default.createElement("div", { className: CandidateProgress_module_scss_1.default.candidateProgress__currentStepBox },
                        react_1.default.createElement("div", { className: CandidateProgress_module_scss_1.default.stepBadge }, candidate.currentStepIndex + 1),
                        react_1.default.createElement("div", { className: CandidateProgress_module_scss_1.default.stepInfo },
                            react_1.default.createElement("span", { className: CandidateProgress_module_scss_1.default.stepName }, PROGRESS_STEPS[candidate.currentStepIndex]),
                            react_1.default.createElement("span", { className: CandidateProgress_module_scss_1.default.stepStatus },
                                "In Progress ",
                                react_1.default.createElement("span", { className: CandidateProgress_module_scss_1.default.dot }))))),
                react_1.default.createElement("td", { style: { width: "40%" } },
                    react_1.default.createElement("div", { className: CandidateProgress_module_scss_1.default.candidateProgress__progressRow }, PROGRESS_STEPS.map(function (_, idx) {
                        var isCompleted = idx < candidate.currentStepIndex;
                        var isActive = idx === candidate.currentStepIndex;
                        var hideLine = isCompleted && idx === candidate.currentStepIndex - 1;
                        var nodeClass = CandidateProgress_module_scss_1.default["node--pending"];
                        if (isCompleted)
                            nodeClass = CandidateProgress_module_scss_1.default["node--completed"];
                        else if (isActive)
                            nodeClass = CandidateProgress_module_scss_1.default["node--active"];
                        if (hideLine)
                            nodeClass += " ".concat(CandidateProgress_module_scss_1.default["hide-line"]);
                        return (react_1.default.createElement("div", { key: idx, className: "".concat(CandidateProgress_module_scss_1.default.node, " ").concat(nodeClass) }, isCompleted ? react_1.default.createElement(lucide_react_1.Check, { size: 12, strokeWidth: 3 }) : idx + 1));
                    }))),
                react_1.default.createElement("td", { style: { textAlign: "right" } },
                    react_1.default.createElement("button", { style: { background: "none", border: "none", cursor: "pointer", color: "#94a3b8" } },
                        react_1.default.createElement(lucide_react_1.MoreHorizontal, { size: 18 }))))); })))));
};
exports.CandidateProgress = CandidateProgress;
//# sourceMappingURL=CandidateProgress.js.map