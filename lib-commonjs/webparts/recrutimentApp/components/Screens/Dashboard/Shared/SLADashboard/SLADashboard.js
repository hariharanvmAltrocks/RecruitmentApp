"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLADashboard = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var recharts_1 = require("recharts");
var Lucide = tslib_1.__importStar(require("lucide-react"));
var SLADashboard_module_scss_1 = tslib_1.__importDefault(require("./SLADashboard.module.scss"));
var useSLACompliance_1 = tslib_1.__importDefault(require("../../Hooks/useSLACompliance"));
var SLADashboard = function () {
    var _a;
    var _b = (0, useSLACompliance_1.default)(), data = _b.data, loading = _b.loading, error = _b.error;
    if (loading) {
        return (react_1.default.createElement("div", { className: SLADashboard_module_scss_1.default.slaCard, "aria-busy": "true", "aria-label": "Loading SLA Dashboard" },
            react_1.default.createElement("div", { className: SLADashboard_module_scss_1.default.slaCard__header },
                react_1.default.createElement("span", { className: SLADashboard_module_scss_1.default.slaCard__title }, "SLA COMPLIANCE")),
            react_1.default.createElement("div", { className: SLADashboard_module_scss_1.default.slaCard__loadingBody },
                react_1.default.createElement("div", { className: SLADashboard_module_scss_1.default.slaCard__skeletonHalfRing }))));
    }
    if (error || !data) {
        return (react_1.default.createElement("div", { className: SLADashboard_module_scss_1.default.slaCard },
            react_1.default.createElement("div", { className: SLADashboard_module_scss_1.default.slaCard__header },
                react_1.default.createElement("span", { className: SLADashboard_module_scss_1.default.slaCard__title }, "SLA COMPLIANCE")),
            react_1.default.createElement("div", { className: SLADashboard_module_scss_1.default.slaCard__errorBody },
                react_1.default.createElement(Lucide.AlertCircle, { size: 32 }),
                react_1.default.createElement("p", null, "Error loading SLA"))));
    }
    var value = (_a = data.overallSla) !== null && _a !== void 0 ? _a : 78;
    var chartData = [
        { value: value },
        { value: 100 - value }
    ];
    // Orange color as in screenshot
    var activeColor = "#ea580c";
    var COLORS = [activeColor, "#e2e8f0"];
    return (react_1.default.createElement("div", { className: SLADashboard_module_scss_1.default.slaCard, "aria-label": "SLA Compliance Dashboard" },
        react_1.default.createElement("div", { className: SLADashboard_module_scss_1.default.slaCard__header },
            react_1.default.createElement("span", { className: SLADashboard_module_scss_1.default.slaCard__title }, "SLA COMPLIANCE")),
        react_1.default.createElement("div", { className: SLADashboard_module_scss_1.default.slaCard__body },
            react_1.default.createElement("div", { className: SLADashboard_module_scss_1.default.slaCard__visual },
                react_1.default.createElement("div", { className: SLADashboard_module_scss_1.default.slaCard__gaugeWrapper },
                    react_1.default.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: 120 },
                        react_1.default.createElement(recharts_1.PieChart, { margin: { top: 10, bottom: 0 } },
                            react_1.default.createElement(recharts_1.Pie, { data: chartData, cx: "50%", cy: "90%", startAngle: 180, endAngle: 0, innerRadius: 36, outerRadius: 50, dataKey: "value", stroke: "none" },
                                react_1.default.createElement(recharts_1.Cell, { fill: COLORS[0] }),
                                react_1.default.createElement(recharts_1.Cell, { fill: COLORS[1] })))),
                    react_1.default.createElement("div", { className: SLADashboard_module_scss_1.default.slaCard__textCenter },
                        react_1.default.createElement("span", { className: SLADashboard_module_scss_1.default.slaCard__value },
                            value,
                            "%"),
                        react_1.default.createElement("span", { className: SLADashboard_module_scss_1.default.slaCard__label }, "SLA Compliance")))))));
};
exports.SLADashboard = SLADashboard;
exports.default = exports.SLADashboard;
//# sourceMappingURL=SLADashboard.js.map