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
var ConditionConfig_1 = require("../../../utilities/ConditionConfig");
var react_router_dom_1 = require("react-router-dom");
var config_1 = require("./config");
var ModalPopup_1 = require("../../Comman/ModalPopup/ModalPopup");
var Useconfirmassignment_1 = require("./Hooks/Useconfirmassignment");
var useModalPopup_1 = require("../../Comman/ModalPopup/useModalPopup");
var Tabs_1 = tslib_1.__importDefault(require("../../Comman/Tabs/Tabs"));
var AssignHRPopup = react_1.default.lazy(function () {
    return Promise.resolve().then(function () { return tslib_1.__importStar(require("./Components/AssignHRPopup/AssignHRPopup")); }).then(function (module) { return ({
        default: module.AssignHRPopup,
    }); });
});
var RecruitmentTable = function () {
    var _a;
    var _b = (0, useTabDetails_1.useTabDetails)(), tabs = _b.tabs, tabsLoading = _b.loading;
    var activeTab = (0, UIStateContext_1.useUIState)().activeTab;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _c = (0, react_1.useState)(activeTab), activeTabKey = _c[0], setActiveTabKey = _c[1];
    var _d = (0, react_1.useState)(0), refreshKey = _d[0], setRefreshKey = _d[1];
    var handleRefresh = (0, react_1.useCallback)(function () { return setRefreshKey(function (k) { return k + 1; }); }, []);
    var _e = (0, useRecruitmentDetails_1.useRecruitmentDetails)(activeTabKey, refreshKey), items = _e.items, tableLoading = _e.loading;
    var _f = (0, UIStateContext_1.useUIState)(), matricID = _f.MatricID, setMatricID = _f.setMatricID, sideNavflag = _f.sideNavflag, setCurrentTabName = _f.setCurrentTabName, currentTabName = _f.currentTabName;
    var _g = (0, useStateFromManage_1.useStateFromManage)(), drawerOpen = _g.drawerOpen, selectedJobId = _g.selectedJobId, advertLanguage = _g.advertLanguage, reviewerComments = _g.reviewerComments, acknowledgementCheckbox = _g.acknowledgementCheckbox, loadingState = _g.loadingState, openDrawer = _g.openDrawer, closeDrawer = _g.closeDrawer, setAdvertLanguage = _g.setAdvertLanguage, setComments = _g.setComments, toggleAcknowledgement = _g.toggleAcknowledgement, setLoadingState = _g.setLoadingState;
    var drawerMeta = (0, react_1.useRef)({
        isOpen: false,
        selectedType: "",
    });
    var _h = (0, react_1.useState)(false), isPopupOpen = _h[0], setIsPopupOpen = _h[1];
    var handleClosePopup = (0, react_1.useCallback)(function () { return setIsPopupOpen(false); }, []);
    var _j = (0, Useconfirmassignment_1.useConfirmAssignment)(handleClosePopup, handleRefresh), handleConfirmAssignment = _j.handleConfirmAssignment, assignmentModalState = _j.modalState, assignmentCloseModal = _j.closeModal;
    var _k = (0, useModalPopup_1.useModalPopup)(), modalState = _k.modalState, showModal = _k.showModal, closeModal = _k.closeModal;
    var _l = (0, react_1.useState)([]), selectedIds = _l[0], setSelectedIds = _l[1];
    var _m = (0, react_1.useState)(0), selectedMemberId = _m[0], setSelectedMemberId = _m[1];
    var _o = (0, react_1.useState)(5), pageSize = _o[0], setPageSize = _o[1];
    var _p = (0, react_1.useState)(1), currentPage = _p[0], setCurrentPage = _p[1];
    var selectedItems = (0, react_1.useMemo)(function () { return items.filter(function (item) { return selectedIds.includes(item.id); }); }, [items, selectedIds]);
    var selectedJobCode = (0, react_1.useMemo)(function () { var _a; return (selectedItems.length === 1 ? (_a = selectedItems[0]) === null || _a === void 0 ? void 0 : _a.jobCode : ""); }, [selectedItems]);
    var selectedNationality = (0, react_1.useMemo)(function () { var _a; return (selectedItems.length === 1 ? (_a = selectedItems[0]) === null || _a === void 0 ? void 0 : _a.nationality : ""); }, [selectedItems]);
    var _q = (0, useAssignMembers_1.useAssignMembers)(selectedNationality), members = _q.members, membersLoading = _q.loading;
    var selectedMember = (0, react_1.useMemo)(function () { var _a; return (_a = members.find(function (m) { return m.id === selectedMemberId; })) !== null && _a !== void 0 ? _a : null; }, [members, selectedMemberId]);
    var activeTabs = (0, react_1.useMemo)(function () { return tabs.find(function (tab) { return tab.key === activeTabKey; }); }, [activeTabKey, tabs]);
    (0, react_1.useEffect)(function () {
        var _a, _b;
        if (sideNavflag && tabs.length > 0 && !currentTabName) {
            setMatricID(tabs[0].matricId);
            setCurrentTabName((_b = (_a = tabs[1]) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : "");
        }
    }, [tabs]);
    (0, react_1.useEffect)(function () {
        if (!tabs.length)
            return;
        var exists = tabs.some(function (tab) { return tab.key === activeTabKey; });
        if (!exists)
            setActiveTabKey(tabs[0].key);
    }, [activeTabKey, tabs]);
    var totalCount = items.length;
    var totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    var paginatedItems = (0, react_1.useMemo)(function () {
        var start = (currentPage - 1) * pageSize;
        return items.slice(start, start + pageSize);
    }, [currentPage, items, pageSize]);
    (0, react_1.useEffect)(function () {
        if (currentPage > totalPages)
            setCurrentPage(totalPages);
    }, [currentPage, totalPages]);
    var handleTabChange = (0, react_1.useCallback)(function (tab) {
        setActiveTabKey(tab.key);
        setSelectedIds([]);
        setSelectedMemberId(0);
        setCurrentPage(1);
        setMatricID(tab.matricId);
        setCurrentTabName(tab.description);
    }, [setMatricID, setCurrentTabName]);
    var handleToggleRow = (0, react_1.useCallback)(function (id) {
        if (selectedNationality) {
            var item = items.find(function (i) { return i.id === id; });
            if ((item === null || item === void 0 ? void 0 : item.nationality) !== selectedNationality) {
                showModal({
                    type: "warning",
                    title: "Nationality Mismatch",
                    message: "You cannot assign HR for different nationality.",
                    confirmLabel: "OK",
                    onConfirm: closeModal,
                });
                return;
            }
        }
        setSelectedIds(function (prev) {
            return prev.includes(id) ? prev.filter(function (itemId) { return itemId !== id; }) : tslib_1.__spreadArray(tslib_1.__spreadArray([], prev, true), [id], false);
        });
    }, [selectedNationality, items, showModal, closeModal]);
    var handleToggleAll = (0, react_1.useCallback)(function () {
        var pageIds = paginatedItems.map(function (item) { return item.id; });
        var allSelected = pageIds.length > 0 && pageIds.every(function (id) { return selectedIds.includes(id); });
        setSelectedIds(function (prev) {
            return allSelected
                ? prev.filter(function (id) { return !pageIds.includes(id); })
                : Array.from(new Set(tslib_1.__spreadArray(tslib_1.__spreadArray([], prev, true), pageIds, true)));
        });
    }, [paginatedItems, selectedIds]);
    var handleAction = (0, react_1.useCallback)(function (item) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var ItemID, requestType, routeMap, route;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            ItemID = item.ItemID, requestType = item.requestType;
            if (matricID === ConditionConfig_1.MatricID.EvalutionHR) {
                navigate("/Evalution");
                return [2 /*return*/];
            }
            routeMap = (_a = {},
                _a[ConditionConfig_1.MatricID.InterviewQuestionHR] = "/QuestionCreation",
                _a[ConditionConfig_1.MatricID.InterviewQuestionLM] = "/QuestionCreation",
                _a[ConditionConfig_1.MatricID.ReviewProfileHR] = "/CandidateTable",
                _a[ConditionConfig_1.MatricID.ReviewProfileLM] = "/CandidateTable",
                _a[ConditionConfig_1.MatricID.AssignInterviewPanel] = "/CandidateTable",
                _a[ConditionConfig_1.MatricID.ReviewScoreCard] = "/CandidateTable",
                _a[ConditionConfig_1.MatricID.EvalutionHR] = "/Evalution",
                _a[ConditionConfig_1.MatricID.EvalutionLM] = "/Evalution",
                _a[ConditionConfig_1.MatricID.ReviewScoreCard] = "/ReviewScoreCard",
                _a);
            route = routeMap[matricID];
            if (route) {
                navigate(route, { state: { ID: ItemID } });
                return [2 /*return*/];
            }
            drawerMeta.current = { isOpen: true, selectedType: requestType };
            openDrawer(ItemID);
            return [2 /*return*/];
        });
    }); }, [matricID, navigate, openDrawer]);
    var showAssignmentBar = (activeTabs === null || activeTabs === void 0 ? void 0 : activeTabs.tableMode) === "checkbox" && selectedIds.length > 0;
    var columns = (0, config_1.useRecruitmentColumns)({
        role: matricID === ConditionConfig_1.MatricID.EvalutionHR ? "evaluation" : "default",
        actionMode: (_a = activeTabs === null || activeTabs === void 0 ? void 0 : activeTabs.actionMode) !== null && _a !== void 0 ? _a : "View",
        onAction: handleAction,
    });
    return (react_1.default.createElement("section", { className: "recruitment-table" },
        react_1.default.createElement("div", { className: "recruitment-table__tabs" },
            react_1.default.createElement(Tabs_1.default, { tabs: tabs, activeKey: activeTabKey, onChange: handleTabChange, loading: tabsLoading, variant: "boxed" })),
        react_1.default.createElement("div", { className: "recruitment-table__table-card" },
            react_1.default.createElement("div", { className: "submission-header" },
                react_1.default.createElement("h2", { className: "submission-header__title" }, currentTabName),
                react_1.default.createElement("div", { className: "submission-header__actions" },
                    react_1.default.createElement("button", { className: "submission-header__refresh-btn", onClick: handleRefresh, disabled: tableLoading, title: "Refresh table", "aria-label": "Refresh table" },
                        react_1.default.createElement(lucide_react_1.RefreshCw, { size: 14, className: tableLoading ? "spin" : undefined }),
                        "Refresh"),
                    react_1.default.createElement("button", { onClick: function () { return navigate("/Dashboard"); }, className: "submission-header__button" },
                        react_1.default.createElement(lucide_react_1.RotateCcw, { size: 14 }),
                        "Back to Dashboard"))),
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
                    react_1.default.createElement("select", { className: "assignment-bar__select", value: selectedMemberId, onChange: function (e) { return setSelectedMemberId(Number(e.target.value)); }, disabled: membersLoading },
                        react_1.default.createElement("option", { value: "" }, "Choose HR member"),
                        members.map(function (member) { return (react_1.default.createElement("option", { key: member.id, value: member.id },
                            member.name,
                            " - ",
                            member.role)); })),
                    react_1.default.createElement("button", { className: "assignment-bar__button", type: "button", onClick: function () { return setIsPopupOpen(true); }, disabled: !selectedMemberId },
                        "Execute Assignment",
                        react_1.default.createElement(lucide_react_1.ChevronRight, { size: 16 })))))),
        isPopupOpen && (react_1.default.createElement(react_1.Suspense, { fallback: null },
            react_1.default.createElement(AssignHRPopup, { isOpen: isPopupOpen, selectedItems: selectedItems, assignedMember: selectedMember, onClose: handleClosePopup, onConfirm: handleConfirmAssignment }))),
        drawerMeta.current.isOpen && (react_1.default.createElement(AdvertReviewDrawer_1.AdvertReviewDrawer, { drawerOpen: drawerOpen, selectedJobId: selectedJobId, selectedJobCode: selectedJobCode, selectedType: drawerMeta.current.selectedType, advertLanguage: advertLanguage, reviewerComments: reviewerComments, acknowledgementCheckbox: acknowledgementCheckbox, loadingState: loadingState, onClose: closeDrawer, onLanguageChange: setAdvertLanguage, onCommentsChange: setComments, onToggleAcknowledgement: toggleAcknowledgement, setLoadingState: setLoadingState, refreshKey: handleRefresh })),
        react_1.default.createElement(ModalPopup_1.ModalPopup, tslib_1.__assign({}, assignmentModalState, { onClose: assignmentCloseModal })),
        react_1.default.createElement(ModalPopup_1.ModalPopup, tslib_1.__assign({}, modalState, { onClose: closeModal }))));
};
exports.RecruitmentTable = RecruitmentTable;
//# sourceMappingURL=RecruitmentTable.js.map