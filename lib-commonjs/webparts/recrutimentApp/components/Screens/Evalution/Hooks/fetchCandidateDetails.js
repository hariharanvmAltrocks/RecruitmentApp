"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCandidateDetails = useCandidateDetails;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var RoleContext_1 = require("../../../../utilities/hooks/RoleContext");
var Evaluationformservice_1 = require("../Evaluationservice/Evaluationformservice");
function useCandidateDetails(_a) {
    var _this = this;
    var _b, _c;
    var candidateId = _a.candidateId, interviewLevel = _a.interviewLevel, grade = _a.grade;
    var ADGroupData = (0, RoleContext_1.userInfo)().ADGroupData;
    var currentUserEmail = (_c = (_b = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.EmailId) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : "";
    var _d = React.useState(null), candidate = _d[0], setCandidate = _d[1];
    var _e = React.useState([]), questions = _e[0], setQuestions = _e[1];
    var _f = React.useState(true), loading = _f[0], setLoading = _f[1];
    var _g = React.useState(null), error = _g[0], setError = _g[1];
    var _h = React.useState(0), refreshKey = _h[0], setRefreshKey = _h[1];
    React.useEffect(function () {
        if (!candidateId || !currentUserEmail) {
            setLoading(false);
            return;
        }
        var isMounted = true;
        var load = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var result, jobRequestId, err_1;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        setLoading(true);
                        setError(null);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, (0, Evaluationformservice_1.getEvaluationFormData)(candidateId, currentUserEmail)];
                    case 2:
                        result = _b.sent();
                        if (!isMounted)
                            return [2 /*return*/];
                        if (!result.success) {
                            setError("Failed to load candidate data. Please retry.");
                            return [2 /*return*/];
                        }
                        jobRequestId = (_a = result._jobRequestId) !== null && _a !== void 0 ? _a : '';
                        setCandidate({
                            id: result.candidateId,
                            applicantName: result.applicantName,
                            jobTitle: result.positionTitle,
                            grade: grade || result.grade,
                            nationality: result.nationality,
                            nationalityCode: result.nationalityCode,
                            gender: result.gender,
                            qualification: result.qualification,
                            miningExp: result.miningExp,
                            relevantExp: result.relevantExp,
                            interviewDate: result.interviewDate,
                            interviewLevel: interviewLevel || result.interviewLevel,
                            disability: result.disability,
                            conflictsOfInterest: result.conflictsOfInterest,
                            panelMembers: result.panelMembers,
                            reviewerName: result.reviewerName,
                            jobTitleEn: result.jobTitleEn,
                            jobTitleFr: result.jobTitleFr,
                            currentUserPanelId: result.currentUserPanelId,
                            currentUserGuid: result.currentUserGuid,
                            recruitmentId: result.recruitmentId,
                            jobCodeID: result.jobCodeId,
                            jobRequestId: jobRequestId,
                            currentRoleIDs: (ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.roleIDs) || [4],
                        });
                        setQuestions(result.questions.map(function (q) { return ({
                            id: q.id,
                            text: q.question,
                            expectedResponse: q.answer,
                        }); }));
                        console.log('[useCandidateDetails] SUCCESS —', {
                            candidateId: candidateId,
                            currentUserPanelId: result.currentUserPanelId,
                            questionsCount: result.questions.length,
                            jobRequestId: jobRequestId,
                        });
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _b.sent();
                        console.error('[useCandidateDetails] error:', err_1);
                        if (isMounted)
                            setError(err_1 instanceof Error
                                ? err_1.message
                                : "Unable to load candidate details.");
                        return [3 /*break*/, 5];
                    case 4:
                        if (isMounted)
                            setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        void load();
        return function () {
            isMounted = false;
        };
    }, [candidateId, currentUserEmail, grade, interviewLevel, refreshKey]);
    var reload = React.useCallback(function () { return setRefreshKey(function (k) { return k + 1; }); }, []);
    return { candidate: candidate, questions: questions, loading: loading, error: error, reload: reload };
}
//# sourceMappingURL=fetchCandidateDetails.js.map