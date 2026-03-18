"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardSkeleton = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var framer_motion_1 = require("framer-motion");
require("./Dashboard.scss");
var skeletonFade = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.15 } }
};
var DashboardSkeleton = function () {
    return (react_1.default.createElement(framer_motion_1.motion.div, { className: "dashboard-skeleton", variants: skeletonFade, initial: "hidden", animate: "visible", exit: "exit" },
        react_1.default.createElement("div", { className: "dashboard-skeleton__metrics" }, Array.from({ length: 5 }).map(function (_, idx) { return (react_1.default.createElement("div", { key: "metric-skel-".concat(idx), className: "dashboard-skeleton__metric-card" },
            react_1.default.createElement("div", { className: "dashboard-skeleton__bar dashboard-skeleton__bar--sm" }),
            react_1.default.createElement("div", { className: "dashboard-skeleton__bar dashboard-skeleton__bar--lg" }))); })),
        react_1.default.createElement("div", { className: "dashboard-skeleton__layout" },
            react_1.default.createElement("div", { className: "dashboard-skeleton__tracker" },
                react_1.default.createElement("div", { className: "dashboard-skeleton__title" }),
                react_1.default.createElement("div", { className: "dashboard-skeleton__table" }, Array.from({ length: 6 }).map(function (_, idx) { return (react_1.default.createElement("div", { key: "row-skel-".concat(idx), className: "dashboard-skeleton__row" },
                    react_1.default.createElement("div", { className: "dashboard-skeleton__line" }),
                    react_1.default.createElement("div", { className: "dashboard-skeleton__line" }),
                    react_1.default.createElement("div", { className: "dashboard-skeleton__line" }))); }))),
            react_1.default.createElement("div", { className: "dashboard-skeleton__priority" },
                react_1.default.createElement("div", { className: "dashboard-skeleton__title" }),
                react_1.default.createElement("div", { className: "dashboard-skeleton__progress-group" }, Array.from({ length: 4 }).map(function (_, idx) { return (react_1.default.createElement("div", { key: "priority-skel-".concat(idx), className: "dashboard-skeleton__progress" },
                    react_1.default.createElement("div", { className: "dashboard-skeleton__bar dashboard-skeleton__bar--md" }),
                    react_1.default.createElement("div", { className: "dashboard-skeleton__bar dashboard-skeleton__bar--xl" }))); }))),
            react_1.default.createElement("div", { className: "dashboard-skeleton__urgent" },
                react_1.default.createElement("div", { className: "dashboard-skeleton__title" }),
                react_1.default.createElement("div", { className: "dashboard-skeleton__urgent-list" }, Array.from({ length: 3 }).map(function (_, idx) { return (react_1.default.createElement("div", { key: "urgent-skel-".concat(idx), className: "dashboard-skeleton__urgent-card" },
                    react_1.default.createElement("div", { className: "dashboard-skeleton__bar dashboard-skeleton__bar--md" }),
                    react_1.default.createElement("div", { className: "dashboard-skeleton__bar dashboard-skeleton__bar--sm" }))); }))))));
};
exports.DashboardSkeleton = DashboardSkeleton;
//# sourceMappingURL=DashboardSkeleton.js.map