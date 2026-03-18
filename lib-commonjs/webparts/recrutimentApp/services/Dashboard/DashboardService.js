"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var moment_1 = tslib_1.__importDefault(require("moment"));
var ApiConfig_1 = require("../../utilities/ApiConfig");
var Config_1 = require("../../utilities/Config");
var spservice_1 = tslib_1.__importDefault(require("../SPService/spservice"));
var CareerPortalAPI_1 = require("../AxiosService/CareerPortalAPI");
var metricColumns_config_1 = require("../../components/Screens/Dashboard/metricColumns.config");
var DashboardService = /** @class */ (function () {
    function DashboardService() {
    }
    DashboardService.prototype.GetDashboardCount = function (queries, currentRoleID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var metricConfigs, spCounts_1, externalMetrics, externalCountMap_1, metrics, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        metricConfigs = (0, metricColumns_config_1.MatricColums)(currentRoleID);
                        if (!(metricConfigs === null || metricConfigs === void 0 ? void 0 : metricConfigs.length)) {
                            return [2 /*return*/, { data: [], status: 200, message: "No metrics configured for this role" }];
                        }
                        return [4 /*yield*/, spservice_1.default.batchGet(queries)];
                    case 1:
                        spCounts_1 = _a.sent();
                        externalMetrics = metricConfigs.filter(function (m) { return m.externalApi; });
                        return [4 /*yield*/, this._fetchExternalCounts(externalMetrics, spCounts_1, new Map())];
                    case 2:
                        externalCountMap_1 = _a.sent();
                        metrics = metricConfigs.map(function (config) {
                            var _a, _b, _c;
                            var hasExternalCount = externalCountMap_1.has(String(config.id));
                            var spCount = (_b = (_a = spCounts_1[config.id]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
                            var value = hasExternalCount
                                ? ((_c = externalCountMap_1.get(String(config.id))) !== null && _c !== void 0 ? _c : 0) + spCount
                                : spCount;
                            return tslib_1.__assign(tslib_1.__assign({}, config), { value: value, showArrow: config.showArrow || hasExternalCount });
                        });
                        return [2 /*return*/, { data: metrics, status: 200, message: "Dashboard counts fetched successfully" }];
                    case 3:
                        error_1 = _a.sent();
                        console.error("GetDashboardCount error:", error_1);
                        return [2 /*return*/, { data: [], status: 500, message: "Error fetching dashboard counts" }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DashboardService.prototype._fetchExternalCounts = function (externalMetrics, spCounts, _portalJobCodeMap) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, allJobCodeIds, portalItems, jobCodeIdToUniqueKey;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = new Map();
                        if (!externalMetrics.length)
                            return [2 /*return*/, result];
                        allJobCodeIds = Array.from(new Set(externalMetrics.flatMap(function (m) { var _a; return ((_a = spCounts[m.id]) !== null && _a !== void 0 ? _a : []).map(function (item) { return item.JobCodeId; }).filter(Boolean); })));
                        if (!allJobCodeIds.length)
                            return [2 /*return*/, result];
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.RecruitAppCareerPortalIntegration,
                                Select: "*,JobCode/JobCode",
                                Filter: [{ FilterKey: "JobCodeId", Operator: "in", FilterValue: allJobCodeIds }],
                                FilterCondition: "and",
                                Expand: "JobCode",
                                Topcount: ApiConfig_1.count.Topcount,
                                Orderby: "ID",
                                Orderbydecorasc: true,
                            })];
                    case 1:
                        portalItems = _a.sent();
                        jobCodeIdToUniqueKey = new Map(portalItems.map(function (item) { return [item.JobCodeId, item.JobUniqueKey]; }));
                        return [4 /*yield*/, Promise.all(externalMetrics.map(function (metric) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var jobCodeIds, jobUniqueKeys, params, response, total, _a;
                                var _b, _c;
                                return tslib_1.__generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            jobCodeIds = ((_b = spCounts[metric.id]) !== null && _b !== void 0 ? _b : [])
                                                .map(function (item) { return item.JobCodeId; })
                                                .filter(Boolean);
                                            jobUniqueKeys = jobCodeIds
                                                .map(function (id) { return jobCodeIdToUniqueKey.get(id); })
                                                .filter(function (key) { return !!key; });
                                            if (!jobUniqueKeys.length) {
                                                result.set(String(metric.id), 0);
                                                return [2 /*return*/];
                                            }
                                            params = {
                                                jobCode: jobUniqueKeys,
                                                workflowStausId: metric.externalApi.workflowStatuses,
                                            };
                                            _d.label = 1;
                                        case 1:
                                            _d.trys.push([1, 3, , 4]);
                                            return [4 /*yield*/, CareerPortalAPI_1.getProfileData.GetJobAppliedCount(params)];
                                        case 2:
                                            response = _d.sent();
                                            total = ((_c = response === null || response === void 0 ? void 0 : response.data) !== null && _c !== void 0 ? _c : []).reduce(function (sum, item) { var _a; return sum + ((_a = item.count) !== null && _a !== void 0 ? _a : 0); }, 0);
                                            result.set(String(metric.id), total);
                                            return [3 /*break*/, 4];
                                        case 3:
                                            _a = _d.sent();
                                            result.set(String(metric.id), 0);
                                            return [3 /*break*/, 4];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    DashboardService.prototype.GetRecruitmentDetails = function (filterParam, filterConditions) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res, GridResult, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSRecruitmentDptDetails,
                                Select: "*,Status/StatusDescription,JobCode/JobCode,JobCode/ID,JobCode/JobTitleInEnglish,BusinessUnitCode/BusineesUnitCode,Department/DepartmentName",
                                Filter: filterParam,
                                FilterCondition: filterConditions,
                                Expand: "Status,JobCode,BusinessUnitCode,Department",
                                Topcount: ApiConfig_1.count.Topcount,
                                Orderby: "ID",
                                Orderbydecorasc: true,
                            })];
                    case 1:
                        res = _a.sent();
                        if (!res.length) {
                            return [2 /*return*/, { data: [], status: 200, message: "No records found" }];
                        }
                        GridResult = res.map(function (item, index) {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
                            return ({
                                ID: item.ID,
                                RecordID: index + 1,
                                BusinessUnitCode: (_b = (_a = item === null || item === void 0 ? void 0 : item.BusinessUnitCode) === null || _a === void 0 ? void 0 : _a.BusineesUnitCode) !== null && _b !== void 0 ? _b : "",
                                Nationality: item === null || item === void 0 ? void 0 : item.Nationality,
                                NumberOfPersonNeeded: item === null || item === void 0 ? void 0 : item.NumberOfPersonNeeded,
                                Type: (_c = item === null || item === void 0 ? void 0 : item.DataFrom) !== null && _c !== void 0 ? _c : "",
                                Status: (_e = (_d = item === null || item === void 0 ? void 0 : item.Status) === null || _d === void 0 ? void 0 : _d.StatusDescription) !== null && _e !== void 0 ? _e : "",
                                StatusId: item === null || item === void 0 ? void 0 : item.StatusId,
                                JobCodeId: (_g = (_f = item === null || item === void 0 ? void 0 : item.JobCode) === null || _f === void 0 ? void 0 : _f.ID) !== null && _g !== void 0 ? _g : 0,
                                JobCode: (_j = (_h = item === null || item === void 0 ? void 0 : item.JobCode) === null || _h === void 0 ? void 0 : _h.JobCode) !== null && _j !== void 0 ? _j : "",
                                JobTitleEnglish: (_l = (_k = item === null || item === void 0 ? void 0 : item.JobCode) === null || _k === void 0 ? void 0 : _k.JobTitleInEnglish) !== null && _l !== void 0 ? _l : "",
                                ModifiedDate: (item === null || item === void 0 ? void 0 : item.Modified)
                                    ? (0, moment_1.default)(item.Modified).format("YYYY-MM-DD")
                                    : undefined,
                                CreatedDate: (item === null || item === void 0 ? void 0 : item.Created)
                                    ? (0, moment_1.default)(item.Created).format("YYYY-MM-DD")
                                    : undefined,
                                Department: (_o = (_m = item === null || item === void 0 ? void 0 : item.Department) === null || _m === void 0 ? void 0 : _m.DepartmentName) !== null && _o !== void 0 ? _o : "",
                            });
                        });
                        return [2 /*return*/, {
                                data: GridResult,
                                status: 200,
                                message: "GetRecruitmentDetails fetched successfully",
                            }];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Error fetching GetRecruitmentDetails:", error_2);
                        return [2 /*return*/, { data: [], status: 500, message: "Error fetching data" }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DashboardService.prototype.fetchRecruitmentByLookup = function (listName, filterParam, filterConditions) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var GridResult, res, ids, recruitmentFilter, DeptDetails_1, error_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        GridResult = [];
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: listName,
                                Select: "*,Status/StatusDescription,RecruitmentID/Id",
                                Filter: filterParam,
                                FilterCondition: filterConditions,
                                Expand: "RecruitmentID,Status",
                                Topcount: ApiConfig_1.count.Topcount,
                                Orderby: "ID",
                                Orderbydecorasc: true,
                            })];
                    case 1:
                        res = _a.sent();
                        if (!res.length) {
                            return [2 /*return*/, { data: [], status: 200, message: "No records found" }];
                        }
                        ids = res
                            .map(function (item) { var _a; return (_a = item.RecruitmentID) === null || _a === void 0 ? void 0 : _a.Id; })
                            .filter(Boolean);
                        if (!ids.length) {
                            return [2 /*return*/, { data: [], status: 200, message: "No linked recruitment records found" }];
                        }
                        recruitmentFilter = [
                            { FilterKey: "ID", Operator: "in", FilterValue: ids },
                        ];
                        return [4 /*yield*/, this.GetRecruitmentDetails(recruitmentFilter, filterConditions)];
                    case 2:
                        DeptDetails_1 = _a.sent();
                        if (listName === Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails) {
                            GridResult = res.map(function (item) {
                                var _a, _b;
                                var deptDetails = DeptDetails_1.data.filter(function (dpt) { var _a; return dpt.ID === ((_a = item.RecruitmentID) === null || _a === void 0 ? void 0 : _a.Id); });
                                return {
                                    ApplicantName: "".concat(item.FirstName || "", " ").concat(item.MiddleName || "", " ").concat(item.LastName || "").trim(),
                                    PositionTitle: item === null || item === void 0 ? void 0 : item.PositionTitle,
                                    JobGrade: item === null || item === void 0 ? void 0 : item.JobGrade,
                                    Nationality: item === null || item === void 0 ? void 0 : item.Nationality,
                                    Status: (_b = (_a = item === null || item === void 0 ? void 0 : item.Status) === null || _a === void 0 ? void 0 : _a.StatusDescription) !== null && _b !== void 0 ? _b : "",
                                    StatusId: item === null || item === void 0 ? void 0 : item.StatusId,
                                    InterviewDate: (item === null || item === void 0 ? void 0 : item.InterviewDate)
                                        ? (0, moment_1.default)(item.InterviewDate).format("YYYY-MM-DD")
                                        : undefined,
                                    ModifiedDate: (item === null || item === void 0 ? void 0 : item.Modified)
                                        ? (0, moment_1.default)(item.Modified).format("YYYY-MM-DD")
                                        : undefined,
                                    CreatedDate: (item === null || item === void 0 ? void 0 : item.Created)
                                        ? (0, moment_1.default)(item.Created).format("YYYY-MM-DD")
                                        : undefined,
                                    DeptDetails: deptDetails, // optional if needed
                                };
                            });
                        }
                        else if (listName === Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails) { }
                        return [2 /*return*/, { data: GridResult, status: 200, message: "Success" }];
                    case 3:
                        error_3 = _a.sent();
                        console.error("Error fetching from ".concat(listName, ":"), error_3);
                        return [2 /*return*/, { data: [], status: 500, message: "Error fetching data" }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DashboardService.prototype.GetCandidateDetails = function (filterParam, filterConditions) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var GridResult, res, ids, recruitmentFilter, DeptDetails_2, error_4;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        GridResult = [];
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                                Select: "*,Status/StatusDescription,RecruitmentID/Id",
                                Filter: filterParam,
                                FilterCondition: filterConditions,
                                Expand: "RecruitmentID,Status",
                                Topcount: ApiConfig_1.count.Topcount,
                                Orderby: "ID",
                                Orderbydecorasc: true,
                            })];
                    case 1:
                        res = _a.sent();
                        if (!res.length) {
                            return [2 /*return*/, { data: [], status: 200, message: "No records found" }];
                        }
                        ids = res
                            .map(function (item) { var _a; return (_a = item.RecruitmentID) === null || _a === void 0 ? void 0 : _a.Id; })
                            .filter(Boolean);
                        if (!ids.length) {
                            return [2 /*return*/, { data: [], status: 200, message: "No linked recruitment records found" }];
                        }
                        recruitmentFilter = [
                            { FilterKey: "ID", Operator: "in", FilterValue: ids },
                        ];
                        return [4 /*yield*/, this.GetRecruitmentDetails(recruitmentFilter, filterConditions)];
                    case 2:
                        DeptDetails_2 = _a.sent();
                        GridResult = res.map(function (item) {
                            var _a, _b;
                            var deptDetails = DeptDetails_2.data.filter(function (dpt) { var _a; return dpt.ID === ((_a = item.RecruitmentID) === null || _a === void 0 ? void 0 : _a.Id); });
                            return {
                                ApplicantName: "".concat(item.FirstName || "", " ").concat(item.MiddleName || "", " ").concat(item.LastName || "").trim(),
                                PositionTitle: item === null || item === void 0 ? void 0 : item.PositionTitle,
                                JobGrade: item === null || item === void 0 ? void 0 : item.JobGrade,
                                Nationality: item === null || item === void 0 ? void 0 : item.Nationality,
                                Status: (_b = (_a = item === null || item === void 0 ? void 0 : item.Status) === null || _a === void 0 ? void 0 : _a.StatusDescription) !== null && _b !== void 0 ? _b : "",
                                StatusId: item === null || item === void 0 ? void 0 : item.StatusId,
                                InterviewDate: (item === null || item === void 0 ? void 0 : item.InterviewDate)
                                    ? (0, moment_1.default)(item.InterviewDate).format("YYYY-MM-DD")
                                    : undefined,
                                ModifiedDate: (item === null || item === void 0 ? void 0 : item.Modified)
                                    ? (0, moment_1.default)(item.Modified).format("YYYY-MM-DD")
                                    : undefined,
                                CreatedDate: (item === null || item === void 0 ? void 0 : item.Created)
                                    ? (0, moment_1.default)(item.Created).format("YYYY-MM-DD")
                                    : undefined,
                                DeptDetails: deptDetails, // optional if needed
                            };
                        });
                        return [2 /*return*/, { data: GridResult, status: 200, message: "Success" }];
                    case 3:
                        error_4 = _a.sent();
                        console.error("Error fetching from Candidate details:", error_4);
                        return [2 /*return*/, { data: [], status: 500, message: "Error fetching data" }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DashboardService.prototype.GetSelectedCandidate = function (filterParam, filterConditions) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var GridResult, res, ids, candidateIds, recruitmentFilter, candidateFilter, DeptDetails, getCandidateDetails, deptMap_1, candidateMap_1, error_5;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        GridResult = [];
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD,
                                Select: "*,Status/StatusDescription,RecruitmentID/Id,CandidateID/ID",
                                Filter: filterParam,
                                FilterCondition: filterConditions,
                                Expand: "RecruitmentID,Status,CandidateID",
                                Topcount: ApiConfig_1.count.Topcount,
                                Orderby: "ID",
                                Orderbydecorasc: true,
                            })];
                    case 1:
                        res = _a.sent();
                        if (!res.length) {
                            return [2 /*return*/, { data: [], status: 200, message: "No records found" }];
                        }
                        ids = res
                            .map(function (item) { var _a; return (_a = item.RecruitmentID) === null || _a === void 0 ? void 0 : _a.Id; })
                            .filter(Boolean);
                        candidateIds = res
                            .map(function (item) { var _a; return (_a = item.CandidateID) === null || _a === void 0 ? void 0 : _a.ID; })
                            .filter(Boolean);
                        if (!ids.length) {
                            return [2 /*return*/, {
                                    data: [],
                                    status: 200,
                                    message: "No linked recruitment records found",
                                }];
                        }
                        recruitmentFilter = [
                            { FilterKey: "ID", Operator: "in", FilterValue: ids },
                        ];
                        candidateFilter = [
                            { FilterKey: "ID", Operator: "in", FilterValue: candidateIds },
                        ];
                        return [4 /*yield*/, this.GetRecruitmentDetails(recruitmentFilter, filterConditions)];
                    case 2:
                        DeptDetails = _a.sent();
                        return [4 /*yield*/, this.GetCandidateDetails(candidateFilter, filterConditions)];
                    case 3:
                        getCandidateDetails = _a.sent();
                        deptMap_1 = new Map(DeptDetails.data.map(function (d) { return [d.ID, d]; }));
                        candidateMap_1 = new Map(getCandidateDetails.data.map(function (c) { return [c.ID, c]; }));
                        // ✅ Main mapping
                        GridResult = res.map(function (item) {
                            var _a, _b, _c, _d, _e;
                            var deptDetails = deptMap_1.get((_a = item.RecruitmentID) === null || _a === void 0 ? void 0 : _a.Id);
                            var candidate = candidateMap_1.get((_b = item.CandidateID) === null || _b === void 0 ? void 0 : _b.ID);
                            return {
                                ApplicantName: (_c = candidate === null || candidate === void 0 ? void 0 : candidate.ApplicantName) !== null && _c !== void 0 ? _c : "",
                                PositionTitle: candidate === null || candidate === void 0 ? void 0 : candidate.PositionTitle,
                                JobGrade: candidate === null || candidate === void 0 ? void 0 : candidate.JobGrade,
                                Nationality: candidate === null || candidate === void 0 ? void 0 : candidate.Nationality,
                                Status: (_e = (_d = item === null || item === void 0 ? void 0 : item.Status) === null || _d === void 0 ? void 0 : _d.StatusDescription) !== null && _e !== void 0 ? _e : "",
                                StatusId: item === null || item === void 0 ? void 0 : item.StatusId,
                                PositionID: item === null || item === void 0 ? void 0 : item.PositionID,
                                ModifiedDate: (item === null || item === void 0 ? void 0 : item.Modified)
                                    ? (0, moment_1.default)(item.Modified).format("YYYY-MM-DD")
                                    : undefined,
                                CreatedDate: (item === null || item === void 0 ? void 0 : item.Created)
                                    ? (0, moment_1.default)(item.Created).format("YYYY-MM-DD")
                                    : undefined,
                                DeptDetails: deptDetails !== null && deptDetails !== void 0 ? deptDetails : null,
                            };
                        });
                        return [2 /*return*/, { data: GridResult, status: 200, message: "Success" }];
                    case 4:
                        error_5 = _a.sent();
                        console.error("Error fetching from Candidate details:", error_5);
                        return [2 /*return*/, { data: [], status: 500, message: "Error fetching data" }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DashboardService.prototype.GetNPAEPVRRDetails = function (filterParam, filterConditions) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var queries, batchRes, additionalExistingItems, newPositionItems, vacancyItems, additionalIds, newPositionIds, _a, additionalPositionRes, newPositionRes, additionalPositionMap_1, newPositionMap_1, mapCommonFields_1, additionalExistingResult, newPositionResult, vacancyResult, GridResult, error_6;
            var _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 3, , 4]);
                        queries = [
                            {
                                StateValue: 1,
                                ListName: Config_1.ListNames.HRMSAdditionalHeadCountForExisitingPosition,
                                Filter: filterParam,
                                FilterCondition: filterConditions,
                                select: ["*", "Status/StatusDescription", "BusinessUnitCode/BusineesUnitCode", "Department/DepartmentName"],
                                expand: ["Status", "BusinessUnitCode", "Department"],
                            },
                            {
                                StateValue: 2,
                                ListName: Config_1.ListNames.HRMSNewPositionRequest,
                                Filter: filterParam,
                                FilterCondition: filterConditions,
                                select: ["*", "BusinessUnitCode/BusineesUnitCode", "Status/StatusDescription", "Department/DepartmentName"],
                                expand: ["Status", "BusinessUnitCode", "Department"],
                            },
                            {
                                StateValue: 3,
                                ListName: Config_1.ListNames.HRMSVacancyReplacementRequest,
                                Filter: filterParam,
                                FilterCondition: filterConditions,
                                select: [
                                    "*",
                                    "BusinessUnitCode/BusineesUnitCode",
                                    "Status/StatusDescription",
                                    "JobCode/JobCode",
                                    "JobCode/JobTitleInEnglish",
                                    "JobCode/ID",
                                    "Department/DepartmentName"
                                ],
                                expand: ["Status", "JobCode", "BusinessUnitCode", "Department"],
                            },
                        ];
                        return [4 /*yield*/, spservice_1.default.batchGet(queries)];
                    case 1:
                        batchRes = _d.sent();
                        if (!batchRes || !Object.keys(batchRes).length) {
                            return [2 /*return*/, { data: [], status: 200, message: "No records found" }];
                        }
                        additionalExistingItems = batchRes[1] || [];
                        newPositionItems = batchRes[2] || [];
                        vacancyItems = batchRes[3] || [];
                        additionalIds = additionalExistingItems.map(function (i) { return i.ID; }).filter(Boolean);
                        newPositionIds = newPositionItems.map(function (i) { return i.ID; }).filter(Boolean);
                        return [4 /*yield*/, Promise.all([
                                additionalIds.length > 0
                                    ? this.GetPositionDetails([{ FilterKey: "LookupIDId", Operator: "in", FilterValue: additionalIds }], undefined, Config_1.ListNames.HRMSAdditionalHCForExisitingPositionWithHeadCountDetails)
                                    : Promise.resolve({ data: [], status: 200, message: "" }),
                                newPositionIds.length > 0
                                    ? this.GetPositionDetails([{ FilterKey: "PositionRequestID", Operator: "in", FilterValue: newPositionIds }], undefined, Config_1.ListNames.HRMSNewPositionRequestPositionDetails)
                                    : Promise.resolve({ data: [], status: 200, message: "" }),
                            ])];
                    case 2:
                        _a = _d.sent(), additionalPositionRes = _a[0], newPositionRes = _a[1];
                        additionalPositionMap_1 = new Map(((_b = additionalPositionRes.data) !== null && _b !== void 0 ? _b : []).map(function (d) { return [d.parentId, d]; }));
                        newPositionMap_1 = new Map(((_c = newPositionRes.data) !== null && _c !== void 0 ? _c : []).map(function (d) { return [d.parentId, d]; }));
                        mapCommonFields_1 = function (item, index) {
                            var _a, _b, _c, _d, _e, _f;
                            return ({
                                ID: item.ID,
                                RecordID: index + 1,
                                BusinessUnitCode: (_b = (_a = item === null || item === void 0 ? void 0 : item.BusinessUnitCode) === null || _a === void 0 ? void 0 : _a.BusineesUnitCode) !== null && _b !== void 0 ? _b : "",
                                NumberOfPersonNeeded: item === null || item === void 0 ? void 0 : item.NumberOfPersonNeeded,
                                Status: (_d = (_c = item === null || item === void 0 ? void 0 : item.Status) === null || _c === void 0 ? void 0 : _c.StatusDescription) !== null && _d !== void 0 ? _d : "",
                                Nationality: item === null || item === void 0 ? void 0 : item.Nationality,
                                ModifiedDate: (item === null || item === void 0 ? void 0 : item.Modified)
                                    ? (0, moment_1.default)(item.Modified).format("YYYY-MM-DD")
                                    : undefined,
                                CreatedDate: (item === null || item === void 0 ? void 0 : item.Created)
                                    ? (0, moment_1.default)(item.Created).format("YYYY-MM-DD")
                                    : undefined,
                                Department: (_f = (_e = item === null || item === void 0 ? void 0 : item.Department) === null || _e === void 0 ? void 0 : _e.DepartmentName) !== null && _f !== void 0 ? _f : "",
                            });
                        };
                        additionalExistingResult = additionalExistingItems.map(function (item, index) {
                            var _a, _b, _c, _d, _e;
                            var pos = additionalPositionMap_1.get(item.ID);
                            return tslib_1.__assign(tslib_1.__assign({}, mapCommonFields_1(item, index)), { Type: Config_1.DataFrom.ExistingPosition, JobCode: (_a = pos === null || pos === void 0 ? void 0 : pos.jobCode) !== null && _a !== void 0 ? _a : "", JobTitleEnglish: (_b = pos === null || pos === void 0 ? void 0 : pos.title) !== null && _b !== void 0 ? _b : "", JobTitleFrench: (_c = pos === null || pos === void 0 ? void 0 : pos.JobTitleFrench) !== null && _c !== void 0 ? _c : "", PatersonGrade: (_d = pos === null || pos === void 0 ? void 0 : pos.PatersonGrade) !== null && _d !== void 0 ? _d : "", DRCGrade: (_e = pos === null || pos === void 0 ? void 0 : pos.DRCGrade) !== null && _e !== void 0 ? _e : "" });
                        });
                        newPositionResult = newPositionItems.map(function (item, index) {
                            var _a, _b, _c, _d, _e;
                            var pos = newPositionMap_1.get(item.ID);
                            return tslib_1.__assign(tslib_1.__assign({}, mapCommonFields_1(item, index)), { Type: Config_1.DataFrom.NewPosition, JobCode: (_a = pos === null || pos === void 0 ? void 0 : pos.jobCode) !== null && _a !== void 0 ? _a : "", JobTitleEnglish: (_b = pos === null || pos === void 0 ? void 0 : pos.title) !== null && _b !== void 0 ? _b : "", JobTitleFrench: (_c = pos === null || pos === void 0 ? void 0 : pos.JobTitleFrench) !== null && _c !== void 0 ? _c : "", PatersonGrade: (_d = pos === null || pos === void 0 ? void 0 : pos.PatersonGrade) !== null && _d !== void 0 ? _d : "", DRCGrade: (_e = pos === null || pos === void 0 ? void 0 : pos.DRCGrade) !== null && _e !== void 0 ? _e : "" });
                        });
                        vacancyResult = vacancyItems.map(function (item, index) {
                            var _a, _b, _c, _d, _e, _f;
                            return (tslib_1.__assign(tslib_1.__assign({}, mapCommonFields_1(item, index)), { Type: Config_1.DataFrom.VacancyRecruitmentProcess, JobCodeId: (_b = (_a = item === null || item === void 0 ? void 0 : item.JobCode) === null || _a === void 0 ? void 0 : _a.ID) !== null && _b !== void 0 ? _b : 0, JobCode: (_d = (_c = item === null || item === void 0 ? void 0 : item.JobCode) === null || _c === void 0 ? void 0 : _c.JobCode) !== null && _d !== void 0 ? _d : "", JobTitleEnglish: (_f = (_e = item === null || item === void 0 ? void 0 : item.JobCode) === null || _e === void 0 ? void 0 : _e.JobTitleInEnglish) !== null && _f !== void 0 ? _f : "" }));
                        });
                        GridResult = tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray([], additionalExistingResult, true), newPositionResult, true), vacancyResult, true).map(function (item, index) { return (tslib_1.__assign(tslib_1.__assign({}, item), { RecordID: index + 1 })); });
                        return [2 /*return*/, {
                                data: GridResult,
                                status: 200,
                                message: "GetNPAEPVRRDetails fetched successfully",
                            }];
                    case 3:
                        error_6 = _d.sent();
                        console.error("Error fetching GetNPAEPVRRDetails:", error_6);
                        return [2 /*return*/, { data: [], status: 500, message: "Error fetching data" }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DashboardService.prototype.GetPositionDetails = function (Filter, filterConditions, ListName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var resdata, result, error_7;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: ListName,
                                Select: "*,JobTitleEnglish/JobTitleInEnglish,JobTitleEnglish/JobCode,DRCGrade/DRCGrade,PatersonGrade/PatersonGrade,JobTitleFrench/JobTitleInFrench",
                                Filter: Filter,
                                FilterCondition: filterConditions,
                                Expand: "JobTitleEnglish,DRCGrade,JobTitleFrench,PatersonGrade",
                                Topcount: ApiConfig_1.count.Topcount,
                            })];
                    case 1:
                        resdata = _a.sent();
                        result = resdata.map(function (item, index) {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                            return ({
                                parentId: (_b = (_a = item === null || item === void 0 ? void 0 : item.LookupIDId) !== null && _a !== void 0 ? _a : item === null || item === void 0 ? void 0 : item.PositionRequestIDId) !== null && _b !== void 0 ? _b : 0,
                                id: index + 1,
                                title: (_d = (_c = item === null || item === void 0 ? void 0 : item.JobTitleEnglish) === null || _c === void 0 ? void 0 : _c.JobTitleInEnglish) !== null && _d !== void 0 ? _d : "",
                                jobCode: (_f = (_e = item === null || item === void 0 ? void 0 : item.JobTitleEnglish) === null || _e === void 0 ? void 0 : _e.JobCode) !== null && _f !== void 0 ? _f : "",
                                DRCGrade: (_h = (_g = item === null || item === void 0 ? void 0 : item.DRCGrade) === null || _g === void 0 ? void 0 : _g.DRCGrade) !== null && _h !== void 0 ? _h : "",
                                PatersonGrade: (_k = (_j = item === null || item === void 0 ? void 0 : item.PatersonGrade) === null || _j === void 0 ? void 0 : _j.PatersonGrade) !== null && _k !== void 0 ? _k : "",
                                JobTitleFrench: (_m = (_l = item === null || item === void 0 ? void 0 : item.JobTitleFrench) === null || _l === void 0 ? void 0 : _l.JobTitleInFrench) !== null && _m !== void 0 ? _m : "",
                            });
                        });
                        return [2 /*return*/, { data: result, status: 200, message: "GetPositionDetails fetched successfully" }];
                    case 2:
                        error_7 = _a.sent();
                        console.error("GetPositionDetails error:", error_7);
                        return [2 /*return*/, { data: [], status: 500, message: "Error fetching position details" }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return DashboardService;
}());
exports.default = DashboardService;
//# sourceMappingURL=DashboardService.js.map