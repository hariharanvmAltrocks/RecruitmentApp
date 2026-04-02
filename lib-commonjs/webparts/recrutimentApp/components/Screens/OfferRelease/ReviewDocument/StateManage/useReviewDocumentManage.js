"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStateOfferRelease = void 0;
var react_1 = require("react");
var useStateOfferRelease = function () {
    var _a = (0, react_1.useState)(""), reviewerComments = _a[0], setReviewerComments = _a[1];
    var _b = (0, react_1.useState)(false), acknowledgementCheckbox = _b[0], setAcknowledgementCheckbox = _b[1];
    var _c = (0, react_1.useState)(null), consentVerification = _c[0], setConsentVerification = _c[1];
    var _d = (0, react_1.useState)(null), consentFile = _d[0], setConsentFile = _d[1];
    var _e = (0, react_1.useState)(false), showConsentErrors = _e[0], setShowConsentErrors = _e[1];
    // ── COI form ──
    var _f = (0, react_1.useState)({
        consultedWith: "",
        comments: "",
        attachment: [],
    }), coiState = _f[0], setCoiState = _f[1];
    var _g = (0, react_1.useState)(false), showCoiErrors = _g[0], setShowCoiErrors = _g[1];
    var validateAll = (0, react_1.useCallback)(function () {
        var consentValid = consentVerification !== null && consentFile !== null;
        var coiValid = !!coiState.consultedWith &&
            !!coiState.comments.trim() &&
            coiState.attachment.length > 0;
        if (!consentValid)
            setShowConsentErrors(true);
        if (!coiValid)
            setShowCoiErrors(true);
        return consentValid && coiValid;
    }, [consentVerification, consentFile, coiState]);
    var handleConsentVerification = (0, react_1.useCallback)(function (value) {
        setConsentVerification(value);
    }, []);
    var handleConsentFile = (0, react_1.useCallback)(function (value) {
        setConsentFile(value);
    }, []);
    var handleConsentErrors = (0, react_1.useCallback)(function (value) {
        setShowConsentErrors(value);
    }, []);
    var handleCoiChange = (0, react_1.useCallback)(function (state) {
        setCoiState(state);
    }, []);
    var handleCoiErrors = (0, react_1.useCallback)(function (show) { return setShowCoiErrors(show); }, []);
    var onCommentsChange = (0, react_1.useCallback)(function (value) {
        setReviewerComments(value);
    }, []);
    var onToggleAcknowledgement = (0, react_1.useCallback)(function (value) {
        setAcknowledgementCheckbox(value);
    }, []);
    return {
        consentVerification: consentVerification,
        consentFile: consentFile,
        showConsentErrors: showConsentErrors,
        handleConsentVerification: handleConsentVerification,
        handleConsentFile: handleConsentFile,
        handleConsentErrors: handleConsentErrors,
        coiState: coiState,
        showCoiErrors: showCoiErrors,
        handleCoiChange: handleCoiChange,
        handleCoiErrors: handleCoiErrors,
        // Aggregate
        validateAll: validateAll,
        reviewerComments: reviewerComments,
        acknowledgementCheckbox: acknowledgementCheckbox,
        onCommentsChange: onCommentsChange,
        onToggleAcknowledgement: onToggleAcknowledgement
    };
};
exports.useStateOfferRelease = useStateOfferRelease;
//# sourceMappingURL=useReviewDocumentManage.js.map