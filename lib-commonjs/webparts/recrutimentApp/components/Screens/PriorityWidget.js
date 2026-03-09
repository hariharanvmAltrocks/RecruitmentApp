"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var recharts_1 = require("recharts");
var lucide_react_1 = require("lucide-react");
var PriorityWidget = function (_a) {
    var data = _a.data;
    return (react_1.default.createElement("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6" },
        react_1.default.createElement("div", { className: "flex items-center justify-between mb-6" },
            react_1.default.createElement("h3", { className: "text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2" },
                react_1.default.createElement("div", { className: "w-1.5 h-1.5 rounded-full bg-blue-500" }),
                "Priority Tasks"),
            react_1.default.createElement("button", { className: "text-blue-600 text-[10px] font-bold uppercase tracking-wider hover:underline" }, "Manage")),
        react_1.default.createElement("div", { className: "flex items-center gap-6" },
            react_1.default.createElement("div", { className: "w-32 h-32 relative" },
                react_1.default.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: "100%" },
                    react_1.default.createElement(recharts_1.PieChart, null,
                        react_1.default.createElement(recharts_1.Pie, { data: data, cx: "50%", cy: "50%", innerRadius: 35, outerRadius: 50, paddingAngle: 5, dataKey: "value" }, data.map(function (entry, index) { return (react_1.default.createElement(recharts_1.Cell, { key: "cell-".concat(index), fill: entry.color })); })),
                        react_1.default.createElement(recharts_1.Tooltip, null))),
                react_1.default.createElement("div", { className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none" },
                    react_1.default.createElement("span", { className: "text-2xl font-bold text-slate-800" }, data.reduce(function (acc, d) { return acc + d.value; }, 0)),
                    react_1.default.createElement("span", { className: "text-[8px] font-bold text-slate-400 uppercase tracking-tighter" }, "Pendings"))),
            react_1.default.createElement("div", { className: "flex-1 flex flex-col gap-4" }, data.map(function (item, idx) {
                var total = data.reduce(function (acc, d) { return acc + d.value; }, 0);
                var pct = Math.round((item.value / total) * 100);
                return (react_1.default.createElement("div", { key: idx, className: "flex flex-col gap-1" },
                    react_1.default.createElement("div", { className: "flex items-center justify-between" },
                        react_1.default.createElement("div", { className: "flex items-center gap-2" },
                            react_1.default.createElement("div", { className: "p-1 rounded bg-slate-50 border border-slate-100" }, idx === 0 ? react_1.default.createElement(lucide_react_1.ClipboardList, { size: 12, className: "text-blue-500" }) : react_1.default.createElement(lucide_react_1.Zap, { size: 12, className: "text-orange-500" })),
                            react_1.default.createElement("span", { className: "text-[10px] font-bold text-slate-600" },
                                item.value,
                                " Tasks")),
                        react_1.default.createElement("span", { className: "text-[10px] font-bold text-slate-400" },
                            pct,
                            "%")),
                    react_1.default.createElement("div", { className: "text-[9px] font-bold text-slate-400 uppercase tracking-wider ml-6" }, item.name),
                    react_1.default.createElement("div", { className: "w-full h-1 bg-slate-100 rounded-full overflow-hidden ml-6" },
                        react_1.default.createElement("div", { className: "h-full transition-all duration-1000 rounded-full", style: { width: "".concat(pct, "%"), backgroundColor: item.color } }))));
            }))),
        react_1.default.createElement("button", { className: "w-full mt-6 bg-slate-900 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200" },
            react_1.default.createElement(lucide_react_1.Zap, { size: 14, className: "text-yellow-400 fill-yellow-400" }),
            "Process All Pendings")));
};
exports.default = PriorityWidget;
//# sourceMappingURL=PriorityWidget.js.map