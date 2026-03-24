"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ConditionConfig_1 = require("../../utilities/ConditionConfig");
var CareerPortalAPI_1 = require("../AxiosService/CareerPortalAPI");
var ServiceExport_1 = require("../ServiceExport");
var QuestionCreateService = /** @class */ (function () {
    function QuestionCreateService() {
    }
    QuestionCreateService.prototype.GetQuestionaireByScope = function (GetExistingQuestion) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var serviceResponse, rawData, GetQuestionnaire, error_1;
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, ServiceExport_1.CareerPotalServices.GetQuestionaireByScope(GetExistingQuestion)];
                    case 1:
                        serviceResponse = _d.sent();
                        rawData = (_b = (_a = serviceResponse === null || serviceResponse === void 0 ? void 0 : serviceResponse.data) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : [];
                        if (!(rawData === null || rawData === void 0 ? void 0 : rawData.length)) {
                            return [2 /*return*/, { data: [], status: (_c = serviceResponse === null || serviceResponse === void 0 ? void 0 : serviceResponse.status) !== null && _c !== void 0 ? _c : 200, message: "Get Candidate details" }];
                        }
                        GetQuestionnaire = rawData.reduce(function (acc, item, index) {
                            var _a, _b, _c;
                            var q = item === null || item === void 0 ? void 0 : item.question;
                            var content = q === null || q === void 0 ? void 0 : q.quesContent;
                            var question = content === null || content === void 0 ? void 0 : content.contentEn;
                            var expectedAnswer = q === null || q === void 0 ? void 0 : q.questionXAnswers;
                            if (!question || !(expectedAnswer === null || expectedAnswer === void 0 ? void 0 : expectedAnswer.length))
                                return acc;
                            var incrementedIndex = index + 1;
                            var mappedAnswers = expectedAnswer.map(function (ans, i) {
                                var _a, _b;
                                return ({
                                    key: i,
                                    text: (_a = ans === null || ans === void 0 ? void 0 : ans.optContent) === null || _a === void 0 ? void 0 : _a.contentEn,
                                    textFr: (_b = ans === null || ans === void 0 ? void 0 : ans.optContent) === null || _b === void 0 ? void 0 : _b.contentFr,
                                    isCorrect: false,
                                });
                            });
                            var options = (_b = (_a = q === null || q === void 0 ? void 0 : q.questionXOptions) === null || _a === void 0 ? void 0 : _a.map(function (opt) {
                                var _a, _b;
                                return ({
                                    key: opt === null || opt === void 0 ? void 0 : opt.questionId,
                                    text: (_a = opt === null || opt === void 0 ? void 0 : opt.optContent) === null || _a === void 0 ? void 0 : _a.contentEn,
                                    textFr: (_b = opt === null || opt === void 0 ? void 0 : opt.optContent) === null || _b === void 0 ? void 0 : _b.contentFr,
                                    isCorrect: false,
                                });
                            })) !== null && _b !== void 0 ? _b : [];
                            acc.push({
                                id: incrementedIndex,
                                Checked: false,
                                header: "Q".concat(incrementedIndex),
                                HeaderLabel: "Question".concat(incrementedIndex),
                                discipline: q === null || q === void 0 ? void 0 : q.scopeId,
                                scope: (_c = q === null || q === void 0 ? void 0 : q.questionType) === null || _c === void 0 ? void 0 : _c.displayText,
                                questionType: q === null || q === void 0 ? void 0 : q.questionTypeId,
                                question: question,
                                questionFr: content === null || content === void 0 ? void 0 : content.contentFr,
                                expectedAnswer: mappedAnswers.map(function (a) { return a.text; }),
                                expectedAnswerFr: mappedAnswers.map(function (a) { return a.textFr; }),
                                CareerportalAnswer: mappedAnswers,
                                options: options,
                                Disqualification: q === null || q === void 0 ? void 0 : q.isQualifier,
                                Type: ConditionConfig_1.DataType.Existing,
                                createdBy: item.createdBy
                            });
                            return acc;
                        }, []);
                        return [2 /*return*/, {
                                data: GetQuestionnaire,
                                status: serviceResponse.status,
                                message: "Get Candidate details",
                            }];
                    case 2:
                        error_1 = _d.sent();
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