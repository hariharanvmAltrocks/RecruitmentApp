"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUrgentTasks = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var ServiceExport_1 = require("../../../../services/ServiceExport");
var RoleContext_1 = require("../../../../utilities/hooks/RoleContext");
var Config_1 = require("../../../../utilities/Config");
var ConditionConfig_1 = require("../../../../utilities/ConditionConfig");
var ApiConfig_1 = require("../../../../utilities/ApiConfig");
var useUrgentTasks = function () {
    var _a = (0, RoleContext_1.useRoleContext)(), roleIDs = _a.roleIDs, ADGroupData = _a.ADGroupData;
    var _b = (0, react_1.useState)([]), urgentTasks = _b[0], setUrgentTasks = _b[1];
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
    var fetchUrgentTasks = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var roleName, Filter, res, data, UrgentTask, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    roleName = roleIDs.includes(Config_1.RoleID.HOD, Config_1.RoleID.LineManager) ? ConditionConfig_1.ListEmailName.LM : roleIDs.includes(Config_1.RoleID.HOD) ? ConditionConfig_1.ListEmailName.HOD : roleIDs.includes(Config_1.RoleID.RecruitmentHR) ? ConditionConfig_1.ListEmailName.HR : ConditionConfig_1.ListEmailName.HRLead;
                    Filter = [
                        {
                            FilterKey: roleName,
                            Operator: "eq",
                            FilterValue: ADGroupData.EmailId[0]
                        },
                    ];
                    return [4 /*yield*/, ServiceExport_1.DashboardServices.GetRecruitmentDetails(Filter, "and")];
                case 1:
                    res = _a.sent();
                    data = res.data || [];
                    UrgentTask = data.map(function (item) {
                        var modified = item.ModifiedDate ? new Date(item.ModifiedDate) : new Date();
                        var today = new Date();
                        var diffDays = Math.floor((today.getTime() - modified.getTime()) / (1000 * 60 * 60 * 24));
                        var status = diffDays >= 3 ? "OVERDUE ".concat(diffDays, "D") : "PENDING";
                        var type = diffDays >= 3 ? "error" : "warning";
                        return {
                            title: item.JobTitleEnglish,
                            subtitle: item.Status,
                            overdue: status,
                            type: type
                        };
                    });
                    if (res.status === ApiConfig_1.ResponeStatus.SUCCESS) {
                        setUrgentTasks(UrgentTask);
                    }
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _a.sent();
                    console.error("Dashboard urgent tasks error", error_1);
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    (0, react_1.useEffect)(function () {
        void fetchUrgentTasks();
    }, [fetchUrgentTasks]);
    return {
        urgentTasks: urgentTasks,
        loading: loading,
        refresh: fetchUrgentTasks
    };
};
exports.useUrgentTasks = useUrgentTasks;
//# sourceMappingURL=useUrgentTasks.js.map