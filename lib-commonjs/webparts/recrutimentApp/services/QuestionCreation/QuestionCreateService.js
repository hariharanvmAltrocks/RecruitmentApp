"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ConditionConfig_1 = require("../../utilities/ConditionConfig");
var CareerPortalAPI_1 = require("../AxiosService/CareerPortalAPI");
var IRecruitmentService_1 = require("../RecruitmentTable/IRecruitmentService");
var QuestionCreateService = /** @class */ (function () {
    function QuestionCreateService() {
    }
    QuestionCreateService.prototype.GetQuestionaireByScope = function (GetExistingQuestion) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, GetQuestionnaire, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, CareerPortalAPI_1.QuestionnaireApi.GetQuestionaireByScope(GetExistingQuestion)];
                    case 1:
                        response = _a.sent();
                        GetQuestionnaire = response.data.data
                            .map(function (item, index) {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                            var incrementedIndex = index + 1;
                            var question = (0, IRecruitmentService_1.stripHtml)((_b = (_a = item === null || item === void 0 ? void 0 : item.question) === null || _a === void 0 ? void 0 : _a.quesContent) === null || _b === void 0 ? void 0 : _b.contentEn);
                            var questionFr = (0, IRecruitmentService_1.stripHtml)((_d = (_c = item === null || item === void 0 ? void 0 : item.question) === null || _c === void 0 ? void 0 : _c.quesContent) === null || _d === void 0 ? void 0 : _d.contentFr);
                            var expectedAnswer = (_e = item === null || item === void 0 ? void 0 : item.question) === null || _e === void 0 ? void 0 : _e.questionXAnswers.map(function (item) { var _a; return (0, IRecruitmentService_1.stripHtml)((_a = item === null || item === void 0 ? void 0 : item.optContent) === null || _a === void 0 ? void 0 : _a.contentEn); });
                            var expectedAnswerFr = (_f = item === null || item === void 0 ? void 0 : item.question) === null || _f === void 0 ? void 0 : _f.questionXAnswers.map(function (item) { var _a; return (0, IRecruitmentService_1.stripHtml)((_a = item === null || item === void 0 ? void 0 : item.optContent) === null || _a === void 0 ? void 0 : _a.contentFr); });
                            if (!question || !expectedAnswer) {
                                return null;
                            }
                            var options = (_g = item === null || item === void 0 ? void 0 : item.question) === null || _g === void 0 ? void 0 : _g.questionXOptions.map(function (item) {
                                var _a, _b, _c;
                                var userAnswer = (_a = item === null || item === void 0 ? void 0 : item.optContent) === null || _a === void 0 ? void 0 : _a.contentEn;
                                var correctAnswer = typeof expectedAnswer[0] === "string" ? expectedAnswer[0] : "";
                                return {
                                    key: item === null || item === void 0 ? void 0 : item.questionId,
                                    text: (0, IRecruitmentService_1.stripHtml)((_b = item === null || item === void 0 ? void 0 : item.optContent) === null || _b === void 0 ? void 0 : _b.contentEn),
                                    textFr: (0, IRecruitmentService_1.stripHtml)((_c = item === null || item === void 0 ? void 0 : item.optContent) === null || _c === void 0 ? void 0 : _c.contentFr),
                                    isCorrect: (userAnswer === null || userAnswer === void 0 ? void 0 : userAnswer.toLowerCase()) === correctAnswer.toLowerCase()
                                        ? true
                                        : false,
                                };
                            });
                            var CareerportalAnswer = (_j = (_h = item === null || item === void 0 ? void 0 : item.question) === null || _h === void 0 ? void 0 : _h.questionXAnswers) === null || _j === void 0 ? void 0 : _j.map(function (item, index) {
                                var _a, _b;
                                return {
                                    key: index,
                                    text: (0, IRecruitmentService_1.stripHtml)((_a = item === null || item === void 0 ? void 0 : item.optContent) === null || _a === void 0 ? void 0 : _a.contentEn),
                                    textFr: (0, IRecruitmentService_1.stripHtml)((_b = item === null || item === void 0 ? void 0 : item.optContent) === null || _b === void 0 ? void 0 : _b.contentFr),
                                    isCorrect: false,
                                };
                            });
                            return {
                                id: incrementedIndex,
                                Checked: false,
                                header: "Q" + incrementedIndex,
                                HeaderLabel: "Question" + incrementedIndex,
                                discipline: (_k = item === null || item === void 0 ? void 0 : item.question) === null || _k === void 0 ? void 0 : _k.scopeId,
                                scope: (_m = (_l = item === null || item === void 0 ? void 0 : item.question) === null || _l === void 0 ? void 0 : _l.questionType) === null || _m === void 0 ? void 0 : _m.displayText,
                                questionType: (_o = item === null || item === void 0 ? void 0 : item.question) === null || _o === void 0 ? void 0 : _o.questionTypeId,
                                question: question,
                                questionFr: questionFr,
                                expectedAnswer: expectedAnswer,
                                expectedAnswerFr: expectedAnswerFr,
                                CareerportalAnswer: CareerportalAnswer,
                                options: options,
                                Disqualification: (_p = item === null || item === void 0 ? void 0 : item.question) === null || _p === void 0 ? void 0 : _p.isQualifier,
                                Type: ConditionConfig_1.DataType.Existing,
                            };
                        })
                            .filter(function (item) { return item !== null; });
                        return [2 /*return*/, {
                                data: GetQuestionnaire,
                                status: response.status,
                                message: "Get Candidate details",
                            }];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error Get Candidate details:", error_1);
                        return [2 /*return*/, { data: [], status: 500, message: "Error Get Candidate details" }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    QuestionCreateService.prototype.UpsertQuestions = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var UpsertQuestions, response, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        UpsertQuestions = data.map(function (item) { return ({
                            questionEn: item.questionEn,
                            questionFr: item.questionFr,
                            scopeId: item.scopeId,
                            categoryId: item.categoryId,
                            questionTypeId: item.questionTypeId,
                            isQualifier: item.isQualifier,
                            isAnswerValidate: item.isAnswerValidate,
                            sequence: item.sequence,
                            jobCode: item.jobCode,
                            options: item.options,
                            answers: item.answers,
                            createdBy: item.createdBy,
                        }); });
                        return [4 /*yield*/, CareerPortalAPI_1.QuestionnaireApi.PostQuestionnaire(UpsertQuestions)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                data: response.data,
                                status: response.status,
                                message: response.data.message,
                            }];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Error inserting data into AdvertisementDetails:", error_2);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error inserting data into AdvertisementDetails",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return QuestionCreateService;
}());
exports.default = QuestionCreateService;
//# sourceMappingURL=QuestionCreateService.js.map