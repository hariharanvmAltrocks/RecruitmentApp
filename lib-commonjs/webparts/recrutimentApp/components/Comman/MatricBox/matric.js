"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var framer_motion_1 = require("framer-motion");
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var cn_1 = require("../../../utilities/cn");
require("./matricard.scss");
var matricCard_1 = tslib_1.__importDefault(require("./matricCard"));
var RoleContext_1 = require("../../../utilities/hooks/RoleContext");
// Maps oversight-only metrics (showArrow: false) to their display icon + accent.
// Extend this map to match your actual metric ids / labels.
var OVERSIGHT_ICON_MAP = {
    interviews_scheduled: { icon: lucide_react_1.Calendar, color: "#3b82f6", bg: "#eff6ff" },
    offer_letters_released: { icon: lucide_react_1.FileText, color: "#10b981", bg: "#f0fdf4" },
    offers_accepted: { icon: lucide_react_1.UserCheck, color: "#8b5cf6", bg: "#f5f3ff" },
    offers_rejected: { icon: lucide_react_1.XCircle, color: "#ef4444", bg: "#fef2f2" },
    candidates_onboarded: { icon: lucide_react_1.UserPlus, color: "#f97316", bg: "#fff7ed" },
};
// Fallback for unrecognised oversight metrics
var FALLBACK_OVERSIGHT = { icon: lucide_react_1.Activity, color: "#6b7280", bg: "#f9fafb" };
var OversightStat = function (_a) {
    var _b, _c, _d, _e, _f, _g;
    var metric = _a.metric, index = _a.index;
    // Try to resolve icon by metric id, then by label slug
    var slug = (_c = (_b = metric.id) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : metric.label.toLowerCase().replace(/\s+/g, "_");
    var resolved = (_d = OVERSIGHT_ICON_MAP[slug]) !== null && _d !== void 0 ? _d : FALLBACK_OVERSIGHT;
    var Icon = (_e = metric.icon) !== null && _e !== void 0 ? _e : resolved.icon;
    var color = (_f = metric.color) !== null && _f !== void 0 ? _f : resolved.color;
    var bg = (_g = metric.bgColor) !== null && _g !== void 0 ? _g : resolved.bg;
    return (react_1.default.createElement(framer_motion_1.motion.div, { className: "oversight-stat", initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.06, duration: 0.2 } },
        react_1.default.createElement("div", { className: "oversight-stat__top" },
            react_1.default.createElement("div", { className: "oversight-stat__icon-wrap" },
                react_1.default.createElement(Icon, { size: 20, style: { color: color }, strokeWidth: 2.5 })),
            react_1.default.createElement("span", { className: "oversight-stat__num" }, metric.value.toString().padStart(2, "0"))),
        react_1.default.createElement("span", { className: "oversight-stat__label" }, metric.label.toUpperCase())));
};
// ─── MetricDashboard (main export) ───────────────────────────────────────────
var MetricDashboard = function (_a) {
    var _b;
    var metrics = _a.metrics, onCardClick = _a.onCardClick, loading = _a.loading, handleRefresh = _a.handleRefresh, active = _a.active;
    var ADGroupData = (0, RoleContext_1.userInfo)().ADGroupData;
    var user = (_b = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.userDetails) === null || _b === void 0 ? void 0 : _b[0];
    var UserName = [user === null || user === void 0 ? void 0 : user.FirstName, user === null || user === void 0 ? void 0 : user.MiddleName, user === null || user === void 0 ? void 0 : user.LastName];
    var _c = (0, react_1.useState)(false), oversightOpen = _c[0], setOversightOpen = _c[1];
    // const [activeMetricId, setActiveMetricId] = useState<number | string | null>(
    //   () => {
    //     const first = metrics.find((m) => m.showArrow);
    //     return first?.id ?? null;
    //   },
    // );
    var taskMetrics = metrics.filter(function (m) { return m.showArrow === true; });
    var oversightMetrics = metrics.filter(function (m) { return m.showArrow === false; });
    var urgentCount = metrics.filter(function (m) { return m.value > 0; }).length;
    var handleCardClick = function (metric) {
        // setActiveMetricId(metric.id);
        onCardClick === null || onCardClick === void 0 ? void 0 : onCardClick(metric);
    };
    return (react_1.default.createElement("div", { className: "metric-dashboard" },
        react_1.default.createElement("div", { className: "metric-dashboard__topbar" },
            react_1.default.createElement("div", { className: "metric-dashboard__welcome" },
                react_1.default.createElement("h1", { className: "metric-dashboard__welcome-title" },
                    "Welcome,",
                    " ",
                    react_1.default.createElement("span", { className: "metric-dashboard__welcome-name" }, UserName)),
                urgentCount > 0 && (react_1.default.createElement("p", { className: "metric-dashboard__urgent" },
                    "YOU HAVE",
                    " ",
                    react_1.default.createElement("strong", null,
                        urgentCount,
                        " URGENT ACTION",
                        urgentCount !== 1 ? "S" : ""),
                    " ",
                    "TO PROCESS"))),
            oversightMetrics.length > 0 && (react_1.default.createElement("button", { className: (0, cn_1.cn)("metric-dashboard__oversight-btn", oversightOpen && "metric-dashboard__oversight-btn--open"), onClick: function () { return setOversightOpen(function (prev) { return !prev; }); }, "aria-expanded": oversightOpen, "aria-controls": "oversight-panel" },
                react_1.default.createElement("div", { className: "metric-dashboard__oversight-btn-icon" },
                    react_1.default.createElement(lucide_react_1.Activity, { size: 14, strokeWidth: 2.5 })),
                react_1.default.createElement("span", null, "ONGOING OVERSIGHTS"),
                react_1.default.createElement(lucide_react_1.ChevronDown, { size: 14, strokeWidth: 2.5, className: "metric-dashboard__oversight-chevron" })))),
        react_1.default.createElement(framer_motion_1.AnimatePresence, null, oversightOpen && oversightMetrics.length > 0 && (react_1.default.createElement(framer_motion_1.motion.div, { id: "oversight-panel", className: "metric-dashboard__oversight-panel", initial: { height: 0, opacity: 0, marginBottom: 0 }, animate: { height: "auto", opacity: 1, marginBottom: 20 }, exit: { height: 0, opacity: 0, marginBottom: 0 }, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
            react_1.default.createElement("div", { className: "oversight-panel__inner" }, oversightMetrics.map(function (metric, i) {
                var _a;
                return (react_1.default.createElement(OversightStat, { key: (_a = metric.id) !== null && _a !== void 0 ? _a : i, metric: metric, index: i }));
            }))))),
        react_1.default.createElement("div", { className: "metric-dashboard__section-header" },
            react_1.default.createElement("div", { className: "metric-dashboard__section-icon" },
                react_1.default.createElement(lucide_react_1.Zap, { size: 15, strokeWidth: 2.5, color: "#fff" })),
            react_1.default.createElement("div", null,
                react_1.default.createElement("p", { className: "metric-dashboard__section-title" }, "TASKS TO FINALIZE"),
                react_1.default.createElement("p", { className: "metric-dashboard__section-subtitle" }, "PROCESS THESE ITEMS TO KEEP MOMENTUM")),
            react_1.default.createElement("div", { className: "refresh-btn-container" },
                react_1.default.createElement("button", { className: "refresh-btn", onClick: handleRefresh, disabled: loading },
                    react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: loading ? "spin" : "" },
                        react_1.default.createElement("path", { d: "M21 2v6h-6" }),
                        react_1.default.createElement("path", { d: "M3 12a9 9 0 0 1 15-6.7L21 8" }),
                        react_1.default.createElement("path", { d: "M3 22v-6h6" }),
                        react_1.default.createElement("path", { d: "M21 12a9 9 0 0 1-15 6.7L3 16" })),
                    "Refresh"))),
        react_1.default.createElement("div", { className: "metric-dashboard__grid" }, loading
            ? Array.from({ length: 6 }).map(function (_, i) { return (react_1.default.createElement(framer_motion_1.motion.div, { key: "skeleton-".concat(i), initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.05, duration: 0.2 } },
                react_1.default.createElement("div", { className: "metric-card metric-card--skeleton" },
                    react_1.default.createElement("div", { className: "metric-card__icon-wrap" },
                        react_1.default.createElement("div", { className: "skeleton-icon" })),
                    react_1.default.createElement("div", { className: "metric-card__body" },
                        react_1.default.createElement("div", { className: "skeleton-label" }),
                        react_1.default.createElement("div", { className: "skeleton-value" }))))); })
            : taskMetrics.map(function (metric, i) {
                var _a;
                return (react_1.default.createElement(framer_motion_1.motion.div, { key: (_a = metric.id) !== null && _a !== void 0 ? _a : i, initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.05, duration: 0.22 } },
                    react_1.default.createElement(matricCard_1.default, { metric: metric, active: active === metric.id, onClick: function () { return handleCardClick(metric); } })));
            }))));
};
exports.default = MetricDashboard;
//# sourceMappingURL=matric.js.map