"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
require("./tracker.scss");
var lucide_react_1 = require("lucide-react");
var Tracker = function (_a) {
    var rows = _a.rows, selectedMetric = _a.selectedMetric, activeMetric = _a.activeMetric, onRowClick = _a.onRowClick;
    return (react_1.default.createElement("div", { className: "tracker" },
        react_1.default.createElement("div", { className: "tracker__header" },
            react_1.default.createElement("div", null,
                react_1.default.createElement("h2", null, "My Tracker"),
                react_1.default.createElement("p", null,
                    "Showing ",
                    react_1.default.createElement("b", null, selectedMetric === null || selectedMetric === void 0 ? void 0 : selectedMetric.value),
                    " results for",
                    " ",
                    react_1.default.createElement("span", { className: "highlight" }, selectedMetric === null || selectedMetric === void 0 ? void 0 : selectedMetric.label))),
            react_1.default.createElement("button", { className: "view-btn" }, "View All Tasks")),
        react_1.default.createElement("div", { className: "tracker__table-wrapper" },
            react_1.default.createElement("table", { className: "tracker__table" },
                react_1.default.createElement("thead", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("th", null, "Job Title"),
                        react_1.default.createElement("th", null, "Vacancies"),
                        react_1.default.createElement("th", null, "Request Date"),
                        react_1.default.createElement("th", null, "Status"),
                        react_1.default.createElement("th", null))),
                react_1.default.createElement("tbody", null, rows.map(function (row) { return (react_1.default.createElement("tr", { key: row.ID, onClick: function () { return onRowClick && onRowClick(row); } },
                    react_1.default.createElement("td", null,
                        react_1.default.createElement("div", { className: "title" }, row.JobTitleEnglish),
                        react_1.default.createElement("div", { className: "jobcode" },
                            "Job Code: ",
                            row.JobCode)),
                    react_1.default.createElement("td", { className: "center" }, row.NumberOfPersonNeeded),
                    react_1.default.createElement("td", null, row.Type),
                    react_1.default.createElement("td", null,
                        react_1.default.createElement("span", { className: "status" }, row.Status)),
                    react_1.default.createElement("td", { className: "arrow" }, ["hod-review", "pending-evaluation", "pos-mapping"].includes(activeMetric) && react_1.default.createElement(lucide_react_1.ChevronRight, { size: 16 })))); }))))));
};
exports.default = Tracker;
//# sourceMappingURL=Tracker.js.map