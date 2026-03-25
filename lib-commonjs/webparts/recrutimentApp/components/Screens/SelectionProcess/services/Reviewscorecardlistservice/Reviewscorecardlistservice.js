"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HOD_SCORECARD_STATUS_IDS = void 0;
exports.fetchScorecardJobList = fetchScorecardJobList;
exports.fetchCandidatesForJob = fetchCandidatesForJob;
var tslib_1 = require("tslib");
var spservice_1 = tslib_1.__importDefault(require("../../../../../services/SPService/spservice"));
var Config_1 = require("../../../../../utilities/Config");
// HOD scorecard status IDs — from old CandidateList.tsx
exports.HOD_SCORECARD_STATUS_IDS = [
    131, // PendingwithHODtoselectthecandidate
    133, // Selected
    132, // OnHoldbyHOD
    134, // RejectedbyHOD
    130, // PendingwithHODtoAssignPositionID
    138, // PendingwithHODtoselectthecandidateLevel2
    139, // CandidateOnHoldbyHODLevel1
    140, // CandidateOnHoldbyHODLevel2
    141, // CandidateRejectedbyHODLevel1
    142, // CandidateRejectedbyHODLevel2
];
// ── Fetch positions (job-level list) for HOD scorecard tab ────
function fetchScorecardJobList() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var res, e_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSRecruitmentDptDetails,
                            Select: "*,Department/DepartmentName,Status/StatusDescription,JobCode/JobCode,JobCode/ID,BusinessUnitCode/BusineesUnitCode,PatersonGrade/PatersonGrade",
                            Expand: "Department,Status,JobCode,BusinessUnitCode,PatersonGrade",
                            FilterCondition: "and",
                            Filter: [
                                {
                                    FilterKey: "StatusId",
                                    Operator: "in",
                                    FilterValue: [
                                        Config_1.StatusId.PendingwithHODtoAssignPositionID,
                                        131, 132, 133, 134, 138, 139, 140, 141, 142,
                                    ],
                                },
                                { FilterKey: "ItemCreated", Operator: "eq", FilterValue: "No" },
                            ],
                            Topcount: 1000,
                            Orderby: "ID",
                            Orderbydecorasc: true,
                        })];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.map(function (item) {
                            var _a, _b, _c, _d, _e;
                            return ({
                                id: String(item.ID),
                                recruitmentID: item.ID,
                                jobCode: ((_a = item.JobCode) === null || _a === void 0 ? void 0 : _a.JobCode) || "",
                                jobCodeID: ((_b = item.JobCode) === null || _b === void 0 ? void 0 : _b.ID) || item.JobCodeId || 0,
                                jobTitle: item.JobTitleEnglish || item.Title || "",
                                department: ((_c = item.Department) === null || _c === void 0 ? void 0 : _c.DepartmentName) || "",
                                nationality: item.Nationality || "",
                                statusId: item.StatusId || 0,
                                status: ((_d = item.Status) === null || _d === void 0 ? void 0 : _d.StatusDescription) || "",
                                grade: ((_e = item.PatersonGrade) === null || _e === void 0 ? void 0 : _e.PatersonGrade) || "",
                                interviewLevel: "",
                                noOfPositions: item.NumberOfPersonNeeded || 1,
                            });
                        })];
                case 2:
                    e_1 = _a.sent();
                    console.error("[fetchScorecardJobList]", e_1);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// ── Fetch candidates for a specific job (recruitment ID) ──────
function fetchCandidatesForJob(recruitmentID, jobCodeID, employeeList) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var res, e_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, spservice_1.default.SPReadItems({
                            Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                            Select: "*,RecruitmentID/ID,JobCode/JobCode,Status/StatusDescription,Status/ID",
                            Expand: "RecruitmentID,JobCode,Status",
                            FilterCondition: "and",
                            Filter: [
                                { FilterKey: "RecruitmentIDId", Operator: "eq", FilterValue: recruitmentID },
                                { FilterKey: "JobCodeId", Operator: "eq", FilterValue: jobCodeID },
                                { FilterKey: "StatusId", Operator: "in", FilterValue: exports.HOD_SCORECARD_STATUS_IDS },
                                { FilterKey: "ItemCreated", Operator: "eq", FilterValue: "No" },
                            ],
                            Topcount: 500,
                        })];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.map(function (item) {
                            var _a, _b, _c;
                            return ({
                                id: item.ID,
                                recruitmentID: ((_a = item.RecruitmentID) === null || _a === void 0 ? void 0 : _a.ID) || item.RecruitmentIDId || recruitmentID,
                                jobCode: ((_b = item.JobCode) === null || _b === void 0 ? void 0 : _b.JobCode) || "",
                                jobCodeID: item.JobCodeId || jobCodeID,
                                fullName: [item.FristName, item.MiddleName, item.LastName].filter(Boolean).join(" ").trim(),
                                nationality: item.Nationality || "",
                                gender: item.Gender || "",
                                status: ((_c = item.Status) === null || _c === void 0 ? void 0 : _c.StatusDescription) || "",
                                statusId: item.StatusId || 0,
                                interviewDate: item.InterviewDate || "",
                                interviewLevel: item.InterviewLevel || "",
                                grade: item.JobGrade || "",
                                department: item.Department || "",
                                gpa: item.GPA || "",
                            });
                        })];
                case 2:
                    e_2 = _a.sent();
                    console.error("[fetchCandidatesForJob]", e_2);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=Reviewscorecardlistservice.js.map