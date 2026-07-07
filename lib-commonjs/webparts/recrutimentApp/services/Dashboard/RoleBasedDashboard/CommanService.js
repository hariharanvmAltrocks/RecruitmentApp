"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeniorHRBuildTasks = exports.BuildSeniorHRMonthlyTracker = exports.conflictOfInterestAlerts = exports.BuildHRLeadSource = exports.BuildCandidatePipeLine = exports.BuildHRMonthlyTracker = exports.BuildDepartmentDetails = exports.BuildPositionDetails = exports.BuildPositionSource = exports.BuildHRLeadSummary = exports.BuildTasks = exports.LMBuildApprovals = exports.HODBuildApprovals = exports.BuildPositionStatus = exports.BuildHRSummary = exports.BuildJobRoleSummary = exports.BuildMonthlyTracker = exports.SeniorHRBuildSummary = exports.HRBuildSummary = exports.HODBuildSummary = exports.GetSelectedCandiadtesData = exports.GetCandidateData = exports.GetRecruitmentData = exports.GetOpenRecruitmentData = void 0;
var tslib_1 = require("tslib");
var moment_1 = tslib_1.__importDefault(require("moment"));
var Config_1 = require("../../../utilities/Config");
var spservice_1 = tslib_1.__importDefault(require("../../SPService/spservice"));
var ServiceExport_1 = require("../../ServiceExport");
var DashboardConfig_1 = require("./DashboardConfig");
var CareerPortalAPI_1 = require("../../AxiosService/CareerPortalAPI");
var GetOpenRecruitmentData = function (email, FilterColumnName) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, spservice_1.default.batchGet([
                    {
                        StateValue: 1,
                        ListName: Config_1.ListNames.HRMSRecruitmentDeptOpenings,
                        select: ["*", "Department/DepartmentName"],
                        expand: ["Department"],
                    },
                    {
                        StateValue: 2,
                        ListName: Config_1.ListNames.HRMSRecruitmentDptDetails,
                        select: [
                            "*",
                            "JobCode/JobCode",
                            "JobCode/JobTitleInEnglish",
                            "JobCode/ID",
                            "Department/DepartmentName",
                            "Status/StatusDescription",
                        ],
                        //    Filter: [
                        //     {
                        //         FilterKey: FilterColumnName,
                        //         Operator: "eq",
                        //         FilterValue: email
                        //     }
                        // ],
                        expand: ["JobCode", "Department", "Status"]
                    },
                ])];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.GetOpenRecruitmentData = GetOpenRecruitmentData;
