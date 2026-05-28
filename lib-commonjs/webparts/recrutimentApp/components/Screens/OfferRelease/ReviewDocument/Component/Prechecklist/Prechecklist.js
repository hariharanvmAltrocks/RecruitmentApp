"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
require("./Prechecklist.modules.scss");
var strings = tslib_1.__importStar(require("RecrutimentAppWebPartStrings"));
var sp_core_library_1 = require("@microsoft/sp-core-library");
// ── Icons ────────────────────────────────────────────────────────────────────
var CheckIcon = function () { return (react_1.default.createElement("svg", { viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" },
    react_1.default.createElement("polyline", { points: "2.5,8.5 6,12 13.5,4.5" }))); };
var XIcon = function () { return (react_1.default.createElement("svg", { viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round" },
    react_1.default.createElement("line", { x1: "4", y1: "4", x2: "12", y2: "12" }),
    react_1.default.createElement("line", { x1: "12", y1: "4", x2: "4", y2: "12" }))); };
var ShieldIcon = function () { return (react_1.default.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    react_1.default.createElement("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }))); };
var PlaneIcon = function () { return (react_1.default.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    react_1.default.createElement("path", { d: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" }))); };
var ClipboardIcon = function () { return (react_1.default.createElement("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    react_1.default.createElement("path", { d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" }),
    react_1.default.createElement("rect", { x: "9", y: "3", width: "6", height: "4", rx: "1" }))); };
// ── ChecklistSection ──────────────────────────────────────────────────────────
var ChecklistSection = function (_a) {
    var title = _a.title, subtitle = _a.subtitle, icon = _a.icon, items = _a.items, onToggle = _a.onToggle;
    var checkedCount = items.filter(function (i) { return i.value === true; }).length;
    var total = items.length;
    var allDone = checkedCount === total && total > 0;
    var progressWidth = total > 0 ? "".concat((checkedCount / total) * 100, "%") : "0%";
    return (react_1.default.createElement("div", { className: "prechecklist__section" },
        react_1.default.createElement("div", { className: "prechecklist__section-header" },
            react_1.default.createElement("div", { className: "prechecklist__section-icon" }, icon),
            react_1.default.createElement("div", { className: "prechecklist__section-info" },
                react_1.default.createElement("p", { className: "prechecklist__section-title" }, title),
                react_1.default.createElement("p", { className: "prechecklist__section-subtitle" }, subtitle)),
            react_1.default.createElement("div", { className: "prechecklist__section-badge".concat(allDone ? " prechecklist__section-badge--complete" : "") },
                checkedCount,
                "/",
                total,
                " done")),
        react_1.default.createElement("div", { className: "prechecklist__progress-bar" },
            react_1.default.createElement("div", { className: "prechecklist__progress-bar-fill", style: {
                    width: progressWidth,
                    "--progress-width": progressWidth,
                } })),
        react_1.default.createElement("div", { className: "prechecklist__list" }, items.map(function (item) { return (react_1.default.createElement("div", { key: item.ID, className: sp_core_library_1.Text.format(strings.PrechecklistItem) },
            react_1.default.createElement("div", { className: "prechecklist__avatar" },
                react_1.default.createElement("span", null, item.Initials)),
            react_1.default.createElement("div", { className: "prechecklist__item-body" },
                react_1.default.createElement("span", { className: "prechecklist__item-label" }, item.Title),
                react_1.default.createElement("span", { className: "prechecklist__item-id" },
                    strings.Id,
                    item.ID)),
            react_1.default.createElement("div", { className: "prechecklist__toggle-group" },
                react_1.default.createElement("button", { className: "prechecklist__toggle-btn prechecklist__toggle-btn--yes".concat(item.value === true ? " prechecklist__toggle-btn--active" : ""), onClick: function (e) {
                        e.stopPropagation();
                        onToggle(item.ID, true);
                    }, type: "button", "aria-pressed": item.value === true },
                    react_1.default.createElement("span", { className: "prechecklist__toggle-icon" },
                        react_1.default.createElement(CheckIcon, null)),
                    strings.Yes1),
                react_1.default.createElement("button", { className: "prechecklist__toggle-btn prechecklist__toggle-btn--no".concat(item.value === false
                        ? " prechecklist__toggle-btn--active"
                        : ""), onClick: function (e) {
                        e.stopPropagation();
                        onToggle(item.ID, false);
                    }, type: "button", "aria-pressed": item.value === false },
                    react_1.default.createElement("span", { className: "prechecklist__toggle-icon" },
                        react_1.default.createElement(XIcon, null)),
                    strings.No1)),
            react_1.default.createElement("div", { className: "prechecklist__status-dot".concat(item.value === true
                    ? " prechecklist__status-dot--yes"
                    : item.value === false
                        ? " prechecklist__status-dot--no"
                        : "") }))); }))));
};
// ── PreChecklist (main export) ────────────────────────────────────────────────
var PreChecklist = function (_a) {
    var nationalItems = _a.nationalItems, expatItems = _a.expatItems, isExpat = _a.isExpat, onToggle = _a.onToggle, allChecked = _a.allChecked;
    var allItems = isExpat ? tslib_1.__spreadArray(tslib_1.__spreadArray([], nationalItems, true), expatItems, true) : nationalItems;
    var totalChecked = allItems.filter(function (i) { return i.value === true; }).length;
    var total = allItems.length;
    return (react_1.default.createElement("div", { className: "prechecklist" },
        react_1.default.createElement(ChecklistSection, { title: strings.OnboardingPrechecklist, subtitle: strings.MandatoryPreHireChecks, icon: react_1.default.createElement(ShieldIcon, null), items: nationalItems, onToggle: onToggle }),
        react_1.default.createElement("div", { className: "prechecklist__summary" },
            react_1.default.createElement("div", { className: "prechecklist__summary-icon".concat(allChecked ? " prechecklist__summary-icon--complete" : "") }, allChecked ? react_1.default.createElement(CheckIcon, null) : react_1.default.createElement(ClipboardIcon, null)),
            react_1.default.createElement("div", { className: "prechecklist__summary-text" },
                react_1.default.createElement("span", { className: "prechecklist__summary-label" }, allChecked ? strings.AllRequirementsMet : strings.ChecklistInProgress),
                react_1.default.createElement("span", { className: "prechecklist__summary-desc" }, allChecked
                    ? strings.YouCanNowSubmitThisCandidateForReview
                    : strings.CompleteAllItemsAboveToEnableSubmission)),
            react_1.default.createElement("div", { className: "prechecklist__summary-count".concat(allChecked ? " prechecklist__summary-count--complete" : "") },
                totalChecked,
                react_1.default.createElement("span", null,
                    "/",
                    total)))));
};
exports.default = PreChecklist;
//# sourceMappingURL=Prechecklist.js.map