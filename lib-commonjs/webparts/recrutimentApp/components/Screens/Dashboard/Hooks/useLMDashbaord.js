"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDashboard = exports.useLMDashboard = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var ServiceExport_1 = require("../../../../services/ServiceExport");
var ApiConfig_1 = require("../../../../utilities/ApiConfig");
var RoleContext_1 = require("../../../../utilities/hooks/RoleContext");
var useLMDashboard = function () {
    var _a = (0, react_1.useState)(null), data = _a[0], setData = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    var ADGroupData = (0, RoleContext_1.useRoleContext)().ADGroupData;
    var fetchLMDashboardData = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var email, res, err_1;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    setError(null);
                    email = (_a = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.EmailId[0]) !== null && _a !== void 0 ? _a : "";
                    return [4 /*yield*/, ServiceExport_1.DashboardServices.GetLMDashboardData(email)];
                case 1:
                    res = _b.sent();
                    if (res.status === ApiConfig_1.ResponeStatus.SUCCESS) {
                        setData(res.data);
                    }
                    else {
                        throw new Error(res.message || "Failed to fetch dashboard data");
                    }
                    return [3 /*break*/, 4];
                case 2:
                    err_1 = _b.sent();
                    console.error("HR Dashboard fetch error:", err_1);
                    setError(err_1 instanceof Error ? err_1 : new Error(String(err_1)));
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.EmailId]);
    (0, react_1.useEffect)(function () {
        void fetchLMDashboardData();
    }, [fetchLMDashboardData]);
    return {
        data: data,
        loading: loading,
        error: error,
        refresh: fetchLMDashboardData,
    };
};
exports.useLMDashboard = useLMDashboard;
exports.useDashboard = exports.useLMDashboard;
exports.default = exports.useLMDashboard;
//# sourceMappingURL=useLMDashbaord.js.map