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
    // ── Validation error state ──
    var _m = (0, react_1.useState)(DEFAULT_VALIDATION), validationError = _m[0], setValidationError = _m[1];
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
    // ─── Work permit file handlers ────────────────────────────────────────────
    var handleUploadClick = (0, react_1.useCallback)(function () { var _a; return (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }, []);
    var handleFileChange = (0, react_1.useCallback)(function (e) {
        var _a;
        var file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        setIsReading(true);
        setHasFileError(false);
        setTimeout(function () {
            setSelectedFile(file);
            setIsReading(false);
        }, 500);
    }, []);
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
        if (vis.showVerificationToggle && consentVerification === null) {
            errors.verification = true;
            isValid = false;
        }
        if (vis.showConsentForm && !consentFile) {
            errors.showConsentErrors = true;
            isValid = false;
        }
        if (vis.showCOICard) {
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
    };
};
exports.useStateOfferRelease = useStateOfferRelease;
//# sourceMappingURL=useReviewDocumentManage.js.map