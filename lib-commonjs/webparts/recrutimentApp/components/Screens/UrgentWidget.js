"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var lucide_react_1 = require("lucide-react");
var cn_1 = require("../../utilities/cn");
var UrgentWidget = function (_a) {
    var tasks = _a.tasks;
    return (react_1.default.createElement("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6" },
        react_1.default.createElement("div", { className: "flex items-center justify-between mb-6" },
            react_1.default.createElement("h3", { className: "text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2" },
                react_1.default.createElement(lucide_react_1.AlertCircle, { size: 14, className: "text-red-500" }),
                "Urgent"),
            react_1.default.createElement("span", { className: "bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-100" },
                tasks.length,
                " TASKS")),
        react_1.default.createElement("div", { className: "flex flex-col gap-3" }, tasks.map(function (task, idx) { return (react_1.default.createElement("div", { key: idx, className: "p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all cursor-pointer group" },
            react_1.default.createElement("div", { className: "flex justify-between items-start" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("div", { className: "text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors" }, task.title),
                    react_1.default.createElement("div", { className: "text-[10px] font-medium text-slate-400 mt-0.5" }, task.subtitle)),
                react_1.default.createElement("span", { className: (0, cn_1.cn)('text-[8px] font-bold px-1.5 py-0.5 rounded border', task.type === 'error'
                        ? 'bg-red-50 text-red-600 border-red-100'
                        : 'bg-orange-50 text-orange-600 border-orange-100') }, task.overdue)))); }))));
};
exports.default = UrgentWidget;
//# sourceMappingURL=UrgentWidget.js.map