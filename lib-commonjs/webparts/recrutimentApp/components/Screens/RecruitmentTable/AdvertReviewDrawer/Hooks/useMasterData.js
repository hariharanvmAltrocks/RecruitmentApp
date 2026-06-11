"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMasterData = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var ServiceExport_1 = require("../../../../../services/ServiceExport");
var ConditionConfig_1 = require("../../../../../utilities/ConditionConfig");
var Config_1 = require("../../../../../utilities/Config");
var useMasterData = function () {
    var _a = (0, react_1.useState)([]), totalExperience = _a[0], setTotalExperience = _a[1];
    // const [miningExperience, setMiningExperience] = useState<MasterItem[]>([]);
    var _b = (0, react_1.useState)([]), qualifications = _b[0], setQualifications = _b[1];
    var _c = (0, react_1.useState)([]), technicalSkills = _c[0], setTechnicalSkills = _c[1];
    var _d = (0, react_1.useState)([]), roleSpecificKnowledge = _d[0], setRoleSpecificKnowledge = _d[1];
    var _e = (0, react_1.useState)([]), managers = _e[0], setManagers = _e[1];
    var _f = (0, react_1.useState)([]), Level = _f[0], setLevel = _f[1];
    var _g = (0, react_1.useState)([]), functionalType = _g[0], setFunctionalType = _g[1];
    var _h = (0, react_1.useState)([]), jobTitles = _h[0], setJobTitles = _h[1];
    var _j = (0, react_1.useState)(true), loading = _j[0], setLoading = _j[1];
    var _k = (0, react_1.useState)(null), error = _k[0], setError = _k[1];
    (0, react_1.useEffect)(function () {
        var fetchAllData = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var safeFetch, _a, totalExpRes, 
            // miningExpRes,
            qualRes, techSkillsRes, roleKnowledgeRes, managersRes, levelres, functionalType_1, jobTitleres, processResult, list, mappedMgrs, mergedMgrs, list, mappedMgrs, mergedMgrs, list, mappedMgrs, mergedMgrs, list, mappedMgrs, mergedMgrs, err_1;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        setLoading(true);
                        setError(null);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        safeFetch = function (promise) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                            var e_1;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, promise];
                                    case 1: return [2 /*return*/, _a.sent()];
                                    case 2:
                                        e_1 = _a.sent();
                                        console.error("Master data fetch error:", e_1);
                                        return [2 /*return*/, null];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); };
                        return [4 /*yield*/, Promise.all([
                                // safeFetch(masterService.GetAllMaster(CategoryID.Experience)),
                                safeFetch(ServiceExport_1.CommonServices.GetMasterData(Config_1.ListNames.HRMSExperienceMaster)),
                                // safeFetch(masterService.GetAllMaster(CategoryID.Experience)),
                                safeFetch(ServiceExport_1.masterService.GetAllMaster(ConditionConfig_1.CategoryID.Qualification)),
                                safeFetch(ServiceExport_1.masterService.GetAllMaster(ConditionConfig_1.CategoryID.TechnicalSkills)),
                                safeFetch(ServiceExport_1.masterService.GetAllMaster(ConditionConfig_1.CategoryID.RoleSpecificKnowledge)),
                                safeFetch(ServiceExport_1.CommonServices.GetSageMasterData(Config_1.ListNames.HRMSSageList)),
                                safeFetch(ServiceExport_1.masterService.GetAllMaster(ConditionConfig_1.CategoryID.Level)),
                                safeFetch(ServiceExport_1.CommonServices.GetMasterData(Config_1.ListNames.HRMSJobTitleFunctionType)),
                                // safeFetch(masterService.GetAllMaster(CategoryID.Function))
                                safeFetch(ServiceExport_1.CommonServices.GetMasterData(Config_1.ListNames.HRMSJobTitleMaster)),
                            ])];
                    case 2:
                        _a = _b.sent(), totalExpRes = _a[0], qualRes = _a[1], techSkillsRes = _a[2], roleKnowledgeRes = _a[3], managersRes = _a[4], levelres = _a[5], functionalType_1 = _a[6], jobTitleres = _a[7];
                        processResult = function (res, setter) {
                            if (res && res.status === 200 && res.data) {
                                var data = res.data;
                                if (Array.isArray(data) && data.length > 0) {
                                    var mapped = data.map(function (item) {
                                        var _a, _b, _c, _d, _e, _f, _g, _h;
                                        return ({
                                            id: (_c = (_b = (_a = item.value) !== null && _a !== void 0 ? _a : item.ID) !== null && _b !== void 0 ? _b : item.value) !== null && _c !== void 0 ? _c : "unknown",
                                            value: (_e = (_d = item.value) !== null && _d !== void 0 ? _d : item.text) !== null && _e !== void 0 ? _e : "",
                                            displayText: (_h = (_g = (_f = item.displayText) !== null && _f !== void 0 ? _f : item.text) !== null && _g !== void 0 ? _g : item.value) !== null && _h !== void 0 ? _h : "",
                                        });
                                    });
                                    var merged = tslib_1.__spreadArray([], mapped, true);
                                    // defaultItems.forEach((def) => {
                                    //   if (!merged.some((m) => m.value.toLowerCase() === def.value.toLowerCase())) {
                                    //     merged.push(def);
                                    //   }
                                    // });
                                    setter(merged);
                                    return;
                                }
                            }
                            // setter(merged);
                        };
                        // processResult(totalExpRes, setTotalExperience);
                        // processResult(miningExpRes, setMiningExperience);
                        processResult(qualRes, setQualifications);
                        processResult(techSkillsRes, setTechnicalSkills);
                        processResult(roleKnowledgeRes, setRoleSpecificKnowledge);
                        processResult(levelres, setLevel);
                        // processResult(functionalType, setFunctionalType);
                        if (totalExpRes && totalExpRes.status === 200 && totalExpRes.data) {
                            list = totalExpRes.data;
                            if (Array.isArray(list) && list.length > 0) {
                                mappedMgrs = list.map(function (item) {
                                    var _a;
                                    return {
                                        id: (_a = item.ID) !== null && _a !== void 0 ? _a : 0,
                                        value: String(item.ID),
                                        displayText: item.ExperienceInYearRange,
                                    };
                                });
                                mergedMgrs = tslib_1.__spreadArray([], mappedMgrs, true);
                                setTotalExperience(mergedMgrs);
                            }
                        }
                        if (functionalType_1 && functionalType_1.status === 200 && functionalType_1.data) {
                            list = functionalType_1.data;
                            if (Array.isArray(list) && list.length > 0) {
                                mappedMgrs = list.map(function (item) {
                                    var _a;
                                    return {
                                        id: (_a = item.ID) !== null && _a !== void 0 ? _a : 0,
                                        value: String(item.ID),
                                        displayText: item.FunctionType,
                                    };
                                });
                                mergedMgrs = tslib_1.__spreadArray([], mappedMgrs, true);
                                setFunctionalType(mergedMgrs);
                            }
                        }
                        if (jobTitleres && jobTitleres.status === 200 && jobTitleres.data) {
                            list = jobTitleres.data;
                            if (Array.isArray(list) && list.length > 0) {
                                mappedMgrs = list.map(function (item) {
                                    var _a;
                                    return {
                                        id: (_a = item.ID) !== null && _a !== void 0 ? _a : 0,
                                        value: String(item.ID),
                                        displayText: item.JobTitleInEnglish,
                                    };
                                });
                                mergedMgrs = tslib_1.__spreadArray([], mappedMgrs, true);
                                setJobTitles(mergedMgrs);
                            }
                        }
                        if (managersRes && managersRes.status === 200 && managersRes.data) {
                            list = managersRes.data;
                            if (Array.isArray(list) && list.length > 0) {
                                mappedMgrs = list.map(function (item) {
                                    var fullName = [item.FirstName, item.MiddleName, item.LastName]
                                        .filter(Boolean)
                                        .join(" ");
                                    return {
                                        id: item.JobTitleInEnglishId,
                                        value: String(item.JobTitleInEnglishId),
                                        displayText: fullName,
                                    };
                                });
                                mergedMgrs = tslib_1.__spreadArray([], mappedMgrs, true);
                                setManagers(mergedMgrs);
                            }
                        }
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _b.sent();
                        console.error("Error fetching master data, using default fallbacks:", err_1);
                        setError("Failed to fetch some master data from the database. Default options loaded.");
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        void fetchAllData();
    }, []);
    return {
        totalExperience: totalExperience,
        // miningExperience,
        qualifications: qualifications,
        technicalSkills: technicalSkills,
        roleSpecificKnowledge: roleSpecificKnowledge,
        Level: Level,
        functionalType: functionalType,
        managers: managers,
        jobTitles: jobTitles,
        loading: loading,
        error: error,
    };
};
exports.useMasterData = useMasterData;
//# sourceMappingURL=useMasterData.js.map