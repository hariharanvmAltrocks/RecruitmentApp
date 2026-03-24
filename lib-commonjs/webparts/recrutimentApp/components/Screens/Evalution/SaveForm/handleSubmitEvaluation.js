"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSubmitEvaluation = handleSubmitEvaluation;
var tslib_1 = require("tslib");
var defaultService = {
    submitEvaluation: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, wait(300)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }
};
function handleSubmitEvaluation(payload_1) {
    return tslib_1.__awaiter(this, arguments, void 0, function (payload, service) {
        var validation, error_1;
        if (service === void 0) { service = defaultService; }
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    validation = validatePayload(payload);
                    if (!validation.isValid) {
                        return [2 /*return*/, { success: false, message: validation.message }];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, service.submitEvaluation(payload)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, { success: true, message: 'Evaluation submitted successfully.' }];
                case 3:
                    error_1 = _a.sent();
                    return [2 /*return*/, {
                            success: false,
                            message: error_1 instanceof Error ? error_1.message : 'Unable to submit evaluation.'
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function validatePayload(payload) {
    if (!payload.candidate) {
        return { isValid: false, message: 'Candidate information is missing.' };
    }
    var answers = Object.values(payload.answers);
    if (answers.length === 0) {
        return { isValid: false, message: 'Please answer all interview questions.' };
    }
    var missingRating = answers.some(function (answer) { return answer.rating === null; });
    if (missingRating) {
        return { isValid: false, message: 'Please provide ratings for all questions.' };
    }
    return { isValid: true, message: '' };
}
function wait(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
//# sourceMappingURL=handleSubmitEvaluation.js.map