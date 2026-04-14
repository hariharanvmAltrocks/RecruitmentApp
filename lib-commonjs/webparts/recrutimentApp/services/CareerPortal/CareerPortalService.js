"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var moment_1 = tslib_1.__importDefault(require("moment"));
var CareerPortalAPI_1 = require("../AxiosService/CareerPortalAPI");
var ApiConfig_1 = require("../../utilities/ApiConfig");
var Config_1 = require("../../utilities/Config");
var spservice_1 = tslib_1.__importDefault(require("../SPService/spservice"));
var ServiceExport_1 = require("../ServiceExport");
var IDocument_1 = require("../../models/IDocument");
var ConditionConfig_1 = require("../../utilities/ConditionConfig");
var reusehooks_1 = require("../../components/Hooks/reusehooks");
var CareerPortalService = /** @class */ (function () {
    function CareerPortalService() {
        var _this = this;
        this.UploadCOIAttachment = function (DocumentName, AttachFile) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var response, error_1;
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
                        error_1 = _a.sent();
                        console.error("Error during file replacement process:", error_1);
                        return [2 /*return*/, {
                                data: null,
                                status: 500,
                                message: "Error during file replacement",
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.fetchCOIAttachment = function (DocumentName) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var response, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, spservice_1.default.getDocLibFiles({
                                FilePath: "".concat(Config_1.DocumentLibraray.HRMSCareerPortalCandidateCV, "/").concat(DocumentName.RequestID, "/").concat(DocumentName.DocumentName),
                            })];
                    case 1:
                        response = (_a.sent());
                        return [2 /*return*/, {
                                data: response,
                                status: 200,
                                message: "Attachment replaced successfully",
                            }];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Error during file replacement process:", error_2);
                        return [2 /*return*/, {
                                data: null,
                                status: 500,
                                message: "Error during file replacement",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
    }
    CareerPortalService.prototype.UpsertJobs = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var AdvertisementDetails, response, error_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        AdvertisementDetails = {
                            jobCode: data === null || data === void 0 ? void 0 : data.jobCode,
                            noOfPositions: data === null || data === void 0 ? void 0 : data.noOfPositions,
                            validFrom: data === null || data === void 0 ? void 0 : data.validFrom,
                            validTo: data === null || data === void 0 ? void 0 : data.validTo,
                            employmentType: data === null || data === void 0 ? void 0 : data.employmentType,
                            departmentId: data === null || data === void 0 ? void 0 : data.departmentId,
                            role: data === null || data === void 0 ? void 0 : data.role,
                            functionId: data === null || data === void 0 ? void 0 : data.functionId,
                            onemdocPath: data === null || data === void 0 ? void 0 : data.onemdocPath,
                            experience: data === null || data === void 0 ? void 0 : data.experience,
                            nationality: data === null || data === void 0 ? void 0 : data.nationality,
                            Descriptions_en: data === null || data === void 0 ? void 0 : data.Descriptions_en,
                            Descriptions_fr: data === null || data === void 0 ? void 0 : data.Descriptions_fr,
                            RoleAndTechSkills: data === null || data === void 0 ? void 0 : data.RoleAndTechSkills,
                            MinAndPreferedQualifications: data === null || data === void 0 ? void 0 : data.MinAndPreferedQualifications,
                            isActive: data === null || data === void 0 ? void 0 : data.isActive,
                            IsExtened: data === null || data === void 0 ? void 0 : data.IsExtened,
                        };
                        return [4 /*yield*/, CareerPortalAPI_1.postAdveDetails.postUpsertJobs(AdvertisementDetails)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                data: response.data,
                                status: response.status,
                                message: response.data.message,
                            }];
                    case 2:
                        error_3 = _a.sent();
                        console.error("Error inserting data into AdvertisementDetails:", error_3);
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
    CareerPortalService.prototype.UpsertAgenciesJobs = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var AgentDetails, response, error_4;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        AgentDetails = {
                            jobCode: data === null || data === void 0 ? void 0 : data.jobCode,
                            jobsXAgents: data === null || data === void 0 ? void 0 : data.jobsXAgents,
                        };
                        return [4 /*yield*/, CareerPortalAPI_1.postAdveDetails.postAgenciesJobs(AgentDetails)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                data: response.data,
                                status: response.status,
                                message: response.data.message,
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
    // async getCandidateDetailsInJobCode(FilterValue: FilterItem): Promise<ApiResponse<GetProfileByJobCode[] | null>> {
    //   debugger
    //   try {
    //     let GetProfileByJobCodeData: GetProfileByJobCode[] = []
    //     await getProfileData.GetProfileByJobCode(FilterValue).then((res) => {
    //       let TotalItems = res?.data?.pagination?.totalItems;
    //       GetProfileByJobCodeData = res.data.data.map((item: any, index: number) => {
    //         const JobCode = item?.jobCode?.split('-')[0];
    //         let createdon = item?.createdOn ? new Date(item.createdOn) : null
    //         return {
    //           SNO: index + 1,
    //           CandidateID: item?.jobRequestId,
    //           ApplicantName: item?.applicantName,
    //           PositionTitle: item?.jobTitle?.displayText,
    //           JobCode: JobCode,
    //           Status: item?.workflowStatus?.displayText,
    //           workflowStatusId: item?.workflowStatusId,
    //           createdOn: moment(createdon).format("DD/MM/YYYY"),
    //           TotalItems: TotalItems,
    //           applicationStatusId: item?.applicationStatusId,
    //           applicationStatus: item?.applicationStatus?.displayText,
    //           createdBy: item?.createdBy,
    //           tblProfilesKcsas: item?.tblProfilesKcsas || []
    //         }
    //       })
    //     }
    //     ).catch((error) => {
    //       console.log(error, "error");
    //     })
    //     return {
    //       data: GetProfileByJobCodeData,
    //       status: 200,
    //       message: "Get Candidate details",
    //     };
    //   } catch (error) {
    //     console.error(
    //       "Error Get Candidate details:",
    //       error
    //     );
    //     return {
    //       data: [],
    //       status: 500,
    //       message: "Error Get Candidate details",
    //     };
    //   }
    // }
    CareerPortalService.prototype.getCandidateDetailsInJobCode = function (FilterValue) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res, totalItems_1, mappedData, error_5;
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
                                createdBy: item === null || item === void 0 ? void 0 : item.createdBy,
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
                        error_5 = _c.sent();
                        console.error("Error Get Candidate details:", error_5);
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
    CareerPortalService.prototype.getCandidateProfile = function (CandidateID, EmployeeList, RecrutimentData) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var GetProfileByJobCodeData_1, error_6;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        GetProfileByJobCodeData_1 = [];
                        return [4 /*yield*/, CareerPortalAPI_1.getProfileData
                                .getCandidateProfile(CandidateID)
                                .then(function (res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var op, _a, RoleProfileDocment, AdvertismentDocment, RoleProfileDoc, AdvertismentDocPromises, EmployeeHR, EmployeeLM, CommentsData, CandidateCV, BusinessLinkPath, BusinessDocument, FamilyLinkPath, FamilyDocument, ProofIdentity, totalExperienceYears, CountryCode, profileExperiance, dob, today, age, monthDiff, dayDiff, getOptAnswers, profileXAgent, AgenName, IdentityID, familyDetails, emergencyContacts, employeeReferenceDetail, companyDetails, PPEData, PPEMaster, ppeMap_1, JobCode, willingRelocated, code, PreviousEmployer, candidateLanguages, _b, years, months, formattedExperience, ContactNumber, GetProfileDahboard;
                                var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59, _60, _61, _62, _63, _64, _65, _66, _67, _68, _69, _70, _71, _72, _73, _74, _75, _76, _77, _78, _79, _80, _81, _82, _83, _84, _85, _86, _87, _88, _89, _90, _91, _92, _93, _94, _95, _96, _97, _98, _99, _100, _101, _102, _103, _104, _105, _106, _107, _108, _109, _110;
                                return tslib_1.__generator(this, function (_111) {
                                    switch (_111.label) {
                                        case 0:
                                            op = res.data.data;
                                            return [4 /*yield*/, Promise.all([
                                                    ServiceExport_1.CommonServices.GetAttachmentToLibrary(Config_1.DocumentLibraray.RoleProfileMaster, op.jobCode, IDocument_1.RoleProfileMaster.RoleProfile),
                                                    ServiceExport_1.CommonServices.GetAttachmentToLibrary(Config_1.DocumentLibraray.RecruitmentAdvertisementDocument, op.jobCode),
                                                    ServiceExport_1.CommonServices.GetAttachmentToLibrary(Config_1.DocumentLibraray.InterviewPanelCandidateCV, op.jobCode, op === null || op === void 0 ? void 0 : op.jobRequestId),
                                                ])];
                                        case 1:
                                            _a = _111.sent(), RoleProfileDocment = _a[0], AdvertismentDocment = _a[1];
                                            RoleProfileDoc = RoleProfileDocment.data || [];
                                            AdvertismentDocPromises = AdvertismentDocment.data || [];
                                            EmployeeHR = EmployeeList === null || EmployeeList === void 0 ? void 0 : EmployeeList.find(function (options) {
                                                var _a;
                                                return (((_a = options.Email) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === (RecrutimentData === null || RecrutimentData === void 0 ? void 0 : RecrutimentData.AssignEMail));
                                            });
                                            EmployeeLM = EmployeeList === null || EmployeeList === void 0 ? void 0 : EmployeeList.find(function (options) {
                                                var _a;
                                                return (((_a = options.Email) === null || _a === void 0 ? void 0 : _a.toLowerCase()) ===
                                                    (RecrutimentData === null || RecrutimentData === void 0 ? void 0 : RecrutimentData.AssignLineManager));
                                            });
                                            CommentsData = (op === null || op === void 0 ? void 0 : op.profileJobsComments.map(function (item, index) {
                                                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
                                                var updatedData;
                                                if ((item === null || item === void 0 ? void 0 : item.createdBy) === ConditionConfig_1.RoleName.RecruitmentHR ||
                                                    (item === null || item === void 0 ? void 0 : item.createdBy) === "Recrutiment HR") {
                                                    updatedData = {
                                                        Id: index + 1,
                                                        JobTitleInEnglish: (_a = EmployeeHR === null || EmployeeHR === void 0 ? void 0 : EmployeeHR.JobTitle) !== null && _a !== void 0 ? _a : "",
                                                        JobTitleInFrench: (_b = EmployeeHR === null || EmployeeHR === void 0 ? void 0 : EmployeeHR.JobTitleInFrench) !== null && _b !== void 0 ? _b : "",
                                                        comments: (item === null || item === void 0 ? void 0 : item.comments) || "",
                                                        Department: (_c = EmployeeHR === null || EmployeeHR === void 0 ? void 0 : EmployeeHR.Department) !== null && _c !== void 0 ? _c : "",
                                                        Date: item.createdOn ? new Date(item.createdOn) : null,
                                                        JobTitle: (_d = EmployeeHR === null || EmployeeHR === void 0 ? void 0 : EmployeeHR.JobTitle) !== null && _d !== void 0 ? _d : "",
                                                        RoleName: ConditionConfig_1.RoleName.RecruitmentHR,
                                                        Name: "".concat((_e = EmployeeHR === null || EmployeeHR === void 0 ? void 0 : EmployeeHR.FirstName) !== null && _e !== void 0 ? _e : "", " ").concat((_f = EmployeeHR === null || EmployeeHR === void 0 ? void 0 : EmployeeHR.MiddleName) !== null && _f !== void 0 ? _f : "", " ").concat((_g = EmployeeHR === null || EmployeeHR === void 0 ? void 0 : EmployeeHR.LastName) !== null && _g !== void 0 ? _g : "").trim(),
                                                    };
                                                }
                                                else if ((item === null || item === void 0 ? void 0 : item.createdBy) === ConditionConfig_1.RoleName.LineManager ||
                                                    (item === null || item === void 0 ? void 0 : item.createdBy) === "Line Manager") {
                                                    updatedData = {
                                                        Id: index + 1,
                                                        JobTitleInEnglish: (_h = EmployeeLM === null || EmployeeLM === void 0 ? void 0 : EmployeeLM.JobTitle) !== null && _h !== void 0 ? _h : "",
                                                        JobTitleInFrench: (_j = EmployeeLM === null || EmployeeLM === void 0 ? void 0 : EmployeeLM.JobTitleInFrench) !== null && _j !== void 0 ? _j : "",
                                                        comments: (item === null || item === void 0 ? void 0 : item.comments) || "",
                                                        Department: (_k = EmployeeLM === null || EmployeeLM === void 0 ? void 0 : EmployeeLM.Department) !== null && _k !== void 0 ? _k : "",
                                                        Date: item.createdOn ? new Date(item.createdOn) : null,
                                                        JobTitle: (_l = EmployeeLM === null || EmployeeLM === void 0 ? void 0 : EmployeeLM.JobTitle) !== null && _l !== void 0 ? _l : "",
                                                        RoleName: ConditionConfig_1.RoleName.LineManager,
                                                        Name: "".concat((_m = EmployeeLM === null || EmployeeLM === void 0 ? void 0 : EmployeeLM.FirstName) !== null && _m !== void 0 ? _m : "", " ").concat((_o = EmployeeLM === null || EmployeeLM === void 0 ? void 0 : EmployeeLM.MiddleName) !== null && _o !== void 0 ? _o : "", " ").concat((_p = EmployeeLM === null || EmployeeLM === void 0 ? void 0 : EmployeeLM.LastName) !== null && _p !== void 0 ? _p : "").trim(),
                                                    };
                                                }
                                                else {
                                                    // Provide a fallback to ensure `updatedData` is always assigned
                                                    updatedData = {
                                                        Id: index + 1,
                                                        JobTitleInEnglish: "",
                                                        JobTitleInFrench: "",
                                                        comments: (item === null || item === void 0 ? void 0 : item.comments) || "",
                                                        Department: "",
                                                        Date: item.createdOn ? new Date(item.createdOn) : null,
                                                        JobTitle: "",
                                                        RoleName: (_q = item === null || item === void 0 ? void 0 : item.createdBy) !== null && _q !== void 0 ? _q : "Unknown",
                                                        Name: "",
                                                    };
                                                }
                                                return updatedData;
                                            })) || [];
                                            return [4 /*yield*/, ServiceExport_1.CommonServices.GetDocumentinUrl((_c = op === null || op === void 0 ? void 0 : op.document) === null || _c === void 0 ? void 0 : _c.filePath)];
                                        case 2:
                                            CandidateCV = _111.sent();
                                            BusinessLinkPath = (_d = op === null || op === void 0 ? void 0 : op.profile) === null || _d === void 0 ? void 0 : _d.profileDetailAttachments.filter(function (item) { return item.attachmentTypeCoe === "PA01"; });
                                            return [4 /*yield*/, ServiceExport_1.CommonServices.GetDocumentinUrl((_f = (_e = BusinessLinkPath[0]) === null || _e === void 0 ? void 0 : _e.document) === null || _f === void 0 ? void 0 : _f.filePath)];
                                        case 3:
                                            BusinessDocument = _111.sent();
                                            FamilyLinkPath = (_g = op === null || op === void 0 ? void 0 : op.profile) === null || _g === void 0 ? void 0 : _g.profileDetailAttachments.filter(function (item) { return item.attachmentTypeCoe === "PA02"; });
                                            return [4 /*yield*/, ServiceExport_1.CommonServices.GetDocumentinUrl((_j = (_h = FamilyLinkPath[0]) === null || _h === void 0 ? void 0 : _h.document) === null || _j === void 0 ? void 0 : _j.filePath)];
                                        case 4:
                                            FamilyDocument = _111.sent();
                                            return [4 /*yield*/, ServiceExport_1.masterService.GetAllMaster(ConditionConfig_1.CategoryID.ProofofIdentity)];
                                        case 5:
                                            ProofIdentity = _111.sent();
                                            totalExperienceYears = (0, reusehooks_1.calculateTotalExperienceYears)((_k = op === null || op === void 0 ? void 0 : op.profile) === null || _k === void 0 ? void 0 : _k.profileDetailExperiences);
                                            return [4 /*yield*/, ServiceExport_1.masterService.GetCountryMaster()];
                                        case 6:
                                            CountryCode = _111.sent();
                                            profileExperiance = Array.isArray((_l = op === null || op === void 0 ? void 0 : op.profile) === null || _l === void 0 ? void 0 : _l.profileDetailExperiences) &&
                                                op.profile.profileDetailExperiences.length > 0
                                                ? op.profile.profileDetailExperiences[op.profile.profileDetailExperiences.length - 1]
                                                : undefined;
                                            dob = new Date(new Date((_m = op === null || op === void 0 ? void 0 : op.profile) === null || _m === void 0 ? void 0 : _m.dob));
                                            today = new Date();
                                            age = today.getFullYear() - dob.getFullYear();
                                            monthDiff = today.getMonth() - dob.getMonth();
                                            dayDiff = today.getDate() - dob.getDate();
                                            if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                                                age--;
                                            }
                                            getOptAnswers = (_o = op === null || op === void 0 ? void 0 : op.profile) === null || _o === void 0 ? void 0 : _o.profileXOptAnswers.filter(function (item) { var _a; return ((_a = item.question) === null || _a === void 0 ? void 0 : _a.scopeId) === "S7"; }).sort(function (a, b) {
                                                var textA = typeof a.text === "string" ? a.text : "";
                                                var textB = typeof b.text === "string" ? b.text : "";
                                                return textA.localeCompare(textB);
                                            });
                                            profileXAgent = (_p = op === null || op === void 0 ? void 0 : op.profile) === null || _p === void 0 ? void 0 : _p.profileXAgent;
                                            AgenName = !profileXAgent ||
                                                (Array.isArray(profileXAgent) && profileXAgent.length === 0)
                                                ? ((_q = op === null || op === void 0 ? void 0 : op.profile) === null || _q === void 0 ? void 0 : _q.kcsaEmployees) &&
                                                    ((_r = op === null || op === void 0 ? void 0 : op.profile) === null || _r === void 0 ? void 0 : _r.kcsaEmployees.length) === 0
                                                    ? "Candidate"
                                                    : "Internal Employee"
                                                : (profileXAgent === null || profileXAgent === void 0 ? void 0 : profileXAgent.agentCode) === ConditionConfig_1.agentCode.RecruitmentHR
                                                    ? ConditionConfig_1.RoleName.RecruitmentHR
                                                    : ((_s = profileXAgent === null || profileXAgent === void 0 ? void 0 : profileXAgent.agent) === null || _s === void 0 ? void 0 : _s.name) || "";
                                            IdentityID = (_t = ProofIdentity.data) === null || _t === void 0 ? void 0 : _t.filter(function (item) { var _a; return (item === null || item === void 0 ? void 0 : item.value) === ((_a = op === null || op === void 0 ? void 0 : op.profile) === null || _a === void 0 ? void 0 : _a.identityTypeId); });
                                            familyDetails = (_v = (_u = op === null || op === void 0 ? void 0 : op.profile) === null || _u === void 0 ? void 0 : _u.familyDetails) === null || _v === void 0 ? void 0 : _v.map(function (item) {
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
                                            emergencyContacts = (_x = (_w = op === null || op === void 0 ? void 0 : op.profile) === null || _w === void 0 ? void 0 : _w.emergencyContacts) === null || _x === void 0 ? void 0 : _x.map(function (item) {
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
                                                empId: (_z = (_y = op === null || op === void 0 ? void 0 : op.profile) === null || _y === void 0 ? void 0 : _y.employeeReferenceDetails) === null || _z === void 0 ? void 0 : _z.empId,
                                                empName: (_1 = (_0 = op === null || op === void 0 ? void 0 : op.profile) === null || _0 === void 0 ? void 0 : _0.employeeReferenceDetails) === null || _1 === void 0 ? void 0 : _1.empName,
                                                empEmail: (_3 = (_2 = op === null || op === void 0 ? void 0 : op.profile) === null || _2 === void 0 ? void 0 : _2.employeeReferenceDetails) === null || _3 === void 0 ? void 0 : _3.empEmail,
                                                company: (_5 = (_4 = op === null || op === void 0 ? void 0 : op.profile) === null || _4 === void 0 ? void 0 : _4.employeeReferenceDetails) === null || _5 === void 0 ? void 0 : _5.company,
                                            };
                                            companyDetails = {
                                                operation: (_7 = (_6 = op === null || op === void 0 ? void 0 : op.profile) === null || _6 === void 0 ? void 0 : _6.profileDetailEmploymentHistory) === null || _7 === void 0 ? void 0 : _7.workedOperation,
                                                role: (_9 = (_8 = op === null || op === void 0 ? void 0 : op.profile) === null || _8 === void 0 ? void 0 : _8.profileDetailEmploymentHistory) === null || _9 === void 0 ? void 0 : _9.workRole,
                                                region: (_11 = (_10 = op === null || op === void 0 ? void 0 : op.profile) === null || _10 === void 0 ? void 0 : _10.profileDetailEmploymentHistory) === null || _11 === void 0 ? void 0 : _11.territory,
                                            };
                                            PPEData = [];
                                            if (!(op === null || op === void 0 ? void 0 : op.tblJobProfilePpeRequests)) return [3 /*break*/, 8];
                                            return [4 /*yield*/, CareerPortalAPI_1.PPEMasterTable.getPPEMaster()];
                                        case 7:
                                            PPEMaster = _111.sent();
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
                                            _111.label = 8;
                                        case 8:
                                            JobCode = (_12 = op === null || op === void 0 ? void 0 : op.jobCode) === null || _12 === void 0 ? void 0 : _12.split("-")[0];
                                            willingRelocated = getOptAnswers.filter(function (item) { var _a; return ((_a = item.question) === null || _a === void 0 ? void 0 : _a.quesContentId) === ConditionConfig_1.quesContentId.WillingRelocate; });
                                            code = (0, reusehooks_1.getcountryCode)((_13 = CountryCode === null || CountryCode === void 0 ? void 0 : CountryCode.data) !== null && _13 !== void 0 ? _13 : [], profileExperiance === null || profileExperiance === void 0 ? void 0 : profileExperiance.refMobile);
                                            PreviousEmployer = {
                                                name: profileExperiance === null || profileExperiance === void 0 ? void 0 : profileExperiance.refName,
                                                Designation: (_14 = profileExperiance === null || profileExperiance === void 0 ? void 0 : profileExperiance.refDesignationDetail) === null || _14 === void 0 ? void 0 : _14.displayText,
                                                Email: profileExperiance === null || profileExperiance === void 0 ? void 0 : profileExperiance.refEmail,
                                                ContractNumber: code !== null && code !== void 0 ? code : "",
                                                CompanyName: profileExperiance === null || profileExperiance === void 0 ? void 0 : profileExperiance.company,
                                            };
                                            candidateLanguages = ((_16 = (_15 = op === null || op === void 0 ? void 0 : op.profile) === null || _15 === void 0 ? void 0 : _15.profileDetailLanguages) === null || _16 === void 0 ? void 0 : _16.map(function (item) { return item.language; })) || [];
                                            _b = ((_18 = (_17 = op === null || op === void 0 ? void 0 : op.profile) === null || _17 === void 0 ? void 0 : _17.totalYearOfExperiance) !== null && _18 !== void 0 ? _18 : "0-0").split("-"), years = _b[0], months = _b[1];
                                            formattedExperience = "".concat(years, " years ").concat(months, " months");
                                            ContactNumber = (0, reusehooks_1.getcountryCode)((_19 = CountryCode === null || CountryCode === void 0 ? void 0 : CountryCode.data) !== null && _19 !== void 0 ? _19 : [], (_20 = op === null || op === void 0 ? void 0 : op.profile) === null || _20 === void 0 ? void 0 : _20.contactNumber1);
                                            GetProfileDahboard = {
                                                CandidateID: op === null || op === void 0 ? void 0 : op.jobRequestId,
                                                profileID: op === null || op === void 0 ? void 0 : op.profileId,
                                                JobCode: JobCode,
                                                JobTitle: (_22 = (_21 = op === null || op === void 0 ? void 0 : op.jobDetail) === null || _21 === void 0 ? void 0 : _21.descriptions_en) === null || _22 === void 0 ? void 0 : _22.jobTitle,
                                                ApplicantName: "".concat(((_23 = op === null || op === void 0 ? void 0 : op.profile) === null || _23 === void 0 ? void 0 : _23.firstName) || "", " ").concat(((_24 = op === null || op === void 0 ? void 0 : op.profile) === null || _24 === void 0 ? void 0 : _24.middleName) || "", " ").concat(((_25 = op === null || op === void 0 ? void 0 : op.profile) === null || _25 === void 0 ? void 0 : _25.lastName) || ""),
                                                ApplicantSurName: (_26 = op === null || op === void 0 ? void 0 : op.profile) === null || _26 === void 0 ? void 0 : _26.lastName,
                                                FristName: (_27 = op === null || op === void 0 ? void 0 : op.profile) === null || _27 === void 0 ? void 0 : _27.firstName,
                                                MiddleName: (_28 = op === null || op === void 0 ? void 0 : op.profile) === null || _28 === void 0 ? void 0 : _28.middleName,
                                                ResidentialAddress: (_30 = (_29 = op === null || op === void 0 ? void 0 : op.profile) === null || _29 === void 0 ? void 0 : _29.profileAddress) === null || _30 === void 0 ? void 0 : _30.address1,
                                                DOB: (_31 = op === null || op === void 0 ? void 0 : op.profile) === null || _31 === void 0 ? void 0 : _31.dob,
                                                ContactNumber: ContactNumber !== null && ContactNumber !== void 0 ? ContactNumber : "",
                                                Email: (_32 = op === null || op === void 0 ? void 0 : op.profile) === null || _32 === void 0 ? void 0 : _32.email,
                                                Nationality: (_34 = (_33 = op === null || op === void 0 ? void 0 : op.profile) === null || _33 === void 0 ? void 0 : _33.nationality) === null || _34 === void 0 ? void 0 : _34.displayText,
                                                NatioCode: (_36 = (_35 = op === null || op === void 0 ? void 0 : op.profile) === null || _35 === void 0 ? void 0 : _35.nationality) === null || _36 === void 0 ? void 0 : _36.value,
                                                Gender: ((_38 = (_37 = op === null || op === void 0 ? void 0 : op.profile) === null || _37 === void 0 ? void 0 : _37.gender) === null || _38 === void 0 ? void 0 : _38.displayText)
                                                    ? (_40 = (_39 = op === null || op === void 0 ? void 0 : op.profile) === null || _39 === void 0 ? void 0 : _39.gender) === null || _40 === void 0 ? void 0 : _40.displayText
                                                    : (_41 = op === null || op === void 0 ? void 0 : op.profile) === null || _41 === void 0 ? void 0 : _41.genderId,
                                                HighestQualification: (_43 = (_42 = op === null || op === void 0 ? void 0 : op.profile) === null || _42 === void 0 ? void 0 : _42.education) === null || _43 === void 0 ? void 0 : _43.displayText,
                                                ExperienceMining: ((_44 = op === null || op === void 0 ? void 0 : op.profile) === null || _44 === void 0 ? void 0 : _44.profileXAgent)
                                                    ? formattedExperience
                                                    : totalExperienceYears,
                                                ExperRelatedfield: (_45 = op === null || op === void 0 ? void 0 : op.profile) === null || _45 === void 0 ? void 0 : _45.releventExperience,
                                                Status: (_46 = op === null || op === void 0 ? void 0 : op.workflowStatus) === null || _46 === void 0 ? void 0 : _46.displayText,
                                                StatusId: op === null || op === void 0 ? void 0 : op.workflowStatusId,
                                                Agencies: AgenName,
                                                CandidateResume: CandidateCV.data,
                                                RoleProfile: RoleProfileDoc,
                                                // Advertisement: AdvertismentDocPromises,
                                                Comments: CommentsData,
                                                workflowStatusId: op === null || op === void 0 ? void 0 : op.workflowStatusId,
                                                hrComments: op === null || op === void 0 ? void 0 : op.hrComments,
                                                JobVaildFromDate: (_47 = op === null || op === void 0 ? void 0 : op.jobDetail) === null || _47 === void 0 ? void 0 : _47.validFrom,
                                                JobVaildToDate: (_48 = op === null || op === void 0 ? void 0 : op.jobDetail) === null || _48 === void 0 ? void 0 : _48.validTo,
                                                CandidateResumeLink: (_49 = op === null || op === void 0 ? void 0 : op.document) === null || _49 === void 0 ? void 0 : _49.filePath,
                                                ConflictsOfInterest: (_52 = (_51 = (_50 = op === null || op === void 0 ? void 0 : op.profile) === null || _50 === void 0 ? void 0 : _50.profileXOptAnswers[0]) === null || _51 === void 0 ? void 0 : _51.answerContent) === null || _52 === void 0 ? void 0 : _52.contentEn,
                                                disability: ((_54 = (_53 = op === null || op === void 0 ? void 0 : op.profile) === null || _53 === void 0 ? void 0 : _53.profileDetailDisclosure) === null || _54 === void 0 ? void 0 : _54.hasDisability) === 1
                                                    ? "Yes"
                                                    : "No",
                                                disabilityReason: (_56 = (_55 = op === null || op === void 0 ? void 0 : op.profile) === null || _55 === void 0 ? void 0 : _55.profileDetailDisclosure) === null || _56 === void 0 ? void 0 : _56.disabilityDetails,
                                                identityValue: (_57 = op === null || op === void 0 ? void 0 : op.profile) === null || _57 === void 0 ? void 0 : _57.identityValue,
                                                identityType: IdentityID && IdentityID.length > 0
                                                    ? IdentityID[0].displayText
                                                    : "Passport",
                                                NumberOftax: (_59 = (_58 = op === null || op === void 0 ? void 0 : op.profile) === null || _58 === void 0 ? void 0 : _58.taxDependents) !== null && _59 !== void 0 ? _59 : "",
                                                CurrentEmployer: profileExperiance === null || profileExperiance === void 0 ? void 0 : profileExperiance.company,
                                                CurrentPosition: profileExperiance === null || profileExperiance === void 0 ? void 0 : profileExperiance.title,
                                                WillingToRelocate: (_61 = (_60 = willingRelocated[0]) === null || _60 === void 0 ? void 0 : _60.answerContent) === null || _61 === void 0 ? void 0 : _61.contentEn,
                                                previouslyworkedMine: ((_63 = (_62 = op === null || op === void 0 ? void 0 : op.profile) === null || _62 === void 0 ? void 0 : _62.profileDetailEmploymentHistory) === null || _63 === void 0 ? void 0 : _63.hasIvanhoeZijinExperienceId) === "1"
                                                    ? "Yes"
                                                    : ((_65 = (_64 = op === null || op === void 0 ? void 0 : op.profile) === null || _64 === void 0 ? void 0 : _64.profileDetailEmploymentHistory) === null || _65 === void 0 ? void 0 : _65.hasIvanhoeZijinExperienceId) === undefined
                                                        ? undefined
                                                        : "No",
                                                familylinks: ((_66 = op === null || op === void 0 ? void 0 : op.profile) === null || _66 === void 0 ? void 0 : _66.hasEmployeeRelation) === "1" ? "Yes" : "No",
                                                businesslinks: ((_67 = op === null || op === void 0 ? void 0 : op.profile) === null || _67 === void 0 ? void 0 : _67.hasBusinessLinks) === "1" ? "Yes" : "No",
                                                familyDocuments: FamilyDocument.data,
                                                businessDocuments: BusinessDocument.data,
                                                Age: String(age),
                                                CountryofOrgin: (_70 = (_69 = (_68 = op === null || op === void 0 ? void 0 : op.profile) === null || _68 === void 0 ? void 0 : _68.nationality) === null || _69 === void 0 ? void 0 : _69.displayText) !== null && _70 !== void 0 ? _70 : "",
                                                Citizenship: (_73 = (_72 = (_71 = op === null || op === void 0 ? void 0 : op.profile) === null || _71 === void 0 ? void 0 : _71.nationality) === null || _72 === void 0 ? void 0 : _72.displayText) !== null && _73 !== void 0 ? _73 : "",
                                                FamilyLink: (_75 = (_74 = FamilyLinkPath[0]) === null || _74 === void 0 ? void 0 : _74.document) === null || _75 === void 0 ? void 0 : _75.filePath,
                                                BusinessLink: (_77 = (_76 = BusinessLinkPath[0]) === null || _76 === void 0 ? void 0 : _76.document) === null || _77 === void 0 ? void 0 : _77.filePath,
                                                GPA: 0,
                                                COIAppreve: (_80 = (_79 = (_78 = op === null || op === void 0 ? void 0 : op.profile) === null || _78 === void 0 ? void 0 : _78.profileDetailCoi) === null || _79 === void 0 ? void 0 : _79.approver) !== null && _80 !== void 0 ? _80 : "",
                                                COIComments: (_83 = (_82 = (_81 = op === null || op === void 0 ? void 0 : op.profile) === null || _81 === void 0 ? void 0 : _81.profileDetailCoi) === null || _82 === void 0 ? void 0 : _82.comments) !== null && _83 !== void 0 ? _83 : "",
                                                COIReason: (_85 = (_84 = op === null || op === void 0 ? void 0 : op.profile) === null || _84 === void 0 ? void 0 : _84.coiReason) !== null && _85 !== void 0 ? _85 : "",
                                                countryOfResidency: (_88 = (_87 = (_86 = op === null || op === void 0 ? void 0 : op.profile) === null || _86 === void 0 ? void 0 : _86.countryOfResidencyDetail) === null || _87 === void 0 ? void 0 : _87.countryName) !== null && _88 !== void 0 ? _88 : "",
                                                residentStatus: ((_89 = op === null || op === void 0 ? void 0 : op.profile) === null || _89 === void 0 ? void 0 : _89.residentStatus) === "Y"
                                                    ? "Yes"
                                                    : ((_90 = op === null || op === void 0 ? void 0 : op.profile) === null || _90 === void 0 ? void 0 : _90.residentStatus) === "N"
                                                        ? "No"
                                                        : "",
                                                maritalStatus: (_93 = (_92 = (_91 = op === null || op === void 0 ? void 0 : op.profile) === null || _91 === void 0 ? void 0 : _91.maritalStatusDetail) === null || _92 === void 0 ? void 0 : _92.displayText) !== null && _93 !== void 0 ? _93 : "",
                                                childrenDetails: ((_94 = op === null || op === void 0 ? void 0 : op.profile) === null || _94 === void 0 ? void 0 : _94.nationalityId) === "N0"
                                                    ? familyDetails
                                                    : emergencyContacts,
                                                employeeReferenceDetails: employeeReferenceDetail,
                                                maritalStatusId: (_96 = (_95 = op === null || op === void 0 ? void 0 : op.profile) === null || _95 === void 0 ? void 0 : _95.maritalStatus) !== null && _96 !== void 0 ? _96 : "",
                                                joiningDate: (_97 = op === null || op === void 0 ? void 0 : op.startDate) !== null && _97 !== void 0 ? _97 : "",
                                                noticePeriod: (_98 = op === null || op === void 0 ? void 0 : op.noticePeriodDays) !== null && _98 !== void 0 ? _98 : "",
                                                hasIvanhoeZijinExperience: ((_100 = (_99 = op === null || op === void 0 ? void 0 : op.profile) === null || _99 === void 0 ? void 0 : _99.profileDetailEmploymentHistory) === null || _100 === void 0 ? void 0 : _100.hasIvanhoeZijinExperienceId) === "3"
                                                    ? "No"
                                                    : ((_104 = (_103 = (_102 = (_101 = op === null || op === void 0 ? void 0 : op.profile) === null || _101 === void 0 ? void 0 : _101.profileDetailEmploymentHistory) === null || _102 === void 0 ? void 0 : _102.hasIvanhoeZijinExperience) === null || _103 === void 0 ? void 0 : _103.displayText) !== null && _104 !== void 0 ? _104 : ""),
                                                companyDetails: companyDetails,
                                                businesslinkscompany: ((_105 = op === null || op === void 0 ? void 0 : op.profile) === null || _105 === void 0 ? void 0 : _105.businessLinkCompany) === "CD03"
                                                    ? (_106 = op === null || op === void 0 ? void 0 : op.profile) === null || _106 === void 0 ? void 0 : _106.whichCompany
                                                    : (_108 = (_107 = op === null || op === void 0 ? void 0 : op.profile) === null || _107 === void 0 ? void 0 : _107.businessLinkCompanyDetail) === null || _108 === void 0 ? void 0 : _108.displayText,
                                                PreviousEmployerDetails: PreviousEmployer,
                                                LanguageKnown: candidateLanguages,
                                                PPEDetails: PPEData,
                                                OverallAtttachment: [],
                                                NationalityShort: ((_110 = (_109 = op === null || op === void 0 ? void 0 : op.profile) === null || _109 === void 0 ? void 0 : _109.nationality) === null || _110 === void 0 ? void 0 : _110.value) === ConditionConfig_1.NationalityCode.Nationals
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
                        error_6 = _a.sent();
                        console.error("Error inserting data into HRMSRecruitmentDptDetails:", error_6);
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
    CareerPortalService.prototype.UpdateCandidateStatus = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var Response_1, error_7;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, CareerPortalAPI_1.getProfileData.UpdateCandidateStatus(data)];
                    case 1:
                        Response_1 = _a.sent();
                        console.log(Response_1, "Response from UpdateCandidateStatus API");
                        console.log("Data sent to UpdateCandidateStatus API:", data);
                        return [2 /*return*/, {
                                data: Response_1.data,
                                status: Response_1.status,
                                message: Response_1.data.message,
                            }];
                    case 2:
                        error_7 = _a.sent();
                        console.error("Error inserting data into AdvertisementDetails:", error_7);
                        console.error("Data sent:", data);
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
    CareerPortalService.prototype.InsertCandidateDetailsInList = function (CandidateDetails, InterviewPanel) {
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
    CareerPortalService.prototype.InsertInterviewPanel = function (InterviewPanel, CandidateId) {
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
    CareerPortalService.prototype.UpsertMaster = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var MasterDetails, response, error_10;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        MasterDetails = data.map(function (item) { return ({
                            displayText: item.displayText,
                            displayText_fr: item.displayText_fr,
                            category: item.category,
                        }); });
                        return [4 /*yield*/, CareerPortalAPI_1.postAdveDetails.PostMaster(MasterDetails)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                data: response.data,
                                status: response.status,
                                message: response.data.message,
                            }];
                    case 2:
                        error_10 = _a.sent();
                        console.error("Error inserting data into AdvertisementDetails:", error_10);
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
    CareerPortalService.prototype.UpsertQuestions = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var UpsertQuestions, response, error_11;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        UpsertQuestions = data.map(function (item) { return ({
                            questionEn: item.questionEn,
                            questionFr: item.questionFr,
                            scopeId: item.scopeId,
                            categoryId: item.categoryId,
                            questionTypeId: item.questionTypeId,
                            isQualifier: item.isQualifier,
                            isAnswerValidate: item.isAnswerValidate,
                            sequence: item.sequence,
                            jobCode: item.jobCode,
                            options: item.options,
                            answers: item.answers,
                            createdBy: item.createdBy,
                        }); });
                        return [4 /*yield*/, CareerPortalAPI_1.QuestionnaireApi.PostQuestionnaire(UpsertQuestions)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                data: response.data,
                                status: response.status,
                                message: response.data.message,
                            }];
                    case 2:
                        error_11 = _a.sent();
                        console.error("Error inserting data into AdvertisementDetails:", error_11);
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
    // async GetAllMaster(id: number): Promise<ApiResponse<GetAllMaster[] | null>> {
    //     try {
    //         const response = await postAdveDetails.getMastersByCategory(id);
    //         const GetAllMasterData: GetAllMaster[] = response.data.data.map((item: any) => ({
    //             id: item.id,
    //             value: item.value,
    //             displayText: item.displayText,
    //             displayTextFr: item.displayText_fr,
    //         }));
    //         // console.log(GetAllMasterData, "GetAllMasterData");
    //         return {
    //             data: GetAllMasterData,
    //             status: response.status,
    //             message: "Get Candidate details",
    //         };
    //     } catch (error) {
    //         console.error(
    //             "Error Get Candidate details:",
    //             error
    //         );
    //         return {
    //             data: [],
    //             status: 500,
    //             message: "Error Get Candidate details",
    //         };
    //     }
    // }
    CareerPortalService.prototype.getQuestionnaire = function (jobCode) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, GetQuestionnaire, error_12;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, CareerPortalAPI_1.QuestionnaireApi.GetQuestionnaire(jobCode)];
                    case 1:
                        response = _a.sent();
                        GetQuestionnaire = response.data.data.map(function (item, index) {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                            var incrementedIndex = index + 1;
                            return {
                                id: incrementedIndex,
                                question: (_b = (_a = item === null || item === void 0 ? void 0 : item.question) === null || _a === void 0 ? void 0 : _a.quesContent) === null || _b === void 0 ? void 0 : _b.contentEn,
                                questionFr: (_d = (_c = item === null || item === void 0 ? void 0 : item.question) === null || _c === void 0 ? void 0 : _c.quesContent) === null || _d === void 0 ? void 0 : _d.contentFr,
                                answer: (_j = (_h = (_g = (_f = (_e = item === null || item === void 0 ? void 0 : item.question) === null || _e === void 0 ? void 0 : _e.questionXAnswers) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.optContent) === null || _h === void 0 ? void 0 : _h.contentEn) !== null && _j !== void 0 ? _j : "",
                                answerFr: (_p = (_o = (_m = (_l = (_k = item === null || item === void 0 ? void 0 : item.question) === null || _k === void 0 ? void 0 : _k.questionXAnswers) === null || _l === void 0 ? void 0 : _l[0]) === null || _m === void 0 ? void 0 : _m.optContent) === null || _o === void 0 ? void 0 : _o.contentFr) !== null && _p !== void 0 ? _p : "",
                                rating: 0,
                                header: "Q" + incrementedIndex,
                            };
                        });
                        // console.log(response, "GetAllMasterData");
                        return [2 /*return*/, {
                                data: GetQuestionnaire,
                                status: response.status,
                                message: "Get Candidate details",
                            }];
                    case 2:
                        error_12 = _a.sent();
                        console.error("Error Get Candidate details:", error_12);
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
    CareerPortalService.prototype.RescheduledInterview = function (obj, ListName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_13;
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
                        error_13 = _a.sent();
                        console.error(error_13);
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
    CareerPortalService.prototype.GetQuestionaireByScope = function (GetExistingQuestion) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, GetQuestionnaire, error_14;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, CareerPortalAPI_1.QuestionnaireApi.GetQuestionaireByScope(GetExistingQuestion)];
                    case 1:
                        response = _a.sent();
                        GetQuestionnaire = response.data.data
                            .map(function (item, index) {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                            var incrementedIndex = index + 1;
                            var question = (_b = (_a = item === null || item === void 0 ? void 0 : item.question) === null || _a === void 0 ? void 0 : _a.quesContent) === null || _b === void 0 ? void 0 : _b.contentEn;
                            var questionFr = (_d = (_c = item === null || item === void 0 ? void 0 : item.question) === null || _c === void 0 ? void 0 : _c.quesContent) === null || _d === void 0 ? void 0 : _d.contentFr;
                            var expectedAnswer = (_e = item === null || item === void 0 ? void 0 : item.question) === null || _e === void 0 ? void 0 : _e.questionXAnswers.map(function (item) { var _a; return (_a = item === null || item === void 0 ? void 0 : item.optContent) === null || _a === void 0 ? void 0 : _a.contentEn; });
                            var expectedAnswerFr = (_f = item === null || item === void 0 ? void 0 : item.question) === null || _f === void 0 ? void 0 : _f.questionXAnswers.map(function (item) { var _a; return (_a = item === null || item === void 0 ? void 0 : item.optContent) === null || _a === void 0 ? void 0 : _a.contentFr; });
                            if (!question || !expectedAnswer) {
                                return null;
                            }
                            var options = (_g = item === null || item === void 0 ? void 0 : item.question) === null || _g === void 0 ? void 0 : _g.questionXOptions.map(function (item) {
                                var _a, _b;
                                return {
                                    key: item === null || item === void 0 ? void 0 : item.questionId,
                                    text: (_a = item === null || item === void 0 ? void 0 : item.optContent) === null || _a === void 0 ? void 0 : _a.contentEn,
                                    textFr: (_b = item === null || item === void 0 ? void 0 : item.optContent) === null || _b === void 0 ? void 0 : _b.contentFr,
                                    isCorrect: false,
                                };
                            });
                            var CareerportalAnswer = (_j = (_h = item === null || item === void 0 ? void 0 : item.question) === null || _h === void 0 ? void 0 : _h.questionXAnswers) === null || _j === void 0 ? void 0 : _j.map(function (item, index) {
                                var _a, _b;
                                return {
                                    key: index,
                                    text: (_a = item === null || item === void 0 ? void 0 : item.optContent) === null || _a === void 0 ? void 0 : _a.contentEn,
                                    textFr: (_b = item === null || item === void 0 ? void 0 : item.optContent) === null || _b === void 0 ? void 0 : _b.contentFr,
                                    isCorrect: false,
                                };
                            });
                            return {
                                id: incrementedIndex,
                                Checked: false,
                                header: "Q" + incrementedIndex,
                                HeaderLabel: "Question" + incrementedIndex,
                                discipline: (_k = item === null || item === void 0 ? void 0 : item.question) === null || _k === void 0 ? void 0 : _k.scopeId,
                                scope: (_m = (_l = item === null || item === void 0 ? void 0 : item.question) === null || _l === void 0 ? void 0 : _l.questionType) === null || _m === void 0 ? void 0 : _m.displayText,
                                questionType: (_o = item === null || item === void 0 ? void 0 : item.question) === null || _o === void 0 ? void 0 : _o.questionTypeId,
                                question: question,
                                questionFr: questionFr,
                                expectedAnswer: expectedAnswer,
                                expectedAnswerFr: expectedAnswerFr,
                                CareerportalAnswer: CareerportalAnswer,
                                options: options,
                                Disqualification: (_p = item === null || item === void 0 ? void 0 : item.question) === null || _p === void 0 ? void 0 : _p.isQualifier,
                                Type: ConditionConfig_1.DataType.Existing,
                            };
                        })
                            .filter(function (item) { return item !== null; });
                        console.log(response, "GetAllMasterData");
                        return [2 /*return*/, {
                                data: GetQuestionnaire,
                                status: response.status,
                                message: "Get Candidate details",
                            }];
                    case 2:
                        error_14 = _a.sent();
                        console.error("Error Get Candidate details:", error_14);
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
    // async GetCountryMaster(): Promise<ApiResponse<GetMasterByCountry[] | null>> {
    //     try {
    //         const response = await GetStateByCountryApi.GetCountryApi();
    //         const GetAllMasterData: GetMasterByCountry[] = response.data?.data?.map((item: any) => ({
    //             id: item.isdcode,
    //             code: item.countryCode,
    //             text: item.countryName,
    //         }));
    //         // console.log(GetAllMasterData, "GetCountryMaster");
    //         return {
    //             data: GetAllMasterData,
    //             status: response.status,
    //             message: "Get Candidate details",
    //         };
    //     } catch (error) {
    //         console.error(
    //             "Error Get Candidate details:",
    //             error
    //         );
    //         return {
    //             data: [],
    //             status: 500,
    //             message: "Error Get Candidate details",
    //         };
    //     }
    // }
    CareerPortalService.prototype.GetStateByCountry = function (code) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, GetAllMasterData, error_15;
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, CareerPortalAPI_1.GetStateByCountryApi.GetStatebyCountry(code)];
                    case 1:
                        response = _c.sent();
                        GetAllMasterData = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.map(function (item) { return ({
                            id: item.stateId,
                            code: item.stateId,
                            text: item.state,
                        }); });
                        // console.log(GetAllMasterData, "GetCountryMaster");
                        return [2 /*return*/, {
                                data: GetAllMasterData,
                                status: response.status,
                                message: "Get Candidate details",
                            }];
                    case 2:
                        error_15 = _c.sent();
                        console.error("Error Get Candidate details:", error_15);
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
    CareerPortalService.prototype.GetCitiesByState = function (code) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, GetAllMasterData, error_16;
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, CareerPortalAPI_1.GetStateByCountryApi.GetCitiesbyState(code)];
                    case 1:
                        response = _c.sent();
                        GetAllMasterData = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.map(function (item) { return ({
                            id: item.stateId,
                            code: item.cityId,
                            text: item.city,
                        }); });
                        // console.log(GetAllMasterData, "GetCountryMaster");
                        return [2 /*return*/, {
                                data: GetAllMasterData,
                                status: response.status,
                                message: "Get Candidate details",
                            }];
                    case 2:
                        error_16 = _c.sent();
                        console.error("Error Get Candidate details:", error_16);
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
    CareerPortalService.prototype.UpsertProfile = function (data, Document, jobCode) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, UpsertProfile, UpsertData_1, CandidateCV, FamilyLink, BusinessLink, JobAppiledData, profileCurrentPosition, profileAttachment, error_17;
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 11, , 12]);
                        response = void 0;
                        UpsertProfile = [
                            {
                                contactNumber1: data.contactNumber1,
                                contactNumber2: data.contactNumber1,
                                dob: data.dob,
                                documentId: data.documentId,
                                educationId: data.educationId,
                                email: data.email,
                                firstName: data.firstName,
                                genderId: data.genderId,
                                identityTypeId: data.identityTypeId,
                                identityValue: data.identityValue,
                                jobsApplied: [],
                                lastName: data.lastName,
                                middleName: data.middleName,
                                nationalityId: data.nationalityId,
                                profileAddress: data.profileAddress,
                                profileDetailDisciplines: [],
                                profileDetailDisclosure: null,
                                profileDetailEducations: [],
                                profileDetailEmploymentHistory: data.profileDetailEmploymentHistory,
                                profileDetailExperiences: [],
                                profileDetailLanguages: [],
                                profileDetailSkills: [],
                                profileId: data.profileId,
                                profileXAgent: null,
                                profileXOptAnswers: data.profileXOptAnswers,
                                profileXTxtAnswers: [],
                                releventExperience: data.releventExperience,
                                title: data.title,
                                totalYearOfExperiance: data.totalYearOfExperiance,
                                hasBusinessLinks: String(data.hasBusinessLinks),
                                hasEmployeeRelation: String(data.hasEmployeeRelation),
                                profileDetailAttachments: [],
                            },
                        ];
                        return [4 /*yield*/, CareerPortalAPI_1.UploadCandidateCVData.UpsertProfile(UpsertProfile)];
                    case 1:
                        UpsertData_1 = _d.sent();
                        if (!(UpsertData_1.status === ApiConfig_1.ResponeStatus.SUCCESS)) return [3 /*break*/, 10];
                        return [4 /*yield*/, ServiceExport_1.CareerPotalServices.UpsertDocumentUpload({
                                DocumentTypeEnum: "0",
                                DocumentTypeName: "CV",
                                JobCode: jobCode,
                                File: Document.CandidateCV[0].content,
                                FileName: (_a = Document.CandidateCV[0]) === null || _a === void 0 ? void 0 : _a.name,
                                ProfileId: UpsertData_1.data.data[0].profileId.toString(),
                            })];
                    case 2:
                        CandidateCV = _d.sent();
                        FamilyLink = void 0;
                        if (!(Document.familyLink.length > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, ServiceExport_1.CareerPotalServices.UpsertDocumentUpload({
                                DocumentTypeEnum: "0",
                                DocumentTypeName: "Employee Relation",
                                JobCode: jobCode,
                                File: Document.familyLink[0].content,
                                FileName: (_b = Document.familyLink[0]) === null || _b === void 0 ? void 0 : _b.name,
                                ProfileId: UpsertData_1.data.data[0].profileId.toString(),
                            })];
                    case 3:
                        FamilyLink = _d.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        FamilyLink = { status: ApiConfig_1.ResponeStatus.SUCCESS };
                        _d.label = 5;
                    case 5:
                        BusinessLink = void 0;
                        if (!(Document.businessLink.length > 0)) return [3 /*break*/, 7];
                        return [4 /*yield*/, ServiceExport_1.CareerPotalServices.UpsertDocumentUpload({
                                DocumentTypeEnum: "0",
                                DocumentTypeName: "Business Link",
                                JobCode: jobCode,
                                File: Document.businessLink[0].content,
                                FileName: (_c = Document.businessLink[0]) === null || _c === void 0 ? void 0 : _c.name,
                                ProfileId: UpsertData_1.data.data[0].profileId.toString(),
                            })];
                    case 6:
                        BusinessLink = _d.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        BusinessLink = { status: ApiConfig_1.ResponeStatus.SUCCESS };
                        _d.label = 8;
                    case 8:
                        if (!(CandidateCV.status === ApiConfig_1.ResponeStatus.SUCCESS &&
                            FamilyLink.status === ApiConfig_1.ResponeStatus.SUCCESS &&
                            BusinessLink.status === ApiConfig_1.ResponeStatus.SUCCESS)) return [3 /*break*/, 10];
                        JobAppiledData = [
                            {
                                applicationStatusId: "AS02",
                                jobRequestId: 0,
                                jobCode: jobCode,
                                workflowStatusId: Config_1.workflowStatusApi.LineManagerL1Pending,
                                isSuspended: 0,
                                documentId: CandidateCV.data.data.documentId,
                            },
                        ];
                        profileCurrentPosition = data.profileDetailExperiences.map(function (item) {
                            return tslib_1.__assign(tslib_1.__assign({}, item), { profileId: UpsertData_1.data.data[0].profileId, title: item.title, roleDescription: item.roleDescription, company: item.company, location: item.location, startFrom: item.startFrom, endTo: item.endTo });
                        });
                        profileAttachment = [];
                        if (Document.businessLink.length > 0) {
                            profileAttachment = [
                                {
                                    AttachmentTypeCoe: "PA01",
                                    DocumentId: BusinessLink.data.data.documentId,
                                    ProfileId: UpsertData_1.data.data[0].profileId,
                                },
                            ];
                        }
                        if (Document.familyLink.length > 0) {
                            profileAttachment.push({
                                AttachmentTypeCoe: "PA02",
                                DocumentId: FamilyLink.data.data.documentId,
                                ProfileId: UpsertData_1.data.data[0].profileId,
                            });
                        }
                        UpsertProfile[0].profileId = UpsertData_1.data.data[0].profileId;
                        UpsertProfile[0].documentId = CandidateCV.data.data.documentId;
                        UpsertProfile[0].jobsApplied = JobAppiledData;
                        UpsertProfile[0].profileDetailExperiences = profileCurrentPosition;
                        UpsertProfile[0].profileDetailAttachments = profileAttachment !== null && profileAttachment !== void 0 ? profileAttachment : [];
                        return [4 /*yield*/, CareerPortalAPI_1.UploadCandidateCVData.UpsertProfile(UpsertProfile)];
                    case 9:
                        response = _d.sent();
                        _d.label = 10;
                    case 10: return [2 /*return*/, {
                            data: response.data,
                            status: response.status,
                            message: response.data.message,
                        }];
                    case 11:
                        error_17 = _d.sent();
                        console.error("Error inserting data into AdvertisementDetails:", error_17);
                        return [2 /*return*/, {
                                data: [],
                                status: 500,
                                message: "Error inserting data into AdvertisementDetails",
                            }];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    CareerPortalService.prototype.UpsertDocumentUpload = function (DocumentDetails) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var formData, response, error_18;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        formData = new FormData();
                        formData.append("DocumentTypeEnum", DocumentDetails.DocumentTypeEnum);
                        formData.append("DocumentTypeName", DocumentDetails.DocumentTypeName);
                        formData.append("JobCode", DocumentDetails.JobCode);
                        formData.append("File", DocumentDetails.File);
                        formData.append("FileName", DocumentDetails.FileName);
                        formData.append("ProfileId", DocumentDetails.ProfileId);
                        return [4 /*yield*/, CareerPortalAPI_1.UploadCandidateCVData.UploadDocument(formData)];
                    case 1:
                        response = _a.sent();
                        // console.log(response, "UploadDocument");
                        return [2 /*return*/, {
                                data: response.data,
                                status: response.status,
                                message: response.data.message,
                            }];
                    case 2:
                        error_18 = _a.sent();
                        console.error("Error inserting data into AdvertisementDetails:", error_18);
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
    CareerPortalService.prototype.CheckMyCandidateAppliedJobs = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var CheckCandidate, response, error_19;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        CheckCandidate = {
                            Email: data === null || data === void 0 ? void 0 : data.Email,
                            JobCode: data === null || data === void 0 ? void 0 : data.JobCode,
                        };
                        return [4 /*yield*/, CareerPortalAPI_1.UploadCandidateCVData.CheckMyCandidateAppliedJobs(CheckCandidate)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                data: response.data,
                                status: response.status,
                                message: response.data.message,
                            }];
                    case 2:
                        error_19 = _a.sent();
                        console.error("Error inserting data into AdvertisementDetails:", error_19);
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
    CareerPortalService.prototype.GetCandiateForJobs = function (JobCode, FilterValue) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var GetProfileByJobCodeData_2, error_20;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        GetProfileByJobCodeData_2 = [];
                        return [4 /*yield*/, CareerPortalAPI_1.UploadCandidateCVData.GetCandiateForJobs(JobCode, FilterValue)
                                .then(function (res) {
                                var _a, _b;
                                var TotalItems = (_b = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.pagination) === null || _b === void 0 ? void 0 : _b.totalItems;
                                GetProfileByJobCodeData_2 = res.data.data.map(function (item, index) {
                                    var _a, _b;
                                    var createdon = (item === null || item === void 0 ? void 0 : item.createdOn)
                                        ? new Date(item.createdOn)
                                        : new Date(item === null || item === void 0 ? void 0 : item.appliedDate);
                                    return {
                                        SNO: index + 1,
                                        CandidateID: item === null || item === void 0 ? void 0 : item.jobRequestId,
                                        ApplicantName: item === null || item === void 0 ? void 0 : item.applicantName,
                                        PositionTitle: (_a = item === null || item === void 0 ? void 0 : item.jobTitle) === null || _a === void 0 ? void 0 : _a.displayText,
                                        JobCode: item === null || item === void 0 ? void 0 : item.jobCode,
                                        Status: (_b = item === null || item === void 0 ? void 0 : item.workflowStatus) === null || _b === void 0 ? void 0 : _b.displayText,
                                        workflowStatusId: item === null || item === void 0 ? void 0 : item.workflowStatusId,
                                        createdOn: (0, moment_1.default)(createdon).format("DD/MM/YYYY HH:mm:ss"),
                                        TotalItems: TotalItems,
                                    };
                                });
                            })
                                .catch(function (error) {
                                console.log(error, "error");
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                data: GetProfileByJobCodeData_2,
                                status: 200,
                                message: "Get Candidate details",
                            }];
                    case 2:
                        error_20 = _a.sent();
                        console.error("Error Get Candidate details:", error_20);
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
    CareerPortalService.prototype.GetJobRequestData = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var Response_2, error_21;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, CareerPortalAPI_1.GetJobRequestData.GetJobRequestStatus(data)];
                    case 1:
                        Response_2 = _a.sent();
                        return [2 /*return*/, {
                                data: Response_2.data,
                                status: Response_2.status,
                                message: Response_2.data.message,
                            }];
                    case 2:
                        error_21 = _a.sent();
                        console.error("Error inserting data into AdvertisementDetails:", error_21);
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
    CareerPortalService.prototype.GetQuestionByJobCode = function (jobCode) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, getQueAnswers, GetQuestionnaire, error_22;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, CareerPortalAPI_1.UploadCandidateCVData.GetQuestionByJobCode(jobCode)];
                    case 1:
                        response = _a.sent();
                        getQueAnswers = response.data.data.jobCommonQuestions
                            .filter(function (item) { return (item === null || item === void 0 ? void 0 : item.scopeId) === "S7"; })
                            .sort(function (a, b) {
                            var textA = typeof a.text === "string" ? a.text : "";
                            var textB = typeof b.text === "string" ? b.text : "";
                            return textA.localeCompare(textB);
                        });
                        GetQuestionnaire = getQueAnswers.map(function (item, index) {
                            var _a, _b;
                            var incrementedIndex = index + 1;
                            var OptionContent = item.questionXOptions.map(function (items) {
                                var _a, _b;
                                return {
                                    optContentId: items.optContentId,
                                    optContent: (_a = items === null || items === void 0 ? void 0 : items.optContent) === null || _a === void 0 ? void 0 : _a.contentEn,
                                    optContentFr: (_b = items === null || items === void 0 ? void 0 : items.optContent) === null || _b === void 0 ? void 0 : _b.contentFr,
                                };
                            });
                            var htmlString = ((_a = item.quesContent) === null || _a === void 0 ? void 0 : _a.contentEn) || "";
                            var htmlStringFr = ((_b = item.quesContent) === null || _b === void 0 ? void 0 : _b.contentFr) || "";
                            var tempElement = document.createElement("div");
                            tempElement.innerHTML = htmlString;
                            var plainText = tempElement.innerText.replace(/\s*\*$/, "").trim();
                            var tempElementFr = document.createElement("div");
                            tempElementFr.innerHTML = htmlStringFr;
                            var plainTextFr = tempElementFr.innerText
                                .replace(/\s*\*$/, "")
                                .trim();
                            return {
                                id: incrementedIndex,
                                question: plainText,
                                questionFr: plainTextFr,
                                questionId: item === null || item === void 0 ? void 0 : item.questionId,
                                questionXOptions: OptionContent,
                                answerContentId: "",
                            };
                        });
                        return [2 /*return*/, {
                                data: GetQuestionnaire,
                                status: response.status,
                                message: "Get Candidate details",
                            }];
                    case 2:
                        error_22 = _a.sent();
                        console.error("Error Get Candidate details:", error_22);
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
    CareerPortalService.prototype.GetUpsertCOI = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var Response_3, error_23;
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
                        error_23 = _a.sent();
                        console.error("Error inserting data into AdvertisementDetails:", error_23);
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
    CareerPortalService.prototype.SendEmailNotification = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var Response_4, error_24;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, CareerPortalAPI_1.EmailService.emailnotification(data)];
                    case 1:
                        Response_4 = _a.sent();
                        return [2 /*return*/, {
                                data: Response_4.data,
                                status: Response_4.status,
                                message: Response_4.data.message,
                            }];
                    case 2:
                        error_24 = _a.sent();
                        console.error("Error inserting data into AdvertisementDetails:", error_24);
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
    CareerPortalService.prototype.GetJobAppliedCount = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, error_25;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, CareerPortalAPI_1.getProfileData.GetJobAppliedCount(data)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                data: response.data,
                                status: response.status,
                                message: response.data.message,
                            }];
                    case 2:
                        error_25 = _a.sent();
                        console.error("Error inserting data into AdvertisementDetails:", error_25);
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
    CareerPortalService.prototype.GetCOIProfileOption = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var GetItem, error_26;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        GetItem = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, spservice_1.default.SPReadItems({
                                Listname: Config_1.ListNames.JDEDataMapping,
                                Select: "*,BUC/BusineesUnitCode,LineManager/EMail,HOD/EMail,HR/EMail,EXCO/EMail",
                                Filter: [
                                    {
                                        FilterKey: "BUC",
                                        Operator: "eq",
                                        FilterValue: data.BusinessUnitCodeId,
                                    },
                                ],
                                Expand: "BUC,LineManager,HOD,HR,EXCO",
                                Orderby: "ID",
                                Orderbydecorasc: true,
                            })
                                .then(function (res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var _i, res_1, item, UserName, LineManager, UserName, HOD;
                                var _a, _b, _c, _d;
                                return tslib_1.__generator(this, function (_e) {
                                    switch (_e.label) {
                                        case 0:
                                            _i = 0, res_1 = res;
                                            _e.label = 1;
                                        case 1:
                                            if (!(_i < res_1.length)) return [3 /*break*/, 6];
                                            item = res_1[_i];
                                            if (!((item === null || item === void 0 ? void 0 : item.LineManagerId) && ((_a = item === null || item === void 0 ? void 0 : item.LineManager) === null || _a === void 0 ? void 0 : _a.EMail))) return [3 /*break*/, 3];
                                            return [4 /*yield*/, ServiceExport_1.CommonServices.GetUserName(item.LineManager.EMail)];
                                        case 2:
                                            UserName = _e.sent();
                                            LineManager = {
                                                key: item.LineManager.EMail,
                                                text: String(UserName.data),
                                            };
                                            GetItem.push(LineManager);
                                            _e.label = 3;
                                        case 3:
                                            if (!((item === null || item === void 0 ? void 0 : item.HODId) && ((_b = item === null || item === void 0 ? void 0 : item.HOD) === null || _b === void 0 ? void 0 : _b.EMail))) return [3 /*break*/, 5];
                                            return [4 /*yield*/, ServiceExport_1.CommonServices.GetUserName((_c = item === null || item === void 0 ? void 0 : item.HOD) === null || _c === void 0 ? void 0 : _c.EMail)];
                                        case 4:
                                            UserName = _e.sent();
                                            HOD = {
                                                key: (_d = item === null || item === void 0 ? void 0 : item.HOD) === null || _d === void 0 ? void 0 : _d.EMail,
                                                text: String(UserName.data),
                                            };
                                            GetItem.push(HOD);
                                            _e.label = 5;
                                        case 5:
                                            _i++;
                                            return [3 /*break*/, 1];
                                        case 6: return [2 /*return*/];
                                    }
                                });
                            }); })
                                .catch(function (error) {
                                console.log("Error fetching data GetHRMSRecruitmentRoleProfileDetails:", error);
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, {
                                data: GetItem,
                                status: 200,
                                message: "GetHRMSRecruitmentRoleProfileDetails fetched successfully",
                            }];
                    case 3:
                        error_26 = _a.sent();
                        console.error("Error fetching data GetHRMSRecruitmentRoleProfileDetails:", error_26);
                        return [2 /*return*/, {
                                data: GetItem,
                                status: 500,
                                message: "Error fetching data from GetHRMSRecruitmentRoleProfileDetails",
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return CareerPortalService;
}());
exports.default = CareerPortalService;
//# sourceMappingURL=CareerPortalService.js.map