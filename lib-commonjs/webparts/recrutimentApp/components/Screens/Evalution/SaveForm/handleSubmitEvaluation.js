"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSubmitEvaluation = handleSubmitEvaluation;
var tslib_1 = require("tslib");
var EvaluationApiService_1 = require("../../SelectionProcess/services/EvaluationApiService");
function handleSubmitEvaluation(payload, roleId) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var candidate, answers, scorecard, recommendation, overallFeedback, spPayload, result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('[handleSubmitEvaluation] start', { payload: payload, roleId: roleId });
                    candidate = payload.candidate, answers = payload.answers, scorecard = payload.scorecard, recommendation = payload.recommendation, overallFeedback = payload.overallFeedback;
                    console.log('[handleSubmitEvaluation] candidate details', {
                        currentUserPanelId: candidate.currentUserPanelId,
                        currentUserGuid: candidate.currentUserGuid,
                        recruitmentId: candidate.recruitmentId,
                    });
                    if (!candidate.currentUserPanelId) {
                        return [2 /*return*/, {
                                success: false,
                                message: 'Could not identify your panel entry. Please contact HR.',
                            }];
                    }
                    spPayload = {
                        RecruitmentIDId: candidate.recruitmentId,
                        Qualifications: scorecard.Qualifications,
                        Experience: scorecard.Experience,
                        Knowledge: scorecard.Knowledge,
                        EnergyLevel: scorecard.EnergyLevel,
                        JobRequirements: scorecard.JobRequirements,
                        CultureFit: scorecard.CultureFit,
                        ExpatLocal: scorecard.ExpatLocal,
                        OtherCriteria: scorecard.OtherCriteria,
                        Recommendation: recommendation === 'consider' ? 'Consider for Employment' : 'Do Not Consider',
                        OverallFeedback: overallFeedback,
                        QuestionScores: JSON.stringify(Object.values(answers).map(function (a) { return ({ id: a.questionId, rating: a.rating }); })),
                    };
                    console.log('[handleSubmitEvaluation] payload-ready', { spPayload: spPayload });
                    return [4 /*yield*/, EvaluationApiService_1.evaluationService.submitScorecard(spPayload, candidate.currentUserPanelId, roleId, candidate.currentUserGuid || '')];
                case 1:
                    result = _a.sent();
                    console.log('[handleSubmitEvaluation] result', result);
                    return [2 /*return*/, result];
            }
        });
    });
}
//# sourceMappingURL=handleSubmitEvaluation.js.map