"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ScorecardDetails;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var ScorecardDetails_module_scss_1 = tslib_1.__importDefault(require("./ScorecardDetails.module.scss"));
function ScorecardDetails(_a) {
    var summary = _a.summary;
    return (React.createElement("section", { className: "bg-white border border-slate-200 rounded-2xl p-6 shadow-sm ".concat(ScorecardDetails_module_scss_1.default.scorecard) },
        React.createElement("div", { className: "flex items-start justify-between mb-6" },
            React.createElement("div", null,
                React.createElement("h3", { className: "text-sm font-bold text-slate-800" }, "Scorecard Summary"),
                React.createElement("p", { className: "text-xs text-slate-500" }, "Aggregated interview performance")),
            React.createElement("span", { className: statusClass(summary.status) }, summary.status)),
        React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4" },
            React.createElement(SummaryTile, { label: "Total Score", value: summary.total.toString() }),
            React.createElement(SummaryTile, { label: "Average", value: summary.average.toString() }),
            React.createElement(SummaryTile, { label: "Status", value: summary.status }))));
}
function SummaryTile(_a) {
    var label = _a.label, value = _a.value;
    return (React.createElement("div", { className: "rounded-xl border border-slate-100 bg-slate-50 px-4 py-3" },
        React.createElement("div", { className: "text-[10px] font-semibold uppercase tracking-widest text-slate-400" }, label),
        React.createElement("div", { className: "text-lg font-bold text-slate-800 mt-1" }, value)));
}
function statusClass(status) {
    switch (status) {
        case 'Pass':
            return 'text-xs font-semibold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full';
        case 'Borderline':
            return 'text-xs font-semibold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full';
        case 'Fail':
            return 'text-xs font-semibold uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full';
        default:
            return 'text-xs font-semibold uppercase tracking-widest text-slate-500 bg-slate-100 px-3 py-1 rounded-full';
    }
}
//# sourceMappingURL=ScorecardDetails.js.map