"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUrgentTasks = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var ServiceExport_1 = require("../../../../services/ServiceExport");
var useUrgentTasks = function () {
    var _a = (0, react_1.useState)([]), urgentTasks = _a[0], setUrgentTasks = _a[1];
    var _b = (0, react_1.useState)(false), loading = _b[0], setLoading = _b[1];
    var fetchUrgentTasks = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var res, data, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    return [4 /*yield*/, ServiceExport_1.DashboardServices.GetRecruitmentDetails([], "and")];
                case 1:
                    res = _a.sent();
                    data = res.data || [];
                    // const tasks: UrgentTask[] = data.slice(0, 3).map((item) => {
                    //     const idString = item.id ? String(item.id) : "0";
                    //     const pseudoDays = (idString.length % 5) + 2; 
                    //     return {
                    //         title: item.title || "Pending Request",
                    //         subtitle: item.status || "Action Required",
                    //         overdue: `${pseudoDays}D OVERDUE`,
                    //         type: pseudoDays > 3 ? "error" : "warning"
                    //     };
                    // });
                    setUrgentTasks([
                        { title: 'Mining Engineering', subtitle: 'Advert Review Pending', overdue: '5D OVERDUE', type: 'error' },
                        { title: 'Mining Supervisor', subtitle: 'Position Mapping', overdue: '3D OVERDUE', type: 'warning' }
                    ]);
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
        fetchUrgentTasks();
    }, [fetchUrgentTasks]);
    return {
        urgentTasks: urgentTasks,
        loading: loading,
        refresh: fetchUrgentTasks
    };
};
exports.useUrgentTasks = useUrgentTasks;
//# sourceMappingURL=useUrgentTasks.js.map