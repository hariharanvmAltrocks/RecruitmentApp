"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CandidateInfo;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var CandidateInfo_module_scss_1 = tslib_1.__importDefault(require("./CandidateInfo.module.scss"));
function CandidateInfo(_a) {
    var candidate = _a.candidate;
    return (React.createElement("aside", { className: "bg-white border border-slate-200 rounded-2xl p-5 shadow-sm ".concat(CandidateInfo_module_scss_1.default.card) },
        React.createElement("div", { className: "flex items-center justify-between mb-4" },
            React.createElement("div", null,
                React.createElement("h3", { className: "text-sm font-bold text-slate-800" }, "Candidate Info"),
                React.createElement("p", { className: "text-xs text-slate-500" }, "Personal and recruitment details")),
            React.createElement("span", { className: "text-[10px] font-semibold uppercase tracking-widest text-blue-600" }, "Profile")),
        React.createElement("div", { className: "flex flex-col gap-4" },
            React.createElement(InfoRow, { label: "Name", value: candidate === null || candidate === void 0 ? void 0 : candidate.applicantName }),
            React.createElement(InfoRow, { label: "Job Title", value: candidate === null || candidate === void 0 ? void 0 : candidate.jobTitle }),
            React.createElement(InfoRow, { label: "Grade", value: candidate === null || candidate === void 0 ? void 0 : candidate.grade }),
            React.createElement(InfoRow, { label: "Nationality", value: candidate === null || candidate === void 0 ? void 0 : candidate.nationality }),
            React.createElement(InfoRow, { label: "Interview Date", value: candidate === null || candidate === void 0 ? void 0 : candidate.interviewDate }))));
}
function InfoRow(_a) {
    var label = _a.label, value = _a.value;
    return (React.createElement("div", { className: "flex flex-col gap-1" },
        React.createElement("span", { className: "text-[10px] font-semibold uppercase tracking-widest text-slate-400" }, label),
        React.createElement("div", { className: "rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700 font-semibold" }, value || '�')));
}
//# sourceMappingURL=CandidateInfo.js.map