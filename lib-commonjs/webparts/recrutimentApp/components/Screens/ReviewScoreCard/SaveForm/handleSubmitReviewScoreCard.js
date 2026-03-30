"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSubmitReviewScoreCard = handleSubmitReviewScoreCard;
var tslib_1 = require("tslib");
var ReviewScoreCardServices_1 = tslib_1.__importDefault(require("../ReviewScoreCardServies/ReviewScoreCardServices"));
function handleSubmitReviewScoreCard(payload, setSubmitting, setAlertMsg, setAlertType, onSuccess) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var result, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSubmitting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, ReviewScoreCardServices_1.default.submitScorecard(payload)];
                case 2:
                    result = _a.sent();
                    if (result.success) {
                        setAlertMsg(result.message);
                        setAlertType('success');
                        if (onSuccess)
                            onSuccess();
                    }
                    else {
                        setAlertMsg(result.message);
                        setAlertType('error');
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setAlertMsg(err_1 instanceof Error ? err_1.message : 'Submission failed. Please try again.');
                    setAlertType('error');
                    return [3 /*break*/, 5];
                case 4:
                    setSubmitting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=handleSubmitReviewScoreCard.js.map