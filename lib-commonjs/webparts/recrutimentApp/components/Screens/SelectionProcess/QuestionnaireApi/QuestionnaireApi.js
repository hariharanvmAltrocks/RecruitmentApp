"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var QuestionnaireApi = /** @class */ (function () {
    function QuestionnaireApi() {
    }
    QuestionnaireApi.prototype.getQuestionnaire = function (jobCode) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, GetQuestionnaire, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, InterViewQuesAPI.GetQuestionnaire(jobCode)];
                    case 1:
                        response = _a.sent();
                        GetQuestionnaire = response.data.data.map(function (item, index) {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                            var incrementedIndex = index + 1;
                            return {
                                id: incrementedIndex,
                                question: (_b = (_a = item === null || item === void 0 ? void 0 : item.question) === null || _a === void 0 ? void 0 : _a.quesContent) === null || _b === void 0 ? void 0 : _b.contentEn,
                                questionFr: (_d = (_c = item === null || item === void 0 ? void 0 : item.question) === null || _c === void 0 ? void 0 : _c.quesContent) === null || _d === void 0 ? void 0 : _d.contentFr,
                                answer: (_j = (_h = (_g = (_f = (_e = item === null || item === void 0 ? void 0 : item.question) === null || _e === void 0 ? void 0 : _e.questionXAnswers) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.optContent) === null || _h === void 0 ? void 0 : _h.contentEn) !== null && _j !== void 0 ? _j : "",
                                answerFr: (_p = (_o = (_m = (_l = (_k = item === null || item === void 0 ? void 0 : item.question) === null || _k === void 0 ? void 0 : _k.questionXAnswers) === null || _l === void 0 ? void 0 : _l[0]) === null || _m === void 0 ? void 0 : _m.optContent) === null || _o === void 0 ? void 0 : _o.contentFr) !== null && _p !== void 0 ? _p : "",
                                rating: 0,
                                header: "Q" + incrementedIndex,
                            };
                        });
                        // console.log(response, "GetAllMasterData");
                        return [2 /*return*/, {
                                data: GetQuestionnaire,
                                status: response.status,
                                message: "Get Candidate details",
                            }];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error Get Candidate details:", error_1);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error Get Candidate details",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return QuestionnaireApi;
}());
exports.default = QuestionnaireApi;
//# sourceMappingURL=QuestionnaireApi.js.map