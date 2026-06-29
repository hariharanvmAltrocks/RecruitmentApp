"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSubmitWorkflow = exports.makeDocData = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var ApiConfig_1 = require("../../../../../utilities/ApiConfig");
var Config_1 = require("../../../../../utilities/Config");
var ConditionConfig_1 = require("../../../../../utilities/ConditionConfig");
var ServiceExport_1 = require("../../../../../services/ServiceExport");
var react_router_dom_1 = require("react-router-dom");
var RoleContext_1 = require("../../../../../utilities/hooks/RoleContext");
var dateConfigfn_1 = require("../../../../Hooks/dateConfigfn");
var WorkflowConfig_1 = require("../../../../Hooks/WorkflowConfig");
function makeDocData(profileID, requestID, documentName, unsignedDoc) {
    if (unsignedDoc === void 0) { unsignedDoc = ""; }
    return {
        ProfileID: profileID,
        RequestID: requestID,
        DocumentName: documentName,
        UnsignedDoc: unsignedDoc,
    };
}
exports.makeDocData = makeDocData;
function resolveStatus(data, consentFile, documents, btnAction, email, coiState, rejectflag, selectedFile, nationalOfferReleased, nationalOfferAccepted, nationalNoticePeriod, nationalJoiningDate, nationalPantsSize, nationalTopSize, nationalShoesSize, nationalContractReleased, nationalContractAccepted) {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var pid, rid, ok, documentFile, IsRevert, IsExpat, NationalReject, StatusID, _b, isNational, successMsg, documentResponse, doc, isKCSA, documentResponse, initiateLabour, response, isKCSA, PPTKit, isKCSA, isReview, isReview, documentResponse, DocList, documentResponse, workPermitDocs, isReview, documentResponse, documentResponse, isReview, bgvDocData, documentResponse;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    pid = data === null || data === void 0 ? void 0 : data.ProfileID;
                    rid = data === null || data === void 0 ? void 0 : data.JobRequestID;
                    ok = { status: ApiConfig_1.ResponeStatus.SUCCESS };
                    documentFile = documents.map(function (file) {
                        return {
                            name: file.name,
                            content: file.fileContent,
                            type: "New",
                        };
                    });
                    IsRevert = btnAction === ConditionConfig_1.ButtonAction.Revert;
                    IsExpat = (data === null || data === void 0 ? void 0 : data.NationalityCode) != ConditionConfig_1.NationalityCode.Nationals;
                    NationalReject = nationalOfferReleased === "No" || nationalContractReleased === "No";
                    StatusID = (0, WorkflowConfig_1.WorkflowHODConfig)(data === null || data === void 0 ? void 0 : data.StatusID, IsRevert, IsExpat, data === null || data === void 0 ? void 0 : data.EmploymentCategory, NationalReject);
                    _b = data === null || data === void 0 ? void 0 : data.StatusID;
                    switch (_b) {
                        case Config_1.StatusId.PendingHRBGVInitiation: return [3 /*break*/, 1];
                        case Config_1.StatusId.PendingHRReviewBGCheck: return [3 /*break*/, 2];
                        case Config_1.StatusId.PendingHROfferInitiate: return [3 /*break*/, 6];
                        case Config_1.StatusId.HROfferLetterProgress: return [3 /*break*/, 10];
                        case Config_1.StatusId.HREmploymentContractProgress: return [3 /*break*/, 12];
                        case Config_1.StatusId.PendingHROfferReview: return [3 /*break*/, 13];
                        case Config_1.StatusId.PendingHRReviewOfferWorkPermitInit: return [3 /*break*/, 14];
                        case Config_1.StatusId.PendingHRReviewWorkpermitDocs: return [3 /*break*/, 15];
                        case Config_1.StatusId.PendingFinancePaymentReview: return [3 /*break*/, 16];
                        case Config_1.StatusId.PendingHREmploymentContractInit: return [3 /*break*/, 18];
                        case Config_1.StatusId.WorkPermitAcknowledgedContractUploaded: return [3 /*break*/, 19];
                        case Config_1.StatusId.PendingHREmploymentContractReview: return [3 /*break*/, 22];
                        case Config_1.StatusId.PendingHREmploymentContractVerification: return [3 /*break*/, 23];
                        case Config_1.StatusId.PendingHRReviewOfferanduploadEmployementContract: return [3 /*break*/, 26];
                        case Config_1.StatusId.PendingHRReviewOfferuploadEmploymentInit: return [3 /*break*/, 30];
                        case Config_1.StatusId.PendingDOTAficaVerification: return [3 /*break*/, 31];
                    }
                    return [3 /*break*/, 33];
                case 1:
                    {
                        if (btnAction !== ConditionConfig_1.ButtonAction.Initiated)
                            return [3 /*break*/, 34];
                        return [2 /*return*/, {
                                workflowStatusValue: Config_1.workflowStatusApi.PendingCandidateUploadBGVDocs,
                                successMsg: ConditionConfig_1.RecuritmentHRMsg.BGverificationMsg,
                                StatusId: StatusID,
                                // actionID: WorkflowAction.Approved,
                                documentResponse: ok,
                            }];
                    }
                    _c.label = 2;
                case 2:
                    if (!(btnAction === ConditionConfig_1.ButtonAction.Review)) return [3 /*break*/, 5];
                    isNational = (data === null || data === void 0 ? void 0 : data.NationalityCode) === ConditionConfig_1.NationalityCode.Nationals;
                    successMsg = isNational
                        ? ConditionConfig_1.RecuritmentHRMsg.BGReviewedMsg
                        : ConditionConfig_1.RecuritmentHRMsg.BGReviewinitBGV;
                    documentResponse = ok;
                    if (!(!isNational && consentFile)) return [3 /*break*/, 4];
                    doc = {
                        name: consentFile.name,
                        content: String(consentFile.content),
                        type: "New",
                    };
                    return [4 /*yield*/, ServiceExport_1.OfferServices.UploadCandidateDocument(makeDocData(pid, rid, ConditionConfig_1.DocumentFolderName.BGVConsentform), [doc])];
                case 3:
                    documentResponse = _c.sent();
                    _c.label = 4;
                case 4: return [2 /*return*/, {
                        workflowStatusValue: Config_1.workflowStatusApi.initiatetheBGVProcess,
                        successMsg: successMsg,
                        StatusId: StatusID,
                        documentResponse: documentResponse,
                    }];
                case 5:
                    if (btnAction === ConditionConfig_1.ButtonAction.Revert) {
                        return [2 /*return*/, {
                                workflowStatusValue: Config_1.workflowStatusApi.RevetedBacktoBGVDocuments,
                                successMsg: ConditionConfig_1.RecuritmentHRMsg.RevertWGDocs,
                                StatusId: StatusID,
                                documentResponse: ok,
                            }];
                    }
                    return [3 /*break*/, 34];
                case 6:
                    isKCSA = data.EmploymentCategory === ConditionConfig_1.EmployeementCategory.KCSAEmployee;
                    if (!isKCSA) return [3 /*break*/, 8];
                    return [4 /*yield*/, ServiceExport_1.OfferServices.UploadCandidateDocument(makeDocData(pid, rid, ConditionConfig_1.DocumentFolderName.Offerletter, ConditionConfig_1.DocumentFolderName.UnsignedDoc), tslib_1.__spreadArray([], documentFile, true))];
                case 7:
                    documentResponse = _c.sent();
                    return [2 /*return*/, {
                            workflowStatusValue: Config_1.workflowStatusApi.Pendingwithcandidatetosignofferletter,
                            successMsg: ConditionConfig_1.RecuritmentHRMsg.OfferLetterMsg,
                            StatusId: StatusID,
                            documentResponse: documentResponse,
                        }];
                case 8:
                    initiateLabour = {
                        ID: data.ID,
                        IsExpat: data.NationalityCode === ConditionConfig_1.NationalityCode.Nationals ? false : true,
                        jobRequestID: Number(data.JobRequestID),
                        positionId: data.positionID,
                        location: data.Location,
                        businessUnit: data.BusinessUnitCode,
                        department: data.Department,
                        section: data.Section,
                        patersonGrade: data.patersonGrade,
                        drcGrade: data.drcGrade,
                        reportingManager: "",
                        dateOfJoining: data.JoiningDate ? new Date(data.JoiningDate) : null,
                        typeOfContract: data.TypeofContract,
                        noOfMonths: data.NoticePeriod,
                        createdOn: new Date(),
                        createdBy: ConditionConfig_1.RoleName.RecruitmentHR,
                        createrEmail: email,
                    };
                    return [4 /*yield*/, ServiceExport_1.OfferServices.InitiateLabouHireOfferRelease(initiateLabour, email)];
                case 9:
                    response = _c.sent();
                    return [2 /*return*/, {
                            workflowStatusValue: Config_1.workflowStatusApi.PendingHROfferInitiate,
                            successMsg: ConditionConfig_1.RecuritmentHRMsg.OfferLetterinit,
                            StatusId: StatusID,
                            documentResponse: {
                                status: response.status === 200
                                    ? ApiConfig_1.ResponeStatus.SUCCESS
                                    : ApiConfig_1.ResponeStatus.FAILED,
                            },
                        }];
                case 10:
                    isKCSA = data.EmploymentCategory === ConditionConfig_1.EmployeementCategory.KCSAEmployee;
                    if (!isKCSA) return [3 /*break*/, 12];
                    PPTKit = {
                        ContSuitPants: nationalPantsSize,
                        ContSuitTop: nationalTopSize,
                        SafetyShoes: nationalShoesSize,
                    };
                    return [4 /*yield*/, ServiceExport_1.OfferServices.InsertRecruitmentCandidateDetails({
                            JoiningDate: nationalJoiningDate
                                ? (0, dateConfigfn_1.SpiltDateOnly)(new Date(nationalJoiningDate))
                                : "",
                            NoticePeriod: nationalNoticePeriod,
                            PPEKit: (_a = JSON.stringify(PPTKit)) !== null && _a !== void 0 ? _a : [],
                            ID: data.CandidateID,
                        })];
                case 11:
                    _c.sent();
                    return [2 /*return*/, {
                            workflowStatusValue: nationalOfferReleased === "Yes" ? Config_1.workflowStatusApi.CandidateuploadedtheSignedOfferLetter : Config_1.workflowStatusApi.Offerdecline,
                            successMsg: nationalOfferReleased === "Yes" ? ConditionConfig_1.RecuritmentHRMsg.NationalOfferMsg : ConditionConfig_1.RecuritmentHRMsg.RejectOfferNationalMsg,
                            StatusId: StatusID,
                            documentResponse: ok,
                        }];
                case 12:
                    {
                        isKCSA = data.EmploymentCategory === ConditionConfig_1.EmployeementCategory.KCSAEmployee;
                        if (isKCSA) {
                            return [2 /*return*/, {
                                    workflowStatusValue: nationalContractReleased === "Yes" ?
                                        Config_1.workflowStatusApi.UploadedthesignedEmployementcontractform : Config_1.workflowStatusApi.SysytmeDecline,
                                    successMsg: nationalContractReleased === "Yes" ? ConditionConfig_1.RecuritmentHRMsg.NationalEmployementContract : ConditionConfig_1.RecuritmentHRMsg.RejectEmploymentContractMsg,
                                    StatusId: StatusID,
                                    documentResponse: ok,
                                }];
                        }
                    }
                    _c.label = 13;
                case 13:
                    {
                        isReview = btnAction === ConditionConfig_1.ButtonAction.Review;
                        return [2 /*return*/, {
                                workflowStatusValue: isReview
                                    ? Config_1.workflowStatusApi.Pendingwithcandidatetosignofferletter
                                    : Config_1.workflowStatusApi.RevertedtheLabourHireOfferRelease,
                                successMsg: isReview
                                    ? ConditionConfig_1.RecuritmentHRMsg.ReviewLaborHireOffer
                                    : ConditionConfig_1.RecuritmentHRMsg.RevertLabourOffer,
                                StatusId: StatusID,
                                documentResponse: ok,
                            }];
                    }
                    _c.label = 14;
                case 14:
                    {
                        isReview = btnAction === ConditionConfig_1.ButtonAction.Review;
                        return [2 /*return*/, {
                                workflowStatusValue: isReview
                                    ? Config_1.workflowStatusApi.PendingwithCandidatetouploadotherDocuments
                                    : Config_1.workflowStatusApi.RevertedBacktoCandidateforreuploadofferLetter,
                                successMsg: isReview
                                    ? ConditionConfig_1.RecuritmentHRMsg.ReviewOfferLetterMsg
                                    : ConditionConfig_1.RecuritmentHRMsg.RevertedOfferLetter,
                                StatusId: StatusID,
                                documentResponse: ok,
                            }];
                    }
                    _c.label = 15;
                case 15:
                    {
                        if (btnAction === ConditionConfig_1.ButtonAction.Review) {
                            return [2 /*return*/, {
                                    workflowStatusValue: "",
                                    successMsg: ConditionConfig_1.RecuritmentHRMsg.WorkPermitDocs,
                                    StatusId: StatusID,
                                    documentResponse: ok,
                                }];
                        }
                        return [2 /*return*/, {
                                workflowStatusValue: Config_1.workflowStatusApi.RevertedBacktoCandidateforreuploadDocs,
                                successMsg: ConditionConfig_1.RecuritmentHRMsg.RevertWorkPermitDocs,
                                StatusId: StatusID,
                                documentResponse: ok,
                            }];
                    }
                    _c.label = 16;
                case 16:
                    if (btnAction !== ConditionConfig_1.ButtonAction.Review)
                        return [3 /*break*/, 34];
                    return [4 /*yield*/, ServiceExport_1.OfferServices.UploadCandidateDocument(makeDocData(pid, rid, ConditionConfig_1.DocumentFolderName.ProofOfDocument), tslib_1.__spreadArray([], documentFile, true))];
                case 17:
                    documentResponse = _c.sent();
                    return [2 /*return*/, {
                            workflowStatusValue: Config_1.workflowStatusApi.PendingFinancePaymentReview,
                            successMsg: ConditionConfig_1.RecuritmentHRMsg.FinancePaymentReviewMsg,
                            StatusId: StatusID,
                            documentResponse: documentResponse,
                        }];
                case 18:
                    {
                        return [2 /*return*/, {
                                workflowStatusValue: Config_1.workflowStatusApi.PendingHREmploymentContractInit,
                                successMsg: ConditionConfig_1.RecuritmentHRMsg.EmployeementInit,
                                StatusId: StatusID,
                                documentResponse: ok,
                            }];
                    }
                    _c.label = 19;
                case 19:
                    DocList = selectedFile ? [selectedFile] : [];
                    return [4 /*yield*/, ServiceExport_1.OfferServices.UploadCandidateDocument(makeDocData(pid, rid, ConditionConfig_1.DocumentFolderName.EmploymentContractForm, ConditionConfig_1.DocumentFolderName.UnsignedDoc), tslib_1.__spreadArray([], documentFile, true))];
                case 20:
                    documentResponse = _c.sent();
                    return [4 /*yield*/, ServiceExport_1.OfferServices.UploadCandidateDocument(makeDocData(pid, rid, ConditionConfig_1.DocumentFolderName.WorkPermit), DocList)];
                case 21:
                    workPermitDocs = _c.sent();
                    return [2 /*return*/, {
                            workflowStatusValue: Config_1.workflowStatusApi.PendingwithCandidatetosignEmployementContract,
                            successMsg: ConditionConfig_1.RecuritmentHRMsg.EmploymentContractMsg,
                            StatusId: StatusID,
                            documentResponse: documentResponse,
                            workPermitDocs: workPermitDocs,
                        }];
                case 22:
                    {
                        isReview = btnAction === ConditionConfig_1.ButtonAction.Review;
                        return [2 /*return*/, {
                                workflowStatusValue: isReview
                                    ? Config_1.workflowStatusApi.PendingwithCandidatetosignEmployementContract
                                    : Config_1.workflowStatusApi.RevertedtheLabourHireEmployementContract,
                                successMsg: isReview
                                    ? ConditionConfig_1.RecuritmentHRMsg.ReviewEmploymentContractMsg
                                    : ConditionConfig_1.RecuritmentHRMsg.RevertECCocs,
                                StatusId: StatusID,
                                documentResponse: ok,
                            }];
                    }
                    _c.label = 23;
                case 23:
                    if (!(btnAction === ConditionConfig_1.ButtonAction.Review)) return [3 /*break*/, 25];
                    return [4 /*yield*/, ServiceExport_1.OfferServices.InsertRecruitmentCandidateDetails({
                            // JoiningDate: data.JoiningDate
                            //   ? SpiltDateOnly(new Date(data.JoiningDate))
                            //   : "",
                            NoticePeriod: String(data.NoticePeriod),
                            ID: data.CandidateID,
                        })];
                case 24:
                    documentResponse = _c.sent();
                    return [2 /*return*/, {
                            workflowStatusValue: Config_1.workflowStatusApi.OnboardingInprogress,
                            successMsg: ConditionConfig_1.RecuritmentHRMsg.ReviewECMsg,
                            StatusId: StatusID,
                            documentResponse: documentResponse,
                        }];
                case 25: return [2 /*return*/, {
                        workflowStatusValue: Config_1.workflowStatusApi.RevertedBacktoCandidateforreuploadEmploymentContract,
                        successMsg: ConditionConfig_1.RecuritmentHRMsg.RevertedEmploymentContractMsg,
                        StatusId: StatusID,
                        documentResponse: ok,
                    }];
                case 26:
                    if (!(btnAction === ConditionConfig_1.ButtonAction.Review)) return [3 /*break*/, 29];
                    return [4 /*yield*/, ServiceExport_1.OfferServices.UploadCandidateDocument(makeDocData(pid, rid, ConditionConfig_1.DocumentFolderName.EmploymentContractForm, ConditionConfig_1.DocumentFolderName.UnsignedDoc), documentFile)];
                case 27:
                    documentResponse = _c.sent();
                    return [4 /*yield*/, ServiceExport_1.OfferServices.InsertRecruitmentCandidateDetails({
                            ID: data.CandidateID,
                            NoticePeriod: nationalNoticePeriod,
                            JoiningDate: nationalJoiningDate
                                ? (0, dateConfigfn_1.SpiltDateOnly)(new Date(nationalJoiningDate))
                                : "",
                        })];
                case 28:
                    _c.sent();
                    return [2 /*return*/, {
                            workflowStatusValue: Config_1.workflowStatusApi.PendingwithCandidatetosignEmployementContract,
                            successMsg: ConditionConfig_1.RecuritmentHRMsg.EmploymentContractMsg,
                            StatusId: StatusID,
                            documentResponse: documentResponse,
                        }];
                case 29: return [2 /*return*/, {
                        workflowStatusValue: Config_1.workflowStatusApi.RevertedBacktoCandidateforreuploadofferLetter,
                        successMsg: ConditionConfig_1.RecuritmentHRMsg.RevertedOfferLetter,
                        StatusId: StatusID,
                        documentResponse: ok,
                    }];
                case 30:
                    {
                        isReview = btnAction === ConditionConfig_1.ButtonAction.Review;
                        return [2 /*return*/, {
                                workflowStatusValue: isReview
                                    ? Config_1.workflowStatusApi.PendingHREmploymentContractInit
                                    : Config_1.workflowStatusApi.RevertedBacktoCandidateforreuploadDocs,
                                successMsg: isReview
                                    ? ConditionConfig_1.RecuritmentHRMsg.ReviewOfferLetterInitEC
                                    : ConditionConfig_1.RecuritmentHRMsg.RevertedOfferLetter,
                                StatusId: StatusID,
                                documentResponse: ok,
                            }];
                    }
                    _c.label = 31;
                case 31:
                    if (!rejectflag)
                        return [3 /*break*/, 34];
                    bgvDocData = makeDocData(pid, rid, ConditionConfig_1.DocumentFolderName.BGVProofOfDocument);
                    return [4 /*yield*/, ServiceExport_1.OfferServices.UploadCandidateDocument(bgvDocData, coiState.attachment)];
                case 32:
                    documentResponse = _c.sent();
                    if (btnAction === ConditionConfig_1.ButtonAction.Revert) {
                        return [2 /*return*/, {
                                workflowStatusValue: Config_1.workflowStatusApi.RevertedBacktoCandidateforreuploadDocs,
                                successMsg: "",
                                StatusId: StatusID,
                                documentResponse: documentResponse,
                            }];
                    }
                    return [2 /*return*/, {
                            workflowStatusValue: "",
                            successMsg: ConditionConfig_1.RecuritmentHRMsg.ReviewOfferLetterInitEC,
                            StatusId: StatusID,
                            documentResponse: documentResponse,
                        }];
                case 33: return [3 /*break*/, 34];
                case 34: return [2 /*return*/, {
                        workflowStatusValue: "",
                        successMsg: "",
                        StatusId: StatusID,
                        documentResponse: { status: ApiConfig_1.ResponeStatus.FAILED },
                    }];
            }
        });
    });
}
function buildCandidateData(data, workflowStatusValue, documentResponse, workPermitDocs, EmailId, bgvStatus, comments) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var isBGVStatus = data.StatusID === Config_1.StatusId.PendingHRBGVInitiation ||
        data.StatusID === Config_1.StatusId.PendingHRReviewBGCheck;
    var base = {
        workflowStatus: workflowStatusValue,
        jobRequestId: Number(data === null || data === void 0 ? void 0 : data.JobRequestID),
        comments: comments,
        actionBy: ConditionConfig_1.RoleName.RecruitmentHR,
        HrUserId: isBGVStatus ? "" : "",
        HrUserEmail: isBGVStatus ? EmailId : "",
    };
    if (data.StatusID === Config_1.StatusId.PendingHROfferInitiate &&
        data.EmploymentCategory === ConditionConfig_1.EmployeementCategory.KCSAEmployee) {
        // const offerDoc = documentResponse.data?.find((d: any) =>
        //   d.name?.includes("OfferLetter"),
        // );
        base.OfferLatterPath = (_a = documentResponse.data[0]) === null || _a === void 0 ? void 0 : _a.content;
    }
    if (data.StatusID === Config_1.StatusId.WorkPermitAcknowledgedContractUploaded) {
        base.EmpContractLatterPath = (_c = (_b = documentResponse.data) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.content;
        base.signedWorkPermitPath = (_e = (_d = workPermitDocs === null || workPermitDocs === void 0 ? void 0 : workPermitDocs.data) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.content;
    }
    if (data.StatusID === Config_1.StatusId.PendingHROfferReview) {
        var labourOffer = bgvStatus.find(function (d) { return d.categoryName === ConditionConfig_1.DocumentPath.offerLetterUnsigned; });
        base.OfferLatterPath = (_f = labourOffer === null || labourOffer === void 0 ? void 0 : labourOffer.documents[0]) === null || _f === void 0 ? void 0 : _f.downloadUrl;
    }
    if (data.StatusID === Config_1.StatusId.PendingHREmploymentContractReview) {
        var labourEC = bgvStatus.find(function (d) { return d.categoryName === ConditionConfig_1.DocumentPath.EmploymentContractUnsigned; });
        base.EmpContractLatterPath = (_g = labourEC === null || labourEC === void 0 ? void 0 : labourEC.documents[0]) === null || _g === void 0 ? void 0 : _g.downloadUrl;
    }
    if (data.StatusID === Config_1.StatusId.PendingFinancePaymentReview) {
        base.proofOfPaymentPath = (_j = (_h = documentResponse.data) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.content;
    }
    if (data.StatusID === Config_1.StatusId.PendingHREmploymentContractInit) {
        var wpDoc = bgvStatus.find(function (d) { return d.categoryName === ConditionConfig_1.DocumentPath.WorkPermitDocuments; });
        base.signedWorkPermitPath = (_k = wpDoc === null || wpDoc === void 0 ? void 0 : wpDoc.documents[0]) === null || _k === void 0 ? void 0 : _k.downloadUrl;
    }
    if (data.StatusID ===
        Config_1.StatusId.PendingHRReviewOfferanduploadEmployementContract) {
        base.EmpContractLatterPath = (_m = (_l = documentResponse.data) === null || _l === void 0 ? void 0 : _l[0]) === null || _m === void 0 ? void 0 : _m.content;
    }
    return base;
}
function useSubmitWorkflow(data) {
    var _this = this;
    var ADGroupData = (0, RoleContext_1.userInfo)().ADGroupData;
    var _a = (0, react_1.useState)(false), isLoading = _a[0], setIsLoading = _a[1];
    var navigate = (0, react_router_dom_1.useNavigate)();
    var showModal = data.showModal, closeModal = data.closeModal, onClose = data.onClose, refreshKey = data.refreshKey;
    var goToList = (0, react_1.useCallback)(function () {
        navigate("/MyTracker");
    }, [navigate]);
    var showAlert = (0, react_1.useCallback)(function (message, type, onConfirm) {
        showModal({
            type: type,
            title: "Submitted",
            message: message,
            confirmLabel: "Go to Dashboard",
            onConfirm: function () {
                closeModal();
                onClose === null || onClose === void 0 ? void 0 : onClose();
                refreshKey === null || refreshKey === void 0 ? void 0 : refreshKey();
                onConfirm();
                navigate("/MyTracker");
            },
        });
    }, [showModal, closeModal, onClose, refreshKey, navigate]);
    var showSuccess = (0, react_1.useCallback)(function (msg) {
        showAlert(msg, "success", goToList);
    }, [showAlert, goToList]);
    var showError = (0, react_1.useCallback)(function (navigateOnConfirm) {
        if (navigateOnConfirm === void 0) { navigateOnConfirm = true; }
        showAlert(ConditionConfig_1.RecuritmentHRMsg.APIErrorMsg, "error", navigateOnConfirm ? goToList : function () { });
    }, [showAlert, goToList]);
    var submit = (0, react_1.useCallback)(function (btnAction) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var resolved, Verified, candidateData, skipWorkflow, workflowStatus, _a, spfxUpdate, err_1;
        var _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    setIsLoading(true);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 9, 10, 11]);
                    return [4 /*yield*/, resolveStatus(data.data, data.consentFile, data.uploadDocs, btnAction, ADGroupData.EmailId[0], data.coiState, data.rejectflag, data.selectedFile, data.nationalOfferReleased, data.nationalOfferAccepted, data.nationalNoticePeriod, data.nationalJoiningDate, data.nationalPantsSize, data.nationalTopSize, data.nationalShoesSize, data.nationalContractReleased, data.nationalContractAccepted)];
                case 2:
                    resolved = _d.sent();
                    Verified = data.consentVerification;
                    if (((_b = resolved.documentResponse) === null || _b === void 0 ? void 0 : _b.status) !== ApiConfig_1.ResponeStatus.SUCCESS) {
                        showError(false);
                        return [2 /*return*/];
                    }
                    candidateData = buildCandidateData(data.data, resolved.workflowStatusValue, resolved.documentResponse, resolved.workPermitDocs, ADGroupData.EmailId[0], data.BGVerifiedStatus, data.reviewerComments);
                    skipWorkflow = data.data.StatusID === Config_1.StatusId.PendingHRReviewWorkpermitDocs &&
                        Verified;
                    if (!skipWorkflow) return [3 /*break*/, 3];
                    _a = { status: ApiConfig_1.ResponeStatus.SUCCESS };
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, ServiceExport_1.CandidateTable.UpdateCandidateStatus(candidateData)];
                case 4:
                    _a = _d.sent();
                    _d.label = 5;
                case 5:
                    workflowStatus = _a;
                    if ((workflowStatus === null || workflowStatus === void 0 ? void 0 : workflowStatus.status) !== ApiConfig_1.ResponeStatus.SUCCESS) {
                        showError();
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, ServiceExport_1.OfferServices.UpdateStatusSelectedHOD([
                            { ID: data.data.ID, StatusId: resolved.StatusId },
                        ])];
                case 6:
                    spfxUpdate = _d.sent();
                    if ((spfxUpdate === null || spfxUpdate === void 0 ? void 0 : spfxUpdate.status) !== ApiConfig_1.ResponeStatus.SUCCESS) {
                        showError();
                        return [2 /*return*/];
                    }
                    if (!(data.data.StatusID === Config_1.StatusId.PendingDOTAficaVerification &&
                        data.rejectflag)) return [3 /*break*/, 8];
                    return [4 /*yield*/, ServiceExport_1.OfferServices.InsertRecruitmentCandidateDetails({
                            ID: data.data.CandidateID,
                            BackgroundChecksResults: (_c = JSON.stringify(data.BGVerifiedStatus)) !== null && _c !== void 0 ? _c : [],
                            BGVConsultedWith: data.coiState.consultedWith,
                            BGVComments: data.coiState.comments,
                        })];
                case 7:
                    _d.sent();
                    _d.label = 8;
                case 8:
                    showSuccess(resolved.successMsg);
                    return [3 /*break*/, 11];
                case 9:
                    err_1 = _d.sent();
                    console.error("useSubmitWorkflow error:", err_1);
                    showError(false);
                    return [3 /*break*/, 11];
                case 10:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    }); }, [data, showSuccess, showError, ADGroupData.EmailId]);
    return { isLoading: isLoading, submit: submit };
}
exports.useSubmitWorkflow = useSubmitWorkflow;
//# sourceMappingURL=Usesubmitworkflow.js.map