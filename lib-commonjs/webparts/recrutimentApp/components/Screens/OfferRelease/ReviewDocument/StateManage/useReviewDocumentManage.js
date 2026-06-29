"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStateOfferRelease = void 0;
var tslib_1 = require("tslib");
// StateManage/useStateOfferRelease.ts
var react_1 = require("react");
// Default reset shape — single source of truth
var DEFAULT_VALIDATION = {
    comments: false,
    acknowledgement: false,
    uploadDocs: false,
    workPermit: false,
    selectedFile: false,
    showConsentErrors: false,
    showCoiErrors: false,
    uploadError: false,
    verification: false,
    nationalOfferReleased: false,
    nationalOfferAccepted: false,
    nationalNoticePeriod: false,
    nationalJoiningDate: false,
    nationalPantsSize: false,
    nationalTopSize: false,
    nationalShoesSize: false,
    nationalContractReleased: false,
    nationalContractAccepted: false,
    nationalBgvPayslip: false,
    nationalBgvBankStatement: false,
    nationalBgvVerified: false,
};
// ─── Hook ─────────────────────────────────────────────────────────────────────
var useStateOfferRelease = function () {
    // ── Consent ──
    var _a = (0, react_1.useState)(null), consentVerification = _a[0], setConsentVerification = _a[1];
    var _b = (0, react_1.useState)(null), consentFile = _b[0], setConsentFile = _b[1];
    var _c = (0, react_1.useState)(false), showConsentErrors = _c[0], setShowConsentErrors = _c[1];
    // ── Comments & acknowledgement ──
    var _d = (0, react_1.useState)(""), reviewerComments = _d[0], setReviewerComments = _d[1];
    var _e = (0, react_1.useState)(false), acknowledgementCheckbox = _e[0], setAcknowledgementCheckbox = _e[1];
    // ── COI ──
    var _f = (0, react_1.useState)({
        consultedWith: "",
        comments: "",
        attachment: [],
        wishesToProceed: "",
    }), coiState = _f[0], setCoiState = _f[1];
    var _g = (0, react_1.useState)(false), showCoiErrors = _g[0], setShowCoiErrors = _g[1];
    // ── Work permit file ──
    var fileInputRef = (0, react_1.useRef)(null);
    var _h = (0, react_1.useState)(null), selectedFile = _h[0], setSelectedFile = _h[1];
    var _j = (0, react_1.useState)(false), isReading = _j[0], setIsReading = _j[1];
    var _k = (0, react_1.useState)(false), hasFileError = _k[0], setHasFileError = _k[1];
    // ── Upload docs ──
    var _l = (0, react_1.useState)([]), uploadDocs = _l[0], setUploadDocs = _l[1];
    // ── National Offer Release & PPE ──
    var _m = (0, react_1.useState)(""), nationalOfferReleased = _m[0], setNationalOfferReleased = _m[1];
    // const [nationalOfferAccepted, setNationalOfferAccepted] = useState<string>("");
    var _o = (0, react_1.useState)(""), nationalNoticePeriod = _o[0], setNationalNoticePeriod = _o[1];
    var _p = (0, react_1.useState)(""), nationalJoiningDate = _p[0], setNationalJoiningDate = _p[1];
    var _q = (0, react_1.useState)(""), nationalPantsSize = _q[0], setNationalPantsSize = _q[1];
    var _r = (0, react_1.useState)(""), nationalTopSize = _r[0], setNationalTopSize = _r[1];
    var _s = (0, react_1.useState)(""), nationalShoesSize = _s[0], setNationalShoesSize = _s[1];
    var _t = (0, react_1.useState)(""), nationalContractReleased = _t[0], setNationalContractReleased = _t[1];
    // const [nationalContractAccepted, setNationalContractAccepted] = useState<string>("");
    var _u = (0, react_1.useState)(""), nationalBgvPayslipChecked = _u[0], setNationalBgvPayslipChecked = _u[1];
    var _v = (0, react_1.useState)(""), nationalBgvBankStatementChecked = _v[0], setNationalBgvBankStatementChecked = _v[1];
    var _w = (0, react_1.useState)(false), nationalBgvVerifiedByHR = _w[0], setNationalBgvVerifiedByHR = _w[1];
    // ── Validation error state ──
    var _x = (0, react_1.useState)(DEFAULT_VALIDATION), validationError = _x[0], setValidationError = _x[1];
    // ─── Consent handlers ─────────────────────────────────────────────────────
    var handleConsentVerification = (0, react_1.useCallback)(function (value) { return setConsentVerification(value); }, []);
    var handleConsentFile = (0, react_1.useCallback)(function (value) {
        setConsentFile(value);
        setValidationError(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { showConsentErrors: false })); });
    }, []);
    var handleConsentErrors = (0, react_1.useCallback)(function (value) { return setShowConsentErrors(value); }, []);
    // ─── Comments & acknowledgement handlers ──────────────────────────────────
    var onCommentsChange = (0, react_1.useCallback)(function (value) {
        setReviewerComments(value);
        setValidationError(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { comments: false })); });
    }, []);
    var onToggleAcknowledgement = (0, react_1.useCallback)(function (value) {
        setAcknowledgementCheckbox(value);
        setValidationError(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { acknowledgement: false })); });
    }, []);
    // ─── COI handlers ─────────────────────────────────────────────────────────
    var handleCoiChange = (0, react_1.useCallback)(function (state) { return setCoiState(state); }, []);
    var handleCoiErrors = (0, react_1.useCallback)(function (show) { return setShowCoiErrors(show); }, []);
    // ─── National Offer Release & PPE handlers ───────────────────────────────
    var handleOfferReleasedChange = (0, react_1.useCallback)(function (val) {
        setNationalOfferReleased(val);
        setValidationError(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { nationalOfferReleased: false })); });
    }, []);
    // const handleOfferAcceptedChange = useCallback((val: string) => {
    //   setNationalOfferAccepted(val);
    //   setValidationError((prev: ValidationError) => ({
    //     ...prev,
    //     nationalOfferAccepted: false,
    //   }));
    // }, []);
    var handleNoticePeriodChange = (0, react_1.useCallback)(function (val) {
        setNationalNoticePeriod(val);
        setValidationError(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { nationalNoticePeriod: false })); });
        setNationalJoiningDate(function (current) {
            if (!current)
                return "";
            var today = new Date();
            var days = parseInt(val, 10);
            if (!isNaN(days) && days > 0) {
                today.setDate(today.getDate() + days);
            }
            var selected = new Date(current);
            today.setHours(0, 0, 0, 0);
            selected.setHours(0, 0, 0, 0);
            if (selected < today) {
                return "";
            }
            return current;
        });
    }, []);
    var handleJoiningDateChange = (0, react_1.useCallback)(function (val) {
        setNationalJoiningDate(val);
        setValidationError(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { nationalJoiningDate: false })); });
    }, []);
    var handlePantsSizeChange = (0, react_1.useCallback)(function (val) {
        setNationalPantsSize(val);
        setValidationError(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { nationalPantsSize: false })); });
    }, []);
    var handleTopSizeChange = (0, react_1.useCallback)(function (val) {
        setNationalTopSize(val);
        setValidationError(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { nationalTopSize: false })); });
    }, []);
    var handleShoesSizeChange = (0, react_1.useCallback)(function (val) {
        setNationalShoesSize(val);
        setValidationError(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { nationalShoesSize: false })); });
    }, []);
    var handleContractReleasedChange = (0, react_1.useCallback)(function (val) {
        setNationalContractReleased(val);
        setValidationError(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { nationalContractReleased: false })); });
    }, []);
    // const handleContractAcceptedChange = useCallback((val: string) => {
    //   setNationalContractAccepted(val);
    //   setValidationError((prev: ValidationError) => ({
    //     ...prev,
    //     nationalContractAccepted: false,
    //   }));
    // }, []);
    // ─── National BGV Checklist Handlers ─────────────────────────────────────
    var handleBgvPayslipChange = (0, react_1.useCallback)(function (val) {
        setNationalBgvPayslipChecked(val);
        setValidationError(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { nationalBgvPayslip: false })); });
    }, []);
    var handleBgvBankStatementChange = (0, react_1.useCallback)(function (val) {
        setNationalBgvBankStatementChecked(val);
        setValidationError(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { nationalBgvBankStatement: false })); });
    }, []);
    var handleBgvVerifiedChange = (0, react_1.useCallback)(function (val) {
        setNationalBgvVerifiedByHR(val);
        setValidationError(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { nationalBgvVerified: false })); });
    }, []);
    // ─── Work permit file handlers ────────────────────────────────────────────
    var handleUploadClick = (0, react_1.useCallback)(function () { var _a; return (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }, []);
    var handleFileChange = (0, react_1.useCallback)(function (e) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var target, file, toBase64, base64, docs_1, error_1;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    target = e.target;
                    file = (_a = target.files) === null || _a === void 0 ? void 0 : _a[0];
                    if (!file)
                        return [2 /*return*/];
                    toBase64 = function (file) {
                        return new Promise(function (resolve, reject) {
                            var reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onload = function () {
                                resolve(reader.result);
                            };
                            reader.onerror = function (error) { return reject(error); };
                        });
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, toBase64(file)];
                case 2:
                    base64 = _b.sent();
                    docs_1 = [
                        {
                            name: file.name,
                            content: base64, // ✅ FIXED
                            type: "New", // ✅ FIXED
                        },
                    ];
                    if (!file)
                        return [2 /*return*/];
                    setIsReading(true);
                    setHasFileError(false);
                    setTimeout(function () {
                        setSelectedFile(docs_1[0]);
                        setIsReading(false);
                    }, 500);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    console.error("File conversion error:", error_1);
                    return [3 /*break*/, 4];
                case 4:
                    target.value = "";
                    return [2 /*return*/];
            }
        });
    }); }, []);
    var clearFile = (0, react_1.useCallback)(function () {
        setSelectedFile(null);
        setHasFileError(false);
        if (fileInputRef.current)
            fileInputRef.current.value = "";
    }, []);
    // ─── Upload docs handler ──────────────────────────────────────────────────
    var handleDocumnetUpload = (0, react_1.useCallback)(function (value) {
        setUploadDocs(value);
        setValidationError(function (prev) { return (tslib_1.__assign(tslib_1.__assign({}, prev), { uploadDocs: false })); });
    }, []);
    // ─── validateAll ─────────────────────────────────────────────────────────
    //
    // Accepts `vis` (ReviewVisibilityFlags) so it only validates what is
    // actually visible on screen for the current workflow status.
    // Returns true when every visible section is valid.
    var validateAll = (0, react_1.useCallback)(function (vis) {
        var errors = tslib_1.__assign({}, DEFAULT_VALIDATION);
        var isValid = true;
        // ── National Candidate Offer Release Sizing ──
        if (vis.NationalOffer) {
            if (!nationalOfferReleased) {
                errors.nationalOfferReleased = true;
                isValid = false;
            }
            if (nationalOfferReleased === "Yes") {
                // if (!nationalOfferAccepted) {
                //   errors.nationalOfferAccepted = true;
                //   isValid = false;
                // }
                if (!nationalNoticePeriod.trim()) {
                    errors.nationalNoticePeriod = true;
                    isValid = false;
                }
                if (!nationalJoiningDate) {
                    errors.nationalJoiningDate = true;
                    isValid = false;
                }
                else {
                    var today = new Date();
                    var days = parseInt(nationalNoticePeriod, 10);
                    if (!isNaN(days) && days > 0) {
                        today.setDate(today.getDate() + days);
                    }
                    var selected = new Date(nationalJoiningDate);
                    today.setHours(0, 0, 0, 0);
                    selected.setHours(0, 0, 0, 0);
                    if (selected < today) {
                        errors.nationalJoiningDate = true;
                        isValid = false;
                    }
                }
                if (!nationalPantsSize) {
                    errors.nationalPantsSize = true;
                    isValid = false;
                }
                if (!nationalTopSize) {
                    errors.nationalTopSize = true;
                    isValid = false;
                }
                if (!nationalShoesSize) {
                    errors.nationalShoesSize = true;
                    isValid = false;
                }
                // if (nationalOfferAccepted === "Yes") {
                // }
            }
        }
        if (vis.NationalEmploymentContract) {
            if (!nationalContractReleased) {
                errors.nationalContractReleased = true;
                isValid = false;
            }
            // if (nationalContractReleased === "Yes") {
            //   if (!nationalContractAccepted) {
            //     errors.nationalContractAccepted = true;
            //     isValid = false;
            //   }
            // }
        }
        // ── National BGV Process Card Validation ──
        if (vis.NaionalBGVProcess) {
            if (!nationalBgvPayslipChecked) {
                errors.nationalBgvPayslip = true;
                isValid = false;
            }
            if (!nationalBgvBankStatementChecked) {
                errors.nationalBgvBankStatement = true;
                isValid = false;
            }
            // if (!nationalBgvVerifiedByHR) {
            //   errors.nationalBgvVerified = true;
            //   isValid = false;
            // }
        }
        if (vis.showVerificationToggle && consentVerification === null) {
            errors.verification = true;
            isValid = false;
        }
        if (vis.showConsentForm && !consentFile) {
            errors.showConsentErrors = true;
            isValid = false;
        }
        var hasCoiDiscrepancy = vis.NaionalBGVProcess && (nationalBgvPayslipChecked === "No" || nationalBgvBankStatementChecked === "No");
        if (vis.showCOICard || hasCoiDiscrepancy) {
            var coiInvalid = !coiState.consultedWith.trim() ||
                !coiState.comments.trim() ||
                !coiState.wishesToProceed;
            if (coiInvalid) {
                errors.showCoiErrors = true;
                isValid = false;
            }
        }
        if (vis.showWorkPermitUpload && !selectedFile) {
            errors.workPermit = true;
            errors.selectedFile = true;
            isValid = false;
        }
        if (vis.showUploadDocument && uploadDocs.length === 0) {
            errors.uploadDocs = true;
            errors.uploadError = true;
            isValid = false;
        }
        if (!vis.ViewFlag && !reviewerComments.trim()) {
            errors.comments = true;
            isValid = false;
        }
        if (!vis.ViewFlag && !acknowledgementCheckbox) {
            errors.acknowledgement = true;
            isValid = false;
        }
        setValidationError(errors);
        return isValid;
    }, [
        consentVerification,
        consentFile,
        coiState,
        selectedFile,
        uploadDocs,
        reviewerComments,
        acknowledgementCheckbox,
        nationalOfferReleased,
        // nationalOfferAccepted,
        nationalNoticePeriod,
        nationalJoiningDate,
        nationalPantsSize,
        nationalTopSize,
        nationalShoesSize,
        nationalContractReleased,
        // nationalContractAccepted,
        nationalBgvPayslipChecked,
        nationalBgvBankStatementChecked,
        nationalBgvVerifiedByHR,
    ]);
    return {
        // Consent
        consentVerification: consentVerification,
        consentFile: consentFile,
        showConsentErrors: showConsentErrors,
        handleConsentVerification: handleConsentVerification,
        handleConsentFile: handleConsentFile,
        handleConsentErrors: handleConsentErrors,
        // Comments & acknowledgement
        reviewerComments: reviewerComments,
        acknowledgementCheckbox: acknowledgementCheckbox,
        onCommentsChange: onCommentsChange,
        onToggleAcknowledgement: onToggleAcknowledgement,
        // COI
        coiState: coiState,
        showCoiErrors: showCoiErrors,
        handleCoiChange: handleCoiChange,
        handleCoiErrors: handleCoiErrors,
        // Work permit file
        fileInputRef: fileInputRef,
        selectedFile: selectedFile,
        isReading: isReading,
        hasFileError: hasFileError,
        setHasFileError: setHasFileError,
        handleUploadClick: handleUploadClick,
        handleFileChange: handleFileChange,
        clearFile: clearFile,
        // Upload docs
        uploadDocs: uploadDocs,
        handleDocumnetUpload: handleDocumnetUpload,
        // Validation
        validationError: validationError,
        validateAll: validateAll,
        // National Offer Release & PPE
        nationalOfferReleased: nationalOfferReleased,
        // nationalOfferAccepted,
        nationalNoticePeriod: nationalNoticePeriod,
        nationalJoiningDate: nationalJoiningDate,
        nationalPantsSize: nationalPantsSize,
        nationalTopSize: nationalTopSize,
        nationalShoesSize: nationalShoesSize,
        nationalContractReleased: nationalContractReleased,
        // nationalContractAccepted,
        setNationalOfferReleased: handleOfferReleasedChange,
        // setNationalOfferAccepted: handleOfferAcceptedChange,
        setNationalNoticePeriod: handleNoticePeriodChange,
        setNationalJoiningDate: handleJoiningDateChange,
        setNationalPantsSize: handlePantsSizeChange,
        setNationalTopSize: handleTopSizeChange,
        setNationalShoesSize: handleShoesSizeChange,
        setNationalContractReleased: handleContractReleasedChange,
        // setNationalContractAccepted: handleContractAcceptedChange,
        nationalBgvPayslipChecked: nationalBgvPayslipChecked,
        nationalBgvBankStatementChecked: nationalBgvBankStatementChecked,
        nationalBgvVerifiedByHR: nationalBgvVerifiedByHR,
        setNationalBgvPayslipChecked: handleBgvPayslipChange,
        setNationalBgvBankStatementChecked: handleBgvBankStatementChange,
        setNationalBgvVerifiedByHR: handleBgvVerifiedChange,
    };
};
exports.useStateOfferRelease = useStateOfferRelease;
//# sourceMappingURL=useReviewDocumentManage.js.map