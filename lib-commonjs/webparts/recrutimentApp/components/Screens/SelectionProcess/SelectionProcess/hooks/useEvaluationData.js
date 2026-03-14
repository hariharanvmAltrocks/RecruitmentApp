"use strict";
// ═══════════════════════════════════════════════════════════════════════════
//  useEvaluationData.ts
//  Hook — evaluationService மட்டும் call பண்ணும்
//  EvaluationConfig values மட்டும் import
// ═══════════════════════════════════════════════════════════════════════════
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSkeleton = void 0;
exports.useEvaluationData = useEvaluationData;
var tslib_1 = require("tslib");
var react_1 = require("react");
var EvaluationConfig_1 = require("../config/EvaluationConfig");
var EvaluationService_1 = require("../services/EvaluationService");
var isSkeleton = function (r) { return "__skeleton" in r; };
exports.isSkeleton = isSkeleton;
var makeSkeletons = function () {
    return Array.from({ length: EvaluationConfig_1.EvalUIConfig.SkeletonRowCount }, function (_, i) { return ({ __skeleton: true, id: i }); });
};
// ─────────────────────────────────────────────────────────────────────────────
function useEvaluationData(currentUserEmail, employeeList) {
    var _this = this;
    var _a = (0, react_1.useState)(makeSkeletons()), rows = _a[0], setRows = _a[1];
    var _b = (0, react_1.useState)(null), tooltipData = _b[0], setTooltip = _b[1];
    var panelDataRef = (0, react_1.useRef)([]);
    // ── MAIN FETCH — called once on tab mount ─────────────────────────────────
    var fetchData = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var guid, panels, candidateIDs, rawCandidates, settled, finalRows;
        var _this = this;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setRows(makeSkeletons()); // skeletons appear immediately
                    return [4 /*yield*/, EvaluationService_1.evaluationService.getCurrentUserGuid(currentUserEmail)];
                case 1:
                    guid = _a.sent();
                    if (!guid) {
                        setRows([]);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, EvaluationService_1.evaluationService.getInterviewPanelsByUser(guid)];
                case 2:
                    panels = _a.sent();
                    panelDataRef.current = panels;
                    if (!panels.length) {
                        setRows([]);
                        return [2 /*return*/];
                    }
                    candidateIDs = tslib_1.__spreadArray([], new Set(panels.map(function (p) { return p.CandidateID; })), true);
                    if (!candidateIDs.length) {
                        setRows([]);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, EvaluationService_1.evaluationService.getCombinedCandidates(candidateIDs, employeeList)];
                case 3:
                    rawCandidates = _a.sent();
                    if (!rawCandidates.length) {
                        setRows([]);
                        return [2 /*return*/];
                    }
                    settled = new Array(rawCandidates.length).fill(null);
                    return [4 /*yield*/, Promise.all(rawCandidates.map(function (candidate, idx) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var _a, grade, level, jobCodeID, row;
                            return tslib_1.__generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, EvaluationService_1.evaluationService.getGradeAndLevel(candidate.RecruitmentID)];
                                    case 1:
                                        _a = _b.sent(), grade = _a.grade, level = _a.level, jobCodeID = _a.jobCodeID;
                                        row = EvaluationService_1.EvaluationService.buildRow(candidate, grade, level, jobCodeID);
                                        settled[idx] = row;
                                        // Replace one skeleton with this real row as soon as it resolves
                                        setRows(function (prev) {
                                            var next = tslib_1.__spreadArray([], prev, true);
                                            var skIdx = next.findIndex(exports.isSkeleton);
                                            if (skIdx !== -1)
                                                next[skIdx] = row;
                                            return next;
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 4:
                    _a.sent();
                    finalRows = settled.filter(Boolean).filter(function (c) {
                        return panels.some(function (item) {
                            if (c.id !== item.CandidateID)
                                return false;
                            if (c.statusId === EvaluationConfig_1.EvalStatusId.InterviewScheduled &&
                                item.InterviewLevel === EvaluationConfig_1.EvalInterviewLevels.Level1)
                                return true;
                            if (c.statusId === EvaluationConfig_1.EvalStatusId.InterviewScheduledforLevel2 &&
                                item.InterviewLevel === EvaluationConfig_1.EvalInterviewLevels.Level2)
                                return true;
                            return false;
                        });
                    });
                    setRows(finalRows);
                    return [2 /*return*/];
            }
        });
    }); }, [currentUserEmail, employeeList]);
    // ── ON-DEMAND: hover tooltip (user hovers status dot) ─────────────────────
    var fetchTooltip = (0, react_1.useCallback)(function (statusId, candidateID) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var level, data;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    level = statusId === EvaluationConfig_1.EvalStatusId.InterviewScheduled
                        ? EvaluationConfig_1.EvalInterviewLevels.Level1
                        : EvaluationConfig_1.EvalInterviewLevels.Level2;
                    return [4 /*yield*/, EvaluationService_1.evaluationService.getTooltipData(candidateID, level)];
                case 1:
                    data = _a.sent();
                    setTooltip(data);
                    return [2 /*return*/];
            }
        });
    }); }, []);
    // ── ON-DEMAND: score sheet check (user clicks Evaluate icon) ──────────────
    var checkScoreSheet = (0, react_1.useCallback)(function (candidateID, statusId) {
        return EvaluationService_1.evaluationService.checkScoreSheet(candidateID, statusId, currentUserEmail);
    }, [currentUserEmail]);
    return { rows: rows, tooltipData: tooltipData, fetchData: fetchData, fetchTooltip: fetchTooltip, checkScoreSheet: checkScoreSheet };
}
//# sourceMappingURL=useEvaluationData.js.map