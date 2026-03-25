"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// CandidateListDrawer.tsx — Image 8 exact UI
// Modal drawer: Candidate Selection > job code + title > table of candidates
var react_1 = tslib_1.__importDefault(require("react"));
var CandidateListDrawer_module_scss_1 = tslib_1.__importDefault(require("./CandidateListDrawer.module.scss"));
var GPA_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"];
var gpaColor = function (gpa) {
    var n = Number(gpa);
    if (n >= 4.5)
        return GPA_COLORS[0];
    if (n >= 3.5)
        return GPA_COLORS[1];
    if (n >= 2.5)
        return GPA_COLORS[2];
    return GPA_COLORS[3];
};
var CandidateListDrawer = function (_a) {
    var _b, _c;
    var open = _a.open, job = _a.job, candidates = _a.candidates, loading = _a.loading, selectedId = _a.selectedId, onSelect = _a.onSelect, onConfirm = _a.onConfirm, onCancel = _a.onCancel;
    if (!open)
        return null;
    var selected = (_b = candidates.find(function (c) { return c.id === selectedId; })) !== null && _b !== void 0 ? _b : null;
    return (react_1.default.createElement("div", { className: CandidateListDrawer_module_scss_1.default.overlay },
        react_1.default.createElement("div", { className: CandidateListDrawer_module_scss_1.default.modal },
            react_1.default.createElement("div", { className: CandidateListDrawer_module_scss_1.default.header },
                react_1.default.createElement("div", { className: CandidateListDrawer_module_scss_1.default.headerLeft },
                    react_1.default.createElement("div", { className: CandidateListDrawer_module_scss_1.default.avatar },
                        react_1.default.createElement("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "#1a73e8", strokeWidth: "2" },
                            react_1.default.createElement("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }),
                            react_1.default.createElement("circle", { cx: "9", cy: "7", r: "4" }),
                            react_1.default.createElement("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }),
                            react_1.default.createElement("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" }))),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("h2", { className: CandidateListDrawer_module_scss_1.default.title }, "Candidate Selection"),
                        react_1.default.createElement("div", { className: CandidateListDrawer_module_scss_1.default.jobInfo },
                            react_1.default.createElement("span", { className: CandidateListDrawer_module_scss_1.default.jobCode }, job === null || job === void 0 ? void 0 : job.jobCode),
                            react_1.default.createElement("span", { className: CandidateListDrawer_module_scss_1.default.jobDot }, "\u2022"),
                            react_1.default.createElement("span", { className: CandidateListDrawer_module_scss_1.default.jobTitle }, (_c = job === null || job === void 0 ? void 0 : job.jobTitle) === null || _c === void 0 ? void 0 : _c.toUpperCase())))),
                react_1.default.createElement("button", { className: CandidateListDrawer_module_scss_1.default.closeBtn, onClick: onCancel }, "\u2715")),
            react_1.default.createElement("div", { className: CandidateListDrawer_module_scss_1.default.tableWrap }, loading ? (react_1.default.createElement("div", { className: CandidateListDrawer_module_scss_1.default.loadingWrap },
                react_1.default.createElement("div", { className: CandidateListDrawer_module_scss_1.default.spinner }))) : (react_1.default.createElement("table", { className: CandidateListDrawer_module_scss_1.default.table },
                react_1.default.createElement("thead", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("th", null, "S.NO"),
                        react_1.default.createElement("th", null, "APPLICANT NAME"),
                        react_1.default.createElement("th", null, "POSITION TITLE"),
                        react_1.default.createElement("th", null, "INTERVIEW LEVELS"),
                        react_1.default.createElement("th", null, "GRADE"),
                        react_1.default.createElement("th", null, "GPA"),
                        react_1.default.createElement("th", null, "STATUS"),
                        react_1.default.createElement("th", null, "ACTION"))),
                react_1.default.createElement("tbody", null,
                    candidates.map(function (c) { return (react_1.default.createElement("tr", { key: c.id, className: "".concat(CandidateListDrawer_module_scss_1.default.row, " ").concat(selectedId === c.id ? CandidateListDrawer_module_scss_1.default.rowSelected : "") },
                        react_1.default.createElement("td", { className: CandidateListDrawer_module_scss_1.default.sno }, c.sNo),
                        react_1.default.createElement("td", { className: CandidateListDrawer_module_scss_1.default.nameCell }, c.applicantName),
                        react_1.default.createElement("td", { className: CandidateListDrawer_module_scss_1.default.posCell }, c.positionTitle),
                        react_1.default.createElement("td", null, c.interviewLevel),
                        react_1.default.createElement("td", null, c.grade),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement("span", { className: CandidateListDrawer_module_scss_1.default.gpaBadge, style: { background: gpaColor(c.gpa) + "20", color: gpaColor(c.gpa), border: "1px solid ".concat(gpaColor(c.gpa), "40") } }, c.gpa)),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement("span", { className: CandidateListDrawer_module_scss_1.default.statusTag },
                                react_1.default.createElement("span", { className: CandidateListDrawer_module_scss_1.default.statusDot }),
                                c.status)),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement("button", { className: CandidateListDrawer_module_scss_1.default.editBtn, onClick: function () { return onSelect(c); }, title: "Review" },
                                react_1.default.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" },
                                    react_1.default.createElement("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
                                    react_1.default.createElement("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })))))); }),
                    candidates.length === 0 && (react_1.default.createElement("tr", null,
                        react_1.default.createElement("td", { colSpan: 8, className: CandidateListDrawer_module_scss_1.default.empty }, "No candidates found."))))))),
            react_1.default.createElement("div", { className: CandidateListDrawer_module_scss_1.default.footer },
                react_1.default.createElement("div", { className: CandidateListDrawer_module_scss_1.default.footerInfo },
                    react_1.default.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "#9ca3af", strokeWidth: "2" },
                        react_1.default.createElement("circle", { cx: "12", cy: "12", r: "10" }),
                        react_1.default.createElement("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
                        react_1.default.createElement("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })),
                    react_1.default.createElement("span", null, "Please select a candidate to proceed")),
                react_1.default.createElement("div", { className: CandidateListDrawer_module_scss_1.default.footerBtns },
                    react_1.default.createElement("button", { className: CandidateListDrawer_module_scss_1.default.cancelBtn, onClick: onCancel }, "CANCEL"),
                    react_1.default.createElement("button", { className: [CandidateListDrawer_module_scss_1.default.confirmBtn, !selected ? CandidateListDrawer_module_scss_1.default.confirmBtnOff : ""].filter(Boolean).join(" "), onClick: function () { return selected && onConfirm(selected); }, disabled: !selected }, "CONFIRM SELECTION"))))));
};
exports.default = CandidateListDrawer;
//# sourceMappingURL=Candidatelistdrawer.js.map