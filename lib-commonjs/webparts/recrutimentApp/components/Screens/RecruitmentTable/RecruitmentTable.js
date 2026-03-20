"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecruitmentTable = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var useAssignMembers_1 = require("./Hooks/useAssignMembers");
var useRecruitmentDetails_1 = require("./Hooks/useRecruitmentDetails");
var useTabDetails_1 = require("./Hooks/useTabDetails");
var AdvertReviewDrawer_1 = require("./AdvertReviewDrawer/AdvertReviewDrawer");
var useStateFromManage_1 = require("./AdvertReviewDrawer/StateManage/useStateFromManage");
require("./RecruitmentTable.scss");
var DataTable_1 = require("../../Comman/DataTable/DataTable");
var UIStateContext_1 = require("../../RecrutimentApp/UIStateContext");
var Config_1 = require("../../../utilities/Config");
var ServiceExport_1 = require("../../../services/ServiceExport");
var RoleContext_1 = require("../../../utilities/hooks/RoleContext");
var ApiConfig_1 = require("../../../utilities/ApiConfig");
var SuccessToast_1 = require("../../Comman/Toast/SuccessToast");
var Tabs_1 = tslib_1.__importDefault(require("../../Comman/Tabs/Tabs"));
var ConditionConfig_1 = require("../../../utilities/ConditionConfig");
var react_router_dom_1 = require("react-router-dom");
var useToast_1 = require("../../Hooks/useToast");
var AssignHRPopup = react_1.default.lazy(function () { return Promise.resolve().then(function () { return tslib_1.__importStar(require("./Components/AssignHRPopup/AssignHRPopup")); }).then(function (module) { return ({
    default: module.AssignHRPopup,
}); }); });
var RecruitmentTable = function () {
    var _a;
    var _b = (0, useTabDetails_1.useTabDetails)(), tabs = _b.tabs, tabsLoading = _b.loading;
    var activeTab = (0, UIStateContext_1.useUIState)().activeTab;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _c = (0, react_1.useState)(activeTab), activeTabKey = _c[0], setActiveTabKey = _c[1];
    var _d = (0, useRecruitmentDetails_1.useRecruitmentDetails)(activeTabKey), items = _d.items, tableLoading = _d.loading;
    var _e = (0, UIStateContext_1.useUIState)(), matricID = _e.MatricID, setMatricID = _e.setMatricID;
    var _f = (0, RoleContext_1.userInfo)(), roleIDs = _f.roleIDs, ADGroupData = _f.ADGroupData;
    var _g = (0, useStateFromManage_1.useStateFromManage)(), drawerOpen = _g.drawerOpen, selectedJobId = _g.selectedJobId, advertLanguage = _g.advertLanguage, reviewerComments = _g.reviewerComments, acknowledgementCheckbox = _g.acknowledgementCheckbox, loadingState = _g.loadingState, openDrawer = _g.openDrawer, closeDrawer = _g.closeDrawer, setAdvertLanguage = _g.setAdvertLanguage, setComments = _g.setComments, toggleAcknowledgement = _g.toggleAcknowledgement, setLoadingState = _g.setLoadingState;
    var _h = (0, react_1.useState)([]), selectedIds = _h[0], setSelectedIds = _h[1];
    var _j = (0, react_1.useState)(0), selectedMemberId = _j[0], setSelectedMemberId = _j[1];
    var _k = (0, react_1.useState)(false), isPopupOpen = _k[0], setIsPopupOpen = _k[1];
    var _l = (0, react_1.useState)(10), pageSize = _l[0], setPageSize = _l[1];
    var _m = (0, react_1.useState)(1), currentPage = _m[0], setCurrentPage = _m[1];
    var _o = (0, react_1.useState)(false), isopenDrawer = _o[0], setIsopenDrawer = _o[1];
    var _p = (0, react_1.useState)(""), selectedType = _p[0], setSelectedType = _p[1];
    var _q = (0, react_1.useState)(""), selectedNationality = _q[0], setSelectedNationality = _q[1];
    var Submitted = (0, react_1.useRef)(false);
    var _r = (0, useToast_1.useToast)(), toast = _r.toast, closeToast = _r.closeToast, showSuccess = _r.showSuccess, showError = _r.showError, showWarning = _r.showWarning, showConfirm = _r.showConfirm;
    var selectedItems = (0, react_1.useMemo)(function () { return items.filter(function (item) { return selectedIds.includes(item.id); }); }, [items, selectedIds]);
    var selectedJobCode = (0, react_1.useMemo)(function () { var _a; return selectedItems.length === 1 ? (_a = selectedItems[0]) === null || _a === void 0 ? void 0 : _a.jobCode : ""; }, [selectedItems]);
    var _s = (0, useAssignMembers_1.useAssignMembers)(selectedNationality), members = _s.members, membersLoading = _s.loading;
    (0, react_1.useEffect)(function () {
        if (!tabs.length) {
            return;
        }
        var exists = tabs.some(function (tab) { return tab.key === activeTabKey; });
        if (!exists) {
            setActiveTabKey(tabs[0].key);
        }
    }, [activeTabKey, tabs]);
    var activeTabs = (0, react_1.useMemo)(function () { return tabs.find(function (tab) { return tab.key === activeTabKey; }); }, [activeTabKey, tabs]);
    var selectedMember = (0, react_1.useMemo)(function () { var _a; return (_a = members.find(function (member) { return member.id === selectedMemberId; })) !== null && _a !== void 0 ? _a : null; }, [members, selectedMemberId]);
    var handleTabChange = (0, react_1.useCallback)(function (tab) {
        setActiveTabKey(tab.key);
        setSelectedIds([]);
        setSelectedMemberId(0);
        setCurrentPage(1);
        setMatricID(tab.matricId);
    }, []);
    var handleToggleRow = (0, react_1.useCallback)(function (id) {
        setSelectedIds(function (prev) { return (prev.includes(id) ? prev.filter(function (itemId) { return itemId !== id; }) : tslib_1.__spreadArray(tslib_1.__spreadArray([], prev, true), [id], false)); });
    }, []);
    var totalCount = items.length;
    var totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    var paginatedItems = (0, react_1.useMemo)(function () {
        var start = (currentPage - 1) * pageSize;
        return items.slice(start, start + pageSize);
    }, [currentPage, items, pageSize]);
    (0, react_1.useEffect)(function () {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);
    var handleToggleAll = (0, react_1.useCallback)(function () {
        var currentPageIds = paginatedItems.map(function (item) { return item.id; });
        var allSelectedOnPage = currentPageIds.length > 0 && currentPageIds.every(function (id) { return selectedIds.includes(id); });
        setSelectedIds(function (prev) {
            if (allSelectedOnPage) {
                return prev.filter(function (id) { return !currentPageIds.includes(id); });
            }
            var merged = new Set(tslib_1.__spreadArray(tslib_1.__spreadArray([], prev, true), currentPageIds, true));
            return Array.from(merged);
        });
    }, [paginatedItems, selectedIds]);
    var handleAction = (0, react_1.useCallback)(function (item) {
        var actionLabel = (activeTabs === null || activeTabs === void 0 ? void 0 : activeTabs.actionMode) === "Upload" ? "Upload" : "View";
        var message = "".concat(actionLabel, " action clicked for ").concat(item.jobCode);
        if (matricID == ConditionConfig_1.MatricID.InterviewQuestionHR || matricID == ConditionConfig_1.MatricID.InterviewQuestionLM) {
            navigate("/QuestionCreation");
        }
        else if (matricID == ConditionConfig_1.MatricID.ReviewProfile || matricID == ConditionConfig_1.MatricID.AssignInterviewPanel || matricID == ConditionConfig_1.MatricID.ReviewScoreCard) {
            navigate("/CandidateTable");
        }
        openDrawer(item.ItemID);
        setIsopenDrawer(true);
        setSelectedType(item.requestType);
        setSelectedNationality(item.nationality);
    }, [activeTabs === null || activeTabs === void 0 ? void 0 : activeTabs.actionMode, openDrawer]);
    var handleOpenPopup = (0, react_1.useCallback)(function () {
        setIsPopupOpen(true);
    }, []);
    var handleClosePopup = (0, react_1.useCallback)(function () {
        setIsPopupOpen(false);
    }, []);
    var handleConfirmAssignment = (0, react_1.useCallback)(function (payload) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var isHRLead, userIDResult_1, _a, vacancyDetailResults, unresolved, batchPayloads, batchResponse, error_1;
        var _b, _c;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    Submitted.current = true;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 8, 9, 10]);
                    isHRLead = roleIDs.includes(Config_1.RoleID.RecruitmentHRLead);
                    if (!isHRLead) return [3 /*break*/, 3];
                    return [4 /*yield*/, ServiceExport_1.CommonServices.getUserIDByEmail((_c = Number((_b = payload.member) === null || _b === void 0 ? void 0 : _b.id)) !== null && _c !== void 0 ? _c : 0)];
                case 2:
                    _a = _d.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = null;
                    _d.label = 4;
                case 4:
                    userIDResult_1 = _a;
                    if (!isHRLead) return [3 /*break*/, 7];
                    return [4 /*yield*/, Promise.all(payload.vacancies.map(function (vacancy) {
                            var filter = [{
                                    FilterName: "ID",
                                    FilterOperator: "eq",
                                    FilterValue: vacancy.ItemID,
                                }];
                            return ServiceExport_1.RecruitmentServices.GetNPAEPVRRDetails(filter, "and", vacancy.requestType)
                                .then(function (res) {
                                var _a, _b;
                                return ({
                                    vacancy: vacancy,
                                    jobDetail: (_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : null,
                                });
                            });
                        }))];
                case 5:
                    vacancyDetailResults = _d.sent();
                    unresolved = vacancyDetailResults.filter(function (r) { return !r.jobDetail; });
                    if (unresolved.length) {
                        console.warn("Unresolved job details:", unresolved);
                        // showAlert(RecuritmentHRMsg.APIErrorMsg, HRMSAlertOptions.Error);
                        return [2 /*return*/];
                    }
                    batchPayloads = vacancyDetailResults.map(function (_a) {
                        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
                        var vacancy = _a.vacancy, jobDetail = _a.jobDetail;
                        return ({
                            Data: {
                                BusinessUnitCodeId: jobDetail.BusinessUnitCodeId,
                                Nationality: jobDetail.Nationality,
                                EmploymentCategory: jobDetail.EmploymentCategory,
                                DepartmentId: jobDetail.DepartmentId,
                                SubDepartmentId: jobDetail.SubDepartmentId,
                                SectionId: jobDetail.SectionId,
                                DepartmentCodeId: jobDetail.DepartmentCodeId,
                                NumberOfPersonNeeded: Number(jobDetail.NumberOfPersonNeeded),
                                EnterNumberOfMonths: (_b = jobDetail.EnterNumberOfMonths) !== null && _b !== void 0 ? _b : "0",
                                TypeOfContract: jobDetail.TypeOfContract,
                                DateRequried: (_c = jobDetail.DateRequried) !== null && _c !== void 0 ? _c : null,
                                StatusId: Config_1.StatusId.HRLeadtoAssignRecruitmentHR,
                                ActionId: Config_1.WorkflowAction.Approved,
                                JobCodeId: jobDetail.JobCodeId,
                                AreaofWork: jobDetail.AreaofWork,
                                AssignedHR: userIDResult_1.data,
                                RecruitmentHRLead: Array.isArray(ADGroupData.EmailId) ? ((_d = ADGroupData.EmailId[0]) !== null && _d !== void 0 ? _d : "") : ((_e = ADGroupData.EmailId) !== null && _e !== void 0 ? _e : ""),
                                DataFrom: (_f = jobDetail.Type) !== null && _f !== void 0 ? _f : "",
                                Location: (_g = jobDetail.Location) !== null && _g !== void 0 ? _g : "",
                            },
                            PositionData: {
                                PatersonGradeId: (_h = jobDetail.PatersonGradeId) !== null && _h !== void 0 ? _h : 0,
                                DRCGradeId: (_j = jobDetail.DRCGradeId) !== null && _j !== void 0 ? _j : 0,
                                JobTitleEnglishId: (_k = jobDetail.JobTitleEnglishId) !== null && _k !== void 0 ? _k : 0,
                                JobTitleFrenchId: (_l = jobDetail.JobTitleFrenchId) !== null && _l !== void 0 ? _l : 0,
                            },
                            CommentsList: {
                                RoleId: roleIDs[0],
                                RecruitmentIDId: 0,
                                Comments: (_m = payload.comments) !== null && _m !== void 0 ? _m : "",
                            },
                            updatePreList: {
                                ID: (_o = vacancy.ItemID) !== null && _o !== void 0 ? _o : 0,
                                ActionId: Config_1.WorkflowAction.Approved,
                                ItemCreated: "Yes",
                                IsDataSyncToRecruitment: "No",
                            },
                        });
                    });
                    return [4 /*yield*/, ServiceExport_1.RecruitmentServices.InsertRecruitmentDptBatch(batchPayloads)];
                case 6:
                    batchResponse = _d.sent();
                    if (batchResponse.status === ApiConfig_1.ResponeStatus.SUCCESS) {
                        setIsPopupOpen(false);
                        setSelectedIds([]);
                        setSelectedMemberId(0);
                        showSuccess("Assign HR Successfully");
                        navigate("/RecruitmentTable");
                    }
                    else {
                        showError("Something went wrong. Please try again.");
                    }
                    return [3 /*break*/, 7];
                case 7:
                    // ── 6. Success ─────────────────────────────────────────────────────────
                    // showAlert(
                    //   payload.vacancies.length === 1
                    //     ? RecuritmentHRMsg.SingleHRSuccessMsg
                    //     : RecuritmentHRMsg.HRSuccess,
                    //   HRMSAlertOptions.Success,
                    //   () => {
                    //     setAssignDialogOpen(false);
                    //     clearSelection();
                    //     refreshData();
                    //     closeAlert();
                    //   }
                    // );
                    setIsPopupOpen(false);
                    setSelectedIds([]);
                    setSelectedMemberId(0);
                    return [3 /*break*/, 10];
                case 8:
                    error_1 = _d.sent();
                    console.error("Critical error during submission:", error_1);
                    return [3 /*break*/, 10];
                case 9: return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); }, [roleIDs, ADGroupData, setLoadingState]);
    var showAssignmentBar = (activeTabs === null || activeTabs === void 0 ? void 0 : activeTabs.tableMode) === "checkbox" && selectedIds.length > 0;
    var actionMode = (_a = activeTabs === null || activeTabs === void 0 ? void 0 : activeTabs.actionMode) !== null && _a !== void 0 ? _a : "View";
    var columns = (0, react_1.useMemo)(function () { return [
        {
            id: "jobCode",
            header: "Job Code",
            accessor: "jobCode",
            cellClassName: "data-table__cell--muted",
        },
        {
            id: "title",
            header: "Job Title & Dept",
            render: function (item) { return (react_1.default.createElement("div", { className: "data-table__job-title" },
                react_1.default.createElement("span", null, item.title),
                react_1.default.createElement("span", { className: "data-table__job-dept" }, item.department))); },
        },
        {
            id: "count",
            header: "Count",
            render: function (item) { return String(item.count).padStart(2, "0"); },
            cellClassName: "data-table__cell--count",
            align: "center",
            hideOnMobile: true,
        },
        {
            id: "requestType",
            header: "Request Type",
            accessor: "requestType",
            cellClassName: "data-table__cell--muted",
            hideOnMobile: true,
        },
        {
            id: "nationality",
            header: "Nationality",
            accessor: "nationality",
            cellClassName: "data-table__cell--muted",
            hideOnMobile: true,
        },
        {
            id: "status",
            header: "Status",
            render: function (item) { return react_1.default.createElement("span", { className: "data-table__status-badge status-badge" }, item.status); },
        },
        {
            id: "actions",
            header: "Actions",
            align: "right",
            cellClassName: "data-table__cell--actions",
            render: function (item) { return (react_1.default.createElement("button", { className: "data-table__action-btn", onClick: function () { return handleAction(item); }, type: "button", "aria-label": actionMode === "Upload" ? "Upload document" : "View vacancy" },
                actionMode === "Upload" ? react_1.default.createElement(lucide_react_1.Upload, { size: 16 }) : react_1.default.createElement(lucide_react_1.Eye, { size: 16 }),
                actionMode === "Upload" ? "Upload" : "View")); },
        },
    ]; }, [actionMode, handleAction]);
    return (react_1.default.createElement("section", { className: "recruitment-table" },
        react_1.default.createElement("div", { className: "recruitment-table__tabs" },
            react_1.default.createElement(Tabs_1.default, { tabs: tabs, activeKey: activeTabKey, onChange: handleTabChange, loading: tabsLoading, variant: "boxed" })),
        react_1.default.createElement("div", { className: "recruitment-table__table-card" },
            react_1.default.createElement(DataTable_1.DataTable, { columns: columns, data: paginatedItems, enableCheckbox: (activeTabs === null || activeTabs === void 0 ? void 0 : activeTabs.tableMode) === "checkbox", selectedRowIds: selectedIds, getRowId: function (item) { return item.id; }, onToggleRow: handleToggleRow, onToggleAll: handleToggleAll, pageSize: pageSize, currentPage: currentPage, totalCount: totalCount, onPageChange: setCurrentPage, onPageSizeChange: function (size) {
                    setPageSize(size);
                    setCurrentPage(1);
                }, loading: tableLoading })),
        showAssignmentBar && (react_1.default.createElement("div", { className: "assignment" },
            react_1.default.createElement("div", { className: "assignment-bar" },
                react_1.default.createElement("div", { className: "assignment-bar__left" },
                    react_1.default.createElement("div", { className: "assignment-bar__icon" },
                        react_1.default.createElement(lucide_react_1.Users, { size: 18 })),
                    react_1.default.createElement("div", { className: "assignment-bar__count" },
                        react_1.default.createElement("strong", null, selectedIds.length),
                        react_1.default.createElement("span", null, "Vacancies Selected"))),
                react_1.default.createElement("div", { className: "assignment-bar__controls" },
                    react_1.default.createElement("select", { className: "assignment-bar__select", value: selectedMemberId, onChange: function (event) { return setSelectedMemberId(Number(event.target.value)); }, disabled: membersLoading },
                        react_1.default.createElement("option", { value: "" }, "Choose HR member"),
                        members.map(function (member) { return (react_1.default.createElement("option", { key: member.id, value: member.id },
                            member.name,
                            " - ",
                            member.role)); })),
                    react_1.default.createElement("button", { className: "assignment-bar__button", type: "button", onClick: handleOpenPopup, disabled: !selectedMemberId },
                        "Execute Assignment",
                        react_1.default.createElement(lucide_react_1.ChevronRight, { size: 16 })))))),
        isPopupOpen && (react_1.default.createElement(react_1.Suspense, { fallback: null },
            react_1.default.createElement(AssignHRPopup, { isOpen: isPopupOpen, selectedItems: selectedItems, assignedMember: selectedMember, onClose: handleClosePopup, onConfirm: handleConfirmAssignment }))),
        isopenDrawer && (react_1.default.createElement(AdvertReviewDrawer_1.AdvertReviewDrawer, { drawerOpen: drawerOpen, selectedJobId: selectedJobId, selectedJobCode: selectedJobCode, selectedType: selectedType, advertLanguage: advertLanguage, reviewerComments: reviewerComments, acknowledgementCheckbox: acknowledgementCheckbox, loadingState: loadingState, onClose: closeDrawer, onLanguageChange: setAdvertLanguage, onCommentsChange: setComments, onToggleAcknowledgement: toggleAcknowledgement, setLoadingState: setLoadingState })),
        toast.open && (react_1.default.createElement(SuccessToast_1.SuccessToast, { show: toast.open, type: toast.type, title: toast.title, message: toast.message, autoDismiss: toast.autoDismiss, autoDismissDuration: toast.autoDismissDuration, onClose: closeToast }))));
};
exports.RecruitmentTable = RecruitmentTable;
//# sourceMappingURL=RecruitmentTable.js.map