var GetRecruitmentData = function (email, FilterColumnName) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, spservice_1.default.SPReadItems({
                    Listname: Config_1.ListNames.HRMSRecruitmentDptDetails,
                    Select: "\n            *,\n            JobCode/JobCode,\n            JobCode/JobTitleInEnglish,\n            Department/DepartmentName,\n            Status/StatusDescription\n        ",
                    Expand: "JobCode,Department,Status",
                    Filter: [
                        {
                            FilterKey: FilterColumnName,
                            Operator: "eq",
                            FilterValue: email
                        }
                    ],
                    Topcount: 5000
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.GetRecruitmentData = GetRecruitmentData;
var GetCandidateData = function (recruitments) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var ids;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ids = recruitments.map(function (x) { return x.ID; });
                if (!ids.length)
                    return [2 /*return*/, []];
                return [4 /*yield*/, spservice_1.default.SPReadItems({
                        Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                        Select: "*",
                        Filter: [
                            {
                                FilterKey: "RecruitmentIDId",
                                Operator: "in",
                                FilterValue: ids
                            }
                        ],
                        Topcount: 5000
                    })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.GetCandidateData = GetCandidateData;
var GetSelectedCandiadtesData = function (candidates) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var ids;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ids = candidates.map(function (x) { return x.ID; });
                if (!ids.length)
                    return [2 /*return*/, []];
                return [4 /*yield*/, spservice_1.default.SPReadItems({
                        Listname: Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD,
                        Select: "*",
                        Filter: [
                            {
                                FilterKey: "CandidateIDId",
                                Operator: "in",
                                FilterValue: ids
                            }
                        ],
                        Topcount: 5000
                    })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.GetSelectedCandiadtesData = GetSelectedCandiadtesData;
var HODBuildSummary = function (recruitments, candidates) {
    var total = recruitments.length;
    var filled = recruitments.filter(function (x) {
        return Number(x.StatusId) === Config_1.StatusId.Onboarded;
    }).length;
    var open = total - filled;
    var active = candidates.filter(function (x) {
        return Number(x.StatusId) !== Config_1.StatusId.Onboarded;
    }).length;
    var pending = candidates.filter(function (x) {
        return Number(x.StatusId) === Config_1.StatusId.InterviewInProcess ||
            Number(x.StatusId) === Config_1.StatusId.InterviewLevel1InProgress ||
            Number(x.StatusId) === Config_1.StatusId.InterviewLevel2InProgress ||
            Number(x.StatusId) === Config_1.StatusId.PendingwithpositionIDAssignmentWithHOD ||
            Number(x.StatusId) === Config_1.StatusId.pendingL2shorlistingwithHOD ||
            Number(x.StatusId) === Config_1.StatusId.CandidateOnHoldbyHODLevel1 ||
            Number(x.StatusId) === Config_1.StatusId.CandidateOnHoldbyHODLevel2 ||
            Number(x.StatusId) === Config_1.StatusId.OnHoldbyHOD;
    }).length;
    var interviewsThisMonthCount = candidates.filter(function (c) {
        var isCurrentMonth = (c.InterviewDate && (0, moment_1.default)(c.InterviewDate).isSame((0, moment_1.default)(), "month")) ||
            (c.InterviewDateLevel2 && (0, moment_1.default)(c.InterviewDateLevel2).isSame((0, moment_1.default)(), "month"));
        var isValidStatus = [
            Config_1.StatusId.InterviewInProcess,
            Config_1.StatusId.InterviewLevel1InProgress,
            Config_1.StatusId.InterviewLevel2InProgress,
        ].includes(Number(c.StatusId));
        return isCurrentMonth && isValidStatus;
    }).length;
    return [
        {
            id: "total",
            title: "Total Positions",
            value: total,
            trendText: "".concat(filled, " Filled"),
            trendType: "success",
            iconName: "Users"
        },
        {
            id: "filled",
            title: "Filled Positions",
            value: filled,
            trendText: "".concat(Math.round(filled / total * 100), "%"),
            trendType: "success",
            iconName: "UserCheck"
        },
        {
            id: "open",
            title: "Open Positions",
            value: open,
            trendText: "".concat(open, " Remaining"),
            trendType: "danger",
            iconName: "Briefcase"
        },
        {
            id: "candidate",
            title: "Active Candidates",
            value: active,
            trendText: "In Process",
            trendType: "warning",
            iconName: "Users"
        },
        {
            id: "Interview",
            title: "Interviews This Month",
            value: interviewsThisMonthCount,
            trendText: "Scheduled Interviews",
            trendType: "neutral",
            iconName: "Users"
        },
    ];
};
exports.HODBuildSummary = HODBuildSummary;
var HRBuildSummary = function (recruitments, candidates) {
    var total = recruitments.length;
    var filled = recruitments.filter(function (x) {
        return Number(x.StatusId) === Config_1.StatusId.Onboarded;
    }).length;
    var open = total - filled;
    var active = candidates.filter(function (x) {
        return Number(x.StatusId) !== Config_1.StatusId.Onboarded ||
            Number(x.StatusId) !== Config_1.StatusId.RejectedbyHOD ||
            Number(x.StatusId) !== Config_1.StatusId.CandidateRejectedbyHODLevel1 ||
            Number(x.StatusId) !== Config_1.StatusId.CandidateRejectedbyHODLevel2;
    }).length;
    var interviewsThisMonthCount = candidates.filter(function (c) {
        var isCurrentMonth = (c.InterviewDate && (0, moment_1.default)(c.InterviewDate).isSame((0, moment_1.default)(), "month")) ||
            (c.InterviewDateLevel2 && (0, moment_1.default)(c.InterviewDateLevel2).isSame((0, moment_1.default)(), "month"));
        var isValidStatus = [
            Config_1.StatusId.InterviewInProcess,
            Config_1.StatusId.InterviewLevel1InProgress,
            Config_1.StatusId.InterviewLevel2InProgress,
        ].includes(Number(c.StatusId));
        return isCurrentMonth && isValidStatus;
    }).length;
    return [
        {
            id: "total",
            title: "Total Positions",
            value: total,
            trendText: "".concat(filled, " Filled"),
            trendType: "success",
            iconName: "Users"
        },
        {
            id: "filled",
            title: "Filled Positions",
            value: filled,
            trendText: "".concat(Math.round(filled / total * 100), "%"),
            trendType: "success",
            iconName: "UserCheck"
        },
        {
            id: "open",
            title: "Open Positions",
            value: open,
            trendText: "".concat(open, " Remaining"),
            trendType: "danger",
            iconName: "Briefcase"
        },
        {
            id: "candidate",
            title: "Active Candidates",
            value: active,
            trendText: "In Process",
            trendType: "warning",
            iconName: "Users"
        },
        {
            id: "Interview",
            title: "Interviews This Month",
            value: interviewsThisMonthCount,
            trendText: "Scheduled Interviews",
            trendType: "neutral",
            iconName: "Users"
        },
    ];
};
exports.HRBuildSummary = HRBuildSummary;
var SeniorHRBuildSummary = function (openrecruitment, recruitments, candidates) {
    var filteredOpenRecruitment = openrecruitment.filter(function (item) {
        return (0, DashboardConfig_1.isFiveMonthsBeforeCurrent)(item === null || item === void 0 ? void 0 : item.DateRequried);
    });
    var total = recruitments.length + filteredOpenRecruitment.length;
    var filled = recruitments.filter(function (x) {
        return Number(x.StatusId) === Config_1.StatusId.Onboarded;
    }).length;
    var open = total - filled;
    var HRLeads = Object.keys((0, DashboardConfig_1.groupedHRLead)(recruitments)).length;
    var HR = Object.keys((0, DashboardConfig_1.groupedHR)(recruitments)).length;
    var COICandidate = candidates.filter(function (item) { return item.ConflictsOfInterest === "Yes"; }).length;
    return [
        {
            id: "total",
            title: "Total Positions",
            value: total,
            trendText: "".concat(filled, " Filled"),
            trendType: "success",
            iconName: "Users"
        },
        {
            id: "filled",
            title: "Filled Positions",
            value: filled,
            trendText: "".concat(total > 0 ? Math.round((filled / total) * 100) : 0, "%"),
            trendType: "success",
            iconName: "UserCheck"
        },
        {
            id: "open",
            title: "Open Positions",
            value: open,
            trendText: "".concat(open, " Remaining"),
            trendType: "danger",
            iconName: "Briefcase"
        },
        {
            id: "candidate",
            title: "Total Recruitment HR Leads",
            value: HRLeads,
            trendText: "Active HR lead Team",
            trendType: "warning",
            iconName: "Users"
        },
        {
            id: "Interview",
            title: "Recruitment HR",
            value: HR,
            trendText: "Active HR Team",
            trendType: "neutral",
            iconName: "Users"
        },
        {
            id: "conflictOfInterest",
            title: "conflictOfInterest",
            value: COICandidate,
            trendText: "Requires Review",
            trendType: "neutral",
            iconName: "Users"
        },
    ];
};
exports.SeniorHRBuildSummary = SeniorHRBuildSummary;
var BuildMonthlyTracker = function (recruitments) {
    var tracker = [];
    var _loop_1 = function (i) {
        var targetMonth = (0, moment_1.default)().subtract(i, "months");
        var monthLabel = targetMonth.format("MMM YYYY");
        var totalInMonth = recruitments.filter(function (item) {
            return item.Created && (0, moment_1.default)(item.DateRequried).isSameOrBefore(targetMonth, "month");
        }).length;
        var filledInMonth = recruitments.filter(function (c) {
            return Number(c.StatusId) === Config_1.StatusId.Onboarded && c.Modified && (0, moment_1.default)(c.Modified).isSameOrBefore(targetMonth, "month");
        }).length;
        var openInMonth = Math.max(0, totalInMonth - filledInMonth);
        // const month =
        //     moment().subtract(i, "months");
        // const total =
        //     recruitments.filter(x =>
        //         moment(x.DateRequried)
        //             .isSameOrBefore(month, "month")
        //     ).length;
        // const filled =
        //     recruitments.filter(x =>
        //         Number(x.StatusId) === StatusId.Onboarded &&
        //         moment(x.Modified)
        //             .isSameOrBefore(month, "month")
        //     ).length;
        tracker.push({
            month: monthLabel,
            totalPositions: totalInMonth,
            positionsFilled: filledInMonth,
            openPositions: openInMonth
        });
    };
    for (var i = 5; i >= 0; i--) {
        _loop_1(i);
    }
    return tracker;
};
exports.BuildMonthlyTracker = BuildMonthlyTracker;
var BuildJobRoleSummary = function (recruitments, candidates) {
    var map = new Map();
    recruitments.forEach(function (recruitment) {
        var _a, _b;
        var role = (_b = (_a = recruitment.JobCode) === null || _a === void 0 ? void 0 : _a.JobTitleInEnglish) !== null && _b !== void 0 ? _b : "Unknown";
        var recruitmentId = recruitment.ID;
        // All candidates for this recruitment
        var recruitmentCandidates = candidates.filter(function (c) { return Number(c.RecruitmentIDId) === recruitmentId; });
        // Filled Candidates
        var filled = recruitmentCandidates.filter(function (c) { return Number(c.StatusId) === Config_1.StatusId.Onboarded; }).length;
        var total = Number(recruitment.NumberOfPersonNeeded) || 1;
        if (!map.has(role)) {
            map.set(role, {
                jobRole: role,
                total: 0,
                filled: 0,
                open: 0,
                percentage: 0
            });
        }
        var current = map.get(role);
        current.total += total;
        current.filled += filled;
    });
    return Array.from(map.values()).map(function (item) { return (tslib_1.__assign(tslib_1.__assign({}, item), { open: Math.max(0, item.total - item.filled), percentage: item.total > 0
            ? Math.round((item.filled / item.total) * 100)
            : 0 })); });
};
exports.BuildJobRoleSummary = BuildJobRoleSummary;
var BuildHRSummary = function (recruitments) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var map, _i, recruitments_1, item, user, hrName, jobTitle, current;
    var _a, _b, _c;
    return tslib_1.__generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                map = new Map();
                _i = 0, recruitments_1 = recruitments;
                _d.label = 1;
            case 1:
                if (!(_i < recruitments_1.length)) return [3 /*break*/, 4];
                item = recruitments_1[_i];
                return [4 /*yield*/, ServiceExport_1.CommonServices.GetUserName(item.AssignedHR)];
            case 2:
                user = _d.sent();
                hrName = (_a = user.data) !== null && _a !== void 0 ? _a : "Unknown";
                jobTitle = (_c = (_b = item.JobCode) === null || _b === void 0 ? void 0 : _b.JobTitleInEnglish) !== null && _c !== void 0 ? _c : "";
                if (!map.has(hrName)) {
                    map.set(hrName, {
                        HRName: hrName,
                        JobTitle: jobTitle,
                        openPositions: 0,
                        filledPositions: 0
                    });
                }
                current = map.get(hrName);
                if (Number(item.StatusId) === Config_1.StatusId.Onboarded) {
                    current.filledPositions++;
                }
                else {
                    current.openPositions++;
                }
                _d.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, Array.from(map.values())];
        }
    });
}); };
exports.BuildHRSummary = BuildHRSummary;
var BuildPositionStatus = function (recruitments) {
    var status = {
        OnTrack: 0,
        atRisk: 0,
        overduecount: 0,
        dueLast7days: 0,
        total: recruitments.length
    };
    recruitments.forEach(function (item) {
        var diff = (0, DashboardConfig_1.getMonthDifference)(new Date(), new Date(item.DateRequried));
        if (diff < 0)
            status.overduecount++;
        else if (diff <= 2)
            status.atRisk++;
        else
            status.OnTrack++;
    });
    return status;
};
exports.BuildPositionStatus = BuildPositionStatus;
var HODBuildApprovals = function (recruitments, candidate) {
    var assignpositionID = candidate.filter(function (x) {
        return Number(x.StatusId) === Config_1.StatusId.PendingwithpositionIDAssignmentWithHOD ||
            Number(x.StatusId) === Config_1.StatusId.pendingL2shorlistingwithHOD ||
            Number(x.StatusId) === Config_1.StatusId.CandidateOnHoldbyHODLevel1 ||
            Number(x.StatusId) === Config_1.StatusId.CandidateOnHoldbyHODLevel2 ||
            Number(x.StatusId) === Config_1.StatusId.OnHoldbyHOD;
    });
    var evalution = candidate.filter(function (x) {
        return Number(x.StatusId) === Config_1.StatusId.InterviewInProcess ||
            Number(x.StatusId) === Config_1.StatusId.InterviewLevel1InProgress ||
            Number(x.StatusId) === Config_1.StatusId.InterviewLevel2InProgress;
    });
    var today = new Date();
    var AdvertExtension = recruitments.filter(function (x) {
        var d1 = x.JobPostingEndDate ? new Date(x.JobPostingEndDate) : null;
        var d2 = x.JobPostingFirstExtensionEndDate ? new Date(x.JobPostingFirstExtensionEndDate) : null;
        var d3 = x.JobPostingSecondExtensionEndDate ? new Date(x.JobPostingSecondExtensionEndDate) : null;
        return (d1 && d1 < today) || (d2 && d2 < today) || (d3 && d3 < today);
    });
    return [
        { id: 1, requestType: "Assign Position ID ", count: assignpositionID.length },
        { id: 2, requestType: "Evalution", count: evalution.length },
        { id: 3, requestType: "Advert Extension", count: AdvertExtension.length }
    ];
};
exports.HODBuildApprovals = HODBuildApprovals;
var LMBuildApprovals = function (recruitments, candidate) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var reviewadvert, evalution, allJobCodeIds, portalItems, jobCodeIdToUniqueKey, ScreeningCount, params, response, apiData;
    var _a;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                reviewadvert = recruitments.filter(function (x) {
                    return Number(x.StatusId) === Config_1.StatusId.PendingwithLineManagereviewAdv ||
                        Number(x.StatusId) === Config_1.StatusId.CareerPortalQuestions;
                });
                evalution = candidate.filter(function (x) {
                    return Number(x.StatusId) === Config_1.StatusId.InterviewInProcess ||
                        Number(x.StatusId) === Config_1.StatusId.InterviewLevel1InProgress ||
                        Number(x.StatusId) === Config_1.StatusId.InterviewLevel2InProgress;
                });
                allJobCodeIds = recruitments.map(function (item) { return item.JobCodeId; }).filter(Boolean);
                portalItems = [];
                if (!(allJobCodeIds.length > 0)) return [3 /*break*/, 2];
                return [4 /*yield*/, spservice_1.default.SPReadItems({
                        Listname: Config_1.ListNames.RecruitAppCareerPortalIntegration,
                        Select: "*,JobCode/JobCode",
                        Filter: [
                            { FilterKey: "JobCodeId", Operator: "in", FilterValue: allJobCodeIds },
                        ],
                        FilterCondition: "and",
                        Expand: "JobCode",
                        Topcount: 5000,
                        Orderby: "ID",
                        Orderbydecorasc: true,
                    })];
            case 1:
                portalItems = (_b.sent());
                _b.label = 2;
            case 2:
                jobCodeIdToUniqueKey = portalItems.map(function (item) { return item.JobUniqueKey; }).filter(Boolean);
                ScreeningCount = 0;
                if (!(jobCodeIdToUniqueKey.length > 0)) return [3 /*break*/, 4];
                params = {
                    jobCodes: jobCodeIdToUniqueKey,
                    workflowStatus: [
                        Config_1.workflowStatusApi.LineManagerL1Pending,
                        Config_1.workflowStatusApi.LineManagerL2Pending,
                        Config_1.workflowStatusApi.HROnHold,
                        Config_1.workflowStatusApi.LineManagerLevel1OnHold,
                        Config_1.workflowStatusApi.LineManagerLevel2OnHold,
                    ],
                };
                return [4 /*yield*/, CareerPortalAPI_1.getProfileData.GetJobAppliedCount(params)];
            case 3:
                response = _b.sent();
                apiData = Array.isArray((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.data) ? response.data.data : [];
                ScreeningCount = apiData.reduce(function (total, item) {
                    var _a, _b;
                    return ((_a = item.workflowStatus) === null || _a === void 0 ? void 0 : _a.some(function (status) { return [
                        Config_1.workflowStatusApi.LineManagerL1Pending,
                        Config_1.workflowStatusApi.LineManagerL2Pending,
                        Config_1.workflowStatusApi.LineManagerLevel1OnHold,
                        Config_1.workflowStatusApi.LineManagerLevel2OnHold,
                    ].includes(status); }))
                        ? total + ((_b = item.count) !== null && _b !== void 0 ? _b : 0)
                        : total;
                }, 0);
                _b.label = 4;
            case 4: return [2 /*return*/, [
                    { id: 1, requestType: "Review Advert and Minimum critia quesion", count: reviewadvert.length },
                    { id: 2, requestType: "Level 2 Screening shortlisting", count: ScreeningCount },
                    { id: 3, requestType: "Evalution", count: evalution.length }
                ]];
        }
    });
}); };
exports.LMBuildApprovals = LMBuildApprovals;
var BuildTasks = function (recruitments, Selectedcandidate) {
    return recruitments.map(function (item, index) {
        var _a, _b, _c, _d, _e, _f;
        var dateValue = item.DateRequried;
        var dayaLeft = "0";
        if (dateValue) {
            var target = new Date(dateValue);
            if (!isNaN(target.getTime())) {
                var diffMs = target.getTime() - new Date().getTime();
                var diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                dayaLeft = diffDays > 0 ? "".concat(diffDays) : "0";
            }
        }
        var onboardedCandidatesCount = Selectedcandidate.filter(function (c) { return Number(c.StatusId) === Config_1.StatusId.Onboarded; }).length;
        var vacant = String(Math.max(0, Number(item.NumberOfPersonNeeded) - onboardedCandidatesCount));
        var Positionstatus = "On Track";
        if (dateValue) {
            var target = new Date(dateValue);
            if (!isNaN(target.getTime())) {
                var diff = (0, DashboardConfig_1.getMonthDifference)(DashboardConfig_1.currentDate, target);
                if (diff < 0)
                    Positionstatus = "Overdue";
                else if (diff <= 2)
                    Positionstatus = "At Risk";
            }
        }
        return {
            id: index + 1,
            JobCode: (_b = (_a = item.JobCode) === null || _a === void 0 ? void 0 : _a.JobCode) !== null && _b !== void 0 ? _b : "",
            Jobtitle: (_d = (_c = item.JobCode) === null || _c === void 0 ? void 0 : _c.JobTitleInEnglish) !== null && _d !== void 0 ? _d : "",
            department: (_f = (_e = item.Department) === null || _e === void 0 ? void 0 : _e.DepartmentName) !== null && _f !== void 0 ? _f : "",
            dateRequired: dateValue
                ? new Date(dateValue).toLocaleDateString("en-GB")
                : "",
            headcount: String(item.NumberOfPersonNeeded || 1),
            filledcount: String(onboardedCandidatesCount),
            vacant: vacant,
            dayaLeft: dayaLeft,
            Positionstatus: Positionstatus,
        };
    });
};
exports.BuildTasks = BuildTasks;
var BuildHRLeadSummary = function (OpenRecruitment, recruitmentProcess) {
    var currentMonthOpenings = OpenRecruitment.filter(function (item) {
        return (0, DashboardConfig_1.isFiveMonthsBeforeCurrent)(item === null || item === void 0 ? void 0 : item.DateRequried);
    });
    var TotalOpenPosition = currentMonthOpenings.length;
    var RecruitmentInProgress = recruitmentProcess.filter(function (item) { return Number(item.StatusId) !== Config_1.StatusId.Onboarded; }).length;
    var Onboarding = recruitmentProcess.filter(function (item) { return Number(item.StatusId) === Config_1.StatusId.Onboarded; }).length;
    var OnemDocumentStage = recruitmentProcess.filter(function (item) { return Number(item.StatusId) === Config_1.StatusId.PendingUploadONEM; }).length;
    var Duemonth = {
        Jan: (0, DashboardConfig_1.getDueMonthRatio)(0, recruitmentProcess),
        Feb: (0, DashboardConfig_1.getDueMonthRatio)(1, recruitmentProcess),
        Mar: (0, DashboardConfig_1.getDueMonthRatio)(2, recruitmentProcess),
        Apr: (0, DashboardConfig_1.getDueMonthRatio)(3, recruitmentProcess),
        May: (0, DashboardConfig_1.getDueMonthRatio)(4, recruitmentProcess),
        June: (0, DashboardConfig_1.getDueMonthRatio)(5, recruitmentProcess),
        July: (0, DashboardConfig_1.getDueMonthRatio)(6, recruitmentProcess),
        Aug: (0, DashboardConfig_1.getDueMonthRatio)(7, recruitmentProcess),
        Sep: (0, DashboardConfig_1.getDueMonthRatio)(8, recruitmentProcess),
        Oct: (0, DashboardConfig_1.getDueMonthRatio)(9, recruitmentProcess),
        Nov: (0, DashboardConfig_1.getDueMonthRatio)(10, recruitmentProcess),
        Dec: (0, DashboardConfig_1.getDueMonthRatio)(11, recruitmentProcess),
    };
    var overduecountCount = 0;
    recruitmentProcess.forEach(function (item) {
        if (Number(item.StatusId) === Config_1.StatusId.Onboarded)
            return;
        var dateValue = item.DateRequried;
        var targetDate = new Date(dateValue);
        var diffMonths = (0, DashboardConfig_1.getMonthDifference)(DashboardConfig_1.currentDate, targetDate);
        if (diffMonths < 0) {
            overduecountCount++;
        }
    });
    var OverDuePosition = overduecountCount;
    return {
        TotalOpenPosition: TotalOpenPosition,
        RecruitmentInProgress: RecruitmentInProgress,
        Onboarding: Onboarding,
        OnemDocumentStage: OnemDocumentStage,
        Duemonth: Duemonth,
        OverDuePosition: OverDuePosition
    };
};
exports.BuildHRLeadSummary = BuildHRLeadSummary;
var BuildPositionSource = function (recruitmentProcess) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(Object.entries((0, DashboardConfig_1.groupedHR)(recruitmentProcess)).map(function (_a) {
                    var email = _a[0], val = _a[1];
                    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                        var records, total, done, pending, hrName;
                        return tslib_1.__generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    records = val;
                                    total = records.length;
                                    done = records.filter(function (x) { return x.Status === "Completed"; }).length;
                                    pending = total - done;
                                    return [4 /*yield*/, ServiceExport_1.CommonServices.GetUserName(email)];
                                case 1:
                                    hrName = _b.sent();
                                    return [2 /*return*/, {
                                            name: hrName.data,
                                            avatarText: hrName.data.substring(0, 2).toUpperCase(),
                                            avatarTheme: "blue",
                                            positionsCount: total,
                                            percentage: total ? Math.round((done * 100) / total) : 0,
                                            pending: pending,
                                            done: done,
                                            total: total
                                        }];
                            }
                        });
                    });
                }))];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.BuildPositionSource = BuildPositionSource;
