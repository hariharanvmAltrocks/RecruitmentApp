"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRecruitmentDetails = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var Config_1 = require("../../../../utilities/Config");
var UIStateContext_1 = require("../../../RecrutimentApp/UIStateContext");
var ConditionConfig_1 = require("../../../../utilities/ConditionConfig");
var RoleContext_1 = require("../../../../utilities/hooks/RoleContext");
var reusehooks_1 = require("../../../Hooks/reusehooks");
var mapEvaluationItem = function (item) {
    var _a, _b;
    return ({
        id: item.RecordID,
        RecID: item.RecID,
        department: (_b = (_a = item.DeptDetails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.Department,
        ItemID: item.ID,
        applicantName: item.ApplicantName,
        title: item.PositionTitle,
        nationlity: item.Nationality,
        interviewDate: item.InterviewDate,
        interviewLevels: item.interviewLevels,
        grade: item.JobGrade,
        status: item.Status,
        statusId: item.StatusId,
        jobCodeID: item.JobCodeId,
    });
};
var mapCandidateItem = function (item) {
    var _a, _b;
    var dept = (_a = item.DeptDetails) === null || _a === void 0 ? void 0 : _a[0];
    return {
        id: dept === null || dept === void 0 ? void 0 : dept.ID,
        ItemID: dept === null || dept === void 0 ? void 0 : dept.ID,
        jobCode: dept === null || dept === void 0 ? void 0 : dept.JobCode,
        title: (_b = dept === null || dept === void 0 ? void 0 : dept.JobTitleEnglish) !== null && _b !== void 0 ? _b : "",
        department: dept === null || dept === void 0 ? void 0 : dept.Department,
        count: dept === null || dept === void 0 ? void 0 : dept.NumberOfPersonNeeded,
        requestType: dept === null || dept === void 0 ? void 0 : dept.Type,
        nationality: dept === null || dept === void 0 ? void 0 : dept.Nationality,
        status: dept === null || dept === void 0 ? void 0 : dept.Status,
        statusId: dept === null || dept === void 0 ? void 0 : dept.StatusId,
        jobCodeID: dept === null || dept === void 0 ? void 0 : dept.JobCodeId,
    };
};
var mapSelectedCandidate = function (item) {
    var _a;
    var dept = item.DeptDetails;
    var candi = item === null || item === void 0 ? void 0 : item.candiDetails;
    return {
        id: item === null || item === void 0 ? void 0 : item.RecordID,
        ItemID: item === null || item === void 0 ? void 0 : item.ItemID,
        applicantName: candi === null || candi === void 0 ? void 0 : candi.ApplicantName,
        title: (_a = item === null || item === void 0 ? void 0 : item.PositionTitle) !== null && _a !== void 0 ? _a : "",
        nationality: item === null || item === void 0 ? void 0 : item.Nationality,
        status: item === null || item === void 0 ? void 0 : item.Status,
        statusId: item === null || item === void 0 ? void 0 : item.StatusId,
        positionId: item === null || item === void 0 ? void 0 : item.PositionID,
        jobCode: dept === null || dept === void 0 ? void 0 : dept.JobCode,
        department: dept === null || dept === void 0 ? void 0 : dept.Department,
        jobCodeID: dept === null || dept === void 0 ? void 0 : dept.JobCodeId,
        buCode: dept === null || dept === void 0 ? void 0 : dept.BusinessUnitCode,
        CandidateID: candi === null || candi === void 0 ? void 0 : candi.ID,
        jobrequestID: candi === null || candi === void 0 ? void 0 : candi.jobrequestID,
        RecID: dept === null || dept === void 0 ? void 0 : dept.ID,
        EmploymentCategory: dept === null || dept === void 0 ? void 0 : dept.EmploymentCategory,
        IsExpat: candi === null || candi === void 0 ? void 0 : candi.isExpat,
    };
};
var mapRecruitmentItem = function (item) {
    var _a;
    return ({
        id: item === null || item === void 0 ? void 0 : item.RecordID,
        ItemID: item === null || item === void 0 ? void 0 : item.ID,
        jobCode: item === null || item === void 0 ? void 0 : item.JobCode,
        title: (_a = item === null || item === void 0 ? void 0 : item.JobTitleEnglish) !== null && _a !== void 0 ? _a : "",
        department: item === null || item === void 0 ? void 0 : item.Department,
        count: item === null || item === void 0 ? void 0 : item.NumberOfPersonNeeded,
        requestType: item === null || item === void 0 ? void 0 : item.Type,
        nationality: item === null || item === void 0 ? void 0 : item.Nationality,
        status: item === null || item === void 0 ? void 0 : item.Status,
        statusId: item === null || item === void 0 ? void 0 : item.StatusId,
        jobCodeID: item === null || item === void 0 ? void 0 : item.JobCodeId,
    });
};
var useRecruitmentDetails = function (activeTabKey, refreshKey) {
    if (refreshKey === void 0) { refreshKey = 0; }
    var _a = (0, react_1.useState)([]), items = _a[0], setItems = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    var _c = (0, RoleContext_1.userInfo)(), ADGroupData = _c.ADGroupData, roleIDs = _c.roleIDs;
    var matricID = (0, UIStateContext_1.useUIState)().MatricID;
    (0, react_1.useEffect)(function () {
        var cancelled = false;
        setLoading(true);
        var timer = setTimeout(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var data, isEvaluation_1, mappedItems, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, (0, reusehooks_1.fetchByMetricId)(matricID, ADGroupData.EmailId[0], "", roleIDs)];
                    case 1:
                        data = _a.sent();
                        if (cancelled)
                            return [2 /*return*/];
                        isEvaluation_1 = matricID === ConditionConfig_1.MatricID.EvalutionHR ||
                            matricID === ConditionConfig_1.MatricID.EvalutionHOD ||
                            matricID === ConditionConfig_1.MatricID.EvalutionLM;
                        mappedItems = data.map(function (item) {
                            if (isEvaluation_1)
                                return mapEvaluationItem(item);
                            if (item.__listName ===
                                Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails) {
                                return mapCandidateItem(item);
                            }
                            if (item.__listName === Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD) {
                                return mapSelectedCandidate(item);
                            }
                            return mapRecruitmentItem(item);
                        });
                        setItems(mappedItems);
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _a.sent();
                        console.error(error_1);
                        if (!cancelled)
                            setItems([]);
                        return [3 /*break*/, 4];
                    case 3:
                        if (!cancelled)
                            setLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); }, 1100);
        return function () {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [matricID, refreshKey]);
    return { items: items, loading: loading };
};
exports.useRecruitmentDetails = useRecruitmentDetails;
//# sourceMappingURL=useRecruitmentDetails.js.map