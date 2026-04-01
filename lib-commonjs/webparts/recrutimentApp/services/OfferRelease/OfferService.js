"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Config_1 = require("../../utilities/Config");
var ServiceExport_1 = require("../ServiceExport");
var spservice_1 = tslib_1.__importDefault(require("../SPService/spservice"));
var OfferService = /** @class */ (function () {
    function OfferService() {
    }
    OfferService.prototype.GetSelectedCandidate = function (RecID, CandidateID, SelectedCandidateID, JobRequestID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var queries, _a, batchRes, careerRes, recruitment, recruitmentPosition, candidatePersonal, candidateSelected, ref, mappedData, error_1;
            var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
            return tslib_1.__generator(this, function (_2) {
                switch (_2.label) {
                    case 0:
                        _2.trys.push([0, 2, , 3]);
                        queries = [
                            {
                                StateValue: 1,
                                ListName: Config_1.ListNames.HRMSRecruitmentDptDetails,
                                Filter: [{ FilterKey: "ID", Operator: "eq", FilterValue: RecID }],
                                FilterCondition: "and",
                                select: [
                                    "*",
                                    "Department/DepartmentName",
                                    "Department/Code",
                                    "SubDepartment/SubDepTitle",
                                    "Section/SectionName",
                                    "DepartmentCode/DptCode",
                                    "Status/StatusDescription",
                                    "Action/Action",
                                    "JobCode/JobCode",
                                    "JobCode/ID",
                                    "BusinessUnitCode/BusineesUnitCode",
                                ],
                                expand: [
                                    "Department",
                                    "SubDepartment",
                                    "Section",
                                    "DepartmentCode",
                                    "Status",
                                    "Action",
                                    "JobCode",
                                    "BusinessUnitCode",
                                ],
                            },
                            {
                                StateValue: 2,
                                ListName: Config_1.ListNames.HRMSRecruitmentPositionDetails,
                                Filter: [
                                    { FilterKey: "RecruitmentID", Operator: "eq", FilterValue: RecID },
                                ],
                                FilterCondition: "and",
                                select: [
                                    "*",
                                    "JobTitleEnglish/JobTitleInEnglish",
                                    "JobTitleEnglish/JobCode",
                                    "DRCGrade/DRCGrade",
                                    "PatersonGrade/PatersonGrade",
                                    "JobTitleFrench/JobTitleInFrench",
                                ],
                                expand: [
                                    "JobTitleEnglish",
                                    "DRCGrade",
                                    "JobTitleFrench",
                                    "PatersonGrade",
                                ],
                            },
                            {
                                StateValue: 3,
                                ListName: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                                Filter: [
                                    { FilterKey: "ID", Operator: "eq", FilterValue: CandidateID },
                                ],
                                FilterCondition: "and",
                                select: ["*", "Status/StatusDescription", "RecruitmentID/Id"],
                                expand: ["RecruitmentID", "Status"],
                            },
                            {
                                StateValue: 4,
                                ListName: Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD,
                                Filter: [
                                    {
                                        FilterKey: "ID",
                                        Operator: "eq",
                                        FilterValue: SelectedCandidateID,
                                    },
                                ],
                                FilterCondition: "and",
                                select: [
                                    "*",
                                    "Status/StatusDescription",
                                    "RecruitmentID/Id",
                                    "CandidateID/ID",
                                    "PositionID/PositionID",
                                ],
                                expand: ["RecruitmentID", "Status", "CandidateID", "PositionID"],
                            },
                        ];
                        return [4 /*yield*/, Promise.all([
                                spservice_1.default.batchGet(queries),
                                ServiceExport_1.CandidateTable.fetchCandidateDetails(JobRequestID),
                            ])];
                    case 1:
                        _a = _2.sent(), batchRes = _a[0], careerRes = _a[1];
                        recruitment = (_b = batchRes[1]) === null || _b === void 0 ? void 0 : _b[0];
                        recruitmentPosition = (_c = batchRes[2]) === null || _c === void 0 ? void 0 : _c[0];
                        candidatePersonal = (_d = batchRes[3]) === null || _d === void 0 ? void 0 : _d[0];
                        candidateSelected = (_e = batchRes[4]) === null || _e === void 0 ? void 0 : _e[0];
                        ref = (_g = (_f = careerRes === null || careerRes === void 0 ? void 0 : careerRes.data) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.PreviousEmployerDetails;
                        mappedData = {
                            JobTiltle: (_h = recruitmentPosition === null || recruitmentPosition === void 0 ? void 0 : recruitmentPosition.JobTitleEnglish) === null || _h === void 0 ? void 0 : _h.JobTitleInEnglish,
                            JobCode: (_j = recruitmentPosition === null || recruitmentPosition === void 0 ? void 0 : recruitmentPosition.JobTitleEnglish) === null || _j === void 0 ? void 0 : _j.JobCode,
                            positionID: (_k = candidateSelected === null || candidateSelected === void 0 ? void 0 : candidateSelected.PositionID) === null || _k === void 0 ? void 0 : _k.PositionID,
                            ApplicantName: candidatePersonal === null || candidatePersonal === void 0 ? void 0 : candidatePersonal.ApplicantName,
                            Nationality: candidatePersonal === null || candidatePersonal === void 0 ? void 0 : candidatePersonal.Nationality,
                            Gender: candidatePersonal === null || candidatePersonal === void 0 ? void 0 : candidatePersonal.Gender,
                            ProofOfIdentity: candidatePersonal === null || candidatePersonal === void 0 ? void 0 : candidatePersonal.ProofOfIdentity,
                            IdentityNumber: candidatePersonal === null || candidatePersonal === void 0 ? void 0 : candidatePersonal.IdentityNumber,
                            Email: candidatePersonal === null || candidatePersonal === void 0 ? void 0 : candidatePersonal.Email,
                            Location: candidatePersonal === null || candidatePersonal === void 0 ? void 0 : candidatePersonal.Location,
                            BusinessUnitCode: (_l = recruitment === null || recruitment === void 0 ? void 0 : recruitment.BusinessUnitCode) === null || _l === void 0 ? void 0 : _l.BusineesUnitCode,
                            Department: (_m = recruitment === null || recruitment === void 0 ? void 0 : recruitment.Department) === null || _m === void 0 ? void 0 : _m.DepartmentName,
                            SubDepartment: (_o = recruitment === null || recruitment === void 0 ? void 0 : recruitment.SubDepartment) === null || _o === void 0 ? void 0 : _o.SubDepTitle,
                            Section: (_p = recruitment === null || recruitment === void 0 ? void 0 : recruitment.Section) === null || _p === void 0 ? void 0 : _p.SectionName,
                            DepartmentCode: (_q = recruitment === null || recruitment === void 0 ? void 0 : recruitment.DepartmentCode) === null || _q === void 0 ? void 0 : _q.DptCode,
                            EmploymentCategory: recruitment === null || recruitment === void 0 ? void 0 : recruitment.EmploymentCategory,
                            TypeofContract: recruitment === null || recruitment === void 0 ? void 0 : recruitment.TypeofContract,
                            AreaofWork: recruitment === null || recruitment === void 0 ? void 0 : recruitment.AreaofWork,
                            JoiningDate: (_t = (_s = (_r = careerRes === null || careerRes === void 0 ? void 0 : careerRes.data) === null || _r === void 0 ? void 0 : _r[0]) === null || _s === void 0 ? void 0 : _s.joiningDate) !== null && _t !== void 0 ? _t : "-",
                            NoticePeriod: (_w = (_v = (_u = careerRes === null || careerRes === void 0 ? void 0 : careerRes.data) === null || _u === void 0 ? void 0 : _u[0]) === null || _v === void 0 ? void 0 : _v.noticePeriod) !== null && _w !== void 0 ? _w : "-",
                            ReferenceName: (_x = ref === null || ref === void 0 ? void 0 : ref.name) !== null && _x !== void 0 ? _x : "-",
                            ReferenceDesignation: (_y = ref === null || ref === void 0 ? void 0 : ref.Designation) !== null && _y !== void 0 ? _y : "-",
                            ReferenceEmail: (_z = ref === null || ref === void 0 ? void 0 : ref.Email) !== null && _z !== void 0 ? _z : "-",
                            ReferencePhone: (_0 = ref === null || ref === void 0 ? void 0 : ref.ContractNumber) !== null && _0 !== void 0 ? _0 : "-",
                            ReferenceCompanyName: (_1 = ref === null || ref === void 0 ? void 0 : ref.CompanyName) !== null && _1 !== void 0 ? _1 : "-",
                        };
                        return [2 /*return*/, {
                                data: mappedData,
                                status: 200,
                                message: "Selected candidate fetched successfully",
                            }];
                    case 2:
                        error_1 = _2.sent();
                        console.error("GetSelectedCandidate error:", error_1);
                        return [2 /*return*/, {
                                data: null,
                                status: 500,
                                message: "Error fetching selected candidate",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return OfferService;
}());
exports.default = OfferService;
//# sourceMappingURL=OfferService.js.map