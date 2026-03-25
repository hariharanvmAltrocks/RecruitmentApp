"use strict";
// ─── useReviewScorecardData.ts ────────────────────────────────────────────────
// Custom hook that owns ALL data-fetching for the Review Scorecard detail view.
// Mirrors every useEffect / fetch call in the old HodViewScorecard.tsx.
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReviewScorecardData = useReviewScorecardData;
var tslib_1 = require("tslib");
var react_1 = require("react");
var ScorecardApiService_1 = require("../services/ScorecardApiService");
var Config_1 = require("../../../../utilities/Config");
var TODAY = new Date();
var DEFAULT_CANDIDATE = {
    CandidateID: 0,
    RecruitmentID: 0,
    JobCode: "",
    JobCodeId: 0,
    PassportID: "",
    FristName: "",
    MiddleName: "",
    LastName: "",
    FullName: "",
    ResidentialAddress: "",
    DOB: "",
    ContactNumber: "",
    Email: "",
    Nationality: "",
    Gender: "",
    TotalYearOfExperiance: "",
    Skills: "",
    LanguageKnown: "",
    ReleventExperience: "",
    Qualification: "",
    Qualifications: { key: 0, text: "" },
    Experience: { key: 0, text: "" },
    Knowledge: { key: 0, text: "" },
    Energylevel: { key: 0, text: "" },
    Requirements: { key: 0, text: "" },
    contributeculture: { key: 0, text: "" },
    ExpatExperienceCongolese: { key: 0, text: "" },
    CriteriaRecognised: { key: 0, text: "" },
    CandidateCVDoc: [],
    Employment: "",
    EvaluationFeedback: "",
    OverAllEvaluationFeedback: "",
    SignDate: new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate(), TODAY.getHours(), TODAY.getMinutes(), TODAY.getSeconds()),
    AdvertisementDocument: [],
    RoleProfileDocument: [],
    PositionTitle: "",
    InterviewDate: "",
    interviewPanelTitles: [],
    JobRequestID: "",
    Comments: "",
    ExternalAgentName: "",
    JobGrade: "",
    InterviewLevels: [],
    GPA: "",
    ConflictsOfInterest: "",
    disability: "",
    disabilityReason: "",
};
function useReviewScorecardData(_a) {
    var _this = this;
    var candidateID = _a.candidateID, recruitmentID = _a.recruitmentID, jobCodeID = _a.jobCodeID, department = _a.department, statusId = _a.statusId, employeeList = _a.employeeList;
    var _b = (0, react_1.useState)(DEFAULT_CANDIDATE), candidateData = _b[0], setCandidateData = _b[1];
    var _c = (0, react_1.useState)({ Levels: "", Grade: "" }), interviewedLevel = _c[0], setInterviewedLevel = _c[1];
    var _d = (0, react_1.useState)([]), panelLevel1 = _d[0], setPanelLevel1 = _d[1];
    var _e = (0, react_1.useState)([]), panelLevel2 = _e[0], setPanelLevel2 = _e[1];
    var _f = (0, react_1.useState)([]), rawScores = _f[0], setRawScores = _f[1];
    var _g = (0, react_1.useState)([]), questionRows = _g[0], setQuestionRows = _g[1];
    var _h = (0, react_1.useState)([]), overallRows = _h[0], setOverallRows = _h[1];
    var _j = (0, react_1.useState)({
        level1: [],
        level2: [],
    }), comments = _j[0], setComments = _j[1];
    var _k = (0, react_1.useState)([]), questionnaire = _k[0], setQuestionnaire = _k[1];
    var _l = (0, react_1.useState)([]), positionOptions = _l[0], setPositionOptions = _l[1];
    var _m = (0, react_1.useState)(null), selectedPosition = _m[0], setSelectedPosition = _m[1];
    var _o = (0, react_1.useState)(false), isLoading = _o[0], setIsLoading = _o[1];
    // ── Main fetch (candidate detail + panels + scores) ─────────────────────
    var loadAll = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, detail_1, level, panels, scores, err_1;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!candidateID)
                        return [2 /*return*/];
                    setIsLoading(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, Promise.all([
                            (0, ScorecardApiService_1.fetchCandidateDetail)(candidateID, employeeList),
                            (0, ScorecardApiService_1.fetchGradeLevel)(recruitmentID),
                            (0, ScorecardApiService_1.getPanelLevelTitles)(candidateID, employeeList),
                            (0, ScorecardApiService_1.fetchScoreData)(candidateID, employeeList),
                        ])];
                case 2:
                    _a = _b.sent(), detail_1 = _a[0], level = _a[1], panels = _a[2], scores = _a[3];
                    setCandidateData(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), detail_1)); });
                    setInterviewedLevel(level);
                    setPanelLevel1(panels.level1);
                    setPanelLevel2(panels.level2);
                    setRawScores(scores.rawScores);
                    setQuestionRows(scores.questionRows);
                    setOverallRows((0, ScorecardApiService_1.buildOverallScoreRows)(scores.rawScores));
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _b.sent();
                    console.error("useReviewScorecardData – loadAll error:", err_1);
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [candidateID, recruitmentID, employeeList]);
    (0, react_1.useEffect)(function () {
        void loadAll();
    }, [loadAll]);
    // ── Position options (when relevant status) ──────────────────────────────
    (0, react_1.useEffect)(function () {
        var needsPositionData = [
            Config_1.StatusId.PendingwithHODtoAssignPositionID,
            Config_1.StatusId.PendingwithHODtoselectthecandidate,
            Config_1.StatusId.Selected,
            Config_1.StatusId.OnHoldbyHOD,
            Config_1.StatusId.CandidateOnHoldbyHODLevel2,
        ].includes(statusId);
        if (needsPositionData) {
            void (0, ScorecardApiService_1.fetchPositionOptions)(jobCodeID, department).then(setPositionOptions);
        }
    }, [statusId, jobCodeID, department]);
    // ── Pre-fill selected position (when StatusId.Selected) ─────────────────
    (0, react_1.useEffect)(function () {
        if (statusId === Config_1.StatusId.Selected && candidateID) {
            (0, ScorecardApiService_1.fetchSelectedCandidateDetails)(candidateID).then(function (res) {
                if (res) {
                    setSelectedPosition({ key: res.positionValue, text: res.positionId });
                }
            });
        }
    }, [candidateID, statusId]);
    // ── Open comments view ───────────────────────────────────────────────────
    var loadComments = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var data;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, ScorecardApiService_1.fetchComments)(candidateID, employeeList)];
                case 1:
                    data = _a.sent();
                    setComments(data);
                    return [2 /*return*/];
            }
        });
    }); }, [candidateID, employeeList]);
    // ── Load questionnaire ────────────────────────────────────────────────────
    var loadQuestionnaire = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var res;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, ScorecardApiService_1.fetchQuestionnaire)(jobCodeID)];
                case 1:
                    res = _b.sent();
                    if (res.status === 200)
                        setQuestionnaire((_a = res.data) !== null && _a !== void 0 ? _a : []);
                    return [2 /*return*/, res.status];
            }
        });
    }); }, [jobCodeID]);
    // ── Update candidateData.Comments from outside ───────────────────────────
    var setComments_ = function (value) {
        return setCandidateData(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { Comments: value })); });
    };
    return {
        candidateData: candidateData,
        setCandidateData: setCandidateData,
        interviewedLevel: interviewedLevel,
        panelLevel1: panelLevel1,
        panelLevel2: panelLevel2,
        rawScores: rawScores,
        questionRows: questionRows,
        overallRows: overallRows,
        comments: comments,
        questionnaire: questionnaire,
        positionOptions: positionOptions,
        selectedPosition: selectedPosition,
        setSelectedPosition: setSelectedPosition,
        isLoading: isLoading,
        setIsLoading: setIsLoading,
        loadComments: loadComments,
        loadQuestionnaire: loadQuestionnaire,
        setCommentsText: setComments_,
        reload: loadAll,
    };
}
//# sourceMappingURL=useReviewScorecardData.js.map