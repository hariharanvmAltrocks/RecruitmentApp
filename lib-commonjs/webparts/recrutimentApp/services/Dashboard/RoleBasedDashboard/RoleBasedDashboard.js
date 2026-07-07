"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Config_1 = require("../../../utilities/Config");
var CommanService_1 = require("./CommanService");
var RoleBasedDashboardService = /** @class */ (function () {
    function RoleBasedDashboardService() {
    }
    RoleBasedDashboardService.prototype.GetHRLeadDashboard = function (EmailId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, OpenRecruitment, recruitmentProcess, candidates, candidateDetails, summary, PositionStatus, PositionSource, activeRecruitments, positionDetails, departmentPositions, GridResult, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, (0, CommanService_1.GetOpenRecruitmentData)(EmailId, "RecruitmentHRLead")];
                    case 1:
                        result = _a.sent();
                        if (!result || !result[1] || !result[1].length) {
                            return [2 /*return*/, {
                                    status: 200,
                                    message: "No recruitments found.",
                                    data: {}
                                }];
                        }
                        OpenRecruitment = result[0] || [];
                        recruitmentProcess = result[1] || [];
                        return [4 /*yield*/, (0, CommanService_1.GetCandidateData)(recruitmentProcess)];
                    case 2:
                        candidates = _a.sent();
                        candidateDetails = candidates || [];
                        summary = (0, CommanService_1.BuildHRLeadSummary)(OpenRecruitment, recruitmentProcess);
                        PositionStatus = (0, CommanService_1.BuildPositionStatus)(recruitmentProcess);
                        return [4 /*yield*/, (0, CommanService_1.BuildPositionSource)(recruitmentProcess)];
                    case 3:
                        PositionSource = _a.sent();
                        activeRecruitments = recruitmentProcess.filter(function (item) { return Number(item.StatusId) !== Config_1.StatusId.Onboarded; });
                        return [4 /*yield*/, (0, CommanService_1.BuildPositionDetails)(activeRecruitments, candidateDetails)];
                    case 4:
                        positionDetails = _a.sent();
                        departmentPositions = (0, CommanService_1.BuildDepartmentDetails)(recruitmentProcess);
                        GridResult = {
                            HRLeadSummary: summary,
                            PositionByStatus: PositionStatus,
                            PositionSource: PositionSource,
                            positionDetails: positionDetails,
                            departmentPositions: departmentPositions
                        };
                        return [2 /*return*/, {
                                data: GridResult,
                                status: 200,
                                message: "GetHRLeadDashboard fetched successfully",
                            }];
                    case 5:
                        error_1 = _a.sent();
                        console.error("Error fetching GetHRLeadDashboard:", error_1);
                        return [2 /*return*/, {
                                data: {},
                                status: 500,
                                message: "Error fetching dashboard data",
                            }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    RoleBasedDashboardService.prototype.GetHRDashboardData = function (EmailId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var recruitments, candidates, selectedcandidates, summary, monthlyTracker, departmentPositions, candidatePipeline, activeRecruitments, taskItems, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, (0, CommanService_1.GetRecruitmentData)(EmailId, "AssignedHR")];
                    case 1:
                        recruitments = _a.sent();
                        if (!recruitments.length) {
                            return [2 /*return*/, {
                                    status: 200,
                                    message: "No recruitments found.",
                                    data: {}
                                }];
                        }
                        return [4 /*yield*/, (0, CommanService_1.GetCandidateData)(recruitments)];
                    case 2:
                        candidates = _a.sent();
                        return [4 /*yield*/, (0, CommanService_1.GetSelectedCandiadtesData)(candidates)];
                    case 3:
                        selectedcandidates = _a.sent();
                        summary = (0, CommanService_1.HRBuildSummary)(recruitments, candidates);
                        monthlyTracker = (0, CommanService_1.BuildHRMonthlyTracker)(recruitments);
                        departmentPositions = (0, CommanService_1.BuildDepartmentDetails)(recruitments);
                        return [4 /*yield*/, (0, CommanService_1.BuildCandidatePipeLine)(recruitments, candidates, selectedcandidates)];
                    case 4:
                        candidatePipeline = _a.sent();
                        activeRecruitments = recruitments.filter(function (item) { return Number(item.StatusId) !== Config_1.StatusId.Onboarded; });
                        taskItems = (0, CommanService_1.BuildTasks)(activeRecruitments, selectedcandidates);
                        return [2 /*return*/, {
                                data: {
                                    summary: summary,
                                    monthlyTracker: monthlyTracker,
                                    departmentPositions: departmentPositions,
                                    candidatePipeline: candidatePipeline,
                                    tasks: taskItems
                                },
                                status: 200,
                                message: "HR Dashboard data retrieved and aggregated successfully"
                            }];
                    case 5:
                        error_2 = _a.sent();
                        console.error("GetHRDashboardData Error:", error_2);
                        return [2 /*return*/, {
                                data: {},
                                status: 500,
                                message: "Error retrieving HR Dashboard data"
                            }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    RoleBasedDashboardService.prototype.GetLMDashboardData = function (EmailId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var recruitments, candidates, selectedcandidates, summary, monthlyTracker, positionsJobRole, hrSummary, positionStatus, approvals, tasks, error_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, (0, CommanService_1.GetRecruitmentData)(EmailId, "LineManager")];
                    case 1:
                        recruitments = _a.sent();
                        if (!recruitments.length) {
                            return [2 /*return*/, {
                                    status: 200,
                                    message: "No recruitments found.",
                                    data: {}
                                }];
                        }
                        return [4 /*yield*/, (0, CommanService_1.GetCandidateData)(recruitments)];
                    case 2:
                        candidates = _a.sent();
                        return [4 /*yield*/, (0, CommanService_1.GetSelectedCandiadtesData)(candidates)];
                    case 3:
                        selectedcandidates = _a.sent();
                        summary = (0, CommanService_1.HODBuildSummary)(recruitments, candidates);
                        monthlyTracker = (0, CommanService_1.BuildMonthlyTracker)(recruitments);
                        positionsJobRole = (0, CommanService_1.BuildJobRoleSummary)(recruitments, selectedcandidates);
                        return [4 /*yield*/, (0, CommanService_1.BuildHRSummary)(recruitments)];
                    case 4:
                        hrSummary = _a.sent();
                        positionStatus = (0, CommanService_1.BuildPositionStatus)(recruitments);
                        return [4 /*yield*/, (0, CommanService_1.LMBuildApprovals)(recruitments, candidates)];
                    case 5:
                        approvals = _a.sent();
                        tasks = (0, CommanService_1.BuildTasks)(recruitments, selectedcandidates);
                        return [2 /*return*/, {
                                status: 200,
                                message: "HOD Dashboard loaded successfully.",
                                data: {
                                    summary: summary,
                                    monthlyTracker: monthlyTracker,
                                    positionsJobRole: positionsJobRole,
                                    HRSummary: hrSummary,
                                    PositionStatus: positionStatus,
                                    MyApprovals: approvals,
                                    tasks: tasks
                                }
                            }];
                    case 6:
                        error_3 = _a.sent();
                        console.error("GetLMDashboardData error:", error_3);
                        return [2 /*return*/, {
                                status: 500,
                                message: "Unable to load HOD Dashboard.",
                                data: {}
                            }];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    RoleBasedDashboardService.prototype.GetHODDashboardData = function (EmailId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var recruitments, candidates, selectedcandidates, summary, monthlyTracker, positionsJobRole, hrSummary, positionStatus, approvals, tasks, error_4;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, (0, CommanService_1.GetRecruitmentData)(EmailId, "HOD")];
                    case 1:
                        recruitments = _a.sent();
                        if (!recruitments.length) {
                            return [2 /*return*/, {
                                    status: 200,
                                    message: "No recruitments found.",
                                    data: {}
                                }];
                        }
                        return [4 /*yield*/, (0, CommanService_1.GetCandidateData)(recruitments)];
                    case 2:
                        candidates = _a.sent();
                        return [4 /*yield*/, (0, CommanService_1.GetSelectedCandiadtesData)(candidates)];
                    case 3:
                        selectedcandidates = _a.sent();
                        summary = (0, CommanService_1.HODBuildSummary)(recruitments, candidates);
                        monthlyTracker = (0, CommanService_1.BuildMonthlyTracker)(recruitments);
                        positionsJobRole = (0, CommanService_1.BuildJobRoleSummary)(recruitments, selectedcandidates);
                        return [4 /*yield*/, (0, CommanService_1.BuildHRSummary)(recruitments)];
                    case 4:
                        hrSummary = _a.sent();
                        positionStatus = (0, CommanService_1.BuildPositionStatus)(recruitments);
                        approvals = (0, CommanService_1.HODBuildApprovals)(recruitments, candidates);
                        tasks = (0, CommanService_1.BuildTasks)(recruitments, selectedcandidates);
                        return [2 /*return*/, {
                                status: 200,
                                message: "HOD Dashboard loaded successfully.",
                                data: {
                                    summary: summary,
                                    monthlyTracker: monthlyTracker,
                                    positionsJobRole: positionsJobRole,
                                    HRSummary: hrSummary,
                                    PositionStatus: positionStatus,
                                    MyApprovals: approvals,
                                    tasks: tasks
                                }
                            }];
                    case 5:
                        error_4 = _a.sent();
                        console.error("GetHODDashboardData error:", error_4);
                        return [2 /*return*/, {
                                status: 500,
                                message: "Unable to load HOD Dashboard.",
                                data: {}
                            }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    RoleBasedDashboardService.prototype.GetSeniorHRDashboardData = function (EmailId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, openRecruiment, recruitmentProcess, candidates, selectedcandidates, summary, positionsOverview, departmentDemand, hrLeadsPerformance, tasks, coiCandidates, parsedConflictOfInterest, coiAlerts, error_5;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, (0, CommanService_1.GetOpenRecruitmentData)(EmailId, "RecruitmentHRLead")];
                    case 1:
                        result = _a.sent();
                        if (!result || !result[1] || !result[1].length) {
                            return [2 /*return*/, {
                                    status: 200,
                                    message: "No recruitments found.",
                                    data: {}
                                }];
                        }
                        openRecruiment = result[1] || [];
                        recruitmentProcess = result[2] || [];
                        return [4 /*yield*/, (0, CommanService_1.GetCandidateData)(recruitmentProcess)];
                    case 2:
                        candidates = _a.sent();
                        return [4 /*yield*/, (0, CommanService_1.GetSelectedCandiadtesData)(candidates)];
                    case 3:
                        selectedcandidates = _a.sent();
                        summary = (0, CommanService_1.SeniorHRBuildSummary)(openRecruiment, recruitmentProcess, candidates);
                        positionsOverview = (0, CommanService_1.BuildSeniorHRMonthlyTracker)(recruitmentProcess);
                        departmentDemand = (0, CommanService_1.BuildDepartmentDetails)(recruitmentProcess);
                        return [4 /*yield*/, (0, CommanService_1.BuildHRLeadSource)(recruitmentProcess)];
                    case 4:
                        hrLeadsPerformance = _a.sent();
                        return [4 /*yield*/, (0, CommanService_1.SeniorHRBuildTasks)(recruitmentProcess, selectedcandidates)];
                    case 5:
                        tasks = _a.sent();
                        coiCandidates = candidates.filter(function (item) { return item.ConflictsOfInterest === "Yes"; });
                        parsedConflictOfInterest = coiCandidates.map(function (item) {
                            var _a;
                            var name = [item.FristName, item.LastName].filter(Boolean).join(" ");
                            return {
                                name: name || "Unknown",
                                JobTitle: item.PositionTitle || "N/A",
                                coiReason: item.COIReason || "tested",
                                currentstatus: ((_a = item.Status) === null || _a === void 0 ? void 0 : _a.StatusDescription) || "HR Pending"
                            };
                        });
                        coiAlerts = parsedConflictOfInterest.length > 0 ? parsedConflictOfInterest : [];
                        return [2 /*return*/, {
                                data: {
                                    summary: summary,
                                    monthlyTracker: positionsOverview,
                                    departmentPositions: departmentDemand,
                                    HrLeadPerformance: hrLeadsPerformance,
                                    conflictOfInterestAlerts: coiAlerts,
                                    tasks: tasks
                                },
                                status: 200,
                                message: "Senior HR Dashboard data fetched successfully"
                            }];
                    case 6:
                        error_5 = _a.sent();
                        console.error("GetSeniorHRDashboardData Error:", error_5);
                        return [2 /*return*/, {
                                data: {},
                                status: 500,
                                message: "Error retrieving Senior HR Dashboard data"
                            }];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return RoleBasedDashboardService;
}());
exports.default = RoleBasedDashboardService;
//# sourceMappingURL=RoleBasedDashboard.js.map