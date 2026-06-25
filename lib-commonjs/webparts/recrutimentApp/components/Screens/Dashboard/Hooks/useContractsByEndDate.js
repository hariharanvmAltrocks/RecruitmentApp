"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useContractsByEndDate = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var contract_service_1 = require("../Services/contract.service");
var useContractsByEndDate = function () {
    var _a = (0, react_1.useState)(true), loading = _a[0], setLoading = _a[1];
    var _b = (0, react_1.useState)(null), data = _b[0], setData = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    var refresh = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var contracts, onTrack_1, dueSoon_1, overdue_1, completed_1, notStarted_1, expiring7_1, expiring30_1, total_1, pct, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    setError(null);
                    return [4 /*yield*/, contract_service_1.ContractService.getContracts()];
                case 1:
                    contracts = _a.sent();
                    onTrack_1 = 0;
                    dueSoon_1 = 0;
                    overdue_1 = 0;
                    completed_1 = 0;
                    notStarted_1 = 0;
                    expiring7_1 = 0;
                    expiring30_1 = 0;
                    contracts.forEach(function (c) {
                        if (c.status === "Completed") {
                            completed_1++;
                        }
                        else if (c.status === "Pending") {
                            notStarted_1++;
                        }
                        else if (c.status === "Active" || c.status === "Suspended") {
                            if (c.slaStatus === "On Track")
                                onTrack_1++;
                            else if (c.slaStatus === "At Risk")
                                dueSoon_1++;
                            else if (c.slaStatus === "Overdue")
                                overdue_1++;
                        }
                        if (c.status !== "Completed" && c.remainingDays !== undefined) {
                            if (c.remainingDays <= 7) {
                                expiring7_1++;
                            }
                            if (c.remainingDays <= 30) {
                                expiring30_1++;
                            }
                        }
                    });
                    total_1 = contracts.length;
                    pct = function (val) { return total_1 > 0 ? Math.round((val / total_1) * 100) : 0; };
                    setData({
                        onTrack: onTrack_1,
                        dueSoon: dueSoon_1,
                        overdue: overdue_1,
                        completed: completed_1,
                        notStarted: notStarted_1,
                        total: total_1,
                        expiring7: expiring7_1,
                        expiring30: expiring30_1,
                        percentages: {
                            onTrack: pct(onTrack_1),
                            dueSoon: pct(dueSoon_1),
                            overdue: pct(overdue_1),
                            completed: pct(completed_1),
                            notStarted: pct(notStarted_1),
                            expiring7: pct(expiring7_1),
                            expiring30: pct(expiring30_1)
                        }
                    });
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
exports.useContractsByEndDate = useContractsByEndDate;
exports.default = exports.useContractsByEndDate;
//# sourceMappingURL=useContractsByEndDate.js.map