"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFetchCandidateDashboardDetails = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var ServiceExport_1 = require("../../../../services/ServiceExport");
var UIStateContext_1 = require("../../../RecrutimentApp/UIStateContext");
var ConditionConfig_1 = require("../../../../utilities/ConditionConfig");
var RoleContext_1 = require("../../../../utilities/hooks/RoleContext");
var Config_1 = require("../../../../utilities/Config");
function resolveWorkflowStatusIds(roleIDs, matricId) {
    if (roleIDs.includes(Config_1.RoleID.RecruitmentHR)) {
        if (matricId === ConditionConfig_1.MatricID.ReviewProfileHR) {
            return [Config_1.workflowStatusApi.HRPending];
        }
        if (matricId === ConditionConfig_1.MatricID.AssignInterviewPanel) {
            return [Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview];
        }
    }
    if (roleIDs.includes(Config_1.RoleID.LineManager)) {
        if (matricId === ConditionConfig_1.MatricID.ReviewProfileLM) {
            return [
                Config_1.workflowStatusApi.LineManagerL1Pending,
                Config_1.workflowStatusApi.LineManagerL2Pending,
                Config_1.workflowStatusApi.LineManagerLevel1OnHold,
                Config_1.workflowStatusApi.LineManagerLevel2OnHold,
                Config_1.workflowStatusApi.LineManagerLevel1Rejected,
                Config_1.workflowStatusApi.LineManagerLevel2Rejected,
                Config_1.workflowStatusApi.CandidateRejectedIPanel,
                Config_1.ApplicationStatusId.ApplicationSuspended,
            ];
        }
    }
    return [Config_1.workflowStatusApi.HRPending];
}
var useFetchCandidateDashboardDetails = function (_a) {
    var jobId = _a.jobId, initialPageSize = _a.initialPageSize, _b = _a.enable, enable = _b === void 0 ? true : _b;
    var matricId = (0, UIStateContext_1.useUIState)().MatricID;
    var roleIDs = (0, RoleContext_1.userInfo)().roleIDs;
    var _c = (0, react_1.useState)({
        data: [],
        loading: false,
        error: null,
        pagination: {
            currentPage: 1,
            pageSize: initialPageSize,
            totalItems: 0,
        },
    }), state = _c[0], setState = _c[1];
    var pageSizeRef = (0, react_1.useRef)(initialPageSize);
    var abortRef = (0, react_1.useRef)(null);
    var timerRef = (0, react_1.useRef)(null);
    var fetchPage = (0, react_1.useCallback)(function (page, pageSize) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var resolvedPageSize;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            if (!jobId)
                return [2 /*return*/];
            resolvedPageSize = pageSize !== null && pageSize !== void 0 ? pageSize : pageSizeRef.current;
            pageSizeRef.current = resolvedPageSize;
            (_a = abortRef.current) === null || _a === void 0 ? void 0 : _a.abort();
            abortRef.current = new AbortController();
            if (timerRef.current)
                clearTimeout(timerRef.current);
            setState(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { loading: true, error: null })); });
            timerRef.current = setTimeout(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var jobCodeRes, jobCode, workflowStausId, pagination, filter, res, items, totalItems, err_1;
                var _a, _b, _c, _d, _e;
                return tslib_1.__generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            _f.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, ServiceExport_1.masterService.GetJobUniqueDataValue(jobId)];
                        case 1:
                            jobCodeRes = _f.sent();
                            jobCode = (_b = (_a = jobCodeRes === null || jobCodeRes === void 0 ? void 0 : jobCodeRes.data) === null || _a === void 0 ? void 0 : _a.JobCode) !== null && _b !== void 0 ? _b : "";
                            workflowStausId = resolveWorkflowStatusIds(roleIDs, matricId);
                            pagination = {
                                filterValue: "",
                                sortBy: "",
                                sortOrder: 0,
                                pageSize: resolvedPageSize,
                                currentPage: page - 1,
                                totalItems: 0,
                            };
                            filter = {
                                jobCode: jobCode,
                                workflowStausId: workflowStausId,
                                pagination: pagination,
                            };
                            return [4 /*yield*/, ServiceExport_1.CandidateTable.getCandidateDetailsInJobCode(filter)];
                        case 2:
                            res = _f.sent();
                            items = (_c = res === null || res === void 0 ? void 0 : res.data) !== null && _c !== void 0 ? _c : [];
                            totalItems = (res === null || res === void 0 ? void 0 : res.data) && (res === null || res === void 0 ? void 0 : res.data.length) > 0 ? (_e = (_d = res === null || res === void 0 ? void 0 : res.data[0]) === null || _d === void 0 ? void 0 : _d.TotalItems) !== null && _e !== void 0 ? _e : items.length : 0;
                            setState({
                                data: items,
                                loading: false,
                                error: null,
                                pagination: {
                                    currentPage: page,
                                    pageSize: resolvedPageSize,
                                    totalItems: totalItems,
                                },
                            });
                            return [3 /*break*/, 4];
                        case 3:
                            err_1 = _f.sent();
                            if ((err_1 === null || err_1 === void 0 ? void 0 : err_1.name) === "AbortError")
                                return [2 /*return*/];
                            console.error("CandidateDashboard: fetch failed", err_1);
                            setState(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { loading: false, error: "Failed to load candidates. Please try again." })); });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); }, 300);
            return [2 /*return*/];
        });
    }); }, [jobId, matricId, roleIDs, enable]);
    var setPageSize = (0, react_1.useCallback)(function (size) {
        fetchPage(1, size);
    }, [fetchPage]);
    var refresh = (0, react_1.useCallback)(function () {
        fetchPage(state.pagination.currentPage, pageSizeRef.current);
    }, [fetchPage, state.pagination.currentPage]);
    (0, react_1.useEffect)(function () {
        fetchPage(1, initialPageSize);
        return function () {
            var _a;
            (_a = abortRef.current) === null || _a === void 0 ? void 0 : _a.abort();
            if (timerRef.current)
                clearTimeout(timerRef.current);
        };
    }, [jobId]);
    return tslib_1.__assign(tslib_1.__assign({}, state), { fetchPage: fetchPage, setPageSize: setPageSize, refresh: refresh });
};
exports.useFetchCandidateDashboardDetails = useFetchCandidateDashboardDetails;
//# sourceMappingURL=fetchCandidateDashboardDetails.js.map