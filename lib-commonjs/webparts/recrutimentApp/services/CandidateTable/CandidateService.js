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
var spservice_1 = tslib_1.__importDefault(require("../SPService/spservice"));
var Config_1 = require("../../utilities/Config");
var CandidateService = /** @class */ (function () {
    function CandidateService() {
    }
    CandidateService.prototype.getCandidateDetailsInJobCode = function (FilterValue) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res, totalItems_1, mappedData, error_1;
            var _a, _b;
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
                            var CreatedBy = typeof (item === null || item === void 0 ? void 0 : item.createdBy) === "string" && item.createdBy.startsWith("ANT")
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
    CandidateService.prototype.fetchCandidateDetails = function (CandidateID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var GetProfileByJobCodeData_1, error_2;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        GetProfileByJobCodeData_1 = [];
                        return [4 /*yield*/, CareerPortalAPI_1.getProfileData.getCandidateProfile(CandidateID).then(function (res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var op, CandidateCV, BusinessLinkPath, BusinessDocument, FamilyLinkPath, FamilyDocument, ProofIdentity, totalExperienceYears, CountryCode, profileExperiance, dob, today, age, monthDiff, dayDiff, getOptAnswers, profileXAgent, AgenName, IdentityID, familyDetails, emergencyContacts, employeeReferenceDetail, companyDetails, PPEData, PPEMaster, ppeMap_1, JobCode, willingRelocated, code, PreviousEmployer, candidateLanguages, _a, years, months, formattedExperience, ContactNumber, OverallAttachment, GetProfileDahboard;
                                var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59, _60, _61, _62, _63, _64, _65, _66, _67, _68, _69, _70, _71, _72, _73, _74, _75, _76, _77, _78, _79, _80, _81, _82, _83, _84, _85, _86, _87, _88, _89, _90, _91, _92, _93, _94, _95, _96, _97, _98, _99, _100, _101, _102, _103, _104, _105, _106, _107, _108, _109;
                                return tslib_1.__generator(this, function (_110) {
                                    switch (_110.label) {
                                        case 0:
                                            op = res.data.data;
                                            return [4 /*yield*/, ServiceExport_1.CommonServices.GetDocumentinUrl((_b = op === null || op === void 0 ? void 0 : op.document) === null || _b === void 0 ? void 0 : _b.filePath)];
                                        case 1:
                                            CandidateCV = _110.sent();
                                            BusinessLinkPath = (_c = op === null || op === void 0 ? void 0 : op.profile) === null || _c === void 0 ? void 0 : _c.profileDetailAttachments.filter(function (item) { return item.attachmentTypeCoe === "PA01"; });
                                            return [4 /*yield*/, ServiceExport_1.CommonServices.GetDocumentinUrl((_e = (_d = BusinessLinkPath[0]) === null || _d === void 0 ? void 0 : _d.document) === null || _e === void 0 ? void 0 : _e.filePath)];
                                        case 2:
                                            BusinessDocument = _110.sent();
                                            FamilyLinkPath = (_f = op === null || op === void 0 ? void 0 : op.profile) === null || _f === void 0 ? void 0 : _f.profileDetailAttachments.filter(function (item) { return item.attachmentTypeCoe === "PA02"; });
                                            return [4 /*yield*/, ServiceExport_1.CommonServices.GetDocumentinUrl((_h = (_g = FamilyLinkPath[0]) === null || _g === void 0 ? void 0 : _g.document) === null || _h === void 0 ? void 0 : _h.filePath)];
                                        case 3:
                                            FamilyDocument = _110.sent();
                                            return [4 /*yield*/, ServiceExport_1.masterService.GetAllMaster(ConditionConfig_1.CategoryID.ProofofIdentity)];
                                        case 4:
                                            ProofIdentity = _110.sent();
                                            totalExperienceYears = (0, reusehooks_1.calculateTotalExperienceYears)((_j = op === null || op === void 0 ? void 0 : op.profile) === null || _j === void 0 ? void 0 : _j.profileDetailExperiences);
                                            return [4 /*yield*/, ServiceExport_1.masterService.GetCountryMaster()];
                                        case 5:
                                            CountryCode = _110.sent();
                                            profileExperiance = Array.isArray((_k = op === null || op === void 0 ? void 0 : op.profile) === null || _k === void 0 ? void 0 : _k.profileDetailExperiences) && op.profile.profileDetailExperiences.length > 0
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
                                            AgenName = !profileXAgent || (Array.isArray(profileXAgent) && profileXAgent.length === 0)
                                                ? ((_p = op === null || op === void 0 ? void 0 : op.profile) === null || _p === void 0 ? void 0 : _p.kcsaEmployees) && ((_q = op === null || op === void 0 ? void 0 : op.profile) === null || _q === void 0 ? void 0 : _q.kcsaEmployees.length) === 0
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
                                                    "name": item === null || item === void 0 ? void 0 : item.name,
                                                    // "age": item?.age,
                                                    // "genderId": item?.genderId,
                                                    "relationshipDetail": (_b = item === null || item === void 0 ? void 0 : item.relationshipDetail) === null || _b === void 0 ? void 0 : _b.displayText,
                                                    "contactNumber": code,
                                                };
                                            });
                                            emergencyContacts = (_w = (_v = op === null || op === void 0 ? void 0 : op.profile) === null || _v === void 0 ? void 0 : _v.emergencyContacts) === null || _w === void 0 ? void 0 : _w.map(function (item) {
                                                var _a, _b;
                                                var code = (0, reusehooks_1.getcountryCode)((_a = CountryCode === null || CountryCode === void 0 ? void 0 : CountryCode.data) !== null && _a !== void 0 ? _a : [], item === null || item === void 0 ? void 0 : item.contactNumber);
                                                return {
                                                    "name": item === null || item === void 0 ? void 0 : item.contactName,
                                                    // "age": item?.age,
                                                    // "genderId": item?.genderId,
                                                    "relationshipDetail": (_b = item === null || item === void 0 ? void 0 : item.relationshipDetail) === null || _b === void 0 ? void 0 : _b.displayText,
                                                    "contactNumber": code,
                                                };
                                            });
                                            employeeReferenceDetail = {
                                                "empId": (_y = (_x = op === null || op === void 0 ? void 0 : op.profile) === null || _x === void 0 ? void 0 : _x.employeeReferenceDetails) === null || _y === void 0 ? void 0 : _y.empId,
                                                "empName": (_0 = (_z = op === null || op === void 0 ? void 0 : op.profile) === null || _z === void 0 ? void 0 : _z.employeeReferenceDetails) === null || _0 === void 0 ? void 0 : _0.empName,
                                                "empEmail": (_2 = (_1 = op === null || op === void 0 ? void 0 : op.profile) === null || _1 === void 0 ? void 0 : _1.employeeReferenceDetails) === null || _2 === void 0 ? void 0 : _2.empEmail,
                                                "company": (_4 = (_3 = op === null || op === void 0 ? void 0 : op.profile) === null || _3 === void 0 ? void 0 : _3.employeeReferenceDetails) === null || _4 === void 0 ? void 0 : _4.company,
                                            };
                                            companyDetails = {
                                                "operation": (_6 = (_5 = op === null || op === void 0 ? void 0 : op.profile) === null || _5 === void 0 ? void 0 : _5.profileDetailEmploymentHistory) === null || _6 === void 0 ? void 0 : _6.workedOperation,
                                                "role": (_8 = (_7 = op === null || op === void 0 ? void 0 : op.profile) === null || _7 === void 0 ? void 0 : _7.profileDetailEmploymentHistory) === null || _8 === void 0 ? void 0 : _8.workRole,
                                                "region": (_10 = (_9 = op === null || op === void 0 ? void 0 : op.profile) === null || _9 === void 0 ? void 0 : _9.profileDetailEmploymentHistory) === null || _10 === void 0 ? void 0 : _10.territory,
                                            };
                                            PPEData = [];
                                            if (!(op === null || op === void 0 ? void 0 : op.tblJobProfilePpeRequests)) return [3 /*break*/, 7];
                                            return [4 /*yield*/, CareerPortalAPI_1.PPEMasterTable.getPPEMaster()];
                                        case 6:
                                            PPEMaster = _110.sent();
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
                                            _110.label = 7;
                                        case 7:
                                            JobCode = (_11 = op === null || op === void 0 ? void 0 : op.jobCode) === null || _11 === void 0 ? void 0 : _11.split('-')[0];
                                            willingRelocated = getOptAnswers.filter(function (item) { var _a; return ((_a = item.question) === null || _a === void 0 ? void 0 : _a.quesContentId) === ConditionConfig_1.quesContentId.WillingRelocate; });
                                            code = (0, reusehooks_1.getcountryCode)((_12 = CountryCode === null || CountryCode === void 0 ? void 0 : CountryCode.data) !== null && _12 !== void 0 ? _12 : [], profileExperiance === null || profileExperiance === void 0 ? void 0 : profileExperiance.refMobile);
                                            PreviousEmployer = {
                                                name: profileExperiance === null || profileExperiance === void 0 ? void 0 : profileExperiance.refName,
                                                Designation: (_13 = profileExperiance === null || profileExperiance === void 0 ? void 0 : profileExperiance.refDesignationDetail) === null || _13 === void 0 ? void 0 : _13.displayText,
                                                Email: profileExperiance === null || profileExperiance === void 0 ? void 0 : profileExperiance.refEmail,
                                                ContractNumber: code !== null && code !== void 0 ? code : "",
                                                CompanyName: profileExperiance === null || profileExperiance === void 0 ? void 0 : profileExperiance.company
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
                                                Gender: ((_39 = (_38 = op === null || op === void 0 ? void 0 : op.profile) === null || _38 === void 0 ? void 0 : _38.gender) === null || _39 === void 0 ? void 0 : _39.displayText) ? (_41 = (_40 = op === null || op === void 0 ? void 0 : op.profile) === null || _40 === void 0 ? void 0 : _40.gender) === null || _41 === void 0 ? void 0 : _41.displayText : (_42 = op === null || op === void 0 ? void 0 : op.profile) === null || _42 === void 0 ? void 0 : _42.genderId,
                                                HighestQualification: (_44 = (_43 = op === null || op === void 0 ? void 0 : op.profile) === null || _43 === void 0 ? void 0 : _43.education) === null || _44 === void 0 ? void 0 : _44.displayText,
                                                ExperienceMining: ((_45 = op === null || op === void 0 ? void 0 : op.profile) === null || _45 === void 0 ? void 0 : _45.profileXAgent) ? formattedExperience : totalExperienceYears,
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
                                                disability: ((_55 = (_54 = op === null || op === void 0 ? void 0 : op.profile) === null || _54 === void 0 ? void 0 : _54.profileDetailDisclosure) === null || _55 === void 0 ? void 0 : _55.hasDisability) === 1 ? "Yes" : "No",
                                                disabilityReason: (_57 = (_56 = op === null || op === void 0 ? void 0 : op.profile) === null || _56 === void 0 ? void 0 : _56.profileDetailDisclosure) === null || _57 === void 0 ? void 0 : _57.disabilityDetails,
                                                identityValue: (_58 = op === null || op === void 0 ? void 0 : op.profile) === null || _58 === void 0 ? void 0 : _58.identityValue,
                                                identityType: (IdentityID && IdentityID.length > 0) ? IdentityID[0].displayText : "Passport",
                                                NumberOftax: (_60 = (_59 = op === null || op === void 0 ? void 0 : op.profile) === null || _59 === void 0 ? void 0 : _59.taxDependents) !== null && _60 !== void 0 ? _60 : "",
                                                CurrentEmployer: profileExperiance === null || profileExperiance === void 0 ? void 0 : profileExperiance.company,
                                                CurrentPosition: profileExperiance === null || profileExperiance === void 0 ? void 0 : profileExperiance.title,
                                                WillingToRelocate: (_62 = (_61 = willingRelocated[0]) === null || _61 === void 0 ? void 0 : _61.answerContent) === null || _62 === void 0 ? void 0 : _62.contentEn,
                                                previouslyworkedMine: ((_64 = (_63 = op === null || op === void 0 ? void 0 : op.profile) === null || _63 === void 0 ? void 0 : _63.profileDetailEmploymentHistory) === null || _64 === void 0 ? void 0 : _64.hasIvanhoeZijinExperienceId) === "1" ? "Yes" : ((_66 = (_65 = op === null || op === void 0 ? void 0 : op.profile) === null || _65 === void 0 ? void 0 : _65.profileDetailEmploymentHistory) === null || _66 === void 0 ? void 0 : _66.hasIvanhoeZijinExperienceId) === undefined ? undefined : "No",
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
                                                residentStatus: ((_90 = op === null || op === void 0 ? void 0 : op.profile) === null || _90 === void 0 ? void 0 : _90.residentStatus) === "Y" ? "Yes" : ((_91 = op === null || op === void 0 ? void 0 : op.profile) === null || _91 === void 0 ? void 0 : _91.residentStatus) === "N" ? "No" : "",
                                                maritalStatus: (_94 = (_93 = (_92 = op === null || op === void 0 ? void 0 : op.profile) === null || _92 === void 0 ? void 0 : _92.maritalStatusDetail) === null || _93 === void 0 ? void 0 : _93.displayText) !== null && _94 !== void 0 ? _94 : "",
                                                childrenDetails: ((_95 = op === null || op === void 0 ? void 0 : op.profile) === null || _95 === void 0 ? void 0 : _95.nationalityId) === "N0" ? familyDetails : emergencyContacts,
                                                employeeReferenceDetails: employeeReferenceDetail,
                                                maritalStatusId: (_97 = (_96 = op === null || op === void 0 ? void 0 : op.profile) === null || _96 === void 0 ? void 0 : _96.maritalStatus) !== null && _97 !== void 0 ? _97 : "",
                                                joiningDate: (_98 = op === null || op === void 0 ? void 0 : op.startDate) !== null && _98 !== void 0 ? _98 : "",
                                                noticePeriod: (_99 = op === null || op === void 0 ? void 0 : op.noticePeriodDays) !== null && _99 !== void 0 ? _99 : "",
                                                hasIvanhoeZijinExperience: ((_101 = (_100 = op === null || op === void 0 ? void 0 : op.profile) === null || _100 === void 0 ? void 0 : _100.profileDetailEmploymentHistory) === null || _101 === void 0 ? void 0 : _101.hasIvanhoeZijinExperienceId) === "3" ? "No" : (_105 = (_104 = (_103 = (_102 = op === null || op === void 0 ? void 0 : op.profile) === null || _102 === void 0 ? void 0 : _102.profileDetailEmploymentHistory) === null || _103 === void 0 ? void 0 : _103.hasIvanhoeZijinExperience) === null || _104 === void 0 ? void 0 : _104.displayText) !== null && _105 !== void 0 ? _105 : "",
                                                companyDetails: companyDetails,
                                                businesslinkscompany: ((_106 = op === null || op === void 0 ? void 0 : op.profile) === null || _106 === void 0 ? void 0 : _106.businessLinkCompany) === "CD03" ? (_107 = op === null || op === void 0 ? void 0 : op.profile) === null || _107 === void 0 ? void 0 : _107.whichCompany : (_109 = (_108 = op === null || op === void 0 ? void 0 : op.profile) === null || _108 === void 0 ? void 0 : _108.businessLinkCompanyDetail) === null || _109 === void 0 ? void 0 : _109.displayText,
                                                PreviousEmployerDetails: PreviousEmployer,
                                                LanguageKnown: candidateLanguages,
                                                PPEDetails: PPEData,
                                                RoleProfile: [],
                                                OverallAtttachment: OverallAttachment
                                            };
                                            GetProfileByJobCodeData_1.push(GetProfileDahboard);
                                            return [2 /*return*/];
                                    }
                                });
                            }); }).catch(function (error) {
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
                        error_2 = _a.sent();
                        console.error("Error inserting data into HRMSRecruitmentDptDetails:", error_2);
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
    CandidateService.prototype.fetchInterviewPanelDetails = function (_a) {
        return tslib_1.__awaiter(this, arguments, void 0, function (_b) {
            var empty, jdeQuery, userRoleQuery, batchRes, jdeItems, userRoles, jdeItem, panelRoleEntry, adGroupOptions, _c, existingLevel1, existingLevel2, levels, existingPanelFilter, existingPanelQuery, panelBatch, existingPanelItems, resolvedExistingPanel, nameTasks, assignHRId, nameResults, nameMap, basePanelLevel1, basePanelLevel2, adOptions, level1Panel, level2Panel, panelMember, panelMember2, result, error_3;
            var _this = this;
            var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            var BUCodeID = _b.BUCodeID, assignHREmail = _b.assignHREmail, candidateID = _b.candidateID, statusID = _b.statusID;
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
                            Filter: [{
                                    FilterKey: "BUCId",
                                    Operator: "eq",
                                    FilterValue: BUCodeID
                                }],
                            FilterCondition: "and",
                            select: ["*", "BUC/BusineesUnitCode", "LineManager/EMail", "HOD/EMail", "HR/EMail", "EXCO/EMail"],
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
                        jdeItems = (_d = batchRes[1]) !== null && _d !== void 0 ? _d : [];
                        userRoles = (_e = batchRes[2]) !== null && _e !== void 0 ? _e : [];
                        jdeItem = jdeItems[0];
                        if (!jdeItem) {
                            return [2 /*return*/, { data: empty, status: 200, message: "No JDE mapping found" }];
                        }
                        panelRoleEntry = userRoles.find(function (r) { return r.ID === Config_1.RoleID.InterviewPanel; });
                        if (!(panelRoleEntry === null || panelRoleEntry === void 0 ? void 0 : panelRoleEntry.ADGroupID)) return [3 /*break*/, 4];
                        return [4 /*yield*/, ServiceExport_1.CommonServices.GetADgruopsEmailIDs(panelRoleEntry.ADGroupID)];
                    case 3:
                        _c = (_f = (_p.sent()).data) !== null && _f !== void 0 ? _f : [];
                        return [3 /*break*/, 5];
                    case 4:
                        _c = [];
                        _p.label = 5;
                    case 5:
                        adGroupOptions = _c;
                        existingLevel1 = [];
                        existingLevel2 = [];
                        if (!(Number(statusID) === Config_1.StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel)) return [3 /*break*/, 8];
                        levels = Number(statusID) === Config_1.StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel
                            ? [ConditionConfig_1.InterviewLevels.Level1, ConditionConfig_1.InterviewLevels.Level2]
                            : [ConditionConfig_1.InterviewLevels.Level1];
                        existingPanelFilter = [
                            { FilterKey: "CandidateID", Operator: "eq", FilterValue: candidateID },
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
                        return [4 /*yield*/, spservice_1.default.batchGet([existingPanelQuery])];
                    case 6:
                        panelBatch = _p.sent();
                        existingPanelItems = (_g = panelBatch[3]) !== null && _g !== void 0 ? _g : [];
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
                        if ((_h = jdeItem.LineManager) === null || _h === void 0 ? void 0 : _h.EMail)
                            nameTasks.push({ key: String(jdeItem === null || jdeItem === void 0 ? void 0 : jdeItem.LineManagerId), email: jdeItem.LineManager.EMail });
                        if ((_j = jdeItem.HOD) === null || _j === void 0 ? void 0 : _j.EMail)
                            nameTasks.push({ key: String(jdeItem === null || jdeItem === void 0 ? void 0 : jdeItem.HODId), email: jdeItem.HOD.EMail });
                        if ((_k = jdeItem.EXCO) === null || _k === void 0 ? void 0 : _k.EMail)
                            nameTasks.push({ key: String(jdeItem === null || jdeItem === void 0 ? void 0 : jdeItem.EXCOId), email: jdeItem.EXCO.EMail });
                        if (assignHREmail)
                            nameTasks.push({ key: String((_l = assignHRId.data) === null || _l === void 0 ? void 0 : _l.key), email: assignHREmail });
                        return [4 /*yield*/, Promise.all(nameTasks.map(function (t) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var _a;
                                return tslib_1.__generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _a = { key: t.key };
                                            return [4 /*yield*/, (0, ICandidateService_1.resolveName)(t.email)];
                                        case 1: return [2 /*return*/, (_a.label = _b.sent(), _a)];
                                    }
                                });
                            }); }))];
                    case 10:
                        nameResults = _p.sent();
                        nameMap = Object.fromEntries(nameResults.map(function (r) { return [r.key, r.label]; }));
                        basePanelLevel1 = [];
                        basePanelLevel2 = [];
                        if (String(statusID) === Config_1.workflowStatusApi.PendingRecruitmentHRscheduleInterview) {
                            if (jdeItem.LineManagerId && nameMap[String(jdeItem.LineManagerId)]) {
                                basePanelLevel1.push({
                                    value: jdeItem.LineManagerId,
                                    label: nameMap[String(jdeItem.LineManagerId)],
                                    Email: jdeItem.LineManager.EMail,
                                    Role: ConditionConfig_1.RoleName.LineManager
                                });
                            }
                            if (jdeItem.HODId && nameMap[String(jdeItem.HODId)]) {
                                basePanelLevel1.push({
                                    value: jdeItem.HODId,
                                    label: nameMap[String(jdeItem.HODId)],
                                    Email: jdeItem.HOD.EMail,
                                    Role: ConditionConfig_1.RoleName.HOD
                                });
                            }
                            if (((_m = assignHRId === null || assignHRId === void 0 ? void 0 : assignHRId.data) === null || _m === void 0 ? void 0 : _m.key) && nameMap[String(assignHRId.data.key)]) {
                                basePanelLevel1.push({
                                    value: assignHRId.data.key,
                                    label: nameMap[String(assignHRId.data.key)],
                                    Email: assignHREmail,
                                    Role: ConditionConfig_1.RoleName.RecruitmentHR
                                });
                            }
                        }
                        else if (Number(statusID) === Config_1.StatusId.PendingwithRecruitmentHRtoassignLevel2InterviewPanel) {
                            if (jdeItem.LineManagerId && nameMap[String(jdeItem.LineManagerId)]) {
                                basePanelLevel1.push({
                                    value: jdeItem.LineManagerId,
                                    label: nameMap[String(jdeItem.LineManagerId)],
                                    Email: jdeItem.LineManager.EMail,
                                    Role: ConditionConfig_1.RoleName.LineManager
                                });
                            }
                            if (jdeItem.HODId && nameMap[String(jdeItem.HODId)]) {
                                basePanelLevel1.push({
                                    value: jdeItem.HODId,
                                    label: nameMap[String(jdeItem.HODId)],
                                    Email: jdeItem.HOD.EMail,
                                    Role: ConditionConfig_1.RoleName.HOD
                                });
                            }
                            if (jdeItem.EXCOId && nameMap[String(jdeItem.EXCOId)]) {
                                basePanelLevel1.push({
                                    value: jdeItem.EXCOId,
                                    label: nameMap[String(jdeItem.EXCOId)],
                                    Email: jdeItem.EXCO.EMail,
                                    Role: ConditionConfig_1.RoleName.EXCO
                                });
                            }
                            basePanelLevel1.push.apply(basePanelLevel1, existingLevel1);
                        }
                        else {
                            if (jdeItem.LineManagerId && nameMap[String(jdeItem.LineManagerId)]) {
                                basePanelLevel1.push({
                                    value: jdeItem.LineManagerId,
                                    label: nameMap[String(jdeItem.LineManagerId)],
                                    Email: jdeItem.LineManager.EMail,
                                    Role: ConditionConfig_1.RoleName.LineManager
                                });
                            }
                            if (jdeItem.HODId && nameMap[String(jdeItem.HODId)]) {
                                basePanelLevel1.push({
                                    value: jdeItem.HODId,
                                    label: nameMap[String(jdeItem.HODId)],
                                    Email: jdeItem.HOD.EMail,
                                    Role: ConditionConfig_1.RoleName.HOD
                                });
                            }
                            if (((_o = assignHRId === null || assignHRId === void 0 ? void 0 : assignHRId.data) === null || _o === void 0 ? void 0 : _o.key) && nameMap[String(assignHRId.data.key)]) {
                                basePanelLevel1.push({
                                    value: assignHRId.data.key,
                                    label: nameMap[String(assignHRId.data.key)],
                                    Email: assignHREmail,
                                    Role: ConditionConfig_1.RoleName.RecruitmentHR
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
                        error_3 = _p.sent();
                        console.error("fetchInterviewPanelDetails failed:", error_3);
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
            var Response_1, error_4;
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
                        error_4 = _a.sent();
                        console.error("Error inserting data into AdvertisementDetails:", error_4);
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
            var Response_2, error_5;
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
                        error_5 = _a.sent();
                        console.error("Error inserting data into AdvertisementDetails:", error_5);
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
            var response, error_6;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        response = void 0;
                        if (!(AttachFile.length > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, spservice_1.default.addDocLibFiles({
                                FilePath: Config_1.DocumentLibraray.HRMSCareerPortalCandidateCV,
                                FolderNames: ["".concat(DocumentName.RequestID.toString()), "".concat(DocumentName.DocumentName.toString())],
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
                        error_6 = _a.sent();
                        console.error("Error during file replacement process:", error_6);
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
    ;
    CandidateService.prototype.GetUpsertCOI = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var Response_3, error_7;
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
    CandidateService.prototype.InsertCandidateDetailsInList = function (CandidateDetails, InterviewPanel) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, jobDetailsResponse, error_8;
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, spservice_1.default.SPAddItem({
                                Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                                RequestJSON: CandidateDetails,
                            })];
                    case 1:
                        response = _c.sent();
                        if (!((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.ID)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.InsertInterviewPanel(InterviewPanel, parseInt((_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.ID))];
                    case 2:
                        jobDetailsResponse = _c.sent();
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
                        error_8 = _c.sent();
                        console.error("Error inserting data into HRMSRecruitmentDptDetails:", error_8);
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
            var insertedRecords, _i, InterviewPanel_1, item, JobDetailsInsert, response, error_9;
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
                        error_9 = _a.sent();
                        console.error("Error inserting job details:", error_9);
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
            var error_10;
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
                        error_10 = _a.sent();
                        console.error(error_10);
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
    return CandidateService;
}());
exports.default = CandidateService;
//# sourceMappingURL=CandidateService.js.map