var BuildPositionDetails = function (recruitments, candidateDetails) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(recruitments.map(function (item, index) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                    var dateValue, dayaLeft, target, diffMs, diffDays, onboardedCandidatesCount, vacant, Positionstatus, target, diff, hrName;
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    return tslib_1.__generator(this, function (_j) {
                        switch (_j.label) {
                            case 0:
                                dateValue = item.DateRequried;
                                dayaLeft = "0";
                                if (dateValue) {
                                    target = new Date(dateValue);
                                    if (!isNaN(target.getTime())) {
                                        diffMs = target.getTime() - new Date().getTime();
                                        diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                                        dayaLeft = diffDays > 0 ? "".concat(diffDays) : "0";
                                    }
                                }
                                onboardedCandidatesCount = candidateDetails.filter(function (c) {
                                    return c.JobCodeId === item.JobCodeId &&
                                        Number(c.StatusId) === Config_1.StatusId.Onboarded;
                                }).length;
                                vacant = String(Math.max(0, (item.NumberOfPersonNeeded || 1) - onboardedCandidatesCount));
                                Positionstatus = "On Track";
                                if (dateValue) {
                                    target = new Date(dateValue);
                                    if (!isNaN(target.getTime())) {
                                        diff = (0, DashboardConfig_1.getMonthDifference)(DashboardConfig_1.currentDate, target);
                                        if (diff < 0)
                                            Positionstatus = "Overdue";
                                        else if (diff <= 2)
                                            Positionstatus = "At Risk";
                                    }
                                }
                                return [4 /*yield*/, ServiceExport_1.CommonServices.GetUserName(item === null || item === void 0 ? void 0 : item.AssignedHR)];
                            case 1:
                                hrName = _j.sent();
                                return [2 /*return*/, {
                                        id: index + 1,
                                        JobCode: (_b = (_a = item.JobCode) === null || _a === void 0 ? void 0 : _a.JobCode) !== null && _b !== void 0 ? _b : "",
                                        Jobtitle: (_d = (_c = item.JobCode) === null || _c === void 0 ? void 0 : _c.JobTitleInEnglish) !== null && _d !== void 0 ? _d : "",
                                        department: (_f = (_e = item.Department) === null || _e === void 0 ? void 0 : _e.DepartmentName) !== null && _f !== void 0 ? _f : "",
                                        dateRequired: dateValue ? new Date(dateValue).toLocaleDateString("en-GB") : "",
                                        headcount: String(item.NumberOfPersonNeeded || 1),
                                        filledcount: "0",
                                        vacant: vacant,
                                        assignHR: (_g = hrName.data) !== null && _g !== void 0 ? _g : "N/A",
                                        dayaLeft: dayaLeft,
                                        Positionstatus: Positionstatus,
                                        nationality: item.Nationality || "N/A",
                                        status: ((_h = item.Status) === null || _h === void 0 ? void 0 : _h.StatusDescription) || "N/A",
                                        statusId: Number(item.StatusId) || 0
                                    }];
                        }
                    });
                }); }))];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.BuildPositionDetails = BuildPositionDetails;
