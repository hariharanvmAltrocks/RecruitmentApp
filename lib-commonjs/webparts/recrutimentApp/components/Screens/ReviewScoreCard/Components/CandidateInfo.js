"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var ReviewScorecard_module_scss_1 = tslib_1.__importDefault(require("../ReviewScorecard.module.scss"));
var CandidateInfo = function (_a) {
    var candidateData = _a.candidateData;
    return (react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.candidateInfo },
        react_1.default.createElement("h3", null, candidateData.applicantName),
        react_1.default.createElement("div", { className: ReviewScorecard_module_scss_1.default.infoGrid },
            react_1.default.createElement("div", null,
                react_1.default.createElement("strong", null, "Nationality:"),
                " ",
                candidateData.nationality),
            react_1.default.createElement("div", null,
                react_1.default.createElement("strong", null, "Gender:"),
                " ",
                candidateData.gender),
            react_1.default.createElement("div", null,
                react_1.default.createElement("strong", null, "Qualification:"),
                " ",
                candidateData.qualification),
            react_1.default.createElement("div", null,
                react_1.default.createElement("strong", null, "Mining Experience:"),
                " ",
                candidateData.miningExp),
            react_1.default.createElement("div", null,
                react_1.default.createElement("strong", null, "Relevant Experience:"),
                " ",
                candidateData.relevantExp),
            react_1.default.createElement("div", null,
                react_1.default.createElement("strong", null, "Disability:"),
                " ",
                candidateData.disability),
            react_1.default.createElement("div", null,
                react_1.default.createElement("strong", null, "Conflicts of Interest:"),
                " ",
                candidateData.conflictsOfInterest))));
};
exports.default = CandidateInfo;
//# sourceMappingURL=CandidateInfo.js.map