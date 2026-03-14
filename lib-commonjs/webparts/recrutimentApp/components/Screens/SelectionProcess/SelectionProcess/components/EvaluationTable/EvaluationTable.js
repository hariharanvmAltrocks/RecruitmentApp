"use strict";
// ═══════════════════════════════════════════════════════════════════════════
//  EvaluationTable.tsx — Common reusable table component
//  EvaluationConfig values மட்டும் import
//  Features: shimmer skeleton, sortable columns, hover tooltip, evaluate icon
// ═══════════════════════════════════════════════════════════════════════════
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var EvaluationTable_module_scss_1 = tslib_1.__importDefault(require("./EvaluationTable.module.scss"));
var EvaluationConfig_1 = require("../../config/EvaluationConfig");
var useEvaluationData_1 = require("../../hooks/useEvaluationData");
var moment = tslib_1.__importStar(require("moment"));
// ─────────────────────────────────────────────────────────────────────────────
var EvaluationTable = function (_a) {
    var rows = _a.rows, tooltipData = _a.tooltipData, currentRoleID = _a.currentRoleID, navigation = _a.navigation, tabValue = _a.tabValue, onHover = _a.onHover, onEvaluate = _a.onEvaluate, onShowAlert = _a.onShowAlert, onRefresh = _a.onRefresh;
    var _b = (0, react_1.useState)(EvaluationConfig_1.EvalUIConfig.DefaultSortKey), sortKey = _b[0], setSortKey = _b[1];
    var _c = (0, react_1.useState)(EvaluationConfig_1.EvalUIConfig.DefaultSortDir), sortDir = _c[0], setSortDir = _c[1];
    var _d = (0, react_1.useState)(null), hoveredId = _d[0], setHoveredId = _d[1];
    var _e = (0, react_1.useState)(null), loadingId = _e[0], setLoadingId = _e[1];
    // ── Sort ──────────────────────────────────────────────────────────────────
    var handleSort = function (key) {
        setSortDir(function (d) { return sortKey === key ? (d === "asc" ? "desc" : "asc") : "asc"; });
        setSortKey(key);
    };
    var sortedRows = tslib_1.__spreadArray([], rows, true).sort(function (a, b) {
        var _a, _b;
        if ((0, useEvaluationData_1.isSkeleton)(a) || (0, useEvaluationData_1.isSkeleton)(b))
            return 0;
        var va = String((_a = a[sortKey]) !== null && _a !== void 0 ? _a : "");
        var vb = String((_b = b[sortKey]) !== null && _b !== void 0 ? _b : "");
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    // ── Navigation path — same logic as InterviewPanelList handleRedirectView ─
    var getNavigationPath = function (statusId) {
        if (statusId === EvaluationConfig_1.EvalStatusId.InterviewScheduled) {
            if (currentRoleID.includes(EvaluationConfig_1.EvalRoleID.HOD) ||
                currentRoleID.includes(EvaluationConfig_1.EvalRoleID.LineManager))
                return EvaluationConfig_1.EvalNavigationPaths.HODLevel1;
            if (currentRoleID.includes(EvaluationConfig_1.EvalRoleID.InterviewPanel))
                return EvaluationConfig_1.EvalNavigationPaths.PanelLevel1;
            return EvaluationConfig_1.EvalNavigationPaths.DefaultLevel1;
        }
        if (statusId === EvaluationConfig_1.EvalStatusId.InterviewScheduledforLevel2) {
            if (currentRoleID.includes(EvaluationConfig_1.EvalRoleID.HOD) ||
                currentRoleID.includes(EvaluationConfig_1.EvalRoleID.LineManager))
                return EvaluationConfig_1.EvalNavigationPaths.HODLevel2;
            if (currentRoleID.includes(EvaluationConfig_1.EvalRoleID.InterviewPanel))
                return EvaluationConfig_1.EvalNavigationPaths.PanelLevel2;
            return EvaluationConfig_1.EvalNavigationPaths.DefaultLevel2;
        }
        return "";
    };
    // ── Evaluate icon click — same logic as InterviewPanelList (line 272–358) ─
    var handleEvaluateClick = function (row) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var interviewDateStr, todayDateStr, result, msg, path;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoadingId(row.id);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    interviewDateStr = moment(row.interviewDateTime, EvaluationConfig_1.EvalUIConfig.InterviewDateDisplayFormat).format(EvaluationConfig_1.EvalUIConfig.CompareDateFormat);
                    todayDateStr = moment(new Date()).format(EvaluationConfig_1.EvalUIConfig.CompareDateFormat);
                    if (todayDateStr < interviewDateStr) {
                        // Interview date is in the future — show alert
                        onShowAlert("Interview is scheduled for ".concat(interviewDateStr, ". You can evaluate on or after the interview date."), EvaluationConfig_1.EvalAlertOptions.Error);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, onEvaluate(row)];
                case 2:
                    result = _a.sent();
                    if (!result.canProceed) {
                        msg = result.level === EvaluationConfig_1.EvalInterviewLevels.Level1
                            ? EvaluationConfig_1.EvalMessages.InterviewScoredAlready
                            : EvaluationConfig_1.EvalMessages.InterviewScoreCommentsAlready;
                        onShowAlert(msg, EvaluationConfig_1.EvalAlertOptions.Error);
                        return [2 /*return*/];
                    }
                    path = getNavigationPath(row.statusId);
                    if (!path)
                        return [2 /*return*/];
                    navigation(path, {
                        state: {
                            ID: row.id,
                            tab: tabValue,
                            StatusId: row.statusId,
                            Status: row.status,
                            TabName: "Evaluation",
                            RecruitmentID: row.recruitmentID,
                            InterviewLevel: row.interviewLevel,
                            JobCodeID: row.jobCodeID,
                        },
                    });
                    return [3 /*break*/, 4];
                case 3:
                    setLoadingId(null);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // ── Sort icon ─────────────────────────────────────────────────────────────
    var SortIcon = function (_a) {
        var col = _a.col;
        return (react_1.default.createElement("span", { className: EvaluationTable_module_scss_1.default.sortIcon }, sortKey === col ? (sortDir === "asc" ? "↑" : "↓") : "↑↓"));
    };
    // ─────────────────────────────────────────────────────────────────────────
    return (react_1.default.createElement("div", { className: EvaluationTable_module_scss_1.default.wrapper },
        react_1.default.createElement("table", { className: EvaluationTable_module_scss_1.default.table },
            react_1.default.createElement("thead", null,
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("th", { onClick: function () { return handleSort("applicantName"); } },
                        "APPLICANTNAME ",
                        react_1.default.createElement(SortIcon, { col: "applicantName" })),
                    react_1.default.createElement("th", { onClick: function () { return handleSort("positionTitle"); } },
                        "POSITION TITLE ",
                        react_1.default.createElement(SortIcon, { col: "positionTitle" })),
                    react_1.default.createElement("th", { onClick: function () { return handleSort("interviewDate"); } },
                        "INTERVIEW DATE ",
                        react_1.default.createElement(SortIcon, { col: "interviewDate" })),
                    react_1.default.createElement("th", { onClick: function () { return handleSort("interviewLevel"); } },
                        "INTERVIEW LEVELS ",
                        react_1.default.createElement(SortIcon, { col: "interviewLevel" })),
                    react_1.default.createElement("th", { onClick: function () { return handleSort("grade"); } },
                        "GRADE ",
                        react_1.default.createElement(SortIcon, { col: "grade" })),
                    react_1.default.createElement("th", null, "ATTACHMENTS"),
                    react_1.default.createElement("th", null, "STATUS"),
                    react_1.default.createElement("th", null, "ACTION"))),
            react_1.default.createElement("tbody", null,
                sortedRows.map(function (row, idx) {
                    return (0, useEvaluationData_1.isSkeleton)(row) ? (
                    // ── Skeleton shimmer row ──────────────────────────────────────
                    react_1.default.createElement("tr", { key: "sk-".concat(idx), className: EvaluationTable_module_scss_1.default.skRow }, [65, 80, 55, 45, 30, 25, 60, 40].map(function (w, ci) { return (react_1.default.createElement("td", { key: ci },
                        react_1.default.createElement("span", { className: EvaluationTable_module_scss_1.default.shimmer, style: { width: "".concat(w, "%") } }))); }))) : (
                    // ── Real data row ─────────────────────────────────────────────
                    react_1.default.createElement("tr", { key: row.id, className: EvaluationTable_module_scss_1.default.row },
                        react_1.default.createElement("td", { className: EvaluationTable_module_scss_1.default.nameCell }, row.applicantName),
                        react_1.default.createElement("td", { className: EvaluationTable_module_scss_1.default.posCell }, row.positionTitle),
                        react_1.default.createElement("td", null, row.interviewDate),
                        react_1.default.createElement("td", null, row.interviewLevel),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement("div", { className: EvaluationTable_module_scss_1.default.grade },
                                react_1.default.createElement("span", null, row.grade),
                                row.gradeLabel && (react_1.default.createElement("span", { className: EvaluationTable_module_scss_1.default.gradeLabel }, row.gradeLabel)))),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement("span", { className: EvaluationTable_module_scss_1.default.attach },
                                "\uD83D\uDCCE ",
                                row.attachments)),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement("div", { className: EvaluationTable_module_scss_1.default.statusWrap, onMouseEnter: function () {
                                    setHoveredId(row.id);
                                    onHover(row.statusId, row.id);
                                }, onMouseLeave: function () { return setHoveredId(null); } },
                                react_1.default.createElement("span", { className: EvaluationTable_module_scss_1.default.dot }),
                                react_1.default.createElement("span", null, row.status),
                                hoveredId === row.id &&
                                    (tooltipData === null || tooltipData === void 0 ? void 0 : tooltipData.length) ? (react_1.default.createElement("div", { className: EvaluationTable_module_scss_1.default.tooltip }, tooltipData.map(function (entry, i) { return (react_1.default.createElement("div", { key: i, className: EvaluationTable_module_scss_1.default.tooltipRow },
                                    react_1.default.createElement("span", { className: EvaluationTable_module_scss_1.default.tooltipName }, entry.Key),
                                    react_1.default.createElement("span", { className: "".concat(EvaluationTable_module_scss_1.default.badge, " ").concat(entry.Value === "Completed"
                                            ? EvaluationTable_module_scss_1.default.completed
                                            : EvaluationTable_module_scss_1.default.pending) }, entry.Value))); }))) : null)),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement("div", { className: EvaluationTable_module_scss_1.default.actionCell },
                                react_1.default.createElement("img", { src: require("../../../../assets/Viewicon.svg"), alt: "View", className: "".concat(EvaluationTable_module_scss_1.default.viewIcon, " ").concat(loadingId === row.id
                                        ? EvaluationTable_module_scss_1.default.loading
                                        : ""), onClick: function () {
                                        return handleEvaluateClick(row);
                                    } })))));
                }),
                sortedRows.length === 0 && (react_1.default.createElement("tr", null,
                    react_1.default.createElement("td", { colSpan: 8, className: EvaluationTable_module_scss_1.default.empty }, "No candidates found.")))))));
};
exports.default = EvaluationTable;
//# sourceMappingURL=EvaluationTable.js.map