"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidatePipelineChart = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var CandidatePipelineChart_module_scss_1 = tslib_1.__importDefault(require("./CandidatePipelineChart.module.scss"));
var Card_1 = tslib_1.__importDefault(require("../Common/Card"));
var CandidatePipelineChart = function (_a) {
    var data = _a.data, _b = _a.loading, loading = _b === void 0 ? false : _b;
    if (loading || !data) {
        return (react_1.default.createElement(Card_1.default, { className: CandidatePipelineChart_module_scss_1.default.container },
            react_1.default.createElement("div", { className: CandidatePipelineChart_module_scss_1.default.header },
                react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "180px", height: "14px" } })),
            react_1.default.createElement("div", { className: CandidatePipelineChart_module_scss_1.default.tablePlaceholder }, Array.from({ length: 6 }).map(function (_, idx) { return (react_1.default.createElement("div", { key: idx, className: CandidatePipelineChart_module_scss_1.default.loadingRow, style: { padding: "12px 0", borderBottom: "1px solid #f1f5f9" } },
                react_1.default.createElement("div", { className: "dashboard-skeleton__bar", style: { width: "100%", height: "12px", borderRadius: "4px" } }))); }))));
    }
    return (react_1.default.createElement(Card_1.default, { className: CandidatePipelineChart_module_scss_1.default.container },
        react_1.default.createElement("div", { className: CandidatePipelineChart_module_scss_1.default.header },
            react_1.default.createElement("h3", { className: CandidatePipelineChart_module_scss_1.default.title }, "My Candidate Pipeline")),
        react_1.default.createElement("div", { className: CandidatePipelineChart_module_scss_1.default.tableWrapper },
            react_1.default.createElement("table", { className: CandidatePipelineChart_module_scss_1.default.table },
                react_1.default.createElement("thead", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("th", { className: CandidatePipelineChart_module_scss_1.default.thLeft }, "Stage"),
                        react_1.default.createElement("th", null, "Count"),
                        react_1.default.createElement("th", null, "%"))),
                react_1.default.createElement("tbody", null, data.map(function (stage, index) { return (react_1.default.createElement("tr", { key: index },
                    react_1.default.createElement("td", { className: CandidatePipelineChart_module_scss_1.default.tdStage }, stage.stage),
                    react_1.default.createElement("td", { className: CandidatePipelineChart_module_scss_1.default.tdCount }, stage.count),
                    react_1.default.createElement("td", { className: CandidatePipelineChart_module_scss_1.default.tdPercent },
                        stage.percentage,
                        "%"))); }))))));
};
exports.CandidatePipelineChart = CandidatePipelineChart;
exports.default = exports.CandidatePipelineChart;
//# sourceMappingURL=CandidatePipelineChart.js.map