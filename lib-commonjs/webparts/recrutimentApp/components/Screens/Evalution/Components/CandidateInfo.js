"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var CandidateInfo_module_scss_1 = tslib_1.__importDefault(require("./CandidateInfo.module.scss"));
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
function CandidateInfo(_a) {
    var _b, _c;
    var candidate = _a.candidate, onRefresh = _a.onRefresh;
    return (React.createElement("aside", { className: CandidateInfo_module_scss_1.default.leftPanel },
        React.createElement("div", { className: CandidateInfo_module_scss_1.default.leftHeader },
            React.createElement("div", { className: CandidateInfo_module_scss_1.default.leftAccent }),
            React.createElement("span", { className: CandidateInfo_module_scss_1.default.leftTitle }, strings.CandidateInfo)),
        React.createElement("div", { style: { paddingTop: 8 } },
            React.createElement(InfoField, { icon: "\uD83D\uDC64", label: strings.ApplicantName1, value: candidate === null || candidate === void 0 ? void 0 : candidate.applicantName }),
            React.createElement(InfoField, { icon: "\uD83C\uDF10", label: strings.Nationality1, value: candidate === null || candidate === void 0 ? void 0 : candidate.nationality }),
            React.createElement(InfoField, { icon: "\uD83D\uDC64", label: strings.Gender1, value: candidate === null || candidate === void 0 ? void 0 : candidate.gender }),
            React.createElement(InfoField, { icon: "\uD83D\uDCC4", label: strings.Qualification1, value: candidate === null || candidate === void 0 ? void 0 : candidate.qualification }),
            React.createElement("div", { className: CandidateInfo_module_scss_1.default.twoCol },
                React.createElement(InfoField, { icon: "\uD83D\uDCC8", label: strings.MiningExp1, value: candidate === null || candidate === void 0 ? void 0 : candidate.miningExp }),
                React.createElement(InfoField, { icon: "\uD83D\uDCC8", label: strings.RelatedExp1, value: candidate === null || candidate === void 0 ? void 0 : candidate.relevantExp })),
            React.createElement("div", { className: CandidateInfo_module_scss_1.default.twoCol },
                React.createElement(InfoField, { icon: "\uD83D\uDCC5", label: strings.InterviewDate1, value: candidate === null || candidate === void 0 ? void 0 : candidate.interviewDate }),
                (candidate === null || candidate === void 0 ? void 0 : candidate.interviewLevel) && (React.createElement(InfoField, { icon: "\uD83D\uDD32", label: strings.Level, value: candidate === null || candidate === void 0 ? void 0 : candidate.interviewLevel }))),
            (candidate === null || candidate === void 0 ? void 0 : candidate.grade) && (React.createElement("div", { className: CandidateInfo_module_scss_1.default.twoCol },
                React.createElement(InfoField, { icon: "\uD83D\uDCC8", label: strings.Grade, value: candidate === null || candidate === void 0 ? void 0 : candidate.grade }),
                React.createElement(InfoField, { icon: "\u26A0\uFE0F", label: strings.Conflicts1, value: candidate === null || candidate === void 0 ? void 0 : candidate.conflictsOfInterest }))),
            React.createElement(InfoField, { icon: "\u267F", label: strings.Disability1, value: candidate === null || candidate === void 0 ? void 0 : candidate.disability }),
            ((_c = (_b = candidate === null || candidate === void 0 ? void 0 : candidate.panelMembers) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0) > 0 && (React.createElement("div", { className: CandidateInfo_module_scss_1.default.panelSection },
                React.createElement("div", { className: CandidateInfo_module_scss_1.default.panelHeader },
                    React.createElement("span", { className: CandidateInfo_module_scss_1.default.panelHeaderIcon }, strings.StringKey1),
                    React.createElement("span", { className: CandidateInfo_module_scss_1.default.panelHeaderLabel }, strings.InterviewPanel)),
                candidate.panelMembers.map(function (name, i) { return (React.createElement("div", { key: i, className: CandidateInfo_module_scss_1.default.panelRow },
                    React.createElement("span", { className: CandidateInfo_module_scss_1.default.panelBadge }, i + 1),
                    React.createElement("span", { className: CandidateInfo_module_scss_1.default.panelName }, name))); }))))));
}
exports.default = CandidateInfo;
function InfoField(_a) {
    var icon = _a.icon, label = _a.label, value = _a.value;
    return (React.createElement("div", { className: CandidateInfo_module_scss_1.default.leftFieldWrapper },
        React.createElement("div", { className: CandidateInfo_module_scss_1.default.leftFieldLabelRow },
            icon && React.createElement("span", { className: CandidateInfo_module_scss_1.default.leftFieldIcon }, icon),
            React.createElement("span", { className: CandidateInfo_module_scss_1.default.leftFieldLabel }, label)),
        React.createElement("div", { className: CandidateInfo_module_scss_1.default.leftFieldValueBox }, value || '')));
}
//# sourceMappingURL=CandidateInfo.js.map