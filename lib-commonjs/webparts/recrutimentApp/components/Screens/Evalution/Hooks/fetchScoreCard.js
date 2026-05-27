"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useScoreCard = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var defaultService = {
    getScoreCard: function (_candidateId) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, { answers: {} }];
        });
    }); },
};
function useScoreCard(candidateId, service) {
    var _this = this;
    if (service === void 0) { service = defaultService; }
    var _a = React.useState(null), data = _a[0], setData = _a[1];
    var _b = React.useState(true), loading = _b[0], setLoading = _b[1];
    var _c = React.useState(null), error = _c[0], setError = _c[1];
    var _d = React.useState(0), refreshKey = _d[0], setRefreshKey = _d[1];
    React.useEffect(function () {
        if (!candidateId) {
            setLoading(false);
            return;
        }
        var isMounted = true;
        var load = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var result, err_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setLoading(true);
                        setError(null);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, service.getScoreCard(candidateId)];
                    case 2:
                        result = _a.sent();
                        if (isMounted)
                            setData(result);
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _a.sent();
                        if (isMounted)
                            setError(err_1 instanceof Error ? err_1.message : "Unable to load scorecard.");
                        return [3 /*break*/, 5];
                    case 4:
                        if (isMounted)
                            setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        void load();
        return function () {
            isMounted = false;
        };
    }, [candidateId, service, refreshKey]);
    var reload = React.useCallback(function () { return setRefreshKey(function (k) { return k + 1; }); }, []);
    return { data: data, loading: loading, error: error, reload: reload };
}
exports.useScoreCard = useScoreCard;
//# sourceMappingURL=fetchScoreCard.js.map