"use strict";
// ─── ReviewScorecardTab.tsx ───────────────────────────────────────────────────
// Entry point for the Review Scorecard tab inside RecruitmentProcess.tsx.
// Handles routing between:
//   1. Job-level data table (shows jobs with Review Scorecard status)
//   2. Candidate list (per job)
//   3. HOD detail view
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HodViewScorecardDetail = exports.ReviewScorecardCandidateList = void 0;
var tslib_1 = require("tslib");
var react_router_dom_1 = require("react-router-dom");
// ─────────────────────────────────────────────────────────────────────────────
// Re-export the two routed screens so AppRoutes.tsx can import them directly.
// ─────────────────────────────────────────────────────────────────────────────
var ReviewScorecardCandidateList_1 = require("../components/ReviewScorecardCandidateList");
Object.defineProperty(exports, "ReviewScorecardCandidateList", { enumerable: true, get: function () { return tslib_1.__importDefault(ReviewScorecardCandidateList_1).default; } });
var HodViewScorecardDetail_1 = require("../components/HodViewScorecardDetail");
Object.defineProperty(exports, "HodViewScorecardDetail", { enumerable: true, get: function () { return tslib_1.__importDefault(HodViewScorecardDetail_1).default; } });
// ─────────────────────────────────────────────────────────────────────────────
// Default export: thin wrapper used when embedded inside RecruitmentProcess tab
// ─────────────────────────────────────────────────────────────────────────────
var ReviewScorecardTab = function (props) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var location = (0, react_router_dom_1.useLocation)();
    var stateValue = (_b = (_a = location.state) !== null && _a !== void 0 ? _a : props.stateValue) !== null && _b !== void 0 ? _b : {};
    var nav = (_c = props.navigation) !== null && _c !== void 0 ? _c : navigate;
    // If a candidateID is present in state, show the detail view directly.
    if ((stateValue === null || stateValue === void 0 ? void 0 : stateValue.ID) && (stateValue === null || stateValue === void 0 ? void 0 : stateValue.StatusId) !== undefined && (stateValue === null || stateValue === void 0 ? void 0 : stateValue.RecruitmentID)) {
        return stateValue = { stateValue: stateValue };
        EmployeeList = { props: props, : (_d = .employeeList) !== null && _d !== void 0 ? _d : [] };
        CurrentRoleID = { props: props, : (_e = .CurrentRoleID) !== null && _e !== void 0 ? _e : [] };
        CurrentUserEmailId = { props: props, : (_f = .CurrentUserEmailId) !== null && _f !== void 0 ? _f : "" };
        userDetails = { props: props, : (_g = .userDetails) !== null && _g !== void 0 ? _g : [{}] };
        webURL = { props: props, : (_h = .webURL) !== null && _h !== void 0 ? _h : "" };
        navigation = { nav: nav }
            /  >
        ;
    }
};
;
// If a job-level stateValue (ID + JobCode) is present, show candidate list.
if ((stateValue === null || stateValue === void 0 ? void 0 : stateValue.ID) && (stateValue === null || stateValue === void 0 ? void 0 : stateValue.JobCode)) {
    return stateValue = { stateValue: stateValue };
    EmployeeList = { props: props, : (_a = .employeeList) !== null && _a !== void 0 ? _a : [] };
    CurrentRoleID = { props: props, : (_b = .CurrentRoleID) !== null && _b !== void 0 ? _b : [] };
    navigation = { nav: nav }
        /  >
    ;
    ;
}
// Otherwise render nothing (parent page renders the jobs table).
return null;
;
exports.default = ReviewScorecardTab;
//# sourceMappingURL=ReviewScorecardTab.js.map