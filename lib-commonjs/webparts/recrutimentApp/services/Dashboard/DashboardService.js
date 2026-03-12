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
    DashboardService.prototype.GetRecruitmentDetails = function (filterParam, filterConditions) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res, GridResult, ids, idChunks, _loop_1, _i, idChunks_1, chunk, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSRecruitmentDptDetails,
                                Select: "*,Department/DepartmentName,SubDepartment/SubDepTitle,Section/SectionName,DepartmentCode/DptCode,Status/StatusDescription,Action/Action,JobCode/JobCode,JobCode/ID,BusinessUnitCode/BusineesUnitCode,AssignedHR/Title",
                                Filter: filterParam,
                                FilterCondition: filterConditions,
                                Expand: "Department,SubDepartment,Section,DepartmentCode,Status,Action,JobCode,BusinessUnitCode",
                                Topcount: ApiConfig_1.count.Topcount,
                                Orderby: "ID",
                                Orderbydecorasc: true
                            })];
                    case 1:
                        res = _a.sent();
                        if (!res.length) {
                            return [2 /*return*/, {
                                    data: [],
                                    status: 200,
                                    message: "No records found"
                                }];
                        }
                        GridResult = res.map(function (item, index) {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7;
                            return ({
                                ID: item.ID,
                                RecordID: index + 1,
                                BusinessUnitCode: (_b = (_a = item === null || item === void 0 ? void 0 : item.BusinessUnitCode) === null || _a === void 0 ? void 0 : _a.BusineesUnitCode) !== null && _b !== void 0 ? _b : "",
                                BusinessUnitCodeId: (_c = item === null || item === void 0 ? void 0 : item.BusinessUnitCodeId) !== null && _c !== void 0 ? _c : "",
                                BusinessUnitName: "",
                                BusinessUnitDescription: "",
                                Nationality: item === null || item === void 0 ? void 0 : item.Nationality,
                                Department: (_e = (_d = item === null || item === void 0 ? void 0 : item.Department) === null || _d === void 0 ? void 0 : _d.DepartmentName) !== null && _e !== void 0 ? _e : "",
                                DepartmentId: item === null || item === void 0 ? void 0 : item.DepartmentId,
                                SubDepartment: (_g = (_f = item === null || item === void 0 ? void 0 : item.SubDepartment) === null || _f === void 0 ? void 0 : _f.SubDepTitle) !== null && _g !== void 0 ? _g : "",
                                SubDepartmentId: item === null || item === void 0 ? void 0 : item.SubDepartmentId,
                                Section: (_j = (_h = item === null || item === void 0 ? void 0 : item.Section) === null || _h === void 0 ? void 0 : _h.SectionName) !== null && _j !== void 0 ? _j : "",
                                SectionId: item === null || item === void 0 ? void 0 : item.SectionId,
                                DepartmentCodeId: item === null || item === void 0 ? void 0 : item.DepartmentCodeId,
                                DepartmentCode: (_l = (_k = item === null || item === void 0 ? void 0 : item.DepartmentCode) === null || _k === void 0 ? void 0 : _k.DptCode) !== null && _l !== void 0 ? _l : "",
                                EmploymentCategory: item === null || item === void 0 ? void 0 : item.EmploymentCategory,
                                TypeOfContract: item === null || item === void 0 ? void 0 : item.TypeOfContract,
                                NumberOfPersonNeeded: item === null || item === void 0 ? void 0 : item.NumberOfPersonNeeded,
                                EnterNumberOfMonths: item === null || item === void 0 ? void 0 : item.EnterNumberOfMonths,
                                AreaofWork: item === null || item === void 0 ? void 0 : item.AreaofWork,
                                DateRequried: (_m = item === null || item === void 0 ? void 0 : item.DateRequried) !== null && _m !== void 0 ? _m : "",
                                Type: (_o = item === null || item === void 0 ? void 0 : item.DataFrom) !== null && _o !== void 0 ? _o : "",
                                Status: (_q = (_p = item === null || item === void 0 ? void 0 : item.Status) === null || _p === void 0 ? void 0 : _p.StatusDescription) !== null && _q !== void 0 ? _q : "",
                                StatusId: item === null || item === void 0 ? void 0 : item.StatusId,
                                Action: (_s = (_r = item === null || item === void 0 ? void 0 : item.Action) === null || _r === void 0 ? void 0 : _r.Action) !== null && _s !== void 0 ? _s : "",
                                ActionTypeId: (_t = item === null || item === void 0 ? void 0 : item.ActionId) !== null && _t !== void 0 ? _t : "",
                                Location: (_u = item === null || item === void 0 ? void 0 : item.Location) !== null && _u !== void 0 ? _u : "",
                                JobCodeId: (_w = (_v = item === null || item === void 0 ? void 0 : item.JobCode) === null || _v === void 0 ? void 0 : _v.ID) !== null && _w !== void 0 ? _w : 0,
                                JobCode: (_y = (_x = item === null || item === void 0 ? void 0 : item.JobCode) === null || _x === void 0 ? void 0 : _x.JobCode) !== null && _y !== void 0 ? _y : "",
                                JobTitleEnglish: "",
                                JobTitleFrench: "",
                                PatersonGrade: "",
                                DRCGrade: "",
                                JobTitleEnglishId: 0,
                                JobTitleFrenchId: 0,
                                PatersonGradeId: 0,
                                DRCGradeId: 0,
                                Checked: false,
                                VacancyConfirmed: (_z = item === null || item === void 0 ? void 0 : item.VacancyConfirmed) !== null && _z !== void 0 ? _z : "",
                                RecruitmentAuthorised: (_0 = item === null || item === void 0 ? void 0 : item.RecruitmentAuthorised) !== null && _0 !== void 0 ? _0 : "",
                                IsPayrollEmailed: (_1 = item === null || item === void 0 ? void 0 : item.IsPayrollEmailed) !== null && _1 !== void 0 ? _1 : "",
                                AssignedHR: "",
                                AssignedHRId: 0,
                                AssignLineManager: (_2 = item === null || item === void 0 ? void 0 : item.LineManager) !== null && _2 !== void 0 ? _2 : "",
                                AssignLineManagerId: (_3 = item === null || item === void 0 ? void 0 : item.AssignLineManagerId) !== null && _3 !== void 0 ? _3 : 0,
                                ReasonForVacancy: (_4 = item === null || item === void 0 ? void 0 : item.ReasonForVacancy) !== null && _4 !== void 0 ? _4 : "",
                                JobPostingStartDate: (item === null || item === void 0 ? void 0 : item.JobPostingStartDate) ? (0, moment_1.default)(item.JobPostingStartDate).format("YYYY-MM-DD") : undefined,
                                JobPostingEndDate: (item === null || item === void 0 ? void 0 : item.JobPostingEndDate) ? (0, moment_1.default)(item.JobPostingEndDate).format("YYYY-MM-DD") : undefined,
                                JobPostingFirstExtensionEndDate: (item === null || item === void 0 ? void 0 : item.JobPostingFirstExtensionEndDate) ? (0, moment_1.default)(item.JobPostingFirstExtensionEndDate).format("YYYY-MM-DD") : undefined,
                                JobPostingSecondExtensionEndDate: (item === null || item === void 0 ? void 0 : item.JobPostingSecondExtensionEndDate) ? (0, moment_1.default)(item.JobPostingSecondExtensionEndDate).format("YYYY-MM-DD") : undefined,
                                AssignEMail: item === null || item === void 0 ? void 0 : item.AssignedHR,
                                AssignHOD: item === null || item === void 0 ? void 0 : item.HOD,
                                AssignHRLead: (_5 = item === null || item === void 0 ? void 0 : item.RecruitmentHRLead) !== null && _5 !== void 0 ? _5 : "",
                                QuestionByHR: (_6 = item === null || item === void 0 ? void 0 : item.QuestionByHR) !== null && _6 !== void 0 ? _6 : "",
                                QuestionByLM: (_7 = item === null || item === void 0 ? void 0 : item.QuestionByLM) !== null && _7 !== void 0 ? _7 : "",
                                JobAppliedCount: "0",
                                ReviewScoreCount: "0",
                                ModifiedDate: (item === null || item === void 0 ? void 0 : item.Modified) ? (0, moment_1.default)(item.Modified).format("YYYY-MM-DD") : undefined,
                                CreatedDate: (item === null || item === void 0 ? void 0 : item.Created) ? (0, moment_1.default)(item.Created).format("YYYY-MM-DD") : undefined
                            });
                        });
                        ids = GridResult.map(function (x) { return x.ID; });
                        idChunks = spservice_1.default.ArraySpiltInOperator(ids, ApiConfig_1.InOperator.arraysize);
                        _loop_1 = function (chunk) {
                            var resdata, positionMap;
                            return tslib_1.__generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, spservice_1.default.SPReadItems({
                                            Listname: Config_1.ListNames.HRMSRecruitmentPositionDetails,
                                            Select: "*,JobTitleEnglish/JobTitleInEnglish,DRCGrade/DRCGrade,PatersonGrade/PatersonGrade,JobTitleFrench/JobTitleInFrench",
                                            Expand: "JobTitleEnglish,DRCGrade,PatersonGrade,JobTitleFrench",
                                            Filter: [{ FilterKey: "RecruitmentID", Operator: "in", FilterValue: chunk }],
                                            Topcount: ApiConfig_1.count.Topcount
                                        })];
                                    case 1:
                                        resdata = _b.sent();
                                        positionMap = new Map();
                                        resdata.forEach(function (r) {
                                            positionMap.set(r.RecruitmentIDId, r);
                                        });
                                        /* -------------------------
                                           STEP 4 : Merge data
                                        --------------------------*/
                                        GridResult.forEach(function (item) {
                                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                                            var pos = positionMap.get(item.ID);
                                            if (!pos)
                                                return;
                                            item.JobTitleEnglish = (_b = (_a = pos === null || pos === void 0 ? void 0 : pos.JobTitleEnglish) === null || _a === void 0 ? void 0 : _a.JobTitleInEnglish) !== null && _b !== void 0 ? _b : "";
                                            item.JobTitleEnglishId = (_c = pos === null || pos === void 0 ? void 0 : pos.JobTitleEnglishId) !== null && _c !== void 0 ? _c : 0;
                                            item.JobTitleFrench = (_e = (_d = pos === null || pos === void 0 ? void 0 : pos.JobTitleFrench) === null || _d === void 0 ? void 0 : _d.JobTitleInFrench) !== null && _e !== void 0 ? _e : "";
                                            item.JobTitleFrenchId = (_f = pos === null || pos === void 0 ? void 0 : pos.JobTitleFrenchId) !== null && _f !== void 0 ? _f : 0;
                                            item.PatersonGrade = (_h = (_g = pos === null || pos === void 0 ? void 0 : pos.PatersonGrade) === null || _g === void 0 ? void 0 : _g.PatersonGrade) !== null && _h !== void 0 ? _h : "";
                                            item.PatersonGradeId = (_j = pos === null || pos === void 0 ? void 0 : pos.PatersonGradeId) !== null && _j !== void 0 ? _j : 0;
                                            item.DRCGrade = (_l = (_k = pos === null || pos === void 0 ? void 0 : pos.DRCGrade) === null || _k === void 0 ? void 0 : _k.DRCGrade) !== null && _l !== void 0 ? _l : "";
                                            item.DRCGradeId = (_m = pos === null || pos === void 0 ? void 0 : pos.DRCGradeId) !== null && _m !== void 0 ? _m : 0;
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, idChunks_1 = idChunks;
                        _a.label = 2;
                    case 2:
                        if (!(_i < idChunks_1.length)) return [3 /*break*/, 5];
                        chunk = idChunks_1[_i];
                        return [5 /*yield**/, _loop_1(chunk)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, {
                            data: GridResult,
                            status: 200,
                            message: "GetRecruitmentDetails fetched successfully"
                        }];
                    case 6:
                        error_1 = _a.sent();
                        console.error("Error fetching data:", error_1);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error fetching data"
                            }];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    DashboardService.prototype.GetDashboardCount = function (queries, currentRoleID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var metricConfigs, spCounts_1, externalMetrics, externalCountMap_1, metrics, error_2;
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
                        error_2 = _a.sent();
                        console.error("GetDashboardCount error:", error_2);
                        return [2 /*return*/, { data: [], status: 500, message: "Error fetching dashboard counts" }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DashboardService.prototype._fetchPortalJobCodeMap = function (queries) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, new Map()];
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
                                var jobCodeIds, jobUniqueKeys, params, response, total, error_3;
                                var _a, _b;
                                return tslib_1.__generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            jobCodeIds = ((_a = spCounts[metric.id]) !== null && _a !== void 0 ? _a : [])
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
                                            _c.label = 1;
                                        case 1:
                                            _c.trys.push([1, 3, , 4]);
                                            return [4 /*yield*/, CareerPortalAPI_1.getProfileData.GetJobAppliedCount(params)];
                                        case 2:
                                            response = _c.sent();
                                            total = ((_b = response === null || response === void 0 ? void 0 : response.data) !== null && _b !== void 0 ? _b : []).reduce(function (sum, item) { var _a; return sum + ((_a = item.count) !== null && _a !== void 0 ? _a : 0); }, 0);
                                            result.set(String(metric.id), total);
                                            return [3 /*break*/, 4];
                                        case 3:
                                            error_3 = _c.sent();
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
    return DashboardService;
}());
exports.default = DashboardService;
;
//# sourceMappingURL=DashboardService.js.map