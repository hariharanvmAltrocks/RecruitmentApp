"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStateOfferRelease = void 0;
var react_1 = require("react");
var useStateOfferRelease = function () {
    var _a = (0, react_1.useState)(false), drawerOpen = _a[0], setDrawerOpen = _a[1];
    var _b = (0, react_1.useState)(null), selectedJobId = _b[0], setSelectedJobId = _b[1];
    var _c = (0, react_1.useState)(null), CandidateID = _c[0], setCandidateID = _c[1];
    var _d = (0, react_1.useState)(null), selectedcandidateID = _d[0], setSelectedcandidateID = _d[1];
    var _e = (0, react_1.useState)(null), jobrequestID = _e[0], setJobrequestID = _e[1];
    var _f = (0, react_1.useState)(""), reviewerComments = _f[0], setReviewerComments = _f[1];
    var _g = (0, react_1.useState)(false), acknowledgementCheckbox = _g[0], setAcknowledgementCheckbox = _g[1];
    var _h = (0, react_1.useState)(false), loadingState = _h[0], setLoadingState = _h[1];
    var _j = (0, react_1.useState)(undefined), selectedValue = _j[0], setSelectedValue = _j[1];
    var openDrawer = (0, react_1.useCallback)(function (jobId) {
        setSelectedJobId(jobId);
        setDrawerOpen(true);
    }, []);
    var closeDrawer = (0, react_1.useCallback)(function () {
        setDrawerOpen(false);
        setSelectedJobId(null);
        setReviewerComments("");
        setAcknowledgementCheckbox(false);
        setLoadingState(false);
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
        CandidateID: CandidateID,
        selectedcandidateID: selectedcandidateID,
        jobrequestID: jobrequestID,
        reviewerComments: reviewerComments,
        acknowledgementCheckbox: acknowledgementCheckbox,
        loadingState: loadingState,
        selectedValue: selectedValue,
        openDrawer: openDrawer,
        closeDrawer: closeDrawer,
        setComments: setComments,
        toggleAcknowledgement: toggleAcknowledgement,
        setLoadingState: setLoadingState,
        setSelectedValue: setSelectedValue,
        setCandidateID: setCandidateID,
        setSelectedcandidateID: setSelectedcandidateID,
        setJobrequestID: setJobrequestID,
        setSelectedJobId: setSelectedJobId,
    };
};
exports.useStateOfferRelease = useStateOfferRelease;
//# sourceMappingURL=useStateFromManage.js.map