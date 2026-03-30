"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFetchQuestionBank = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var RoleContext_1 = require("../../../../utilities/hooks/RoleContext");
var Config_1 = require("../../../../utilities/Config");
var ConditionConfig_1 = require("../../../../utilities/ConditionConfig");
var ServiceExport_1 = require("../../../../services/ServiceExport");
var useFetchQuestionBank = function (discipline, statusId, enable) {
    if (enable === void 0) { enable = true; }
    var _a = (0, react_1.useState)([]), questionBank = _a[0], setQuestionBank = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    var roleIDs = (0, RoleContext_1.userInfo)().roleIDs;
    (0, react_1.useEffect)(function () {
        var timer = setTimeout(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var categoryId, obj, res, questionbank, _a;
            var _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!enable || !discipline || !statusId)
                            return [2 /*return*/];
                        categoryId = statusId === Config_1.StatusId.CareerPortalQuestions ? "C1" : "C2";
                        obj = {
                            discipline: String(discipline),
                            category: String(categoryId),
                            createdBy: roleIDs.includes(Config_1.RoleID.LineManager)
                                ? ConditionConfig_1.QuestionCreatedBy.LM
                                : ConditionConfig_1.QuestionCreatedBy.HR,
                        };
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, ServiceExport_1.QuestionService.GetQuestionaireByScope(obj)];
                    case 2:
                        res = _c.sent();
                        questionbank = ((_b = res.data) !== null && _b !== void 0 ? _b : []).map(function (item) {
                            var _a, _b, _c, _d, _e, _f;
                            var options = ((_a = item.options) !== null && _a !== void 0 ? _a : []).map(function (opt) {
                                var _a, _b;
                                return ({
                                    id: String(opt.key),
                                    textEn: opt.text,
                                    textFr: (_a = opt.textFr) !== null && _a !== void 0 ? _a : "",
                                    isCorrect: (_b = opt.isCorrect) !== null && _b !== void 0 ? _b : false,
                                });
                            });
                            console.log(item.Type, "Typeee");
                            return {
                                id: item.id,
                                type: "single",
                                questionEn: item.question,
                                questionFr: (_b = item.questionFr) !== null && _b !== void 0 ? _b : "",
                                options: options,
                                answers: options.filter(function (opt) { return opt.isCorrect; }),
                                scopeId: (_c = item.scope) !== null && _c !== void 0 ? _c : "",
                                questionTypeId: (_d = item.questionType) !== null && _d !== void 0 ? _d : "",
                                isQualifier: (_e = item.Disqualification) !== null && _e !== void 0 ? _e : false,
                                createdBy: (_f = item.createdBy) !== null && _f !== void 0 ? _f : "",
                                fromBank: true,
                            };
                        });
                        setQuestionBank(questionbank);
                        return [3 /*break*/, 5];
                    case 3:
                        _a = _c.sent();
                        setError("Failed to load question bank.");
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); }, 800);
        return function () { return clearTimeout(timer); };
    }, [enable]);
    return { questionBank: questionBank, loading: loading, error: error, };
};
exports.useFetchQuestionBank = useFetchQuestionBank;
//# sourceMappingURL=fetchQuestionbank.js.map