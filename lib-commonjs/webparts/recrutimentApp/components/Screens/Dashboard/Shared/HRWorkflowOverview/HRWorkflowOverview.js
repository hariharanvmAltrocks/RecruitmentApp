"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HRWorkflowOverview = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var Lucide = tslib_1.__importStar(require("lucide-react"));
var HRWorkflowOverview_module_scss_1 = tslib_1.__importDefault(require("./HRWorkflowOverview.module.scss"));
var MOCK_SOURCES = [
    {
        name: "Jiressa Positions",
        avatarText: "J",
        avatarTheme: "blue",
        positionsCount: 5,
        percentage: 36,
        pending: 5,
        done: 0,
        total: 14
    },
    {
        name: "Evoide Positions",
        avatarText: "E",
        avatarTheme: "green",
        positionsCount: 0,
        percentage: 0,
        pending: 0,
        done: 0,
        total: 14
    },
    {
        name: "Altkamoa02",
        avatarText: "A",
        avatarTheme: "purple",
        positionsCount: 0,
        percentage: 0,
        pending: 0,
        done: 0,
        total: 14
    },
    {
        name: "Altkamoa04",
        avatarText: "B",
        avatarTheme: "orange",
        positionsCount: 0,
        percentage: 0,
        pending: 0,
        done: 0,
        total: 14
    },
    {
        name: "Altkamoa09",
        avatarText: "C",
        avatarTheme: "teal",
        positionsCount: 0,
        percentage: 0,
        pending: 0,
        done: 0,
        total: 14
    }
];
var HRWorkflowOverview = function () {
    return (react_1.default.createElement("div", { className: HRWorkflowOverview_module_scss_1.default.containerCard, "aria-label": "Positions by Source Overview" },
        react_1.default.createElement("div", { className: HRWorkflowOverview_module_scss_1.default.header },
            react_1.default.createElement("span", { className: HRWorkflowOverview_module_scss_1.default.title }, "POSITIONS BY SOURCE")),
        react_1.default.createElement("div", { className: HRWorkflowOverview_module_scss_1.default.bodyGrid }, MOCK_SOURCES.map(function (wf) {
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
        })),
        react_1.default.createElement("div", { className: HRWorkflowOverview_module_scss_1.default.footer },
            react_1.default.createElement("span", { className: HRWorkflowOverview_module_scss_1.default.footerLink },
                "View all sources ",
                react_1.default.createElement(Lucide.ChevronRight, { size: 14, style: { marginLeft: "4px" } })))));
};
exports.HRWorkflowOverview = HRWorkflowOverview;
exports.default = exports.HRWorkflowOverview;
//# sourceMappingURL=HRWorkflowOverview.js.map