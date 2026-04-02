"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRequiredDocuments = useRequiredDocuments;
var tslib_1 = require("tslib");
// hooks/useRequiredDocuments.ts
var react_1 = require("react");
var ConditionConfig_1 = require("../../../../../utilities/ConditionConfig");
var Config_1 = require("../../../../../utilities/Config");
var ServiceExport_1 = require("../../../../../services/ServiceExport");
var CATEGORY_CONFIG = (_a = {},
    _a[ConditionConfig_1.DisplayFolderName.BackgroundVerification] = {
        categoryId: "background-verification",
        categoryName: "Background Verification",
        icon: "fingerprint",
        accentColor: "#3B82F6",
    },
    _a[ConditionConfig_1.DisplayFolderName.Offerletter] = {
        categoryId: "offer-letter-signed",
        categoryName: "Offer Letters (Signed)",
        icon: "offer-letter",
        accentColor: "#10B981",
    },
    _a[ConditionConfig_1.DisplayFolderName.LabourHireOffer] = {
        categoryId: "offer-letter-unsigned",
        categoryName: "Offer Letters (Unsigned)",
        icon: "offer-letter",
        accentColor: "#34D399",
    },
    _a[ConditionConfig_1.DisplayFolderName.PoliceClearanceCertificate] = {
        categoryId: "police-clearance",
        categoryName: "Police Clearance Certificate",
        icon: "police",
        accentColor: "#6366F1",
    },
    _a[ConditionConfig_1.DisplayFolderName.CovidVaccinationCertificate] = {
        categoryId: "covid-vaccination",
        categoryName: "Covid Vaccination Certificate",
        icon: "vaccination",
        accentColor: "#14B8A6",
    },
    _a[ConditionConfig_1.DisplayFolderName.YellowFeverVaccinationCertificate] = {
        categoryId: "yellow-fever-vaccination",
        categoryName: "Yellow Fever Vaccination Certificate",
        icon: "vaccination",
        accentColor: "#EAB308",
    },
    _a[ConditionConfig_1.DisplayFolderName.LabourHireEC] = {
        categoryId: "employment-contract-unsigned",
        categoryName: "Employment Contract (Unsigned)",
        icon: "contract",
        accentColor: "#A78BFA",
    },
    _a.EmploymentContractSigned = {
        categoryId: "employment-contract-signed",
        categoryName: "Employment Contract (Signed)",
        icon: "contract",
        accentColor: "#8B5CF6",
    },
    _a[ConditionConfig_1.DisplayFolderName.WorkPermitDocument] = {
        categoryId: "work-permit",
        categoryName: "Work Permit Documents",
        icon: "work-permit",
        accentColor: "#F97316",
    },
    _a[ConditionConfig_1.DisplayFolderName.PaymentBill] = {
        categoryId: "payment-bill",
        categoryName: "Payment Bill",
        icon: "payment",
        accentColor: "#EC4899",
    },
    _a);
