"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var moment_1 = tslib_1.__importDefault(require("moment"));
var CareerPortalAPI_1 = require("../AxiosService/CareerPortalAPI");
var ICandidateService_1 = require("./ICandidateService");
var ConditionConfig_1 = require("../../utilities/ConditionConfig");
var ServiceExport_1 = require("../ServiceExport");
var reusehooks_1 = require("../../components/Hooks/reusehooks");
var dateConfigfn_1 = require("../../components/Hooks/dateConfigfn");
var spservice_1 = tslib_1.__importStar(require("../SPService/spservice"));
var Config_1 = require("../../utilities/Config");
var ApiConfig_1 = require("../../utilities/ApiConfig");
var CandidateService = /** @class */ (function () {
    function CandidateService() {
    }
    CandidateService.prototype.getCandidateDetailsInJobCode = function (FilterValue) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res, totalItems_1, mappedData, error_1;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, CareerPortalAPI_1.getProfileData.GetProfileByJobCode(FilterValue)];
                    case 1:
                        res = _c.sent();
                        if (!((_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.data)) {
                            return [2 /*return*/, {
                                    data: [],
                                    status: 200,
                                    message: "No candidate data",
                                }];
                        }
                        totalItems_1 = ((_b = res.data.pagination) === null || _b === void 0 ? void 0 : _b.totalItems) || 0;
                        mappedData = res.data.data.map(function (item, index) {
                            var _a, _b, _c, _d;
                            var JobCode = (_a = item === null || item === void 0 ? void 0 : item.jobCode) === null || _a === void 0 ? void 0 : _a.split("-")[0];
                            var CreatedBy = typeof (item === null || item === void 0 ? void 0 : item.createdBy) === "string" &&
                                item.createdBy.startsWith("ANT")
                                ? "Agent"
                                : /^\d+$/.test(item === null || item === void 0 ? void 0 : item.createdBy)
                                    ? "Candidate"
                                    : "Internal Employee";
                            return {
                                SNO: index + 1,
                                CandidateID: item === null || item === void 0 ? void 0 : item.jobRequestId,
                                ApplicantName: item === null || item === void 0 ? void 0 : item.applicantName,
                                PositionTitle: (_b = item === null || item === void 0 ? void 0 : item.jobTitle) === null || _b === void 0 ? void 0 : _b.displayText,
                                JobCode: JobCode,
                                Status: (_c = item === null || item === void 0 ? void 0 : item.workflowStatus) === null || _c === void 0 ? void 0 : _c.displayText,
                                workflowStatusId: item === null || item === void 0 ? void 0 : item.workflowStatusId,
                                createdOn: (0, moment_1.default)(item === null || item === void 0 ? void 0 : item.createdOn).format("DD/MM/YYYY"),
                                TotalItems: totalItems_1,
                                applicationStatusId: item === null || item === void 0 ? void 0 : item.applicationStatusId,
                                applicationStatus: (_d = item === null || item === void 0 ? void 0 : item.applicationStatus) === null || _d === void 0 ? void 0 : _d.displayText,
                                createdBy: CreatedBy,
                                tblProfilesKcsas: (item === null || item === void 0 ? void 0 : item.tblProfilesKcsas) || [],
                            };
                        });
                        // console.log("Mapped Candidate Data:", mappedData);
                        return [2 /*return*/, {
                                data: mappedData,
                                status: 200,
                                message: "Get Candidate details",
                            }];
                    case 2:
                        error_1 = _c.sent();
                        console.error("Error Get Candidate details:", error_1);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error Get Candidate details",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CandidateService.prototype.GetDashboardDetailsL2 = function (filterParam, filterConditions) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var GridResult, res, ids, recruitmentFilter, error_2;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        GridResult = [];
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                                Select: "*,JobCode/JobCode,Status/StatusDescription,RecruitmentID/Id",
                                Filter: filterParam,
                                FilterCondition: filterConditions,
                                Expand: "RecruitmentID,Status,JobCode",
                                Topcount: ApiConfig_1.count.Topcount,
                                Orderby: "ID",
                                Orderbydecorasc: true,
                            })];
                    case 1:
                        res = _a.sent();
                        if (!res.length) {
                            return [2 /*return*/, { data: [], status: 200, message: "No records found" }];
                        }
                        ids = res
                            .map(function (item) { var _a; return (_a = item.RecruitmentID) === null || _a === void 0 ? void 0 : _a.Id; })
                            .filter(Boolean);
                        if (!ids.length) {
                            return [2 /*return*/, {
                                    data: [],
                                    status: 200,
                                    message: "No linked recruitment records found",
                                }];
                        }
                        recruitmentFilter = [
                            { FilterKey: "ID", Operator: "in", FilterValue: ids },
                        ];
                        return [4 /*yield*/, Promise.all(res.map(function (item, index) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var GradeLevel, err_1;
                                var _a, _b, _c;
                                return tslib_1.__generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            _d.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, ServiceExport_1.masterService.GetGradeLevel(item === null || item === void 0 ? void 0 : item.JobGrade)];
                                        case 1:
                                            GradeLevel = _d.sent();
                                            return [3 /*break*/, 3];
                                        case 2:
                                            err_1 = _d.sent();
                                            console.error("GradeLevel API failed:", err_1);
                                            GradeLevel = { data: [] }; // fallback
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/, {
                                                SNO: index + 1,
                                                CandidateID: item.ID,
                                                ApplicantName: [item.FristName, item.MiddleName, item.LastName]
                                                    .filter(Boolean)
                                                    .join(" ")
                                                    .trim(),
                                                PositionTitle: item === null || item === void 0 ? void 0 : item.PositionTitle,
                                                JobCode: (_a = item === null || item === void 0 ? void 0 : item.JobCode) === null || _a === void 0 ? void 0 : _a.JobCode,
                                                JobGrade: item === null || item === void 0 ? void 0 : item.JobGrade,
                                                Nationality: item === null || item === void 0 ? void 0 : item.Nationality,
                                                interviewLevels: (GradeLevel === null || GradeLevel === void 0 ? void 0 : GradeLevel.data) || [],
                                                jobrequestID: item === null || item === void 0 ? void 0 : item.JobRequestID,
                                                Status: (_c = (_b = item === null || item === void 0 ? void 0 : item.Status) === null || _b === void 0 ? void 0 : _b.StatusDescription) !== null && _c !== void 0 ? _c : "",
                                                workflowStatusId: item === null || item === void 0 ? void 0 : item.StatusId,
                                                createdOn: (0, moment_1.default)(item === null || item === void 0 ? void 0 : item.Created).format("DD/MM/YYYY"),
                                                TotalItems: 0,
                                                applicationStatusId: "",
                                                applicationStatus: "",
                                                createdBy: item.ExternalAgentDetails,
                                                tblProfilesKcsas: [],
                                            }];
                                    }
                                });
                            }); }))];
                    case 2:
                        GridResult = _a.sent();
                        return [2 /*return*/, { data: GridResult, status: 200, message: "Success" }];
                    case 3:
                        error_2 = _a.sent();
                        console.error("Error fetching from Candidate details:", error_2);
                        return [2 /*return*/, { data: [], status: 500, message: "Error fetching data" }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CandidateService.prototype.fetchCandidateDetails = function (CandidateID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var GetProfileByJobCodeData_1, error_3;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        GetProfileByJobCodeData_1 = [];
                        return [4 /*yield*/, CareerPortalAPI_1.getProfileData
                                .getCandidateProfile(CandidateID)
                                .then(function (res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var op, CandidateCV, BusinessLinkPath, BusinessDocument, FamilyLinkPath, FamilyDocument, ProofIdentity, totalExperienceYears, CountryCode, profileExperiance, dob, today, age, monthDiff, dayDiff, getOptAnswers, profileXAgent, AgenName, IdentityID, familyDetails, emergencyContacts, employeeReferenceDetail, companyDetails, PPEData, PPEMaster, ppeMap_1, JobCode, willingRelocated, code, PreviousEmployer, candidateLanguages, _a, years, months, formattedExperience, ContactNumber, OverallAttachment, GetProfileDahboard;
                                var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59, _60, _61, _62, _63, _64, _65, _66, _67, _68, _69, _70, _71, _72, _73, _74, _75, _76, _77, _78, _79, _80, _81, _82, _83, _84, _85, _86, _87, _88, _89, _90, _91, _92, _93, _94, _95, _96, _97, _98, _99, _100, _101, _102, _103, _104, _105, _106, _107, _108, _109, _110, _111;
                                return tslib_1.__generator(this, function (_112) {
                                    switch (_112.label) {
                                        case 0:
                                            op = res.data.data;
                                            return [4 /*yield*/, ServiceExport_1.CommonServices.GetDocumentinUrl((_b = op === null || op === void 0 ? void 0 : op.document) === null || _b === void 0 ? void 0 : _b.filePath)];
                                        case 1:
                                            CandidateCV = _112.sent();
                                            BusinessLinkPath = (_c = op === null || op === void 0 ? void 0 : op.profile) === null || _c === void 0 ? void 0 : _c.profileDetailAttachments.filter(function (item) { return item.attachmentTypeCoe === "PA01"; });
                                            return [4 /*yield*/, ServiceExport_1.CommonServices.GetDocumentinUrl((_e = (_d = BusinessLinkPath[0]) === null || _d === void 0 ? void 0 : _d.document) === null || _e === void 0 ? void 0 : _e.filePath)];
                                        case 2:
                                            BusinessDocument = _112.sent();
                                            FamilyLinkPath = (_f = op === null || op === void 0 ? void 0 : op.profile) === null || _f === void 0 ? void 0 : _f.profileDetailAttachments.filter(function (item) { return item.attachmentTypeCoe === "PA02"; });
                                            return [4 /*yield*/, ServiceExport_1.CommonServices.GetDocumentinUrl((_h = (_g = FamilyLinkPath[0]) === null || _g === void 0 ? void 0 : _g.document) === null || _h === void 0 ? void 0 : _h.filePath)];
                                        case 3:
                                            FamilyDocument = _112.sent();
                                            return [4 /*yield*/, ServiceExport_1.masterService.GetAllMaster(ConditionConfig_1.CategoryID.ProofofIdentity)];
                                        case 4:
                                            ProofIdentity = _112.sent();
                                            totalExperienceYears = (0, reusehooks_1.calculateTotalExperienceYears)((_j = op === null || op === void 0 ? void 0 : op.profile) === null || _j === void 0 ? void 0 : _j.profileDetailExperiences);
                                            return [4 /*yield*/, ServiceExport_1.masterService.GetCountryMaster()];
                                        case 5:
                                            CountryCode = _112.sent();
                                            profileExperiance = Array.isArray((_k = op === null || op === void 0 ? void 0 : op.profile) === null || _k === void 0 ? void 0 : _k.profileDetailExperiences) &&
                                                op.profile.profileDetailExperiences.length > 0
                                                ? op.profile.profileDetailExperiences[op.profile.profileDetailExperiences.length - 1]
                                                : undefined;
                                            dob = new Date(new Date((_l = op === null || op === void 0 ? void 0 : op.profile) === null || _l === void 0 ? void 0 : _l.dob));
                                            today = new Date();
                                            age = today.getFullYear() - dob.getFullYear();
                                            monthDiff = today.getMonth() - dob.getMonth();
                                            dayDiff = today.getDate() - dob.getDate();
                                            if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                                                age--;
                                            }
                                            getOptAnswers = (_m = op === null || op === void 0 ? void 0 : op.profile) === null || _m === void 0 ? void 0 : _m.profileXOptAnswers.filter(function (item) { var _a; return ((_a = item.question) === null || _a === void 0 ? void 0 : _a.scopeId) === "S7"; }).sort(function (a, b) {
                                                var textA = typeof a.text === "string" ? a.text : "";
                                                var textB = typeof b.text === "string" ? b.text : "";
                                                return textA.localeCompare(textB);
                                            });
                                            profileXAgent = (_o = op === null || op === void 0 ? void 0 : op.profile) === null || _o === void 0 ? void 0 : _o.profileXAgent;
                                            AgenName = !profileXAgent ||
                                                (Array.isArray(profileXAgent) && profileXAgent.length === 0)
                                                ? ((_p = op === null || op === void 0 ? void 0 : op.profile) === null || _p === void 0 ? void 0 : _p.kcsaEmployees) &&
                                                    ((_q = op === null || op === void 0 ? void 0 : op.profile) === null || _q === void 0 ? void 0 : _q.kcsaEmployees.length) === 0
                                                    ? "Candidate"
                                                    : "Internal Employee"
                                                : (profileXAgent === null || profileXAgent === void 0 ? void 0 : profileXAgent.agentCode) === ConditionConfig_1.agentCode.RecruitmentHR
                                                    ? ConditionConfig_1.RoleName.RecruitmentHR
                                                    : ((_r = profileXAgent === null || profileXAgent === void 0 ? void 0 : profileXAgent.agent) === null || _r === void 0 ? void 0 : _r.name) || "";
                                            IdentityID = (_s = ProofIdentity.data) === null || _s === void 0 ? void 0 : _s.filter(function (item) { var _a; return (item === null || item === void 0 ? void 0 : item.value) === ((_a = op === null || op === void 0 ? void 0 : op.profile) === null || _a === void 0 ? void 0 : _a.identityTypeId); });
                                            familyDetails = (_u = (_t = op === null || op === void 0 ? void 0 : op.profile) === null || _t === void 0 ? void 0 : _t.familyDetails) === null || _u === void 0 ? void 0 : _u.map(function (item) {
                                                var _a, _b;
                                                var code = (0, reusehooks_1.getcountryCode)((_a = CountryCode === null || CountryCode === void 0 ? void 0 : CountryCode.data) !== null && _a !== void 0 ? _a : [], item === null || item === void 0 ? void 0 : item.contactNumber);
                                                return {
                                                    name: item === null || item === void 0 ? void 0 : item.name,
                                                    // "age": item?.age,
                                                    // "genderId": item?.genderId,
                                                    relationshipDetail: (_b = item === null || item === void 0 ? void 0 : item.relationshipDetail) === null || _b === void 0 ? void 0 : _b.displayText,
                                                    contactNumber: code,
                                                };
                                            });
                                            emergencyContacts = (_w = (_v = op === null || op === void 0 ? void 0 : op.profile) === null || _v === void 0 ? void 0 : _v.emergencyContacts) === null || _w === void 0 ? void 0 : _w.map(function (item) {
                                                var _a, _b;
                                                var code = (0, reusehooks_1.getcountryCode)((_a = CountryCode === null || CountryCode === void 0 ? void 0 : CountryCode.data) !== null && _a !== void 0 ? _a : [], item === null || item === void 0 ? void 0 : item.contactNumber);
                                                return {
                                                    name: item === null || item === void 0 ? void 0 : item.contactName,
                                                    // "age": item?.age,
                                                    // "genderId": item?.genderId,
                                                    relationshipDetail: (_b = item === null || item === void 0 ? void 0 : item.relationshipDetail) === null || _b === void 0 ? void 0 : _b.displayText,
                                                    contactNumber: code,
                                                };
                                            });
                                            employeeReferenceDetail = {
                                                empId: (_y = (_x = op === null || op === void 0 ? void 0 : op.profile) === null || _x === void 0 ? void 0 : _x.employeeReferenceDetails) === null || _y === void 0 ? void 0 : _y.empId,
                                                empName: (_0 = (_z = op === null || op === void 0 ? void 0 : op.profile) === null || _z === void 0 ? void 0 : _z.employeeReferenceDetails) === null || _0 === void 0 ? void 0 : _0.empName,
                                                empEmail: (_2 = (_1 = op === null || op === void 0 ? void 0 : op.profile) === null || _1 === void 0 ? void 0 : _1.employeeReferenceDetails) === null || _2 === void 0 ? void 0 : _2.empEmail,
                                                company: (_4 = (_3 = op === null || op === void 0 ? void 0 : op.profile) === null || _3 === void 0 ? void 0 : _3.employeeReferenceDetails) === null || _4 === void 0 ? void 0 : _4.company,
                                            };
                                            companyDetails = {
                                                operation: (_6 = (_5 = op === null || op === void 0 ? void 0 : op.profile) === null || _5 === void 0 ? void 0 : _5.profileDetailEmploymentHistory) === null || _6 === void 0 ? void 0 : _6.workedOperation,
                                                role: (_8 = (_7 = op === null || op === void 0 ? void 0 : op.profile) === null || _7 === void 0 ? void 0 : _7.profileDetailEmploymentHistory) === null || _8 === void 0 ? void 0 : _8.workRole,
                                                region: (_10 = (_9 = op === null || op === void 0 ? void 0 : op.profile) === null || _9 === void 0 ? void 0 : _9.profileDetailEmploymentHistory) === null || _10 === void 0 ? void 0 : _10.territory,
                                            };
                                            PPEData = [];
                                            if (!(op === null || op === void 0 ? void 0 : op.tblJobProfilePpeRequests)) return [3 /*break*/, 7];
                                            return [4 /*yield*/, CareerPortalAPI_1.PPEMasterTable.getPPEMaster()];
                                        case 6:
                                            PPEMaster = _112.sent();
                                            ppeMap_1 = new Map(PPEMaster.data.data.map(function (ppe) { return [ppe.id, ppe]; }));
                                            PPEData = op.tblJobProfilePpeRequests.map(function (item) {
                                                var _a, _b, _c;
                                                var ppe = ppeMap_1.get(item.ppeid);
                                                var size = (_a = ppe === null || ppe === void 0 ? void 0 : ppe.tblMstPpeSizes) === null || _a === void 0 ? void 0 : _a.find(function (s) { return s.ppedid === item.sizeId; });
                                                return {
                                                    PPEType: (_b = ppe === null || ppe === void 0 ? void 0 : ppe.ppename) !== null && _b !== void 0 ? _b : "",
                                                    PPESize: (_c = size === null || size === void 0 ? void 0 : size.sizeText) !== null && _c !== void 0 ? _c : "",
                                                };
                                            });
                                            _112.label = 7;
                                        case 7:
                                            JobCode = (_11 = op === null || op === void 0 ? void 0 : op.jobCode) === null || _11 === void 0 ? void 0 : _11.split("-")[0];
                                            willingRelocated = getOptAnswers.filter(function (item) { var _a; return ((_a = item.question) === null || _a === void 0 ? void 0 : _a.quesContentId) === ConditionConfig_1.quesContentId.WillingRelocate; });
                                            code = (0, reusehooks_1.getcountryCode)((_12 = CountryCode === null || CountryCode === void 0 ? void 0 : CountryCode.data) !== null && _12 !== void 0 ? _12 : [], profileExperiance === null || profileExperiance === void 0 ? void 0 : profileExperiance.refMobile);
                                            PreviousEmployer = {
                                                name: profileExperiance === null || profileExperiance === void 0 ? void 0 : profileExperiance.refName,
                                                Designation: (_13 = profileExperiance === null || profileExperiance === void 0 ? void 0 : profileExperiance.refDesignationDetail) === null || _13 === void 0 ? void 0 : _13.displayText,
                                                Email: profileExperiance === null || profileExperiance === void 0 ? void 0 : profileExperiance.refEmail,
                                                ContractNumber: code !== null && code !== void 0 ? code : "",
                                                CompanyName: profileExperiance === null || profileExperiance === void 0 ? void 0 : profileExperiance.company,
                                            };
                                            candidateLanguages = ((_15 = (_14 = op === null || op === void 0 ? void 0 : op.profile) === null || _14 === void 0 ? void 0 : _14.profileDetailLanguages) === null || _15 === void 0 ? void 0 : _15.map(function (item) { return item.language; })) || [];
                                            _a = ((_17 = (_16 = op === null || op === void 0 ? void 0 : op.profile) === null || _16 === void 0 ? void 0 : _16.totalYearOfExperiance) !== null && _17 !== void 0 ? _17 : "0-0").split("-"), years = _a[0], months = _a[1];
                                            formattedExperience = "".concat(years, " years ").concat(months, " months");
                                            ContactNumber = (0, reusehooks_1.getcountryCode)((_18 = CountryCode === null || CountryCode === void 0 ? void 0 : CountryCode.data) !== null && _18 !== void 0 ? _18 : [], (_19 = op === null || op === void 0 ? void 0 : op.profile) === null || _19 === void 0 ? void 0 : _19.contactNumber1);
                                            OverallAttachment = tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray([], (CandidateCV.data.length > 0
                                                ? [(0, dateConfigfn_1.toAttachment)("Candidate Resume", CandidateCV.data)]
                                                : []), true), (((_20 = FamilyDocument.data) === null || _20 === void 0 ? void 0 : _20.length) > 0
                                                ? [(0, dateConfigfn_1.toAttachment)("Family Link Document", FamilyDocument.data)]
                                                : []), true), (((_21 = BusinessDocument.data) === null || _21 === void 0 ? void 0 : _21.length) > 0
                                                ? [(0, dateConfigfn_1.toAttachment)("Business Link Document", BusinessDocument.data)]
                                                : []), true);
                                            GetProfileDahboard = {
                                                CandidateID: op === null || op === void 0 ? void 0 : op.jobRequestId,
                                                profileID: op === null || op === void 0 ? void 0 : op.profileId,
                                                JobCode: JobCode,
                                                JobTitle: (_23 = (_22 = op === null || op === void 0 ? void 0 : op.jobDetail) === null || _22 === void 0 ? void 0 : _22.descriptions_en) === null || _23 === void 0 ? void 0 : _23.jobTitle,
                                                ApplicantName: "".concat(((_24 = op === null || op === void 0 ? void 0 : op.profile) === null || _24 === void 0 ? void 0 : _24.firstName) || "", " ").concat(((_25 = op === null || op === void 0 ? void 0 : op.profile) === null || _25 === void 0 ? void 0 : _25.middleName) || "", " ").concat(((_26 = op === null || op === void 0 ? void 0 : op.profile) === null || _26 === void 0 ? void 0 : _26.lastName) || ""),
                                                ApplicantSurName: (_27 = op === null || op === void 0 ? void 0 : op.profile) === null || _27 === void 0 ? void 0 : _27.lastName,
                                                FristName: (_28 = op === null || op === void 0 ? void 0 : op.profile) === null || _28 === void 0 ? void 0 : _28.firstName,
                                                MiddleName: (_29 = op === null || op === void 0 ? void 0 : op.profile) === null || _29 === void 0 ? void 0 : _29.middleName,
                                                ResidentialAddress: (_31 = (_30 = op === null || op === void 0 ? void 0 : op.profile) === null || _30 === void 0 ? void 0 : _30.profileAddress) === null || _31 === void 0 ? void 0 : _31.address1,
                                                DOB: (_32 = op === null || op === void 0 ? void 0 : op.profile) === null || _32 === void 0 ? void 0 : _32.dob,
                                                ContactNumber: ContactNumber !== null && ContactNumber !== void 0 ? ContactNumber : "",
                                                Email: (_33 = op === null || op === void 0 ? void 0 : op.profile) === null || _33 === void 0 ? void 0 : _33.email,
                                                Nationality: (_35 = (_34 = op === null || op === void 0 ? void 0 : op.profile) === null || _34 === void 0 ? void 0 : _34.nationality) === null || _35 === void 0 ? void 0 : _35.displayText,
                                                NatioCode: (_37 = (_36 = op === null || op === void 0 ? void 0 : op.profile) === null || _36 === void 0 ? void 0 : _36.nationality) === null || _37 === void 0 ? void 0 : _37.value,
                                                Gender: ((_39 = (_38 = op === null || op === void 0 ? void 0 : op.profile) === null || _38 === void 0 ? void 0 : _38.gender) === null || _39 === void 0 ? void 0 : _39.displayText)
                                                    ? (_41 = (_40 = op === null || op === void 0 ? void 0 : op.profile) === null || _40 === void 0 ? void 0 : _40.gender) === null || _41 === void 0 ? void 0 : _41.displayText
                                                    : (_42 = op === null || op === void 0 ? void 0 : op.profile) === null || _42 === void 0 ? void 0 : _42.genderId,
                                                HighestQualification: (_44 = (_43 = op === null || op === void 0 ? void 0 : op.profile) === null || _43 === void 0 ? void 0 : _43.education) === null || _44 === void 0 ? void 0 : _44.displayText,
                                                ExperienceMining: ((_45 = op === null || op === void 0 ? void 0 : op.profile) === null || _45 === void 0 ? void 0 : _45.profileXAgent)
                                                    ? formattedExperience
                                                    : totalExperienceYears,
                                                ExperRelatedfield: (_46 = op === null || op === void 0 ? void 0 : op.profile) === null || _46 === void 0 ? void 0 : _46.releventExperience,
                                                Status: (_47 = op === null || op === void 0 ? void 0 : op.workflowStatus) === null || _47 === void 0 ? void 0 : _47.displayText,
                                                StatusId: op === null || op === void 0 ? void 0 : op.workflowStatusId,
                                                Agencies: AgenName,
                                                CandidateResume: CandidateCV.data,
                                                Comments: [], // CommentsData,
                                                workflowStatusId: op === null || op === void 0 ? void 0 : op.workflowStatusId,
                                                hrComments: op === null || op === void 0 ? void 0 : op.hrComments,
                                                JobVaildFromDate: (_48 = op === null || op === void 0 ? void 0 : op.jobDetail) === null || _48 === void 0 ? void 0 : _48.validFrom,
                                                JobVaildToDate: (_49 = op === null || op === void 0 ? void 0 : op.jobDetail) === null || _49 === void 0 ? void 0 : _49.validTo,
                                                CandidateResumeLink: (_50 = op === null || op === void 0 ? void 0 : op.document) === null || _50 === void 0 ? void 0 : _50.filePath,
                                                ConflictsOfInterest: (_53 = (_52 = (_51 = op === null || op === void 0 ? void 0 : op.profile) === null || _51 === void 0 ? void 0 : _51.profileXOptAnswers[0]) === null || _52 === void 0 ? void 0 : _52.answerContent) === null || _53 === void 0 ? void 0 : _53.contentEn,
                                                disability: ((_55 = (_54 = op === null || op === void 0 ? void 0 : op.profile) === null || _54 === void 0 ? void 0 : _54.profileDetailDisclosure) === null || _55 === void 0 ? void 0 : _55.hasDisability) === 1
                                                    ? "Yes"
                                                    : "No",
                                                disabilityReason: (_57 = (_56 = op === null || op === void 0 ? void 0 : op.profile) === null || _56 === void 0 ? void 0 : _56.profileDetailDisclosure) === null || _57 === void 0 ? void 0 : _57.disabilityDetails,
                                                identityValue: (_58 = op === null || op === void 0 ? void 0 : op.profile) === null || _58 === void 0 ? void 0 : _58.identityValue,
                                                identityType: IdentityID && IdentityID.length > 0
                                                    ? IdentityID[0].displayText
                                                    : "Passport",
                                                NumberOftax: (_60 = (_59 = op === null || op === void 0 ? void 0 : op.profile) === null || _59 === void 0 ? void 0 : _59.taxDependents) !== null && _60 !== void 0 ? _60 : "",
                                                CurrentEmployer: profileExperiance === null || profileExperiance === void 0 ? void 0 : profileExperiance.company,
                                                CurrentPosition: profileExperiance === null || profileExperiance === void 0 ? void 0 : profileExperiance.title,
                                                WillingToRelocate: (_62 = (_61 = willingRelocated[0]) === null || _61 === void 0 ? void 0 : _61.answerContent) === null || _62 === void 0 ? void 0 : _62.contentEn,
                                                previouslyworkedMine: ((_64 = (_63 = op === null || op === void 0 ? void 0 : op.profile) === null || _63 === void 0 ? void 0 : _63.profileDetailEmploymentHistory) === null || _64 === void 0 ? void 0 : _64.hasIvanhoeZijinExperienceId) === "1"
                                                    ? "Yes"
                                                    : ((_66 = (_65 = op === null || op === void 0 ? void 0 : op.profile) === null || _65 === void 0 ? void 0 : _65.profileDetailEmploymentHistory) === null || _66 === void 0 ? void 0 : _66.hasIvanhoeZijinExperienceId) === undefined
                                                        ? undefined
                                                        : "No",
                                                familylinks: ((_67 = op === null || op === void 0 ? void 0 : op.profile) === null || _67 === void 0 ? void 0 : _67.hasEmployeeRelation) === "1" ? "Yes" : "No",
                                                businesslinks: ((_68 = op === null || op === void 0 ? void 0 : op.profile) === null || _68 === void 0 ? void 0 : _68.hasBusinessLinks) === "1" ? "Yes" : "No",
                                                familyDocuments: FamilyDocument.data,
                                                businessDocuments: BusinessDocument.data,
                                                Age: String(age),
                                                CountryofOrgin: (_71 = (_70 = (_69 = op === null || op === void 0 ? void 0 : op.profile) === null || _69 === void 0 ? void 0 : _69.nationality) === null || _70 === void 0 ? void 0 : _70.displayText) !== null && _71 !== void 0 ? _71 : "",
                                                Citizenship: (_74 = (_73 = (_72 = op === null || op === void 0 ? void 0 : op.profile) === null || _72 === void 0 ? void 0 : _72.nationality) === null || _73 === void 0 ? void 0 : _73.displayText) !== null && _74 !== void 0 ? _74 : "",
                                                FamilyLink: (_76 = (_75 = FamilyLinkPath[0]) === null || _75 === void 0 ? void 0 : _75.document) === null || _76 === void 0 ? void 0 : _76.filePath,
                                                BusinessLink: (_78 = (_77 = BusinessLinkPath[0]) === null || _77 === void 0 ? void 0 : _77.document) === null || _78 === void 0 ? void 0 : _78.filePath,
                                                GPA: 0,
                                                COIAppreve: (_81 = (_80 = (_79 = op === null || op === void 0 ? void 0 : op.profile) === null || _79 === void 0 ? void 0 : _79.profileDetailCoi) === null || _80 === void 0 ? void 0 : _80.approver) !== null && _81 !== void 0 ? _81 : "",
                                                COIComments: (_84 = (_83 = (_82 = op === null || op === void 0 ? void 0 : op.profile) === null || _82 === void 0 ? void 0 : _82.profileDetailCoi) === null || _83 === void 0 ? void 0 : _83.comments) !== null && _84 !== void 0 ? _84 : "",
                                                COIReason: (_86 = (_85 = op === null || op === void 0 ? void 0 : op.profile) === null || _85 === void 0 ? void 0 : _85.coiReason) !== null && _86 !== void 0 ? _86 : "",
                                                countryOfResidency: (_89 = (_88 = (_87 = op === null || op === void 0 ? void 0 : op.profile) === null || _87 === void 0 ? void 0 : _87.countryOfResidencyDetail) === null || _88 === void 0 ? void 0 : _88.countryName) !== null && _89 !== void 0 ? _89 : "",
                                                residentStatus: ((_90 = op === null || op === void 0 ? void 0 : op.profile) === null || _90 === void 0 ? void 0 : _90.residentStatus) === "Y"
                                                    ? "Yes"
                                                    : ((_91 = op === null || op === void 0 ? void 0 : op.profile) === null || _91 === void 0 ? void 0 : _91.residentStatus) === "N"
                                                        ? "No"
                                                        : "",
                                                maritalStatus: (_94 = (_93 = (_92 = op === null || op === void 0 ? void 0 : op.profile) === null || _92 === void 0 ? void 0 : _92.maritalStatusDetail) === null || _93 === void 0 ? void 0 : _93.displayText) !== null && _94 !== void 0 ? _94 : "",
                                                childrenDetails: ((_95 = op === null || op === void 0 ? void 0 : op.profile) === null || _95 === void 0 ? void 0 : _95.nationalityId) === "N0"
                                                    ? familyDetails
                                                    : emergencyContacts,
                                                employeeReferenceDetails: employeeReferenceDetail,
                                                maritalStatusId: (_97 = (_96 = op === null || op === void 0 ? void 0 : op.profile) === null || _96 === void 0 ? void 0 : _96.maritalStatus) !== null && _97 !== void 0 ? _97 : "",
                                                joiningDate: (_98 = op === null || op === void 0 ? void 0 : op.startDate) !== null && _98 !== void 0 ? _98 : "",
                                                noticePeriod: (_99 = op === null || op === void 0 ? void 0 : op.noticePeriodDays) !== null && _99 !== void 0 ? _99 : "",
                                                hasIvanhoeZijinExperience: ((_101 = (_100 = op === null || op === void 0 ? void 0 : op.profile) === null || _100 === void 0 ? void 0 : _100.profileDetailEmploymentHistory) === null || _101 === void 0 ? void 0 : _101.hasIvanhoeZijinExperienceId) === "3"
                                                    ? "No"
                                                    : ((_105 = (_104 = (_103 = (_102 = op === null || op === void 0 ? void 0 : op.profile) === null || _102 === void 0 ? void 0 : _102.profileDetailEmploymentHistory) === null || _103 === void 0 ? void 0 : _103.hasIvanhoeZijinExperience) === null || _104 === void 0 ? void 0 : _104.displayText) !== null && _105 !== void 0 ? _105 : ""),
                                                companyDetails: companyDetails,
                                                businesslinkscompany: ((_106 = op === null || op === void 0 ? void 0 : op.profile) === null || _106 === void 0 ? void 0 : _106.businessLinkCompany) === "CD03"
                                                    ? (_107 = op === null || op === void 0 ? void 0 : op.profile) === null || _107 === void 0 ? void 0 : _107.whichCompany
                                                    : (_109 = (_108 = op === null || op === void 0 ? void 0 : op.profile) === null || _108 === void 0 ? void 0 : _108.businessLinkCompanyDetail) === null || _109 === void 0 ? void 0 : _109.displayText,
                                                PreviousEmployerDetails: PreviousEmployer,
                                                LanguageKnown: candidateLanguages,
                                                PPEDetails: PPEData,
                                                RoleProfile: [],
                                                OverallAtttachment: OverallAttachment,
                                                NationalityShort: ((_111 = (_110 = op === null || op === void 0 ? void 0 : op.profile) === null || _110 === void 0 ? void 0 : _110.nationality) === null || _111 === void 0 ? void 0 : _111.value) === ConditionConfig_1.NationalityCode.Nationals
                                                    ? "DRC"
                                                    : "EXPAT",
                                            };
                                            GetProfileByJobCodeData_1.push(GetProfileDahboard);
                                            return [2 /*return*/];
                                    }
                                });
                            }); })
                                .catch(function (error) {
                                console.log(error, "error");
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                data: GetProfileByJobCodeData_1,
                                status: 200,
                                message: "Success",
                            }];
                    case 2:
                        error_3 = _a.sent();
                        console.error("Error inserting data into HRMSRecruitmentDptDetails:", error_3);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error inserting data into HRMSRecruitmentDptDetails",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CandidateService.prototype.getCandidateDetailsL2 = function (CandidateID) {
        var _a, _b, _c, _d, _e, _f;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res, defaultGrade, defaultLevel, posRes, gr, _1, enriched, error_4;
            var _this = this;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 9, , 10]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                                Select: "*,JobCode/JobCode,RecruitmentID/ID,Status/ID,Status/StatusDescription,ID",
                                Expand: "JobCode,RecruitmentID,Status",
                                FilterCondition: "and",
                                Filter: [
                                    {
                                        FilterKey: "ID",
                                        Operator: "eq",
                                        FilterValue: CandidateID,
                                    },
                                ],
                                Topcount: 1000,
                            })];
                    case 1:
                        res = _g.sent();
                        defaultGrade = "", defaultLevel = "";
                        _g.label = 2;
                    case 2:
                        _g.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSRecruitmentPositionDetails,
                                Select: "*,PatersonGrade/PatersonGrade",
                                Expand: "PatersonGrade",
                                Filter: [
                                    {
                                        FilterKey: "RecruitmentID",
                                        Operator: "eq",
                                        FilterValue: (_b = (_a = res[0]) === null || _a === void 0 ? void 0 : _a.RecruitmentID) === null || _b === void 0 ? void 0 : _b.ID,
                                    },
                                ],
                            })];
                    case 3:
                        posRes = _g.sent();
                        defaultGrade =
                            ((_d = (_c = posRes === null || posRes === void 0 ? void 0 : posRes[0]) === null || _c === void 0 ? void 0 : _c.PatersonGrade) === null || _d === void 0 ? void 0 : _d.PatersonGrade) ||
                                ((_e = posRes === null || posRes === void 0 ? void 0 : posRes[0]) === null || _e === void 0 ? void 0 : _e.PatersonGrade) ||
                                "";
                        if (!defaultGrade) return [3 /*break*/, 5];
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSGradeMaster,
                                Select: "*",
                                Filter: [
                                    {
                                        FilterKey: "PatersonGrade",
                                        Operator: "eq",
                                        FilterValue: defaultGrade,
                                    },
                                ],
                            })];
                    case 4:
                        gr = _g.sent();
                        defaultLevel = ((_f = gr === null || gr === void 0 ? void 0 : gr[0]) === null || _f === void 0 ? void 0 : _f.Levels) || "";
                        _g.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        _1 = _g.sent();
                        return [3 /*break*/, 7];
                    case 7: return [4 /*yield*/, Promise.all((res || []).map(function (item) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var CandidateCV, BusinessDocument, FamilyDocument, OverallAttachment;
                            var _a, _b, _c, _d, _e;
                            return tslib_1.__generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0: return [4 /*yield*/, ServiceExport_1.CommonServices.GetDocumentinUrl(item === null || item === void 0 ? void 0 : item.CandidateResumeLink)];
                                    case 1:
                                        CandidateCV = _f.sent();
                                        return [4 /*yield*/, ServiceExport_1.CommonServices.GetDocumentinUrl(item === null || item === void 0 ? void 0 : item.BusinessLink)];
                                    case 2:
                                        BusinessDocument = _f.sent();
                                        return [4 /*yield*/, ServiceExport_1.CommonServices.GetDocumentinUrl(item === null || item === void 0 ? void 0 : item.FamilyLink)];
                                    case 3:
                                        FamilyDocument = _f.sent();
                                        OverallAttachment = tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray([], (CandidateCV.data.length > 0
                                            ? [(0, dateConfigfn_1.toAttachment)("Candidate Resume", CandidateCV.data)]
                                            : []), true), (((_a = FamilyDocument.data) === null || _a === void 0 ? void 0 : _a.length) > 0
                                            ? [(0, dateConfigfn_1.toAttachment)("Family Link Document", FamilyDocument.data)]
                                            : []), true), (((_b = BusinessDocument.data) === null || _b === void 0 ? void 0 : _b.length) > 0
                                            ? [(0, dateConfigfn_1.toAttachment)("Business Link Document", BusinessDocument.data)]
                                            : []), true);
                                        // const gpa = await _calculateGPA(candidateId);
                                        return [2 /*return*/, {
                                                CandidateID: item.ID,
                                                profileID: item.ProfileID,
                                                JobCode: (_c = item.JobCode) === null || _c === void 0 ? void 0 : _c.JobCode,
                                                JobTitle: item.JobTitle,
                                                ApplicantName: [item.FristName, item.MiddleName, item.LastName]
                                                    .filter(Boolean)
                                                    .join(" ")
                                                    .trim(),
                                                FristName: item.FristName,
                                                MiddleName: item.MiddleName,
                                                ResidentialAddress: item.ResidentialAddress,
                                                DOB: item.DOB,
                                                ContactNumber: item.ContactNumber,
                                                Email: item.Email,
                                                ApplicantSurName: item.LastName,
                                                Nationality: item.Nationality,
                                                Gender: item.Gender,
                                                HighestQualification: item.Qualification,
                                                ExperienceMining: item.TotalYearOfExperiance,
                                                ExperRelatedfield: item.ReleventExperience,
                                                Status: (_d = item === null || item === void 0 ? void 0 : item.Status) === null || _d === void 0 ? void 0 : _d.StatusDescription,
                                                StatusId: (_e = item.Status) === null || _e === void 0 ? void 0 : _e.ID,
                                                Agencies: item.Agencies,
                                                CandidateResume: CandidateCV.data,
                                                RoleProfile: [],
                                                OverallAtttachment: OverallAttachment,
                                                Comments: [],
                                                workflowStatusId: "",
                                                hrComments: "",
                                                JobVaildFromDate: "",
                                                JobVaildToDate: "",
                                                CandidateResumeLink: "",
                                                ConflictsOfInterest: (item === null || item === void 0 ? void 0 : item.ConflictsOfInterest) === "Yes" ? "Yes" : "No",
                                                disability: (item === null || item === void 0 ? void 0 : item.Disability) === "Yes" ? "Yes" : "No",
                                                disabilityReason: item === null || item === void 0 ? void 0 : item.DisabilityDetails,
                                                identityValue: "",
                                                identityType: "",
                                                NatioCode: item === null || item === void 0 ? void 0 : item.NationalityCode,
                                                Age: "",
                                                NumberOftax: item.NumberOfTaxDependents,
                                                CurrentEmployer: item === null || item === void 0 ? void 0 : item.LastOrCurrentEmployer,
                                                CurrentPosition: item === null || item === void 0 ? void 0 : item.LastOrCurrentPosition,
                                                WillingToRelocate: "",
                                                previouslyworkedMine: "",
                                                familylinks: "",
                                                businesslinks: "",
                                                familyDocuments: FamilyDocument.data,
                                                businessDocuments: BusinessDocument.data,
                                                CountryofOrgin: "",
                                                Citizenship: "",
                                                FamilyLink: "",
                                                BusinessLink: "",
                                                GPA: 0,
                                                COIAppreve: item === null || item === void 0 ? void 0 : item.COIEmail,
                                                COIComments: item === null || item === void 0 ? void 0 : item.COIComments,
                                                COIReason: item === null || item === void 0 ? void 0 : item.COIReason,
                                                countryOfResidency: "",
                                                residentStatus: "",
                                                maritalStatus: "",
                                                childrenDetails: [],
                                                employeeReferenceDetails: {},
                                                maritalStatusId: "",
                                                joiningDate: "",
                                                noticePeriod: "",
                                                hasIvanhoeZijinExperience: "",
                                                companyDetails: {},
                                                businesslinkscompany: "",
                                                PreviousEmployerDetails: {},
                                                LanguageKnown: [],
                                                PPEDetails: [],
                                                InterviewStartDate: (0, dateConfigfn_1.formatToDateTimeLocal)(item === null || item === void 0 ? void 0 : item.InterviewDate),
                                                InterviewStartTime: item === null || item === void 0 ? void 0 : item.InterviewTime,
                                                InterviewEndTime: item === null || item === void 0 ? void 0 : item.InterviewLink,
                                                NationalityShort: (item === null || item === void 0 ? void 0 : item.NationalityCode) === ConditionConfig_1.NationalityCode.Nationals
                                                    ? "DRC"
                                                    : "EXPAT",
                                            }];
                                }
                            });
                        }); }))];
                    case 8:
                        enriched = _g.sent();
                        return [2 /*return*/, {
                                data: enriched,
                                status: 200,
                                message: "Interview panel details fetched successfully",
                            }];
                    case 9:
                        error_4 = _g.sent();
                        console.error("fetchInterviewPanelDetails failed:", error_4);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error fetching interview panel details",
                            }];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    CandidateService.prototype.fetchInterviewPanelDetails = function (_a) {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        var BUCodeID = _a.BUCodeID, assignHREmail = _a.assignHREmail, candidateID = _a.candidateID, statusID = _a.statusID;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var empty, jdeQuery, userRoleQuery, batchRes, jdeItems, userRoles, jdeItem, panelRoleEntry, adGroupOptions, _o, existingLevel1, existingLevel2, levels, existingPanelFilter, existingPanelQuery, panelBatch, existingPanelItems, resolvedExistingPanel, nameTasks, assignHRId, nameResults, nameMap, basePanelLevel1, basePanelLevel2, adOptions, level1Panel, level2Panel, panelMember, panelMember2, result, error_5;
            var _this = this;
            return tslib_1.__generator(this, function (_p) {
                switch (_p.label) {
                    case 0:
                        empty = {
                            Level1: [],
                            Level2: [],
                        };
                        _p.label = 1;
                    case 1:
                        _p.trys.push([1, 11, , 12]);
                        jdeQuery = {
                            StateValue: 1,
                            ListName: Config_1.ListNames.JDEDataMapping,
                            Filter: [
                                {
                                    FilterKey: "BUCId",
                                    Operator: "eq",
                                    FilterValue: BUCodeID,
                                },
                            ],
                            FilterCondition: "and",
                            select: [
                                "*",
                                "BUC/BusineesUnitCode",
                                "LineManager/EMail",
                                "HOD/EMail",
                                "HR/EMail",
                                "EXCO/EMail",
                            ],
                            expand: ["BUC", "LineManager", "HOD", "HR", "EXCO"],
                        };
                        userRoleQuery = {
                            StateValue: 2,
                            ListName: Config_1.ListNames.HRMSRecruitmentUserRole,
                            Filter: [],
                            FilterCondition: "",
                            select: ["*"],
                            expand: [],
                        };
                        return [4 /*yield*/, spservice_1.default.batchGet([
                                jdeQuery,
                                userRoleQuery,
                            ])];
                    case 2:
                        batchRes = _p.sent();
                        jdeItems = (_b = batchRes[1]) !== null && _b !== void 0 ? _b : [];
                        userRoles = (_c = batchRes[2]) !== null && _c !== void 0 ? _c : [];
                        jdeItem = jdeItems[0];
                        if (!jdeItem) {
                            return [2 /*return*/, { data: empty, status: 200, message: "No JDE mapping found" }];
                        }
                        panelRoleEntry = userRoles.find(function (r) { return r.ID === Config_1.RoleID.InterviewPanel; });
                        if (!(panelRoleEntry === null || panelRoleEntry === void 0 ? void 0 : panelRoleEntry.ADGroupID)) return [3 /*break*/, 4];
                        return [4 /*yield*/, ServiceExport_1.CommonServices.GetADgruopsEmailIDs(panelRoleEntry.ADGroupID)];
                    case 3:
                        _o = ((_d = (_p.sent())
                            .data) !== null && _d !== void 0 ? _d : []);
                        return [3 /*break*/, 5];
                    case 4:
                        _o = [];
                        _p.label = 5;
                    case 5:
                        adGroupOptions = _o;
                        existingLevel1 = [];
                        existingLevel2 = [];
                        if (!(Number(statusID) ===
                            Config_1.StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel)) return [3 /*break*/, 8];
                        levels = Number(statusID) ===
                            Config_1.StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel
                            ? [ConditionConfig_1.InterviewLevels.Level1, ConditionConfig_1.InterviewLevels.Level2]
                            : [ConditionConfig_1.InterviewLevels.Level1];
                        existingPanelFilter = [
                            {
                                FilterKey: "CandidateID",
                                Operator: "eq",
                                FilterValue: candidateID,
                            },
                            { FilterKey: "InterviewLevel", Operator: "in", FilterValue: levels },
                        ];
                        existingPanelQuery = {
                            StateValue: 3,
                            ListName: Config_1.ListNames.HRMSInterviewPanelDetails,
                            Filter: existingPanelFilter,
                            FilterCondition: "and",
                            select: [
                                "ID",
                                "CandidateID/ID",
                                "RecruitmentID/ID",
                                "InterviewLevel",
                                "InterviewPanel/Id",
                                "InterviewPanel/Title",
                                "InterviewPanel/EMail",
                                "IsScoreSheetUploaded",
                            ],
                            expand: ["InterviewPanel", "RecruitmentID", "CandidateID"],
                        };
                        return [4 /*yield*/, spservice_1.default.batchGet([
                                existingPanelQuery,
                            ])];
                    case 6:
                        panelBatch = _p.sent();
                        existingPanelItems = (_e = panelBatch[3]) !== null && _e !== void 0 ? _e : [];
                        return [4 /*yield*/, Promise.all(existingPanelItems.map(function (item) { return (0, ICandidateService_1.toPanelEntry)(item); }))];
                    case 7:
                        resolvedExistingPanel = (_p.sent()).filter(function (e) { return e !== null; });
                        existingLevel1 = resolvedExistingPanel.filter(function (p) { return p.Levels === ConditionConfig_1.InterviewLevels.Level1; });
                        existingLevel2 = resolvedExistingPanel.filter(function (p) { return p.Levels === ConditionConfig_1.InterviewLevels.Level2; });
                        _p.label = 8;
                    case 8:
                        nameTasks = [];
                        return [4 /*yield*/, ServiceExport_1.CommonServices.getUserGuidByEmail(assignHREmail)];
                    case 9:
                        assignHRId = _p.sent();
                        if ((_f = jdeItem.LineManager) === null || _f === void 0 ? void 0 : _f.EMail)
                            nameTasks.push({
                                key: String(jdeItem === null || jdeItem === void 0 ? void 0 : jdeItem.LineManagerId),
                                email: jdeItem.LineManager.EMail,
                            });
                        if ((_g = jdeItem.HOD) === null || _g === void 0 ? void 0 : _g.EMail)
                            nameTasks.push({
                                key: String(jdeItem === null || jdeItem === void 0 ? void 0 : jdeItem.HODId),
                                email: jdeItem.HOD.EMail,
                            });
                        if ((_h = jdeItem.EXCO) === null || _h === void 0 ? void 0 : _h.EMail)
                            nameTasks.push({
                                key: String(jdeItem === null || jdeItem === void 0 ? void 0 : jdeItem.EXCOId),
                                email: jdeItem.EXCO.EMail,
                            });
                        if (assignHREmail)
                            nameTasks.push({
                                key: String((_j = assignHRId.data) === null || _j === void 0 ? void 0 : _j.key),
                                email: assignHREmail,
                            });
                        return [4 /*yield*/, Promise.all(nameTasks.map(function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var _a;
                                return tslib_1.__generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _a = {
                                                key: t.key
                                            };
                                            return [4 /*yield*/, (0, ICandidateService_1.resolveName)(t.email)];
                                        case 1: return [2 /*return*/, (_a.label = _b.sent(),
                                                _a)];
                                    }
                                });
                            }); }))];
                    case 10:
                        nameResults = _p.sent();
                        nameMap = Object.fromEntries(nameResults.map(function (r) { return [r.key, r.label]; }));
                        basePanelLevel1 = [];
                        basePanelLevel2 = [];
                        if (String(statusID) ===
                            Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview) {
                            if (jdeItem.LineManagerId && nameMap[String(jdeItem.LineManagerId)]) {
                                basePanelLevel1.push({
                                    value: jdeItem.LineManagerId,
                                    label: nameMap[String(jdeItem.LineManagerId)],
                                    Email: jdeItem.LineManager.EMail,
                                    Role: ConditionConfig_1.RoleName.LineManager,
                                });
                            }
                            if (jdeItem.HODId && nameMap[String(jdeItem.HODId)]) {
                                basePanelLevel1.push({
                                    value: jdeItem.HODId,
                                    label: nameMap[String(jdeItem.HODId)],
                                    Email: jdeItem.HOD.EMail,
                                    Role: ConditionConfig_1.RoleName.HOD,
                                });
                            }
                            if (((_k = assignHRId === null || assignHRId === void 0 ? void 0 : assignHRId.data) === null || _k === void 0 ? void 0 : _k.key) && nameMap[String(assignHRId.data.key)]) {
                                basePanelLevel1.push({
                                    value: assignHRId.data.key,
                                    label: nameMap[String(assignHRId.data.key)],
                                    Email: assignHREmail,
                                    Role: ConditionConfig_1.RoleName.RecruitmentHR,
                                });
                            }
                        }
                        else if (Number(statusID) ===
                            Config_1.StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel) {
                            // if (jdeItem.LineManagerId && nameMap[String(jdeItem.LineManagerId)]) {
                            //   basePanelLevel1.push({
                            //     value: jdeItem.LineManagerId,
                            //     label: nameMap[String(jdeItem.LineManagerId)],
                            //     Email: jdeItem.LineManager.EMail,
                            //     Role: RoleName.LineManager,
                            //   });
                            // }
                            // if (jdeItem.HODId && nameMap[String(jdeItem.HODId)]) {
                            //   basePanelLevel1.push({
                            //     value: jdeItem.HODId,
                            //     label: nameMap[String(jdeItem.HODId)],
                            //     Email: jdeItem.HOD.EMail,
                            //     Role: RoleName.HOD,
                            //   });
                            // }
                            //  if (assignHRId?.data?.key && nameMap[String(assignHRId.data.key)]) {
                            //   basePanelLevel1.push({
                            //     value: assignHRId.data.key,
                            //     label: nameMap[String(assignHRId.data.key)],
                            //     Email: assignHREmail,
                            //     Role: RoleName.RecruitmentHR,
                            //   });
                            // }
                            basePanelLevel1.push.apply(basePanelLevel1, existingLevel1);
                            if (jdeItem.EXCOId && nameMap[String(jdeItem.EXCOId)]) {
                                basePanelLevel2.push({
                                    value: jdeItem.EXCOId,
                                    label: nameMap[String(jdeItem.EXCOId)],
                                    Email: jdeItem.EXCO.EMail,
                                    Role: ConditionConfig_1.RoleName.EXCO,
                                });
                            }
                            if (((_l = assignHRId === null || assignHRId === void 0 ? void 0 : assignHRId.data) === null || _l === void 0 ? void 0 : _l.key) && nameMap[String(assignHRId.data.key)]) {
                                basePanelLevel2.push({
                                    value: assignHRId.data.key,
                                    label: nameMap[String(assignHRId.data.key)],
                                    Email: assignHREmail,
                                    Role: ConditionConfig_1.RoleName.RecruitmentHR,
                                });
                            }
                            if (jdeItem.HODId && nameMap[String(jdeItem.HODId)]) {
                                basePanelLevel2.push({
                                    value: jdeItem.HODId,
                                    label: nameMap[String(jdeItem.HODId)],
                                    Email: jdeItem.HOD.EMail,
                                    Role: ConditionConfig_1.RoleName.HOD,
                                });
                            }
                            basePanelLevel2.push.apply(basePanelLevel2, existingLevel2);
                        }
                        else {
                            basePanelLevel1.push.apply(basePanelLevel1, existingLevel1);
                            basePanelLevel2.push.apply(basePanelLevel2, existingLevel2);
                            if (jdeItem.LineManagerId && nameMap[String(jdeItem.LineManagerId)]) {
                                basePanelLevel1.push({
                                    value: jdeItem.LineManagerId,
                                    label: nameMap[String(jdeItem.LineManagerId)],
                                    Email: jdeItem.LineManager.EMail,
                                    Role: ConditionConfig_1.RoleName.LineManager,
                                });
                            }
                            if (jdeItem.HODId && nameMap[String(jdeItem.HODId)]) {
                                basePanelLevel1.push({
                                    value: jdeItem.HODId,
                                    label: nameMap[String(jdeItem.HODId)],
                                    Email: jdeItem.HOD.EMail,
                                    Role: ConditionConfig_1.RoleName.HOD,
                                });
                            }
                            if (((_m = assignHRId === null || assignHRId === void 0 ? void 0 : assignHRId.data) === null || _m === void 0 ? void 0 : _m.key) && nameMap[String(assignHRId.data.key)]) {
                                basePanelLevel1.push({
                                    value: assignHRId.data.key,
                                    label: nameMap[String(assignHRId.data.key)],
                                    Email: assignHREmail,
                                    Role: ConditionConfig_1.RoleName.RecruitmentHR,
                                });
                            }
                        }
                        adOptions = Array.isArray(adGroupOptions)
                            ? adGroupOptions.map(function (o) {
                                var _a, _b, _c, _d, _e;
                                return ({
                                    value: (_b = (_a = o.key) !== null && _a !== void 0 ? _a : o.Id) !== null && _b !== void 0 ? _b : 0,
                                    label: (_d = (_c = o.text) !== null && _c !== void 0 ? _c : o.label) !== null && _d !== void 0 ? _d : "",
                                    Email: (_e = o.Email) !== null && _e !== void 0 ? _e : "",
                                    Role: ConditionConfig_1.RoleName.InterviewPanel,
                                });
                            })
                            : [];
                        level1Panel = [];
                        level2Panel = [];
                        panelMember = (0, ICandidateService_1.dedupe)(basePanelLevel1);
                        if (panelMember.length === 3) {
                            level1Panel = (0, ICandidateService_1.dedupe)(basePanelLevel1);
                        }
                        else {
                            basePanelLevel1.push.apply(basePanelLevel1, adOptions);
                            level1Panel = (0, ICandidateService_1.dedupe)(basePanelLevel1);
                        }
                        panelMember2 = (0, ICandidateService_1.dedupe)(basePanelLevel2);
                        if (panelMember2.length === 3) {
                            level2Panel = (0, ICandidateService_1.dedupe)(basePanelLevel2);
                        }
                        else {
                            basePanelLevel2.push.apply(basePanelLevel2, adOptions);
                            level2Panel = (0, ICandidateService_1.dedupe)(basePanelLevel2);
                        }
                        result = {
                            Level1: level1Panel,
                            Level2: level2Panel,
                        };
                        return [2 /*return*/, {
                                data: result,
                                status: 200,
                                message: "Interview panel details fetched successfully",
                            }];
                    case 11:
                        error_5 = _p.sent();
                        console.error("fetchInterviewPanelDetails failed:", error_5);
                        return [2 /*return*/, {
                                data: empty,
                                status: 500,
                                message: "Error fetching interview panel details",
                            }];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    CandidateService.prototype.UpdateCandidateStatus = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var Response_1, error_6;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, CareerPortalAPI_1.getProfileData.UpdateCandidateStatus(data)];
                    case 1:
                        Response_1 = _a.sent();
                        return [2 /*return*/, {
                                data: Response_1.data,
                                status: Response_1.status,
                                message: Response_1.data.message,
                            }];
                    case 2:
                        error_6 = _a.sent();
                        console.error("Error inserting data into AdvertisementDetails:", error_6);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error inserting data into AdvertisementDetails",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CandidateService.prototype.SendEmailNotification = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var Response_2, error_7;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, CareerPortalAPI_1.EmailService.emailnotification(data)];
                    case 1:
                        Response_2 = _a.sent();
                        return [2 /*return*/, {
                                data: Response_2.data,
                                status: Response_2.status,
                                message: Response_2.data.message,
                            }];
                    case 2:
                        error_7 = _a.sent();
                        console.error("Error inserting data into AdvertisementDetails:", error_7);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error inserting data into AdvertisementDetails",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CandidateService.prototype.UploadCOIAttachment = function (DocumentName, AttachFile) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, error_8;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        response = void 0;
                        if (!(AttachFile.length > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, spservice_1.default.addDocLibFiles({
                                FilePath: Config_1.DocumentLibraray.HRMSCareerPortalCandidateCV,
                                FolderNames: [
                                    "".concat(DocumentName.RequestID.toString()),
                                    "".concat(DocumentName.DocumentName.toString()),
                                ],
                                Datas: AttachFile,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                data: response,
                                status: 200,
                                message: "Attachment replaced successfully",
                            }];
                    case 2: return [2 /*return*/, {
                            data: response,
                            status: 400,
                            message: "No attachments provided",
                        }];
                    case 3:
                        error_8 = _a.sent();
                        console.error("Error during file replacement process:", error_8);
                        return [2 /*return*/, {
                                data: null,
                                status: 500,
                                message: "Error during file replacement",
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CandidateService.prototype.GetUpsertCOI = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var Response_3, error_9;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, CareerPortalAPI_1.GetJobRequestData.UpsertCOI(data)];
                    case 1:
                        Response_3 = _a.sent();
                        return [2 /*return*/, {
                                data: Response_3.data,
                                status: Response_3.status,
                                message: Response_3.data.message,
                            }];
                    case 2:
                        error_9 = _a.sent();
                        console.error("Error inserting data into AdvertisementDetails:", error_9);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error inserting data into AdvertisementDetails",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CandidateService.prototype.InsertCandidateDetailsInList = function (CandidateDetails, InterviewPanel) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, jobDetailsResponse, error_10;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, spservice_1.default.SPAddItem({
                                Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                                RequestJSON: CandidateDetails,
                            })];
                    case 1:
                        response = _a.sent();
                        if (!(response === null || response === void 0 ? void 0 : response.ID)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.InsertInterviewPanel(InterviewPanel, parseInt(response === null || response === void 0 ? void 0 : response.ID))];
                    case 2:
                        jobDetailsResponse = _a.sent();
                        return [2 /*return*/, {
                                data: jobDetailsResponse.data,
                                status: jobDetailsResponse.status,
                                message: jobDetailsResponse.message,
                            }];
                    case 3: return [2 /*return*/, {
                            data: [],
                            status: 200,
                            message: "Failed to insert RecruitmentDptDetails",
                        }];
                    case 4:
                        error_10 = _a.sent();
                        console.error("Error inserting data into HRMSRecruitmentDptDetails:", error_10);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error inserting data into HRMSRecruitmentDptDetails",
                            }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CandidateService.prototype.InsertInterviewPanel = function (InterviewPanel, CandidateId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var insertedRecords, _i, InterviewPanel_1, item, JobDetailsInsert, response, error_11;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        insertedRecords = [];
                        _i = 0, InterviewPanel_1 = InterviewPanel;
                        _a.label = 1;
                    case 1:
                        if (!(_i < InterviewPanel_1.length)) return [3 /*break*/, 4];
                        item = InterviewPanel_1[_i];
                        JobDetailsInsert = {
                            RecruitmentIDId: item.RecruitmentIDId,
                            InterviewLevel: item.InterviewLevel,
                            InterviewPanelId: item.InterviewPanel,
                            CandidateIDId: CandidateId,
                        };
                        return [4 /*yield*/, spservice_1.default.SPAddItem({
                                Listname: Config_1.ListNames.HRMSInterviewPanelDetails,
                                RequestJSON: JobDetailsInsert,
                            })];
                    case 2:
                        response = _a.sent();
                        insertedRecords.push(response);
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, {
                            data: insertedRecords,
                            status: 200,
                            message: "Job details inserted successfully",
                        }];
                    case 5:
                        error_11 = _a.sent();
                        console.error("Error inserting job details:", error_11);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error inserting job details",
                            }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    CandidateService.prototype.RescheduledInterview = function (obj, ListName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_12;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                                Listname: ListName,
                                RequestJSON: obj,
                                ID: obj.ID,
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                data: null,
                                status: 200,
                                message: "Data Submitted successfully",
                            }];
                    case 2:
                        error_12 = _a.sent();
                        console.error(error_12);
                        return [2 /*return*/, {
                                data: null,
                                status: 400,
                                message: "Error On Posting Data",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CandidateService.prototype.fetchCOIAttachment = function (DocumentName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, getLatestFile, files, getFile, error_13;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        response = void 0;
                        getLatestFile = function (files) {
                            if (files === void 0) { files = []; }
                            if (!files.length)
                                return [];
                            var latest = files.reduce(function (latest, current) {
                                var currDate = new Date((current === null || current === void 0 ? void 0 : current.TimeLastModified) || (current === null || current === void 0 ? void 0 : current.Modified) || (current === null || current === void 0 ? void 0 : current.Created));
                                var latestDate = new Date((latest === null || latest === void 0 ? void 0 : latest.TimeLastModified) || (latest === null || latest === void 0 ? void 0 : latest.Modified) || (latest === null || latest === void 0 ? void 0 : latest.Created));
                                return currDate > latestDate ? current : latest;
                            });
                            return [latest];
                        };
                        return [4 /*yield*/, spservice_1.default.getDocLibFiles({
                                FilePath: "".concat(Config_1.DocumentLibraray.HRMSCareerPortalCandidateCV, "/").concat(DocumentName.RequestID, "/").concat(DocumentName.DocumentName),
                            })];
                    case 1:
                        files = (_a.sent());
                        getFile = getLatestFile(files);
                        response = getFile;
                        return [2 /*return*/, {
                                data: response,
                                status: 200,
                                message: "Attachment replaced successfully",
                            }];
                    case 2:
                        error_13 = _a.sent();
                        console.error("Error during file replacement process:", error_13);
                        return [2 /*return*/, {
                                data: null,
                                status: 500,
                                message: "Error during file replacement",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CandidateService.prototype.InterviewScheduleLevel2 = function (payloads) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _b, batchedSP_1, execute, results_1, error_14;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        if (!payloads || !((_a = payloads.interviewPanelL2) === null || _a === void 0 ? void 0 : _a.length)) {
                            return [2 /*return*/, { data: [], status: 200, message: "No payloads to insert" }];
                        }
                        _b = (0, spservice_1.getSP)().batched(), batchedSP_1 = _b[0], execute = _b[1];
                        results_1 = [];
                        payloads.interviewPanelL2.forEach(function (item) {
                            void batchedSP_1.web.lists
                                .getByTitle(Config_1.ListNames.HRMSInterviewPanelDetails)
                                .items.add({
                                RecruitmentIDId: item.RecruitmentIDId,
                                InterviewLevel: item.InterviewLevel,
                                InterviewPanelId: item.InterviewPanelId,
                                CandidateIDId: item.CandidateIDId,
                            })
                                .then(function (res) { return results_1.push(res); });
                        });
                        void batchedSP_1.web.lists
                            .getByTitle(Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails)
                            .items.getById(payloads.candidateUpdate.ID)
                            .update({
                            StatusId: payloads.candidateUpdate.StatusId,
                            InterviewDateLevel2: payloads.candidateUpdate.InterviewDateLevel2,
                            InterviewTimeLevel2: payloads.candidateUpdate.InterviewTimeLevel2,
                            InterviewLinkLevel2: payloads.candidateUpdate.InterviewLinkLevel2,
                        });
                        return [4 /*yield*/, execute()];
                    case 1:
                        _c.sent();
                        return [2 /*return*/, {
                                data: results_1,
                                status: 200,
                                message: "Batch insert successful for ".concat(payloads.interviewPanelL2.length, " record(s)"),
                            }];
                    case 2:
                        error_14 = _c.sent();
                        console.error("InterviewScheduleLevel2 error:", error_14);
                        return [2 /*return*/, { data: [], status: 500, message: "Batch insert failed" }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return CandidateService;
}());
exports.default = CandidateService;
//# sourceMappingURL=CandidateService.js.map