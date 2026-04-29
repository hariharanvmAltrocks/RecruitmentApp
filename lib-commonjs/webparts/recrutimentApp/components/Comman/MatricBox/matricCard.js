"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var framer_motion_1 = require("framer-motion");
var react_1 = tslib_1.__importDefault(require("react"));
var lucide_react_1 = require("lucide-react");
var cn_1 = require("../../../utilities/cn");
var MetricCard = function (_a) {
    var metric = _a.metric, active = _a.active, onClick = _a.onClick;
    return (react_1.default.createElement(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, whileHover: { scale: 1.02, y: -2 }, whileTap: { scale: 0.96 }, transition: {
            layout: { type: "spring", stiffness: 300, damping: 30 },
            scale: { type: "spring", stiffness: 400, damping: 25 },
        }, onClick: onClick, className: (0, cn_1.cn)("metric-card", active && "metric-card--active"), role: "button", tabIndex: 0, onKeyDown: function (e) { return e.key === "Enter" && onClick(); }, "aria-pressed": active },
        active && (react_1.default.createElement(framer_motion_1.motion.div, { layoutId: "active-bg", className: "metric-card__active-bg", initial: false, transition: { type: "spring", stiffness: 300, damping: 30 }, style: {
                position: "absolute",
                inset: 0,
                borderRadius: 999,
                background: "linear-gradient(135deg, #7c3aed, #9333ea)",
                zIndex: 1,
            } })),
        react_1.default.createElement("div", { className: "metric-card__icon-wrap" },
            react_1.default.createElement(framer_motion_1.motion.div, { className: "metric-card__icon", style: {
                    background: active ? "rgba(255,255,255,0.2)" : "#f3f4f6",
                    boxShadow: active
                        ? "inset 0 0 0 1px rgba(255,255,255,0.4)"
                        : "none",
                } },
                react_1.default.createElement(metric.icon, { size: 20, strokeWidth: 2.5, style: { color: active ? "#fff" : "#6b7280" } }))),
        react_1.default.createElement("div", { className: "metric-card__body" },
            react_1.default.createElement(framer_motion_1.motion.span, { className: "metric-card__label" }, metric.label),
            react_1.default.createElement(framer_motion_1.motion.span, { className: "metric-card__value" }, metric.value.toString().padStart(2, "0"))),
        react_1.default.createElement(framer_motion_1.motion.div, { className: "metric-card__arrow", style: { zIndex: 2 } },
            react_1.default.createElement(lucide_react_1.ChevronRight, { size: 16, strokeWidth: 3 }))));
};
exports.default = MetricCard;
//# sourceMappingURL=matricCard.js.map