"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HRWorkflowOverview = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var HRWorkflowOverview_module_scss_1 = tslib_1.__importDefault(require("./HRWorkflowOverview.module.scss"));
var HRWorkflowOverview = function (_a) {
    var data = _a.data, loading = _a.loading;
    var sources = data || [];
    if (loading) {
        return (react_1.default.createElement("div", { className: HRWorkflowOverview_module_scss_1.default.containerCard, "aria-label": "Positions by Source Overview Loading" },
            react_1.default.createElement("div", { className: HRWorkflowOverview_module_scss_1.default.header },
                react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "150px", height: "14px" } })),
            react_1.default.createElement("div", { className: HRWorkflowOverview_module_scss_1.default.bodyGrid }, Array.from({ length: 5 }).map(function (_, idx) { return (react_1.default.createElement("div", { key: idx, className: HRWorkflowOverview_module_scss_1.default.sourceCard, style: { opacity: 0.8 } },
                react_1.default.createElement("div", { className: HRWorkflowOverview_module_scss_1.default.sourceCard__header },
                    react_1.default.createElement("div", { className: HRWorkflowOverview_module_scss_1.default.sourceCard__info },
                        react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "32px", height: "32px", borderRadius: "50%", marginRight: "8px" } }),
                        react_1.default.createElement("div", { className: HRWorkflowOverview_module_scss_1.default.sourceCard__meta },
                            react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "80px", height: "12px", marginBottom: "6px" } }),
                            react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "60px", height: "10px" } }))),
                    react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "35px", height: "16px", borderRadius: "4px" } })),
                react_1.default.createElement("div", { className: HRWorkflowOverview_module_scss_1.default.sourceCard__metrics }, Array.from({ length: 3 }).map(function (_, mIdx) { return (react_1.default.createElement("div", { key: mIdx, className: HRWorkflowOverview_module_scss_1.default.metricBox },
                    react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "20px", height: "16px", marginBottom: "6px" } }),
                    react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "35px", height: "8px" } }))); })))); })),
            react_1.default.createElement("div", { className: HRWorkflowOverview_module_scss_1.default.footer },
                react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "100px", height: "12px" } }))));
    }
    return (react_1.default.createElement("div", { className: HRWorkflowOverview_module_scss_1.default.containerCard, "aria-label": "Positions by Source Overview" },
        react_1.default.createElement("div", { className: HRWorkflowOverview_module_scss_1.default.header },
            react_1.default.createElement("span", { className: HRWorkflowOverview_module_scss_1.default.title }, "POSITIONS BY SOURCE")),
        react_1.default.createElement("div", { className: HRWorkflowOverview_module_scss_1.default.bodyGrid }, sources.map(function (wf) {
            var avatarClass = HRWorkflowOverview_module_scss_1.default["avatar--".concat(wf.avatarTheme)] || HRWorkflowOverview_module_scss_1.default["avatar--blue"];
            var pctClass = HRWorkflowOverview_module_scss_1.default["pct--".concat(wf.avatarTheme)] || HRWorkflowOverview_module_scss_1.default["pct--blue"];
            return (react_1.default.createElement("div", { key: wf.name, className: HRWorkflowOverview_module_scss_1.default.sourceCard },
                react_1.default.createElement("div", { className: HRWorkflowOverview_module_scss_1.default.sourceCard__header },
                    react_1.default.createElement("div", { className: HRWorkflowOverview_module_scss_1.default.sourceCard__info },
                        react_1.default.createElement("div", { className: "".concat(HRWorkflowOverview_module_scss_1.default.sourceCard__avatar, " ").concat(avatarClass) }, wf.avatarText),
                        react_1.default.createElement("div", { className: HRWorkflowOverview_module_scss_1.default.sourceCard__meta },
                            react_1.default.createElement("span", { className: HRWorkflowOverview_module_scss_1.default.sourceCard__name }, wf.name),
                            react_1.default.createElement("span", { className: HRWorkflowOverview_module_scss_1.default.sourceCard__subtext },
                                wf.positionsCount,
                                " Positions"))),
                    react_1.default.createElement("div", { className: "".concat(HRWorkflowOverview_module_scss_1.default.sourceCard__pct, " ").concat(pctClass) },
                        wf.percentage,
                        "%")),
                react_1.default.createElement("div", { className: HRWorkflowOverview_module_scss_1.default.sourceCard__metrics },
                    react_1.default.createElement("div", { className: HRWorkflowOverview_module_scss_1.default.metricBox },
                        react_1.default.createElement("span", { className: "".concat(HRWorkflowOverview_module_scss_1.default.metricBox__val, " ").concat(HRWorkflowOverview_module_scss_1.default["metricBox__val--pending"]) }, wf.pending),
                        react_1.default.createElement("span", { className: HRWorkflowOverview_module_scss_1.default.metricBox__label }, "Pending")),
                    react_1.default.createElement("div", { className: HRWorkflowOverview_module_scss_1.default.metricBox },
                        react_1.default.createElement("span", { className: "".concat(HRWorkflowOverview_module_scss_1.default.metricBox__val, " ").concat(HRWorkflowOverview_module_scss_1.default["metricBox__val--done"]) }, wf.done),
                        react_1.default.createElement("span", { className: HRWorkflowOverview_module_scss_1.default.metricBox__label }, "Done")),
                    react_1.default.createElement("div", { className: HRWorkflowOverview_module_scss_1.default.metricBox },
                        react_1.default.createElement("span", { className: "".concat(HRWorkflowOverview_module_scss_1.default.metricBox__val, " ").concat(HRWorkflowOverview_module_scss_1.default["metricBox__val--total"]) }, wf.total),
                        react_1.default.createElement("span", { className: HRWorkflowOverview_module_scss_1.default.metricBox__label }, "Total")))));
        }))));
};
exports.HRWorkflowOverview = HRWorkflowOverview;
exports.default = exports.HRWorkflowOverview;
//# sourceMappingURL=HRWorkflowOverview.js.map