"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ConditionConfig_1 = require("../../utilities/ConditionConfig");
var Config_1 = require("../../utilities/Config");
var CareerPortalAPI_1 = require("../AxiosService/CareerPortalAPI");
var ServiceExport_1 = require("../ServiceExport");
var spservice_1 = tslib_1.__importDefault(require("../SPService/spservice"));
var OfferService = /** @class */ (function () {
    function OfferService() {
        var _this = this;
        this.FetchBGVerificationDOcs = function (DocumentName) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var response, BGVDocs, error_1;
            var _this = this;
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        response = [];
                        if (!(((_a = DocumentName === null || DocumentName === void 0 ? void 0 : DocumentName.DocumentName) === null || _a === void 0 ? void 0 : _a.length) > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.all(DocumentName.DocumentName.map(function (item) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var files, folderName, VerifiName, file;
                                var _a, _b;
                                return tslib_1.__generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            if (!(spservice_1.default === null || spservice_1.default === void 0 ? void 0 : spservice_1.default.getDocLibFiles)) {
                                                console.error("SPServices.getDocLibFiles is undefined");
                                                return [2 /*return*/, null];
                                            }
                                            return [4 /*yield*/, spservice_1.default.getDocLibFiles({
                                                    FilePath: "".concat(DocumentName.ListName, "/").concat(DocumentName.ProfileID, "/").concat(DocumentName.RequestID, "/").concat(DocumentName.DocumentType, "/").concat(item),
                                                })];
                                        case 1:
                                            files = _c.sent();
                                            folderName = "";
                                            if (item in ConditionConfig_1.BGVDocumentName) {
                                                VerifiName = (_a = DocumentName.VerificationName) === null || _a === void 0 ? void 0 : _a.filter(function (items) { return items.value === item; });
                                                folderName =
                                                    VerifiName && (VerifiName === null || VerifiName === void 0 ? void 0 : VerifiName.length) > 0
                                                        ? (_b = VerifiName[0]) === null || _b === void 0 ? void 0 : _b.displayText
                                                        : "";
                                                // folderName = BGVDocumentName[item as keyof typeof BGVDocumentName];
                                            }
                                            file = [folderName, files];
                                            return [2 /*return*/, file];
                                    }
                                });
                            }); }))];
                    case 1:
                        BGVDocs = _b.sent();
                        response = BGVDocs.filter(function (x) {
                            return x &&
                                x !== null &&
                                x[1] &&
                                (!Array.isArray(x[1]) || x[1].length > 0);
                        });
                        _b.label = 2;
                    case 2: return [2 /*return*/, {
                            data: response,
                            status: 200,
                            message: "BGV Documents fetched",
                        }];
                    case 3:
                        error_1 = _b.sent();
                        console.error("Error during file replacement process:", error_1);
                        return [2 /*return*/, {
                                data: null,
                                status: 500,
                                message: "Error during file replacement: ".concat(error_1.message),
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.UploadCandidateDocument = function (DocumentName, AttachFile) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var response, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 12, , 13]);
                        response = void 0;
                        if (!(AttachFile.length > 0)) return [3 /*break*/, 11];
                        if (!(DocumentName.DocumentName === ConditionConfig_1.DocumentFolderName.BGVConsentform)) return [3 /*break*/, 2];
                        return [4 /*yield*/, spservice_1.default.addDocLibFiles({
                                FilePath: Config_1.DocumentLibraray.HRMSCareerPortalCandidateCV,
                                FolderNames: [
                                    "".concat(DocumentName.ProfileID.toString()),
                                    "".concat(DocumentName.DocumentName.toString()),
                                ],
                                Datas: AttachFile,
                            })];
                    case 1:
                        response = _a.sent();
                        return [3 /*break*/, 10];
                    case 2:
                        if (!(DocumentName.DocumentName === ConditionConfig_1.DocumentFolderName.ProofOfDocument)) return [3 /*break*/, 4];
                        return [4 /*yield*/, spservice_1.default.addDocLibFiles({
                                FilePath: Config_1.DocumentLibraray.HRMSCareerPortalCandidateCV,
                                FolderNames: [
                                    "".concat(DocumentName.ProfileID.toString()),
                                    "".concat(DocumentName.RequestID.toString()),
                                    "".concat(DocumentName.DocumentName.toString()),
                                ],
                                Datas: AttachFile,
                            })];
                    case 3:
                        response = _a.sent();
                        return [3 /*break*/, 10];
                    case 4:
                        if (!(DocumentName.DocumentName === ConditionConfig_1.DocumentFolderName.BGVProofOfDocument)) return [3 /*break*/, 6];
                        return [4 /*yield*/, spservice_1.default.addDocLibFiles({
                                FilePath: Config_1.DocumentLibraray.HRMSCareerPortalCandidateCV,
                                FolderNames: [
                                    "".concat(DocumentName.ProfileID.toString()),
                                    "".concat(DocumentName.RequestID.toString()),
                                    "".concat(DocumentName.DocumentName.toString()),
                                ],
                                Datas: AttachFile,
                            })];
                    case 5:
                        response = _a.sent();
                        return [3 /*break*/, 10];
                    case 6:
                        if (!(DocumentName.DocumentName === ConditionConfig_1.DocumentFolderName.WorkPermit)) return [3 /*break*/, 8];
                        return [4 /*yield*/, spservice_1.default.addDocLibFiles({
                                FilePath: Config_1.DocumentLibraray.HRMSCareerPortalCandidateCV,
                                FolderNames: [
                                    "".concat(DocumentName.ProfileID.toString()),
                                    "".concat(DocumentName.RequestID.toString()),
                                    "".concat(DocumentName.DocumentName.toString()),
                                ],
                                Datas: AttachFile,
                            })];
                    case 7:
                        response = _a.sent();
                        return [3 /*break*/, 10];
                    case 8: return [4 /*yield*/, spservice_1.default.addDocLibFiles({
                            FilePath: Config_1.DocumentLibraray.HRMSCareerPortalCandidateCV,
                            FolderNames: [
                                "".concat(DocumentName.ProfileID.toString()),
                                "".concat(DocumentName.RequestID.toString()),
                                "".concat(DocumentName.DocumentName.toString()),
                                "".concat(DocumentName.UnsignedDoc.toString()),
                            ],
                            Datas: AttachFile,
                        })];
                    case 9:
                        response = _a.sent();
                        _a.label = 10;
                    case 10: return [2 /*return*/, {
                            data: response,
                            status: 200,
                            message: "Attachment replaced successfully",
                        }];
                    case 11: return [2 /*return*/, {
                            data: response,
                            status: 400,
                            message: "No attachments provided",
                        }];
                    case 12:
                        error_2 = _a.sent();
                        console.error("Error during file replacement process:", error_2);
                        return [2 /*return*/, {
                                data: null,
                                status: 500,
                                message: "Error during file replacement}",
                            }];
                    case 13: return [2 /*return*/];
                }
            });
        }); };
        this.FetchCandidateDocument = function (DocumentName) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var response, _a, files, files, medical, vaccination, workPermit, allFiles, files, files, files, error_3;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 16, , 17]);
                        response = null;
                        _a = DocumentName.DocumentType;
                        switch (_a) {
                            case ConditionConfig_1.DocumentFolderName.BackgroundVerification: return [3 /*break*/, 1];
                            case ConditionConfig_1.DocumentFolderName.Offerletter: return [3 /*break*/, 3];
                            case ConditionConfig_1.DocumentFolderName.WorkPermit: return [3 /*break*/, 5];
                            case ConditionConfig_1.DocumentFolderName.CovidVaccinationCertificate: return [3 /*break*/, 9];
                            case ConditionConfig_1.DocumentFolderName.PoliceClearanceCertificate: return [3 /*break*/, 9];
                            case ConditionConfig_1.DocumentFolderName.YellowFeverVaccinationCertificate: return [3 /*break*/, 9];
                            case ConditionConfig_1.DocumentFolderName.PaymentBill: return [3 /*break*/, 9];
                            case ConditionConfig_1.DocumentFolderName.EmploymentContractForm: return [3 /*break*/, 11];
                        }
                        return [3 /*break*/, 13];
                    case 1: return [4 /*yield*/, spservice_1.default.getDocLibFiles({
                            FilePath: "".concat(DocumentName.ListName, "/").concat(DocumentName.ProfileID, "/").concat(DocumentName.DocumentType),
                        })];
                    case 2:
                        files = (_b.sent());
                        response = files;
                        return [3 /*break*/, 15];
                    case 3: return [4 /*yield*/, spservice_1.default.getDocLibFiles({
                            FilePath: "".concat(DocumentName.ListName, "/").concat(DocumentName.ProfileID, "/").concat(DocumentName.RequestID, "/").concat(DocumentName.DocumentType, "/").concat(DocumentName.UnsignedDoc),
                        })];
                    case 4:
                        files = (_b.sent());
                        response = files;
                        return [3 /*break*/, 15];
                    case 5: return [4 /*yield*/, spservice_1.default.getDocLibFiles({
                            FilePath: "".concat(DocumentName.ListName, "/").concat(DocumentName.ProfileID, "/").concat(DocumentName.RequestID, "/").concat(ConditionConfig_1.DocumentFolderName.Medical),
                        })];
                    case 6:
                        medical = (_b.sent());
                        return [4 /*yield*/, spservice_1.default.getDocLibFiles({
                                FilePath: "".concat(DocumentName.ListName, "/").concat(DocumentName.ProfileID, "/").concat(ConditionConfig_1.DocumentFolderName.Vaccination),
                            })];
                    case 7:
                        vaccination = (_b.sent());
                        return [4 /*yield*/, spservice_1.default.getDocLibFiles({
                                FilePath: "".concat(DocumentName.ListName, "/").concat(DocumentName.ProfileID, "/").concat(DocumentName.RequestID, "/").concat(ConditionConfig_1.DocumentFolderName.WorkPermit),
                            })];
                    case 8:
                        workPermit = (_b.sent());
                        allFiles = tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray([], (medical || []), true), (vaccination || []), true), (workPermit || []), true);
                        response = allFiles;
                        return [3 /*break*/, 15];
                    case 9: return [4 /*yield*/, spservice_1.default.getDocLibFiles({
                            FilePath: "".concat(DocumentName.ListName, "/").concat(DocumentName.ProfileID, "/").concat(DocumentName.RequestID, "/").concat(DocumentName.DocumentType),
                        })];
                    case 10:
                        files = (_b.sent());
                        response = files;
                        return [3 /*break*/, 15];
                    case 11: return [4 /*yield*/, spservice_1.default.getDocLibFiles({
                            FilePath: "".concat(DocumentName.ListName, "/").concat(DocumentName.ProfileID, "/").concat(DocumentName.RequestID, "/").concat(DocumentName.DocumentType, "/").concat(DocumentName.UnsignedDoc),
                        })];
                    case 12:
                        files = (_b.sent());
                        response = files;
                        return [3 /*break*/, 15];
                    case 13: return [4 /*yield*/, spservice_1.default.getDocLibFiles({
                            FilePath: "".concat(DocumentName.ListName, "/").concat(DocumentName.ProfileID),
                        })];
                    case 14:
                        files = (_b.sent());
                        response = files;
                        return [3 /*break*/, 15];
                    case 15: return [2 /*return*/, {
                            data: response,
                            status: 200,
                            message: response
                                ? "Latest file fetched successfully"
                                : "No attachments provided",
                        }];
                    case 16:
                        error_3 = _b.sent();
                        console.error("Error during file fetch:", error_3);
                        return [2 /*return*/, {
                                data: null,
                                status: 500,
                                message: "Error during file fetch: ".concat(error_3.message),
                            }];
                    case 17: return [2 /*return*/];
                }
            });
        }); };
        this.UpdateStatusSelectedHOD = function (UpdateParams) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var response, ListUpdate, error_4;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        ListUpdate = UpdateParams.map(function (item) { return ({
                            ID: item.ID,
                            StatusId: item.StatusId,
                            // ActionId: item.ActionId,
                            // ItemCreated: "Yes",
                        }); });
                        return [4 /*yield*/, spservice_1.default.batchUpdate({
                                ListName: "".concat(Config_1.ListNames.HRMSSelectedCandidateDetailsByHOD),
                                responseData: ListUpdate,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                data: response,
                                status: 200,
                                message: "Candidate details fetched successfully",
                            }];
                    case 2:
                        error_4 = _a.sent();
                        console.error("Error during file replacement process:", error_4);
                        return [2 /*return*/, {
                                data: response,
                                status: 500,
                                message: "Error during file replacement",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.UpdateStatusCandidatelist = function (UpdateParams) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var response, error_5;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                                Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                                RequestJSON: UpdateParams,
                                ID: UpdateParams.ID,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                data: response,
                                status: 200,
                                message: "Candidate details fetched successfully",
                            }];
                    case 2:
                        error_5 = _a.sent();
                        console.error("Error during file replacement process:", error_5);
                        return [2 /*return*/, {
                                data: response,
                                status: 500,
                                message: "Error during file replacement",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.fetchPreChecklist = function (UpdateParams) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var response, error_6;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                                Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                                RequestJSON: UpdateParams,
                                ID: UpdateParams.ID,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                data: response,
                                status: 200,
                                message: "Candidate details fetched successfully",
                            }];
                    case 2:
                        error_6 = _a.sent();
                        console.error("Error during file replacement process:", error_6);
                        return [2 /*return*/, {
                                data: response,
                                status: 500,
                                message: "Error during file replacement",
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
    }
    OfferService.prototype.GetSelectedCandidate = function (RecID, CandidateID, SelectedCandidateID, JobRequestID, isExpat) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var queries, _a, batchRes, careerRes, recruitment, recruitmentPosition, candidatePersonal, candidateSelected, residetails, ref, PPT, getDotAfricaCF, PreOnboarding, mappedData, error_7;
            var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17;
            return tslib_1.__generator(this, function (_18) {
                switch (_18.label) {
                    case 0:
                        _18.trys.push([0, 3, , 4]);
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
                            {
                                StateValue: 5,
                                ListName: isExpat
                                    ? Config_1.ListNames.HRMSRESIExpatDetails
                                    : Config_1.ListNames.HRMSRESIDRCDetails,
                                Filter: [
                                    {
                                        FilterKey: "SelectedCandidateHODId",
                                        Operator: "eq",
                                        FilterValue: SelectedCandidateID,
                                    },
                                ],
                                FilterCondition: "and",
                                select: [
                                    "*",
                                    "SelectedCandidateHODId/ID",
                                    "LabourhireORContractor/AgentName",
                                ],
                                expand: ["SelectedCandidateHODId", "LabourhireORContractor"],
                            },
                        ];
                        return [4 /*yield*/, Promise.all([
                                spservice_1.default.batchGet(queries),
                                ServiceExport_1.CandidateTable.fetchCandidateDetails(JobRequestID),
                            ])];
                    case 1:
                        _a = _18.sent(), batchRes = _a[0], careerRes = _a[1];
                        recruitment = (_b = batchRes[1]) === null || _b === void 0 ? void 0 : _b[0];
                        recruitmentPosition = (_c = batchRes[2]) === null || _c === void 0 ? void 0 : _c[0];
                        candidatePersonal = (_d = batchRes[3]) === null || _d === void 0 ? void 0 : _d[0];
                        candidateSelected = (_e = batchRes[4]) === null || _e === void 0 ? void 0 : _e[0];
                        residetails = (_f = batchRes[5]) === null || _f === void 0 ? void 0 : _f[0];
                        ref = (_h = (_g = careerRes === null || careerRes === void 0 ? void 0 : careerRes.data) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.PreviousEmployerDetails;
                        PPT = (_l = (_k = (_j = careerRes === null || careerRes === void 0 ? void 0 : careerRes.data) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.PPEDetails) === null || _l === void 0 ? void 0 : _l.map(function (item) {
                            return {
                                kit: item === null || item === void 0 ? void 0 : item.PPEType,
                                size: item === null || item === void 0 ? void 0 : item.PPESize,
                            };
                        });
                        return [4 /*yield*/, spservice_1.default.getDocLibFiles({
                                FilePath: "".concat(Config_1.DocumentLibraray.HRMSCareerPortalCandidateCV, "/").concat((_o = (_m = careerRes === null || careerRes === void 0 ? void 0 : careerRes.data) === null || _m === void 0 ? void 0 : _m[0]) === null || _o === void 0 ? void 0 : _o.profileID, "/").concat(JobRequestID, "/").concat(ConditionConfig_1.DocumentFolderName.BackgroundVerification, "/").concat("ConsentForm"),
                            })];
                    case 2:
                        getDotAfricaCF = (_18.sent());
                        PreOnboarding = {
                            BackgroundChecks: (candidatePersonal === null || candidatePersonal === void 0 ? void 0 : candidatePersonal.BackgroundChecks) === ConditionConfig_1.ActionName.Completed
                                ? true
                                : false,
                            SignedOfferLetterVerified: (candidatePersonal === null || candidatePersonal === void 0 ? void 0 : candidatePersonal.SignedOfferLetterVerified) === ConditionConfig_1.ActionName.Completed
                                ? true
                                : false,
                            VisaProcess: (candidatePersonal === null || candidatePersonal === void 0 ? void 0 : candidatePersonal.VisaProcess) === ConditionConfig_1.ActionName.Completed
                                ? true
                                : false,
                            AccommodationBooked: (candidatePersonal === null || candidatePersonal === void 0 ? void 0 : candidatePersonal.AccommodationBooked) === ConditionConfig_1.ActionName.Completed
                                ? true
                                : false,
                            SignedEmploymentContract: (candidatePersonal === null || candidatePersonal === void 0 ? void 0 : candidatePersonal.SignedEmploymentContract) === ConditionConfig_1.ActionName.Completed
                                ? true
                                : false,
                            WorkPermitApproved: (candidatePersonal === null || candidatePersonal === void 0 ? void 0 : candidatePersonal.WorkPermitApproved) === ConditionConfig_1.ActionName.Completed
                                ? true
                                : false,
                            TravelProcess: (candidatePersonal === null || candidatePersonal === void 0 ? void 0 : candidatePersonal.TravelProcess) === ConditionConfig_1.ActionName.Completed
                                ? true
                                : false,
                            MedicalCheckStatus: (candidatePersonal === null || candidatePersonal === void 0 ? void 0 : candidatePersonal.MedicalCheckStatus) === ConditionConfig_1.ActionName.Completed
                                ? true
                                : false,
                            ReadyForOnboarding: (candidatePersonal === null || candidatePersonal === void 0 ? void 0 : candidatePersonal.ReadyforOnboarding) === ConditionConfig_1.ActionName.Completed
                                ? true
                                : false,
                        };
                        mappedData = {
                            ID: SelectedCandidateID,
                            CandidateID: CandidateID,
                            RecID: RecID,
                            JobTiltle: (_p = recruitmentPosition === null || recruitmentPosition === void 0 ? void 0 : recruitmentPosition.JobTitleEnglish) === null || _p === void 0 ? void 0 : _p.JobTitleInEnglish,
                            JobCode: (_q = recruitmentPosition === null || recruitmentPosition === void 0 ? void 0 : recruitmentPosition.JobTitleEnglish) === null || _q === void 0 ? void 0 : _q.JobCode,
                            positionID: (_r = candidateSelected === null || candidateSelected === void 0 ? void 0 : candidateSelected.PositionID) === null || _r === void 0 ? void 0 : _r.PositionID,
                            ApplicantName: [
                                candidatePersonal.FristName,
                                candidatePersonal.MiddleName,
                                candidatePersonal.LastName,
                            ]
                                .filter(Boolean)
                                .join(" "),
                            // .trim(),`${?.firstName || ""} ${candidatePersonal?.middleName || ""} ${candidatePersonal?.lastName || ""}`,
                            Nationality: candidatePersonal === null || candidatePersonal === void 0 ? void 0 : candidatePersonal.Nationality,
                            Gender: candidatePersonal === null || candidatePersonal === void 0 ? void 0 : candidatePersonal.Gender,
                            ProofOfIdentity: candidatePersonal === null || candidatePersonal === void 0 ? void 0 : candidatePersonal.ProofOfIdentity,
                            IdentityNumber: candidatePersonal === null || candidatePersonal === void 0 ? void 0 : candidatePersonal.IdentityNumber,
                            Email: candidatePersonal === null || candidatePersonal === void 0 ? void 0 : candidatePersonal.Email,
                            Location: "DRC", // candidatePersonal?.Location,
                            BusinessUnitCode: (_s = recruitment === null || recruitment === void 0 ? void 0 : recruitment.BusinessUnitCode) === null || _s === void 0 ? void 0 : _s.BusineesUnitCode,
                            BusinessUnitCodeId: (_t = recruitment === null || recruitment === void 0 ? void 0 : recruitment.BusinessUnitCode) === null || _t === void 0 ? void 0 : _t.Id,
                            Department: (_u = recruitment === null || recruitment === void 0 ? void 0 : recruitment.Department) === null || _u === void 0 ? void 0 : _u.DepartmentName,
                            SubDepartment: (_v = recruitment === null || recruitment === void 0 ? void 0 : recruitment.SubDepartment) === null || _v === void 0 ? void 0 : _v.SubDepTitle,
                            Section: (_w = recruitment === null || recruitment === void 0 ? void 0 : recruitment.Section) === null || _w === void 0 ? void 0 : _w.SectionName,
                            DepartmentCode: (_x = recruitment === null || recruitment === void 0 ? void 0 : recruitment.DepartmentCode) === null || _x === void 0 ? void 0 : _x.DptCode,
                            EmploymentCategory: recruitment === null || recruitment === void 0 ? void 0 : recruitment.EmploymentCategory,
                            TypeofContract: recruitment === null || recruitment === void 0 ? void 0 : recruitment.TypeOfContract,
                            AreaofWork: recruitment === null || recruitment === void 0 ? void 0 : recruitment.AreaofWork,
                            JoiningDate: (_0 = (_z = (_y = careerRes === null || careerRes === void 0 ? void 0 : careerRes.data) === null || _y === void 0 ? void 0 : _y[0]) === null || _z === void 0 ? void 0 : _z.joiningDate) !== null && _0 !== void 0 ? _0 : "-",
                            NoticePeriod: (_3 = (_2 = (_1 = careerRes === null || careerRes === void 0 ? void 0 : careerRes.data) === null || _1 === void 0 ? void 0 : _1[0]) === null || _2 === void 0 ? void 0 : _2.noticePeriod) !== null && _3 !== void 0 ? _3 : "-",
                            ReferenceName: (_4 = ref === null || ref === void 0 ? void 0 : ref.name) !== null && _4 !== void 0 ? _4 : "-",
                            ReferenceDesignation: (_5 = ref === null || ref === void 0 ? void 0 : ref.Designation) !== null && _5 !== void 0 ? _5 : "-",
                            ReferenceEmail: (_6 = ref === null || ref === void 0 ? void 0 : ref.Email) !== null && _6 !== void 0 ? _6 : "-",
                            ReferencePhone: (_7 = ref === null || ref === void 0 ? void 0 : ref.ContractNumber) !== null && _7 !== void 0 ? _7 : "-",
                            ReferenceCompanyName: (_8 = ref === null || ref === void 0 ? void 0 : ref.CompanyName) !== null && _8 !== void 0 ? _8 : "-",
                            StatusID: candidateSelected === null || candidateSelected === void 0 ? void 0 : candidateSelected.StatusId,
                            ProfileID: (_11 = String((_10 = (_9 = careerRes === null || careerRes === void 0 ? void 0 : careerRes.data) === null || _9 === void 0 ? void 0 : _9[0]) === null || _10 === void 0 ? void 0 : _10.profileID)) !== null && _11 !== void 0 ? _11 : "-",
                            JobRequestID: (_12 = String(JobRequestID)) !== null && _12 !== void 0 ? _12 : "-",
                            PPEItems: PPT !== null && PPT !== void 0 ? PPT : [],
                            DotAfricaCF: getDotAfricaCF[0],
                            NationalityCode: (_13 = candidatePersonal === null || candidatePersonal === void 0 ? void 0 : candidatePersonal.NationalityCode) !== null && _13 !== void 0 ? _13 : "",
                            patersonGrade: (_14 = recruitmentPosition === null || recruitmentPosition === void 0 ? void 0 : recruitmentPosition.PatersonGrade) === null || _14 === void 0 ? void 0 : _14.PatersonGrade,
                            drcGrade: (_15 = recruitmentPosition === null || recruitmentPosition === void 0 ? void 0 : recruitmentPosition.DRCGrade) === null || _15 === void 0 ? void 0 : _15.DRCGrade,
                            PreChecklist: PreOnboarding,
                            labourHire: (_17 = (_16 = residetails === null || residetails === void 0 ? void 0 : residetails.LabourhireORContractor) === null || _16 === void 0 ? void 0 : _16.AgentName) !== null && _17 !== void 0 ? _17 : "",
                        };
                        return [2 /*return*/, {
                                data: mappedData,
                                status: 200,
                                message: "Selected candidate fetched successfully",
                            }];
                    case 3:
                        error_7 = _18.sent();
                        console.error("GetSelectedCandidate error:", error_7);
                        return [2 /*return*/, {
                                data: null,
                                status: 500,
                                message: "Error fetching selected candidate",
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OfferService.prototype.InitiateLabouHireOfferRelease = function (data, CurrentUserEmail) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res, todaydate, laborHireData, response, error_8;
            var _a, _b, _c, _d, _e;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, spservice_1.default.SPGetItems({
                                Listname: data.IsExpat
                                    ? Config_1.ListNames.HRMSRESIExpatDetails
                                    : Config_1.ListNames.HRMSRESIDRCDetails,
                                Filter: [
                                    {
                                        FilterKey: "SelectedCandidateHODId",
                                        Operator: "eq",
                                        FilterValue: data.ID,
                                    },
                                ],
                                Select: "*,SelectedCandidateHODId/ID,LabourhireORContractor/AgentCode",
                                Expand: "SelectedCandidateHODId,LabourhireORContractor",
                            })];
                    case 1:
                        res = _f.sent();
                        todaydate = new Date();
                        laborHireData = {
                            jobRequestID: Number(data === null || data === void 0 ? void 0 : data.jobRequestID),
                            positionId: data === null || data === void 0 ? void 0 : data.positionId,
                            location: data === null || data === void 0 ? void 0 : data.location,
                            businessUnit: data === null || data === void 0 ? void 0 : data.businessUnit,
                            department: data === null || data === void 0 ? void 0 : data.department,
                            section: data === null || data === void 0 ? void 0 : data.section,
                            patersonGrade: data.patersonGrade,
                            drcGrade: data.drcGrade,
                            reportingManager: ConditionConfig_1.RoleName.RecruitmentHR,
                            dateOfJoining: (data === null || data === void 0 ? void 0 : data.dateOfJoining)
                                ? new Date(data === null || data === void 0 ? void 0 : data.dateOfJoining)
                                : new Date(),
                            typeOfContract: data === null || data === void 0 ? void 0 : data.typeOfContract,
                            noOfMonths: (data === null || data === void 0 ? void 0 : data.noOfMonths) === "" ? "20" : ((_a = String(data === null || data === void 0 ? void 0 : data.noOfMonths)) !== null && _a !== void 0 ? _a : "0"),
                            netPay: data.IsExpat
                                ? (_b = res[0]) === null || _b === void 0 ? void 0 : _b.ProposedNetUSDAmount
                                : (_c = res[0]) === null || _c === void 0 ? void 0 : _c.ProposedNetAmount,
                            lhCode: (_e = (_d = res[0]) === null || _d === void 0 ? void 0 : _d.LabourhireORContractor) === null || _e === void 0 ? void 0 : _e.AgentCode,
                            createdOn: new Date(todaydate),
                            createdBy: ConditionConfig_1.RoleName.RecruitmentHR,
                            createrEmail: CurrentUserEmail,
                        };
                        return [4 /*yield*/, CareerPortalAPI_1.LaborHire.initiateLaborHire(laborHireData)];
                    case 2:
                        response = _f.sent();
                        return [2 /*return*/, {
                                data: response.data,
                                status: response.status,
                                message: "Error while posting advertisement details",
                            }];
                    case 3:
                        error_8 = _f.sent();
                        console.error("Error posting user data:", error_8);
                        return [2 /*return*/, {
                                data: null,
                                status: 400,
                                message: "Error On Posting Data",
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OfferService.prototype.CheckBGVerification = function (JobRequestId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, error_9;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, CareerPortalAPI_1.BGverification.UpdateBGVerification(JobRequestId)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                data: response.data,
                                status: response.status,
                                message: response.data.message,
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
    OfferService.prototype.InsertRecruitmentCandidateDetails = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, error_10;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, spservice_1.default.SPUpdateItem({
                                Listname: Config_1.ListNames.HRMSRecruitmentCandidatePersonalDetails,
                                RequestJSON: data,
                                ID: data.ID,
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                data: response,
                                status: 200,
                                message: "Data updated successfully",
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
    OfferService.prototype.GetJobRequestData = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var Response_1, error_11;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, CareerPortalAPI_1.GetJobRequestData.GetJobRequestStatus(data)];
                    case 1:
                        Response_1 = _a.sent();
                        return [2 /*return*/, {
                                data: Response_1.data,
                                status: Response_1.status,
                                message: Response_1.data.message,
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
    OfferService.prototype.PerformCriminalRecordCheck = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, error_12;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, CareerPortalAPI_1.BGverification.PerformCriminalRecordCheck(id)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, {
                                data: response.data,
                                status: response.status,
                                message: response.data.message,
                            }];
                    case 2:
                        error_12 = _a.sent();
                        console.error("Error inserting data into AdvertisementDetails:", error_12);
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
    return OfferService;
}());
exports.default = OfferService;
//# sourceMappingURL=OfferService.js.map