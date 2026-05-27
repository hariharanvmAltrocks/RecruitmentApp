"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSaveQuestions = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var ServiceExport_1 = require("../../../../services/ServiceExport");
var ApiConfig_1 = require("../../../../utilities/ApiConfig");
var RoleContext_1 = require("../../../../utilities/hooks/RoleContext");
var Config_1 = require("../../../../utilities/Config");
var ConditionConfig_1 = require("../../../../utilities/ConditionConfig");
var spservice_1 = tslib_1.__importDefault(require("../../../../services/SPService/spservice"));
var WorkflowConfig_1 = require("../../../Hooks/WorkflowConfig");
var UIStateContext_1 = require("../../../RecrutimentApp/UIStateContext");
var decodeBase64 = function (str) {
    var utf8Bytes = new TextEncoder().encode(str);
    var binary = String.fromCharCode.apply(String, utf8Bytes);
    return btoa(binary);
};
// const decodeBase64 = (str: string): string => {
//     try {
//         return atob(str);
//     } catch (e) {
//         console.error("Invalid Base64 string:", str);
//         return str; // fallback
//     }
// };
function transformToUpsertPayload(payload, userId) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var jobCodeKey, isCareerPortal, categoryID;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ServiceExport_1.masterService.GetJobUniqueDataValue((_a = payload.JobCodeId) !== null && _a !== void 0 ? _a : 0)];
                case 1:
                    jobCodeKey = _b.sent();
                    isCareerPortal = payload.mode === "careerPortal" ? true : false;
                    categoryID = payload.mode === "careerPortal" ? "C1" : "C2";
                    return [2 /*return*/, payload.questions.map(function (q, index) {
                            var _a, _b, _c, _d, _e, _f;
                            var questionType = q.type === "single"
                                ? "QT1"
                                : q.type === "multiple"
                                    ? "QT2"
                                    : q.type === "interview"
                                        ? "QT3"
                                        : "";
                            return {
                                questionEn: decodeBase64(q.questionEn),
                                questionFr: decodeBase64(q.questionFr),
                                scopeId: (_a = payload.DptCode) !== null && _a !== void 0 ? _a : "",
                                categoryId: categoryID !== null && categoryID !== void 0 ? categoryID : "",
                                questionTypeId: questionType,
                                isQualifier: 1,
                                isAnswerValidate: 0,
                                sequence: index + 1,
                                jobCode: (_b = jobCodeKey.data.JobCode) !== null && _b !== void 0 ? _b : "",
                                options: isCareerPortal
                                    ? q.options.map(function (o, i) { return ({
                                        optionEn: decodeBase64(o.textEn),
                                        optionFr: decodeBase64(o.textFr),
                                        sequence: i + 1,
                                    }); })
                                    : [
                                        {
                                            optionEn: decodeBase64((_c = q.answerEn) !== null && _c !== void 0 ? _c : ""),
                                            optionFr: decodeBase64((_d = q.answerFr) !== null && _d !== void 0 ? _d : ""),
                                            sequence: 1,
                                        },
                                    ],
                                answers: isCareerPortal
                                    ? q.options
                                        .filter(function (o) { return o.isCorrect; })
                                        .map(function (o) { return ({
                                        optionEn: decodeBase64(o.textEn),
                                        optionFr: decodeBase64(o.textFr),
                                    }); })
                                    : [
                                        {
                                            optionEn: decodeBase64((_e = q.answerEn) !== null && _e !== void 0 ? _e : ""),
                                            optionFr: decodeBase64((_f = q.answerFr) !== null && _f !== void 0 ? _f : ""),
                                        },
                                    ],
                                createdBy: userId,
                            };
                        })];
            }
        });
    });
}
var useSaveQuestions = function () {
    var _a = (0, react_1.useState)(false), saving = _a[0], setSaving = _a[1];
    var _b = (0, react_1.useState)(null), error = _b[0], setError = _b[1];
    var roleIDs = (0, RoleContext_1.userInfo)().roleIDs;
    var MatricID = (0, UIStateContext_1.useUIState)().MatricID;
    var save = (0, react_1.useCallback)(function (payload) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var userId, upsertPayload, response, updatePayload, StatusID, err_1;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setSaving(true);
                    setError(null);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, 6, 7]);
                    userId = roleIDs.includes(Config_1.RoleID.RecruitmentHR)
                        ? ConditionConfig_1.QuestionCreatedBy.HR
                        : ConditionConfig_1.QuestionCreatedBy.LM;
                    return [4 /*yield*/, transformToUpsertPayload(payload, userId)];
                case 2:
                    upsertPayload = _b.sent();
                    return [4 /*yield*/, ServiceExport_1.QuestionService.UpsertQuestions(upsertPayload)];
                case 3:
                    response = _b.sent();
                    if (response.status !== ApiConfig_1.ResponeStatus.SUCCESS) {
                        throw new Error("Failed to save questions");
                    }
                    updatePayload = {};
                    if (payload.mode === "careerPortal") {
                        StatusID = (0, WorkflowConfig_1.WorkflowConfig)(payload.StatusId);
                        updatePayload = {
                            StatusId: StatusID,
                            // ItemCreated: "Yes",
                        };
                    }
                    else {
                        updatePayload =
                            userId === ConditionConfig_1.QuestionCreatedBy.LM
                                ? { QuestionByLM: "Yes" }
                                : { QuestionByHR: "Yes" };
                    }
                    return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                            Listname: Config_1.ListNames.HRMSRecruitmentDptDetails,
                            RequestJSON: updatePayload,
                            ID: Number(payload.positionId),
                        })];
                case 4:
                    _b.sent();
                    return [2 /*return*/, true];
                case 5:
                    err_1 = _b.sent();
                    console.error(err_1);
                    setError((_a = err_1 === null || err_1 === void 0 ? void 0 : err_1.message) !== null && _a !== void 0 ? _a : "Unknown error saving questions");
                    return [2 /*return*/, false];
                case 6:
                    setSaving(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); }, [roleIDs]);
    return { saving: saving, error: error, save: save };
};
exports.useSaveQuestions = useSaveQuestions;
function buildCareerPortalPayload(payload) {
    return {
        positionId: payload.positionId,
        mode: "careerPortal",
        JobCodeId: payload === null || payload === void 0 ? void 0 : payload.JobCodeId,
        DptCode: payload === null || payload === void 0 ? void 0 : payload.DptCode,
        criteria: payload.questions.map(function (q) { return ({
            type: "C1",
            questionEn: q.questionEn,
            questionFr: q.questionFr,
            questionType: q.type,
            fromBank: q.fromBank,
            sourceId: q.fromBank ? q.id : null,
            options: q.options.map(function (o) { return ({
                textEn: o.textEn,
                textFr: o.textFr,
                isCorrect: o.isCorrect,
            }); }),
        }); }),
    };
}
function buildInterviewPayload(payload) {
    return {
        positionId: payload.positionId,
        mode: "interview",
        JobCodeId: payload === null || payload === void 0 ? void 0 : payload.JobCodeId,
        DptCode: payload === null || payload === void 0 ? void 0 : payload.DptCode,
        questions: payload.questions.map(function (q) {
            var _a, _b;
            return ({
                type: "C2",
                questionEn: q.questionEn,
                questionFr: q.questionFr,
                answerEn: (_a = q.answerEn) !== null && _a !== void 0 ? _a : "",
                answerFr: (_b = q.answerFr) !== null && _b !== void 0 ? _b : "",
                fromBank: q.fromBank,
                sourceId: q.fromBank ? q.id : null,
            });
        }),
    };
}
//# sourceMappingURL=useSaveQuestions.js.map