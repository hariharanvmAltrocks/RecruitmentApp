"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ApiConfig_1 = require("../../utilities/ApiConfig");
var Config_1 = require("../../utilities/Config");
var spservice_1 = tslib_1.__importStar(require("../SPService/spservice"));
var mapItems_1 = require("./mapItems");
var IRecruitmentService_1 = require("./IRecruitmentService");
var CareerPortalAPI_1 = require("../AxiosService/CareerPortalAPI");
var ServiceExport_1 = require("../ServiceExport");
var ConditionConfig_1 = require("../../utilities/ConditionConfig");
var dateConfigfn_1 = require("../../components/Hooks/dateConfigfn");
var RecruitmentService = /** @class */ (function () {
    function RecruitmentService() {
    }
    RecruitmentService.prototype.GetNPAEPVRRDetails = function (filterParam, filterConditions, Type) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var queries, batchRes, additionalExistingItems, newPositionItems, vacancyItems, additionalIds, newPositionIds, _a, additionalPositionRes, newPositionRes, additionalPositionMap_1, newPositionMap_1, mapCommonFields_1, additionalExistingResult, newPositionResult, vacancyResult, GridResult, error_1;
            var _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 3, , 4]);
                        queries = [];
                        switch (Type) {
                            case Config_1.DataFrom.NewPosition:
                                queries = [
                                    {
                                        StateValue: 2,
                                        ListName: Config_1.ListNames.HRMSNewPositionRequest,
                                        Filter: filterParam,
                                        FilterCondition: filterConditions,
                                        select: ["*,Action/Action,BusinessUnitCode/BusineesUnitCode,Status/StatusDescription,Author/EMail,Department/DepartmentName,SubDepartment/SubDepTitle,Section/SectionName,DepartmentCode/DptCode,Role/RoleTitle"],
                                        expand: ["Action,BusinessUnitCode,Status,Author,Department,SubDepartment,Section,DepartmentCode,Role"],
                                    }
                                ];
                                break;
                            case Config_1.DataFrom.ExistingPosition:
                                queries = [
                                    {
                                        StateValue: 1,
                                        ListName: Config_1.ListNames.HRMSAdditionalHeadCountForExisitingPosition,
                                        Filter: filterParam,
                                        FilterCondition: filterConditions,
                                        select: ["*,Action/Action,Department/DepartmentName,SubDepartment/SubDepTitle,Section/SectionName,DepartmentCode/DptCode,BusinessUnitCode/BusineesUnitCode,Status/StatusDescription,Author/EMail"],
                                        expand: ["Action,Department,SubDepartment,Section,DepartmentCode,BusinessUnitCode,Status,Author"],
                                    }
                                ];
                                break;
                            case Config_1.DataFrom.VacancyRecruitmentProcess:
                                queries = [
                                    {
                                        StateValue: 3,
                                        ListName: Config_1.ListNames.HRMSVacancyReplacementRequest,
                                        Filter: filterParam,
                                        FilterCondition: filterConditions,
                                        select: [
                                            "*,Department/DepartmentName,BusinessUnitCode/BusineesUnitCode,SubDepartment/SubDepTitle,Section/SectionName,DepartmentCode/DptCode, Status/StatusDescription,Author/EMail,JobCode/JobCode,JobCode/JobTitleInEnglish,JobTitleFrench/JobTitleInFrench,PatersonGrade/PatersonGrade,PatersonGrade/DRCGrade"
                                        ],
                                        expand: ["Department,BusinessUnitCode,SubDepartment,Section,DepartmentCode,Status,Author,JobCode,JobTitleFrench,PatersonGrade"],
                                    },
                                ];
                                break;
                            default:
                                throw new Error("Unhandled Type: ".concat(Type));
                        }
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
                        additionalPositionMap_1 = new Map(((_b = additionalPositionRes.data) !== null && _b !== void 0 ? _b : []).map(function (d) { return [d.ID, d]; }));
                        newPositionMap_1 = new Map(((_c = newPositionRes.data) !== null && _c !== void 0 ? _c : []).map(function (d) { return [d.ID, d]; }));
                        mapCommonFields_1 = function (item, index) {
                            var _a, _b, _c, _d, _e, _f;
                            return ({
                                ID: item.ID,
                                RecordID: index + 1,
                                BusinessUnitCode: item.BusinessUnitCode ? item.BusinessUnitCode.BusineesUnitCode : "",
                                BusinessUnitCodeId: item.BusinessUnitCodeId ? item.BusinessUnitCodeId : "",
                                BusinessUnitName: "",
                                BusinessUnitDescription: "",
                                Nationality: item.Nationality,
                                Department: ((_a = item.Department) === null || _a === void 0 ? void 0 : _a.DepartmentName) || "",
                                DepartmentId: item.DepartmentId,
                                SubDepartment: ((_b = item.SubDepartment) === null || _b === void 0 ? void 0 : _b.SubDepTitle) || "",
                                SubDepartmentId: item.SubDepartmentId,
                                Section: ((_c = item.Section) === null || _c === void 0 ? void 0 : _c.SectionName) || "",
                                SectionId: item.SectionId,
                                DepartmentCodeId: item.DepartmentCodeId,
                                DepartmentCode: ((_d = item.DepartmentCode) === null || _d === void 0 ? void 0 : _d.DptCode) || "",
                                EmploymentCategory: item.EmploymentCategory,
                                TypeOfContract: item.TypeOfContract,
                                NumberOfPersonNeeded: item === null || item === void 0 ? void 0 : item.NumberOfPersonNeeded,
                                EnterNumberOfMonths: item === null || item === void 0 ? void 0 : item.EnterNumberOfMonths,
                                AreaofWork: item.AreaofWork,
                                DateRequried: item.DateRequried ? item === null || item === void 0 ? void 0 : item.DateRequried : null,
                                Type: Config_1.DataFrom.NewPosition,
                                Status: item.Status ? item.Status.StatusDescription : "",
                                StatusId: item === null || item === void 0 ? void 0 : item.StatusId,
                                Action: ((_e = item.Action) === null || _e === void 0 ? void 0 : _e.Action) ? (_f = item.Action) === null || _f === void 0 ? void 0 : _f.Action : "",
                                ActionTypeId: item.ActionId ? item.ActionId : "",
                                Location: (item === null || item === void 0 ? void 0 : item.Location) || "",
                            });
                        };
                        additionalExistingResult = additionalExistingItems.map(function (item, index) {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                            var pos = additionalPositionMap_1.get(item.ID);
                            return tslib_1.__assign(tslib_1.__assign({}, mapCommonFields_1(item, index)), { Type: Config_1.DataFrom.ExistingPosition, JobCode: (_a = pos === null || pos === void 0 ? void 0 : pos.jobCode) !== null && _a !== void 0 ? _a : "", JobCodeId: (_b = pos === null || pos === void 0 ? void 0 : pos.JobCodeId) !== null && _b !== void 0 ? _b : 0, JobTitleEnglish: (_c = pos === null || pos === void 0 ? void 0 : pos.title) !== null && _c !== void 0 ? _c : "", JobTitleEnglishId: (_d = pos === null || pos === void 0 ? void 0 : pos.titleID) !== null && _d !== void 0 ? _d : 0, JobTitleFrench: (_e = pos === null || pos === void 0 ? void 0 : pos.JobTitleFrench) !== null && _e !== void 0 ? _e : "", JobTitleFrenchId: (_f = pos === null || pos === void 0 ? void 0 : pos.JobTitleFrenchId) !== null && _f !== void 0 ? _f : 0, PatersonGrade: (_g = pos === null || pos === void 0 ? void 0 : pos.PatersonGrade) !== null && _g !== void 0 ? _g : "", PatersonGradeId: (_h = pos === null || pos === void 0 ? void 0 : pos.PatersonGradeId) !== null && _h !== void 0 ? _h : 0, DRCGrade: (_j = pos === null || pos === void 0 ? void 0 : pos.DRCGrade) !== null && _j !== void 0 ? _j : "", DRCGradeId: (_k = pos === null || pos === void 0 ? void 0 : pos.DRCGradeId) !== null && _k !== void 0 ? _k : 0 });
                        });
                        newPositionResult = newPositionItems.map(function (item, index) {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                            var pos = newPositionMap_1.get(item.ID);
                            return tslib_1.__assign(tslib_1.__assign({}, mapCommonFields_1(item, index)), { Type: Config_1.DataFrom.NewPosition, JobCode: (_a = pos === null || pos === void 0 ? void 0 : pos.jobCode) !== null && _a !== void 0 ? _a : "", JobCodeId: (_b = pos === null || pos === void 0 ? void 0 : pos.JobCodeId) !== null && _b !== void 0 ? _b : 0, JobTitleEnglish: (_c = pos === null || pos === void 0 ? void 0 : pos.title) !== null && _c !== void 0 ? _c : "", JobTitleEnglishId: (_d = pos === null || pos === void 0 ? void 0 : pos.titleID) !== null && _d !== void 0 ? _d : 0, JobTitleFrench: (_e = pos === null || pos === void 0 ? void 0 : pos.JobTitleFrench) !== null && _e !== void 0 ? _e : "", JobTitleFrenchId: (_f = pos === null || pos === void 0 ? void 0 : pos.JobTitleFrenchId) !== null && _f !== void 0 ? _f : 0, PatersonGrade: (_g = pos === null || pos === void 0 ? void 0 : pos.PatersonGrade) !== null && _g !== void 0 ? _g : "", PatersonGradeId: (_h = pos === null || pos === void 0 ? void 0 : pos.PatersonGradeId) !== null && _h !== void 0 ? _h : 0, DRCGrade: (_j = pos === null || pos === void 0 ? void 0 : pos.DRCGrade) !== null && _j !== void 0 ? _j : "", DRCGradeId: (_k = pos === null || pos === void 0 ? void 0 : pos.DRCGradeId) !== null && _k !== void 0 ? _k : 0 });
                        });
                        vacancyResult = vacancyItems.map(function (item, index) {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
                            return (tslib_1.__assign(tslib_1.__assign({}, mapCommonFields_1(item, index)), { Type: Config_1.DataFrom.VacancyRecruitmentProcess, JobCodeId: (_b = (_a = item === null || item === void 0 ? void 0 : item.JobCode) === null || _a === void 0 ? void 0 : _a.ID) !== null && _b !== void 0 ? _b : 0, JobCode: (_d = (_c = item === null || item === void 0 ? void 0 : item.JobCode) === null || _c === void 0 ? void 0 : _c.JobCode) !== null && _d !== void 0 ? _d : "", JobTitleEnglish: (_f = (_e = item === null || item === void 0 ? void 0 : item.JobCode) === null || _e === void 0 ? void 0 : _e.JobTitleInEnglish) !== null && _f !== void 0 ? _f : "", JobTitleEnglishId: (_h = (_g = item === null || item === void 0 ? void 0 : item.JobCode) === null || _g === void 0 ? void 0 : _g.ID) !== null && _h !== void 0 ? _h : 0, JobTitleFrench: (_k = (_j = item === null || item === void 0 ? void 0 : item.JobTitleFrench) === null || _j === void 0 ? void 0 : _j.JobTitleInFrench) !== null && _k !== void 0 ? _k : "", JobTitleFrenchId: (_l = item === null || item === void 0 ? void 0 : item.JobTitleFrenchId) !== null && _l !== void 0 ? _l : 0, PatersonGrade: (_o = (_m = item === null || item === void 0 ? void 0 : item.PatersonGrade) === null || _m === void 0 ? void 0 : _m.PatersonGrade) !== null && _o !== void 0 ? _o : "", PatersonGradeId: (_p = item === null || item === void 0 ? void 0 : item.PatersonGradeId) !== null && _p !== void 0 ? _p : 0, DRCGrade: (_r = (_q = item === null || item === void 0 ? void 0 : item.PatersonGrade) === null || _q === void 0 ? void 0 : _q.DRCGrade) !== null && _r !== void 0 ? _r : "", DRCGradeId: (_s = item === null || item === void 0 ? void 0 : item.PatersonGradeId) !== null && _s !== void 0 ? _s : 0 }));
                        });
                        GridResult = tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray([], additionalExistingResult, true), newPositionResult, true), vacancyResult, true).map(function (item, index) { return (tslib_1.__assign(tslib_1.__assign({}, item), { RecordID: index + 1 })); });
                        return [2 /*return*/, {
                                data: GridResult,
                                status: 200,
                                message: "GetNPAEPVRRDetails fetched successfully",
                            }];
                    case 3:
                        error_1 = _d.sent();
                        console.error("Error fetching GetNPAEPVRRDetails:", error_1);
                        return [2 /*return*/, { data: [], status: 500, message: "Error fetching data" }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    RecruitmentService.prototype.GetRecruitmentDetails = function (filterParam, filterConditions) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res, itemIds, positionFilter, _a, GridResult, positionRes, positionMap, _i, GridResult_1, item, pos, error_2;
            var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            return tslib_1.__generator(this, function (_o) {
                switch (_o.label) {
                    case 0:
                        _o.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSRecruitmentDptDetails,
                                Select: "*,Department/DepartmentName,Department/Code,SubDepartment/SubDepTitle,Section/SectionName,DepartmentCode/DptCode,Status/StatusDescription,Action/Action,JobCode/JobCode,JobCode/ID,BusinessUnitCode/BusineesUnitCode",
                                Filter: filterParam,
                                FilterCondition: filterConditions,
                                Expand: "Department,SubDepartment,Section,DepartmentCode,Status,Action,JobCode,BusinessUnitCode",
                                Topcount: ApiConfig_1.count.Topcount,
                                Orderby: "ID",
                                Orderbydecorasc: true,
                            })];
                    case 1:
                        res = _o.sent();
                        if (!res.length) {
                            return [2 /*return*/, { data: [], status: 200, message: "No records found" }];
                        }
                        itemIds = res.map(function (item) { return item.ID; });
                        positionFilter = [
                            { FilterKey: "RecruitmentID", Operator: "in", FilterValue: itemIds },
                        ];
                        return [4 /*yield*/, Promise.all([
                                Promise.resolve((0, mapItems_1._mapRecruitmentItems)(res)),
                                this.GetPositionDetails(positionFilter, "and", Config_1.ListNames.HRMSRecruitmentPositionDetails),
                            ])];
                    case 2:
                        _a = _o.sent(), GridResult = _a[0], positionRes = _a[1];
                        positionMap = new Map(((_b = positionRes.data) !== null && _b !== void 0 ? _b : []).map(function (pos) { return [pos.ID, pos]; }));
                        for (_i = 0, GridResult_1 = GridResult; _i < GridResult_1.length; _i++) {
                            item = GridResult_1[_i];
                            pos = positionMap.get(item.ID);
                            if (pos) {
                                item.JobTitleEnglish = (_c = pos.title) !== null && _c !== void 0 ? _c : "";
                                item.JobTitleEnglishId = (_d = pos.titleID) !== null && _d !== void 0 ? _d : 0;
                                item.JobCode = (_e = pos.jobCode) !== null && _e !== void 0 ? _e : "";
                                item.JobCodeId = (_f = pos.JobCodeId) !== null && _f !== void 0 ? _f : 0;
                                item.JobTitleFrench = (_g = pos.JobTitleFrench) !== null && _g !== void 0 ? _g : "";
                                item.JobTitleFrenchId = (_h = pos.JobTitleFrenchId) !== null && _h !== void 0 ? _h : 0;
                                item.PatersonGrade = (_j = pos.PatersonGrade) !== null && _j !== void 0 ? _j : "";
                                item.PatersonGradeId = (_k = pos.PatersonGradeId) !== null && _k !== void 0 ? _k : 0;
                                item.DRCGrade = (_l = pos.DRCGrade) !== null && _l !== void 0 ? _l : "";
                                item.DRCGradeId = (_m = pos.DRCGradeId) !== null && _m !== void 0 ? _m : 0;
                            }
                        }
                        return [2 /*return*/, {
                                data: GridResult,
                                status: 200,
                                message: "GetRecruitmentDetails fetched successfully",
                            }];
                    case 3:
                        error_2 = _o.sent();
                        console.error("Error fetching GetRecruitmentDetails:", error_2);
                        return [2 /*return*/, { data: [], status: 500, message: "Error fetching data" }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    RecruitmentService.prototype.GetCandidateDetails = function (filterParam, filterConditions) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.fetchRecruitmentByLookup(Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails, filterParam, filterConditions)];
            });
        });
    };
    RecruitmentService.prototype.GetSelectedCandidate = function (filterParam, filterConditions) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.fetchRecruitmentByLookup(Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD, filterParam, filterConditions)];
            });
        });
    };
    RecruitmentService.prototype.fetchRecruitmentByLookup = function (listName, filterParam, filterConditions) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res, ids, recruitmentFilter, error_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: listName,
                                Select: "*,RecruitmentID/Id",
                                Filter: filterParam,
                                FilterCondition: filterConditions,
                                Expand: "RecruitmentID",
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
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_3 = _a.sent();
                        console.error("Error fetching from ".concat(listName, ":"), error_3);
                        return [2 /*return*/, { data: [], status: 500, message: "Error fetching data" }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    RecruitmentService.prototype.GetPositionDetails = function (Filter, filterConditions, ListName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var resdata, result, error_4;
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
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
                            return ({
                                ID: (_c = (_b = (_a = item === null || item === void 0 ? void 0 : item.LookupIDId) !== null && _a !== void 0 ? _a : item === null || item === void 0 ? void 0 : item.PositionRequestIDId) !== null && _b !== void 0 ? _b : item === null || item === void 0 ? void 0 : item.RecruitmentIDId) !== null && _c !== void 0 ? _c : 0,
                                id: index + 1,
                                title: (_e = (_d = item === null || item === void 0 ? void 0 : item.JobTitleEnglish) === null || _d === void 0 ? void 0 : _d.JobTitleInEnglish) !== null && _e !== void 0 ? _e : "",
                                titleID: (_f = item === null || item === void 0 ? void 0 : item.JobTitleEnglishId) !== null && _f !== void 0 ? _f : 0,
                                jobCode: (_h = (_g = item === null || item === void 0 ? void 0 : item.JobTitleEnglish) === null || _g === void 0 ? void 0 : _g.JobCode) !== null && _h !== void 0 ? _h : "",
                                JobCodeId: (_j = item === null || item === void 0 ? void 0 : item.JobTitleEnglishId) !== null && _j !== void 0 ? _j : 0,
                                DRCGrade: (_l = (_k = item === null || item === void 0 ? void 0 : item.DRCGrade) === null || _k === void 0 ? void 0 : _k.DRCGrade) !== null && _l !== void 0 ? _l : "",
                                DRCGradeId: (_m = item === null || item === void 0 ? void 0 : item.DRCGradeId) !== null && _m !== void 0 ? _m : 0,
                                PatersonGrade: (_p = (_o = item === null || item === void 0 ? void 0 : item.PatersonGrade) === null || _o === void 0 ? void 0 : _o.PatersonGrade) !== null && _p !== void 0 ? _p : "",
                                PatersonGradeId: (_q = item === null || item === void 0 ? void 0 : item.PatersonGradeId) !== null && _q !== void 0 ? _q : 0,
                                JobTitleFrench: (_s = (_r = item === null || item === void 0 ? void 0 : item.JobTitleFrench) === null || _r === void 0 ? void 0 : _r.JobTitleInFrench) !== null && _s !== void 0 ? _s : "",
                                JobTitleFrenchId: (_t = item === null || item === void 0 ? void 0 : item.JobTitleFrenchId) !== null && _t !== void 0 ? _t : 0,
                                ActualVacantPosition: ListName === Config_1.ListNames.HRMSAdditionalHCForExisitingPositionWithHeadCountDetails
                                    ? (_u = item === null || item === void 0 ? void 0 : item.ActualVacantPosition) !== null && _u !== void 0 ? _u : 0
                                    : "",
                            });
                        });
                        return [2 /*return*/, { data: result, status: 200, message: "GetPositionDetails fetched successfully" }];
                    case 2:
                        error_4 = _a.sent();
                        console.error("GetPositionDetails error:", error_4);
                        return [2 /*return*/, { data: [], status: 500, message: "Error fetching position details" }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RecruitmentService.prototype.InsertRecruitmentDptBatch = function (payloads) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, batchedSP1_1, execute1, mainPromises, updatePromises, mainResults, failedIndex, enriched, _b, batchedSP2_1, execute2, positionPromises, commentPromises, error_5;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        if (!payloads.length) {
                            return [2 /*return*/, { data: [], status: 200, message: "No payloads to insert" }];
                        }
                        _a = (0, spservice_1.getSP)().batched(), batchedSP1_1 = _a[0], execute1 = _a[1];
                        mainPromises = payloads.map(function (payload) {
                            return batchedSP1_1.web.lists
                                .getByTitle(Config_1.ListNames.HRMSRecruitmentDptDetails)
                                .items.add(payload.Data);
                        });
                        updatePromises = payloads
                            .filter(function (payload) { var _a; return (_a = payload.updatePreList) === null || _a === void 0 ? void 0 : _a.ID; })
                            .map(function (payload) {
                            var listName = payload.Data.DataFrom === Config_1.DataFrom.NewPosition
                                ? Config_1.ListNames.HRMSNewPositionRequest
                                : payload.Data.DataFrom === Config_1.DataFrom.ExistingPosition
                                    ? Config_1.ListNames.HRMSAdditionalHeadCountForExisitingPosition
                                    : Config_1.ListNames.HRMSVacancyReplacementRequest;
                            return batchedSP1_1.web.lists
                                .getByTitle(listName)
                                .items.getById(payload.updatePreList.ID)
                                .update({
                                ActionId: payload.updatePreList.ActionId,
                                ItemCreated: payload.updatePreList.ItemCreated,
                                IsDataSyncToRecruitment: payload.updatePreList.IsDataSyncToRecruitment,
                            });
                        });
                        return [4 /*yield*/, execute1()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, Promise.all([
                                Promise.all(mainPromises),
                                Promise.all(updatePromises),
                            ])];
                    case 2:
                        mainResults = (_c.sent())[0];
                        failedIndex = mainResults.findIndex(function (res) { return !(res === null || res === void 0 ? void 0 : res.ID); });
                        if (failedIndex !== -1) {
                            return [2 /*return*/, {
                                    data: [],
                                    status: 500,
                                    message: "Main insert failed at payload index ".concat(failedIndex),
                                }];
                        }
                        enriched = mainResults.map(function (res, index) { return ({
                            insertedID: res.ID,
                            payload: payloads[index],
                        }); });
                        _b = (0, spservice_1.getSP)().batched(), batchedSP2_1 = _b[0], execute2 = _b[1];
                        positionPromises = enriched
                            .filter(function (_a) {
                            var payload = _a.payload;
                            return payload.PositionData;
                        })
                            .map(function (_a) {
                            var insertedID = _a.insertedID, payload = _a.payload;
                            return batchedSP2_1.web.lists
                                .getByTitle(Config_1.ListNames.HRMSRecruitmentPositionDetails)
                                .items.add(tslib_1.__assign(tslib_1.__assign({}, payload.PositionData), { RecruitmentIDId: insertedID }));
                        });
                        commentPromises = enriched
                            .filter(function (_a) {
                            var payload = _a.payload;
                            return payload.CommentsList;
                        })
                            .map(function (_a) {
                            var insertedID = _a.insertedID, payload = _a.payload;
                            return batchedSP2_1.web.lists
                                .getByTitle(Config_1.ListNames.HRMSRecruitmentComments)
                                .items.add(tslib_1.__assign(tslib_1.__assign({}, payload.CommentsList), { RecruitmentIDId: insertedID }));
                        });
                        return [4 /*yield*/, execute2()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, Promise.all([
                                Promise.all(positionPromises),
                                Promise.all(commentPromises),
                            ])];
                    case 4:
                        _c.sent();
                        return [2 /*return*/, {
                                data: mainResults,
                                status: 200,
                                message: "Batch insert successful for ".concat(payloads.length, " record(s)"),
                            }];
                    case 5:
                        error_5 = _c.sent();
                        console.error("InsertRecruitmentDptBatch error:", error_5);
                        return [2 /*return*/, { data: [], status: 500, message: "Batch insert failed" }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    RecruitmentService.prototype.InsertExternalAgencyDetails = function (payloads) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var uniqueJobCodeIds, _a, agentMasterRes, jobCodeResults_1, agentMasterMap_1, jobCodeMap_1, postResults, succeeded, withComments, _b, batchedSP, execute, commentList, _i, withComments_1, item, error_6;
            var _this = this;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!payloads.length) {
                            return [2 /*return*/, { data: [], status: 200, message: "No records to process" }];
                        }
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 6, , 7]);
                        uniqueJobCodeIds = Array.from(new Set(payloads.map(function (p) { return p.Data.JobCodeId; })));
                        return [4 /*yield*/, Promise.all(tslib_1.__spreadArray([
                                ServiceExport_1.CommonServices.GetMasterData(Config_1.ListNames.HRMSExternalAgents)
                            ], uniqueJobCodeIds.map(function (id) { return ServiceExport_1.masterService.GetJobUniqueDataValue(id !== null && id !== void 0 ? id : 0); }), true))];
                    case 2:
                        _a = _c.sent(), agentMasterRes = _a[0], jobCodeResults_1 = _a.slice(1);
                        agentMasterMap_1 = new Map(agentMasterRes.data.map(function (agent) { return [agent.ID, agent.AgentCode]; }));
                        jobCodeMap_1 = new Map(uniqueJobCodeIds.map(function (id, i) { var _a, _b, _c; return [id, (_c = (_b = (_a = jobCodeResults_1[i]) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.JobCode) !== null && _c !== void 0 ? _c : ""]; }));
                        return [4 /*yield*/, Promise.all(payloads.map(function (item) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var agentCode, jobCode, AgentDetails, error_7;
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            agentCode = agentMasterMap_1.get(item.Data.AgentId);
                                            jobCode = jobCodeMap_1.get(item.Data.JobCodeId);
                                            if (!agentCode || !jobCode) {
                                                console.warn("Missing master data \u2014 AgentId: ".concat(item.Data.AgentId, ", JobCodeId: ").concat(item.Data.JobCodeId));
                                                return [2 /*return*/, { item: item, success: false }];
                                            }
                                            AgentDetails = {
                                                jobCode: jobCode,
                                                jobsXAgents: [{ agentId: agentCode }],
                                            };
                                            _a.label = 1;
                                        case 1:
                                            _a.trys.push([1, 3, , 4]);
                                            return [4 /*yield*/, CareerPortalAPI_1.postAdveDetails.postAgenciesJobs(AgentDetails)];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/, { item: item, success: true }];
                                        case 3:
                                            error_7 = _a.sent();
                                            console.error("Failed for AgentId ".concat(item.Data.AgentId, ":"), error_7);
                                            return [2 /*return*/, { item: item, success: false, error: error_7 }];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 3:
                        postResults = _c.sent();
                        succeeded = postResults.filter(function (r) { return r.success; });
                        withComments = succeeded.filter(function (_a) {
                            var item = _a.item;
                            return item.CommentsList && item.Data.RecrutimentId;
                        });
                        if (!withComments.length) return [3 /*break*/, 5];
                        _b = (0, spservice_1.getSP)().batched(), batchedSP = _b[0], execute = _b[1];
                        commentList = batchedSP.web.lists.getByTitle(Config_1.ListNames.HRMSRecruitmentComments);
                        for (_i = 0, withComments_1 = withComments; _i < withComments_1.length; _i++) {
                            item = withComments_1[_i].item;
                            void commentList.items.add(tslib_1.__assign(tslib_1.__assign({}, item.CommentsList), { RecruitmentIDId: item.Data.RecrutimentId }));
                        }
                        return [4 /*yield*/, execute()];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5: return [2 /*return*/, {
                            data: succeeded.map(function (r) { return r.item; }),
                            status: succeeded.length > 0 ? 200 : 500,
                            message: "Processed ".concat(succeeded.length, "/").concat(payloads.length, " record(s) successfully"),
                        }];
                    case 6:
                        error_6 = _c.sent();
                        console.error("InsertExternalAgencyDetails error:", error_6);
                        return [2 /*return*/, { data: [], status: 500, message: "Batch insert failed" }];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    RecruitmentService.prototype.GetHRMSRecruitmentRoleProfileDetails = function (filterParam, filterConditions) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var BATCH_IDX, masterQueries, _a, batchRes, listItems, roleKnowledgeMaster, levelProficiencyMaster, technicalSkillsMaster, experienceMaster, qualificationMaster, functionTypeMaster, roleKnowledgeMap_1, levelProficiencyMap_1, technicalSkillsMap_1, qualificationMap_1, experienceMap, functionTypeMap_1, formattedItems, error_8;
            var _b, _c, _d, _e, _f, _g;
            return tslib_1.__generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        _h.trys.push([0, 2, , 3]);
                        BATCH_IDX = {
                            ROLE_KNOWLEDGE: 0,
                            LEVEL_PROFICIENCY: 1,
                            TECHNICAL_SKILLS: 2,
                            EXPERIENCE: 3,
                            QUALIFICATION: 4,
                            FUNCTION_TYPE: 5,
                        };
                        masterQueries = [
                            {
                                ListName: Config_1.ListNames.HRMSRoleSpecificKnowlegeMaster,
                                select: ["*"],
                                StateValue: BATCH_IDX.ROLE_KNOWLEDGE
                            },
                            {
                                ListName: Config_1.ListNames.HRMSLevelOfProficiency,
                                select: ["*"],
                                StateValue: BATCH_IDX.LEVEL_PROFICIENCY
                            },
                            {
                                ListName: Config_1.ListNames.HRMSTechnicalSkills,
                                select: ["*"],
                                StateValue: BATCH_IDX.TECHNICAL_SKILLS
                            },
                            {
                                ListName: Config_1.ListNames.HRMSExperienceMaster,
                                select: ["*"],
                                StateValue: BATCH_IDX.EXPERIENCE
                            },
                            {
                                ListName: Config_1.ListNames.HRMSQualification,
                                select: ["*"],
                                StateValue: BATCH_IDX.QUALIFICATION
                            },
                            {
                                ListName: Config_1.ListNames.HRMSJobTitleFunctionType,
                                select: ["*"],
                                StateValue: BATCH_IDX.FUNCTION_TYPE
                            },
                        ];
                        return [4 /*yield*/, Promise.all([
                                spservice_1.default.batchGet(masterQueries),
                                spservice_1.default.SPReadItems({
                                    Listname: Config_1.ListNames.HRMSRecruitmentRoleProfileDetails,
                                    Select: "*,JobDescription,RoleProfile,RoleSpecificKnowledgeJson,TechnicalSkillsKnowledgeJson,YearofExperience,PreferredExperience/ID,PreferredExperience/ExperienceInYearRange,Qualification,PreferredQualification,TotalPreferredExperience/ID,TotalPreferredExperience/ExperienceInYearRange,FunctionType/FunctionType,FunctionType/ID,FunctionType/FunctionTypeFrench,JobCode/JobCode,JobCode/ID",
                                    Filter: filterParam,
                                    FilterCondition: filterConditions,
                                    Expand: "PreferredExperience,TotalPreferredExperience,FunctionType,JobCode",
                                    Orderby: "ID",
                                    Orderbydecorasc: false,
                                }),
                            ])];
                    case 1:
                        _a = _h.sent(), batchRes = _a[0], listItems = _a[1];
                        roleKnowledgeMaster = (_b = batchRes[BATCH_IDX.ROLE_KNOWLEDGE]) !== null && _b !== void 0 ? _b : [];
                        levelProficiencyMaster = (_c = batchRes[BATCH_IDX.LEVEL_PROFICIENCY]) !== null && _c !== void 0 ? _c : [];
                        technicalSkillsMaster = (_d = batchRes[BATCH_IDX.TECHNICAL_SKILLS]) !== null && _d !== void 0 ? _d : [];
                        experienceMaster = (_e = batchRes[BATCH_IDX.EXPERIENCE]) !== null && _e !== void 0 ? _e : [];
                        qualificationMaster = (_f = batchRes[BATCH_IDX.QUALIFICATION]) !== null && _f !== void 0 ? _f : [];
                        functionTypeMaster = (_g = batchRes[BATCH_IDX.FUNCTION_TYPE]) !== null && _g !== void 0 ? _g : [];
                        roleKnowledgeMap_1 = roleKnowledgeMaster.reduce(function (acc, item) {
                            acc[item.Code] = {
                                en: item.RoleSpecificKnowledge,
                                fr: item.RoleSpecificKnowledgeFrench,
                            };
                            return acc;
                        }, {});
                        levelProficiencyMap_1 = levelProficiencyMaster.reduce(function (acc, item) {
                            acc[item.Code] = {
                                en: item.Levels,
                                fr: item.LevelsFrench,
                            };
                            return acc;
                        }, {});
                        technicalSkillsMap_1 = technicalSkillsMaster.reduce(function (acc, item) {
                            acc[item.Code] = {
                                en: item.TechnicalSkills,
                                fr: item.TechnicalSkillsfrench,
                            };
                            return acc;
                        }, {});
                        qualificationMap_1 = qualificationMaster.reduce(function (acc, item) {
                            acc[item.QualificationCode] = {
                                en: item.Qualification,
                                fr: item.QualificationFrench,
                            };
                            return acc;
                        }, {});
                        experienceMap = new Map(experienceMaster.map(function (exp) { return [exp.ID, exp.ExperienceInYearRange]; }));
                        functionTypeMap_1 = functionTypeMaster.reduce(function (acc, item) {
                            acc[item.ID] = {
                                en: item.FunctionType,
                                fr: item.FunctionTypeFrench,
                            };
                            return acc;
                        }, {});
                        formattedItems = listItems.map(function (item) {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                            var roleKnowledgeArray = JSON.parse(item.RoleSpecificKnowledgeJson || "[]");
                            var techSkillsArray = JSON.parse(item.TechnicalSkillsKnowledgeJson || "[]");
                            var qualificationArray = JSON.parse(item.Qualification || "[]");
                            var PrefeQualification = JSON.parse(item.PreferredQualification || "[]");
                            var mergedQualifications = tslib_1.__spreadArray(tslib_1.__spreadArray([], qualificationArray, true), PrefeQualification, true);
                            var RoleSpeKnowledge = roleKnowledgeArray.map(function (rk) {
                                var _a, _b, _c, _d;
                                var knowledge = roleKnowledgeMap_1[rk.RoleSpeKnowledge];
                                var Level = levelProficiencyMap_1[rk.RequiredLevel];
                                return {
                                    RoleSpeKnowledge: { key: rk.RoleSpeKnowledge, text: (_a = knowledge === null || knowledge === void 0 ? void 0 : knowledge.en) !== null && _a !== void 0 ? _a : "" },
                                    RoleSpeKnowledge_fr: { key: rk.RoleSpeKnowledge, text: (_b = knowledge === null || knowledge === void 0 ? void 0 : knowledge.fr) !== null && _b !== void 0 ? _b : "" },
                                    RequiredLevel: { key: rk.RequiredLevel, text: (_c = Level === null || Level === void 0 ? void 0 : Level.en) !== null && _c !== void 0 ? _c : "" },
                                    RequiredLevel_fr: { key: rk.RequiredLevel, text: (_d = Level === null || Level === void 0 ? void 0 : Level.fr) !== null && _d !== void 0 ? _d : "" },
                                };
                            });
                            var TechnicalSkills = techSkillsArray.map(function (ts) {
                                var _a, _b, _c, _d;
                                var technical = technicalSkillsMap_1[ts.TechnicalSkills];
                                var Level = levelProficiencyMap_1[ts.LevelProficiency];
                                return {
                                    TechnicalSkills: { key: ts.TechnicalSkills, text: (_a = technical === null || technical === void 0 ? void 0 : technical.en) !== null && _a !== void 0 ? _a : "" },
                                    TechnicalSkills_fr: { key: ts.TechnicalSkills, text: (_b = technical === null || technical === void 0 ? void 0 : technical.fr) !== null && _b !== void 0 ? _b : "" },
                                    LevelProficiency: { key: ts.LevelProficiency, text: (_c = Level === null || Level === void 0 ? void 0 : Level.en) !== null && _c !== void 0 ? _c : "" },
                                    LevelProficiency_fr: { key: ts.LevelProficiency, text: (_d = Level === null || Level === void 0 ? void 0 : Level.fr) !== null && _d !== void 0 ? _d : "" },
                                };
                            });
                            var Qualification = mergedQualifications.map(function (qu) {
                                var _a, _b, _c, _d, _e;
                                var qualificationKey = (_a = qu.MinQualification) !== null && _a !== void 0 ? _a : qu.PrefeQualification;
                                var qualiValue = qualificationMap_1[qualificationKey !== null && qualificationKey !== void 0 ? qualificationKey : ""];
                                if (qu.PrefeQualification) {
                                    return {
                                        PrefeQualification: { key: qualificationKey, text: (_b = qualiValue === null || qualiValue === void 0 ? void 0 : qualiValue.en) !== null && _b !== void 0 ? _b : "" },
                                        PrefeQualification_fr: { key: qualificationKey, text: (_c = qualiValue === null || qualiValue === void 0 ? void 0 : qualiValue.fr) !== null && _c !== void 0 ? _c : "" },
                                    };
                                }
                                return {
                                    MinQualification: { key: qualificationKey, text: (_d = qualiValue === null || qualiValue === void 0 ? void 0 : qualiValue.en) !== null && _d !== void 0 ? _d : "" },
                                    MinQualification_fr: { key: qualificationKey, text: (_e = qualiValue === null || qualiValue === void 0 ? void 0 : qualiValue.fr) !== null && _e !== void 0 ? _e : "" },
                                };
                            });
                            var qualificationValue = Qualification.reduce(function (acc, item) {
                                if (item.MinQualification)
                                    acc.MinQualification.push(item.MinQualification);
                                if (item.PrefeQualification)
                                    acc.PrefeQualification.push(item.PrefeQualification);
                                if (item.MinQualification_fr)
                                    acc.MinQualification_fr.push(item.MinQualification_fr);
                                if (item.PrefeQualification_fr)
                                    acc.PrefeQualification_fr.push(item.PrefeQualification_fr);
                                return acc;
                            }, {
                                MinQualification: [],
                                PrefeQualification: [],
                                MinQualification_fr: [],
                                PrefeQualification_fr: [],
                            });
                            var functionType = functionTypeMap_1[(_b = (_a = item.FunctionType) === null || _a === void 0 ? void 0 : _a.ID) !== null && _b !== void 0 ? _b : ""];
                            return {
                                ID: item.ID,
                                RecruitmentID: ((_c = item === null || item === void 0 ? void 0 : item.RecruitmentID) === null || _c === void 0 ? void 0 : _c.ID) || "",
                                RolePurpose: (0, IRecruitmentService_1.stripHtml)(item.RoleProfile) || "",
                                JobDescription: (0, IRecruitmentService_1.stripHtml)(item.JobDescription) || "",
                                RolePurpose_fr: (0, IRecruitmentService_1.stripHtml)(item.RoleProfileFrench) || "",
                                JobDescription_fr: (0, IRecruitmentService_1.stripHtml)(item.JobDescriptionFrench) || "",
                                TotalExperience: { key: (_d = item.TotalPreferredExperience) === null || _d === void 0 ? void 0 : _d.ID, text: ((_e = item.TotalPreferredExperience) === null || _e === void 0 ? void 0 : _e.ExperienceInYearRange) || "" },
                                ExperienceinMiningIndustry: { key: (_f = item.PreferredExperience) === null || _f === void 0 ? void 0 : _f.ID, text: ((_g = item.PreferredExperience) === null || _g === void 0 ? void 0 : _g.ExperienceInYearRange) || "" },
                                RoleSpeKnowledgeValue: RoleSpeKnowledge,
                                TechnicalSkillValue: TechnicalSkills,
                                qualificationValue: qualificationValue,
                                JobFunctionalType: { key: (_h = item.FunctionType) === null || _h === void 0 ? void 0 : _h.ID, text: functionType === null || functionType === void 0 ? void 0 : functionType.en },
                                JobFunctionalType_fr: { key: (_j = item.FunctionType) === null || _j === void 0 ? void 0 : _j.ID, text: functionType === null || functionType === void 0 ? void 0 : functionType.fr },
                                JobBasedBGVVerification: JSON.parse(item.JobBasedBGVVerification),
                            };
                        });
                        return [2 /*return*/, {
                                data: formattedItems,
                                status: 200,
                                message: "GetHRMSRecruitmentRoleProfileDetails fetched successfully",
                            }];
                    case 2:
                        error_8 = _h.sent();
                        console.error("Error fetching data GetHRMSRecruitmentRoleProfileDetails:", error_8);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error fetching data from GetHRMSRecruitmentRoleProfileDetails",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RecruitmentService.prototype.GetBGVerificationType = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, error_9;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, CareerPortalAPI_1.BGverification.GetBGVerificationType()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                data: response.data,
                                status: response.status,
                                message: response.data.message,
                            }];
                    case 2:
                        error_9 = _a.sent();
                        console.error("Error inserting data into AdvertisementDetails:", error_9);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error inserting data into AdvertisementDetails",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RecruitmentService.prototype.PostCommentsData = function (obj) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_10;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, spservice_1.default.SPAddItem({
                                Listname: Config_1.ListNames.HRMSRecruitmentComments,
                                RequestJSON: obj,
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                data: null,
                                status: 200,
                                message: "Data Submitted successfully",
                            }];
                    case 2:
                        error_10 = _a.sent();
                        console.error("Error posting user data:", error_10);
                        return [2 /*return*/, {
                                data: null,
                                status: 400,
                                message: "Error On Posting Data",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RecruitmentService.prototype.UploadAdvertisementInPortal = function (Filter, Condition, RecuritmentDetails, IsActive, IsExtened, JobBasedBGVVerification, onemDocs) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var ROLE_PROFILE, JOB_PORTAL, queries, batchRes, roleProfileList, jobPortalList, data, jobUniqueKey, roleSpecificKnowledge, technicalSkill, roleSpecificSkills, technicalSkills, Roleandtechnical, minQualifications, preferredQualifications, MinAndPreferedQualification, decodeBase64, Description, DescriptionFr, onemdocPath, onamdocpathfile, FilterDept, DepartmentData, NationalityValue, todaydate, vaildFrom, VaildTo, advertisementDetails, response, error_11;
            var _a, _b, _c, _d, _e;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 8, , 9]);
                        ROLE_PROFILE = 0;
                        JOB_PORTAL = 1;
                        queries = [
                            {
                                StateValue: ROLE_PROFILE,
                                ListName: Config_1.ListNames.HRMSRecruitmentRoleProfileDetails,
                                Filter: Filter,
                                FilterCondition: Condition || "",
                                select: [
                                    "*",
                                    "JobDescription",
                                    "RoleProfile",
                                    "TotalPreferredExperience/ExperienceInYearRange",
                                    "PreferredExperience/ExperienceInYearRange",
                                    "FunctionType/Code",
                                    "JobCode/JobCode",
                                ],
                                expand: [
                                    "PreferredExperience",
                                    "TotalPreferredExperience",
                                    "FunctionType",
                                    "JobCode",
                                ],
                            },
                            {
                                StateValue: JOB_PORTAL,
                                ListName: Config_1.ListNames.RecruitAppCareerPortalIntegration,
                                Filter: [
                                    { FilterKey: "JobCodeId", Operator: "eq", FilterValue: RecuritmentDetails.JobCodeId },
                                    { FilterKey: "IsActive", Operator: "eq", FilterValue: 1 },
                                ],
                                FilterCondition: "and",
                                select: ["*"],
                                Orderby: "ID",
                                Orderbydecorasc: true,
                            },
                        ];
                        return [4 /*yield*/, spservice_1.default.batchGet(queries)];
                    case 1:
                        batchRes = _f.sent();
                        roleProfileList = (_a = batchRes[ROLE_PROFILE]) !== null && _a !== void 0 ? _a : [];
                        jobPortalList = (_b = batchRes[JOB_PORTAL]) !== null && _b !== void 0 ? _b : [];
                        if (!(JobBasedBGVVerification && roleProfileList[0].ID)) return [3 /*break*/, 3];
                        return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                                Listname: Config_1.ListNames.HRMSRecruitmentRoleProfileDetails,
                                RequestJSON: {
                                    JobBasedBGVVerification: JobBasedBGVVerification,
                                },
                                ID: roleProfileList[0].ID
                            })];
                    case 2:
                        _f.sent();
                        _f.label = 3;
                    case 3:
                        if (roleProfileList.length === 0) {
                            return [2 /*return*/, { data: null, status: 400, message: "No role profile data found" }];
                        }
                        if (jobPortalList.length === 0) {
                            return [2 /*return*/, { data: null, status: 400, message: "No portal job data found" }];
                        }
                        data = roleProfileList[0];
                        jobUniqueKey = jobPortalList[0].JobUniqueKey;
                        roleSpecificKnowledge = data.RoleSpecificKnowledgeJson
                            ? JSON.parse(data.RoleSpecificKnowledgeJson)
                            : [];
                        technicalSkill = data.TechnicalSkillsKnowledgeJson
                            ? JSON.parse(data.TechnicalSkillsKnowledgeJson)
                            : [];
                        roleSpecificSkills = roleSpecificKnowledge.map(function (item) { return ({
                            skillId: String(item.RoleSpeKnowledge || ""),
                            levelId: String(item.RequiredLevel || ""),
                        }); });
                        technicalSkills = technicalSkill.map(function (item) { return ({
                            skillId: String(item.TechnicalSkills || ""),
                            levelId: String(item.LevelProficiency || ""),
                        }); });
                        Roleandtechnical = tslib_1.__spreadArray(tslib_1.__spreadArray([], roleSpecificSkills, true), technicalSkills, true);
                        minQualifications = data.Qualification
                            ? JSON.parse(data.Qualification).map(function (item) { return ({
                                qualification: item.MinQualification,
                                type: 0,
                            }); })
                            : [];
                        preferredQualifications = data.PreferredQualification
                            ? JSON.parse(data.PreferredQualification).map(function (item) { return ({
                                qualification: item.PrefeQualification,
                                type: 1,
                            }); })
                            : [];
                        MinAndPreferedQualification = tslib_1.__spreadArray(tslib_1.__spreadArray([], minQualifications, true), preferredQualifications, true);
                        decodeBase64 = function (str) {
                            var utf8Bytes = new TextEncoder().encode(str);
                            var binary = String.fromCharCode.apply(null, Array.from(utf8Bytes));
                            return btoa(binary);
                        };
                        Description = {
                            jobTitle: RecuritmentDetails.JobTitleEnglish,
                            jobShortSummary: decodeBase64(data.RoleProfile || ""),
                            jobSummary: decodeBase64(data.JobDescription || ""),
                        };
                        DescriptionFr = {
                            jobTitle: RecuritmentDetails.JobTitleFrench,
                            jobShortSummary: decodeBase64(data.RoleProfileFrench || ""),
                            jobSummary: decodeBase64(data.JobDescriptionFrench || ""),
                        };
                        onemdocPath = "";
                        if (!(onemDocs && (onemDocs === null || onemDocs === void 0 ? void 0 : onemDocs.length) > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, ServiceExport_1.CommonServices.uploadAttachmentToLibrary(RecuritmentDetails.JobCode, onemDocs || [], "ONAMSignedStampDocuments")];
                    case 4:
                        onamdocpathfile = _f.sent();
                        onemdocPath = String(onamdocpathfile.data[0].content);
                        _f.label = 5;
                    case 5:
                        FilterDept = [{ FilterKey: "DepartmentId", Operator: "eq", FilterValue: RecuritmentDetails.DepartmentID },];
                        return [4 /*yield*/, ServiceExport_1.CommonServices.GetMasterData(Config_1.ListNames.HRMSDepartment, FilterDept)];
                    case 6:
                        DepartmentData = _f.sent();
                        console.log(DepartmentData, "DepartmentData");
                        NationalityValue = RecuritmentDetails.Nationality === ConditionConfig_1.Nationality.Nationals
                            ? "Congolese"
                            : RecuritmentDetails.Nationality;
                        todaydate = new Date();
                        vaildFrom = todaydate;
                        VaildTo = (0, dateConfigfn_1.AddCalculateDate)(todaydate, 13);
                        advertisementDetails = {
                            jobCode: jobUniqueKey,
                            isActive: IsActive,
                            noOfPositions: String(RecuritmentDetails === null || RecuritmentDetails === void 0 ? void 0 : RecuritmentDetails.NumberOfPersonNeeded),
                            validFrom: vaildFrom !== null && vaildFrom !== void 0 ? vaildFrom : null,
                            validTo: VaildTo !== null && VaildTo !== void 0 ? VaildTo : null,
                            employmentType: "Full Time",
                            departmentId: ((_c = DepartmentData.data[0]) === null || _c === void 0 ? void 0 : _c.Code) || "",
                            role: null,
                            functionId: String(((_d = data.FunctionType) === null || _d === void 0 ? void 0 : _d.Code) || ""),
                            onemdocPath: onemdocPath,
                            experience: String(((_e = data.TotalPreferredExperience) === null || _e === void 0 ? void 0 : _e.ExperienceInYearRange) || ""),
                            nationality: NationalityValue,
                            Descriptions_en: Description,
                            Descriptions_fr: DescriptionFr,
                            RoleAndTechSkills: Roleandtechnical,
                            MinAndPreferedQualifications: MinAndPreferedQualification,
                            IsExtened: IsExtened,
                        };
                        return [4 /*yield*/, ServiceExport_1.CareerPotalServices.UpsertJobs(advertisementDetails)];
                    case 7:
                        response = _f.sent();
                        if (response.status === ApiConfig_1.ResponeStatus.SUCCESS) {
                            return [2 /*return*/, { data: null, status: 200, message: "Advertisement posted successfully" }];
                        }
                        return [2 /*return*/, { data: null, status: 500, message: "Error while posting advertisement details" }];
                    case 8:
                        error_11 = _f.sent();
                        console.error("Error posting advertisement data:", error_11);
                        return [2 /*return*/, { data: null, status: 400, message: "Error On Posting Data" }];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    RecruitmentService.prototype.UpsertBGVJobMaster = function (UpsertData) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, error_12;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, CareerPortalAPI_1.BGverification.UpsertBGVJobMaster(UpsertData)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                data: response.data,
                                status: response.status,
                                message: response.data.message,
                            }];
                    case 2:
                        error_12 = _a.sent();
                        console.error("Error inserting data into AdvertisementDetails:", error_12);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error inserting data into AdvertisementDetails",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return RecruitmentService;
}());
exports.default = RecruitmentService;
//# sourceMappingURL=RecruitmentService.js.map