var BuildDepartmentDetails = function (recruitments) {
    var departmentMap = new Map();
    recruitments.forEach(function (item) {
        var _a;
        var deptName = ((_a = item.Department) === null || _a === void 0 ? void 0 : _a.DepartmentName) || "General";
        if (!departmentMap.has(deptName)) {
            departmentMap.set(deptName, { total: 0, filled: 0 });
        }
        var currentDept = departmentMap.get(deptName);
        currentDept.total += (Number(item.NumberOfPersonNeeded) || 1);
        var deptFilled = Number(item.StatusId) === Config_1.StatusId.Onboarded;
        currentDept.filled += deptFilled ? 1 : 0;
    });
    return Array.from(departmentMap.entries()).map(function (_a) {
        var deptName = _a[0], counts = _a[1];
        var total = Number(counts.total);
        var filled = Number(counts.filled);
        var open = Math.max(0, total - filled);
        var filledPercentage = total ? Math.round((filled / total) * 100 * 10) / 10 : 0;
        return {
            department: deptName,
            total: total,
            filled: filled,
            open: open,
            filledPercentage: filledPercentage
        };
    });
};
exports.BuildDepartmentDetails = BuildDepartmentDetails;
var BuildHRMonthlyTracker = function (recruitments) {
    var tracker = [];
    var _loop_2 = function (i) {
        var targetMonth = (0, moment_1.default)().subtract(i, "months");
        var monthLabel = targetMonth.format("MMM YYYY");
        var totalInMonth = recruitments.filter(function (item) {
            return item.Created && (0, moment_1.default)(item.DateRequried).isSameOrBefore(targetMonth, "month");
        }).length;
        var filledInMonth = recruitments.filter(function (c) {
            return Number(c.StatusId) === Config_1.StatusId.Onboarded && c.Modified && (0, moment_1.default)(c.Modified).isSameOrBefore(targetMonth, "month");
        }).length;
        var openInMonth = Math.max(0, totalInMonth - filledInMonth);
        tracker.push({
            month: monthLabel,
            totalPositions: totalInMonth,
            positionsFilled: filledInMonth,
            openPositions: openInMonth
        });
    };
    for (var i = 5; i >= 0; i--) {
        _loop_2(i);
    }
    return tracker;
};
exports.BuildHRMonthlyTracker = BuildHRMonthlyTracker;
var BuildCandidatePipeLine = function (recruitments, candidates, selectedcandidate) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var allJobCodeIds, portalItems, jobCodeIdToUniqueKey, ScreeningCount, AppliedCount, params, response, apiData, InterviewCount, BackgroundCheckCount, ResiProcessCount, MedicalScreeningCount, OfferCount, EmploymentContractCount, OnboardingInProcessCount, OnboardingCompletedCount, pipelineStages, totalCandidates, candidatePipeline;
    var _a;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                allJobCodeIds = recruitments.map(function (item) { return item.JobCodeId; }).filter(Boolean);
                portalItems = [];
                if (!(allJobCodeIds.length > 0)) return [3 /*break*/, 2];
                return [4 /*yield*/, spservice_1.default.SPReadItems({
                        Listname: Config_1.ListNames.RecruitAppCareerPortalIntegration,
                        Select: "*,JobCode/JobCode",
                        Filter: [
                            { FilterKey: "JobCodeId", Operator: "in", FilterValue: allJobCodeIds },
                        ],
                        FilterCondition: "and",
                        Expand: "JobCode",
                        Topcount: 5000,
                        Orderby: "ID",
                        Orderbydecorasc: true,
                    })];
            case 1:
                portalItems = (_b.sent());
                _b.label = 2;
            case 2:
                jobCodeIdToUniqueKey = portalItems.map(function (item) { return item.JobUniqueKey; }).filter(Boolean);
                ScreeningCount = 0;
                AppliedCount = 0;
                if (!(jobCodeIdToUniqueKey.length > 0)) return [3 /*break*/, 4];
                params = {
                    jobCodes: jobCodeIdToUniqueKey,
                    workflowStatus: [
                        Config_1.workflowStatusApi.HRPending,
                        Config_1.workflowStatusApi.LineManagerL1Pending,
                        Config_1.workflowStatusApi.LineManagerL2Pending,
                    ],
                };
                return [4 /*yield*/, CareerPortalAPI_1.getProfileData.GetJobAppliedCount(params)];
            case 3:
                response = _b.sent();
                apiData = Array.isArray((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.data) ? response.data.data : [];
                AppliedCount = apiData.reduce(function (total, item) {
                    var _a, _b;
                    return ((_a = item.workflowStatus) === null || _a === void 0 ? void 0 : _a.includes(Config_1.workflowStatusApi.HRPending))
                        ? total + ((_b = item.count) !== null && _b !== void 0 ? _b : 0)
                        : total;
                }, 0);
                ScreeningCount = apiData.reduce(function (total, item) {
                    var _a, _b;
                    return ((_a = item.workflowStatus) === null || _a === void 0 ? void 0 : _a.some(function (status) { return [
                        Config_1.workflowStatusApi.LineManagerL1Pending,
                        Config_1.workflowStatusApi.LineManagerL2Pending,
                        Config_1.workflowStatusApi.LineManagerLevel1OnHold,
                        Config_1.workflowStatusApi.LineManagerLevel2OnHold,
                    ].includes(status); }))
                        ? total + ((_b = item.count) !== null && _b !== void 0 ? _b : 0)
                        : total;
                }, 0);
                _b.label = 4;
            case 4:
                InterviewCount = candidates.filter(function (item) {
                    return [
                        Config_1.StatusId.InterviewScheduled,
                        Config_1.StatusId.InterviewInProcess,
                        Config_1.StatusId.InterviewScheduledforLevel2,
                        Config_1.StatusId.InterviewLevel2InProgress,
                        Config_1.StatusId.InterviewLevel1InProgress
                    ].includes(Number(item.StatusId));
                }).length;
                BackgroundCheckCount = selectedcandidate.filter(function (item) {
                    return [
                        Config_1.StatusId.PendingHRBGVInitiation,
                        Config_1.StatusId.PendingBGdocuploadedbycandidate,
                        Config_1.StatusId.PendingHRReviewBGCheck
                    ].includes(Number(item.StatusId));
                }).length;
                ResiProcessCount = selectedcandidate.filter(function (item) {
                    return [
                        Config_1.StatusId.RESIProcessInitiatedforDRC,
                        Config_1.StatusId.RESIProcessInitiatedforExpatriate,
                        Config_1.StatusId.RESProcessInitiated
                    ].includes(Number(item.StatusId));
                }).length;
                MedicalScreeningCount = selectedcandidate.filter(function (item) {
                    return [
                        Config_1.StatusId.PendingwithTAforMedicalScreening,
                    ].includes(Number(item.StatusId));
                }).length;
                OfferCount = selectedcandidate.filter(function (item) {
                    return [
                        Config_1.StatusId.PendingHROfferInitiate,
                        Config_1.StatusId.PendingCandidateOfferLetterUpload,
                        Config_1.StatusId.PendingHRReviewOfferWorkPermitInit,
                        Config_1.StatusId.PendingLabourHireOfferRelease,
                        Config_1.StatusId.PendingHROfferReview,
                        Config_1.StatusId.HROfferLetterProgress
                    ].includes(Number(item.StatusId));
                }).length;
                EmploymentContractCount = selectedcandidate.filter(function (item) {
                    return [
                        Config_1.StatusId.PendingCandidateEmploymentContractUpload,
                        Config_1.StatusId.PendingHREmploymentContractVerification,
                        Config_1.StatusId.PendingHREmploymentContractInit,
                        Config_1.StatusId.PendingLHECRelease,
                        Config_1.StatusId.PendingHREmploymentContractReview,
                    ].includes(Number(item.StatusId));
                }).length;
                OnboardingInProcessCount = selectedcandidate.filter(function (item) {
                    return [
                        Config_1.StatusId.onboardingInProcess,
                        Config_1.StatusId.OnboardingProcessinitiatedforDRC,
                        Config_1.StatusId.OnboardingProcessinitiatedforExpat,
                    ].includes(Number(item.StatusId));
                }).length;
                OnboardingCompletedCount = recruitments.filter(function (item) {
                    return [
                        Config_1.StatusId.Onboarded,
                    ].includes(Number(item.StatusId));
                }).length;
                pipelineStages = [
                    { name: "Applied", count: AppliedCount },
                    { name: "Screening", count: ScreeningCount },
                    { name: "Interview", count: InterviewCount },
                    { name: "Background Checks", count: BackgroundCheckCount },
                    { name: "RESI Process", count: ResiProcessCount },
                    { name: "Medical Screening", count: MedicalScreeningCount },
                    { name: "Offer & Employment Contract", count: OfferCount + EmploymentContractCount },
                    { name: "Onboarding In Process", count: OnboardingInProcessCount },
                    { name: "Onboarding", count: OnboardingCompletedCount }
                ];
                totalCandidates = pipelineStages.reduce(function (sum, stage) { return sum + stage.count; }, 0);
                candidatePipeline = pipelineStages.map(function (stage) {
                    var percentage = totalCandidates ? Math.round((stage.count / totalCandidates) * 100 * 10) / 10 : 0;
                    return {
                        stage: stage.name,
                        count: stage.count,
                        percentage: percentage
                    };
                });
                return [2 /*return*/, candidatePipeline];
        }
    });
}); };
exports.BuildCandidatePipeLine = BuildCandidatePipeLine;
var BuildHRLeadSource = function (recruitmentProcess) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(Object.entries((0, DashboardConfig_1.groupedHRLead)(recruitmentProcess)).map(function (_a) {
                    var email = _a[0], val = _a[1];
                    return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                        var records, total, hrleadName, HR, filled, open;
                        var _b;
                        return tslib_1.__generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    records = val;
                                    total = records.length;
                                    return [4 /*yield*/, ServiceExport_1.CommonServices.GetUserName(email)];
                                case 1:
                                    hrleadName = _c.sent();
                                    HR = (0, DashboardConfig_1.groupedHR)(records);
                                    filled = records.filter(function (item) { return Number(item.StatusId) === Config_1.StatusId.Onboarded; }).length;
                                    open = records.filter(function (item) { return Number(item.StatusId) !== Config_1.StatusId.Onboarded; }).length;
                                    return [2 /*return*/, {
                                            hrLeadName: (_b = hrleadName.data) !== null && _b !== void 0 ? _b : email,
                                            hrsManaged: Object.keys(HR).length,
                                            filled: filled,
                                            open: open
                                        }];
                            }
                        });
                    });
                }))];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.BuildHRLeadSource = BuildHRLeadSource;
