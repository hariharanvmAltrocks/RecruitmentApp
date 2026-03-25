"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCandidateListData = useCandidateListData;
var tslib_1 = require("tslib");
var react_1 = require("react");
var Config_1 = require("../../../../utilities/Config");
var ScorecardConfig_1 = require("../config/ScorecardConfig");
var ScorecardApiService = tslib_1.__importStar(require("../services/ScorecardApiService"));
function useCandidateListData(_a) {
    var _this = this;
    var recruitmentID = _a.recruitmentID, jobCodeID = _a.jobCodeID, jobCode = _a.jobCode, employeeList = _a.employeeList;
    var _b = (0, react_1.useState)([]), candidateData = _b[0], setCandidateData = _b[1];
    var _c = (0, react_1.useState)(false), isLoading = _c[0], setIsLoading = _c[1];
    var load = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var rows, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!jobCode || !recruitmentID)
                        return [2 /*return*/];
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, ScorecardApiService.fetchCandidateList(recruitmentID, jobCodeID, employeeList)];
                case 2:
                    rows = _a.sent();
                    setCandidateData(rows);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    console.error("useCandidateListData – load error:", err_1);
                    setCandidateData([]);
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [recruitmentID, jobCodeID, jobCode, employeeList]);
    (0, react_1.useEffect)(function () {
        void load();
    }, [load]);
    var handleBulkReject = (0, react_1.useCallback)(function (selectedCandidates) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var updateSuccess, interviewedCount, _i, selectedCandidates_1, candidate, rejectionPayload, actionPayload, response, err_2;
        var _a, _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    setIsLoading(true);
                    updateSuccess = false;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, , 11, 12]);
                    return [4 /*yield*/, ScorecardApiService.getCandidateInterviewedCount(jobCodeID)];
                case 2:
                    interviewedCount = _d.sent();
                    _i = 0, selectedCandidates_1 = selectedCandidates;
                    _d.label = 3;
                case 3:
                    if (!(_i < selectedCandidates_1.length)) return [3 /*break*/, 9];
                    candidate = selectedCandidates_1[_i];
                    _d.label = 4;
                case 4:
                    _d.trys.push([4, 7, , 8]);
                    rejectionPayload = {
                        workflowStatus: ScorecardConfig_1.workflowStatusApi.CandidateRejectedIPanel,
                        jobRequestId: Number(candidate.JobRequestID),
                        comments: String((_a = candidate.Comments) !== null && _a !== void 0 ? _a : ""),
                        actionBy: ScorecardConfig_1.RoleName.HOD,
                    };
                    actionPayload = {
                        ActionId: ScorecardConfig_1.WorkflowAction.Reject,
                        Id: candidate.ID,
                        ItemCreated: "Yes",
                        Comments: String((_b = candidate.Comments) !== null && _b !== void 0 ? _b : ""),
                        GPA: String((_c = candidate.GPA) !== null && _c !== void 0 ? _c : ""),
                        OthersInterviewed: interviewedCount > 1 ? "Yes" : "No",
                    };
                    return [4 /*yield*/, ScorecardApiService.updateCandidateWorkflowStatus(rejectionPayload)];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, ScorecardApiService.candidateSelectionApi(actionPayload, Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails)];
                case 6:
                    response = _d.sent();
                    if (response.status === 200) {
                        updateSuccess = true;
                    }
                    return [3 /*break*/, 8];
                case 7:
                    err_2 = _d.sent();
                    console.error("Error rejecting candidate ID: ".concat(candidate.ID), err_2);
                    return [3 /*break*/, 8];
                case 8:
                    _i++;
                    return [3 /*break*/, 3];
                case 9: return [4 /*yield*/, load()];
                case 10:
                    _d.sent();
                    return [2 /*return*/, {
                            success: updateSuccess,
                            message: ScorecardConfig_1.RecuritmentHRMsg.PositionIDassigned,
                        }];
                case 11:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    }); }, [jobCodeID, load]);
    return {
        candidateData: candidateData,
        isLoading: isLoading,
        reload: load,
        handleBulkReject: handleBulkReject,
    };
}
//# sourceMappingURL=useCandidateListData.js.map