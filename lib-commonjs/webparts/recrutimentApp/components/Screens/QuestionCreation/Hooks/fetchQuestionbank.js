"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFetchQuestionBank = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var RoleContext_1 = require("../../../../utilities/hooks/RoleContext");
var Config_1 = require("../../../../utilities/Config");
var ConditionConfig_1 = require("../../../../utilities/ConditionConfig");
var ServiceExport_1 = require("../../../../services/ServiceExport");
var MOCK_QUESTION_BANK = [
    {
        id: "b1",
        type: "single",
        questionEn: "Do you have a valid blasting certificate?",
        questionFr: "Avez-vous un certificat de minage valide ?",
        options: [
            { id: "o1", textEn: "Yes", textFr: "Oui", isCorrect: true },
            { id: "o2", textEn: "No", textFr: "Non", isCorrect: false },
        ],
    },
    {
        id: "b2",
        type: "multiple",
        questionEn: "Which of the following mining software are you proficient in?",
        questionFr: "Parmi les logiciels miniers suivants, lesquels maîtrisez-vous ?",
        options: [
            { id: "o3", textEn: "Deswik", textFr: "Deswik", isCorrect: true },
            { id: "o4", textEn: "Surpac", textFr: "Surpac", isCorrect: true },
            { id: "o5", textEn: "AutoCAD", textFr: "AutoCAD", isCorrect: false },
            { id: "o6", textEn: "Vulcan", textFr: "Vulcan", isCorrect: true },
        ],
    },
    {
        id: "b3",
        type: "single",
        questionEn: "Are you willing to work on a rotational shift basis?",
        questionFr: "Êtes-vous prêt à travailler par roulement ?",
        options: [
            { id: "o7", textEn: "Yes", textFr: "Oui", isCorrect: true },
            { id: "o8", textEn: "No", textFr: "Non", isCorrect: false },
        ],
    },
    {
        id: "b4",
        type: "single",
        questionEn: "Do you hold a valid driver's license for heavy equipment?",
        questionFr: "Possédez-vous un permis de conduire valide pour engins lourds ?",
        options: [
            { id: "o9", textEn: "Yes", textFr: "Oui", isCorrect: true },
            { id: "o10", textEn: "No", textFr: "Non", isCorrect: false },
        ],
    },
    {
        id: "b5",
        type: "multiple",
        questionEn: "Which safety certifications do you currently hold?",
        questionFr: "Quelles certifications de sécurité possédez-vous actuellement ?",
        options: [
            { id: "o11", textEn: "IOSH", textFr: "IOSH", isCorrect: true },
            { id: "o12", textEn: "NEBOSH", textFr: "NEBOSH", isCorrect: true },
            { id: "o13", textEn: "First Aid", textFr: "Premiers secours", isCorrect: false },
            { id: "o14", textEn: "Fire Safety", textFr: "Sécurité incendie", isCorrect: false },
        ],
    },
];
var useFetchQuestionBank = function (discipline, statusId, enable) {
    if (enable === void 0) { enable = true; }
    var _a = (0, react_1.useState)([]), questionBank = _a[0], setQuestionBank = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    var roleIDs = (0, RoleContext_1.userInfo)().roleIDs;
    (0, react_1.useEffect)(function () {
        var timer = setTimeout(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var categoryId, obj, res, questionbank;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
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
                        return [4 /*yield*/, ServiceExport_1.QuestionService.GetQuestionaireByScope(obj)];
                    case 1:
                        res = _b.sent();
                        questionbank = (_a = res.data) === null || _a === void 0 ? void 0 : _a.map(function (item) {
                            var _a;
                            var option = (_a = item.options) === null || _a === void 0 ? void 0 : _a.map(function (item) {
                                return {
                                    id: item.key,
                                    textEn: item.text,
                                    textFr: item.textFr,
                                    isCorrect: item.isCorrect
                                };
                            });
                            var answer = option === null || option === void 0 ? void 0 : option.filter(function (item) { return item.isCorrect; });
                            return {
                                id: item.id,
                                type: item.Type,
                                questionEn: item.question,
                                questionFr: item.questionFr,
                                options: option,
                                scopeId: item.scope,
                                questionTypeId: item.questionType,
                                isQualifier: item.Disqualification,
                                answers: answer,
                                createdBy: item.createdBy
                            };
                        });
                        try {
                            setQuestionBank(MOCK_QUESTION_BANK);
                            setLoading(false);
                        }
                        catch (_c) {
                            setError("Failed to load question bank.");
                            setLoading(false);
                        }
                        return [2 /*return*/];
                }
            });
        }); }, 800);
        return function () { return clearTimeout(timer); };
    }, [enable]);
    return { questionBank: questionBank, loading: loading, error: error, };
};
exports.useFetchQuestionBank = useFetchQuestionBank;
//# sourceMappingURL=fetchQuestionbank.js.map