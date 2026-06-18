"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var framer_motion_1 = require("framer-motion");
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var cn_1 = require("../../../utilities/cn");
require("./matricard.scss");
var RoleContext_1 = require("../../../utilities/hooks/RoleContext");
var Taskpattern_1 = tslib_1.__importDefault(require("./Taskpattern"));
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
var OVERSIGHT_ICON_MAP = {
    interviews_scheduled: { icon: lucide_react_1.Calendar, color: "#3b82f6", bg: "#eff6ff" },
    offer_letters_released: { icon: lucide_react_1.FileText, color: "#10b981", bg: "#f0fdf4" },
    offers_accepted: { icon: lucide_react_1.UserCheck, color: "#8b5cf6", bg: "#f5f3ff" },
    offers_rejected: { icon: lucide_react_1.XCircle, color: "#ef4444", bg: "#fef2f2" },
    candidates_onboarded: { icon: lucide_react_1.UserPlus, color: "#f97316", bg: "#fff7ed" },
};
var FALLBACK_OVERSIGHT = { icon: lucide_react_1.Activity, color: "#6b7280", bg: "#f9fafb" };
var OversightStat = function (_a) {
    var _b, _c, _d, _e, _f;
    var metric = _a.metric, index = _a.index, onClick = _a.onClick;
    var slug = (_c = (_b = metric.id) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : metric.label.toLowerCase().replace(/\s+/g, "_");
    var resolved = (_d = OVERSIGHT_ICON_MAP[slug]) !== null && _d !== void 0 ? _d : FALLBACK_OVERSIGHT;
    var Icon = (_e = metric.icon) !== null && _e !== void 0 ? _e : resolved.icon;
    var color = (_f = metric.color) !== null && _f !== void 0 ? _f : resolved.color;
    return (react_1.default.createElement(framer_motion_1.motion.div, { className: "oversight-stat", initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.06, duration: 0.2 }, onClick: function () { return onClick(metric); } },
        react_1.default.createElement("div", { className: "oversight-stat__top" },
            react_1.default.createElement("div", { className: "oversight-stat__icon-wrap" },
                react_1.default.createElement(Icon, { size: 20, style: { color: color }, strokeWidth: 2.5 })),
            react_1.default.createElement("span", { className: "oversight-stat__num" }, metric.value.toString().padStart(2, "0"))),
        react_1.default.createElement("span", { className: "oversight-stat__label" }, metric.label.toUpperCase())));
};
// ─── MetricDashboard ──────────────────────────────────────────────────────────
var MetricDashboard = function (_a) {
    var _b;
    var metrics = _a.metrics, onCardClick = _a.onCardClick, loading = _a.loading, handleRefresh = _a.handleRefresh, active = _a.active;
    var ADGroupData = (0, RoleContext_1.userInfo)().ADGroupData;
    var user = (_b = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.userDetails) === null || _b === void 0 ? void 0 : _b[0];
    var UserName = [user === null || user === void 0 ? void 0 : user.FirstName, user === null || user === void 0 ? void 0 : user.MiddleName, user === null || user === void 0 ? void 0 : user.LastName]
        .filter(Boolean)
        .join(" ");
    var _c = (0, react_1.useState)(false), oversightOpen = _c[0], setOversightOpen = _c[1];
    var _d = (0, react_1.useState)(false), myTasks = _d[0], setMyTasks = _d[1];
    var btnRef = (0, react_1.useRef)(null);
    var taskMetrics = metrics.filter(function (m) { return m.showArrow === true && m.value > 0; });
    var oversightMetrics = metrics.filter(function (m) { return m.showArrow === false; });
    var urgentCount = metrics.filter(function (m) { return m.value > 0 && m.showArrow === true; }).length;
    var handleCardClick = function (metric) {
        onCardClick === null || onCardClick === void 0 ? void 0 : onCardClick(metric);
    };
    return (react_1.default.createElement("div", { className: "metric-dashboard" },
        react_1.default.createElement("div", { className: "metric-dashboard__topbar" },
            react_1.default.createElement("div", { className: "metric-dashboard__welcome" },
                react_1.default.createElement("h1", { className: "metric-dashboard__welcome-title" },
                    strings.Welcome,
                    " ",
                    react_1.default.createElement("span", { className: "metric-dashboard__welcome-name" }, UserName)),
                urgentCount > 0 ? (react_1.default.createElement("div", { className: "metric-dashboard__urgent-banner", onClick: function () { return setMyTasks(true); }, role: "button", tabIndex: 0, onKeyDown: function (e) { return e.key === "Enter" && setMyTasks(true); } },
                    react_1.default.createElement("div", { className: "metric-dashboard__urgent-banner-left" },
                        react_1.default.createElement(lucide_react_1.AlertCircle, { className: "metric-dashboard__urgent-icon", size: 16 }),
                        react_1.default.createElement("div", { className: "metric-dashboard__urgent-text-container" },
                            react_1.default.createElement("span", { className: "metric-dashboard__urgent-title" },
                                strings.YouHave,
                                " ",
                                react_1.default.createElement("strong", null,
                                    urgentCount,
                                    " ",
                                    strings.UrgentAction,
                                    urgentCount !== 1 ? "S" : ""),
                                " ",
                                strings.ToProcess),
                            react_1.default.createElement("span", { className: "metric-dashboard__urgent-subtitle" }, strings.tasklinkDetails))),
                    react_1.default.createElement(lucide_react_1.ArrowRight, { className: "metric-dashboard__urgent-arrow", size: 16 }))) : (react_1.default.createElement("p", { className: "metric-dashboard__no-urgent" }, "No urgent actions to process today"))),
            react_1.default.createElement("div", { style: { display: "flex", justifyContent: "end", gap: "10px" } },
                taskMetrics.length > 0 && (react_1.default.createElement("div", { className: "metric-dashboard__oversight-anchor" },
                    react_1.default.createElement("button", { ref: btnRef, className: (0, cn_1.cn)("metric-dashboard__oversight-btn", myTasks && "metric-dashboard__oversight-btn--open"), onClick: function () { return setMyTasks(function (prev) { return !prev; }); }, "aria-expanded": myTasks, "aria-controls": "oversight-panel" },
                        react_1.default.createElement("div", { className: "metric-dashboard__oversight-btn-icon" },
                            react_1.default.createElement(lucide_react_1.Activity, { size: 14, strokeWidth: 2.5 })),
                        react_1.default.createElement("span", null, strings.MyTasks),
                        react_1.default.createElement("svg", { className: "metric-dashboard__oversight-chevron", xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" },
                            react_1.default.createElement("polyline", { points: "6 9 12 15 18 9" }))),
                    react_1.default.createElement(framer_motion_1.AnimatePresence, null, myTasks && (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement("div", { className: "metric-dashboard__oversight-backdrop", onClick: function () { return setMyTasks(false); } }),
                        react_1.default.createElement(framer_motion_1.motion.div, { id: "oversight-panel", className: (0, cn_1.cn)("metric-dashboard__oversight-popup", taskMetrics.length > 6 && "metric-dashboard__oversight-popup--wide"), initial: { opacity: 0, y: -8, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -8, scale: 0.97 }, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } },
                            react_1.default.createElement(Taskpattern_1.default, { metrics: taskMetrics, onStepClick: function (m) { return onCardClick(m); }, activeId: 3 }))))))),
                oversightMetrics.length > 0 && (react_1.default.createElement("div", { className: "metric-dashboard__oversight-anchor" },
                    react_1.default.createElement("button", { ref: btnRef, className: (0, cn_1.cn)("metric-dashboard__oversight-btn", oversightOpen && "metric-dashboard__oversight-btn--open"), onClick: function () { return setOversightOpen(function (prev) { return !prev; }); }, "aria-expanded": oversightOpen, "aria-controls": "oversight-panel" },
                        react_1.default.createElement("div", { className: "metric-dashboard__oversight-btn-icon" },
                            react_1.default.createElement(lucide_react_1.Activity, { size: 14, strokeWidth: 2.5 })),
                        react_1.default.createElement("span", null, strings.OngoingOversights),
                        react_1.default.createElement("svg", { className: "metric-dashboard__oversight-chevron", xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" },
                            react_1.default.createElement("polyline", { points: "6 9 12 15 18 9" }))),
                    react_1.default.createElement(framer_motion_1.AnimatePresence, null, oversightOpen && (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement("div", { className: "metric-dashboard__oversight-backdrop", onClick: function () { return setOversightOpen(false); } }),
                        react_1.default.createElement(framer_motion_1.motion.div, { id: "oversight-panel", className: "metric-dashboard__oversight-popup_ongoing", initial: { opacity: 0, y: -8, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -8, scale: 0.97 }, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } },
                            react_1.default.createElement("div", { className: "oversight-popup__inner" }, oversightMetrics.map(function (metric, i) {
                                var _a;
                                return (react_1.default.createElement(OversightStat, { key: (_a = metric.id) !== null && _a !== void 0 ? _a : i, metric: metric, index: i, onClick: function () { return handleCardClick(metric); } }));
                            }))))))))))));
};
exports.default = MetricDashboard;
//# sourceMappingURL=matric.js.map