function mapSPFile(file, index) {
    var _a, _b, _c, _d, _e, _f, _g;
    var bytes = (_c = (_b = (_a = file === null || file === void 0 ? void 0 : file.Length) !== null && _a !== void 0 ? _a : file === null || file === void 0 ? void 0 : file.length) !== null && _b !== void 0 ? _b : file === null || file === void 0 ? void 0 : file.FileSizeBytes) !== null && _c !== void 0 ? _c : 0;
    var mb = bytes > 0 ? (bytes / (1024 * 1024)).toFixed(1) : "—";
    var modified = (_f = (_e = (_d = file === null || file === void 0 ? void 0 : file.TimeLastModified) !== null && _d !== void 0 ? _d : file === null || file === void 0 ? void 0 : file.Modified) !== null && _e !== void 0 ? _e : file === null || file === void 0 ? void 0 : file.Created) !== null && _f !== void 0 ? _f : "";
    var dateStr = modified ? modified.split("T")[0] : "—";
    return {
        id: file.id,
        fileName: (_g = file.name) !== null && _g !== void 0 ? _g : "document-".concat(index + 1),
        fileSizeBytes: file.fileSizeBytes,
        fileSizeMB: file.fileSizeMB,
        uploadedDate: file.uploadedDate,
        downloadUrl: file.downloadUrl,
        timeModified: file.timeModified,
    };
}
function buildCategory(titleKey, rawData, isBGV) {
    if (isBGV === void 0) { isBGV = false; }
    var config = CATEGORY_CONFIG[titleKey];
    if (!config)
        return null;
    var files = isBGV
        ? (rawData !== null && rawData !== void 0 ? rawData : []).flatMap(function (_a) {
            var fileArr = _a[1];
            return Array.isArray(fileArr) ? fileArr : [];
        })
        : Array.isArray(rawData)
            ? rawData
            : [];
    if (files.length === 0)
        return null;
    var documents = files
        .map(mapSPFile)
        .sort(function (a, b) {
        return new Date(b.timeModified).getTime() - new Date(a.timeModified).getTime();
    });
    return tslib_1.__assign(tslib_1.__assign({}, config), { documents: documents });
}
function fetchAllDocuments(ProfileID, jobRequestID) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var vtRes, existingVT, lastId, verificationTypes, verificationCodes, base, _a, bgvRes, offerSignedRes, offerUnsignedRes, policeRes, covidRes, yellowFeverRes, ecSignedRes, ecUnsignedRes, workPermitRes, paymentBillRes, rawGroups, categories, totalFiles;
        var _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, ServiceExport_1.masterService.GetAllMaster(ConditionConfig_1.CategoryID.VerificationType)];
                case 1:
                    vtRes = _e.sent();
                    existingVT = (_b = vtRes.data) !== null && _b !== void 0 ? _b : [];
                    lastId = (_d = (_c = existingVT[existingVT.length - 1]) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : 0;
                    verificationTypes = tslib_1.__spreadArray(tslib_1.__spreadArray([], existingVT, true), [
                        {
                            id: lastId + 1,
                            value: "ConsentForm",
                            displayText: "Consent Form",
                            displayTextFr: "",
                        },
                    ], false);
                    verificationCodes = verificationTypes.map(function (v) {
                        return String(v.value);
                    });
                    base = {
                        ListName: Config_1.DocumentLibraray.HRMSCareerPortalCandidateCV,
                        ProfileID: ProfileID,
                        RequestID: jobRequestID,
                    };
                    return [4 /*yield*/, Promise.all([
                            ServiceExport_1.OfferServices.FetchBGVerificationDOcs(tslib_1.__assign(tslib_1.__assign({}, base), { DocumentType: ConditionConfig_1.DocumentFolderName.BackgroundVerification, DocumentName: verificationCodes, VerificationName: verificationTypes })),
                            ServiceExport_1.OfferServices.FetchCandidateDocument(tslib_1.__assign(tslib_1.__assign({}, base), { DocumentType: ConditionConfig_1.DocumentFolderName.Offerletter, UnsignedDoc: ConditionConfig_1.DocumentFolderName.SignedDoc })),
                            ServiceExport_1.OfferServices.FetchCandidateDocument(tslib_1.__assign(tslib_1.__assign({}, base), { DocumentType: ConditionConfig_1.DocumentFolderName.Offerletter, UnsignedDoc: ConditionConfig_1.DocumentFolderName.UnsignedDoc })),
                            ServiceExport_1.OfferServices.FetchCandidateDocument(tslib_1.__assign(tslib_1.__assign({}, base), { DocumentType: ConditionConfig_1.DocumentFolderName.PoliceClearanceCertificate })),
                            ServiceExport_1.OfferServices.FetchCandidateDocument(tslib_1.__assign(tslib_1.__assign({}, base), { DocumentType: ConditionConfig_1.DocumentFolderName.CovidVaccinationCertificate })),
                            ServiceExport_1.OfferServices.FetchCandidateDocument(tslib_1.__assign(tslib_1.__assign({}, base), { DocumentType: ConditionConfig_1.DocumentFolderName.YellowFeverVaccinationCertificate })),
                            ServiceExport_1.OfferServices.FetchCandidateDocument(tslib_1.__assign(tslib_1.__assign({}, base), { DocumentType: ConditionConfig_1.DocumentFolderName.EmploymentContractForm, UnsignedDoc: ConditionConfig_1.DocumentFolderName.SignedDoc })),
                            ServiceExport_1.OfferServices.FetchCandidateDocument(tslib_1.__assign(tslib_1.__assign({}, base), { DocumentType: ConditionConfig_1.DocumentFolderName.EmploymentContractForm, UnsignedDoc: ConditionConfig_1.DocumentFolderName.UnsignedDoc })),
                            ServiceExport_1.OfferServices.FetchCandidateDocument(tslib_1.__assign(tslib_1.__assign({}, base), { DocumentType: ConditionConfig_1.DocumentFolderName.WorkPermit })),
                            ServiceExport_1.OfferServices.FetchCandidateDocument(tslib_1.__assign(tslib_1.__assign({}, base), { DocumentType: ConditionConfig_1.DocumentFolderName.PaymentBill })),
                        ])];
                case 2:
                    _a = _e.sent(), bgvRes = _a[0], offerSignedRes = _a[1], offerUnsignedRes = _a[2], policeRes = _a[3], covidRes = _a[4], yellowFeverRes = _a[5], ecSignedRes = _a[6], ecUnsignedRes = _a[7], workPermitRes = _a[8], paymentBillRes = _a[9];
                    rawGroups = [
                        [ConditionConfig_1.DisplayFolderName.BackgroundVerification, bgvRes.data, true],
                        [ConditionConfig_1.DisplayFolderName.Offerletter, offerSignedRes.data, false],
                        [ConditionConfig_1.DisplayFolderName.LabourHireOffer, offerUnsignedRes.data, false],
                        [ConditionConfig_1.DisplayFolderName.PoliceClearanceCertificate, policeRes.data, false],
                        [ConditionConfig_1.DisplayFolderName.CovidVaccinationCertificate, covidRes.data, false],
                        [
                            ConditionConfig_1.DisplayFolderName.YellowFeverVaccinationCertificate,
                            yellowFeverRes.data,
                            false,
                        ],
                        [ConditionConfig_1.DisplayFolderName.LabourHireEC, ecUnsignedRes.data, false],
                        ["EmploymentContractSigned", ecSignedRes.data, false],
                        [ConditionConfig_1.DisplayFolderName.WorkPermitDocument, workPermitRes.data, false],
                        [ConditionConfig_1.DisplayFolderName.PaymentBill, paymentBillRes.data, false],
                    ];
                    categories = rawGroups
                        .map(function (_a) {
                        var key = _a[0], data = _a[1], isBGV = _a[2];
                        return buildCategory(key, data, isBGV);
                    })
                        .filter(function (cat) { return cat !== null; });
                    totalFiles = categories.reduce(function (sum, cat) { return sum + cat.documents.length; }, 0);
                    return [2 /*return*/, { candidateId: ProfileID, totalFiles: totalFiles, categories: categories }];
            }
        });
    });
}
function useRequiredDocuments(ProfileID, jobRequestID) {
    var _this = this;
    var _a = (0, react_1.useState)(null), data = _a[0], setData = _a[1];
    var _b = (0, react_1.useState)(true), isLoading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    var fetchData = (0, react_1.useCallback)(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var result, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!ProfileID || !jobRequestID)
                        return [2 /*return*/];
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, fetchAllDocuments(ProfileID, jobRequestID)];
                case 2:
                    result = _a.sent();
                    setData(result);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setError(err_1 instanceof Error ? err_1.message : "Unexpected error");
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [ProfileID, jobRequestID]);
    (0, react_1.useEffect)(function () {
        fetchData();
    }, [fetchData]);
    return { data: data, isLoading: isLoading, error: error, refetch: fetchData };
}
//# sourceMappingURL=Userequireddocuments.js.map