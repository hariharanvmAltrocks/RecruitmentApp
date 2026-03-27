"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var framer_motion_1 = require("framer-motion");
var react_1 = tslib_1.__importDefault(require("react"));
var cn_1 = require("../../../utilities/cn");
var lucide_react_1 = require("lucide-react");
require("./matricard.scss");
var MetricCard = function (_a) {
    var metric = _a.metric, active = _a.active, onClick = _a.onClick;
    var getStatusClass = function (status) {
        var _a;
        var s = (_a = status === null || status === void 0 ? void 0 : status.toUpperCase()) !== null && _a !== void 0 ? _a : "";
        switch (s) {
            case "ACTIVE":
                return "status-active";
            case "CRITICAL":
                return "status-critical";
            case "SUCCESS":
                return "status-success";
            case "LOST":
                return "status-lost";
            default:
                return "status-default";
        }
    };
    return (react_1.default.createElement(framer_motion_1.motion.div, { whileHover: { y: -2 }, onClick: onClick, className: (0, cn_1.cn)("metric-card", active ? "metric-card--active" : "") },
        react_1.default.createElement("div", { className: "metric-card__header" },
            react_1.default.createElement("div", { className: "metric-card__icon", style: { backgroundColor: metric.bgColor } },
                react_1.default.createElement(metric.icon, { size: 20, style: { color: metric.color }, strokeWidth: 2 })),
            react_1.default.createElement("span", { className: (0, cn_1.cn)("metric-card__status", getStatusClass(metric.status)) }, metric.status)),
        react_1.default.createElement("div", { className: "metric-card__content" },
            react_1.default.createElement("div", { className: "metric-card__value" }, metric.value.toString().padStart(2, "0")),
            react_1.default.createElement("div", { className: "metric-card__footer" },
                react_1.default.createElement("div", { className: "metric-card__label" }, metric.label),
                metric.showArrow && (react_1.default.createElement(lucide_react_1.ChevronRight, { size: 16, className: "metric-card__arrow" }))))));
};
exports.default = MetricCard;
//# sourceMappingURL=matric.js.map