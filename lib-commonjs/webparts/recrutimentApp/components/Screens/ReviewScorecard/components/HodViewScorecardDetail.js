"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var HodViewScorecardDetail_module_scss_1 = tslib_1.__importDefault(require("./HodViewScorecardDetail.module.scss"));
var ScorecardCommentView_1 = tslib_1.__importDefault(require("./ScorecardCommentView"));
var ScorecardQuestionsView_1 = tslib_1.__importDefault(require("./ScorecardQuestionsView"));
var HodViewScorecardDetail = function (_a) {
    var stateValue = _a.stateValue, candidateData = _a.candidateData, questionnaire = _a.questionnaire, comments = _a.comments, navigateBack = _a.navigateBack, isLoading = _a.isLoading;
    var _b = React.useState("Candidate Info"), activeSideTab = _b[0], setActiveSideTab = _b[1];
    // DYNAMIC CONFIG: Add any field here and it will automatically appear in the UI
    var candidateFields = [
        { label: "Candidate Name", value: candidateData === null || candidateData === void 0 ? void 0 : candidateData.CandidateName },
        { label: "Nationality", value: candidateData === null || candidateData === void 0 ? void 0 : candidateData.Nationality },
        { label: "Total Experience", value: candidateData === null || candidateData === void 0 ? void 0 : candidateData.TotalExperience },
        { label: "Current Position", value: candidateData === null || candidateData === void 0 ? void 0 : candidateData.CurrentPosition },
        { label: "Notice Period", value: candidateData === null || candidateData === void 0 ? void 0 : candidateData.NoticePeriod },
        { label: "Expected Salary", value: candidateData === null || candidateData === void 0 ? void 0 : candidateData.ExpectedSalary },
        { label: "Job Code", value: candidateData === null || candidateData === void 0 ? void 0 : candidateData.JobCode },
        { label: "Department", value: stateValue === null || stateValue === void 0 ? void 0 : stateValue.Department }
    ];
    React.useEffect(function () {
        // Tamil request: intha values list la irunthu varuth appa add to console
        console.log("HodViewScorecardDetail candidateFields:", candidateFields);
    }, [candidateFields]);
    var menuItems = ["Candidate Info", "Interview Scorecard", "Justification", "Q&A"];
    return (React.createElement("div", { className: HodViewScorecardDetail_module_scss_1.default.mainLayout },
        React.createElement("aside", { className: HodViewScorecardDetail_module_scss_1.default.sidebar },
            React.createElement("div", { className: HodViewScorecardDetail_module_scss_1.default.sidebarHeader },
                React.createElement("h3", null, (candidateData === null || candidateData === void 0 ? void 0 : candidateData.JobCode) || "SCORECARD"),
                React.createElement("p", null, "Review Management")),
            React.createElement("nav", { className: HodViewScorecardDetail_module_scss_1.default.navGroup }, menuItems.map(function (item) { return (React.createElement("div", { key: item, className: "".concat(HodViewScorecardDetail_module_scss_1.default.navItem, " ").concat(activeSideTab === item ? HodViewScorecardDetail_module_scss_1.default.active : ""), onClick: function () { return setActiveSideTab(item); } }, item)); })),
            React.createElement("button", { className: HodViewScorecardDetail_module_scss_1.default.backButton, onClick: navigateBack }, "\u2190 Back to List")),
        React.createElement("main", { className: HodViewScorecardDetail_module_scss_1.default.contentCard },
            React.createElement("div", { className: HodViewScorecardDetail_module_scss_1.default.contentHeader },
                React.createElement("h2", null, activeSideTab),
                React.createElement("div", { className: HodViewScorecardDetail_module_scss_1.default.statusPill }, (stateValue === null || stateValue === void 0 ? void 0 : stateValue.Status) || "Under Review")),
            React.createElement("div", { className: HodViewScorecardDetail_module_scss_1.default.scrollContent },
                activeSideTab === "Candidate Info" && (React.createElement("div", { className: HodViewScorecardDetail_module_scss_1.default.dynamicGrid }, candidateFields.map(function (field, index) { return (React.createElement("div", { key: index, className: HodViewScorecardDetail_module_scss_1.default.inputBox },
                    React.createElement("label", null, field.label),
                    React.createElement("input", { type: "text", value: field.value || "N/A", readOnly: true }))); }))),
                activeSideTab === "Justification" && (React.createElement(ScorecardCommentView_1.default, { level1: (comments === null || comments === void 0 ? void 0 : comments.level1) || [], level2: (comments === null || comments === void 0 ? void 0 : comments.level2) || [], onClose: function () { return setActiveSideTab("Candidate Info"); } })),
                activeSideTab === "Q&A" && (React.createElement(ScorecardQuestionsView_1.default, { questionnaire: questionnaire || [], onClose: function () { return setActiveSideTab("Candidate Info"); } })),
                activeSideTab === "Interview Scorecard" && (React.createElement("div", { className: HodViewScorecardDetail_module_scss_1.default.placeholder },
                    React.createElement("p", null, "Scorecard Table Content Loading...")))))));
};
exports.default = HodViewScorecardDetail;
//# sourceMappingURL=HodViewScorecardDetail.js.map