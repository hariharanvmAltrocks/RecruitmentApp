"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOfficeViewerUrl = exports.buildWopiUrl = exports.isPdfUrl = exports.isSharePointUrl = exports.truncateText = exports.findMatricID = exports.fetchByMetricId = void 0;
exports.calculateTotalExperienceYears = calculateTotalExperienceYears;
exports.getcountryCode = getcountryCode;
var tslib_1 = require("tslib");
var ServiceExport_1 = require("../../services/ServiceExport");
var ConditionConfig_1 = require("../../utilities/ConditionConfig");
var Config_1 = require("../../utilities/Config");
var metricColumns_config_1 = require("../Screens/Dashboard/metricColumns.config");
var fetchByMetricId = function (matricID, EmailId, condition, roleIDs) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var updatedMetricId, configMap, config, configs, serviceCall, responses, result;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                updatedMetricId = matricID;
                if (matricID === ConditionConfig_1.MatricID.ReviewScoreCard) {
                    updatedMetricId = ConditionConfig_1.MatricID.ReviewScoredHOD;
                }
                configMap = (0, metricColumns_config_1.MetricQueryConfig)(EmailId);
                config = configMap[updatedMetricId];
                if (!config)
                    return [2 /*return*/, []];
                configs = Array.isArray(config) ? config : [config];
                serviceCall = function (listName, filter) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_a) {
                        if (roleIDs === null || roleIDs === void 0 ? void 0 : roleIDs.includes(Config_1.RoleID.FinanceDepartment)) {
                            filter = filter.filter(function (f) { return f.FilterKey !== "RecruitmentHR"; });
                        }
                        switch (listName) {
                            case Config_1.ListNames.HRMSNewPositionRequest:
                                return [2 /*return*/, ServiceExport_1.DashboardServices.GetNPAEPVRRDetails(filter, condition)];
                            case Config_1.ListNames.HRMSRecruitmentDptDetails:
                                return [2 /*return*/, ServiceExport_1.DashboardServices.GetRecruitmentDetails(filter, condition)];
                            case Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails:
                                return [2 /*return*/, ServiceExport_1.DashboardServices.GetCandidateDetails(filter, condition, matricID, EmailId)];
                            case Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD:
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
                                return [2 /*return*/, ServiceExport_1.DashboardServices.GetSelectedCandidate(filter, condition)];
                            default:
                                return [2 /*return*/, null];
                        }
                        return [2 /*return*/];
                    });
                }); };
                return [4 /*yield*/, Promise.all(configs.map(function (cfg) { return serviceCall(cfg.ListName, cfg.Filter); }))];
            case 1:
                responses = _a.sent();
                result = [];
                responses.forEach(function (res, index) {
                    if (res === null || res === void 0 ? void 0 : res.data) {
                        result.push.apply(result, res.data.map(function (item) { return (tslib_1.__assign(tslib_1.__assign({}, item), { __listName: configs[index].ListName })); }));
                    }
                });
                return [2 /*return*/, result];
        }
    });
}); };
exports.fetchByMetricId = fetchByMetricId;
function calculateTotalExperienceYears(experiences) {
    var totalMonths = 0;
    experiences.forEach(function (exp) {
        var startDate = new Date(exp.startFrom);
        var endDate;
        if (exp.endTo === "current date" || exp.isCurrent === 1 || !exp.endTo) {
            endDate = new Date(); // today
        }
        else {
            endDate = new Date(exp.endTo);
        }
        var months = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth());
        // If end day is before start day, reduce one month
        if (endDate.getDate() < startDate.getDate()) {
            months--;
        }
        totalMonths += months;
    });
    var years = Math.floor(totalMonths / 12);
    var months = totalMonths % 12;
    return "".concat(years, " years and ").concat(months, " months");
}
function getcountryCode(Code, refMobile) {
    if (!refMobile)
        return null;
    var _a = refMobile.split("-"), countryCode = _a[0], mobileNumber = _a[1];
    var country = Code.find(function (item) { return item.code === countryCode; });
    if (!country)
        return null;
    return "".concat(country.id, "-").concat(mobileNumber);
}
var findMatricID = function (roleIDs, statusID, TabName, MenuId) {
    if (TabName === ConditionConfig_1.TabNames.BackgroundVerification) {
        return ConditionConfig_1.MatricID.BackgroundCheck;
    }
    else if (TabName === ConditionConfig_1.TabNames.OfferLetterLabourHire) {
        return ConditionConfig_1.MatricID.LabourHire;
    }
    else if (TabName === ConditionConfig_1.TabNames.OfferLetterKSCA) {
        return ConditionConfig_1.MatricID.Kcsa;
    }
    else if (TabName === ConditionConfig_1.TabNames.MySubmission) {
        if (roleIDs.includes(Config_1.RoleID.RecruitmentHR)) {
            if (MenuId === ConditionConfig_1.menuID.RecruitmentProcess) {
                return ConditionConfig_1.MatricID.MySubmissionBGV;
            }
            else {
                return ConditionConfig_1.MatricID.MySubmissionHR;
            }
        }
        if (roleIDs.includes(Config_1.RoleID.LineManager)) {
            return ConditionConfig_1.MatricID.MySubmissionLM;
        }
        if (roleIDs.includes(Config_1.RoleID.HOD)) {
            return ConditionConfig_1.MatricID.MySubmissionHOD;
        }
        return ConditionConfig_1.MatricID.MySubmission;
    }
    else {
        switch (statusID) {
            case Config_1.StatusId.ReadyforRecruitmentProcess:
                return ConditionConfig_1.MatricID.AssignHr;
            case Config_1.StatusId.PendingUploadONEM:
                return ConditionConfig_1.MatricID.UploadONEM;
            case Config_1.StatusId.PendingUploadAdvert:
                return ConditionConfig_1.MatricID.JobAdvert;
            case Config_1.StatusId.PendingReviewAdvertHOD:
                return ConditionConfig_1.MatricID.AdvertReviewHOD;
            case Config_1.StatusId.PendingwithLineManagereviewAdv:
                return ConditionConfig_1.MatricID.AdvertReviewLM;
            case Config_1.StatusId.PendingInterviewquestion:
                return ConditionConfig_1.MatricID.InterviewQuestionHR;
            case Config_1.StatusId.CareerPortalQuestions:
                return ConditionConfig_1.MatricID.DisqualifiQuesLM;
            case Config_1.StatusId.InterviewScheduled:
            case Config_1.StatusId.InterviewScheduledforLevel2:
                return ConditionConfig_1.MatricID.EvalutionHR;
            case Config_1.StatusId.RecruitmentInProgress:
                if (TabName === ConditionConfig_1.TabNames.ReviewProfile) {
                    if (roleIDs.includes(Config_1.RoleID.RecruitmentHR)) {
                        return ConditionConfig_1.MatricID.ReviewProfileHR;
                    }
                    if (roleIDs.includes(Config_1.RoleID.LineManager)) {
                        return ConditionConfig_1.MatricID.ReviewProfileLM;
                    }
                    return 0;
                }
                if (TabName === ConditionConfig_1.TabNames.AssignInterviewPanel) {
                    return ConditionConfig_1.MatricID.AssignInterviewPanel;
                }
                if (TabName === ConditionConfig_1.TabNames.ReviewScorecard) {
                    return ConditionConfig_1.MatricID.ReviewScoreCard;
                }
                if (TabName === ConditionConfig_1.TabNames.AssignAgencies) {
                    return ConditionConfig_1.MatricID.AssignAgencies;
                }
                return 0;
            default:
                return ConditionConfig_1.MatricID.MySubmission;
        }
    }
};
exports.findMatricID = findMatricID;
var truncateText = function (text, maxLength) {
    if (!text)
        return "S";
    if (text.length <= maxLength)
        return text;
    var trimmed = text.slice(0, maxLength);
    return trimmed.slice(0, trimmed.lastIndexOf(" ")) + ".....";
};
exports.truncateText = truncateText;
var isSharePointUrl = function (url) {
    return /\.sharepoint\.com\//i.test(url);
};
exports.isSharePointUrl = isSharePointUrl;
var isPdfUrl = function (url) {
    var clean = url.split("?")[0].toLowerCase();
    return clean.endsWith(".pdf");
};
exports.isPdfUrl = isPdfUrl;
var buildWopiUrl = function (url) {
    try {
        var parsed = new URL(url);
        return "".concat(parsed.origin, "/_layouts/15/WopiFrame.aspx?sourcedoc=").concat(encodeURIComponent(url), "&action=embedview");
    }
    catch (_a) {
        return url;
    }
};
exports.buildWopiUrl = buildWopiUrl;
var buildOfficeViewerUrl = function (url) {
    return "https://view.officeapps.live.com/op/embed.aspx?src=".concat(encodeURIComponent(url));
};
exports.buildOfficeViewerUrl = buildOfficeViewerUrl;
//# sourceMappingURL=reusehooks.js.map