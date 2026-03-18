"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTrackerData = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var ServiceExport_1 = require("../../../../services/ServiceExport");
var ApiConfig_1 = require("../../../../utilities/ApiConfig");
var metricColumns_config_1 = require("../metricColumns.config");
var Config_1 = require("../../../../utilities/Config");
var useTrackerData = function (MatricID) {
    var _a = (0, react_1.useState)([]), trackerData = _a[0], setTrackerData = _a[1];
    var _b = (0, react_1.useState)(false), loading = _b[0], setLoading = _b[1];
    var fetchtrackerData = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var condition, Filter, response, mappedData, filterObj, _a, error_1;
        var _b, _c, _d, _e;
        return tslib_1.__generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 10, 11, 12]);
                    setLoading(true);
                    condition = "and";
                    Filter = metricColumns_config_1.MetricQueryConfig[MatricID];
                    console.log(Filter);
                    response = void 0;
                    mappedData = [];
                    filterObj = Array.isArray(Filter) ? Filter[0] : Filter;
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
                    response = _f.sent();
                    mappedData = ((_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.map(function (item) { return ({
                        JobCode: item.JobCode,
                        JobTitle: item.JobTitleEnglish,
                        BusinessUnitCode: item.BusinessUnitCode,
                        PositionRequest: item.Type,
                        Nationality: item.Nationality,
                        Status: item.Status,
                    }); })) || [];
                    return [3 /*break*/, 9];
                case 3: return [4 /*yield*/, ServiceExport_1.DashboardServices.GetRecruitmentDetails(filterObj.Filter[0], condition)];
                case 4:
                    response = _f.sent();
                    mappedData = ((_c = response === null || response === void 0 ? void 0 : response.data) === null || _c === void 0 ? void 0 : _c.map(function (item) { return ({
                        JobCode: item.JobCode,
                        JobTitle: item.JobTitleEnglish,
                        BusinessUnitCode: item.BusinessUnitCode,
                        PositionRequest: item.Type,
                        Nationality: item.Nationality,
                        Status: item.Status,
                    }); })) || [];
                    return [3 /*break*/, 9];
                case 5: return [4 /*yield*/, ServiceExport_1.DashboardServices.GetCandidateDetails(filterObj.Filter[0], condition)];
                case 6:
                    response = _f.sent();
                    mappedData = ((_d = response === null || response === void 0 ? void 0 : response.data) === null || _d === void 0 ? void 0 : _d.map(function (item) { return ({
                        ApplicantName: item.ApplicantName,
                        PositionTitle: item.PositionTitle,
                        Nationality: item.Nationality,
                        InterviewDate: item.InterviewDate,
                        JobGrade: item.JobGrade,
                        Status: item.Status,
                    }); })) || [];
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, ServiceExport_1.DashboardServices.GetSelectedCandidate(filterObj.Filter[0], condition)];
                case 8:
                    response = _f.sent();
                    mappedData = ((_e = response === null || response === void 0 ? void 0 : response.data) === null || _e === void 0 ? void 0 : _e.map(function (item) { return ({
                        ApplicantName: item.ApplicantName,
                        PositionTitle: item.PositionTitle,
                        Nationality: item.Nationality,
                        PositionID: item.PositionID,
                        JobGrade: item.JobGrade,
                        Status: item.Status,
                    }); })) || [];
                    return [3 /*break*/, 9];
                case 9:
                    if (response && response.status === ApiConfig_1.ResponeStatus.SUCCESS) {
                        setTrackerData(mappedData);
                    }
                    return [3 /*break*/, 12];
                case 10:
                    error_1 = _f.sent();
                    console.error("Dashboard metrics error", error_1);
                    return [3 /*break*/, 12];
                case 11:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    }); }, [MatricID]);
    (0, react_1.useEffect)(function () {
        if (!MatricID)
            return;
        void fetchtrackerData();
    }, [MatricID, fetchtrackerData]);
    return {
        trackerData: trackerData,
        loading: loading,
        refresh: fetchtrackerData
    };
};
exports.useTrackerData = useTrackerData;
//# sourceMappingURL=usetrackerdata.js.map