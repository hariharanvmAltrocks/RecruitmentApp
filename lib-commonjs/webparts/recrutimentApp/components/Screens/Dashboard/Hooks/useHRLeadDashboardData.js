"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHRLeadDashboardData = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var ServiceExport_1 = require("../../../../services/ServiceExport");
var ApiConfig_1 = require("../../../../utilities/ApiConfig");
var RoleContext_1 = require("../../../../utilities/hooks/RoleContext");
var useHRLeadDashboardData = function (refreshKey) {
    var _a = (0, react_1.useState)(null), data = _a[0], setData = _a[1];
    var _b = (0, react_1.useState)(false), loading = _b[0], setLoading = _b[1];
    var _c = (0, RoleContext_1.useRoleContext)(), roleIDs = _c.roleIDs, ADGroupData = _c.ADGroupData;
    // console.log(ADGroupData.EmailId, "EmailId");
    var fetchHRLeadData = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var res, error_1;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    return [4 /*yield*/, ServiceExport_1.DashboardServices.GetHRLeadDashboard((_a = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.EmailId[0]) !== null && _a !== void 0 ? _a : "")];
                case 1:
                    res = _b.sent();
                    if (res.status === ApiConfig_1.ResponeStatus.SUCCESS) {
                        setData(res.data);
                    }
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _b.sent();
                    console.error("HR Lead Dashboard data error", error_1);
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    (0, react_1.useEffect)(function () {
        void fetchHRLeadData();
    }, [fetchHRLeadData, refreshKey]);
    return {
        data: data,
        loading: loading,
        refresh: fetchHRLeadData,
    };
};
exports.useHRLeadDashboardData = useHRLeadDashboardData;
//# sourceMappingURL=useHRLeadDashboardData.js.map