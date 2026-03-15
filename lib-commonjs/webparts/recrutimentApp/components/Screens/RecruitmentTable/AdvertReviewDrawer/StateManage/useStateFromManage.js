"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStateFromManage = void 0;
var react_1 = require("react");
var useStateFromManage = function () {
    var _a = (0, react_1.useState)(false), drawerOpen = _a[0], setDrawerOpen = _a[1];
    var _b = (0, react_1.useState)(null), selectedJobId = _b[0], setSelectedJobId = _b[1];
    var _c = (0, react_1.useState)("EN"), advertLanguage = _c[0], setAdvertLanguageState = _c[1];
    var _d = (0, react_1.useState)(""), reviewerComments = _d[0], setReviewerComments = _d[1];
    var _e = (0, react_1.useState)(false), acknowledgementCheckbox = _e[0], setAcknowledgementCheckbox = _e[1];
    var _f = (0, react_1.useState)(false), loadingState = _f[0], setLoadingState = _f[1];
    var openDrawer = (0, react_1.useCallback)(function (jobId) {
        setSelectedJobId(jobId);
        setDrawerOpen(true);
    }, []);
    var closeDrawer = (0, react_1.useCallback)(function () {
        setDrawerOpen(false);
        setSelectedJobId(null);
        setAdvertLanguageState("EN");
        setReviewerComments("");
        setAcknowledgementCheckbox(false);
        setLoadingState(false);
    }, []);
    var setAdvertLanguage = (0, react_1.useCallback)(function (language) {
        setAdvertLanguageState(language);
    }, []);
    var setComments = (0, react_1.useCallback)(function (value) {
        setReviewerComments(value);
    }, []);
    var toggleAcknowledgement = (0, react_1.useCallback)(function () {
        setAcknowledgementCheckbox(function (prev) { return !prev; });
    }, []);
    return {
        drawerOpen: drawerOpen,
        selectedJobId: selectedJobId,
        advertLanguage: advertLanguage,
        reviewerComments: reviewerComments,
        acknowledgementCheckbox: acknowledgementCheckbox,
        loadingState: loadingState,
        openDrawer: openDrawer,
        closeDrawer: closeDrawer,
        setAdvertLanguage: setAdvertLanguage,
        setComments: setComments,
        toggleAcknowledgement: toggleAcknowledgement,
        setLoadingState: setLoadingState,
    };
};
exports.useStateFromManage = useStateFromManage;
//# sourceMappingURL=useStateFromManage.js.map