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
    (0, react_1.useEffect)(function () {
        if (!selectedJobCode || !enabled) {
            setData(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        var timer = setTimeout(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var filterConditions, response, items, mappedData, error_1;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            return tslib_1.__generator(this, function (_o) {
                switch (_o.label) {
                    case 0:
                        _o.trys.push([0, 2, , 3]);
                        filterConditions = [{ FilterKey: "JobCode", Operator: "eq", FilterValue: selectedJobCode }];
                        return [4 /*yield*/, ServiceExport_1.RecruitmentServices.GetHRMSRecruitmentRoleProfileDetails(filterConditions, "")];
                    case 1:
                        response = _o.sent();
                        if (response.status === 200 && response.data && response.data.length > 0) {
                            items = response.data[0];
                            mappedData = {
                                jobId: selectedJobCode.toString(),
                                english: {
                                    description: (items === null || items === void 0 ? void 0 : items.JobDescription) || "",
                                    responsibilities: JSON.parse((items === null || items === void 0 ? void 0 : items.RoleProfile) || "[]") || [],
                                    qualifications: ((_a = items === null || items === void 0 ? void 0 : items.qualificationValue) === null || _a === void 0 ? void 0 : _a.MinQualification.map(function (q) { return q.text; })) || [],
                                    PrefeQualification: ((_b = items === null || items === void 0 ? void 0 : items.qualificationValue) === null || _b === void 0 ? void 0 : _b.PrefeQualification.map(function (q) { return q.text; })) || [],
                                    experience: [
                                        (items === null || items === void 0 ? void 0 : items.YearofExperience) ? "".concat(items.YearofExperience, " years of experience") : "",
                                        (items === null || items === void 0 ? void 0 : items.PreferredExperience) ? "Preferred: ".concat(items.PreferredExperience.ExperienceInYearRange, " years") : "",
                                    ].filter(Boolean),
                                    RoleSpecificKnowledge: ((_c = items === null || items === void 0 ? void 0 : items.RoleSpeKnowledgeValue) === null || _c === void 0 ? void 0 : _c.map(function (k) { return k.text; })) || [],
                                    TechnicalSkills: ((_d = items === null || items === void 0 ? void 0 : items.TechnicalSkillValue) === null || _d === void 0 ? void 0 : _d.map(function (t) { return t.text; })) || [],
                                    JobFunctionalType: ((_e = items === null || items === void 0 ? void 0 : items.JobFunctionalType) === null || _e === void 0 ? void 0 : _e.text) || "",
                                    JobBasedBGVVerification: ((_f = items === null || items === void 0 ? void 0 : items.JobBasedBGVVerification) === null || _f === void 0 ? void 0 : _f.map(function (v) { return v.text; })) || [],
                                },
                                french: {
                                    description: (items === null || items === void 0 ? void 0 : items.JobDescription_fr) || "",
                                    responsibilities: JSON.parse((items === null || items === void 0 ? void 0 : items.RoleProfile) || "[]") || [],
                                    qualifications: ((_g = items === null || items === void 0 ? void 0 : items.qualificationValue) === null || _g === void 0 ? void 0 : _g.MinQualification_fr.map(function (q) { return q.text; })) || [],
                                    PrefeQualification: ((_h = items === null || items === void 0 ? void 0 : items.qualificationValue) === null || _h === void 0 ? void 0 : _h.PrefeQualification.map(function (q) { return q.text; })) || [],
                                    experience: [
                                        (items === null || items === void 0 ? void 0 : items.YearofExperience) ? "".concat(items.YearofExperience, " ans d'exp\u00E9rience") : "",
                                        (items === null || items === void 0 ? void 0 : items.PreferredExperience) ? "Pr\u00E9f\u00E9r\u00E9: ".concat(items.PreferredExperience.ExperienceInYearRange, " ans") : "",
                                    ].filter(Boolean),
                                    RoleSpecificKnowledge: ((_j = items === null || items === void 0 ? void 0 : items.RoleSpeKnowledgeValue) === null || _j === void 0 ? void 0 : _j.map(function (k) { return k.text; })) || [],
                                    TechnicalSkills: ((_k = items === null || items === void 0 ? void 0 : items.TechnicalSkillValue) === null || _k === void 0 ? void 0 : _k.map(function (t) { return t.text; })) || [],
                                    JobFunctionalType: ((_l = items === null || items === void 0 ? void 0 : items.JobFunctionalType) === null || _l === void 0 ? void 0 : _l.text) || "",
                                    JobBasedBGVVerification: ((_m = items === null || items === void 0 ? void 0 : items.JobBasedBGVVerification) === null || _m === void 0 ? void 0 : _m.map(function (v) { return v.text; })) || [],
                                },
                            };
                            setData(mappedData);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _o.sent();
                        console.error("Error fetching job details:", error_1);
                        return [3 /*break*/, 3];
                    case 3:
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        }); }, 700);
        return function () { return clearTimeout(timer); };
    }, [selectedJobCode, enabled]);
    return { data: data, loading: loading };
};
exports.useAdvertismentDetails = useAdvertismentDetails;
//# sourceMappingURL=getAdvertismentDetails.js.map