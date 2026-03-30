"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRecruitmentDetails = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var ServiceExport_1 = require("../../../../services/ServiceExport");
var Config_1 = require("../../../../utilities/Config");
var metricColumns_config_1 = require("../../Dashboard/metricColumns.config");
var UIStateContext_1 = require("../../../RecrutimentApp/UIStateContext");
var ConditionConfig_1 = require("../../../../utilities/ConditionConfig");
var mapEvaluationItem = function (item) { return ({
    id: item.RecordID,
    ItemID: item.ID,
    applicantName: item.ApplicantName,
    title: item.PositionTitle,
    nationlity: item.Nationality,
    interviewDate: item.InterviewDate,
    interviewLevels: item.interviewLevels,
    grade: item.JobGrade,
    status: item.Status,
    statusId: item.StatusId,
    jobCodeID: item.JobCodeId,
}); };
var mapCandidateItem = function (item) {
    var _a, _b;
    var dept = (_a = item.DeptDetails) === null || _a === void 0 ? void 0 : _a[0];
    return {
        id: dept === null || dept === void 0 ? void 0 : dept.RecordID,
        ItemID: dept === null || dept === void 0 ? void 0 : dept.ID,
        jobCode: dept === null || dept === void 0 ? void 0 : dept.JobCode,
        title: (_b = dept === null || dept === void 0 ? void 0 : dept.JobTitleEnglish) !== null && _b !== void 0 ? _b : "",
        department: dept === null || dept === void 0 ? void 0 : dept.Department,
        count: dept === null || dept === void 0 ? void 0 : dept.NumberOfPersonNeeded,
        requestType: dept === null || dept === void 0 ? void 0 : dept.Type,
        nationality: dept === null || dept === void 0 ? void 0 : dept.Nationality,
        status: dept === null || dept === void 0 ? void 0 : dept.Status,
        statusId: dept === null || dept === void 0 ? void 0 : dept.StatusId,
        jobCodeID: dept === null || dept === void 0 ? void 0 : dept.JobCodeId,
    };
};
var mapRecruitmentItem = function (item) {
    var _a;
    return ({
        id: item === null || item === void 0 ? void 0 : item.RecordID,
        ItemID: item === null || item === void 0 ? void 0 : item.ID,
        jobCode: item === null || item === void 0 ? void 0 : item.JobCode,
        title: (_a = item === null || item === void 0 ? void 0 : item.JobTitleEnglish) !== null && _a !== void 0 ? _a : "",
        department: item === null || item === void 0 ? void 0 : item.Department,
        count: item === null || item === void 0 ? void 0 : item.NumberOfPersonNeeded,
        requestType: item === null || item === void 0 ? void 0 : item.Type,
        nationality: item === null || item === void 0 ? void 0 : item.Nationality,
        status: item === null || item === void 0 ? void 0 : item.Status,
        statusId: item === null || item === void 0 ? void 0 : item.StatusId,
        jobCodeID: item === null || item === void 0 ? void 0 : item.JobCodeId,
    });
};
// ─── Hook ─────────────────────────────────────────────────────────────────────
var useRecruitmentDetails = function (activeTabKey, refreshKey) {
    if (refreshKey === void 0) { refreshKey = 0; }
    var _a = (0, react_1.useState)([]), items = _a[0], setItems = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    var matricID = (0, UIStateContext_1.useUIState)().MatricID;
    (0, react_1.useEffect)(function () {
        var cancelled = false;
        setLoading(true);
        var timer = setTimeout(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var Filter, filterObj, condition, response, _a, isEvaluation, mappedItems, _b;
            var _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 13, 14, 15]);
                        Filter = metricColumns_config_1.MetricQueryConfig[matricID];
                        filterObj = Array.isArray(Filter) ? Filter[0] : Filter;
                        condition = "and";
                        response = void 0;
                        if (!(matricID !== 0)) return [3 /*break*/, 10];
                        _a = filterObj.ListName;
                        switch (_a) {
                            case Config_1.ListNames.HRMSNewPositionRequest: return [3 /*break*/, 1];
                            case Config_1.ListNames.HRMSRecruitmentDptDetails: return [3 /*break*/, 3];
                            case Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails: return [3 /*break*/, 5];
                            case Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD: return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 9];
                    case 1: return [4 /*yield*/, ServiceExport_1.DashboardServices.GetNPAEPVRRDetails(filterObj.Filter, condition)];
                    case 2:
                        response = _d.sent();
                        return [3 /*break*/, 9];
                    case 3: return [4 /*yield*/, ServiceExport_1.DashboardServices.GetRecruitmentDetails(filterObj.Filter[0], condition)];
                    case 4:
                        response = _d.sent();
                        return [3 /*break*/, 9];
                    case 5: return [4 /*yield*/, ServiceExport_1.DashboardServices.GetCandidateDetails(filterObj.Filter[0], condition)];
                    case 6:
                        response = _d.sent();
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, ServiceExport_1.DashboardServices.GetSelectedCandidate(filterObj.Filter[0], condition)];
                    case 8:
                        response = _d.sent();
                        return [3 /*break*/, 9];
                    case 9: return [3 /*break*/, 12];
                    case 10: return [4 /*yield*/, ServiceExport_1.DashboardServices.GetRecruitmentDetails([], condition)];
                    case 11:
                        response = _d.sent();
                        _d.label = 12;
                    case 12:
                        if (cancelled)
                            return [2 /*return*/];
                        isEvaluation = matricID === ConditionConfig_1.MatricID.EvalutionHR ||
                            matricID === ConditionConfig_1.MatricID.EvalutionHOD ||
                            matricID === ConditionConfig_1.MatricID.EvalutionLM;
                        mappedItems = ((_c = response === null || response === void 0 ? void 0 : response.data) !== null && _c !== void 0 ? _c : []).map(isEvaluation
                            ? mapEvaluationItem
                            : filterObj.ListName === Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails
                                ? mapCandidateItem
                                : mapRecruitmentItem);
                        setItems(mappedItems);
                        return [3 /*break*/, 15];
                    case 13:
                        _b = _d.sent();
                        if (!cancelled)
                            setItems([]);
                        return [3 /*break*/, 15];
                    case 14:
                        if (!cancelled)
                            setLoading(false);
                        return [7 /*endfinally*/];
                    case 15: return [2 /*return*/];
                }
            });
        }); }, 1100);
        return function () {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [matricID, refreshKey]); // ← refreshKey triggers re-fetch on Refresh button click
    return { items: items, loading: loading };
};
exports.useRecruitmentDetails = useRecruitmentDetails;
//# sourceMappingURL=useRecruitmentDetails.js.map