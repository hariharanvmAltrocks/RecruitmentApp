"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var HodViewScorecardDetail_module_scss_1 = tslib_1.__importDefault(require("./HodViewScorecardDetail.module.scss"));
var ReviewScorecardCandidateList = function (_a) {
    var candidateList = _a.candidateList, onViewDetail = _a.onViewDetail, stateValue = _a.stateValue, isLoading = _a.isLoading, navigateBack = _a.navigateBack;
    return (React.createElement("div", { className: HodViewScorecardDetail_module_scss_1.default.tablePage },
        React.createElement("div", { className: HodViewScorecardDetail_module_scss_1.default.tableHeaderSection },
            React.createElement("div", null,
                React.createElement("h1", null, stateValue === null || stateValue === void 0 ? void 0 :
                    stateValue.JobCode,
                    " - Candidates"),
                React.createElement("p", null, stateValue === null || stateValue === void 0 ? void 0 : stateValue.Department)),
            React.createElement("button", { className: HodViewScorecardDetail_module_scss_1.default.outlineBtn, onClick: navigateBack }, "Back to Jobs")),
        React.createElement("div", { className: HodViewScorecardDetail_module_scss_1.default.tableContainer },
            React.createElement("table", { className: HodViewScorecardDetail_module_scss_1.default.modernTable },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Candidate Name"),
                        React.createElement("th", null, "Nationality"),
                        React.createElement("th", null, "Exp."),
                        React.createElement("th", null, "Status"),
                        React.createElement("th", null, "Action"))),
                React.createElement("tbody", null, candidateList === null || candidateList === void 0 ? void 0 : candidateList.map(function (cand, idx) {
                    var _a;
                    return (React.createElement("tr", { key: idx },
                        React.createElement("td", { className: HodViewScorecardDetail_module_scss_1.default.boldText }, cand.CandidateName),
                        React.createElement("td", null, cand.Nationality),
                        React.createElement("td", null,
                            cand.TotalExperience,
                            " Yrs"),
                        React.createElement("td", null,
                            React.createElement("span", { className: "".concat(HodViewScorecardDetail_module_scss_1.default.badge, " ").concat(HodViewScorecardDetail_module_scss_1.default[(_a = cand.Status) === null || _a === void 0 ? void 0 : _a.replace(/\s/g, "")]) }, cand.Status)),
                        React.createElement("td", null,
                            React.createElement("button", { className: HodViewScorecardDetail_module_scss_1.default.actionBtn, onClick: function () { return onViewDetail(cand); } }, "View Detail"))));
                }))))));
};
exports.default = ReviewScorecardCandidateList;
//# sourceMappingURL=ReviewScorecardCandidateList.js.map