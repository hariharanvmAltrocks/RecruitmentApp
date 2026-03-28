"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReviewScoreCard = exports.ReviewScoreCardProvider = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var ReviewScoreCardServices_1 = tslib_1.__importDefault(require("../ReviewScoreCardServies/ReviewScoreCardServices"));
var initialState = {
    loading: false,
    data: null,
    error: null,
    submitting: false,
    submitResult: null,
    submitError: null,
};
var reviewScoreCardReducer = function (state, action) {
    switch (action.type) {
        case 'LOADING':
            return tslib_1.__assign(tslib_1.__assign({}, state), { loading: true, error: null });
        case 'LOAD_SUCCESS':
            return tslib_1.__assign(tslib_1.__assign({}, state), { loading: false, data: action.payload, error: null });
        case 'LOAD_ERROR':
            return tslib_1.__assign(tslib_1.__assign({}, state), { loading: false, error: action.payload });
        case 'SUBMITTING':
            return tslib_1.__assign(tslib_1.__assign({}, state), { submitting: true, submitError: null });
        case 'SUBMIT_SUCCESS':
            return tslib_1.__assign(tslib_1.__assign({}, state), { submitting: false, submitResult: action.payload, submitError: null });
        case 'SUBMIT_ERROR':
            return tslib_1.__assign(tslib_1.__assign({}, state), { submitting: false, submitError: action.payload });
        case 'CLEAR_ERROR':
            return tslib_1.__assign(tslib_1.__assign({}, state), { error: null, submitError: null });
        default:
            return state;
    }
};
var ReviewScoreCardContext = (0, react_1.createContext)(undefined);
var ReviewScoreCardProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useReducer)(reviewScoreCardReducer, initialState), state = _b[0], dispatch = _b[1];
    var loadReviewScoreCardData = function (candidateId, currentUserEmail) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var data, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: 'LOADING' });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ReviewScoreCardServices_1.default.getReviewScoreCardData(candidateId, currentUserEmail)];
                case 2:
                    data = _a.sent();
                    dispatch({ type: 'LOAD_SUCCESS', payload: data });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    dispatch({ type: 'LOAD_ERROR', payload: error_1.message });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var submitScorecard = function (payload) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var result, error_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: 'SUBMITTING' });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ReviewScoreCardServices_1.default.submitScorecard(payload)];
                case 2:
                    result = _a.sent();
                    dispatch({ type: 'SUBMIT_SUCCESS', payload: result });
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    dispatch({ type: 'SUBMIT_ERROR', payload: error_2.message });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleSubmit = function (params, onSuccess) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var result, error_3;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dispatch({ type: 'SUBMITTING' });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ReviewScoreCardServices_1.default.submitScorecard(params)];
                case 2:
                    result = _a.sent();
                    dispatch({ type: 'SUBMIT_SUCCESS', payload: result });
                    if (onSuccess)
                        onSuccess();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    dispatch({ type: 'SUBMIT_ERROR', payload: error_3.message });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var clearError = function () {
        dispatch({ type: 'CLEAR_ERROR' });
    };
    return (react_1.default.createElement(ReviewScoreCardContext.Provider, { value: {
            state: state,
            loadReviewScoreCardData: loadReviewScoreCardData,
            submitScorecard: submitScorecard,
            handleSubmit: handleSubmit,
            clearError: clearError
        } }, children));
};
exports.ReviewScoreCardProvider = ReviewScoreCardProvider;
var useReviewScoreCard = function () {
    var context = (0, react_1.useContext)(ReviewScoreCardContext);
    if (context === undefined) {
        throw new Error('useReviewScoreCard must be used within a ReviewScoreCardProvider');
    }
    return context;
};
exports.useReviewScoreCard = useReviewScoreCard;
//# sourceMappingURL=ReviewScorecardState.js.map