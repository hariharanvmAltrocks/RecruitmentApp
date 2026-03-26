"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var moment_1 = tslib_1.__importDefault(require("moment"));
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var Reviewscorecardtab_module_scss_1 = tslib_1.__importDefault(require("./Reviewscorecardtab.module.scss"));
var EvaluationApiService_1 = require("../../../services/EvaluationApiService");
var RoleContext_1 = require("../../../../../../utilities/hooks/RoleContext");
var Config_1 = require("../../../../../../utilities/Config");
// ─── Status helpers ───────────────────────────────────────────────────────────
var EDITABLE_STATUS_IDS = [
    Config_1.StatusId.OnHoldbyHOD,
    Config_1.StatusId.PendingwithHODtoselectthecandidate,
    Config_1.StatusId.PendingwithHODtoselectthecandidateLevel2,
    Config_1.StatusId.PendingwithHODtoAssignPositionID,
    Config_1.StatusId.CandidateOnHoldbyHODLevel1,
    Config_1.StatusId.CandidateOnHoldbyHODLevel2,
];
var VIEW_ONLY_STATUS_IDS = [
    Config_1.StatusId.Selected,
    Config_1.StatusId.RejectedbyHOD,
    Config_1.StatusId.CandidateRejectedbyHODLevel1,
    Config_1.StatusId.CandidateRejectedbyHODLevel2,
];
// Mirrors old HodViewScorecard conditional rendering for AssignPositionID.
// Show when:
//   a) decision is "Yes" AND statusId is NOT Level2/CandidateOnHoldLevel1/Selected
//   b) OR statusId is PendingwithHODtoAssignPositionID (regardless of decision)
//   c) OR statusId is Selected (HOD can still assign/view)
var shouldShowPositionId = function (statusId, hodDecision) {
    if (statusId === Config_1.StatusId.PendingwithHODtoAssignPositionID)
        return true;
    if (statusId === Config_1.StatusId.Selected)
        return true;
    if (hodDecision === "Yes" &&
        statusId !== Config_1.StatusId.PendingwithHODtoselectthecandidateLevel2 &&
        statusId !== Config_1.StatusId.CandidateOnHoldbyHODLevel1)
        return true;
    return false;
};
var isLevel2Status = function (statusId) {
    return statusId === Config_1.StatusId.PendingwithHODtoAssignPositionID ||
        statusId === Config_1.StatusId.InterviewScheduledforLevel2 ||
        statusId === Config_1.StatusId.PendingwithHODtoselectthecandidateLevel2 ||
        statusId === Config_1.StatusId.CandidateOnHoldbyHODLevel2;
};
// ─── Score criteria definitions (mirrors old transformScoreData) ──────────────
var SCORE_CRITERIA = [
    { field: "RelevantQualification", label: "Qualification (Relevant)" },
    { field: "ReleventExperience", label: "Experience (Relevant)" },
    { field: "Knowledge", label: "Knowledge" },
    { field: "EnergyLevel", label: "Energy Level" },
    { field: "MeetJobRequirement", label: "Meets All Job Requirements" },
    { field: "ContributeTowardsCultureRequried", label: "Will Contribute to Culture Required" },
    { field: "Experience", label: "Experience" },
    { field: "OtherCriteriaScore", label: "Other Criteria Recognized by Panel" },
];
var SCORECARD_BAR_LABELS = [
    { key: "RelevantQualification", label: "QUALIFICATIONS" },
    { key: "ReleventExperience", label: "EXPERIENCE" },
    { key: "Knowledge", label: "KNOWLEDGE" },
    { key: "EnergyLevel", label: "ENERGY" },
    { key: "MeetJobRequirement", label: "REQUIREMENTS" },
    { key: "ContributeTowardsCultureRequried", label: "CULTURE" },
    { key: "Experience", label: "EXPAT" },
    { key: "OtherCriteriaScore", label: "OTHER" },
];
// ─────────────────────────────────────────────────────────────────────────────
// ReviewScorecardTab
// ─────────────────────────────────────────────────────────────────────────────
var ReviewScorecardTab = function (_a) {
    var _b, _c;
    var employeeList = _a.employeeList, onFormStateChange = _a.onFormStateChange, CurrentUserEmailId = _a.CurrentUserEmailId, props = tslib_1.__rest(_a, ["employeeList", "onFormStateChange", "CurrentUserEmailId"]);
    var navigate = (0, react_router_dom_1.useNavigate)();
    var ADGroupData = (0, RoleContext_1.useRoleContext)().ADGroupData;
    var effectiveUserEmail = CurrentUserEmailId || ((_b = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.EmailId) === null || _b === void 0 ? void 0 : _b[0]) || "";
    var roleId = ((_c = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.roleIDs) === null || _c === void 0 ? void 0 : _c[0]) || 0;
    var _d = React.useState(true), loading = _d[0], setLoading = _d[1];
    var _e = React.useState([]), jobRows = _e[0], setJobRows = _e[1];
    var _f = React.useState(""), searchTerm = _f[0], setSearchTerm = _f[1];
    var _g = React.useState(""), positionRequestFilter = _g[0], setPositionRequestFilter = _g[1];
    var _h = React.useState(""), nationalityFilter = _h[0], setNationalityFilter = _h[1];
    var _j = React.useState(""), jobCodeFilter = _j[0], setJobCodeFilter = _j[1];
    var _k = React.useState(1), currentPage = _k[0], setCurrentPage = _k[1];
    var _l = React.useState(5), pageSize = _l[0], setPageSize = _l[1];
    var _m = React.useState(false), isSelectionOpen = _m[0], setIsSelectionOpen = _m[1];
    var _o = React.useState(null), selectedJob = _o[0], setSelectedJob = _o[1];
    var _p = React.useState([]), candidates = _p[0], setCandidates = _p[1];
    var _q = React.useState(null), reviewingCandidate = _q[0], setReviewingCandidate = _q[1];
    var _r = React.useState(null), reviewingCandidateData = _r[0], setReviewingCandidateData = _r[1];
    var _s = React.useState([]), interviewQuestions = _s[0], setInterviewQuestions = _s[1];
    var _t = React.useState(false), fetchingQuestions = _t[0], setFetchingQuestions = _t[1];
    var userInitial = ((reviewingCandidateData === null || reviewingCandidateData === void 0 ? void 0 : reviewingCandidateData.reviewerName) || "").charAt(0).toUpperCase();
    React.useEffect(function () { loadJobs(); }, []);
    var loadJobs = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var data;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    return [4 /*yield*/, EvaluationApiService_1.evaluationService.fetchScorecardJobList(effectiveUserEmail)];
                case 1:
                    data = _a.sent();
                    setJobRows(data);
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleReviewCandidate = function (candidate) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var evalData, source_1, getField, normalizeDate, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setReviewingCandidate(candidate);
                    setFetchingQuestions(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, EvaluationApiService_1.evaluationService.getEvaluationFormData(candidate.id, candidate.recruitmentID, effectiveUserEmail)];
                case 2:
                    evalData = _a.sent();
                    setInterviewQuestions(evalData.questions || []);
                    source_1 = evalData.candidateData || {};
                    getField = function (keys) {
                        return keys.reduce(function (acc, key) {
                            var _a, _b;
                            if (acc)
                                return acc;
                            var v = (_b = (_a = source_1[key]) !== null && _a !== void 0 ? _a : source_1[key.toLowerCase()]) !== null && _b !== void 0 ? _b : source_1[key.toUpperCase()];
                            return v !== undefined && v !== null ? v : "";
                        }, "");
                    };
                    normalizeDate = function (value) {
                        if (!value)
                            return "";
                        var p = (0, moment_1.default)(value);
                        return p.isValid() ? p.format("YYYY-MM-DD") : (typeof value === "string" ? value : "");
                    };
                    setReviewingCandidateData(tslib_1.__assign(tslib_1.__assign({}, candidate), { nationality: candidate.nationality || getField(["Nationality"]) || "—", gender: candidate.gender || getField(["Gender"]) || "—", qualification: getField(["HighestRelevantQualification", "Qualification"]) || "—", totalWorkExperience: getField(["TotalYearOfExperiance", "TotalWorkExperience"]) || "—", relevantExperience: getField(["ReleventExperience", "RelevantExperience"]) || "—", interviewDate: candidate.interviewDate || normalizeDate(getField(["InterviewDate", "InterviewDateLevel2"])) || "—", interviewLevel: candidate.interviewLevel || getField(["InterviewLevel"]) || "—", grade: getField(["Grade", "JobGrade"]) || "—", conflicts: getField(["ConflictsOfInterest"]) || "—", disability: getField(["Disability", "disability"]) || "—", panelMembers: evalData.panelMembers || [], reviewerName: evalData.reviewerName || effectiveUserEmail || "", jobTitleEn: evalData.jobTitleEn || candidate.jobTitle || candidate.positionTitle || source_1.JobTitle || "—", jobTitleFr: evalData.jobTitleFr || source_1.JobTitleFr || "—", _raw: source_1 }));
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    console.error("Fetch Error:", err_1);
                    setInterviewQuestions([]);
                    setReviewingCandidateData(tslib_1.__assign(tslib_1.__assign({}, candidate), { panelMembers: [] }));
                    return [3 /*break*/, 5];
                case 4:
                    setFetchingQuestions(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var filteredJobRows = React.useMemo(function () { return jobRows.filter(function (job) {
        var matchSearch = searchTerm === "" || Object.values(job).some(function (val) { return String(val).toLowerCase().includes(searchTerm.toLowerCase()); });
        var matchPos = positionRequestFilter === "" || job.positionRequest === positionRequestFilter;
        var matchNat = nationalityFilter === "" || job.nationality === nationalityFilter;
        var matchJob = jobCodeFilter === "" || job.jobCode === jobCodeFilter;
        return matchSearch && matchPos && matchNat && matchJob;
    }); }, [jobRows, searchTerm, positionRequestFilter, nationalityFilter, jobCodeFilter]);
    var totalPages = React.useMemo(function () { return Math.max(1, Math.ceil(filteredJobRows.length / pageSize)); }, [filteredJobRows.length, pageSize]);
    var paginatedJobRows = React.useMemo(function () {
        var start = (currentPage - 1) * pageSize;
        return filteredJobRows.slice(start, start + pageSize);
    }, [filteredJobRows, currentPage, pageSize]);
    React.useEffect(function () {
        if (currentPage > totalPages)
            setCurrentPage(totalPages);
    }, [currentPage, totalPages]);
    var openSelection = function (job) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var cands, _a, grade, level;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setSelectedJob(job);
                    setIsSelectionOpen(true);
                    onFormStateChange === null || onFormStateChange === void 0 ? void 0 : onFormStateChange(true);
                    return [4 /*yield*/, EvaluationApiService_1.evaluationService.fetchScorecardCandidates(job.recruitmentID, job.jobCodeID)];
                case 1:
                    cands = _b.sent();
                    return [4 /*yield*/, EvaluationApiService_1.evaluationService.getGradeAndLevel(job.recruitmentID)];
                case 2:
                    _a = _b.sent(), grade = _a.grade, level = _a.level;
                    setCandidates(cands.map(function (c) { return (tslib_1.__assign(tslib_1.__assign({}, c), { grade: c.grade || grade, interviewLevel: c.interviewLevel || level })); }));
                    return [2 /*return*/];
            }
        });
    }); };
    var closeSelection = function () { setIsSelectionOpen(false); onFormStateChange === null || onFormStateChange === void 0 ? void 0 : onFormStateChange(false); };
    var handleRefreshCandidates = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var refreshed, _a, grade, level;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!selectedJob)
                        return [2 /*return*/];
                    return [4 /*yield*/, EvaluationApiService_1.evaluationService.fetchScorecardCandidates(selectedJob.recruitmentID, selectedJob.jobCodeID)];
                case 1:
                    refreshed = _b.sent();
                    return [4 /*yield*/, EvaluationApiService_1.evaluationService.getGradeAndLevel(selectedJob.recruitmentID)];
                case 2:
                    _a = _b.sent(), grade = _a.grade, level = _a.level;
                    setCandidates(refreshed.map(function (c) { return (tslib_1.__assign(tslib_1.__assign({}, c), { grade: c.grade || grade, interviewLevel: c.interviewLevel || level })); }));
                    return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.container },
        React.createElement(JobListTable, { jobRows: paginatedJobRows, totalItems: filteredJobRows.length, currentPage: currentPage, totalPages: totalPages, pageSize: pageSize, onPageChange: setCurrentPage, onPageSizeChange: function (size) { setPageSize(size); setCurrentPage(1); }, searchTerm: searchTerm, onSearch: setSearchTerm, positionRequestFilter: positionRequestFilter, onPositionRequestFilter: setPositionRequestFilter, nationalityFilter: nationalityFilter, onNationalityFilter: setNationalityFilter, jobCodeFilter: jobCodeFilter, onJobCodeFilter: setJobCodeFilter, onSelectJob: openSelection, onBack: function () { return navigate("/Dashboard"); }, loading: loading }),
        React.createElement(framer_motion_1.AnimatePresence, null, isSelectionOpen && selectedJob && (React.createElement(CandidateSelectionDrawer, { job: selectedJob, candidates: candidates, onClose: closeSelection, onReviewCandidate: handleReviewCandidate }))),
        React.createElement(framer_motion_1.AnimatePresence, null, reviewingCandidate && (React.createElement(CandidateReviewModal, { candidate: reviewingCandidate, candidateData: reviewingCandidateData, job: selectedJob, interviewQuestions: interviewQuestions, fetchingQuestions: fetchingQuestions, currentUserEmail: effectiveUserEmail, currentRoleId: roleId, reviewingCandidateData: reviewingCandidateData, userInitial: userInitial, onClose: function () { setReviewingCandidate(null); setReviewingCandidateData(null); setInterviewQuestions([]); }, onSubmit: function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, handleRefreshCandidates()];
                    case 1:
                        _a.sent();
                        setReviewingCandidate(null);
                        setReviewingCandidateData(null);
                        setInterviewQuestions([]);
                        return [2 /*return*/];
                }
            }); }); } })))));
};
// ─────────────────────────────────────────────────────────────────────────────
// JobListTable
// ─────────────────────────────────────────────────────────────────────────────
var JobListTable = function (_a) {
    var jobRows = _a.jobRows, totalItems = _a.totalItems, currentPage = _a.currentPage, totalPages = _a.totalPages, pageSize = _a.pageSize, onPageChange = _a.onPageChange, onPageSizeChange = _a.onPageSizeChange, onSelectJob = _a.onSelectJob, onBack = _a.onBack, loading = _a.loading;
    return (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.card },
        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.cardHeader },
            React.createElement("h2", null, "Review Score Card"),
            React.createElement("button", { onClick: onBack, className: Reviewscorecardtab_module_scss_1.default.backButton },
                React.createElement(lucide_react_1.RotateCcw, { size: 14 }),
                " BACK TO DASHBOARD")),
        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.tableContainer },
            React.createElement("table", { className: Reviewscorecardtab_module_scss_1.default.styledTable },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        ["Job Code", "Job Title", "Business Unit Code", "Position Request", "Nationality", "Status"].map(function (h) { return (React.createElement("th", { key: h },
                            h,
                            " ",
                            React.createElement(lucide_react_1.ArrowUpDown, { size: 10 }))); }),
                        React.createElement("th", { className: Reviewscorecardtab_module_scss_1.default.center }, "Action"))),
                React.createElement("tbody", null, loading ? (React.createElement("tr", null,
                    React.createElement("td", { colSpan: 7, className: Reviewscorecardtab_module_scss_1.default.noData }, "Loading..."))) : jobRows.length === 0 ? (React.createElement("tr", null,
                    React.createElement("td", { colSpan: 7, className: Reviewscorecardtab_module_scss_1.default.noData }, "No jobs found for the current user."))) : (jobRows.map(function (job) { return (React.createElement("tr", { key: job.id, onClick: function () { return onSelectJob(job); } },
                    React.createElement("td", { className: Reviewscorecardtab_module_scss_1.default.jobCode }, job.jobCode),
                    React.createElement("td", { className: Reviewscorecardtab_module_scss_1.default.jobTitle }, job.jobTitle),
                    React.createElement("td", { className: Reviewscorecardtab_module_scss_1.default.textMuted }, job.businessUnitCode),
                    React.createElement("td", { className: Reviewscorecardtab_module_scss_1.default.textMuted }, job.positionRequest),
                    React.createElement("td", { className: Reviewscorecardtab_module_scss_1.default.textMuted }, job.nationality),
                    React.createElement("td", null,
                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.statusBadge },
                            React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.dot }),
                            job.status || "Recruitment In Progress")),
                    React.createElement("td", { className: Reviewscorecardtab_module_scss_1.default.center },
                        React.createElement("button", { onClick: function (e) { e.stopPropagation(); onSelectJob(job); }, className: Reviewscorecardtab_module_scss_1.default.actionButton }, "REVIEW")))); }))))),
        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.paginationBar },
            React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.paginationInfo },
                "Showing ",
                React.createElement("strong", null, totalItems === 0 ? 0 : Math.min((currentPage - 1) * pageSize + 1, totalItems)),
                " to",
                " ",
                React.createElement("strong", null, Math.min(currentPage * pageSize, totalItems)),
                " of ",
                React.createElement("strong", null, totalItems),
                " results \u00A0",
                React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.showEntries },
                    "SHOW",
                    " ",
                    React.createElement("select", { value: pageSize, onChange: function (e) { return onPageSizeChange(Number(e.target.value)); } }, [5, 10, 20, 50].map(function (s) { return React.createElement("option", { key: s, value: s }, s); })),
                    " ",
                    "ENTRIES")),
            React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.paginationControls },
                React.createElement("button", { className: "".concat(Reviewscorecardtab_module_scss_1.default.pageBtn, " ").concat(currentPage <= 1 ? Reviewscorecardtab_module_scss_1.default.disabled : ""), disabled: currentPage <= 1, onClick: function () { return onPageChange(currentPage - 1); } }, "\u2039"),
                Array.from({ length: totalPages }, function (_, i) { return i + 1; }).map(function (page) { return (React.createElement("button", { key: page, className: "".concat(Reviewscorecardtab_module_scss_1.default.pageBtn, " ").concat(page === currentPage ? Reviewscorecardtab_module_scss_1.default.activePage : ""), onClick: function () { return onPageChange(page); } }, page)); }),
                React.createElement("button", { className: "".concat(Reviewscorecardtab_module_scss_1.default.pageBtn, " ").concat(currentPage >= totalPages ? Reviewscorecardtab_module_scss_1.default.disabled : ""), disabled: currentPage >= totalPages, onClick: function () { return onPageChange(currentPage + 1); } }, "\u203A")))));
};
// ─────────────────────────────────────────────────────────────────────────────
// CandidateSelectionDrawer
// ─────────────────────────────────────────────────────────────────────────────
var CandidateSelectionDrawer = function (_a) {
    var job = _a.job, candidates = _a.candidates, onClose = _a.onClose, onReviewCandidate = _a.onReviewCandidate;
    var pendingCount = candidates.filter(function (c) { return EDITABLE_STATUS_IDS.includes(c.statusId); }).length;
    var getStatusBadgeClass = function (statusId) {
        if (statusId === Config_1.StatusId.Selected)
            return Reviewscorecardtab_module_scss_1.default.statusSelected;
        if (VIEW_ONLY_STATUS_IDS.includes(statusId))
            return Reviewscorecardtab_module_scss_1.default.statusRejected;
        return Reviewscorecardtab_module_scss_1.default.statusPending;
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(framer_motion_1.motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: onClose, className: Reviewscorecardtab_module_scss_1.default.drawerOverlay }),
        React.createElement(framer_motion_1.motion.div, { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' }, transition: { type: 'spring', damping: 25 }, className: Reviewscorecardtab_module_scss_1.default.drawer },
            React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.drawerHeader },
                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.headerContent },
                    React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.iconBox },
                        React.createElement(lucide_react_1.Users, { size: 24 })),
                    React.createElement("div", null,
                        React.createElement("h2", null,
                            "Candidate Selection ",
                            pendingCount > 0 && React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.badge }, pendingCount)),
                        React.createElement("p", null,
                            job.jobCode,
                            " \u00B7 ",
                            React.createElement("span", null, job.jobTitle)))),
                React.createElement("button", { onClick: onClose, className: Reviewscorecardtab_module_scss_1.default.closeButton },
                    React.createElement(lucide_react_1.X, { size: 24 }))),
            React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.drawerBody },
                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.innerCard },
                    React.createElement("table", { className: Reviewscorecardtab_module_scss_1.default.styledTable },
                        React.createElement("thead", null,
                            React.createElement("tr", null,
                                React.createElement("th", null, "S.NO"),
                                React.createElement("th", null, "Applicant Name"),
                                React.createElement("th", null, "Position Title"),
                                React.createElement("th", null, "Interview Levels"),
                                React.createElement("th", null, "Grade"),
                                React.createElement("th", { className: Reviewscorecardtab_module_scss_1.default.center }, "GPA"),
                                React.createElement("th", null, "Status"),
                                React.createElement("th", { className: Reviewscorecardtab_module_scss_1.default.center }, "Action"))),
                        React.createElement("tbody", null, candidates.length === 0 ? (React.createElement("tr", null,
                            React.createElement("td", { colSpan: 8, className: Reviewscorecardtab_module_scss_1.default.noData }, "No candidates found."))) : (candidates.map(function (cand, idx) {
                            var canEdit = EDITABLE_STATUS_IDS.includes(cand.statusId);
                            var canView = VIEW_ONLY_STATUS_IDS.includes(cand.statusId);
                            console.log("Candidate row", {
                                id: cand.id,
                                name: cand.fullName,
                                statusId: cand.statusId,
                                interviewLevel: cand.interviewLevel,
                            });
                            return (React.createElement("tr", { key: cand.id },
                                React.createElement("td", { className: Reviewscorecardtab_module_scss_1.default.textMuted, style: { fontWeight: 'bold' } }, idx + 1),
                                React.createElement("td", { className: Reviewscorecardtab_module_scss_1.default.jobTitle }, cand.fullName),
                                React.createElement("td", { className: Reviewscorecardtab_module_scss_1.default.textMuted }, cand.positionTitle || "—"),
                                React.createElement("td", { className: Reviewscorecardtab_module_scss_1.default.textMuted }, cand.interviewLevel || "—"),
                                React.createElement("td", { className: Reviewscorecardtab_module_scss_1.default.textMuted }, cand.grade || "—"),
                                React.createElement("td", { className: Reviewscorecardtab_module_scss_1.default.center },
                                    React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.gpaBadge }, cand.gpa || "—")),
                                React.createElement("td", null,
                                    React.createElement("span", { className: "".concat(Reviewscorecardtab_module_scss_1.default.statusBadgeText, " ").concat(getStatusBadgeClass(cand.statusId)) }, cand.status || "—")),
                                React.createElement("td", { className: Reviewscorecardtab_module_scss_1.default.center },
                                    canEdit && React.createElement("button", { onClick: function () { return onReviewCandidate(cand); }, className: Reviewscorecardtab_module_scss_1.default.iconButton, title: "Edit" },
                                        React.createElement(lucide_react_1.Pencil, { size: 16 })),
                                    canView && React.createElement("button", { onClick: function () { return onReviewCandidate(cand); }, className: Reviewscorecardtab_module_scss_1.default.iconButton, title: "View" },
                                        React.createElement(lucide_react_1.Eye, { size: 16 })),
                                    !canEdit && !canView && React.createElement("span", { style: { color: "#94a3b8", fontSize: "0.75rem" } }, "\u2014"))));
                        })))))),
            React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.drawerFooter },
                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.footerHint },
                    React.createElement(lucide_react_1.AlertCircle, { size: 16 }),
                    React.createElement("span", null, "Please select a candidate to proceed")),
                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.footerActions },
                    React.createElement("button", { onClick: onClose, className: Reviewscorecardtab_module_scss_1.default.cancelBtn }, "CANCEL"),
                    React.createElement("button", { className: Reviewscorecardtab_module_scss_1.default.confirmBtn, disabled: true }, "CONFIRM SELECTION"))))));
};
// ─────────────────────────────────────────────────────────────────────────────
// CandidateReviewModal — Panel Member Tabs + Scorecard Section Tabs
// ─────────────────────────────────────────────────────────────────────────────
var CandidateReviewModal = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h;
    var candidate = _a.candidate, candidateData = _a.candidateData, job = _a.job, interviewQuestions = _a.interviewQuestions, fetchingQuestions = _a.fetchingQuestions, currentUserEmail = _a.currentUserEmail, currentRoleId = _a.currentRoleId, reviewingCandidateData = _a.reviewingCandidateData, userInitial = _a.userInitial, onClose = _a.onClose, onSubmit = _a.onSubmit;
    // ── Score & tab state ──────────────────────────────────────────────────────
    var _j = React.useState([]), scoreData = _j[0], setScoreData = _j[1];
    var _k = React.useState(true), loadingScore = _k[0], setLoadingScore = _k[1];
    // Panel member tab (index of active panel member = 0,1,2...)
    var _l = React.useState(0), activePanelTab = _l[0], setActivePanelTab = _l[1];
    var _m = React.useState("questions"), activeScorecardTab = _m[0], setActiveScorecardTab = _m[1];
    // HOD Decision
    var _o = React.useState(""), hodDecision = _o[0], setHodDecision = _o[1];
    var _p = React.useState(""), decisionComment = _p[0], setDecisionComment = _p[1];
    var _q = React.useState(false), confirmed = _q[0], setConfirmed = _q[1];
    var _r = React.useState([]), positionOptions = _r[0], setPositionOptions = _r[1];
    var _s = React.useState(null), selectedPositionId = _s[0], setSelectedPositionId = _s[1];
    var _t = React.useState(""), selectedPositionText = _t[0], setSelectedPositionText = _t[1];
    var _u = React.useState(""), submitError = _u[0], setSubmitError = _u[1];
    var _v = React.useState(false), submitting = _v[0], setSubmitting = _v[1];
    var _w = React.useState(""), successMessage = _w[0], setSuccessMessage = _w[1];
    var _x = React.useState(false), posErr = _x[0], setPosErr = _x[1];
    var _y = React.useState(false), commentErr = _y[0], setCommentErr = _y[1];
    var _z = React.useState(false), decisionErr = _z[0], setDecisionErr = _z[1];
    var _0 = React.useState(false), checkboxErr = _0[0], setCheckboxErr = _0[1];
    var _1 = React.useState(false), showComments = _1[0], setShowComments = _1[1];
    var _2 = React.useState([]), level1Comments = _2[0], setLevel1Comments = _2[1];
    var _3 = React.useState([]), level2Comments = _3[0], setLevel2Comments = _3[1];
    var _4 = React.useState(false), loadingComments = _4[0], setLoadingComments = _4[1];
    // ── Derived flags ──────────────────────────────────────────────────────────
    var canEdit = EDITABLE_STATUS_IDS.includes(candidate.statusId);
    var isLevel2 = isLevel2Status(candidate.statusId);
    var feedbackLabel = isLevel2 ? "Feedback - Level 2" : "Feedback - Level 1";
    // Panel members: prefer reviewingCandidateData.panelMembers, fallback to scoreData names
    var panelMembers = React.useMemo(function () {
        var fromRev = (reviewingCandidateData === null || reviewingCandidateData === void 0 ? void 0 : reviewingCandidateData.panelMembers) || [];
        var fromCand = (candidateData === null || candidateData === void 0 ? void 0 : candidateData.panelMembers) || [];
        if (fromRev.length > 0)
            return fromRev;
        if (fromCand.length > 0)
            return fromCand;
        return scoreData.map(function (s, i) { return s.InterviewPersonName || "Interviewer ".concat(i + 1); });
    }, [reviewingCandidateData, candidateData, scoreData]);
    // Active panel scorecard (changes when activePanelTab changes)
    var activeScore = scoreData[activePanelTab] || null;
    // ── Load score data ────────────────────────────────────────────────────────
    React.useEffect(function () {
        setLoadingScore(true);
        EvaluationApiService_1.evaluationService.fetchScoreData(candidate.id).then(function (d) {
            setScoreData(d);
            setLoadingScore(false);
            if (activePanelTab >= d.length && d.length > 0)
                setActivePanelTab(0);
        });
    }, [candidate.id]);
    // ── Load position options ──────────────────────────────────────────────────
    React.useEffect(function () {
        if (!(job === null || job === void 0 ? void 0 : job.jobCodeID) || !(job === null || job === void 0 ? void 0 : job.department)) {
            setPositionOptions([]);
            return;
        }
        EvaluationApiService_1.evaluationService.fetchPositionOptions(job.jobCodeID, job.department)
            .then(setPositionOptions).catch(function () { return setPositionOptions([]); });
    }, [job === null || job === void 0 ? void 0 : job.jobCodeID, job === null || job === void 0 ? void 0 : job.department]);
    // ── Prepopulate ────────────────────────────────────────────────────────────
    React.useEffect(function () {
        (function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var existing, sid, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, EvaluationApiService_1.evaluationService.fetchExistingHODDecision(candidate.id, currentRoleId, isLevel2)];
                    case 1:
                        existing = _a.sent();
                        if (existing) {
                            if (existing.comments)
                                setDecisionComment(existing.comments);
                            sid = candidate.statusId;
                            if ([Config_1.StatusId.Selected, Config_1.StatusId.PendingwithHODtoAssignPositionID, Config_1.StatusId.CandidateOnHoldbyHODLevel1].includes(sid))
                                setHodDecision("Yes");
                            else if ([Config_1.StatusId.OnHoldbyHOD, Config_1.StatusId.CandidateOnHoldbyHODLevel2].includes(sid))
                                setHodDecision("On Hold");
                            else if ([Config_1.StatusId.RejectedbyHOD, Config_1.StatusId.CandidateRejectedbyHODLevel1, Config_1.StatusId.CandidateRejectedbyHODLevel2].includes(sid))
                                setHodDecision("No");
                            if (existing.positionId)
                                setSelectedPositionId(existing.positionId);
                            if (existing.positionText)
                                setSelectedPositionText(existing.positionText);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.warn("Prepopulate failed:", e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
    }, [candidate.id, candidate.statusId, currentRoleId, isLevel2]);
    // ── Comments ───────────────────────────────────────────────────────────────
    var handleViewComments = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var data, e_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setShowComments(true);
                    setLoadingComments(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, EvaluationApiService_1.evaluationService.fetchComments(candidate.id)];
                case 2:
                    data = _a.sent();
                    console.log("[handleViewComments] fetched comments from API:", data);
                    setLevel1Comments(data.level1 || []);
                    setLevel2Comments(data.level2 || []);
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _a.sent();
                    console.error("[handleViewComments] error fetching comments", e_2);
                    return [3 /*break*/, 4];
                case 4:
                    setLoadingComments(false);
                    return [2 /*return*/];
            }
        });
    }); };
    // ── Validation ─────────────────────────────────────────────────────────────
    var validate = function () {
        var valid = true;
        if (!hodDecision) {
            setDecisionErr(true);
            setSubmitError("Please select a decision.");
            valid = false;
        }
        else
            setDecisionErr(false);
        if (!decisionComment.trim()) {
            setCommentErr(true);
            valid = false;
        }
        else
            setCommentErr(false);
        if (!confirmed) {
            setCheckboxErr(true);
            valid = false;
        }
        else
            setCheckboxErr(false);
        if (hodDecision === "Yes" && shouldShowPositionId(candidate.statusId, "Yes")) {
            if (!selectedPositionId) {
                setPosErr(true);
                valid = false;
            }
            else
                setPosErr(false);
        }
        else
            setPosErr(false);
        if (!valid && !submitError)
            setSubmitError("Please fill in all required fields.");
        return valid;
    };
    // ── Submit ─────────────────────────────────────────────────────────────────
    var handleDecisionSubmit = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var result, msg, e_3;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSubmitError("");
                    if (!validate())
                        return [2 /*return*/];
                    setSubmitting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, EvaluationApiService_1.evaluationService.updateCandidateStatusFull({
                            candidateId: candidate.id,
                            hodDecision: hodDecision,
                            comments: decisionComment,
                            currentUserEmail: currentUserEmail,
                            currentRoleId: currentRoleId,
                            gpa: candidate.gpa || "",
                            positionId: selectedPositionId,
                            // HOD decisions always use Branch 2 (Level 1/HOD path).
                            // Branch 1 (isLevel2=true) is only for InterviewPanel scorecard submission
                            // at InterviewScheduledforLevel2 status — not applicable here.
                            isLevel2: false,
                            jobCodeID: candidate.jobCodeID || (job === null || job === void 0 ? void 0 : job.jobCodeID) || 0,
                            recruitmentID: candidate.recruitmentID, statusId: candidate.statusId,
                        })];
                case 2:
                    result = _a.sent();
                    if (!result.success) {
                        setSubmitError(result.message || "Submission failed.");
                        setSubmitting(false);
                        return [2 /*return*/];
                    }
                    msg = hodDecision === "Yes" ? "✓ Candidate SELECTED successfully" :
                        hodDecision === "No" ? "✓ Candidate REJECTED successfully" : "✓ Candidate put ON HOLD successfully";
                    setSuccessMessage(msg);
                    setTimeout(function () { setSuccessMessage(""); onSubmit(); }, 1200);
                    return [3 /*break*/, 4];
                case 3:
                    e_3 = _a.sent();
                    setSubmitError((e_3 === null || e_3 === void 0 ? void 0 : e_3.message) || "An error occurred.");
                    setSubmitting(false);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // ── Helpers ────────────────────────────────────────────────────────────────
    var ratingLabel = function (score) {
        if (score >= 3)
            return { text: "".concat(score, " - EXCELLENT"), color: "#16a34a", bg: "#f0fdf4" };
        if (score === 2)
            return { text: "".concat(score, " - ACCEPTABLE"), color: "#2563eb", bg: "#eff6ff" };
        return { text: "".concat(score, " - NOT ACCEPTABLE"), color: "#ef4444", bg: "#fef2f2" };
    };
    // Parse QuestionJson for the active panel tab
    var activeQuestionJson = React.useMemo(function () {
        if (!(activeScore === null || activeScore === void 0 ? void 0 : activeScore.QuestionJson))
            return [];
        if (Array.isArray(activeScore.QuestionJson))
            return activeScore.QuestionJson;
        try {
            return JSON.parse(activeScore.QuestionJson);
        }
        catch (_a) {
            return [];
        }
    }, [activeScore]);
    // Question evaluation table: all panels × all questions
    var questionTableData = React.useMemo(function () {
        var qMap = {};
        scoreData.forEach(function (score, i) {
            var qJson = Array.isArray(score.QuestionJson) ? score.QuestionJson :
                (function () { try {
                    return JSON.parse(score.QuestionJson || "[]");
                }
                catch (_a) {
                    return [];
                } })();
            qJson.forEach(function (q) {
                var key = Object.keys(q)[0];
                if (!qMap[key])
                    qMap[key] = { criteria: key };
                qMap[key]["panel_".concat(i)] = q[key];
            });
        });
        return Object.values(qMap);
    }, [scoreData]);
    // Overall score table: all panels × all criteria
    var overallTableData = React.useMemo(function () {
        var rows = SCORE_CRITERIA.map(function (_a) {
            var field = _a.field, label = _a.label;
            var row = { criteria: label, total: 0 };
            scoreData.forEach(function (s, i) {
                var val = Number(s[field]) || 0;
                row["panel_".concat(i)] = val;
                row.total += val;
            });
            return row;
        });
        var totalRow = { criteria: "Total", total: 0 };
        scoreData.forEach(function (_, i) {
            var sum = rows.reduce(function (acc, row) {
                var v = row["panel_".concat(i)];
                return typeof v === "number" ? acc + v : acc;
            }, 0);
            totalRow["panel_".concat(i)] = "".concat(sum, " / 40");
        });
        totalRow.total = rows.reduce(function (acc, row) { return acc + (typeof row.total === "number" ? row.total : 0); }, 0);
        rows.push(totalRow);
        return rows;
    }, [scoreData]);
    var formattedDate = (function () {
        var _a, _b;
        var d = ((_a = candidateData === null || candidateData === void 0 ? void 0 : candidateData._raw) === null || _a === void 0 ? void 0 : _a.InterviewDate) || ((_b = candidateData === null || candidateData === void 0 ? void 0 : candidateData._raw) === null || _b === void 0 ? void 0 : _b.InterviewDateLevel2) || candidate.interviewDate || "";
        return d ? d.split("T")[0] : "—";
    })();
    var nationLabel = (function () {
        var n = (candidate.nationality || "").toLowerCase();
        if (n.includes("expat"))
            return "EXPAT";
        if (n.includes("national") || n.includes("congolese") || n.includes("local"))
            return "LOCAL";
        return (candidate.nationality || "").toUpperCase() || "—";
    })();
    var MField = function (_a) {
        var label = _a.label, value = _a.value;
        return (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mfField },
            React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.mfLabel }, label),
            React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mfValue }, value || "—")));
    };
    // ── Render ─────────────────────────────────────────────────────────────────
    return (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.modalOverlay },
        React.createElement(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.96 }, transition: { duration: 0.2 }, className: Reviewscorecardtab_module_scss_1.default.modalWindow },
            React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mHeader },
                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mHeaderLeft },
                    React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mBreadcrumb },
                        React.createElement("span", null, "Candidate Selection"),
                        React.createElement(lucide_react_1.ChevronRight, { size: 11 }),
                        React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.mBreadcrumbActive }, "Candidate Selection REVIEW SCORE CARD")),
                    React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mTitleRow },
                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mIconBox },
                            React.createElement(lucide_react_1.Users, { size: 20 })),
                        React.createElement("div", null,
                            React.createElement("h2", { className: Reviewscorecardtab_module_scss_1.default.mTitle }, "Candidate Selection Review Score Card"),
                            React.createElement("p", { className: Reviewscorecardtab_module_scss_1.default.mSubtitle },
                                React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.mJobCode }, (job === null || job === void 0 ? void 0 : job.jobCode) || "—"),
                                React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.mDot }, "\u203A"),
                                React.createElement("span", null, (reviewingCandidateData === null || reviewingCandidateData === void 0 ? void 0 : reviewingCandidateData.jobTitleEn) || candidate.positionTitle || "—"))))),
                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mHeaderRight },
                    React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mGpa },
                        React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.mGpaLabel }, "OVERALL GPA"),
                        React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.mGpaValue }, candidate.gpa || "N/A")),
                    React.createElement("button", { onClick: onClose, className: Reviewscorecardtab_module_scss_1.default.mCloseBtn },
                        React.createElement(lucide_react_1.X, { size: 20 })))),
            React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mBody },
                React.createElement("aside", { className: Reviewscorecardtab_module_scss_1.default.mLeft },
                    React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mCandidateName }, candidate.fullName),
                    React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mCandidateType }, nationLabel),
                    React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mFieldList },
                        React.createElement(MField, { label: "NATIONALITY", value: ((_b = candidateData === null || candidateData === void 0 ? void 0 : candidateData._raw) === null || _b === void 0 ? void 0 : _b.Nationality) || candidate.nationality || "—" }),
                        React.createElement(MField, { label: "GENDER", value: ((_c = candidateData === null || candidateData === void 0 ? void 0 : candidateData._raw) === null || _c === void 0 ? void 0 : _c.Gender) || candidate.gender || "—" }),
                        React.createElement(MField, { label: "QUALIFICATION", value: ((_d = candidateData === null || candidateData === void 0 ? void 0 : candidateData._raw) === null || _d === void 0 ? void 0 : _d.Qualification) || "—" }),
                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mTwoCol },
                            React.createElement(MField, { label: "MINING EXP.", value: ((_e = candidateData === null || candidateData === void 0 ? void 0 : candidateData._raw) === null || _e === void 0 ? void 0 : _e.TotalYearOfExperiance) || "—" }),
                            React.createElement(MField, { label: "RELATED EXP.", value: ((_f = candidateData === null || candidateData === void 0 ? void 0 : candidateData._raw) === null || _f === void 0 ? void 0 : _f.ReleventExperience) || "—" })),
                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mTwoCol },
                            React.createElement(MField, { label: "INTERVIEW DATE", value: formattedDate }),
                            React.createElement(MField, { label: "LEVELS", value: candidate.interviewLevel || "—" })),
                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mTwoCol },
                            React.createElement(MField, { label: "GRADE", value: candidate.grade || "—" }),
                            React.createElement(MField, { label: "CONFLICTS", value: ((_g = candidateData === null || candidateData === void 0 ? void 0 : candidateData._raw) === null || _g === void 0 ? void 0 : _g.ConflictsOfInterest) || "—" })),
                        React.createElement(MField, { label: "DISABILITY", value: ((_h = candidateData === null || candidateData === void 0 ? void 0 : candidateData._raw) === null || _h === void 0 ? void 0 : _h.Disability) || "—" })),
                    panelMembers.length > 0 && (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mPanelSection },
                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mPanelHeader },
                            React.createElement(lucide_react_1.Users, { size: 12, color: "#2563eb" }),
                            React.createElement("span", null, "INTERVIEW PANEL")),
                        panelMembers.map(function (name, i) { return (React.createElement("div", { key: i, className: Reviewscorecardtab_module_scss_1.default.mPanelRow },
                            React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.mPanelBadge }, i + 1),
                            React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.mPanelName }, name))); })))),
                React.createElement("main", { className: Reviewscorecardtab_module_scss_1.default.mRight },
                    !loadingScore && scoreData.length > 0 && (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.panelTabBar }, scoreData.map(function (s, i) {
                        var name = panelMembers[i] || s.InterviewPersonName || "Interviewer ".concat(i + 1);
                        return (React.createElement("button", { key: i, className: "".concat(Reviewscorecardtab_module_scss_1.default.panelTab, " ").concat(activePanelTab === i ? Reviewscorecardtab_module_scss_1.default.panelTabActive : ""), onClick: function () { return setActivePanelTab(i); } },
                            React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.panelTabNum }, i + 1),
                            React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.panelTabName }, name)));
                    }))),
                    React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.scorecardTabBar },
                        React.createElement("button", { className: "".concat(Reviewscorecardtab_module_scss_1.default.scorecardTab, " ").concat(activeScorecardTab === "questions" ? Reviewscorecardtab_module_scss_1.default.scorecardTabActive : ""), onClick: function () { return setActiveScorecardTab("questions"); } },
                            React.createElement(lucide_react_1.HelpCircle, { size: 14 }),
                            " Interview Questionnaires"),
                        React.createElement("button", { className: "".concat(Reviewscorecardtab_module_scss_1.default.scorecardTab, " ").concat(activeScorecardTab === "qEval" ? Reviewscorecardtab_module_scss_1.default.scorecardTabActive : ""), onClick: function () { return setActiveScorecardTab("qEval"); } },
                            React.createElement(lucide_react_1.BarChart2, { size: 14 }),
                            " Question Evaluation Scorecard"),
                        React.createElement("button", { className: "".concat(Reviewscorecardtab_module_scss_1.default.scorecardTab, " ").concat(activeScorecardTab === "overall" ? Reviewscorecardtab_module_scss_1.default.scorecardTabActive : ""), onClick: function () { return setActiveScorecardTab("overall"); } },
                            React.createElement(lucide_react_1.BarChart2, { size: 14 }),
                            " Overall Evaluation Scorecard")),
                    activeScorecardTab === "questions" && (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mSection },
                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mSectionHeader },
                            React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mSectionBar, style: { background: "#f97316" } }),
                            React.createElement("div", null,
                                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mSectionTitle }, "INTERVIEW QUESTIONNAIRES"),
                                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mSectionSub },
                                    "Panel Assessment Results",
                                    panelMembers[activePanelTab] ? " \u2014 ".concat(panelMembers[activePanelTab]) : ""))),
                        fetchingQuestions ? (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mNoData }, "Loading questions\u2026")) : interviewQuestions && interviewQuestions.length > 0 ? (interviewQuestions.map(function (q, idx) {
                            // Score from ACTIVE PANEL TAB's QuestionJson
                            var qScore = activeQuestionJson[idx]
                                ? Number(Object.values(activeQuestionJson[idx])[0] || 0) : 0;
                            var rl = ratingLabel(qScore);
                            var answerText = (q.answer || q.response || q.value || q.selectedOption || "")
                                .replace(/<p>|<\/p>|<br\s*\/?\>/gi, "").trim();
                            return (React.createElement("div", { key: idx, className: Reviewscorecardtab_module_scss_1.default.mQCard },
                                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mQTop },
                                    React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mQBadge },
                                        "Q",
                                        idx + 1),
                                    React.createElement("div", { style: { flex: 1 } },
                                        React.createElement("p", { className: Reviewscorecardtab_module_scss_1.default.mQText, dangerouslySetInnerHTML: {
                                                __html: (q.question || "").replace(/<p>|<\/p>|<br\s*\/?\>/gi, "").trim()
                                            } }),
                                        answerText && (React.createElement("p", { className: Reviewscorecardtab_module_scss_1.default.mQAnswer },
                                            React.createElement("strong", null, "Answer:"),
                                            " ",
                                            answerText)))),
                                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mQBottom },
                                    React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
                                        React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.mRatingLabel }, "RATING:"),
                                        React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.mRatingBadge, style: {
                                                color: rl.color, background: rl.bg, border: "1px solid ".concat(rl.color, "33")
                                            } }, rl.text)),
                                    React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mScoreDisplay },
                                        React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.mScoreLabel }, "SCORE"),
                                        React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.mScoreNum },
                                            qScore,
                                            React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.mScoreMax }, "/3"))))));
                        })) : (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mNoData }, "No questions found for this job.")),
                        !loadingScore && activeScore && (React.createElement("div", { style: { marginTop: "1.5rem" } },
                            React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mSectionHeader },
                                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mSectionBar, style: { background: "#22c55e" } }),
                                React.createElement("div", null,
                                    React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mSectionTitle }, "SCORECARD DETAILS"),
                                    React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mSectionSub }, "Core Competency Assessment (1\u20135 Scale)"))),
                            React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mScoreCard },
                                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mScoreGrid }, SCORECARD_BAR_LABELS.map(function (_a) {
                                    var key = _a.key, label = _a.label;
                                    var val = Number(activeScore[key] || 0);
                                    return (React.createElement("div", { key: key, className: Reviewscorecardtab_module_scss_1.default.mScoreItem },
                                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mScoreRow },
                                            React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.mScoreFieldLabel }, label),
                                            React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.mScoreFieldVal },
                                                val,
                                                "/5")),
                                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mProgressBar },
                                            React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mProgressFill, style: { width: "".concat((val / 5) * 100, "%") } }))));
                                })),
                                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mRecFeedbackRow },
                                    React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mRecCol },
                                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mRecLabel }, "PANEL RECOMMENDATION"),
                                        activeScore.ConsiderForEmployment === "Yes" ? (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mRecBadgeYes },
                                            React.createElement(lucide_react_1.CheckCircle2, { size: 14 }),
                                            " Consider for Employment")) : (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mRecBadgeNo },
                                            React.createElement(lucide_react_1.X, { size: 14 }),
                                            " Do Not Consider"))),
                                    activeScore.OverAllEvaluationFeedback && (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mFeedbackCol },
                                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mRecLabel }, "OVERALL EVALUATION FEEDBACK"),
                                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mFeedbackText },
                                            "\"",
                                            activeScore.OverAllEvaluationFeedback,
                                            "\""))))))))),
                    activeScorecardTab === "qEval" && (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mSection },
                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mSectionHeader },
                            React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mSectionBar, style: { background: "#6366f1" } }),
                            React.createElement("div", null,
                                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mSectionTitle }, "QUESTION EVALUATION SCORECARD"),
                                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mSectionSub }, "Panel-wise Question Scores \u2014 All Interviewers"))),
                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.tableScroll },
                            React.createElement("table", { className: Reviewscorecardtab_module_scss_1.default.scoreTable },
                                React.createElement("thead", null,
                                    React.createElement("tr", null,
                                        React.createElement("th", null, "Criteria"),
                                        scoreData.map(function (s, i) { return (React.createElement("th", { key: i },
                                            "Interviewer ",
                                            i + 1,
                                            React.createElement("br", null),
                                            React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.interviewerName },
                                                "(",
                                                panelMembers[i] || s.InterviewPersonName || "—",
                                                ")"))); }))),
                                React.createElement("tbody", null, questionTableData.length === 0 ? (React.createElement("tr", null,
                                    React.createElement("td", { colSpan: scoreData.length + 1, className: Reviewscorecardtab_module_scss_1.default.noData }, "No question data available."))) : (questionTableData.map(function (row, idx) { return (React.createElement("tr", { key: idx, className: idx % 2 === 0 ? Reviewscorecardtab_module_scss_1.default.stripedRow : "" },
                                    React.createElement("td", null,
                                        React.createElement("strong", null, row.criteria)),
                                    scoreData.map(function (_, j) {
                                        var _a;
                                        return (React.createElement("td", { key: j }, (_a = row["panel_".concat(j)]) !== null && _a !== void 0 ? _a : "—"));
                                    }))); }))))))),
                    activeScorecardTab === "overall" && (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mSection },
                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mSectionHeader },
                            React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mSectionBar, style: { background: "#22c55e" } }),
                            React.createElement("div", null,
                                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mSectionTitle }, "OVERALL EVALUATION SCORECARD"),
                                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mSectionSub }, "Core Criteria Scores \u2014 All Interviewers"))),
                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.tableScroll },
                            React.createElement("table", { className: Reviewscorecardtab_module_scss_1.default.scoreTable },
                                React.createElement("thead", null,
                                    React.createElement("tr", null,
                                        React.createElement("th", null, "Criteria"),
                                        scoreData.map(function (s, i) { return (React.createElement("th", { key: i },
                                            "Interviewer ",
                                            i + 1,
                                            React.createElement("br", null),
                                            React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.interviewerName },
                                                "(",
                                                panelMembers[i] || s.InterviewPersonName || "—",
                                                ")"))); }),
                                        React.createElement("th", null, "Total"))),
                                React.createElement("tbody", null, overallTableData.map(function (row, idx) { return (React.createElement("tr", { key: idx, className: row.criteria === "Total" ? Reviewscorecardtab_module_scss_1.default.totalRow : idx % 2 === 0 ? Reviewscorecardtab_module_scss_1.default.stripedRow : "" },
                                    React.createElement("td", null,
                                        React.createElement("strong", null, row.criteria)),
                                    scoreData.map(function (_, j) {
                                        var _a;
                                        return (React.createElement("td", { key: j }, (_a = row["panel_".concat(j)]) !== null && _a !== void 0 ? _a : "—"));
                                    }),
                                    React.createElement("td", null,
                                        React.createElement("strong", null, row.total)))); })))))),
                    canEdit && (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mDecisionCard },
                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mDecisionHeader },
                            React.createElement(lucide_react_1.Zap, { size: 22, color: "#f59e0b", fill: "#f59e0b" }),
                            React.createElement("div", null,
                                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mDecisionTitle }, "Do you wish to select this candidate?"),
                                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mDecisionSub }, "As HOD, please review the evaluation above and provide your final decision."))),
                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mDecisionGrid },
                            React.createElement("button", { className: "".concat(Reviewscorecardtab_module_scss_1.default.mDCard, " ").concat(hodDecision === "Yes" ? Reviewscorecardtab_module_scss_1.default.mDCardYes : "", " ").concat(decisionErr ? Reviewscorecardtab_module_scss_1.default.mInputErr : ""), onClick: function () { setHodDecision("Yes"); setDecisionErr(false); setSubmitError(""); } },
                                React.createElement(lucide_react_1.CheckCircle2, { size: 28 }),
                                React.createElement("span", null, "YES, SELECT")),
                            React.createElement("button", { className: "".concat(Reviewscorecardtab_module_scss_1.default.mDCard, " ").concat(hodDecision === "No" ? Reviewscorecardtab_module_scss_1.default.mDCardNo : "", " ").concat(decisionErr ? Reviewscorecardtab_module_scss_1.default.mInputErr : ""), onClick: function () { setHodDecision("No"); setDecisionErr(false); setSubmitError(""); } },
                                React.createElement(lucide_react_1.X, { size: 28 }),
                                React.createElement("span", null, "NO, REJECT")),
                            React.createElement("button", { className: "".concat(Reviewscorecardtab_module_scss_1.default.mDCard, " ").concat(hodDecision === "On Hold" ? Reviewscorecardtab_module_scss_1.default.mDCardHold : "", " ").concat(decisionErr ? Reviewscorecardtab_module_scss_1.default.mInputErr : ""), onClick: function () { setHodDecision("On Hold"); setDecisionErr(false); setSubmitError(""); } },
                                React.createElement(lucide_react_1.Activity, { size: 28 }),
                                React.createElement("span", null, "ON HOLD"))),
                        decisionErr && React.createElement("div", { style: { color: "#ef4444", fontSize: "0.75rem", marginBottom: "0.5rem" } }, "\u26A0 Please select a decision above."),
                        successMessage && (React.createElement("div", { style: { background: "#dcfce7", border: "1px solid #22c55e", color: "#166534", padding: "0.6rem 0.8rem", borderRadius: "0.45rem", marginBottom: "0.75rem", fontWeight: 600 } }, successMessage)),
                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mFormGroup, style: { marginTop: 16 } },
                            React.createElement("button", { onClick: handleViewComments, className: Reviewscorecardtab_module_scss_1.default.mActionBtn },
                                React.createElement(lucide_react_1.FileText, { size: 16 }),
                                " VIEW COMMENTS")),
                        shouldShowPositionId(candidate.statusId, hodDecision) && (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mFormGroup },
                            React.createElement("label", { className: "".concat(Reviewscorecardtab_module_scss_1.default.mFormLabel, " ").concat(posErr ? Reviewscorecardtab_module_scss_1.default.mErrLabel : "") },
                                "Assign Position ID ",
                                React.createElement("span", { style: { color: "#ef4444" } }, "*"),
                                posErr && React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.mErrText }, " \u2014 Required")),
                            React.createElement("select", { className: "".concat(Reviewscorecardtab_module_scss_1.default.mSelect, " ").concat(posErr ? Reviewscorecardtab_module_scss_1.default.mInputErr : ""), value: selectedPositionId !== null && selectedPositionId !== void 0 ? selectedPositionId : "", onChange: function (e) { var v = Number(e.target.value) || null; setSelectedPositionId(v); var opt = positionOptions.find(function (o) { return o.key === v; }); setSelectedPositionText((opt === null || opt === void 0 ? void 0 : opt.text) || ""); setPosErr(false); } },
                                React.createElement("option", { value: "" }, "Select a position\u2026"),
                                positionOptions.map(function (opt) { return React.createElement("option", { key: opt.key, value: opt.key }, opt.text || "#".concat(opt.key)); })),
                            positionOptions.length === 0 && React.createElement("p", { className: Reviewscorecardtab_module_scss_1.default.mNoData, style: { marginTop: 6 } }, "No positions available."))),
                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mFormGroup },
                            React.createElement("label", { className: "".concat(Reviewscorecardtab_module_scss_1.default.mFormLabel, " ").concat(commentErr ? Reviewscorecardtab_module_scss_1.default.mErrLabel : "") },
                                feedbackLabel,
                                " ",
                                React.createElement("span", { style: { color: "#ef4444" } }, "*"),
                                commentErr && React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.mErrText }, " \u2014 Required")),
                            React.createElement("textarea", { className: "".concat(Reviewscorecardtab_module_scss_1.default.mTextarea, " ").concat(commentErr ? Reviewscorecardtab_module_scss_1.default.mInputErr : ""), placeholder: "Provide your final decision rationale...", value: decisionComment, onChange: function (e) { setDecisionComment(e.target.value); if (e.target.value.trim())
                                    setCommentErr(false); } })),
                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mFormGroup },
                            React.createElement("label", { className: Reviewscorecardtab_module_scss_1.default.mCheckboxRow },
                                React.createElement("input", { type: "checkbox", checked: confirmed, onChange: function (e) { setConfirmed(e.target.checked); if (e.target.checked)
                                        setCheckboxErr(false); } }),
                                React.createElement("span", null, "I confirm that the above decision is accurate and in line with the evaluation of the candidate's scorecard details.")),
                            checkboxErr && React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.mCheckboxErrText }, "\u26A0 You must confirm before submitting.")),
                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mFormGroup, style: { marginTop: 20 } },
                            React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.reviewerCard },
                                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.reviewerAvatar }, userInitial || "H"),
                                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.reviewerInfo },
                                    React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.reviewerCol },
                                        React.createElement("p", { className: Reviewscorecardtab_module_scss_1.default.reviewerMeta }, "REVIEWER NAME"),
                                        React.createElement("p", { className: Reviewscorecardtab_module_scss_1.default.reviewerVal }, (reviewingCandidateData === null || reviewingCandidateData === void 0 ? void 0 : reviewingCandidateData.reviewerName) || "—")),
                                    React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.reviewerCol },
                                        React.createElement("p", { className: Reviewscorecardtab_module_scss_1.default.reviewerMeta }, "JOB TITLE (EN)"),
                                        React.createElement("p", { className: Reviewscorecardtab_module_scss_1.default.reviewerVal }, (reviewingCandidateData === null || reviewingCandidateData === void 0 ? void 0 : reviewingCandidateData.jobTitleEn) || "—"),
                                        React.createElement("p", { className: Reviewscorecardtab_module_scss_1.default.reviewerMeta, style: { marginTop: 12 } }, "JOB TITLE (FR)"),
                                        React.createElement("p", { className: Reviewscorecardtab_module_scss_1.default.reviewerVal }, (reviewingCandidateData === null || reviewingCandidateData === void 0 ? void 0 : reviewingCandidateData.jobTitleFr) || "—"))))),
                        submitError && React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mSubmitError }, submitError),
                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mFooter },
                            React.createElement("button", { onClick: onClose, className: Reviewscorecardtab_module_scss_1.default.mCancelBtn, disabled: submitting }, "CANCEL"),
                            React.createElement("button", { className: Reviewscorecardtab_module_scss_1.default.mSubmitBtn, onClick: handleDecisionSubmit, disabled: submitting || !hodDecision }, submitting ? "Submitting…" : React.createElement(React.Fragment, null,
                                React.createElement(lucide_react_1.CheckCircle2, { size: 15, style: { marginRight: 6 } }),
                                " SUBMIT ACTION"))))),
                    !canEdit && (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mDecisionCard, style: { borderColor: "#e2e8f0", background: "#f8fafc" } },
                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mDecisionHeader },
                            React.createElement(lucide_react_1.Eye, { size: 22, color: "#2563eb" }),
                            React.createElement("div", null,
                                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mDecisionTitle }, "HOD Decision (Submitted)"),
                                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mDecisionSub }, "This candidate has already been reviewed."))),
                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mFormGroup },
                            React.createElement("button", { onClick: handleViewComments, className: Reviewscorecardtab_module_scss_1.default.mActionBtn },
                                React.createElement(lucide_react_1.FileText, { size: 16 }),
                                " VIEW COMMENTS")),
                        hodDecision && (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mFormGroup },
                            React.createElement("label", { className: Reviewscorecardtab_module_scss_1.default.mFormLabel }, "Decision"),
                            React.createElement("div", { style: { padding: "0.5rem 1rem", borderRadius: "0.5rem", fontWeight: 700, fontSize: "0.875rem", display: "inline-block",
                                    background: hodDecision === "Yes" ? "#f0fdf4" : hodDecision === "No" ? "#fef2f2" : "#fffbeb",
                                    color: hodDecision === "Yes" ? "#16a34a" : hodDecision === "No" ? "#dc2626" : "#d97706" } }, hodDecision === "Yes" ? "✓ SELECTED" : hodDecision === "No" ? "✗ REJECTED" : "⏸ ON HOLD"))),
                        selectedPositionText && (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mFormGroup },
                            React.createElement("label", { className: Reviewscorecardtab_module_scss_1.default.mFormLabel }, "Assigned Position ID"),
                            React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mfValue }, selectedPositionText))),
                        decisionComment && (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mFormGroup },
                            React.createElement("label", { className: Reviewscorecardtab_module_scss_1.default.mFormLabel }, feedbackLabel),
                            React.createElement("div", { style: { background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "0.5rem", padding: "0.75rem", fontSize: "0.875rem", color: "#334155" } }, decisionComment))),
                        React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mFooter },
                            React.createElement("button", { onClick: onClose, className: Reviewscorecardtab_module_scss_1.default.mCancelBtn }, "CLOSE"))))))),
        React.createElement(framer_motion_1.AnimatePresence, null, showComments && (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mCommentsModalOverlay, onClick: function () { return setShowComments(false); } },
            React.createElement(framer_motion_1.motion.div, { className: Reviewscorecardtab_module_scss_1.default.mCommentsModalWindow, initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 }, onClick: function (e) { return e.stopPropagation(); } },
                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mCommentsHeader },
                    React.createElement("h3", null,
                        React.createElement(lucide_react_1.FileText, { size: 20, color: "#2563eb" }),
                        " View Justification"),
                    React.createElement("button", { onClick: function () { return setShowComments(false); } },
                        React.createElement(lucide_react_1.X, { size: 20 }))),
                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mCommentsBody }, loadingComments ? React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mCommentsLoading }, "Loading comments...")
                    : level1Comments.length === 0 && level2Comments.length === 0 ? React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mCommentsNoData }, "No Comments Found")
                        : (React.createElement(React.Fragment, null, (function () {
                            var allComments = tslib_1.__spreadArray(tslib_1.__spreadArray([], level1Comments.map(function (c) { return (tslib_1.__assign(tslib_1.__assign({}, c), { level: "Level 1" })); }), true), level2Comments.map(function (c) { return (tslib_1.__assign(tslib_1.__assign({}, c), { level: "Level 2" })); }), true).sort(function (a, b) {
                                var d1 = a.Date ? new Date(a.Date).getTime() : 0;
                                var d2 = b.Date ? new Date(b.Date).getTime() : 0;
                                return d1 - d2;
                            });
                            return allComments.map(function (c, i) { return (React.createElement("div", { key: "comment-".concat(i), className: c.level === "Level 1" ? Reviewscorecardtab_module_scss_1.default.mCommentItemL1 : Reviewscorecardtab_module_scss_1.default.mCommentItemL2 },
                                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mCommentRole },
                                    "Submitted by ",
                                    c.RoleName || c.Name || "Unknown",
                                    " (",
                                    c.level,
                                    ")"),
                                c.comments && (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mCommentText },
                                    React.createElement("strong", null,
                                        "Feedback ",
                                        c.level,
                                        ":"),
                                    React.createElement("br", null),
                                    c.comments)),
                                c.OverAllEvaluationFeedback && (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mCommentText },
                                    React.createElement("strong", null,
                                        "Overall Feedback ",
                                        c.level,
                                        ":"),
                                    React.createElement("br", null),
                                    c.OverAllEvaluationFeedback)),
                                c.Date && (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mCommentDate },
                                    "Date: ",
                                    (0, moment_1.default)(c.Date).format("M/D/YYYY, h:mm:ss A"))),
                                c.Name && (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mCommentAuthor },
                                    c.Name,
                                    " ",
                                    c.JobTitleInEnglish ? "- ".concat(c.JobTitleInEnglish) : "",
                                    " ",
                                    c.JobTitleInFrench ? "(".concat(c.JobTitleInFrench, ")") : "")),
                                c.Department && (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mCommentAuthor }, c.Department)))); });
                        })()))),
                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.mCommentsFooter },
                    React.createElement("button", { onClick: function () { return setShowComments(false); }, className: Reviewscorecardtab_module_scss_1.default.closeBtn }, "CLOSE"))))))));
};
exports.default = ReviewScorecardTab;
//# sourceMappingURL=Reviewscorecardtab.js.map