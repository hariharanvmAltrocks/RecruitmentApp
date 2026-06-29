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
    var jobId = _a.jobId, recruitmentId = _a.recruitmentId, initialPageSize = _a.initialPageSize, _b = _a.enable, enable = _b === void 0 ? true : _b;
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
                var jobCodeRes, jobCode, workflowStausId, pagination, filter, Filter, _a, res1, res2, items1, items2, items, getTotalItems, totalItems, res, items, totalItems, err_1;
                var _b, _c, _d, _e, _f, _g, _h;
                return tslib_1.__generator(this, function (_j) {
                    switch (_j.label) {
                        case 0:
                            _j.trys.push([0, 6, , 7]);
                            return [4 /*yield*/, ServiceExport_1.masterService.GetJobUniqueDataValue(jobId)];
                        case 1:
                            jobCodeRes = _j.sent();
                            jobCode = (_c = (_b = jobCodeRes === null || jobCodeRes === void 0 ? void 0 : jobCodeRes.data) === null || _b === void 0 ? void 0 : _b.JobCode) !== null && _c !== void 0 ? _c : "";
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
                            if (!(matricId === ConditionConfig_1.MatricID.AssignInterviewPanel)) return [3 /*break*/, 3];
                            Filter = [
                                {
                                    FilterKey: "JobCodeId",
                                    Operator: "eq",
                                    FilterValue: jobId,
                                },
                                {
                                    FilterKey: "RecruitmentID",
                                    Operator: "eq",
                                    FilterValue: recruitmentId,
                                },
                                {
                                    FilterKey: "Status/Id",
                                    Operator: "eq",
                                    FilterValue: Config_1.StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel,
                                },
                            ];
                            return [4 /*yield*/, Promise.all([
                                    ServiceExport_1.CandidateTable.getCandidateDetailsInJobCode(filter),
                                    ServiceExport_1.CandidateTable.GetDashboardDetailsL2(Filter, "and"),
                                ])];
                        case 2:
                            _a = _j.sent(), res1 = _a[0], res2 = _a[1];
                            items1 = (_d = res1 === null || res1 === void 0 ? void 0 : res1.data) !== null && _d !== void 0 ? _d : [];
                            items2 = (_e = res2 === null || res2 === void 0 ? void 0 : res2.data) !== null && _e !== void 0 ? _e : [];
                            items = tslib_1.__spreadArray(tslib_1.__spreadArray([], items1, true), items2, true);
                            getTotalItems = function (res) {
                                var _a;
                                return (res === null || res === void 0 ? void 0 : res.data) &&
                                    res.data.length > 0 &&
                                    ((_a = res.data[0]) === null || _a === void 0 ? void 0 : _a.TotalItems) &&
                                    res.data[0].TotalItems > 0
                                    ? res.data[0].TotalItems
                                    : 0;
                            };
                            totalItems = getTotalItems(res1) || getTotalItems(res2) || items.length;
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
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, ServiceExport_1.CandidateTable.getCandidateDetailsInJobCode(filter)];
                        case 4:
                            res = _j.sent();
                            items = (_f = res === null || res === void 0 ? void 0 : res.data) !== null && _f !== void 0 ? _f : [];
                            totalItems = (res === null || res === void 0 ? void 0 : res.data) && (res === null || res === void 0 ? void 0 : res.data.length) > 0
                                ? ((_h = (_g = res === null || res === void 0 ? void 0 : res.data[0]) === null || _g === void 0 ? void 0 : _g.TotalItems) !== null && _h !== void 0 ? _h : items.length)
                                : 0;
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
                            _j.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            err_1 = _j.sent();
                            if ((err_1 === null || err_1 === void 0 ? void 0 : err_1.name) === "AbortError")
                                return [2 /*return*/];
                            console.error("CandidateDashboard: fetch failed", err_1);
                            setState(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { loading: false, error: "Failed to load candidates. Please try again." })); });
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            }); }, 300);
            return [2 /*return*/];
        });
    }); }, [jobId, matricId, roleIDs, enable]);
    var setPageSize = (0, react_1.useCallback)(function (size) {
        void fetchPage(1, size);
    }, [fetchPage]);
    var refresh = (0, react_1.useCallback)(function () {
        void fetchPage(state.pagination.currentPage, pageSizeRef.current);
    }, [fetchPage, state.pagination.currentPage]);
    (0, react_1.useEffect)(function () {
        void fetchPage(1, initialPageSize);
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