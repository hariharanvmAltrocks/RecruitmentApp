"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUpcomingContracts = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var contract_service_1 = require("../Services/contract.service");
var useUpcomingContracts = function () {
    var _a = (0, react_1.useState)(true), loading = _a[0], setLoading = _a[1];
    var _b = (0, react_1.useState)(null), data = _b[0], setData = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    var refresh = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var all, sorted, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    setError(null);
                    return [4 /*yield*/, contract_service_1.ContractService.getContracts()];
                case 1:
                    all = _a.sent();
                    sorted = tslib_1.__spreadArray([], all, true).sort(function (a, b) {
                        // Overdue first, then due-soon, then by remaining days ascending
                        if (a.remainingDays < 0 && b.remainingDays >= 0)
                            return -1;
                        if (b.remainingDays < 0 && a.remainingDays >= 0)
                            return 1;
                        return a.remainingDays - b.remainingDays;
                    });
                    setData(sorted);
                    return [3 /*break*/, 4];
                case 2:
                    err_1 = _a.sent();
                    setError(err_1 instanceof Error ? err_1 : new Error(String(err_1)));
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    (0, react_1.useEffect)(function () {
        void refresh();
    }, [refresh]);
    return { loading: loading, data: data, error: error, refresh: refresh };
};
exports.useUpcomingContracts = useUpcomingContracts;
exports.default = exports.useUpcomingContracts;
//# sourceMappingURL=useUpcomingContracts.js.map