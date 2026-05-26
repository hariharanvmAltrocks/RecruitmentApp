"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var moment_1 = tslib_1.__importDefault(require("moment"));
var ApiConfig_1 = require("../../utilities/ApiConfig");
var Config_1 = require("../../utilities/Config");
var spservice_1 = tslib_1.__importDefault(require("../SPService/spservice"));
var CareerPortalAPI_1 = require("../AxiosService/CareerPortalAPI");
var metricColumns_config_1 = require("../../components/Screens/Dashboard/metricColumns.config");
var ConditionConfig_1 = require("../../utilities/ConditionConfig");
var ServiceExport_1 = require("../ServiceExport");
var EvaluationConfig_1 = require("../../components/Screens/SelectionProcess/config/EvaluationConfig");
var DashboardService = /** @class */ (function () {
    function DashboardService() {
    }
    DashboardService.prototype.GetDashboardCount = function (queries, currentRoleID, EmailID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var metricConfigs, EvalutionFilter, UserID, listItems, CandidateIds, filterParam_1, filterParam_2, spCounts_1, externalMetrics, externalCountMap_1, metrics, error_1;
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 6, , 7]);
                        metricConfigs = (0, metricColumns_config_1.MatricColums)(currentRoleID);
                        if (!(metricConfigs === null || metricConfigs === void 0 ? void 0 : metricConfigs.length)) {
                            return [2 /*return*/, {
                                    data: [],
                                    status: 200,
                                    message: "No metrics configured for this role",
                                }];
                        }
                        // const [spCounts, portalJobCodeMap] = await Promise.all([
                        //     SPServices.batchGet(queries),
                        //     this._fetchPortalJobCodeMap(queries),
                        // ]);
                        if (currentRoleID.includes(Config_1.RoleID.FinanceDepartment)) {
                            queries = queries.map(function (item) {
                                if (item.StateValue === ConditionConfig_1.MatricID.LabourHire) {
                                    return tslib_1.__assign(tslib_1.__assign({}, item), { Filter: item.Filter.filter(function (f) { return f.FilterKey !== "RecruitmentHR"; }).map(function (f) {
                                            if (f.FilterKey === "StatusId" &&
                                                Array.isArray(f.FilterValue)) {
                                                return tslib_1.__assign(tslib_1.__assign({}, f), { FilterValue: f.FilterValue.filter(function (status) {
                                                        return status !== Config_1.StatusId.PendingHROfferInitiate &&
                                                            status !== Config_1.StatusId.PendingHROfferReview &&
                                                            status !==
                                                                Config_1.StatusId.PendingHRReviewOfferWorkPermitInit &&
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
                                        }) });
                                }
                                return item;
                            });
                        }
                        if (currentRoleID.includes(Config_1.RoleID.RecruitmentHR)) {
                            queries = queries.map(function (item) {
                                if (item.StateValue === ConditionConfig_1.MatricID.LabourHire) {
                                    return tslib_1.__assign(tslib_1.__assign({}, item), { Filter: item.Filter.map(function (f) {
                                            if (f.FilterKey === "StatusId" &&
                                                Array.isArray(f.FilterValue)) {
                                                return tslib_1.__assign(tslib_1.__assign({}, f), { FilterValue: f.FilterValue.filter(function (status) {
                                                        return status !== Config_1.StatusId.PendingFinancePaymentReview;
                                                    }) });
                                            }
                                            return f;
                                        }) });
                                }
                                return item;
                            });
                        }
                        EvalutionFilter = queries.filter(function (item) {
                            return item.StateValue === ConditionConfig_1.MatricID.EvalutionHR ||
                                item.StateValue === ConditionConfig_1.MatricID.EvalutionHOD ||
                                item.StateValue === ConditionConfig_1.MatricID.EvalutionLM ||
                                item.StateValue === ConditionConfig_1.MatricID.EvalutionEXCO;
                        });
                        if (!(EvalutionFilter.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, ServiceExport_1.CommonServices.getUserGuidByEmail(EmailID !== null && EmailID !== void 0 ? EmailID : "")];
                    case 1:
                        UserID = _c.sent();
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                                Select: EvaluationConfig_1.EvalQueryConfig.InterviewPanel.Select,
                                Expand: EvaluationConfig_1.EvalQueryConfig.InterviewPanel.Expand,
                                Filter: [
                                    {
                                        FilterKey: "InterviewPanelId",
                                        Operator: "eq",
                                        FilterValue: (_b = (_a = UserID.data) === null || _a === void 0 ? void 0 : _a.key) !== null && _b !== void 0 ? _b : "",
                                    },
                                    {
                                        FilterKey: "IsScoreSheetUploaded",
                                        Operator: "eq",
                                        FilterValue: ApiConfig_1.Choices.No,
                                    },
                                ],
                            })];
                    case 2:
                        listItems = _c.sent();
                        CandidateIds = listItems
                            .map(function (item) { var _a; return (_a = item.CandidateID) === null || _a === void 0 ? void 0 : _a.ID; })
                            .filter(Boolean);
                        if (CandidateIds.length > 0) {
                            filterParam_1 = [
                                {
                                    FilterKey: "ID",
                                    Operator: "in",
                                    FilterValue: CandidateIds,
                                },
                            ];
                            queries = queries.map(function (item) {
                                if (item.StateValue === ConditionConfig_1.MatricID.EvalutionHR ||
                                    item.StateValue === ConditionConfig_1.MatricID.EvalutionHOD ||
                                    item.StateValue === ConditionConfig_1.MatricID.EvalutionLM ||
                                    item.StateValue === ConditionConfig_1.MatricID.EvalutionEXCO) {
                                    return tslib_1.__assign(tslib_1.__assign({}, item), { Filter: tslib_1.__spreadArray(tslib_1.__spreadArray([], item.Filter, true), filterParam_1, true) });
                                }
                                return item;
                            });
                        }
                        else {
                            filterParam_2 = [
                                {
                                    FilterKey: "ItemCreated",
                                    Operator: "eq",
                                    FilterValue: ApiConfig_1.Choices.Yes,
                                },
                            ];
                            queries = queries.map(function (item) {
                                if (item.StateValue === ConditionConfig_1.MatricID.EvalutionHR ||
                                    item.StateValue === ConditionConfig_1.MatricID.EvalutionHOD ||
                                    item.StateValue === ConditionConfig_1.MatricID.EvalutionLM ||
                                    item.StateValue === ConditionConfig_1.MatricID.EvalutionEXCO) {
                                    return tslib_1.__assign(tslib_1.__assign({}, item), { Filter: tslib_1.__spreadArray(tslib_1.__spreadArray([], item.Filter, true), filterParam_2, true) });
                                }
                                return item;
                            });
                        }
                        _c.label = 3;
                    case 3: return [4 /*yield*/, spservice_1.default.batchGet(queries)];
                    case 4:
                        spCounts_1 = _c.sent();
                        externalMetrics = metricConfigs.filter(function (m) { return m.externalApi; });
                        return [4 /*yield*/, this._fetchExternalCounts(externalMetrics, spCounts_1, new Map())];
                    case 5:
                        externalCountMap_1 = _c.sent();
                        metrics = metricConfigs
                            .map(function (config) {
                            var _a, _b, _c;
                            var hasExternalCount = externalCountMap_1.has(String(config.id));
                            var spCount = (_b = (_a = spCounts_1[config.id]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
                            var value = hasExternalCount
                                ? ((_c = externalCountMap_1.get(String(config.id))) !== null && _c !== void 0 ? _c : 0)
                                : spCount;
                            return tslib_1.__assign(tslib_1.__assign({}, config), { value: value, showArrow: config.showArrow || hasExternalCount });
                        })
                            .sort(function (a, b) { return Number(b.showArrow) - Number(a.showArrow); });
                        return [2 /*return*/, {
                                data: metrics,
                                status: 200,
                                message: "Dashboard counts fetched successfully",
                            }];
                    case 6:
                        error_1 = _c.sent();
                        console.error("GetDashboardCount error:", error_1);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error fetching dashboard counts",
                            }];
                    case 7: return [2 /*return*/];
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
                        allJobCodeIds = externalMetrics
                            .flatMap(function (m) {
                            var _a;
                            return ((_a = spCounts[m.id]) !== null && _a !== void 0 ? _a : [])
                                .map(function (item) { return item.JobCodeId; })
                                .filter(Boolean);
                        })
                            .filter(function (value, index, self) { return self.indexOf(value) === index; });
                        if (!allJobCodeIds.length)
                            return [2 /*return*/, result];
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.RecruitAppCareerPortalIntegration,
                                Select: "*,JobCode/JobCode",
                                Filter: [
                                    { FilterKey: "JobCodeId", Operator: "in", FilterValue: allJobCodeIds },
                                ],
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
                                var jobCodeIds, jobUniqueKeys, params, response, total, level2Filter, level2, _a;
                                var _b, _c, _d, _e, _f, _g, _h, _j, _k;
                                return tslib_1.__generator(this, function (_l) {
                                    switch (_l.label) {
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
                                                jobCodes: jobUniqueKeys,
                                                workflowStatus: metric.externalApi.workflowStatuses,
                                            };
                                            _l.label = 1;
                                        case 1:
                                            _l.trys.push([1, 5, , 6]);
                                            return [4 /*yield*/, CareerPortalAPI_1.getProfileData.GetJobAppliedCount(params)];
                                        case 2:
                                            response = _l.sent();
                                            total = Array.isArray((_c = response === null || response === void 0 ? void 0 : response.data) === null || _c === void 0 ? void 0 : _c.data)
                                                ? (_e = (_d = response === null || response === void 0 ? void 0 : response.data) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.reduce(function (sum, item) { var _a; return sum + ((_a = item.count) !== null && _a !== void 0 ? _a : 0); }, 0)
                                                : ((_h = (_g = (_f = response === null || response === void 0 ? void 0 : response.data) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.count) !== null && _h !== void 0 ? _h : 0);
                                            if (!(metric.id === ConditionConfig_1.MatricID.AssignInterviewPanel)) return [3 /*break*/, 4];
                                            level2Filter = [
                                                {
                                                    FilterKey: "StatusId",
                                                    Operator: "eq",
                                                    FilterValue: Config_1.StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel,
                                                },
                                                {
                                                    FilterKey: "JobCodeId",
                                                    Operator: "in",
                                                    FilterValue: jobCodeIds,
                                                },
                                            ];
                                            return [4 /*yield*/, this.GetCandidateDetails(level2Filter, "and")];
                                        case 3:
                                            level2 = _l.sent();
                                            total += (_k = (_j = level2 === null || level2 === void 0 ? void 0 : level2.data) === null || _j === void 0 ? void 0 : _j.length) !== null && _k !== void 0 ? _k : 0;
                                            _l.label = 4;
                                        case 4:
                                            result.set(String(metric.id), total);
                                            return [3 /*break*/, 6];
                                        case 5:
                                            _a = _l.sent();
                                            // eslint-disable-line
                                            result.set(String(metric.id), 0);
                                            return [3 /*break*/, 6];
                                        case 6: return [2 /*return*/];
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
    DashboardService.prototype._fetchCandidateCounts = function (jobCodeId, workflowStatusId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var portalItems, jobUniqueKey, params, response, error_2;
            var _a, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!jobCodeId)
                            return [2 /*return*/, 0];
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.RecruitAppCareerPortalIntegration,
                                Select: "*,JobCode/JobCode",
                                Filter: [
                                    { FilterKey: "JobCodeId", Operator: "in", FilterValue: jobCodeId },
                                ],
                                FilterCondition: "and",
                                Expand: "JobCode",
                                Topcount: ApiConfig_1.count.Topcount,
                                Orderby: "ID",
                                Orderbydecorasc: false,
                            })];
                    case 2:
                        portalItems = (_e.sent());
                        jobUniqueKey = (_a = portalItems === null || portalItems === void 0 ? void 0 : portalItems[0]) === null || _a === void 0 ? void 0 : _a.JobUniqueKey;
                        if (!jobUniqueKey)
                            return [2 /*return*/, 0];
                        params = {
                            jobCodes: [jobUniqueKey],
                            workflowStatus: workflowStatusId,
                        };
                        return [4 /*yield*/, CareerPortalAPI_1.getProfileData.GetJobAppliedCount(params)];
                    case 3:
                        response = _e.sent();
                        // Safe access with fallback to 0
                        return [2 /*return*/, (_d = (_c = (_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.data[0]) === null || _c === void 0 ? void 0 : _c.count) !== null && _d !== void 0 ? _d : 0];
                    case 4:
                        error_2 = _e.sent();
                        console.error("[_fetchCandidateCounts] Failed for JobCodeId ".concat(jobCodeId, ":"), error_2);
                        return [2 /*return*/, 0];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DashboardService.prototype._getCandidateCountByMatric = function (jobCodeId, MatricId, RecID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var level1Promise, level2Promise, _a, level1, level2, error_3;
            var _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 3, , 4]);
                        if (MatricId === ConditionConfig_1.MatricID.ReviewProfileHR) {
                            return [2 /*return*/, this._fetchCandidateCounts(jobCodeId, [
                                    Config_1.workflowStatusApi.HRPending,
                                ])];
                        }
                        if (MatricId === ConditionConfig_1.MatricID.ReviewProfileLM) {
                            return [2 /*return*/, this._fetchCandidateCounts(jobCodeId, [
                                    Config_1.workflowStatusApi.LineManagerL1Pending,
                                    Config_1.workflowStatusApi.LineManagerL2Pending,
                                    Config_1.workflowStatusApi.LineManagerLevel1OnHold,
                                    Config_1.workflowStatusApi.LineManagerLevel2OnHold,
                                ])];
                        }
                        if (!(MatricId === ConditionConfig_1.MatricID.AssignInterviewPanel)) return [3 /*break*/, 2];
                        level1Promise = this._fetchCandidateCounts(jobCodeId, [
                            Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview,
                        ]);
                        level2Promise = this.GetCandidateDetails([
                            {
                                FilterKey: "StatusId",
                                Operator: "eq",
                                FilterValue: Config_1.StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel,
                            },
                            {
                                FilterKey: "RecruitmentID/ID",
                                Operator: "eq",
                                FilterValue: RecID,
                            },
                        ], "and");
                        return [4 /*yield*/, Promise.all([
                                level1Promise,
                                level2Promise,
                            ])];
                    case 1:
                        _a = _d.sent(), level1 = _a[0], level2 = _a[1];
                        return [2 /*return*/, level1 + ((_c = (_b = level2 === null || level2 === void 0 ? void 0 : level2.data) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0)];
                    case 2: return [2 /*return*/, 0];
                    case 3:
                        error_3 = _d.sent();
                        console.error("_getCandidateCountByMatric Error:", error_3);
                        return [2 /*return*/, 0];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DashboardService.prototype.GetRecruitmentDetails = function (filterParam, filterConditions, MatricId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var recruitmentResponse, uniqueBusinessUnitIds, jdeResponse, jdeMap_1, userCache_1, getCachedUserName_1, GridResult, error_4;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSRecruitmentDptDetails,
                                Select: "\n        *,\n        Status/StatusDescription,\n        JobCode/JobCode,\n        JobCode/ID,\n        JobCode/JobTitleInEnglish,\n        BusinessUnitCode/BusineesUnitCode,\n        Department/DepartmentName\n      ",
                                Filter: filterParam,
                                FilterCondition: filterConditions,
                                Expand: "Status,JobCode,BusinessUnitCode,Department",
                                Topcount: ApiConfig_1.count.Topcount,
                                Orderby: "ID",
                                Orderbydecorasc: true,
                            })];
                    case 1:
                        recruitmentResponse = _a.sent();
                        if (!recruitmentResponse.length) {
                            return [2 /*return*/, {
                                    data: [],
                                    status: 200,
                                    message: "No records found",
                                }];
                        }
                        uniqueBusinessUnitIds = Array.from(new Set(recruitmentResponse
                            .map(function (item) { return item.BusinessUnitCodeId; })
                            .filter(Boolean)));
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.JDEDataMapping,
                                Select: "\n        *,\n        BUC/BusineesUnitCode,\n        LineManager/Title,\n        LineManager/EMail,\n        HOD/Title,\n        HOD/EMail,\n        HR/Title,\n        HR/EMail,\n        EXCO/Title,\n        EXCO/EMail\n      ",
                                Filter: uniqueBusinessUnitIds.map(function (id) { return ({
                                    FilterKey: "BUC",
                                    Operator: "eq",
                                    FilterValue: id,
                                }); }),
                                FilterCondition: "or",
                                Expand: "BUC,LineManager,HOD,HR,EXCO",
                                Topcount: 5000,
                                Orderby: "ID",
                                Orderbydecorasc: true,
                            })];
                    case 2:
                        jdeResponse = _a.sent();
                        jdeMap_1 = new Map();
                        jdeResponse.forEach(function (item) {
                            if (item === null || item === void 0 ? void 0 : item.BUCId) {
                                jdeMap_1.set(item.BUCId, item);
                            }
                        });
                        userCache_1 = new Map();
                        getCachedUserName_1 = function (email, title) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var response, userName, error_5;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        if (title) {
                                            return [2 /*return*/, title];
                                        }
                                        if (!email) {
                                            return [2 /*return*/, ""];
                                        }
                                        if (userCache_1.has(email)) {
                                            return [2 /*return*/, userCache_1.get(email) || ""];
                                        }
                                        return [4 /*yield*/, ServiceExport_1.CommonServices.GetUserName(email)];
                                    case 1:
                                        response = _a.sent();
                                        userName = String((response === null || response === void 0 ? void 0 : response.data) || "");
                                        userCache_1.set(email, userName);
                                        return [2 /*return*/, userName];
                                    case 2:
                                        error_5 = _a.sent();
                                        console.error("getCachedUserName Error:", error_5);
                                        return [2 /*return*/, ""];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); };
                        return [4 /*yield*/, Promise.all(recruitmentResponse.map(function (item, index) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var candidateCount, jdeData, _a, LineManager, HOD, Exco, HR, HRLead, StatusTooltip;
                                var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
                                return tslib_1.__generator(this, function (_w) {
                                    switch (_w.label) {
                                        case 0: return [4 /*yield*/, this._getCandidateCountByMatric(item.JobCodeId, MatricId !== null && MatricId !== void 0 ? MatricId : 0, item.ID)];
                                        case 1:
                                            candidateCount = _w.sent();
                                            jdeData = jdeMap_1.get(item.BusinessUnitCodeId);
                                            return [4 /*yield*/, Promise.all([
                                                    getCachedUserName_1((_b = jdeData === null || jdeData === void 0 ? void 0 : jdeData.LineManager) === null || _b === void 0 ? void 0 : _b.EMail, (_c = jdeData === null || jdeData === void 0 ? void 0 : jdeData.LineManager) === null || _c === void 0 ? void 0 : _c.Title),
                                                    getCachedUserName_1((_d = jdeData === null || jdeData === void 0 ? void 0 : jdeData.HOD) === null || _d === void 0 ? void 0 : _d.EMail, (_e = jdeData === null || jdeData === void 0 ? void 0 : jdeData.HOD) === null || _e === void 0 ? void 0 : _e.Title),
                                                    getCachedUserName_1((_f = jdeData === null || jdeData === void 0 ? void 0 : jdeData.EXCO) === null || _f === void 0 ? void 0 : _f.EMail, (_g = jdeData === null || jdeData === void 0 ? void 0 : jdeData.EXCO) === null || _g === void 0 ? void 0 : _g.Title),
                                                    getCachedUserName_1(item === null || item === void 0 ? void 0 : item.AssignedHR),
                                                    getCachedUserName_1(item === null || item === void 0 ? void 0 : item.RecruitmentHRLead),
                                                ])];
                                        case 2:
                                            _a = _w.sent(), LineManager = _a[0], HOD = _a[1], Exco = _a[2], HR = _a[3], HRLead = _a[4];
                                            StatusTooltip = {
                                                LineManager: LineManager
                                                    ? {
                                                        Role: ConditionConfig_1.RoleName.LineManager,
                                                        Name: LineManager,
                                                    }
                                                    : {},
                                                HOD: HOD
                                                    ? {
                                                        Role: ConditionConfig_1.RoleName.HOD,
                                                        Name: HOD,
                                                    }
                                                    : {},
                                                Exco: Exco
                                                    ? {
                                                        Role: ConditionConfig_1.RoleName.EXCO,
                                                        Name: Exco,
                                                    }
                                                    : {},
                                                HR: HR
                                                    ? {
                                                        Role: ConditionConfig_1.RoleName.RecruitmentHR,
                                                        Name: HR,
                                                    }
                                                    : {},
                                                HRLead: HRLead
                                                    ? {
                                                        Role: ConditionConfig_1.RoleName.RecruitmentHRLead,
                                                        Name: HRLead,
                                                    }
                                                    : {},
                                            };
                                            return [2 /*return*/, {
                                                    ID: item.ID,
                                                    RecordID: index + 1,
                                                    BusinessUnitCode: (_j = (_h = item === null || item === void 0 ? void 0 : item.BusinessUnitCode) === null || _h === void 0 ? void 0 : _h.BusineesUnitCode) !== null && _j !== void 0 ? _j : "",
                                                    Nationality: item === null || item === void 0 ? void 0 : item.Nationality,
                                                    NumberOfPersonNeeded: item === null || item === void 0 ? void 0 : item.NumberOfPersonNeeded,
                                                    Type: (_k = item === null || item === void 0 ? void 0 : item.DataFrom) !== null && _k !== void 0 ? _k : "",
                                                    Status: (_m = (_l = item === null || item === void 0 ? void 0 : item.Status) === null || _l === void 0 ? void 0 : _l.StatusDescription) !== null && _m !== void 0 ? _m : "",
                                                    StatusId: item === null || item === void 0 ? void 0 : item.StatusId,
                                                    JobCodeId: (_p = (_o = item === null || item === void 0 ? void 0 : item.JobCode) === null || _o === void 0 ? void 0 : _o.ID) !== null && _p !== void 0 ? _p : 0,
                                                    JobCode: (_r = (_q = item === null || item === void 0 ? void 0 : item.JobCode) === null || _q === void 0 ? void 0 : _q.JobCode) !== null && _r !== void 0 ? _r : "",
                                                    JobTitleEnglish: (_t = (_s = item === null || item === void 0 ? void 0 : item.JobCode) === null || _s === void 0 ? void 0 : _s.JobTitleInEnglish) !== null && _t !== void 0 ? _t : "",
                                                    ModifiedDate: (item === null || item === void 0 ? void 0 : item.Modified)
                                                        ? (0, moment_1.default)(item.Modified).format("YYYY-MM-DD")
                                                        : undefined,
                                                    CreatedDate: (item === null || item === void 0 ? void 0 : item.Created)
                                                        ? (0, moment_1.default)(item.Created).format("YYYY-MM-DD")
                                                        : undefined,
                                                    Department: (_v = (_u = item === null || item === void 0 ? void 0 : item.Department) === null || _u === void 0 ? void 0 : _u.DepartmentName) !== null && _v !== void 0 ? _v : "",
                                                    EmploymentCategory: item === null || item === void 0 ? void 0 : item.EmploymentCategory,
                                                    CandidateCount: candidateCount,
                                                    StatusTooltip: StatusTooltip,
                                                }];
                                    }
                                });
                            }); }))];
                    case 3:
                        GridResult = _a.sent();
                        return [2 /*return*/, {
                                data: GridResult,
                                status: 200,
                                message: "GetRecruitmentDetails fetched successfully",
                            }];
                    case 4:
                        error_4 = _a.sent();
                        console.error("Error fetching GetRecruitmentDetails:", error_4);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error fetching data",
                            }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DashboardService.prototype.GetDepartmentDetails = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var recruitmentResponse, departmentCountMap_1, GridResult, error_6;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSRecruitmentDeptOpenings,
                                Select: "\n        *,\n        Department/DepartmentName\n      ",
                                Expand: "Department",
                                Topcount: ApiConfig_1.count.Topcount,
                                Orderby: "ID",
                                Orderbydecorasc: true,
                            })];
                    case 1:
                        recruitmentResponse = _a.sent();
                        if (!recruitmentResponse.length) {
                            return [2 /*return*/, {
                                    data: [],
                                    status: 200,
                                    message: "No records found",
                                }];
                        }
                        departmentCountMap_1 = {};
                        recruitmentResponse.forEach(function (item) {
                            var _a, _b;
                            var departmentName = (_b = (_a = item === null || item === void 0 ? void 0 : item.Department) === null || _a === void 0 ? void 0 : _a.DepartmentName) !== null && _b !== void 0 ? _b : "Unknown";
                            departmentCountMap_1[departmentName] = (departmentCountMap_1[departmentName] || 0) + 1;
                        });
                        GridResult = Object.entries(departmentCountMap_1).map(function (_a) {
                            var name = _a[0], value = _a[1];
                            return ({
                                name: name,
                                value: value,
                            });
                        });
                        return [2 /*return*/, {
                                data: GridResult,
                                status: 200,
                                message: "GetRecruitmentDetails fetched successfully",
                            }];
                    case 2:
                        error_6 = _a.sent();
                        console.error("Error fetching GetRecruitmentDetails:", error_6);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error fetching data",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // async GetCareerPortalCandidate(
    //   JobCodeID: number,
    //   WorkflowStatusID: string[];
    // ): Promise<ApiResponse<GetProfileByJobCode[]>> {
    //    try {
    //        let FilterValue: FilterItem = {
    //           jobCode: "",
    //           workflowStausId: [],
    //           pagination: {
    //             filterValue: "",
    //             sortBy: "",
    //             sortOrder: 0,
    //             pageSize: 0,
    //             currentPage: 0,
    //             totalItems: 0,
    //           },
    //         };
    //       const res = await getProfileData.GetProfileByJobCode(FilterValue);
    //       if (!res?.data?.data) {
    //         return {
    //           data: [],
    //           status: 200,
    //           message: "No candidate data",
    //         };
    //       }
    //       const totalItems = res.data.pagination?.totalItems || 0;
    //       const mappedData: GetProfileByJobCode[] = res.data.data.map(
    //         (item: any, index: number) => {
    //           const JobCode = item?.jobCode?.split("-")[0];
    //           return {
    //             SNO: index + 1,
    //             CandidateID: item?.jobRequestId,
    //             ApplicantName: item?.applicantName,
    //             PositionTitle: item?.jobTitle?.displayText,
    //             JobCode: JobCode,
    //             Status: item?.workflowStatus?.displayText,
    //             workflowStatusId: item?.workflowStatusId,
    //             createdOn: moment(item?.createdOn).format("DD/MM/YYYY"),
    //             TotalItems: totalItems,
    //             applicationStatusId: item?.applicationStatusId,
    //             applicationStatus: item?.applicationStatus?.displayText,
    //             createdBy: item?.createdBy,
    //             tblProfilesKcsas: item?.tblProfilesKcsas || [],
    //           };
    //         }
    //       );
    //       // console.log("Mapped Candidate Data:", mappedData);
    //       return {
    //         data: mappedData,
    //         status: 200,
    //         message: "Get Candidate details",
    //       };
    //     } catch (error) {
    //       console.error("Error Get Candidate details:", error);
    //       return {
    //         data: [],
    //         status: 500,
    //         message: "Error Get Candidate details",
    //       };
    //     }
    // }
    // private async fetchRecruitmentByLookup(
    //   listName: string,
    //   filterParam: any,
    //   filterConditions: any
    // ): Promise<ApiResponse<any[]>> {
    //   try {
    //     let GridResult: any[] = [];
    //     const res: any[] = await SPServices.SPReadItems({
    //       Listname: listName,
    //       Select: `*,Status/StatusDescription,RecruitmentID/Id`,
    //       Filter: filterParam,
    //       FilterCondition: filterConditions,
    //       Expand: `RecruitmentID,Status`,
    //       Topcount: count.Topcount,
    //       Orderby: "ID",
    //       Orderbydecorasc: true,
    //     });
    //     if (!res.length) {
    //       return { data: [], status: 200, message: "No records found" };
    //     }
    //     const ids: number[] = res
    //       .map((item: any) => item.RecruitmentID?.Id)
    //       .filter(Boolean);
    //     if (!ids.length) {
    //       return { data: [], status: 200, message: "No linked recruitment records found" };
    //     }
    //     const recruitmentFilter = [
    //       { FilterKey: "ID", Operator: "in", FilterValue: ids },
    //     ];
    //     let DeptDetails = await this.GetRecruitmentDetails(
    //       recruitmentFilter,
    //       filterConditions
    //     );
    //     if (listName === ListNames.HRMSRecruitmentCandidatePersonalDetails) {
    //       GridResult = res.map((item) => {
    //         const deptDetails = DeptDetails.data.filter(
    //           (dpt) => dpt.ID === item.RecruitmentID?.Id
    //         );
    //         return {
    //           ApplicantName:
    //             `${item.FirstName || ""} ${item.MiddleName || ""} ${item.LastName || ""}`.trim(),
    //           PositionTitle: item?.PositionTitle,
    //           JobGrade: item?.JobGrade,
    //           Nationality: item?.Nationality,
    //           Status: item?.Status?.StatusDescription ?? "",
    //           StatusId: item?.StatusId,
    //           InterviewDate: item?.InterviewDate
    //             ? moment(item.InterviewDate).format("YYYY-MM-DD")
    //             : undefined,
    //           ModifiedDate: item?.Modified
    //             ? moment(item.Modified).format("YYYY-MM-DD")
    //             : undefined,
    //           CreatedDate: item?.Created
    //             ? moment(item.Created).format("YYYY-MM-DD")
    //             : undefined,
    //           DeptDetails: deptDetails, // optional if needed
    //         };
    //       });
    //     }else if(listName === ListNames.HRMSRecruitmentCandidatePersonalDetails){}
    //     return { data: GridResult, status: 200, message: "Success" };
    //   } catch (error) {
    //     console.error(`Error fetching from ${listName}:`, error);
    //     return { data: [], status: 500, message: "Error fetching data" };
    //   }
    // }
    DashboardService.prototype.GetCandidateDetails = function (filterParam, filterConditions, MatricId, EmailID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var isEvaluationFlow, UserID, listItems, recruitmentIds_1, res, recruitmentIds, uniqueGrades, recruitmentFilter, _a, deptResult, gradeResults_1, gradeLevelMap_1, deptMap_1, _i, _b, dept, existing, GridResult, error_7;
            var _c, _d, _e, _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 6, , 7]);
                        isEvaluationFlow = MatricId === ConditionConfig_1.MatricID.EvalutionHR ||
                            MatricId === ConditionConfig_1.MatricID.EvalutionLM ||
                            MatricId === ConditionConfig_1.MatricID.EvalutionHOD ||
                            MatricId === ConditionConfig_1.MatricID.EvalutionEXCO;
                        if (!(EmailID && isEvaluationFlow)) return [3 /*break*/, 3];
                        return [4 /*yield*/, ServiceExport_1.CommonServices.getUserGuidByEmail(EmailID)];
                    case 1:
                        UserID = _g.sent();
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                                Select: EvaluationConfig_1.EvalQueryConfig.InterviewPanel.Select,
                                Expand: EvaluationConfig_1.EvalQueryConfig.InterviewPanel.Expand,
                                Filter: [
                                    {
                                        FilterKey: "InterviewPanelId",
                                        Operator: "eq",
                                        FilterValue: (_d = (_c = UserID.data) === null || _c === void 0 ? void 0 : _c.key) !== null && _d !== void 0 ? _d : "",
                                    },
                                    {
                                        FilterKey: "IsScoreSheetUploaded",
                                        Operator: "eq",
                                        FilterValue: ApiConfig_1.Choices.No,
                                    },
                                ],
                            })];
                    case 2:
                        listItems = _g.sent();
                        recruitmentIds_1 = listItems
                            .map(function (item) { var _a; return (_a = item.CandidateID) === null || _a === void 0 ? void 0 : _a.ID; })
                            .filter(Boolean);
                        if (recruitmentIds_1.length === 0) {
                            return [2 /*return*/, { data: [], status: 200, message: "No records found" }];
                        }
                        filterParam.push({
                            FilterKey: "ID",
                            Operator: "in",
                            FilterValue: recruitmentIds_1,
                        });
                        _g.label = 3;
                    case 3: return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                            Select: "*,Status/StatusDescription,RecruitmentID/Id",
                            Filter: filterParam,
                            FilterCondition: filterConditions,
                            Expand: "RecruitmentID,Status",
                            Topcount: ApiConfig_1.count.Topcount,
                            Orderby: "ID",
                            Orderbydecorasc: true,
                        })];
                    case 4:
                        res = _g.sent();
                        if (!res.length) {
                            return [2 /*return*/, { data: [], status: 200, message: "No records found" }];
                        }
                        recruitmentIds = res
                            .map(function (item) { var _a; return (_a = item.RecruitmentID) === null || _a === void 0 ? void 0 : _a.Id; })
                            .filter(Boolean);
                        if (!recruitmentIds.length) {
                            return [2 /*return*/, {
                                    data: [],
                                    status: 200,
                                    message: "No linked recruitment records found",
                                }];
                        }
                        uniqueGrades = Array.from(new Set(res.map(function (item) { return item === null || item === void 0 ? void 0 : item.JobGrade; }).filter(Boolean)));
                        recruitmentFilter = [
                            { FilterKey: "ID", Operator: "in", FilterValue: recruitmentIds },
                        ];
                        return [4 /*yield*/, Promise.all(tslib_1.__spreadArray([
                                this.GetRecruitmentDetails(recruitmentFilter, filterConditions)
                            ], uniqueGrades.map(function (grade) {
                                return ServiceExport_1.masterService.GetGradeLevel(grade).catch(function (err) {
                                    console.error("GradeLevel API failed for grade \"".concat(grade, "\":"), err);
                                    return { data: [] };
                                });
                            }), true))];
                    case 5:
                        _a = _g.sent(), deptResult = _a[0], gradeResults_1 = _a.slice(1);
                        gradeLevelMap_1 = new Map(uniqueGrades.map(function (grade, i) {
                            var _a, _b;
                            return [
                                grade,
                                (_b = (_a = gradeResults_1[i]) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : [],
                            ];
                        }));
                        deptMap_1 = new Map();
                        for (_i = 0, _b = (_e = deptResult.data) !== null && _e !== void 0 ? _e : []; _i < _b.length; _i++) {
                            dept = _b[_i];
                            existing = (_f = deptMap_1.get(dept.ID)) !== null && _f !== void 0 ? _f : [];
                            existing.push(dept);
                            deptMap_1.set(dept.ID, existing);
                        }
                        GridResult = res.map(function (item, index) {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                            var InterviewDate = (_a = item === null || item === void 0 ? void 0 : item.InterviewDateLevel2) !== null && _a !== void 0 ? _a : item === null || item === void 0 ? void 0 : item.InterviewDate;
                            return {
                                ID: item.ID,
                                RecordID: index + 1,
                                RecID: (_b = item.RecruitmentID) === null || _b === void 0 ? void 0 : _b.Id,
                                ApplicantName: "".concat((_c = item.FristName) !== null && _c !== void 0 ? _c : "", " ").concat((_d = item.MiddleName) !== null && _d !== void 0 ? _d : "", " ").concat((_e = item.LastName) !== null && _e !== void 0 ? _e : "").trim(),
                                PositionTitle: item === null || item === void 0 ? void 0 : item.PositionTitle,
                                JobGrade: item === null || item === void 0 ? void 0 : item.JobGrade,
                                Nationality: item === null || item === void 0 ? void 0 : item.Nationality,
                                interviewLevels: (_f = gradeLevelMap_1.get(item === null || item === void 0 ? void 0 : item.JobGrade)) !== null && _f !== void 0 ? _f : [],
                                jobrequestID: item === null || item === void 0 ? void 0 : item.JobRequestID,
                                Status: (_h = (_g = item === null || item === void 0 ? void 0 : item.Status) === null || _g === void 0 ? void 0 : _g.StatusDescription) !== null && _h !== void 0 ? _h : "",
                                StatusId: item === null || item === void 0 ? void 0 : item.StatusId,
                                InterviewDate: InterviewDate
                                    ? (0, moment_1.default)(InterviewDate).format("DD-MM-YYYY")
                                    : undefined,
                                ModifiedDate: (item === null || item === void 0 ? void 0 : item.Modified)
                                    ? (0, moment_1.default)(item.Modified).format("DD-MM-YYYY")
                                    : undefined,
                                CreatedDate: (item === null || item === void 0 ? void 0 : item.Created)
                                    ? (0, moment_1.default)(item.Created).format("DD-MM-YYYY")
                                    : undefined,
                                isExpat: (item === null || item === void 0 ? void 0 : item.NationalityCode) !== ConditionConfig_1.NationalityCode.Nationals,
                                DeptDetails: (_k = deptMap_1.get((_j = item.RecruitmentID) === null || _j === void 0 ? void 0 : _j.Id)) !== null && _k !== void 0 ? _k : [],
                            };
                        });
                        return [2 /*return*/, { data: GridResult, status: 200, message: "Success" }];
                    case 6:
                        error_7 = _g.sent();
                        console.error("Error fetching from Candidate details:", error_7);
                        return [2 /*return*/, { data: [], status: 500, message: "Error fetching data" }];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    DashboardService.prototype.GetSelectedCandidate = function (filterParam, filterConditions) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var GridResult, res, ids, candidateIds, recruitmentFilter, candidateFilter, DeptDetails, getCandidateDetails, deptMap_2, candidateMap_1, error_8;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        GridResult = [];
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD,
                                Select: "*,Status/StatusDescription,RecruitmentID/Id,CandidateID/ID,PositionID/PositionID",
                                Filter: filterParam,
                                FilterCondition: filterConditions,
                                Expand: "RecruitmentID,Status,CandidateID,PositionID",
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
                        deptMap_2 = new Map(DeptDetails.data.map(function (d) { return [d.ID, d]; }));
                        candidateMap_1 = new Map(getCandidateDetails.data.map(function (c) { return [c.ID, c]; }));
                        // ✅ Main mapping
                        GridResult = res.map(function (item, index) {
                            var _a, _b, _c, _d, _e, _f;
                            var deptDetails = deptMap_2.get((_a = item.RecruitmentID) === null || _a === void 0 ? void 0 : _a.Id);
                            var candidate = candidateMap_1.get((_b = item.CandidateID) === null || _b === void 0 ? void 0 : _b.ID);
                            return {
                                ID: index + 1,
                                ItemID: item === null || item === void 0 ? void 0 : item.ID,
                                ApplicantName: (_c = candidate === null || candidate === void 0 ? void 0 : candidate.ApplicantName) !== null && _c !== void 0 ? _c : "",
                                PositionTitle: candidate === null || candidate === void 0 ? void 0 : candidate.PositionTitle,
                                JobGrade: candidate === null || candidate === void 0 ? void 0 : candidate.JobGrade,
                                Nationality: candidate === null || candidate === void 0 ? void 0 : candidate.Nationality,
                                Status: (_e = (_d = item === null || item === void 0 ? void 0 : item.Status) === null || _d === void 0 ? void 0 : _d.StatusDescription) !== null && _e !== void 0 ? _e : "",
                                StatusId: item === null || item === void 0 ? void 0 : item.StatusId,
                                PositionID: (_f = item === null || item === void 0 ? void 0 : item.PositionID) === null || _f === void 0 ? void 0 : _f.PositionID,
                                ModifiedDate: (item === null || item === void 0 ? void 0 : item.Modified)
                                    ? (0, moment_1.default)(item.Modified).format("DD-MM-YYYY")
                                    : undefined,
                                CreatedDate: (item === null || item === void 0 ? void 0 : item.Created)
                                    ? (0, moment_1.default)(item.Created).format("DD-MM-YYYY")
                                    : undefined,
                                DeptDetails: deptDetails !== null && deptDetails !== void 0 ? deptDetails : null,
                                candiDetails: candidate !== null && candidate !== void 0 ? candidate : null,
                            };
                        });
                        return [2 /*return*/, { data: GridResult, status: 200, message: "Success" }];
                    case 4:
                        error_8 = _a.sent();
                        console.error("Error fetching from Candidate details:", error_8);
                        return [2 /*return*/, { data: [], status: 500, message: "Error fetching data" }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DashboardService.prototype.GetNPAEPVRRDetails = function (filterParam, filterConditions) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var queries, batchRes, additionalExistingItems, newPositionItems, vacancyItems, additionalIds, newPositionIds, _a, additionalPositionRes, newPositionRes, additionalPositionMap_1, newPositionMap_1, mapCommonFields_1, additionalExistingResult, newPositionResult, vacancyResult, GridResult, error_9;
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
                                select: [
                                    "*",
                                    "Status/StatusDescription",
                                    "BusinessUnitCode/BusineesUnitCode",
                                    "Department/DepartmentName",
                                    "JobTitleEnglish/JobTitleInEnglish",
                                    "JobTitleFrench/JobTitleInFrench",
                                    "JobTitleEnglish/JobCode",
                                ],
                                expand: [
                                    "Status",
                                    "BusinessUnitCode",
                                    "Department",
                                    "JobTitleEnglish",
                                    "JobTitleFrench",
                                ],
                            },
                            {
                                StateValue: 2,
                                ListName: Config_1.ListNames.HRMSNewPositionRequest,
                                Filter: filterParam,
                                FilterCondition: filterConditions,
                                select: [
                                    "*",
                                    "BusinessUnitCode/BusineesUnitCode",
                                    "Status/StatusDescription",
                                    "Department/DepartmentName",
                                ],
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
                                    "Department/DepartmentName",
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
                        additionalIds = additionalExistingItems
                            .map(function (i) { return i.ID; })
                            .filter(Boolean);
                        newPositionIds = newPositionItems
                            .map(function (i) { return i.ID; })
                            .filter(Boolean);
                        return [4 /*yield*/, Promise.all([
                                additionalIds.length > 0
                                    ? this.GetAdditionalPosition([
                                        {
                                            FilterKey: "LookupIDId",
                                            Operator: "in",
                                            FilterValue: additionalIds,
                                        },
                                    ], undefined, Config_1.ListNames.HRMSAdditionalHCForExisitingPositionWithHeadCountDetails)
                                    : Promise.resolve({ data: [], status: 200, message: "" }),
                                newPositionIds.length > 0
                                    ? this.GetPositionDetails([
                                        {
                                            FilterKey: "PositionRequestID",
                                            Operator: "in",
                                            FilterValue: newPositionIds,
                                        },
                                    ], undefined, Config_1.ListNames.HRMSNewPositionRequestPositionDetails)
                                    : Promise.resolve({ data: [], status: 200, message: "" }),
                            ])];
                    case 2:
                        _a = _d.sent(), additionalPositionRes = _a[0], newPositionRes = _a[1];
                        additionalPositionMap_1 = new Map(((_b = additionalPositionRes.data) !== null && _b !== void 0 ? _b : []).map(function (d) { return [d.parentId, d]; }));
                        newPositionMap_1 = new Map(((_c = newPositionRes.data) !== null && _c !== void 0 ? _c : []).map(function (d) { return [d.parentId, d]; }));
                        mapCommonFields_1 = function (item, index) {
                            var _a, _b, _c, _d, _e, _f, _g;
                            return ({
                                ID: item.ID,
                                RecordID: index + 1,
                                BusinessUnitCode: (_b = (_a = item === null || item === void 0 ? void 0 : item.BusinessUnitCode) === null || _a === void 0 ? void 0 : _a.BusineesUnitCode) !== null && _b !== void 0 ? _b : "",
                                NumberOfPersonNeeded: item === null || item === void 0 ? void 0 : item.NumberOfPersonNeeded,
                                Status: (_d = (_c = item === null || item === void 0 ? void 0 : item.Status) === null || _c === void 0 ? void 0 : _c.StatusDescription) !== null && _d !== void 0 ? _d : "",
                                StatusId: (_e = item === null || item === void 0 ? void 0 : item.StatusId) !== null && _e !== void 0 ? _e : 0,
                                Nationality: item === null || item === void 0 ? void 0 : item.Nationality,
                                ModifiedDate: (item === null || item === void 0 ? void 0 : item.Modified)
                                    ? (0, moment_1.default)(item.Modified).format("YYYY-MM-DD")
                                    : undefined,
                                CreatedDate: (item === null || item === void 0 ? void 0 : item.Created)
                                    ? (0, moment_1.default)(item.Created).format("YYYY-MM-DD")
                                    : undefined,
                                Department: (_g = (_f = item === null || item === void 0 ? void 0 : item.Department) === null || _f === void 0 ? void 0 : _f.DepartmentName) !== null && _g !== void 0 ? _g : "",
                            });
                        };
                        additionalExistingResult = additionalExistingItems.map(function (item, index) {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                            var pos = additionalPositionMap_1.get(item.ID);
                            return tslib_1.__assign(tslib_1.__assign({}, mapCommonFields_1(item, index)), { Type: Config_1.DataFrom.ExistingPosition, JobCodeId: (_b = (_a = item === null || item === void 0 ? void 0 : item.JobTitleEnglish) === null || _a === void 0 ? void 0 : _a.ID) !== null && _b !== void 0 ? _b : 0, JobCode: (_d = (_c = item === null || item === void 0 ? void 0 : item.JobTitleEnglish) === null || _c === void 0 ? void 0 : _c.JobCode) !== null && _d !== void 0 ? _d : "", JobTitleEnglish: (_f = (_e = item === null || item === void 0 ? void 0 : item.JobTitleEnglish) === null || _e === void 0 ? void 0 : _e.JobTitleInEnglish) !== null && _f !== void 0 ? _f : "", JobTitleFrench: (_h = (_g = item === null || item === void 0 ? void 0 : item.JobTitleFrench) === null || _g === void 0 ? void 0 : _g.JobTitleInFrench) !== null && _h !== void 0 ? _h : "", PatersonGrade: (_j = pos === null || pos === void 0 ? void 0 : pos.PatersonGrade) !== null && _j !== void 0 ? _j : "", DRCGrade: (_k = pos === null || pos === void 0 ? void 0 : pos.DRCGrade) !== null && _k !== void 0 ? _k : "", NumberOfPersonNeeded: pos === null || pos === void 0 ? void 0 : pos.NumberOfPersonNeeded });
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
                        error_9 = _d.sent();
                        console.error("Error fetching GetNPAEPVRRDetails:", error_9);
                        return [2 /*return*/, { data: [], status: 500, message: "Error fetching data" }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DashboardService.prototype.GetAdditionalPosition = function (Filter, filterConditions, ListName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var resdata, result, error_10;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: ListName,
                                Select: "*,DRCGrade/DRCGrade,PatersonGrade/PatersonGrade",
                                Filter: Filter,
                                FilterCondition: filterConditions,
                                Expand: "DRCGrade,PatersonGrade",
                                Topcount: ApiConfig_1.count.CamelQuery,
                            })];
                    case 1:
                        resdata = _a.sent();
                        result = resdata.map(function (item, index) {
                            var _a, _b, _c, _d, _e, _f;
                            return ({
                                parentId: (_b = (_a = item === null || item === void 0 ? void 0 : item.LookupIDId) !== null && _a !== void 0 ? _a : item === null || item === void 0 ? void 0 : item.PositionRequestIDId) !== null && _b !== void 0 ? _b : 0,
                                id: index + 1,
                                DRCGrade: (_d = (_c = item === null || item === void 0 ? void 0 : item.DRCGrade) === null || _c === void 0 ? void 0 : _c.DRCGrade) !== null && _d !== void 0 ? _d : "",
                                PatersonGrade: (_f = (_e = item === null || item === void 0 ? void 0 : item.PatersonGrade) === null || _e === void 0 ? void 0 : _e.PatersonGrade) !== null && _f !== void 0 ? _f : "",
                                NumberOfPersonNeeded: item === null || item === void 0 ? void 0 : item.ActualVacantPosition,
                            });
                        });
                        return [2 /*return*/, {
                                data: result,
                                status: 200,
                                message: "GetPositionDetails fetched successfully",
                            }];
                    case 2:
                        error_10 = _a.sent();
                        console.error("GetPositionDetails error:", error_10);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error fetching position details",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DashboardService.prototype.GetPositionDetails = function (Filter, filterConditions, ListName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var resdata, result, error_11;
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
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                            return ({
                                parentId: (_b = (_a = item === null || item === void 0 ? void 0 : item.LookupIDId) !== null && _a !== void 0 ? _a : item === null || item === void 0 ? void 0 : item.PositionRequestIDId) !== null && _b !== void 0 ? _b : 0,
                                id: index + 1,
                                title: (_e = (_d = (_c = item === null || item === void 0 ? void 0 : item.JobTitleEnglish) === null || _c === void 0 ? void 0 : _c.JobTitleInEnglish) !== null && _d !== void 0 ? _d : item === null || item === void 0 ? void 0 : item.UnBudgetedJobTitleEnglish) !== null && _e !== void 0 ? _e : "",
                                jobCode: (_g = (_f = item === null || item === void 0 ? void 0 : item.JobTitleEnglish) === null || _f === void 0 ? void 0 : _f.JobCode) !== null && _g !== void 0 ? _g : "",
                                DRCGrade: (_j = (_h = item === null || item === void 0 ? void 0 : item.DRCGrade) === null || _h === void 0 ? void 0 : _h.DRCGrade) !== null && _j !== void 0 ? _j : "",
                                PatersonGrade: (_l = (_k = item === null || item === void 0 ? void 0 : item.PatersonGrade) === null || _k === void 0 ? void 0 : _k.PatersonGrade) !== null && _l !== void 0 ? _l : "",
                                JobTitleFrench: (_p = (_o = (_m = item === null || item === void 0 ? void 0 : item.JobTitleFrench) === null || _m === void 0 ? void 0 : _m.JobTitleInFrench) !== null && _o !== void 0 ? _o : item === null || item === void 0 ? void 0 : item.UnBudgetedJobTitleInFrench) !== null && _p !== void 0 ? _p : "",
                            });
                        });
                        return [2 /*return*/, {
                                data: result,
                                status: 200,
                                message: "GetPositionDetails fetched successfully",
                            }];
                    case 2:
                        error_11 = _a.sent();
                        console.error("GetPositionDetails error:", error_11);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error fetching position details",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DashboardService.prototype.EvalutionValidation = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var getCurrentUserId, levelFilter, resdata, IsSubmitted, error_12;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, ServiceExport_1.CommonServices.getUserGuidByEmail(data.currentEmailID)];
                    case 1:
                        getCurrentUserId = _b.sent();
                        levelFilter = data.statusId === Config_1.StatusId.InterviewScheduled
                            ? ConditionConfig_1.InterviewLevel.Level1
                            : ConditionConfig_1.InterviewLevel.Level2;
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                                Select: "IsScoreSheetUploaded",
                                Filter: [
                                    {
                                        FilterKey: "CandidateIDId",
                                        Operator: "eq",
                                        FilterValue: data.ID,
                                    },
                                    {
                                        FilterKey: "InterviewPanelId",
                                        Operator: "eq",
                                        FilterValue: Number((_a = getCurrentUserId.data) === null || _a === void 0 ? void 0 : _a.key),
                                    },
                                    {
                                        FilterKey: "InterviewLevel",
                                        Operator: "eq",
                                        FilterValue: levelFilter,
                                    },
                                ],
                                Topcount: 1,
                            })];
                    case 2:
                        resdata = (_b.sent());
                        IsSubmitted = true;
                        return [2 /*return*/, {
                                data: IsSubmitted,
                                status: 200,
                                message: "Validation success",
                            }];
                    case 3:
                        error_12 = _b.sent();
                        console.error("EvalutionValidation error:", error_12);
                        return [2 /*return*/, {
                                data: false,
                                status: 500,
                                message: "Error fetching validation",
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return DashboardService;
}());
exports.default = DashboardService;
//# sourceMappingURL=DashboardService.js.map