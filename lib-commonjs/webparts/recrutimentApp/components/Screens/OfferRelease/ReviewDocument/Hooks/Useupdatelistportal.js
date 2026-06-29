"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUpdateListPortal = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var Config_1 = require("../../../../../utilities/Config");
var ApiConfig_1 = require("../../../../../utilities/ApiConfig");
var ConditionConfig_1 = require("../../../../../utilities/ConditionConfig");
var RoleContext_1 = require("../../../../../utilities/hooks/RoleContext");
var ServiceExport_1 = require("../../../../../services/ServiceExport");
var WorkflowConfig_1 = require("../../../../Hooks/WorkflowConfig");
var PORTAL_STATUS_IDS = [
    Config_1.StatusId.PendingBGdocuploadedbycandidate,
    Config_1.StatusId.PendingCandidateOfferLetterUpload,
    Config_1.StatusId.PendingCandidateWorkPermitreleatedDoc,
    Config_1.StatusId.PendingCandidateEmploymentContractUpload,
    Config_1.StatusId.PendingLabourHireOfferRelease,
    Config_1.StatusId.PendingLabourhireWPPayment,
    Config_1.StatusId.PendingLHWorkPermitProcess,
    Config_1.StatusId.PendingLHECRelease,
];
var APPROVED_WORKFLOW_IDS = [
    Config_1.workflowStatusApi.UploadedtheCandidateBGVDocs,
    Config_1.workflowStatusApi.CandidateuploadedtheSignedOfferLetter,
    Config_1.workflowStatusApi.UploadedthesignedEmployementcontractform,
    Config_1.workflowStatusApi.PendingLabourHireOfferRelease,
    Config_1.workflowStatusApi.PendingLabourhireWPPayment,
    Config_1.workflowStatusApi.PendingLHWorkPermitProcess,
    Config_1.workflowStatusApi.PendingLHECRelease,
];
var DECLINE_WORKFLOW_IDS = [
    Config_1.workflowStatusApi.Offerdecline,
    Config_1.workflowStatusApi.SysytmeDecline,
];
var buildFilters = function (currentRoleID, userDetails) {
    var _a, _b;
    var filters = [
        {
            FilterKey: "ItemCreated",
            Operator: "eq",
            FilterValue: ApiConfig_1.Choices.No,
        },
    ];
    if (currentRoleID.includes(Config_1.RoleID.RecruitmentHR)) {
        filters.push({
            FilterKey: "RecruitmentHR",
            Operator: "eq",
            FilterValue: (_b = (_a = userDetails[0]) === null || _a === void 0 ? void 0 : _a.EmailId) !== null && _b !== void 0 ? _b : "",
        });
    }
    return filters;
};
var filterPortalItems = function (items) {
    return items.filter(function (item) { return PORTAL_STATUS_IDS.includes(item.StatusID); });
};
var getApprovedIds = function (empCategory) { return tslib_1.__spreadArray(tslib_1.__spreadArray([], APPROVED_WORKFLOW_IDS, true), [
    empCategory === ConditionConfig_1.EmployeementCategory.KCSAEmployee
        ? Config_1.workflowStatusApi.CandidateUploadedcandidatepersonalDocs
        : "",
], false); };
var resolveStatusUpdate = function (item, portalItems) {
    var _a, _b;
    var jobRequestId = String(item.jobRequestId);
    var declined = portalItems.find(function (res) {
        return res.JobRequestID === jobRequestId &&
            DECLINE_WORKFLOW_IDS.includes(item.workflowStatusId);
    });
    var StatusID = (0, WorkflowConfig_1.WorkflowHODConfig)((_a = declined === null || declined === void 0 ? void 0 : declined.StatusID) !== null && _a !== void 0 ? _a : 0, false, declined === null || declined === void 0 ? void 0 : declined.IsExpat, declined === null || declined === void 0 ? void 0 : declined.EmploymentCategory);
    if (declined) {
        return tslib_1.__assign(tslib_1.__assign({}, item), { ID: declined.ID, StatusId: StatusID });
    }
    // Check approved match
    var approved = portalItems.find(function (res) {
        var approvedIds = getApprovedIds(res.EmploymentCategory);
        return (res.JobRequestID === jobRequestId &&
            approvedIds.includes(item.workflowStatusId));
    });
    var ApprovedStatus = (0, WorkflowConfig_1.WorkflowHODConfig)((_b = approved === null || approved === void 0 ? void 0 : approved.StatusID) !== null && _b !== void 0 ? _b : 0, false, approved === null || approved === void 0 ? void 0 : approved.IsExpat, approved === null || approved === void 0 ? void 0 : approved.EmploymentCategory);
    if (approved) {
        return tslib_1.__assign(tslib_1.__assign({}, item), { ID: approved.ID, StatusId: ApprovedStatus });
    }
    return null;
};
var mapSelectedCandidate = function (item) {
    var dept = item.DeptDetails;
    var candi = item === null || item === void 0 ? void 0 : item.candiDetails;
    return {
        StatusID: item === null || item === void 0 ? void 0 : item.StatusId,
        ID: item === null || item === void 0 ? void 0 : item.ItemID,
        JobRequestID: candi === null || candi === void 0 ? void 0 : candi.jobrequestID,
        EmploymentCategory: dept === null || dept === void 0 ? void 0 : dept.EmploymentCategory,
        IsExpat: candi === null || candi === void 0 ? void 0 : candi.isExpat,
    };
};
var useUpdateListPortal = function (_a) {
    var items = _a.items, _b = _a.refreshKey, refreshKey = _b === void 0 ? 0 : _b;
    var _c = (0, react_1.useState)(false), isLoading = _c[0], setIsLoading = _c[1];
    var _d = (0, react_1.useState)(false), isSuccess = _d[0], setIsSuccess = _d[1];
    var _e = (0, react_1.useState)(null), error = _e[0], setError = _e[1];
    var _f = (0, RoleContext_1.userInfo)(), roleIDs = _f.roleIDs, ADGroupData = _f.ADGroupData;
    var reset = (0, react_1.useCallback)(function () {
        setIsLoading(false);
        setIsSuccess(false);
        setError(null);
    }, []);
    var updateListPortal = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var filter, selectedCandidates, portalItems_1, jobRequestIDs, updatedStatus, statusList, resolvedItems, err_1, message;
        var _a, _b, _c, _d, _e;
        return tslib_1.__generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    setIsLoading(true);
                    setIsSuccess(false);
                    setError(null);
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 6, 7, 8]);
                    filter = [
                        {
                            FilterKey: "StatusId",
                            Operator: "in",
                            FilterValue: PORTAL_STATUS_IDS,
                        },
                    ];
                    return [4 /*yield*/, ServiceExport_1.DashboardServices.GetSelectedCandidate(filter, "and")];
                case 2:
                    selectedCandidates = _f.sent();
                    portalItems_1 = (_b = (_a = selectedCandidates.data) === null || _a === void 0 ? void 0 : _a.map(function (item) {
                        return mapSelectedCandidate(item);
                    })) !== null && _b !== void 0 ? _b : [];
                    if (portalItems_1.length === 0) {
                        setIsSuccess(true);
                        return [2 /*return*/];
                    }
                    jobRequestIDs = portalItems_1.map(function (item) { return item.JobRequestID; });
                    return [4 /*yield*/, ServiceExport_1.OfferServices.GetJobRequestData(jobRequestIDs)];
                case 3:
                    updatedStatus = _f.sent();
                    statusList = (_d = (_c = updatedStatus === null || updatedStatus === void 0 ? void 0 : updatedStatus.data) === null || _c === void 0 ? void 0 : _c.data) !== null && _d !== void 0 ? _d : [];
                    resolvedItems = statusList
                        .map(function (item) { return resolveStatusUpdate(item, portalItems_1); })
                        .filter(function (item) { return item !== null; });
                    if (!(resolvedItems.length > 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, ServiceExport_1.OfferServices.UpdateStatusSelectedHOD(resolvedItems)];
                case 4:
                    _f.sent();
                    _f.label = 5;
                case 5:
                    setIsSuccess(true);
                    return [3 /*break*/, 8];
                case 6:
                    err_1 = _f.sent();
                    message = (_e = err_1 === null || err_1 === void 0 ? void 0 : err_1.message) !== null && _e !== void 0 ? _e : "An unexpected error occurred.";
                    setError(message);
                    console.error("[useUpdateListPortal]", err_1);
                    return [3 /*break*/, 8];
                case 7:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); }, [roleIDs, ADGroupData, refreshKey]);
    return { updateListPortal: updateListPortal, isLoading: isLoading, isSuccess: isSuccess, error: error, reset: reset };
};
exports.useUpdateListPortal = useUpdateListPortal;
//# sourceMappingURL=Useupdatelistportal.js.map