"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTrackerData = exports.mapResponseByListName = exports.callServiceByListName = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var ServiceExport_1 = require("../../../../services/ServiceExport");
var ApiConfig_1 = require("../../../../utilities/ApiConfig");
var metricColumns_config_1 = require("../metricColumns.config");
var Config_1 = require("../../../../utilities/Config");
var ConditionConfig_1 = require("../../../../utilities/ConditionConfig");
var RoleContext_1 = require("../../../../utilities/hooks/RoleContext");
var callServiceByListName = function (listName, filter, condition, roleIDs, MatricID, EmailID) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var _a;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (roleIDs === null || roleIDs === void 0 ? void 0 : roleIDs.includes(Config_1.RoleID.FinanceDepartment)) {
                    filter = filter.filter(function (f) { return f.FilterKey !== "RecruitmentHR"; });
                }
                _a = listName;
                switch (_a) {
                    case Config_1.ListNames.HRMSNewPositionRequest: return [3 /*break*/, 1];
                    case Config_1.ListNames.HRMSRecruitmentDptDetails: return [3 /*break*/, 3];
                    case Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails: return [3 /*break*/, 5];
                    case Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD: return [3 /*break*/, 7];
                }
                return [3 /*break*/, 9];
            case 1: return [4 /*yield*/, ServiceExport_1.DashboardServices.GetNPAEPVRRDetails(filter, condition)];
            case 2: return [2 /*return*/, _b.sent()];
            case 3: return [4 /*yield*/, ServiceExport_1.DashboardServices.GetRecruitmentDetails(filter, condition, MatricID)];
            case 4: return [2 /*return*/, _b.sent()];
            case 5: return [4 /*yield*/, ServiceExport_1.DashboardServices.GetCandidateDetails(filter, condition, MatricID, EmailID)];
            case 6: return [2 /*return*/, _b.sent()];
            case 7:
                if (roleIDs === null || roleIDs === void 0 ? void 0 : roleIDs.includes(Config_1.RoleID.FinanceDepartment)) {
                    filter = filter
                        .filter(function (f) { return f.FilterKey !== "RecruitmentHR"; })
                        .map(function (f) {
                        if (f.FilterKey === "StatusId" && Array.isArray(f.FilterValue)) {
                            return tslib_1.__assign(tslib_1.__assign({}, f), { FilterValue: f.FilterValue.filter(function (status) {
                                    return status !== Config_1.StatusId.PendingHROfferInitiate &&
                                        status !== Config_1.StatusId.PendingHROfferReview &&
                                        status !== Config_1.StatusId.PendingHRReviewOfferWorkPermitInit &&
                                        status !==
                                            Config_1.StatusId.PendingHRReviewOfferuploadEmploymentInit &&
                                        status !== Config_1.StatusId.PendingHREmploymentContractInit &&
                                        status !== Config_1.StatusId.PendingHREmploymentContractReview &&
                                        status !==
                                            Config_1.StatusId.PendingHREmploymentContractVerification &&
                                        status !== Config_1.StatusId.PendingHRpreonboardingchecklist;
                                }) });
                        }
                        return f;
                    });
                }
                if (roleIDs === null || roleIDs === void 0 ? void 0 : roleIDs.includes(Config_1.RoleID.RecruitmentHR)) {
                    filter = filter.map(function (f) {
                        if (f.FilterKey === "StatusId" && Array.isArray(f.FilterValue)) {
                            return tslib_1.__assign(tslib_1.__assign({}, f), { FilterValue: f.FilterValue.filter(function (status) {
                                    return status !== Config_1.StatusId.PendingFinancePaymentReview;
                                }) });
                        }
                        return f;
                    });
                }
                return [4 /*yield*/, ServiceExport_1.DashboardServices.GetSelectedCandidate(filter, condition)];
            case 8: return [2 /*return*/, _b.sent()];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.callServiceByListName = callServiceByListName;
var mapResponseByListName = function (listName, data, MatricId) {
    if (!data)
        return [];
    var shouldShowProfile = MatricId === ConditionConfig_1.MatricID.ReviewProfileHR ||
        MatricId === ConditionConfig_1.MatricID.ReviewProfileLM ||
        MatricId === ConditionConfig_1.MatricID.AssignInterviewPanel;
    switch (listName) {
        case Config_1.ListNames.HRMSNewPositionRequest:
        case Config_1.ListNames.HRMSRecruitmentDptDetails:
            return data.map(function (item) { return (tslib_1.__assign(tslib_1.__assign({ JobCode: item.JobCode, JobTitle: item.JobTitleEnglish }, (shouldShowProfile && {
                ProfileCount: item.CandidateCount,
            })), { BusinessUnitCode: item.BusinessUnitCode, PositionRequest: item.Type, Nationality: item.Nationality, Status: item.Status })); });
        case Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails:
            return data.map(function (item) { return ({
                ApplicantName: item.ApplicantName,
                PositionTitle: item.PositionTitle,
                Nationality: item.Nationality,
                InterviewDate: item.InterviewDate,
                JobGrade: item.JobGrade,
                Status: item.Status,
            }); });
        case Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD:
            return data.map(function (item) { return ({
                ApplicantName: item.ApplicantName,
                PositionTitle: item.PositionTitle,
                Nationality: item.Nationality,
                PositionID: item.PositionID,
                JobGrade: item.JobGrade,
                Status: item.Status,
            }); });
        default:
            return [];
    }
};
exports.mapResponseByListName = mapResponseByListName;
var useTrackerData = function (MatricID, refreshKey) {
    var _a = (0, RoleContext_1.userInfo)(), ADGroupData = _a.ADGroupData, roleIDs = _a.roleIDs;
    var _b = (0, react_1.useState)([]), trackerData = _b[0], setTrackerData = _b[1];
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
    var fetchtrackerData = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var configMap, config, configs_1, responses, allData_1, error_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    configMap = (0, metricColumns_config_1.MetricQueryConfig)(ADGroupData.EmailId[0]);
                    config = configMap[MatricID];
                    if (!config) {
                        console.warn("No config found for MatricID:", MatricID);
                        return [2 /*return*/];
                    }
                    configs_1 = Array.isArray(config) ? config : [config];
                    return [4 /*yield*/, Promise.all(configs_1.map(function (cfg) {
                            return (0, exports.callServiceByListName)(cfg.ListName, cfg.Filter, "and", roleIDs, MatricID, ADGroupData.EmailId[0]);
                        }))];
                case 1:
                    responses = _a.sent();
                    allData_1 = [];
                    responses.forEach(function (response, index) {
                        if ((response === null || response === void 0 ? void 0 : response.status) === ApiConfig_1.ResponeStatus.SUCCESS) {
                            var mapped = (0, exports.mapResponseByListName)(configs_1[index].ListName, response.data, MatricID);
                            allData_1.push.apply(allData_1, mapped);
                        }
                    });
                    setTrackerData(allData_1);
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error fetching tracker data:", error_1);
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [MatricID, refreshKey]);
    (0, react_1.useEffect)(function () {
        if (!MatricID)
            return;
        void fetchtrackerData();
    }, [MatricID, fetchtrackerData]);
    return {
        trackerData: trackerData,
        loading: loading,
        refresh: fetchtrackerData,
    };
};
exports.useTrackerData = useTrackerData;
//# sourceMappingURL=usetrackerdata.js.map