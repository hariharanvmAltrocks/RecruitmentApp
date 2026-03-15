"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecruitmentTable = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var CheckboxDataTable_1 = require("./Components/DataTable/CheckboxDataTable");
var NormalDataTable_1 = require("./Components/DataTable/NormalDataTable");
var useAssignMembers_1 = require("./Hooks/useAssignMembers");
var useRecruitmentDetails_1 = require("./Hooks/useRecruitmentDetails");
var useTabDetails_1 = require("./Hooks/useTabDetails");
var AdvertReviewDrawer_1 = require("./AdvertReviewDrawer/AdvertReviewDrawer");
var useStateFromManage_1 = require("./AdvertReviewDrawer/StateManage/useStateFromManage");
require("./RecruitmentTable.scss");
var AssignHRPopup = react_1.default.lazy(function () { return Promise.resolve().then(function () { return tslib_1.__importStar(require("./Components/AssignHRPopup/AssignHRPopup")); }).then(function (module) { return ({
    default: module.AssignHRPopup,
}); }); });
var RecruitmentTable = function () {
    var _a;
    var _b = (0, useTabDetails_1.useTabDetails)(), tabs = _b.tabs, tabsLoading = _b.loading;
    var _c = (0, react_1.useState)("mySubmission"), activeTabKey = _c[0], setActiveTabKey = _c[1];
    var _d = (0, useRecruitmentDetails_1.useRecruitmentDetails)(activeTabKey), items = _d.items, tableLoading = _d.loading;
    var _e = (0, useAssignMembers_1.useAssignMembers)(), members = _e.members, membersLoading = _e.loading;
    var _f = (0, useStateFromManage_1.useStateFromManage)(), drawerOpen = _f.drawerOpen, selectedJobId = _f.selectedJobId, advertLanguage = _f.advertLanguage, reviewerComments = _f.reviewerComments, acknowledgementCheckbox = _f.acknowledgementCheckbox, loadingState = _f.loadingState, openDrawer = _f.openDrawer, closeDrawer = _f.closeDrawer, setAdvertLanguage = _f.setAdvertLanguage, setComments = _f.setComments, toggleAcknowledgement = _f.toggleAcknowledgement, setLoadingState = _f.setLoadingState;
    var _g = (0, react_1.useState)([]), selectedIds = _g[0], setSelectedIds = _g[1];
    var _h = (0, react_1.useState)(""), selectedMemberId = _h[0], setSelectedMemberId = _h[1];
    var _j = (0, react_1.useState)(false), isPopupOpen = _j[0], setIsPopupOpen = _j[1];
    (0, react_1.useEffect)(function () {
        if (!tabs.length) {
            return;
        }
        var exists = tabs.some(function (tab) { return tab.key === activeTabKey; });
        if (!exists) {
            setActiveTabKey(tabs[0].key);
        }
    }, [activeTabKey, tabs]);
    var activeTab = (0, react_1.useMemo)(function () { return tabs.find(function (tab) { return tab.key === activeTabKey; }); }, [activeTabKey, tabs]);
    var selectedItems = (0, react_1.useMemo)(function () { return items.filter(function (item) { return selectedIds.includes(item.id); }); }, [items, selectedIds]);
    var selectedMember = (0, react_1.useMemo)(function () { var _a; return (_a = members.find(function (member) { return member.id === selectedMemberId; })) !== null && _a !== void 0 ? _a : null; }, [members, selectedMemberId]);
    var handleTabChange = (0, react_1.useCallback)(function (key) {
        setActiveTabKey(key);
        setSelectedIds([]);
        setSelectedMemberId("");
    }, []);
    var handleToggleRow = (0, react_1.useCallback)(function (id) {
        setSelectedIds(function (prev) { return (prev.includes(id) ? prev.filter(function (itemId) { return itemId !== id; }) : tslib_1.__spreadArray(tslib_1.__spreadArray([], prev, true), [id], false)); });
    }, []);
    var handleToggleAll = (0, react_1.useCallback)(function () {
        setSelectedIds(function (prev) { return (prev.length === items.length ? [] : items.map(function (item) { return item.id; })); });
    }, [items]);
    var handleAction = (0, react_1.useCallback)(function (item) {
        var actionLabel = (activeTab === null || activeTab === void 0 ? void 0 : activeTab.actionMode) === "upload" ? "Upload" : "View";
        var message = "".concat(actionLabel, " action clicked for ").concat(item.jobCode);
        // eslint-disable-next-line no-console
        console.info(message);
        openDrawer(item.id);
    }, [activeTab === null || activeTab === void 0 ? void 0 : activeTab.actionMode, openDrawer]);
    var handleOpenPopup = (0, react_1.useCallback)(function () {
        setIsPopupOpen(true);
    }, []);
    var handleClosePopup = (0, react_1.useCallback)(function () {
        setIsPopupOpen(false);
    }, []);
    var handleConfirmAssignment = (0, react_1.useCallback)(function (payload) {
        // eslint-disable-next-line no-console
        console.info("Assignment submitted", payload);
        setIsPopupOpen(false);
        setSelectedIds([]);
        setSelectedMemberId("");
    }, []);
    var showAssignmentBar = (activeTab === null || activeTab === void 0 ? void 0 : activeTab.tableMode) === "checkbox" && selectedIds.length > 0;
    return (react_1.default.createElement("section", { className: "recruitment-table" },
        react_1.default.createElement("div", { className: "recruitment-table__tabs" },
            (tabsLoading ? [] : tabs).map(function (tab) { return (react_1.default.createElement("button", { key: tab.key, className: "recruitment-table__tab ".concat(tab.key === activeTabKey ? "recruitment-table__tab--active" : "").trim(), type: "button", onClick: function () { return handleTabChange(tab.key); } }, tab.label)); }),
            tabsLoading && (react_1.default.createElement("div", { className: "recruitment-table__tabs-loading" }, "Loading tabs..."))),
        react_1.default.createElement("div", { className: "recruitment-table__table-card" }, (activeTab === null || activeTab === void 0 ? void 0 : activeTab.tableMode) === "checkbox" ? (react_1.default.createElement(CheckboxDataTable_1.CheckboxDataTable, { items: items, loading: tableLoading, selectedIds: selectedIds, actionMode: activeTab.actionMode, onToggleRow: handleToggleRow, onToggleAll: handleToggleAll, onAction: handleAction })) : (react_1.default.createElement(NormalDataTable_1.NormalDataTable, { items: items, loading: tableLoading, actionMode: (_a = activeTab === null || activeTab === void 0 ? void 0 : activeTab.actionMode) !== null && _a !== void 0 ? _a : "view", onAction: handleAction }))),
        showAssignmentBar && (react_1.default.createElement("div", { className: "assignment-bar" },
            react_1.default.createElement("div", { className: "assignment-bar__left" },
                react_1.default.createElement("div", { className: "assignment-bar__icon" },
                    react_1.default.createElement(lucide_react_1.Users, { size: 18 })),
                react_1.default.createElement("div", { className: "assignment-bar__count" },
                    react_1.default.createElement("strong", null, selectedIds.length),
                    react_1.default.createElement("span", null, "Vacancies Selected"))),
            react_1.default.createElement("div", { className: "assignment-bar__controls" },
                react_1.default.createElement("select", { className: "assignment-bar__select", value: selectedMemberId, onChange: function (event) { return setSelectedMemberId(event.target.value); }, disabled: membersLoading },
                    react_1.default.createElement("option", { value: "" }, "Select HR member"),
                    members.map(function (member) { return (react_1.default.createElement("option", { key: member.id, value: member.id },
                        member.name,
                        " - ",
                        member.role)); })),
                react_1.default.createElement("button", { className: "assignment-bar__button", type: "button", onClick: handleOpenPopup, disabled: !selectedMemberId },
                    "Execute Assignment",
                    react_1.default.createElement(lucide_react_1.ChevronRight, { size: 16 }))))),
        isPopupOpen && (react_1.default.createElement(react_1.Suspense, { fallback: null },
            react_1.default.createElement(AssignHRPopup, { isOpen: isPopupOpen, selectedItems: selectedItems, assignedMember: selectedMember, onClose: handleClosePopup, onConfirm: handleConfirmAssignment }))),
        react_1.default.createElement(AdvertReviewDrawer_1.AdvertReviewDrawer, { drawerOpen: drawerOpen, selectedJobId: selectedJobId, advertLanguage: advertLanguage, reviewerComments: reviewerComments, acknowledgementCheckbox: acknowledgementCheckbox, loadingState: loadingState, onClose: closeDrawer, onLanguageChange: setAdvertLanguage, onCommentsChange: setComments, onToggleAcknowledgement: toggleAcknowledgement, setLoadingState: setLoadingState })));
};
exports.RecruitmentTable = RecruitmentTable;
//# sourceMappingURL=RecruitmentTable.js.map