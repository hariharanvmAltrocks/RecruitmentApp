"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEvaluationData = exports.isSkeleton = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var EvaluationConfig_1 = require("../config/EvaluationConfig");
var EvaluationApiService_1 = require("../services/EvaluationApiService");
var Config_1 = require("../../../../utilities/Config");
var isSkeleton = function (r) { return "__skeleton" in r; };
exports.isSkeleton = isSkeleton;
var makeSkeletons = function () {
    return Array.from({ length: 5 }, function (_, i) { return ({ __skeleton: true, id: i }); });
};
function useEvaluationData(currentUserEmail, employeeList) {
    var _this = this;
    var _a = (0, react_1.useState)(makeSkeletons()), rows = _a[0], setRows = _a[1];
    var _b = (0, react_1.useState)(null), tooltipData = _b[0], setTooltip = _b[1];
    var panelDataRef = (0, react_1.useRef)([]);
    var fetchData = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var guid, panels, candidateIDs, rawCandidates, settled, finalRows;
        var _this = this;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setRows(makeSkeletons());
                    if (!currentUserEmail) {
                        console.warn(" No email provided to hook.");
                        setRows([]);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, EvaluationApiService_1.evaluationService.getCurrentUserGuid(currentUserEmail)];
                case 1:
                    guid = _a.sent();
                    if (!guid) {
                        setRows([]);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, EvaluationApiService_1.evaluationService.getInterviewPanelsByUser(guid)];
                case 2:
                    panels = _a.sent();
                    panelDataRef.current = panels;
                    if (!panels.length) {
                        console.warn(" No panels found for this user.");
                        setRows([]);
                        return [2 /*return*/];
                    }
                    candidateIDs = Array.from(new Set(panels
                        .map(function (p) { var _a, _b, _c; return (_c = (_b = (_a = p.CandidateID) === null || _a === void 0 ? void 0 : _a.ID) !== null && _b !== void 0 ? _b : p.CandidateId) !== null && _c !== void 0 ? _c : p.CandidateIDId; })
                        .filter(Boolean)));
                    if (!candidateIDs.length) {
                        setRows([]);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, EvaluationApiService_1.evaluationService.getCombinedCandidates(candidateIDs, employeeList)];
                case 3:
                    rawCandidates = _a.sent();
                    if (!rawCandidates.length) {
                        setRows([]);
                        return [2 /*return*/];
                    }
                    settled = new Array(rawCandidates.length).fill(null);
                    return [4 /*yield*/, Promise.all(rawCandidates.map(function (candidate, idx) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var recruitmentId, _a, grade, level, jobCodeID, row;
                            var _b, _c, _d;
                            return tslib_1.__generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        recruitmentId = (_d = (_c = (_b = candidate.RecruitmentID) === null || _b === void 0 ? void 0 : _b.ID) !== null && _c !== void 0 ? _c : candidate.RecruitmentIDId) !== null && _d !== void 0 ? _d : candidate.RecruitmentID;
                                        return [4 /*yield*/, EvaluationApiService_1.evaluationService.getGradeAndLevel(recruitmentId)];
                                    case 1:
                                        _a = _e.sent(), grade = _a.grade, level = _a.level, jobCodeID = _a.jobCodeID;
                                        row = EvaluationApiService_1.EvaluationServiceHelper.buildRow(candidate, grade, level, jobCodeID);
                                        settled[idx] = row;
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 4:
                    _a.sent();
                    finalRows = settled.filter(Boolean).filter(function (c) {
                        var matchingPanel = panels.find(function (item) {
                            var _a, _b, _c;
                            var panelCandidateId = (_c = (_b = (_a = item.CandidateID) === null || _a === void 0 ? void 0 : _a.ID) !== null && _b !== void 0 ? _b : item.CandidateId) !== null && _c !== void 0 ? _c : item.CandidateIDId;
                            if (c.id !== panelCandidateId)
                                return false;
                            var cStatusId = Number(c.statusId);
                            if (cStatusId === Config_1.StatusId.InterviewScheduled &&
                                item.InterviewLevel === EvaluationConfig_1.InterviewLevels.Level1) {
                                return true;
                            }
                            if (cStatusId === Config_1.StatusId.InterviewScheduledforLevel2 &&
                                item.InterviewLevel === EvaluationConfig_1.InterviewLevels.Level2) {
                                return true;
                            }
                            return false;
                        });
                        return !!matchingPanel;
                    });
                    setRows(finalRows);
                    return [2 /*return*/];
            }
        });
    }); }, [currentUserEmail, employeeList]);
    var fetchTooltip = (0, react_1.useCallback)(function (statusId, candidateID) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var level, data;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    level = statusId === Config_1.StatusId.InterviewScheduled
                        ? EvaluationConfig_1.InterviewLevels.Level1
                        : EvaluationConfig_1.InterviewLevels.Level2;
                    return [4 /*yield*/, EvaluationApiService_1.evaluationService.getTooltipData(candidateID, level)];
                case 1:
                    data = _a.sent();
                    setTooltip(data);
                    return [2 /*return*/];
            }
        });
    }); }, []);
    var checkScoreSheet = (0, react_1.useCallback)(function (candidateID, statusId) {
        return EvaluationApiService_1.evaluationService.checkScoreSheet(candidateID, statusId, currentUserEmail);
    }, [currentUserEmail]);
    return { rows: rows, tooltipData: tooltipData, fetchData: fetchData, fetchTooltip: fetchTooltip, checkScoreSheet: checkScoreSheet };
}
exports.useEvaluationData = useEvaluationData;
//# sourceMappingURL=useEvaluationData.js.map