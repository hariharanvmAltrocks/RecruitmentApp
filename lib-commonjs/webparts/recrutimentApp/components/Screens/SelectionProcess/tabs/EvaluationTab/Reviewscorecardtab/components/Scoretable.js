"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// ReviewScorecard/components/ScoreTable.tsx
// Reusable table used for BOTH Question Evaluation + Overall Evaluation scorecard tabs.
// Receives pre-computed rows — no data logic inside.
var React = tslib_1.__importStar(require("react"));
var Reviewscorecardtab_module_scss_1 = tslib_1.__importDefault(require("../Reviewscorecardtab.module.scss"));
var ScoreTable = function (_a) {
    var title = _a.title, subtitle = _a.subtitle, accentColor = _a.accentColor, rows = _a.rows, panelMembers = _a.panelMembers, _b = _a.showTotal, showTotal = _b === void 0 ? false : _b, _c = _a.emptyText, emptyText = _c === void 0 ? "No data available." : _c;
    return (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mSection },
        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mSectionHeader },
            React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mSectionBar, style: { background: accentColor } }),
            React.createElement("div", null,
                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mSectionTitle }, title),
                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mSectionSub }, subtitle))),
        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.tableScroll },
            React.createElement("table", { className: Reviewscorecardtab_module_scss_1.default.scoreTable },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Criteria"),
                        panelMembers.map(function (name, i) { return (React.createElement("th", { key: i },
                            "Interviewer ",
                            i + 1,
                            React.createElement("br", null),
                            React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.interviewerName },
                                "(",
                                name || "—",
                                ")"))); }),
                        showTotal && React.createElement("th", null, "Total"))),
                React.createElement("tbody", null, rows.length === 0 ? (React.createElement("tr", null,
                    React.createElement("td", { colSpan: panelMembers.length + (showTotal ? 2 : 1), className: Reviewscorecardtab_module_scss_1.default.noData }, emptyText))) : rows.map(function (row, idx) { return (React.createElement("tr", { key: idx, className: row.criteria === "Total" ? Reviewscorecardtab_module_scss_1.default.totalRow : idx % 2 === 0 ? Reviewscorecardtab_module_scss_1.default.stripedRow : "" },
                    React.createElement("td", null,
                        React.createElement("strong", null, row.criteria)),
                    panelMembers.map(function (_, j) {
                        var _a;
                        return (React.createElement("td", { key: j }, (_a = row["panel_".concat(j)]) !== null && _a !== void 0 ? _a : "—"));
                    }),
                    showTotal && React.createElement("td", null,
                        React.createElement("strong", null, row.total)))); }))))));
};
exports.default = ScoreTable;
//# sourceMappingURL=ScoreTable.js.map