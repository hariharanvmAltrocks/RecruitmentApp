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
// const mockRecruitmentItems: RecruitmentItem[] = [
//   {
//     id: "vac-1",
//     jobCode: "MIN-100",
//     title: "Senior Mining Engineer - Mining",
//     department: "Mining",
//     count: 1,
//     requestType: "New Position",
//     nationality: "Local",
//     status: "READY FOR RECRUITMENT",
//   },
//   {
//     id: "vac-2",
//     jobCode: "ENG-101",
//     title: "Underground Shift Supervisor - Engineering",
//     department: "Engineering",
//     count: 2,
//     requestType: "New Position",
//     nationality: "Local",
//     status: "READY FOR RECRUITMENT",
//   },
//   {
//     id: "vac-3",
//     jobCode: "SHE-102",
//     title: "Geotechnical Technician - SHEQ",
//     department: "SHEQ",
//     count: 3,
//     requestType: "New Position",
//     nationality: "Local",
//     status: "READY FOR RECRUITMENT",
//   },
//   {
//     id: "vac-4",
//     jobCode: "PRO-103",
//     title: "Mechanical Foreman - Processing",
//     department: "Processing",
//     count: 4,
//     requestType: "New Position",
//     nationality: "Local",
//     status: "READY FOR RECRUITMENT",
//   },
//   {
//     id: "vac-5",
//     jobCode: "HUM-104",
//     title: "Safety Officer - Human Resources",
//     department: "Human Resources",
//     count: 5,
//     requestType: "New Position",
//     nationality: "Local",
//     status: "READY FOR RECRUITMENT",
//   },
//   {
//     id: "vac-6",
//     jobCode: "SUP-105",
//     title: "Plant Electrician - Supply Chain",
//     department: "Supply Chain",
//     count: 1,
//     requestType: "New Position",
//     nationality: "Local",
//     status: "READY FOR RECRUITMENT",
//   },
//   {
//     id: "vac-7",
//     jobCode: "ICT-106",
//     title: "HR Coordinator - ICT",
//     department: "ICT",
//     count: 2,
//     requestType: "New Position",
//     nationality: "Local",
//     status: "READY FOR RECRUITMENT",
//   },
// ];
var useRecruitmentDetails = function (activeTabKey) {
    var _a = (0, react_1.useState)([]), items = _a[0], setItems = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    var matricID = (0, UIStateContext_1.useUIState)().MatricID;
    (0, react_1.useEffect)(function () {
        var isMounted = true;
        setLoading(true);
        var timer = setTimeout(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var Filter, condition, response, filterObj, _a, mappedItems;
            var _b, _c, _d, _e, _f, _g;
            return tslib_1.__generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        if (!isMounted) {
                            return [2 /*return*/];
                        }
                        Filter = metricColumns_config_1.MetricQueryConfig[matricID];
                        condition = "and";
                        filterObj = Array.isArray(Filter) ? Filter[0] : Filter;
                        if (!(matricID != 0)) return [3 /*break*/, 10];
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
                        response = _h.sent();
                        return [3 /*break*/, 9];
                    case 3: return [4 /*yield*/, ServiceExport_1.DashboardServices.GetRecruitmentDetails(filterObj.Filter[0], condition)];
                    case 4:
                        //  if(matricID === Ma)
                        response = _h.sent();
                        return [3 /*break*/, 9];
                    case 5: return [4 /*yield*/, ServiceExport_1.DashboardServices.GetCandidateDetails(filterObj.Filter[0], condition)];
                    case 6:
                        response = _h.sent();
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, ServiceExport_1.DashboardServices.GetSelectedCandidate(filterObj.Filter[0], condition)];
                    case 8:
                        response = _h.sent();
                        return [3 /*break*/, 9];
                    case 9: return [3 /*break*/, 12];
                    case 10: return [4 /*yield*/, ServiceExport_1.DashboardServices.GetRecruitmentDetails([], condition)];
                    case 11:
                        response = _h.sent();
                        _h.label = 12;
                    case 12:
                        if (matricID === ConditionConfig_1.MatricID.EvalutionHR || matricID === ConditionConfig_1.MatricID.EvalutionHOD || matricID === ConditionConfig_1.MatricID.EvalutionLM) {
                            mappedItems = (_c = (_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.map(function (item) { return ({
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
                            }); })) !== null && _c !== void 0 ? _c : [];
                        }
                        else {
                            if (filterObj.ListName === Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails) {
                                mappedItems = (_e = (_d = response === null || response === void 0 ? void 0 : response.data) === null || _d === void 0 ? void 0 : _d.map(function (item) {
                                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                                    return ({
                                        id: (_a = item.DeptDetails[0]) === null || _a === void 0 ? void 0 : _a.RecordID,
                                        ItemID: (_b = item.DeptDetails[0]) === null || _b === void 0 ? void 0 : _b.ID,
                                        jobCode: (_c = item === null || item === void 0 ? void 0 : item.DeptDetails[0]) === null || _c === void 0 ? void 0 : _c.JobCode,
                                        title: (_e = (_d = item === null || item === void 0 ? void 0 : item.DeptDetails[0]) === null || _d === void 0 ? void 0 : _d.JobTitleEnglish) !== null && _e !== void 0 ? _e : "",
                                        department: (_f = item === null || item === void 0 ? void 0 : item.DeptDetails[0]) === null || _f === void 0 ? void 0 : _f.Department,
                                        count: (_g = item.DeptDetails[0]) === null || _g === void 0 ? void 0 : _g.NumberOfPersonNeeded,
                                        requestType: (_h = item.DeptDetails[0]) === null || _h === void 0 ? void 0 : _h.Type,
                                        nationality: (_j = item.DeptDetails[0]) === null || _j === void 0 ? void 0 : _j.Nationality,
                                        status: (_k = item.DeptDetails[0]) === null || _k === void 0 ? void 0 : _k.Status,
                                        statusId: (_l = item.DeptDetails[0]) === null || _l === void 0 ? void 0 : _l.StatusId,
                                        jobCodeID: (_m = item.DeptDetails[0]) === null || _m === void 0 ? void 0 : _m.JobCodeId,
                                    });
                                })) !== null && _e !== void 0 ? _e : [];
                            }
                            else {
                                mappedItems = (_g = (_f = response === null || response === void 0 ? void 0 : response.data) === null || _f === void 0 ? void 0 : _f.map(function (item) {
                                    var _a;
                                    return ({
                                        id: item === null || item === void 0 ? void 0 : item.RecordID,
                                        ItemID: item === null || item === void 0 ? void 0 : item.ID,
                                        jobCode: item === null || item === void 0 ? void 0 : item.JobCode,
                                        title: (_a = item === null || item === void 0 ? void 0 : item.JobTitleEnglish) !== null && _a !== void 0 ? _a : "",
                                        department: item === null || item === void 0 ? void 0 : item.Department,
                                        count: item.NumberOfPersonNeeded,
                                        requestType: item.Type,
                                        nationality: item.Nationality,
                                        status: item.Status,
                                        statusId: item.StatusId,
                                        jobCodeID: item.JobCodeId,
                                    });
                                })) !== null && _g !== void 0 ? _g : [];
                            }
                        }
                        setItems(mappedItems);
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        }); }, 1100);
        return function () {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [matricID]);
    var memoizedItems = (0, react_1.useMemo)(function () { return items; }, [items]);
    return {
        items: memoizedItems,
        loading: loading,
    };
};
exports.useRecruitmentDetails = useRecruitmentDetails;
//# sourceMappingURL=useRecruitmentDetails.js.map