exports.conflictOfInterestAlerts = [
    { name: "Karthick", JobTitle: "Senior HR", coiReason: "tested", currentstatus: "HR Pending" },
    { name: "Suriya", JobTitle: "Senior Superintent", coiReason: "tested", currentstatus: "HR Pending" },
    { name: "RajaGuru", JobTitle: "Plumber", coiReason: "tested", currentstatus: "HR Pending" }
];
var BuildSeniorHRMonthlyTracker = function (recruitments) {
    var tracker = [];
    var _loop_3 = function (i) {
        var targetMonth = (0, moment_1.default)().subtract(i, "months");
        var monthLabel = targetMonth.format("MMM YYYY");
        var totalInMonth = recruitments.filter(function (item) {
            return item.Created && (0, moment_1.default)(item.DateRequried).isSameOrBefore(targetMonth, "month");
        }).length;
        var filledInMonth = recruitments.filter(function (c) {
            return Number(c.StatusId) === Config_1.StatusId.Onboarded && c.Modified && (0, moment_1.default)(c.Modified).isSameOrBefore(targetMonth, "month");
        }).length;
        var openInMonth = Math.max(0, totalInMonth - filledInMonth);
        tracker.push({
            month: monthLabel,
            total: totalInMonth,
            filled: filledInMonth,
            open: openInMonth
        });
    };
    for (var i = 5; i >= 0; i--) {
        _loop_3(i);
    }
    return tracker;
};
exports.BuildSeniorHRMonthlyTracker = BuildSeniorHRMonthlyTracker;
var SeniorHRBuildTasks = function (recruitments, Selectedcandidate) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(recruitments.map(function (item, index) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                    var dateValue, dayaLeft, target, diffMs, diffDays, onboardedCandidatesCount, vacant, Positionstatus, target, diff, hrleadName, hrName;
                    var _a, _b, _c, _d, _e, _f;
                    return tslib_1.__generator(this, function (_g) {
                        switch (_g.label) {
                            case 0:
                                dateValue = item.DateRequried;
                                dayaLeft = "0";
                                if (dateValue) {
                                    target = new Date(dateValue);
                                    if (!isNaN(target.getTime())) {
                                        diffMs = target.getTime() - new Date().getTime();
                                        diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                                        dayaLeft = diffDays > 0 ? "".concat(diffDays) : "0";
                                    }
                                }
                                onboardedCandidatesCount = Selectedcandidate.filter(function (c) { return Number(c.StatusId) === Config_1.StatusId.Onboarded; }).length;
                                vacant = String(Math.max(0, Number(item.NumberOfPersonNeeded) - onboardedCandidatesCount));
                                Positionstatus = "On Track";
                                if (dateValue) {
                                    target = new Date(dateValue);
                                    if (!isNaN(target.getTime())) {
                                        diff = (0, DashboardConfig_1.getMonthDifference)(DashboardConfig_1.currentDate, target);
                                        if (diff < 0)
                                            Positionstatus = "Overdue";
                                        else if (diff <= 2)
                                            Positionstatus = "At Risk";
                                    }
                                }
                                return [4 /*yield*/, ServiceExport_1.CommonServices.GetUserName(item.RecruitmentHRLead)];
                            case 1:
                                hrleadName = _g.sent();
                                return [4 /*yield*/, ServiceExport_1.CommonServices.GetUserName(item.AssignedHR)];
                            case 2:
                                hrName = _g.sent();
                                return [2 /*return*/, {
                                        id: index + 1,
                                        JobCode: (_b = (_a = item.JobCode) === null || _a === void 0 ? void 0 : _a.JobCode) !== null && _b !== void 0 ? _b : "",
                                        Jobtitle: (_d = (_c = item.JobCode) === null || _c === void 0 ? void 0 : _c.JobTitleInEnglish) !== null && _d !== void 0 ? _d : "",
                                        department: (_f = (_e = item.Department) === null || _e === void 0 ? void 0 : _e.DepartmentName) !== null && _f !== void 0 ? _f : "",
                                        dateRequired: dateValue
                                            ? new Date(dateValue).toLocaleDateString("en-GB")
                                            : "",
                                        RecruitmentHRlead: hrleadName.data,
                                        RecruitmentHR: hrName.data,
                                        headcount: String(item.NumberOfPersonNeeded || 1),
                                        filledcount: String(onboardedCandidatesCount),
                                        vacant: vacant,
                                        dayaLeft: dayaLeft,
                                        Positionstatus: Positionstatus,
                                    }];
                        }
                    });
                }); }))];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.SeniorHRBuildTasks = SeniorHRBuildTasks;
//# sourceMappingURL=CommanService.js.map