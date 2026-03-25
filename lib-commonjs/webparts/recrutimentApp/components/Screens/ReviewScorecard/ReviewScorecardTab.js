"use strict";
// ─── ReviewScorecardTab.tsx ───────────────────────────────────────────────────
// Main entry tab for Review Scorecard.
// ► useRoleContext for current user
// ► Job-level table fetched from real SP API (GetRecruitmentDetails)
// ► Routes to CandidateList and HodViewScorecardDetail via location.state
Object.defineProperty(exports, "__esModule", { value: true });
exports.HodViewScorecardDetail = exports.ReviewScorecardCandidateList = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var RoleContext_1 = require("../../../../utilities/hooks/RoleContext");
var ReviewScorecardCandidateList_1 = tslib_1.__importDefault(require("../../components/ReviewScorecardCandidateList"));
var HodViewScorecardDetail_1 = tslib_1.__importDefault(require("../../components/HodViewScorecardDetail"));
var Reviewscorecardtab_module_scss_1 = tslib_1.__importDefault(require("./Reviewscorecardtab.module.scss"));
var ScorecardConfig_1 = require("../../config/ScorecardConfig");
var SPServices_1 = tslib_1.__importDefault(require("../../../../Services/SPService/SPServices"));
var Config_1 = require("../../../../utilities/Config");
var PAGE_SIZE_OPTIONS = [5, 10, 15];
// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
var ReviewScorecardTab = function (props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var location = (0, react_router_dom_1.useLocation)();
    var ADGroupData = (0, RoleContext_1.useRoleContext)().ADGroupData;
    var stateValue = (_b = (_a = location.state) !== null && _a !== void 0 ? _a : props.stateValue) !== null && _b !== void 0 ? _b : {};
    var nav = (_c = props.navigation) !== null && _c !== void 0 ? _c : navigate;
    var CurrentRoleID = (_e = (_d = props.CurrentRoleID) !== null && _d !== void 0 ? _d : ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.roleIDs) !== null && _e !== void 0 ? _e : [];
    var CurrentUserEmailId = (_h = (_f = props.CurrentUserEmailId) !== null && _f !== void 0 ? _f : (_g = ADGroupData === null || ADGroupData === void 0 ? void 0 : ADGroupData.EmailId) === null || _g === void 0 ? void 0 : _g[0]) !== null && _h !== void 0 ? _h : "";
    var employeeList = (_j = props.employeeList) !== null && _j !== void 0 ? _j : [];
    var webURL = (_k = props.webURL) !== null && _k !== void 0 ? _k : ((_l = localStorage.getItem("CareerPortalLink")) !== null && _l !== void 0 ? _l : "");
    var userDetails = React.useMemo(function () {
        if (props.userDetails && props.userDetails.length > 0)
            return props.userDetails;
        if (!CurrentUserEmailId)
            return [{}];
        var matched = employeeList.filter(function (e) { var _a; return String((_a = e === null || e === void 0 ? void 0 : e.Email) !== null && _a !== void 0 ? _a : "").toLowerCase() === CurrentUserEmailId.toLowerCase(); });
        return matched.length > 0 ? matched : [{}];
    }, [CurrentUserEmailId, employeeList, props.userDetails]);
    // ── Route to sub-pages if location state has a specific candidate / job ──
    if ((stateValue === null || stateValue === void 0 ? void 0 : stateValue.ID) && (stateValue === null || stateValue === void 0 ? void 0 : stateValue.StatusId) !== undefined && (stateValue === null || stateValue === void 0 ? void 0 : stateValue.RecruitmentID)) {
        return (React.createElement(HodViewScorecardDetail_1.default, { stateValue: stateValue, EmployeeList: employeeList, CurrentRoleID: CurrentRoleID, CurrentUserEmailId: CurrentUserEmailId, userDetails: userDetails, webURL: webURL, navigation: nav }));
    }
    if ((stateValue === null || stateValue === void 0 ? void 0 : stateValue.ID) && (stateValue === null || stateValue === void 0 ? void 0 : stateValue.JobCode)) {
        return (React.createElement(ReviewScorecardCandidateList_1.default, { stateValue: stateValue, EmployeeList: employeeList, CurrentRoleID: CurrentRoleID, navigation: nav }));
    }
    // ── Job list table ─────────────────────────────────────────────────────────
    return React.createElement(ReviewScorecardJobTable, { navigation: nav, tabName: (_m = stateValue === null || stateValue === void 0 ? void 0 : stateValue.TabName) !== null && _m !== void 0 ? _m : ScorecardConfig_1.TabName.ReviewScorecard });
};
var ReviewScorecardJobTable = function (_a) {
    var navigation = _a.navigation, tabName = _a.tabName;
    var _b = React.useState([]), rows = _b[0], setRows = _b[1];
    var _c = React.useState(false), isLoading = _c[0], setIsLoading = _c[1];
    var _d = React.useState(5), rowsPerPage = _d[0], setRowsPerPage = _d[1];
    var _e = React.useState(1), currentPage = _e[0], setCurrentPage = _e[1];
    var _f = React.useState("JobCode"), sortKey = _f[0], setSortKey = _f[1];
    var _g = React.useState("asc"), sortDirection = _g[0], setSortDirection = _g[1];
    // Fetch jobs with HOD Review Scorecard statuses
    React.useEffect(function () {
        var load = function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var res, mapped, err_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setIsLoading(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, SPServices_1.default.SPReadItems({
                                Listname: Config_1.ListNames.HRMSRecruitmentDptDetails,
                                Select: "*,Department/DepartmentName,Status/StatusDescription,JobCode/JobCode,BusinessUnitCode/BusineesUnitCode",
                                Expand: "Department,Status,JobCode,BusinessUnitCode",
                                Filter: [
                                    {
                                        FilterKey: "StatusId",
                                        Operator: "in",
                                        FilterValue: [
                                            Config_1.StatusId.PendingwithHODtoselectthecandidate,
                                            Config_1.StatusId.PendingwithHODtoAssignPositionID,
                                            Config_1.StatusId.PendingwithHODtoselectthecandidateLevel2,
                                        ],
                                    },
                                ],
                                Topcount: 5000,
                            })];
                    case 2:
                        res = _a.sent();
                        mapped = res.map(function (item) {
                            var _a, _b, _c, _d, _e;
                            return ({
                                ID: item.ID,
                                JobCodeId: item.JobCodeId || ((_a = item.JobCode) === null || _a === void 0 ? void 0 : _a.ID) || 0,
                                JobCode: ((_b = item.JobCode) === null || _b === void 0 ? void 0 : _b.JobCode) || "",
                                JobTitleEnglish: item.JobTitleEnglish || "",
                                BusinessUnitCode: ((_c = item.BusinessUnitCode) === null || _c === void 0 ? void 0 : _c.BusineesUnitCode) || "",
                                PositionRequest: item.AreaofWork || item.Type || "",
                                Nationality: item.Nationality || "",
                                Status: ((_d = item.Status) === null || _d === void 0 ? void 0 : _d.StatusDescription) || "",
                                StatusId: item.StatusId || 0,
                                Department: ((_e = item.Department) === null || _e === void 0 ? void 0 : _e.DepartmentName) || "",
                                NoOfPosition: Number(item.NumberOfPersonNeeded) || 1,
                                tab: "tab1",
                                TabName: tabName,
                            });
                        });
                        setRows(mapped);
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _a.sent();
                        console.error("ReviewScorecardJobTable load error:", err_1);
                        setRows([]);
                        return [3 /*break*/, 5];
                    case 4:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        void load();
    }, [tabName]);
    // Sorting
    var sortedRows = React.useMemo(function () {
        return tslib_1.__spreadArray([], rows, true).sort(function (a, b) {
            var _a, _b;
            var av = String((_a = a[sortKey]) !== null && _a !== void 0 ? _a : "").toLowerCase();
            var bv = String((_b = b[sortKey]) !== null && _b !== void 0 ? _b : "").toLowerCase();
            var cmp = av.localeCompare(bv, undefined, { numeric: true, sensitivity: "base" });
            return sortDirection === "asc" ? cmp : -cmp;
        });
    }, [rows, sortKey, sortDirection]);
    var totalPages = Math.max(1, Math.ceil(sortedRows.length / rowsPerPage));
    var safePage = Math.min(currentPage, totalPages);
    var pageStart = (safePage - 1) * rowsPerPage;
    var pageRows = sortedRows.slice(pageStart, pageStart + rowsPerPage);
    React.useEffect(function () { setCurrentPage(1); }, [rowsPerPage, sortKey, sortDirection]);
    var handleSort = function (key) {
        if (sortKey === key) {
            setSortDirection(function (p) { return (p === "asc" ? "desc" : "asc"); });
        }
        else {
            setSortKey(key);
            setSortDirection("asc");
        }
    };
    var renderSortIcon = function (key) {
        if (sortKey !== key)
            return " ↑↓";
        return sortDirection === "asc" ? " ↑" : " ↓";
    };
    var handleReview = function (row) {
        navigation(ScorecardConfig_1.SCORECARD_ROUTES.CandidateList, {
            state: {
                ID: row.ID,
                JobCode: row.JobCode,
                JobCodeID: row.JobCodeId,
                Department: row.Department,
                Status: row.Status,
                TabName: tabName,
                tab: row.tab,
                NoOfPosition: row.NoOfPosition,
            },
        });
    };
    if (isLoading) {
        return (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.container },
            React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.card },
                React.createElement("div", { style: { padding: "2rem", textAlign: "center", color: "#64748b" } }, "Loading..."))));
    }
    return (React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.container },
        React.createElement("section", { className: Reviewscorecardtab_module_scss_1.default.card },
            React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.cardHeader },
                React.createElement("h2", null, "Review Scorecards"),
                React.createElement("button", { type: "button", className: Reviewscorecardtab_module_scss_1.default.backButton, onClick: function () { return navigation("/Dashboard"); } }, "\u21BA BACK TO DASHBOARD")),
            React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.tableContainer },
                React.createElement("table", { className: Reviewscorecardtab_module_scss_1.default.styledTable },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", { onClick: function () { return handleSort("JobCode"); } },
                                "JOB CODE",
                                renderSortIcon("JobCode")),
                            React.createElement("th", { onClick: function () { return handleSort("JobTitleEnglish"); } },
                                "JOB TITLE",
                                renderSortIcon("JobTitleEnglish")),
                            React.createElement("th", { onClick: function () { return handleSort("BusinessUnitCode"); } },
                                "BUSINESS UNIT",
                                renderSortIcon("BusinessUnitCode")),
                            React.createElement("th", { onClick: function () { return handleSort("PositionRequest"); } },
                                "POSITION REQUEST",
                                renderSortIcon("PositionRequest")),
                            React.createElement("th", { onClick: function () { return handleSort("Nationality"); } },
                                "NATIONALITY",
                                renderSortIcon("Nationality")),
                            React.createElement("th", null, "STATUS"),
                            React.createElement("th", { className: Reviewscorecardtab_module_scss_1.default.center }, "ACTION"))),
                    React.createElement("tbody", null,
                        pageRows.map(function (row) { return (React.createElement("tr", { key: row.ID },
                            React.createElement("td", { className: Reviewscorecardtab_module_scss_1.default.jobCode }, row.JobCode),
                            React.createElement("td", { className: Reviewscorecardtab_module_scss_1.default.jobTitle }, row.JobTitleEnglish),
                            React.createElement("td", { className: Reviewscorecardtab_module_scss_1.default.textMuted }, row.BusinessUnitCode),
                            React.createElement("td", { className: Reviewscorecardtab_module_scss_1.default.textMuted }, row.PositionRequest),
                            React.createElement("td", { className: Reviewscorecardtab_module_scss_1.default.textMuted }, row.Nationality),
                            React.createElement("td", null,
                                React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.statusBadge },
                                    React.createElement("span", { className: Reviewscorecardtab_module_scss_1.default.dot }),
                                    row.Status)),
                            React.createElement("td", { className: Reviewscorecardtab_module_scss_1.default.center },
                                React.createElement("button", { type: "button", className: Reviewscorecardtab_module_scss_1.default.actionButton, onClick: function () { return handleReview(row); } }, "REVIEW")))); }),
                        pageRows.length === 0 && (React.createElement("tr", null,
                            React.createElement("td", { colSpan: 7, className: Reviewscorecardtab_module_scss_1.default.noData }, "No review scorecards available.")))))),
            React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.paginationBar },
                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.paginationInfo },
                    React.createElement("span", null,
                        "Showing ",
                        React.createElement("strong", null, pageRows.length === 0 ? 0 : pageStart + 1),
                        " to",
                        " ",
                        React.createElement("strong", null, Math.min(pageStart + rowsPerPage, sortedRows.length)),
                        " of",
                        " ",
                        React.createElement("strong", null, sortedRows.length),
                        " results"),
                    React.createElement("label", { className: Reviewscorecardtab_module_scss_1.default.showEntries },
                        "SHOW",
                        React.createElement("select", { value: rowsPerPage, onChange: function (e) { return setRowsPerPage(Number(e.target.value)); } }, PAGE_SIZE_OPTIONS.map(function (o) { return React.createElement("option", { key: o, value: o }, o); })),
                        "ENTRIES")),
                React.createElement("div", { className: Reviewscorecardtab_module_scss_1.default.paginationControls },
                    React.createElement("button", { type: "button", className: "".concat(Reviewscorecardtab_module_scss_1.default.pageBtn, " ").concat(safePage === 1 ? Reviewscorecardtab_module_scss_1.default.disabled : ""), onClick: function () { return setCurrentPage(function (p) { return Math.max(p - 1, 1); }); }, disabled: safePage === 1 }, "\u2039"),
                    Array.from({ length: totalPages }, function (_, i) { return i + 1; }).map(function (n) { return (React.createElement("button", { key: n, type: "button", className: "".concat(Reviewscorecardtab_module_scss_1.default.pageBtn, " ").concat(safePage === n ? Reviewscorecardtab_module_scss_1.default.activePage : ""), onClick: function () { return setCurrentPage(n); } }, n)); }),
                    React.createElement("button", { type: "button", className: "".concat(Reviewscorecardtab_module_scss_1.default.pageBtn, " ").concat(safePage === totalPages ? Reviewscorecardtab_module_scss_1.default.disabled : ""), onClick: function () { return setCurrentPage(function (p) { return Math.min(p + 1, totalPages); }); }, disabled: safePage === totalPages }, "\u203A"))))));
};
var ReviewScorecardCandidateList_2 = require("../../components/ReviewScorecardCandidateList");
Object.defineProperty(exports, "ReviewScorecardCandidateList", { enumerable: true, get: function () { return tslib_1.__importDefault(ReviewScorecardCandidateList_2).default; } });
var HodViewScorecardDetail_2 = require("../../components/HodViewScorecardDetail");
Object.defineProperty(exports, "HodViewScorecardDetail", { enumerable: true, get: function () { return tslib_1.__importDefault(HodViewScorecardDetail_2).default; } });
exports.default = ReviewScorecardTab;
//# sourceMappingURL=ReviewScorecardTab.js.map