"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var QuestionnaireService_1 = require("./QuestionnaireService");
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
                        return [4 /*yield*/, QuestionnaireService_1.QuestionnaireService.GetQuestionnaire(jobCode)];
                    case 1:
                        response = _a.sent();
                        GetQuestionnaire = response.data.data.map(function (item, index) {
                            var _a, _b, _c, _d, _e, _f, _g;
                            var incrementedIndex = index + 1;
                            return {
                                id: incrementedIndex,
                                question: (_b = (_a = item === null || item === void 0 ? void 0 : item.question) === null || _a === void 0 ? void 0 : _a.quesContent) === null || _b === void 0 ? void 0 : _b.contentEn,
                                answer: (_g = (_f = (_e = (_d = (_c = item === null || item === void 0 ? void 0 : item.question) === null || _c === void 0 ? void 0 : _c.questionXAnswers) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.optContent) === null || _f === void 0 ? void 0 : _f.contentEn) !== null && _g !== void 0 ? _g : "",
                                rating: 0,
                                header: "Q" + incrementedIndex,
                            };
                        });
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