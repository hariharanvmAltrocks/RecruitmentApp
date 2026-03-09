"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var framer_motion_1 = require("framer-motion");
var react_1 = tslib_1.__importDefault(require("react"));
var cn_1 = require("../../utilities/cn");
var MetricCard = function (_a) {
    var metric = _a.metric, active = _a.active, onClick = _a.onClick;
    return (react_1.default.createElement(framer_motion_1.motion.div, { whileHover: { y: -2 }, onClick: onClick, className: (0, cn_1.cn)('flex flex-col p-4 bg-white rounded-xl border transition-all cursor-pointer min-w-[160px] flex-1', active
            ? 'border-blue-500 ring-1 ring-blue-500 shadow-lg shadow-blue-100'
            : 'border-slate-100 hover:border-blue-200 shadow-sm') },
        react_1.default.createElement("div", { className: "flex justify-between items-start mb-3" },
            react_1.default.createElement("div", { className: (0, cn_1.cn)('p-2 rounded-lg', metric.bgColor) },
                react_1.default.createElement(metric.icon, { size: 18, className: metric.color })),
            react_1.default.createElement("span", { className: (0, cn_1.cn)('text-[10px] font-bold px-2 py-0.5 rounded-full', metric.status === 'CRITICAL'
                    ? 'bg-red-100 text-red-600'
                    : metric.status === 'ACTIVE'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-slate-100 text-slate-500') }, metric.status)),
        react_1.default.createElement("div", { className: "mt-auto" },
            react_1.default.createElement("div", { className: "text-2xl font-bold text-slate-800" }, metric.value.toString().padStart(2, '0')),
            react_1.default.createElement("div", { className: "text-[11px] text-slate-500 font-medium leading-tight mt-1" }, metric.label))));
};
exports.default = MetricCard;
//# sourceMappingURL=matric.js.map