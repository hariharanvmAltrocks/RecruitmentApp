"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateProgress = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var CandidateProgress_module_scss_1 = tslib_1.__importDefault(require("./CandidateProgress.module.scss"));
var PositionStatusConfig_1 = require("../../../../../../utilities/PositionStatusConfig");
var getStatusRoadMap_1 = require("../../Hooks/getStatusRoadMap");
var CandidateProgress = function (_a) {
    var RecID = _a.RecID;
    var _b = (0, getStatusRoadMap_1.getStatusRoadMap)(RecID), data = _b.data, loading = _b.loading;
    var _c = (0, react_1.useState)(1), currentPage = _c[0], setCurrentPage = _c[1];
    var itemsPerPage = 5;
    var validData = data || [];
    var totalPages = Math.max(1, Math.ceil(validData.length / itemsPerPage));
    (0, react_1.useEffect)(function () {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);
    var currentData = validData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    var handlePrevPage = function () {
        setCurrentPage(function (prev) { return Math.max(prev - 1, 1); });
    };
    var handleNextPage = function () {
        setCurrentPage(function (prev) { return Math.min(prev + 1, totalPages); });
    };
    return (react_1.default.createElement("div", { className: CandidateProgress_module_scss_1.default.candidateProgress }, data && data.length > 0 && (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: CandidateProgress_module_scss_1.default.candidateProgress__header },
            react_1.default.createElement("div", { className: CandidateProgress_module_scss_1.default.candidateProgress__title },
                react_1.default.createElement("div", { style: {
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "4px",
                    } },
                    react_1.default.createElement("h3", { style: { margin: 0 } }, "Candidate Progress"),
                    !loading && (react_1.default.createElement("span", { className: CandidateProgress_module_scss_1.default.totalCountBadge },
                        validData.length,
                        " Total"))),
                react_1.default.createElement("p", null, "Track progress for each candidate through the recruitment process"))),
        react_1.default.createElement("div", { className: CandidateProgress_module_scss_1.default.candidateProgress__timelineHeader }, PositionStatusConfig_1.PROGRESS_STEPS.map(function (step, idx) { return (react_1.default.createElement("div", { key: idx, className: CandidateProgress_module_scss_1.default.candidateProgress__stepHeader },
            react_1.default.createElement("div", { className: CandidateProgress_module_scss_1.default.stepNum }, idx + 1),
            react_1.default.createElement("div", { className: CandidateProgress_module_scss_1.default.stepLabel }, step))); })),
        react_1.default.createElement("table", { className: CandidateProgress_module_scss_1.default.candidateProgress__table },
            react_1.default.createElement("thead", null,
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("th", null, "Candidate"),
                    react_1.default.createElement("th", null, "Current Step"),
                    react_1.default.createElement("th", null, "Progress"),
                    react_1.default.createElement("th", null))),
            react_1.default.createElement("tbody", null, loading ? (react_1.default.createElement("tr", null,
                react_1.default.createElement("td", { colSpan: 4 },
                    react_1.default.createElement("div", { style: {
                            textAlign: "center",
                            padding: "30px 20px",
                            color: "#64748b",
                        } }, "Loading candidates...")))) : currentData && currentData.length > 0 ? (currentData.map(function (candidate) { return (react_1.default.createElement("tr", { key: candidate.id },
                react_1.default.createElement("td", null,
                    react_1.default.createElement("div", { className: CandidateProgress_module_scss_1.default.candidateProgress__candidateInfo },
                        react_1.default.createElement("div", { className: CandidateProgress_module_scss_1.default.details },
                            react_1.default.createElement("span", { className: CandidateProgress_module_scss_1.default.name }, candidate.name),
                            react_1.default.createElement("span", { className: CandidateProgress_module_scss_1.default.role }, candidate.role),
                            react_1.default.createElement("span", { className: CandidateProgress_module_scss_1.default.date },
                                react_1.default.createElement(lucide_react_1.Calendar, { size: 12 }),
                                " Applied on",
                                " ",
                                candidate.appliedDate)))),
                react_1.default.createElement("td", null,
                    react_1.default.createElement("div", { className: CandidateProgress_module_scss_1.default.candidateProgress__currentStepBox },
                        react_1.default.createElement("div", { className: CandidateProgress_module_scss_1.default.stepBadge }, candidate.currentStepIndex + 1),
                        react_1.default.createElement("div", { className: CandidateProgress_module_scss_1.default.stepInfo },
                            react_1.default.createElement("span", { className: CandidateProgress_module_scss_1.default.stepName }, PositionStatusConfig_1.PROGRESS_STEPS[candidate.currentStepIndex]),
                            react_1.default.createElement("span", { className: CandidateProgress_module_scss_1.default.stepStatus },
                                "In Progress ",
                                react_1.default.createElement("span", { className: CandidateProgress_module_scss_1.default.dot }))))),
                react_1.default.createElement("td", { style: { width: "40%" } },
                    react_1.default.createElement("div", { className: CandidateProgress_module_scss_1.default.candidateProgress__progressRow }, PositionStatusConfig_1.PROGRESS_STEPS.map(function (_, idx) {
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
                        return (react_1.default.createElement("div", { key: idx, className: "".concat(CandidateProgress_module_scss_1.default.node, " ").concat(nodeClass) }, isCompleted ? (react_1.default.createElement(lucide_react_1.Check, { size: 12, strokeWidth: 3 })) : (idx + 1)));
                    }))))); })) : (react_1.default.createElement("tr", null,
                react_1.default.createElement("td", { colSpan: 4 },
                    react_1.default.createElement("div", { style: {
                            textAlign: "center",
                            padding: "30px 20px",
                            color: "#64748b",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "10px",
                        } },
                        react_1.default.createElement("p", { style: { margin: 0, fontWeight: 500 } }, "No candidates are currently scheduled for an interview."))))))),
        validData.length > itemsPerPage && (react_1.default.createElement("div", { className: CandidateProgress_module_scss_1.default.candidateProgress__pagination },
            react_1.default.createElement("button", { onClick: handlePrevPage, disabled: currentPage === 1, className: CandidateProgress_module_scss_1.default.paginationBtn }, "Previous"),
            react_1.default.createElement("span", { className: CandidateProgress_module_scss_1.default.paginationText },
                "Page ",
                currentPage,
                " of ",
                totalPages),
            react_1.default.createElement("button", { onClick: handleNextPage, disabled: currentPage === totalPages, className: CandidateProgress_module_scss_1.default.paginationBtn }, "Next")))))));
};
exports.CandidateProgress = CandidateProgress;
//# sourceMappingURL=CandidateProgress.js.map