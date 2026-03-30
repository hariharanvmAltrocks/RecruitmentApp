"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReviewScoreCardApi = useReviewScoreCardApi;
var tslib_1 = require("tslib");
var react_1 = require("react");
var ReviewScoreCardServices_1 = tslib_1.__importDefault(require("../ReviewScoreCardServies/ReviewScoreCardServices"));
function useReviewScoreCardApi() {
    var _this = this;
    // Fetch all review scorecard data for a candidate
    var fetchReviewScoreCardData = (0, react_1.useCallback)(function (candidateId, currentUserEmail) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ReviewScoreCardServices_1.default.getReviewScoreCardData(candidateId, currentUserEmail)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); }, []);
    // Submit a scorecard (Level 1 or Level 2, same as evaluation)
    var submitScorecard = (0, react_1.useCallback)(function (params) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ReviewScoreCardServices_1.default.submitScorecard(params)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); }, []);
    // Fetch Level 2 scorecard only
    var fetchLevel2Scorecard = (0, react_1.useCallback)(function (candidateId) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ReviewScoreCardServices_1.default.getLevel2Scorecard(candidateId)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); }, []);
    // Fetch HOD decision only
    var fetchHODDecision = (0, react_1.useCallback)(function (candidateId) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ReviewScoreCardServices_1.default.getHODDecision(candidateId)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); }, []);
    return {
        fetchReviewScoreCardData: fetchReviewScoreCardData,
        submitScorecard: submitScorecard,
        fetchLevel2Scorecard: fetchLevel2Scorecard,
        fetchHODDecision: fetchHODDecision
    };
}
//# sourceMappingURL=useReviewScoreCardApi.js.map