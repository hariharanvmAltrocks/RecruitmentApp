"use strict";
// components/Screens/Dashboard/Hooks/useEvaluationTab.ts
// Custom hook – all state and business logic for the Evaluation tab
// Exact port of old InterviewPanelList component logic
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEvaluationTab = useEvaluationTab;
var tslib_1 = require("tslib");
var react_1 = require("react");
var moment_1 = tslib_1.__importDefault(require("moment"));
var InterviewPanelService_1 = require("../services/InterviewPanelService");
var Config_1 = require("../EvaluationConfig/Config");
// ═════════════════════════════════════════════════════════════════════════════
// Hook
// ═════════════════════════════════════════════════════════════════════════════
function useEvaluationTab(currentUserEmailId) {
    var _this = this;
    var _a = (0, react_1.useState)([]), candidates = _a[0], setCandidates = _a[1];
    var _b = (0, react_1.useState)([]), panelRecords = _b[0], setPanelRecords = _b[1];
    var _c = (0, react_1.useState)([]), pendingInfo = _c[0], setPendingInfo = _c[1];
    var _d = (0, react_1.useState)(false), isLoading = _d[0], setIsLoading = _d[1];
    var _e = (0, react_1.useState)({
        open: false,
        message: "",
        type: "",
    }), alert = _e[0], setAlert = _e[1];
    // ── helpers ────────────────────────────────────────────────────────────────
    var showAlert = function (message, type) {
        if (type === void 0) { type = "Error"; }
        return setAlert({ open: true, message: message, type: type });
    };
    var closeAlert = (0, react_1.useCallback)(function () { return setAlert(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { open: false })); }); }, []);
    // ══════════════════════════════════════════════════════════════════════════
    // fetchCandidateData  (= old fetchCandidateData)
    // ══════════════════════════════════════════════════════════════════════════
    var fetchCandidateData = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var userRes, userID, panelRes_1, candidateIDs, candRes, enriched, finalCandidates, err_1;
        var _this = this;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!currentUserEmailId)
                        return [2 /*return*/];
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    return [4 /*yield*/, (0, InterviewPanelService_1.getUserGuidByEmail)(currentUserEmailId)];
                case 2:
                    userRes = _a.sent();
                    if (userRes.status !== 200 || !userRes.data) {
                        setIsLoading(false);
                        return [2 /*return*/];
                    }
                    userID = userRes.data.key;
                    return [4 /*yield*/, (0, InterviewPanelService_1.getInterviewPanelByUser)(userID)];
                case 3:
                    panelRes_1 = _a.sent();
                    if (panelRes_1.status !== 200 || panelRes_1.data.length === 0) {
                        setCandidates([]);
                        setPanelRecords([]);
                        setIsLoading(false);
                        return [2 /*return*/];
                    }
                    setPanelRecords(panelRes_1.data);
                    candidateIDs = panelRes_1.data.map(function (p) { return p.CandidateID; });
                    return [4 /*yield*/, (0, InterviewPanelService_1.getCandidatesByIDs)(candidateIDs)];
                case 4:
                    candRes = _a.sent();
                    if (candRes.status !== 200 || candRes.data.length === 0) {
                        setCandidates([]);
                        setIsLoading(false);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, Promise.all(candRes.data.map(function (item, index) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var grade, level, jobCodeID, vrrRes, gradeRes, err_2, interviewDate, interviewTime, interviewDateTime, displayLevel;
                            var _a, _b, _c;
                            return tslib_1.__generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        grade = "";
                                        level = "";
                                        jobCodeID = 0;
                                        _d.label = 1;
                                    case 1:
                                        _d.trys.push([1, 5, , 6]);
                                        return [4 /*yield*/, (0, InterviewPanelService_1.getRecruitmentByID)(((_a = item.RecruitmentID) === null || _a === void 0 ? void 0 : _a.Id) || item.RecruitmentID || 0)];
                                    case 2:
                                        vrrRes = _d.sent();
                                        if (!(vrrRes.status === 200 && vrrRes.data.length > 0)) return [3 /*break*/, 4];
                                        grade = vrrRes.data[0].PatersonGrade || "";
                                        jobCodeID = vrrRes.data[0].JobCodeId || 0;
                                        if (!grade) return [3 /*break*/, 4];
                                        return [4 /*yield*/, (0, InterviewPanelService_1.getGradeLevel)(grade)];
                                    case 3:
                                        gradeRes = _d.sent();
                                        if (gradeRes.status === 200 && gradeRes.data.length > 0) {
                                            level = gradeRes.data[0].Level || ""; // DB col: item.Levels
                                        }
                                        _d.label = 4;
                                    case 4: return [3 /*break*/, 6];
                                    case 5:
                                        err_2 = _d.sent();
                                        console.warn("Enrich failed for candidate:", item.ID, err_2);
                                        return [3 /*break*/, 6];
                                    case 6:
                                        interviewDate = item.InterviewDateLevel2 || item.InterviewDate || "";
                                        interviewTime = item.InterviewTimeLevel2 || item.InterviewTime || "";
                                        interviewDateTime = (0, moment_1.default)("".concat(interviewDate, " ").concat(interviewTime), "YYYY-MM-DD HH:mm").format("DD-MMM-YYYY hh:mm A");
                                        displayLevel = level === Config_1.InterviewLevels.Level2
                                            ? Config_1.InterviewLevels.Levels2
                                            : level;
                                        return [2 /*return*/, {
                                                SNO: index + 1,
                                                ID: item.ID,
                                                FristName: item.FristName || "",
                                                LastName: item.LastName || "",
                                                ApplicantName: "".concat(item.FristName || "", " ").concat(item.LastName || "").trim(),
                                                PositionTitle: item.PositionTitle || "",
                                                InterviewDateTime: interviewDateTime,
                                                InterviewLevel: displayLevel,
                                                Grade: grade,
                                                Status: ((_b = item.Status) === null || _b === void 0 ? void 0 : _b.StatusDescription) ||
                                                    (typeof item.Status === "string" ? item.Status : "") ||
                                                    "",
                                                StatusId: item.StatusId || 0,
                                                RecruitmentID: ((_c = item.RecruitmentID) === null || _c === void 0 ? void 0 : _c.Id) || item.RecruitmentID || 0,
                                                JobCodeID: jobCodeID,
                                                InterviewDate: item.InterviewDate || "",
                                                InterviewDateLevel2: item.InterviewDateLevel2 || "",
                                                InterviewTime: item.InterviewTime || "",
                                                InterviewTimeLevel2: item.InterviewTimeLevel2 || "",
                                            }];
                                }
                            });
                        }); }))];
                case 5:
                    enriched = _a.sent();
                    finalCandidates = enriched.filter(function (candidate) {
                        return panelRes_1.data.some(function (panel) {
                            if (candidate.ID !== panel.CandidateID)
                                return false;
                            if (candidate.StatusId === Config_1.StatusId.InterviewScheduled &&
                                panel.InterviewLevel === Config_1.InterviewLevels.Level1)
                                return true;
                            if (candidate.StatusId === Config_1.StatusId.InterviewScheduledforLevel2 &&
                                panel.InterviewLevel === Config_1.InterviewLevels.Level2)
                                return true;
                            return false;
                        });
                    });
                    setCandidates(finalCandidates);
                    return [3 /*break*/, 8];
                case 6:
                    err_1 = _a.sent();
                    console.error("useEvaluationTab fetchCandidateData error:", err_1);
                    return [3 /*break*/, 8];
                case 7:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); }, [currentUserEmailId]);
    (0, react_1.useEffect)(function () {
        void fetchCandidateData();
    }, [fetchCandidateData]);
    // ══════════════════════════════════════════════════════════════════════════
    // handleHover  (= old handleHover on Status cell)
    // Determines level from statusId → calls GetEvalutionActionData
    // ══════════════════════════════════════════════════════════════════════════
    var handleHover = (0, react_1.useCallback)(function (statusId, rowData) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var level, res;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    level = statusId === Config_1.StatusId.InterviewScheduled
                        ? Config_1.InterviewLevels.Level1
                        : Config_1.InterviewLevels.Level2;
                    return [4 /*yield*/, (0, InterviewPanelService_1.getEvaluationActionData)(rowData.ID, level)];
                case 1:
                    res = _a.sent();
                    setPendingInfo(res.data || []);
                    return [2 /*return*/];
            }
        });
    }); }, []);
    // ══════════════════════════════════════════════════════════════════════════
    // handleEvaluateClick  (= old checkIsScoreSheetUploaded + handleRedirectView)
    // ══════════════════════════════════════════════════════════════════════════
    var handleEvaluateClick = (0, react_1.useCallback)(function (rowData, navigate) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var userRes, currentUserKey_1, allPanelsRes, candidatePanels, userPanels, targetLevel_1, levelPanels, alreadyScored, todayStr, interviewDateStr, formatted, path, err_3;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, InterviewPanelService_1.getUserGuidByEmail)(currentUserEmailId)];
                case 1:
                    userRes = _a.sent();
                    if (!userRes.data)
                        return [2 /*return*/];
                    currentUserKey_1 = userRes.data.key.toString();
                    return [4 /*yield*/, (0, InterviewPanelService_1.getAllInterviewPanelForCandidate)(rowData.ID)];
                case 2:
                    allPanelsRes = _a.sent();
                    if (!allPanelsRes.data || allPanelsRes.data.length === 0)
                        return [2 /*return*/];
                    candidatePanels = allPanelsRes.data;
                    userPanels = candidatePanels.filter(function (panel) { var _a; return (_a = panel.InterviewPanelStringId) === null || _a === void 0 ? void 0 : _a.includes(currentUserKey_1); });
                    if (userPanels.length === 0)
                        return [2 /*return*/];
                    targetLevel_1 = rowData.StatusId === Config_1.StatusId.InterviewScheduled
                        ? Config_1.InterviewLevels.Level1
                        : Config_1.InterviewLevels.Level2;
                    levelPanels = userPanels.filter(function (p) { return p.InterviewLevel === targetLevel_1; });
                    alreadyScored = levelPanels.some(function (p) { return p.IsScoreSheetUploaded === "Yes"; });
                    if (alreadyScored) {
                        // Old handleAlert logic:
                        // Level 1 → "The scorecard for the candidate has already been submitted."
                        // Level 2 → "The scorecard for the candidate comments has already been submitted."
                        showAlert(targetLevel_1 === Config_1.InterviewLevels.Level1
                            ? "The scorecard for the candidate has already been submitted."
                            : "The scorecard for the candidate comments has already been submitted.");
                        return [2 /*return*/];
                    }
                    todayStr = (0, moment_1.default)().format("YYYY-MM-DD");
                    interviewDateStr = (0, moment_1.default)(rowData.InterviewDateTime, "DD-MMM-YYYY hh:mm A").format("YYYY-MM-DD");
                    if (todayStr < interviewDateStr) {
                        formatted = (0, moment_1.default)(interviewDateStr, "YYYY-MM-DD").format("DD-MMM-YYYY");
                        showAlert("You can only evaluate this candidate on or after the interview date: ".concat(formatted));
                        return [2 /*return*/];
                    }
                    path = rowData.StatusId === Config_1.StatusId.InterviewScheduled
                        ? Config_1.InterviewPanelRoutes.InterviewPanelEdit
                        : Config_1.InterviewPanelRoutes.HodViewScorecard;
                    navigate(path, {
                        state: {
                            ID: rowData.ID,
                            StatusId: rowData.StatusId,
                            Status: rowData.Status,
                            RecruitmentID: rowData.RecruitmentID,
                            InterviewLevel: rowData.InterviewLevel,
                            JobCodeID: rowData.JobCodeID,
                        },
                    });
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    console.error("handleEvaluateClick error:", err_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [currentUserEmailId]);
    return {
        candidates: candidates,
        panelRecords: panelRecords,
        pendingInfo: pendingInfo,
        isLoading: isLoading,
        alert: alert,
        closeAlert: closeAlert,
        handleHover: handleHover,
        handleEvaluateClick: handleEvaluateClick,
        refresh: fetchCandidateData,
    };
}
//# sourceMappingURL=useEvaluationTab.js.map