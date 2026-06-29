"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAdvertismentDetails = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var ServiceExport_1 = require("../../../../../services/ServiceExport");
var useAdvertismentDetails = function (selectedJobCode, options) {
    var _a;
    var _b = (0, react_1.useState)(null), data = _b[0], setData = _b[1];
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
    var enabled = (_a = options === null || options === void 0 ? void 0 : options.enabled) !== null && _a !== void 0 ? _a : true;
    var _d = (0, react_1.useState)({
        checkboxBGVOption: [],
        checkboxBGV: [],
        mantoryChecks: [],
    }), BGVValue = _d[0], setBGVValue = _d[1];
    // const mockMap = useMemo(
    //   () => ({
    //     "JOB-001": {
    //       jobId: "JOB-001",
    //       english: buildEnglish(),
    //       french: buildFrench(),
    //     },
    //     "JOB-002": {
    //       jobId: "JOB-002",
    //       english: {
    //         ...buildEnglish(),
    //         description: "Drive exploration programs and interpret geological data for strategic drilling decisions.",
    //       },
    //       french: {
    //         ...buildFrench(),
    //         description: "Piloter les programmes d'exploration et interprter les donnes gologiques pour orienter les forages.",
    //       },
    //     },
    //   }) as Record<string, AdvertismentDetails>,
    //   []
    // );
    var fetchBVData = function (response) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var res, BGVOPtions_1, RoleProfileRes, rawVerification, verificationList, resData_1, RoleBGV_1, mandatoryChecks_1, error_1;
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, ServiceExport_1.RecruitmentServices.GetBGVerificationType()];
                case 1:
                    res = _c.sent();
                    BGVOPtions_1 = res.data
                        .filter(function (check) { return !check.isDefault; })
                        .map(function (item, index) { return ({
                        id: index + 1,
                        key: item === null || item === void 0 ? void 0 : item.reference,
                        description: item === null || item === void 0 ? void 0 : item.displayText,
                        checked: item === null || item === void 0 ? void 0 : item.isDefault,
                    }); });
                    RoleProfileRes = (_a = response.data) !== null && _a !== void 0 ? _a : [];
                    rawVerification = RoleProfileRes === null || RoleProfileRes === void 0 ? void 0 : RoleProfileRes.JobBasedBGVVerification;
                    verificationList = Array.isArray(rawVerification)
                        ? rawVerification
                        : [];
                    resData_1 = (_b = res === null || res === void 0 ? void 0 : res.data) !== null && _b !== void 0 ? _b : [];
                    RoleBGV_1 = verificationList.flatMap(function (item, index) {
                        return resData_1
                            .filter(function (data) { return data.reference === item.verificationType; })
                            .map(function (data) { return ({
                            id: index + 1,
                            key: data.reference,
                            description: data.displayText,
                            checked: !!(item === null || item === void 0 ? void 0 : item.isDefault),
                        }); });
                    });
                    mandatoryChecks_1 = res.data
                        .filter(function (check) { return check.isDefault; })
                        .map(function (check, index) { return ({
                        id: String(index + 1),
                        label: check.displayText || "Unnamed Check",
                        key: check.reference,
                    }); });
                    setBGVValue(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { checkboxBGVOption: BGVOPtions_1, checkboxBGV: RoleBGV_1, mantoryChecks: mandatoryChecks_1 })); });
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _c.sent();
                    console.error("Error in OpenComments:", error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        if (!selectedJobCode || !enabled) {
            setData(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        var timer = setTimeout(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var filterConditions, response, items, mappedData, error_2;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
            return tslib_1.__generator(this, function (_s) {
                switch (_s.label) {
                    case 0:
                        _s.trys.push([0, 2, , 3]);
                        filterConditions = [
                            {
                                FilterKey: "JobCode/ID",
                                Operator: "eq",
                                FilterValue: selectedJobCode,
                            },
                        ];
                        return [4 /*yield*/, ServiceExport_1.RecruitmentServices.GetHRMSRecruitmentRoleProfileDetails(filterConditions, "")];
                    case 1:
                        response = _s.sent();
                        if (response.status === 200 &&
                            response.data &&
                            response.data.length > 0) {
                            items = response.data[0];
                            mappedData = {
                                jobId: selectedJobCode.toString(),
                                english: {
                                    description: (items === null || items === void 0 ? void 0 : items.JobDescription) || "",
                                    responsibilities: [items === null || items === void 0 ? void 0 : items.RolePurpose],
                                    qualifications: ((_a = items === null || items === void 0 ? void 0 : items.qualificationValue) === null || _a === void 0 ? void 0 : _a.MinQualification.map(function (q) { return q.text; })) || [],
                                    PrefeQualification: ((_b = items === null || items === void 0 ? void 0 : items.qualificationValue) === null || _b === void 0 ? void 0 : _b.PrefeQualification.map(function (q) { return q.text; })) || [],
                                    experience: [
                                        (items === null || items === void 0 ? void 0 : items.TotalExperience)
                                            ? "Total Experience: ".concat(items.TotalExperience.text)
                                            : "",
                                        (items === null || items === void 0 ? void 0 : items.ExperienceinMiningIndustry)
                                            ? "Preferred Experience: ".concat(items.ExperienceinMiningIndustry.text, " ")
                                            : "",
                                    ].filter(Boolean),
                                    RoleSpecificKnowledge: ((_c = items === null || items === void 0 ? void 0 : items.RoleSpeKnowledgeValue) === null || _c === void 0 ? void 0 : _c.map(function (k) { return k.RoleSpeKnowledge.text; })) || [],
                                    RequiredLevel: ((_d = items === null || items === void 0 ? void 0 : items.RoleSpeKnowledgeValue) === null || _d === void 0 ? void 0 : _d.map(function (k) { return k.RequiredLevel.text; })) || [],
                                    TechnicalSkills: ((_e = items === null || items === void 0 ? void 0 : items.TechnicalSkillValue) === null || _e === void 0 ? void 0 : _e.map(function (t) { return t.TechnicalSkills.text; })) || [],
                                    LevelProficiency: ((_f = items === null || items === void 0 ? void 0 : items.TechnicalSkillValue) === null || _f === void 0 ? void 0 : _f.map(function (t) { return t.LevelProficiency.text; })) || [],
                                    JobFunctionalType: ((_g = items === null || items === void 0 ? void 0 : items.JobFunctionalType) === null || _g === void 0 ? void 0 : _g.text)
                                        ? [items.JobFunctionalType.text]
                                        : [],
                                    JobBasedBGVVerification: ((_h = items === null || items === void 0 ? void 0 : items.JobBasedBGVVerification) === null || _h === void 0 ? void 0 : _h.map(function (v) { return v.text; })) || [],
                                },
                                french: {
                                    description: (items === null || items === void 0 ? void 0 : items.JobDescription_fr) || "",
                                    responsibilities: [items === null || items === void 0 ? void 0 : items.RolePurpose_fr],
                                    qualifications: ((_j = items === null || items === void 0 ? void 0 : items.qualificationValue) === null || _j === void 0 ? void 0 : _j.MinQualification_fr.map(function (q) { return q.text; })) || [],
                                    PrefeQualification: ((_k = items === null || items === void 0 ? void 0 : items.qualificationValue) === null || _k === void 0 ? void 0 : _k.PrefeQualification_fr.map(function (q) { return q.text; })) || [],
                                    experience: [
                                        (items === null || items === void 0 ? void 0 : items.TotalExperience)
                                            ? "exp\u00E9rience totale: ".concat(items === null || items === void 0 ? void 0 : items.TotalExperience.text)
                                            : "",
                                        (items === null || items === void 0 ? void 0 : items.ExperienceinMiningIndustry)
                                            ? "exp\u00E9rience Pr\u00E9f\u00E9r\u00E9: ".concat(items.ExperienceinMiningIndustry.text)
                                            : "",
                                    ].filter(Boolean),
                                    RoleSpecificKnowledge: ((_l = items === null || items === void 0 ? void 0 : items.RoleSpeKnowledgeValue) === null || _l === void 0 ? void 0 : _l.map(function (k) { return k.RoleSpeKnowledge_fr.text; })) || [],
                                    RequiredLevel: ((_m = items === null || items === void 0 ? void 0 : items.RoleSpeKnowledgeValue) === null || _m === void 0 ? void 0 : _m.map(function (k) { return k.RequiredLevel_fr.text; })) || [],
                                    TechnicalSkills: ((_o = items === null || items === void 0 ? void 0 : items.TechnicalSkillValue) === null || _o === void 0 ? void 0 : _o.map(function (t) { return t.TechnicalSkills_fr.text; })) || [],
                                    LevelProficiency: ((_p = items === null || items === void 0 ? void 0 : items.TechnicalSkillValue) === null || _p === void 0 ? void 0 : _p.map(function (t) { return t.LevelProficiency_fr.text; })) || [],
                                    JobFunctionalType: ((_q = items === null || items === void 0 ? void 0 : items.JobFunctionalType_fr) === null || _q === void 0 ? void 0 : _q.text)
                                        ? [items.JobFunctionalType_fr.text]
                                        : [],
                                    JobBasedBGVVerification: ((_r = items === null || items === void 0 ? void 0 : items.JobBasedBGVVerification) === null || _r === void 0 ? void 0 : _r.map(function (v) { return v.text; })) || [],
                                },
                            };
                            setData(mappedData);
                            void fetchBVData(response.data);
                        }
                        void fetchBVData(response.data);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _s.sent();
                        console.error("Error fetching job details:", error_2);
                        return [3 /*break*/, 3];
                    case 3:
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        }); }, 700);
        return function () { return clearTimeout(timer); };
    }, [selectedJobCode, enabled]);
    var handleBvgToggle = (0, react_1.useCallback)(function (id) {
        setBGVValue(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { checkboxBGVOption: prev.checkboxBGVOption.map(function (check) {
                return String(check.id) === String(id)
                    ? tslib_1.__assign(tslib_1.__assign({}, check), { checked: !check.checked }) : check;
            }) })); });
    }, [BGVValue]);
    return { data: data, BGVValue: BGVValue, loading: loading, handleBvgToggle: handleBvgToggle };
};
exports.useAdvertismentDetails = useAdvertismentDetails;
//# sourceMappingURL=getAdvertismentDetails.js.map