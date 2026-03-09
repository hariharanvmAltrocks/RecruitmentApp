"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var framer_motion_1 = require("framer-motion");
var react_1 = tslib_1.__importDefault(require("react"));
var cn_1 = require("../../../utilities/cn");
require("./matricard.scss");
var MetricCard = function (_a) {
    var metric = _a.metric, active = _a.active, onClick = _a.onClick;
    return (react_1.default.createElement(framer_motion_1.motion.div, { whileHover: { y: -2 }, onClick: onClick, className: (0, cn_1.cn)("metric-card", active ? "metric-card--active" : "") },
        react_1.default.createElement("div", { className: "metric-card__header" },
            react_1.default.createElement("div", { className: (0, cn_1.cn)("metric-card__icon", metric.bgColor) },
                react_1.default.createElement(metric.icon, { size: 18, className: metric.color })),
            react_1.default.createElement("span", { className: (0, cn_1.cn)("metric-card__status", metric.status === "CRITICAL"
                    ? "status-critical"
                    : metric.status === "ACTIVE"
                        ? "status-active"
                        : "status-default") }, metric.status)),
        react_1.default.createElement("div", { className: "metric-card__content" },
            react_1.default.createElement("div", { className: "metric-card__value" }, metric.value.toString().padStart(2, "0")),
            react_1.default.createElement("div", { className: "metric-card__label" }, metric.label))));
};
exports.default = MetricCard;
//# sourceMappingURL=matric.js.map